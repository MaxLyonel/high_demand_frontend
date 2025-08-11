import { Observable } from "rxjs";
import { Teacher } from "../models/teacher.model";

export default interface IManagerTeacher {
  getInfoTeacher(personId: number): Observable<Teacher>;
}