import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Ability, AbilityBuilder, AbilityClass, PureAbility } from '@casl/ability';
import { tap } from 'rxjs';


type AppAbility = PureAbility<[string, string]>;


@Injectable({ providedIn: 'root' })
export class AbilityService {
  private ability!: AppAbility;

  constructor(private http: HttpClient) {}

  loadAbilities() {
    return this.http.get<{ rules: any[] }>('user/abilities').pipe(
      tap(({ rules }) => {
        this.ability = new Ability(rules) as AppAbility;
      })
    );
  }

  getAbility() {
    return this.ability;
  }
}
