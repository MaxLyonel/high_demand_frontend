import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { User } from "../../domain/models/user.model";


interface AppState {
  user: any;
  teacherInfo?: any;
  institutionInfo?: any;
  highDemand?: {
    hasSavedCourses: boolean;
  }
}

const STORAGE_KEY = 'app_state'

@Injectable({ providedIn: 'root'})
export class AppStore {
  private _state = new BehaviorSubject<AppState>(this.loadState())

  state$ = this._state.asObservable()

  constructor() {
    this.state$.subscribe(state => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    })
  }

  get snapshot(): AppState {
    return this._state.getValue()
  }

  private setState(newState: Partial<AppState>) {
    const updatedState = {
      ...this.snapshot,
      ...newState
    };
    this._state.next(updatedState)
  }

  private loadState(): AppState {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored
      ? JSON.parse(stored)
      : {
        user: null,
        teacherInfo: undefined,
        institutionInfo: undefined,
        highDemand: {
          hasSavedCourses: false
        }
      }
  }

  // Métodos de actualización
  setUser(user: User) {
    this.setState({ user })
  }

  setTeacherInfo(info: any) {
    this.setState({ teacherInfo: info })
  }

  setInstitutionInfo(info: any) {
    this.setState({ institutionInfo: info })
  }

  // Guardar el estado de los cursos
  setHighDemandCoursesSaved(hasSaved: boolean) {
    const currentHighDemand = this.snapshot.highDemand || {};
    this.setState({
      highDemand: {
        ...currentHighDemand,
        hasSavedCourses: hasSaved
      }
    });
  }

  // Leer estado
  getHighDemandCoursesSaved(): boolean {
    return this.snapshot.highDemand?.hasSavedCourses ?? false;
  }

  clear() {
    localStorage.removeItem(STORAGE_KEY)
    this._state.next({
      user: null,
      teacherInfo: undefined,
      institutionInfo: undefined
    })
  }
}