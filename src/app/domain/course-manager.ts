import { Inject, Injectable } from "@angular/core";
import ICourseList from "./ports/i-course-list";
import { Observable } from "rxjs";
import { Level } from "./models/course.model";
import { IManagerInstitutionCourse } from "./ports/i-manager-institution-course";



@Injectable()
export default class CourseManager implements ICourseList {

  constructor(@Inject('IManagerInstitutionCourse') private _institutionCourseAdapter: IManagerInstitutionCourse) {}

  showCourses(sie: number, gestionId: number): Observable<Level[]> {
    const res = this._institutionCourseAdapter.getCourses(sie, gestionId)
    return res
  }

}