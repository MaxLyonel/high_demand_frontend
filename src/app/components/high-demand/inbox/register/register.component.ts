import { Component, Inject, OnInit } from '@angular/core';
import { NzButtonComponent } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzTagComponent } from 'ng-zorro-antd/tag';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import IPreRegistration from '../../../../domain/ports/i-pre-registration';
import { AppStore } from '../../../../infrastructure/store/app.store';
import IHighDemand from '../../../../domain/ports/i-high-demand';
import { switchMap, finalize } from 'rxjs';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';


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
  representative: any;
  createdAt: Date
}

@Component({
  imports: [
    CommonModule,
    NzTableModule,
    NzIconModule,
    NzButtonComponent,
    NzTagComponent,
    NzTypographyModule,
    NzModalModule,
    NzAlertModule,
    NzToolTipModule
],
  selector: 'register-inbox',
  templateUrl: './register.component.html',
  styleUrl: './register.component.less'
})
export class RegisterInbox implements OnInit {

  preRegistrations: PreRegistration[] = []
  highDemand: any
  loading:boolean = false
  isDocumentVisible = false
  selectedPostulant: any
  sie: any

  pdfUrl: SafeResourceUrl | null = null;

  constructor(
    private readonly appStore: AppStore,
    @Inject('IPreRegistration') private _preRegistration: IPreRegistration,
    @Inject('IHighDemand') private _highDemand: IHighDemand,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    const { institutionInfo } = this.appStore.snapshot
    const { id: sie } = institutionInfo
    this.sie = sie
    this.loadData(sie)
  }

  loadData(sie: number) {
    this.loading = true
    this._highDemand.getHighDemandByInstitution(sie).pipe(
      switchMap(response => {
        this.highDemand = response
        return this._preRegistration.getListPreRegistration(this.highDemand.id)
      })
    ).subscribe({
      next: preRegReponse => {
        this.preRegistrations = preRegReponse.data;
        this.loading = false
      }
    })
  }

  handleCancel(): void {
    this._preRegistration.invalidatePreRegistration(this.selectedPostulant)
      .pipe(
        finalize(() => {
          this.isDocumentVisible = false;
        })
      ).subscribe({
        next: _ => {
          this.loadData(this.sie)
        },
      })
  }

  handleOk(): void {
    this._preRegistration.validatePreRegistration(this.selectedPostulant)
      .pipe(
        finalize(() => {
          this.isDocumentVisible = false
        })
      ).subscribe({
        next: _ => {
          this.loadData(this.sie)
        }
      })
    this.isDocumentVisible = false
  }

  onToogle(preRegistration: any) {
    this.selectedPostulant = preRegistration
    this.isDocumentVisible = true

    const postulantId = preRegistration.postulant.id
    this._preRegistration.downloadBlob(preRegistration.id).subscribe((blob: Blob) => {
      const url = URL.createObjectURL(blob);
      this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
    })
  }

  closeModal() {
    this.isDocumentVisible = false
    this.pdfUrl = null
  }
}