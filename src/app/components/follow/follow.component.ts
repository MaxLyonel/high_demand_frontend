// follow.component.ts
import { Component, Inject, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzMessageService } from 'ng-zorro-antd/message';
import IPreRegistration from '../../domain/ports/i-pre-registration';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { NotificationService } from '../../infrastructure/services/notify.service';
import { NzPopoverDirective, NzPopoverModule } from "ng-zorro-antd/popover";
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { startWith } from 'rxjs';
import { SocketService } from '../../infrastructure/services/socket.service';

interface PreInscription {
  id: number;
  applicationSie: string | number;
  applicationCode: string;
  applicantName: string;
  applicationDate: string;
  institutionName: string;
  educationalLevel: string;
  course: string;
  justification: string;
  status: string;
  statusClass: string;
  identityCard: string;
  postulant: any,
  isUpdated: boolean;
}

@Component({
  selector: 'app-pre-inscription-tracking',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NzCardModule,
    NzInputModule,
    NzButtonModule,
    NzIconModule,
    NzGridModule,
    NzAlertModule,
    NzFormModule,
    NzLayoutModule,
    NzGridModule,
    NzModalModule,
    NzTypographyModule,
    NzRadioModule,
    NzSelectModule,
    NzTableModule,
    NzPopoverModule
],
  templateUrl: './follow.component.html',
  styleUrls: ['./follow.component.less']
})
export default class PreInscriptionTrackingComponent implements OnInit {
  searchTerm: string = '';
  searchResults: PreInscription[] = []
  isLoading: boolean = false;
  isDownloading: { [key: number]: boolean } = {};

  criterias: any = [];
  municipies:any = [];
  form: FormGroup;
  rude: any
  preinscripcion: any
  active: boolean = false

  @ViewChild('dialogTpl', { static: true }) dialogTpl!: TemplateRef<any>
  @ViewChild('dialogEditTpl', { static: true }) dialogEditTpl!: TemplateRef<any>

  alert:string = `Editar de forma incorrecta esta información puede con llevar
  a que se ANULE su preinscripción. ¿Está realmente seguro que quiere editar su formulario?`

  constructor(
    @Inject('IPreRegistration') private _preRegistration: IPreRegistration,
    private message: NzMessageService,
    private modal: NzModalService,
    private fb: FormBuilder,
    private notification: NotificationService,
    private socketService: SocketService
  ) {
    this.form = this.fb.group({
      justification: [1, Validators.required],
      postulantSiblings: this.fb.array([], [Validators.required, Validators.minLength(1)]),

      postulantMunicipalityResidence: [''],
      postulantAreaResidence: [''],
      postulantAddressResidence: [''],
      postulantTelephoneResidence: [''],

      guardianPlaceNameWork: [''],
      guardianMunicipalityWork: [''],
      guardianAreaWork: [''],
      guardianAddressJob: [''],
      guardianPhoneJob: [''],

      addressTutor: ['']

    })
  }

  ngOnInit(): void {
    this.dynamicValidations()
    this.socketService.onCurrentOperative().subscribe((data) => {
      if(!data) return;
      const startDate = new Date(data.start)
      const now = new Date()
      this.active = data.active
    })
  }

  get justification(): number {
    return this.form.get('justification')?.value
  }
  get postulantSiblings(): FormArray {
    return this.form.get('postulantSiblings') as FormArray
  }

  searchApplication(): void {
    if (!this.searchTerm.trim()) {
      return;
    }

    this.isLoading = true;

    this._preRegistration.getListPreRegistrationFollow(this.searchTerm).subscribe({
      next: response => {
        console.log("response", response)
        if(response?.data?.length === 0) {
          this.searchResults = []
        } else {
          const mapped = response.data.map((item: any) => this.mapToPreInscription(item));
          this.searchResults = mapped;
        }

        this.isLoading = false;
      },
      error: () => {
        this.searchResults = [];
        this.isLoading = false;
      }
    });

    this._preRegistration.getCriterias().subscribe((response) => {
      this.criterias = response.data
    });

    this._preRegistration.getMunicipies().subscribe((response) => {
      this.municipies = response.data
    })
  }

