import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Ability } from '@casl/ability';
import { BehaviorSubject, tap } from 'rxjs';

export type Actions = 'manage' | 'create' | 'read' | 'update' | 'delete';
export type Subjects = any | 'all';

export type AppAbility = Ability<[Actions, Subjects]>;

@Injectable({ providedIn: 'root' })
export class AbilityService {
  private ability!: AppAbility;
  private abilitySubject = new BehaviorSubject<AppAbility | null>(null);

  ability$ = this.abilitySubject.asObservable();

  constructor(private http: HttpClient) {}

  loadAbilities(currentUserId: number) {
    return this.http.get<{ rules: any[] }>('user/abilities').pipe(
      tap(({ rules }) => {
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

        this.ability = new Ability(mappedRules, {
          detectSubjectType: (object: any) => {
            if(!object) return 'all';
            if(typeof object === 'string') return object;
            if('__typename' in object) return object.__typename;
            return 'all';
          }
        }) as AppAbility;

        this.abilitySubject.next(this.ability)
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
    console.log("====================")

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
