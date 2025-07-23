import { Observable } from "rxjs";
import { Student } from "../models/student";



export default interface IDisplayStudentDetail {

  student: Student | undefined

  askStudentDetail(id: number): Observable<void>
  askStudentNameChange(newStudentName: string): Observable<void>

}