  viewDetails(preinscripcion: PreInscription): void {
    this.preinscripcion = preinscripcion
    this.modal.confirm({
      nzTitle: '<i><b>¿Está seguro de editar su preinscripción?</i></b>',
      nzContent: this.dialogTpl,
      nzOkText:'Si, quiero editar',
      nzOkDanger: true,
      nzCancelText: 'No quiero editar',
      nzWidth: 600,
      nzOnOk: () => {
        this.modal.create({
          nzTitle: '<b>Editar preinscripción</b>',
          nzContent: this.dialogEditTpl, // o un TemplateRef
          nzWidth: 1200,
          nzFooter: [
            {
              label: 'Guardar cambios',
              type: 'primary',
              onClick: () => {
                this.onSubmit();
              }
            },
            {
              label: 'Cancelar',
              onClick: () => this.modal.closeAll()
            }
          ]
        });
      }
    })
  }

  downloadCertificate(preinscripcion: PreInscription): void {
    this.isDownloading[preinscripcion.id] = true;
    this._preRegistration.downloadBlobWithHeaders(preinscripcion.id).subscribe({
      next: (response) => {
        this.isDownloading[preinscripcion.id] = false;
        const blob = new Blob([response.body!], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        const contentDisposition = response.headers.get('Content-Disposition');
        let fileName = `preinscripcion_${preinscripcion.applicationCode}.pdf`;
        if (contentDisposition) {
          const fileNameMatch = contentDisposition.match(/filename="?(.+)"?/);
          if (fileNameMatch && fileNameMatch.length === 2) {
            fileName = fileNameMatch[1];
          }
        }
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        this.message.success('PDF descargado correctamente');
      },
      error: (error) => {
        this.isDownloading[preinscripcion.id] = false;
        console.error('Error al descargar el PDF:', error);
        if (error.status === 404) {
          this.message.error('No se encontró el PDF solicitado');
        } else if (error.status === 500) {
          this.message.error('Error del servidor al generar el PDF');
        } else {
          this.message.error('Error al descargar el PDF');
        }
      }
    })
  }

  // Método alternativo usando window.open (más simple)
  downloadCertificateAlternative(preinscripcion: PreInscription): void {
    this.isDownloading[preinscripcion.id] = true;
    const url = `http://localhost:3000/api/pre-registration/print/${preinscripcion.id}`;
    const newWindow = window.open(url, '_blank');
    if (!newWindow) {
      this.message.warning('Por favor, permite ventanas emergentes para ver el PDF');
      this.downloadCertificate(preinscripcion);
    } else {
      this.isDownloading[preinscripcion.id] = false;
    }
  }

  private mapToPreInscription(apiResponse: any): PreInscription {
    return {
      id: apiResponse.id,
      applicationCode: apiResponse.code,
      applicationSie: apiResponse.highDemandCourse.highDemandRegistration.educationalInstitutionId,
      applicantName: `${apiResponse.postulant.name} ${apiResponse.postulant.lastName} ${apiResponse.postulant.mothersLastName}`.trim(),
      applicationDate: this.formatDateTime(apiResponse.createdAt || '', false),
      institutionName: apiResponse.highDemandCourse?.highDemandRegistration?.educationalInstitution?.name ?? '',
      educationalLevel: apiResponse.highDemandCourse?.level?.name,
      course: `${apiResponse.highDemandCourse?.grade?.name}`,
      justification: apiResponse.criteria?.description ?? '',
      status: apiResponse.state,
      statusClass: this.mapStatusClass(apiResponse.state),
      identityCard: apiResponse.postulant.identityCard,
      postulant: apiResponse.postulant,
      isUpdated: apiResponse.isUpdated
    };
  }

  private mapStatusClass(state: string): string {
    switch (state) {
      case 'ACEPTADO': return 'status-ACEPTADO';
      case 'NO ACEPTADO': return 'status-NO_ACEPTADO';
      case 'VALIDADO': return 'status-VALIDADO';
      case 'INVALIDADO': return 'status-INVALIDADO';
      case 'REGISTRADO': return 'status-REGISTRADO';
      default: return 'status-default';
    }
  }

  private formatDateTime(isoString: string, withoutTime: boolean): string {
    if (!isoString) return '';
    const date = new Date(new Date(isoString).getTime() - 4 * 60 * 60 * 1000);
    const day = date.getDate();
    const month = date.toLocaleString('es-ES', { month: 'long' });
    const year = date.getFullYear();
    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12 || 12;
    if (withoutTime) {
      return `${day} de ${month} de ${year}`;
    } else {
      return `${day} de ${month} de ${year}, ${hours}:${minutes} ${ampm}`;
    }
  }

  addBrother(tpl: TemplateRef<{}>): void {
    if(this.postulantSiblings.length === 3) {
      alert("solo puede introducir 3 hermanos(as)")
      return;
    }
    let rude = '';
    this.modal.confirm({
      nzTitle: 'Busar al hermano(a)',
      nzContent: tpl,
      nzOkText: 'Buscar',
      nzCancelText: 'Cancelar',
      nzOnOk: () => {
        const inputEl = document.getElementById(
          'rudeInput'
        ) as HTMLInputElement;
        rude = inputEl?.value.trim() || '';
        if(inputEl) inputEl.value = '';

        if(!rude) {
          alert("Debe ingresar un RUDE")
          return
        }

        const sie =  this.preinscripcion.applicationSie
        if(!sie) return
        this._preRegistration.searchStudent(sie, rude).subscribe((response) => {
          const brother = response.data;
          if(brother.length === 0) return;
          const alreadyExists = this.postulantSiblings.controls.some(
            ctrl => ctrl.get('codeRude')?.value === brother.codigo_rude
          )
          if(alreadyExists) {
            this.notification.showMessage('Este hermano(a) ya fue agregado', 'Advertencia', 'warning')
            return;
          }
          const siblingGroup = this.fb.group({
            codeRude: [brother.codigo_rude, Validators.required],
            name: [`${brother.nombre} ${brother.paterno} ${brother.materno}`],
            level: [brother?.nivel || ''],
            grade: [`${brother.grado} ${brother.paralelo}` || '']
          })
          this.postulantSiblings.push(siblingGroup)
          this.form.get('postulantSiblings')?.updateValueAndValidity()
        })
      }
    });
  }

  dynamicValidations() {
    this.form.get('justification')?.valueChanges.pipe(
      startWith(this.form.get('justification')?.value)
    ).subscribe((value) => {
      // postulante
      const postulantMunicipalityResidence = this.form.get('postulantMunicipalityResidence')
      const postulantAreaResidence = this.form.get('postulantAreaResidence')
      const postulantAddressResidence = this.form.get('postulantAddressResidence')
      const postulantTelephoneResidence = this.form.get('postulantTelephoneResidence')
      // apoderado
      const guardianPlaceNameWork = this.form.get('guardianPlaceNameWork')
      const guardianMunicipalityWork = this.form.get('guardianMunicipalityWork')
      const guardianAreaWork = this.form.get('guardianAreaWork')
      const guardianAddressJob = this.form.get('guardianAddressJob')
      const guardianPhoneJob = this.form.get('guardianPhoneJob')

      const postulantSiblings = this.form.get('postulantSiblings')
      if(value === 1) {
        postulantSiblings?.setValidators([Validators.required, Validators.minLength(1)])
        // vivienda
        postulantMunicipalityResidence?.reset()
        postulantAreaResidence?.reset()
        postulantAddressResidence?.reset()
        postulantTelephoneResidence?.reset()
        // trabajo
        guardianPlaceNameWork?.reset()
        guardianMunicipalityWork?.reset()
        guardianAreaWork?.reset()
        guardianAddressJob?.reset()
        guardianPhoneJob?.reset()
      } else {
        postulantSiblings?.clearValidators()
        const postulantSiblings2 = this.form.get('postulantSiblings') as FormArray;
        postulantSiblings2?.clear();
      }
      postulantSiblings?.updateValueAndValidity()

      if(value === 2) {
        postulantMunicipalityResidence?.setValidators([Validators.required])
        postulantAreaResidence?.setValidators([Validators.required])
        postulantAddressResidence?.setValidators([Validators.required])
        postulantTelephoneResidence?.setValidators([Validators.required])
        // borrar valores de trabajo
        guardianPlaceNameWork?.reset()
        guardianMunicipalityWork?.reset()
        guardianAreaWork?.reset()
        guardianAddressJob?.reset()
        guardianPhoneJob?.reset()
        // hermanos
        const postulantSiblings2 = this.form.get('postulantSiblings') as FormArray;
        postulantSiblings2?.clear();
      } else {
        postulantMunicipalityResidence?.clearValidators()
        postulantAreaResidence?.clearValidators()
        postulantAddressResidence?.clearValidators()
        postulantTelephoneResidence?.clearValidators()
        // vivienda
        postulantMunicipalityResidence?.reset()
        postulantAreaResidence?.reset()
        postulantAddressResidence?.reset()
        postulantTelephoneResidence?.reset()
      }
      postulantMunicipalityResidence?.updateValueAndValidity();
      postulantAreaResidence?.updateValueAndValidity();
      postulantAddressResidence?.updateValueAndValidity();
      postulantTelephoneResidence?.updateValueAndValidity();

      if(value === 3) {
        guardianPlaceNameWork?.setValidators([Validators.required])
        guardianMunicipalityWork?.setValidators([Validators.required])
        guardianAreaWork?.setValidators([Validators.required])
        guardianAddressJob?.setValidators([Validators.required])
        guardianPhoneJob?.setValidators([Validators.required])
        const postulantSiblings2 = this.form.get('postulantSiblings') as FormArray;
        postulantSiblings2?.clear();
        postulantMunicipalityResidence?.reset()
        postulantAreaResidence?.reset()
        postulantAddressResidence?.reset()
        postulantTelephoneResidence?.reset()
      } else {
        guardianPlaceNameWork?.clearValidators()
        guardianMunicipalityWork?.clearValidators()
        guardianAreaWork?.clearValidators()
        guardianAddressJob?.clearValidators()
        guardianPhoneJob?.clearValidators()
        guardianPlaceNameWork?.reset()
        guardianMunicipalityWork?.reset()
        guardianAreaWork?.reset()
        guardianAddressJob?.reset()
        guardianPhoneJob?.reset()
      }
      guardianPlaceNameWork?.updateValueAndValidity();
      guardianMunicipalityWork?.updateValueAndValidity();
      guardianAreaWork?.updateValueAndValidity();
      guardianAddressJob?.updateValueAndValidity();
      guardianPhoneJob?.updateValueAndValidity();

    })
  }

  onSubmit(): void {
    if(!this.form.valid) {
      this.notification.showMessage('Por favor rellené los campos con borde rojo para realizar la pre inscripción', 'Advertencia', 'warning')
      Object.values(this.form.controls).forEach(control => {
        if(control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true })
        }
      });
    } else {
      this.modal.confirm({
        nzTitle: '¿Está seguro de actualizar su preinscripción?',
        nzContent: this.dialogTpl,
        nzOkText: 'Si, actualizar',
        nzCancelText: 'No actualizar',
        nzWidth: 600,
        nzOnOk: () => {
          if(this.form.valid) {
            const formValue = this.form.value
            const data = {
              postulantResidence: {
                municipality: formValue.postulantMunicipalityResidence,
                area: formValue.postulantAreaResidence,
                address: formValue.postulantAddressResidence,
                telephone: formValue.postulantTelephoneResidence
              },
              guardianWork: {
                placeName: formValue.guardianPlaceNameWork,
                municipality: formValue.guardianMunicipalityWork,
                area: formValue.guardianAreaWork,
                addressJob: formValue.guardianAddressJob,
                phoneJob: formValue.guardianPhoneJob
              },
              justification: formValue.justification,
              postulantSiblings: formValue.postulantSiblings,
              preInscriptionId: this.preinscripcion.id,
              addressTutor: formValue.addressTutor,
            }
            this._preRegistration.updatePreRegistration(data).subscribe(() => {
              this.searchApplication();
              this.modal.closeAll();
            })
          }
        }
      })
    }
  }
}