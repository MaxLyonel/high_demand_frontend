import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Ability } from '@casl/ability';
import { tap } from 'rxjs';
import { User } from '../../domain/models/user.model';

export type Actions = 'manage' | 'create' | 'read' | 'update' | 'delete';

// Ejemplo de entidades
// export class User { constructor(public id: number) {} }
export class Post { constructor(public authorId: number) {} }

export type Subjects = any | 'all';
export type AppAbility = Ability<[Actions, Subjects]>;

@Injectable({ providedIn: 'root' })
export class AbilityService {
  private ability!: AppAbility;

  // Mapa de clases a nombres de subject según backend
  private subjectMap = new Map<any, string>([
    [User, 'user'],
    [Post, 'post'],
    // agregar más entidades según sea necesario
  ]);

  constructor(private http: HttpClient) {}

  loadAbilities(currentUserId: number) {
    return this.http.get<{ rules: any[] }>('user/abilities').pipe(
      tap(({ rules }) => {
        // Reemplazar $currentUserId en las condiciones
        const mappedRules = rules.map(rule => {
          if (rule.conditions) {
            const conditionsObj: Record<string, any> = {};
            Object.entries(rule.conditions).forEach(([key, value]) => {
              conditionsObj[key] = value === '$currentUserId' ? currentUserId : value;
            });
            return { ...rule, conditions: conditionsObj };
          }
          return rule;
        });

        // Crear Ability con detectSubjectType genérico
        this.ability = new Ability(mappedRules, {
          detectSubjectType: (object: any) => {
            for (const [cls, name] of this.subjectMap.entries()) {
              if (object instanceof cls) return name;
            }
            return 'all';
          }
        }) as AppAbility;
      })
    );
  }

  getAbility() {
    return this.ability;
  }

  /**
   * Debug para ver por qué can() devuelve true o false
   */
  debugCan(action: Actions, subject: any) {
    if (!this.ability) {
      console.warn('Ability no cargada aún');
      return;
    }

    console.log('=== DEBUG CAN ===');
    console.log('Acción:', action);
    console.log('Objeto:', subject);
    console.log('Resultado can():', this.ability.can(action, subject));

    // Usar detectSubjectType de la ability
    const subjectType = this.ability.detectSubjectType!(subject);

    const rules = this.ability.rulesFor(action, subjectType);

    if (rules.length === 0) {
      console.warn('No hay reglas que apliquen para este action/subject');
    }

    rules.forEach((rule, i) => {
      const matchesConditions = rule.conditions
        ? Object.entries(rule.conditions).every(
            ([key, value]) => (subject as any)[key] === value
          )
        : true;

      console.log(`Regla ${i + 1}:`, rule);
      console.log('¿Condiciones coinciden?', matchesConditions);
    });
  }


}
