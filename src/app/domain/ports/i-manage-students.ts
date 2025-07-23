import { Observable } from "rxjs";
import { Student } from "../models/student";



export default interface IManageStudents {

  getStudents(): Observable<Student[]>
  searchStudent(term: string): Observable<Student[]>
  getStudent(id: number): Observable<Student>
  addStudent(student: Student): Observable<Student>
  updateStudent(student: Student): Observable<Student>
  deleteStudent(id: number): Observable<number>

}
