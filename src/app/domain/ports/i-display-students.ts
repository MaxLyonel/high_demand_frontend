import { Observable } from "rxjs"
import { Student } from "../models/student"


export default interface IDisplayStudents {
  student: Student[]
  filter: string

  askStudentsList(): Observable<void>
  askStudentsFiltered(filter: string, allowEmpty?: boolean): Observable<void>
  askStudentCreation(studentName: string): Observable<void>
  askStudentDeletion(student: Student): Observable<void>

}