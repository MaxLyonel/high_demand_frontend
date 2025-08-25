import { Component, importProvidersFrom, Inject, OnInit } from '@angular/core';
import { NzButtonComponent } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzTagComponent } from 'ng-zorro-antd/tag';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import IPreRegistration from '../../../../domain/ports/i-pre-registration';


interface Postulant {
  id: number;
  identityCard: string | null;
  lastName: string;
  mothersLastName: string;
  name: string;
  dateBirth: Date;
  placeBirth: string;
  gender: string | null;
  codeRude: string | null;
  createdAt: Date;
}

interface HighDemandCourse {
  id: number;
  highDemandRegistrationId: number;
  level: {
    id: number;
    name: string;
  },
  grade: {
    id: number;
    name: string;
  }
}

interface PreRegistration {
  id: number
  highDemandCourse: HighDemandCourse;
  postulant: Postulant;
  state: string
  expand: boolean;
  createdAt: Date
}

@Component({
  imports: [
    NzTableModule,
    NzIconModule,
    NzButtonComponent,
    NzTagComponent,
    NzTypographyModule
  ],
  selector: 'register-inbox',
  templateUrl: './register.component.html',
  styleUrl: './register.component.less'
})
export class RegisterInbox implements OnInit {

  preRegistrations: PreRegistration[] = []

  constructor(
    @Inject('IPreRegistration') private _preRegistration: IPreRegistration
  ) {}

  ngOnInit(): void {
    this.loadData()
  }

  loadData() {
    this._preRegistration.getListAccpeted().subscribe(response => {
      console.log("esto se obtiene", response)
      this.preRegistrations = response.data
    })
  }

}