import { Observable } from "rxjs";
import { Level } from "../models/course.model";




export default interface ICourseList {

  showCourses(sie: number, gestionId: number): Observable<Level[]>;

}