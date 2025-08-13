import { Observable } from "rxjs";
import { Rol } from "./models/rol.model";
import IRoles from "./ports/i-roles";
import { Injectable } from "@angular/core";




@Injectable()
export default class RolManager implements IRoles {
  showRoles(): Observable<Rol[]> {
    throw new Error("Method not implemented.");
  }
}