import { Observable } from "rxjs";
import { User } from "../models/user";




export default interface IDisplayUserDetail {

  user: User | undefined

  askUserDetail(id: number): Observable<void>

}