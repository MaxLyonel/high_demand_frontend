import { Observable } from "rxjs";


export interface InstitutionInfo {
  id: number;
  name: string;
  state: string;
  scope: string;
  direction: string;
}


export default interface IManagerInstitution {

  getInfo(id: number): Observable<InstitutionInfo>;

}