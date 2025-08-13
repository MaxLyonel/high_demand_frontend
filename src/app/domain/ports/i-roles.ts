import { Observable } from "rxjs";
import { Rol } from "../models/rol.model";



export default interface IRoles {
  showRoles(): Observable<Rol[]>;
}