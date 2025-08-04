import { Injectable } from "@angular/core";
import IDisplayUserDetail from "./ports/i-display-user-detail";
import { Observable } from "rxjs";
import { User } from "./models/user";


@Injectable()
export default class UserDetailDisplayer implements IDisplayUserDetail {
  user: User | undefined = undefined;
  askUserDetail(id: number): Observable<void> {
    throw new Error("Method not implemented.");
  }

}