import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

interface HighDemandState {
  isButtonDisabled: boolean;
  selectedHighDemandId?: number;
}

const STORAGE_KEY = 'high_demand_state'

@Injectable({ providedIn: 'root'})
export class HighDemandStore {
  private _state = new BehaviorSubject<HighDemandState>(this.loadState())
  state$ = this._state.asObservable()

  constructor() {
    this.state$.subscribe(state => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    })
  }

  // Snapshot para leer el estado actual
  get snapshot(): HighDemandState {
    return this._state.getValue()
  }

  private setState(newState: Partial<HighDemandState>) {
    const updatedState = { ...this.snapshot, ...newState }
    this._state.next(updatedState);
  }

  private loadState(): HighDemandState {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : { isButtonDisabled: false }
  }

  setButtonDisabled(value: boolean) {
    this.setState({ isButtonDisabled: value })
  }

  setSelectedHighDemandId(id: number) {
    this.setState({ selectedHighDemandId: id})
  }

  clear() {
    localStorage.removeItem(STORAGE_KEY)
    this._state.next({ isButtonDisabled: false })
  }

}