import { Injectable } from "@angular/core";

@Injectable({ providedIn: 'root'})
export class OperativeService {
  private operative = { currentDate: new Date().toISOString().split('T')[0] }

  getOperative() {
    return this.operative
  }

  refreshDate(date?: string) {
    this.operative.currentDate = date || new Date().toISOString().split('T')[0]
  }
}