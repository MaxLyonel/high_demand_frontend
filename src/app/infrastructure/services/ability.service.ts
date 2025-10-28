import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Ability } from '@casl/ability';
import { BehaviorSubject, tap } from 'rxjs';
import sift from 'sift'
import { OperativeService } from './operative.service';

export type Actions = 'manage' | 'create' | 'read' | 'update' | 'delete' | 'receive' | 'derive' | 'approve' | 'reject';
export type Subjects = any | 'all';

export type AppAbility = Ability<[Actions, Subjects]>;

@Injectable({ providedIn: 'root' })
export class AbilityService {
  private ability!: AppAbility;
  private abilitySubject = new BehaviorSubject<AppAbility | null>(null);

  ability$ = this.abilitySubject.asObservable();

  constructor(
    private http: HttpClient,
    private operativeService: OperativeService
  ) {}

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

  can(action: Actions, subjectObj: any): boolean {
    if (!this.ability) {
      return false;
    }

    const operativeObj = this.operativeService.getOperative();
    const target = { ...subjectObj, ...operativeObj };
    return this.ability.can(action, target);
  }

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

    const subjectType = this.ability.detectSubjectType!(subject);

    const rules = this.ability.rulesFor(action, subjectType);

    if (rules.length === 0) {
      console.warn('No hay reglas que apliquen para este action/subject');
    }

    rules.forEach((rule, i) => {
      let matchesConditions = true;
      if(rule.conditions) {
        matchesConditions = sift(rule.conditions)(subject)
      }
      console.log(`Regla ${i + 1}:`, rule);
      console.log('¿Condiciones coinciden?', matchesConditions);
    });
  }
}
