import { Observable } from "rxjs";
import { Level } from "../models/course.model";



export interface IManagerInstitutionCourse {

  getCourses(sie: number, gestionId: number): Observable<Level[]>;
}