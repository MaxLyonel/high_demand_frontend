import { Component, Inject, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzTimePickerModule } from 'ng-zorro-antd/time-picker';
import { NzLayoutModule } from "ng-zorro-antd/layout";
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { NzSelectModule } from 'ng-zorro-antd/select';
import IHighDemand from '../../domain/ports/i-high-demand';
import IPreRegistration from '../../domain/ports/i-pre-registration';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzModalModule, NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NotificationService } from '../../infrastructure/services/notify.service';

@Component({
  selector: 'app-formulario-inscripcion',
  templateUrl: './pre-registration.component.html',
  styleUrls: ['./pre-registration.component.less'],
  imports: [
    ReactiveFormsModule,
    NzDatePickerModule,
    FormsModule,
    NzAlertModule,
    NzLayoutModule,
    NzCardModule,
    NzFormModule,
    NzInputModule,
    NzGridModule,
    NzRadioModule,
    NzTimePickerModule,
    NzInputNumberModule,
    NzDividerModule,
    NzTableModule,
    NzButtonModule,
    NzIconModule,
    NzTypographyModule,
    NzSelectModule,
    NzModalModule
]
})
export default class FormularioInscripcionComponent implements OnInit{
  form: FormGroup;
  today = new Date();

  institutions:any = [];
  originalInstitutions:any = [];
  relationships:any = [];
  municipies:any = [];
  criterias: any = [];
  courses:any = [];
  highDemands:any = [];

  educationalLevels: any = [];
  grades: any = []
  parallels: any = []

  confirmModal?: NzModalRef
  rude: any
  studentBrother: any

  constructor(
    private fb: FormBuilder,
    private modal: NzModalService,
    private notification: NotificationService,
    @Inject('IHighDemand') private _highDemand: IHighDemand,
    @Inject('IPreRegistration') private _preRgistration: IPreRegistration
  ) {
    this.form = this.fb.group({
      // Sección I: Datos de la Unidad Educativa
      institutionName: ['', Validators.required],
      institutionId: [''],
      institutionType: [''],
      institutionDependency: [''],
      institutionDepartment: [''],
      institutionMunicipie: [''],
      neighborhoodArea: [''],

      // Sección II: Datos del Padre/Madre/Tutor
      guardianNationality: ['Nacional', Validators.required],
      guardianComplement: [''],
      guardianLastName: ['', Validators.required],
      guardianMothersLastName: ['', Validators.required],
      guardianName: ['', Validators.required],
      guardianIdentityCard: ['', Validators.required],
      guardianRelationship: ['', Validators.required],
      guardianDateBirth: ['', Validators.required],

      guardianAddress: ['', Validators.required],
      guardianPlaceNameWork: ['', Validators.required],
      guardianMunicipalityWork: ['', Validators.required],
      guardianAreaWork: ['', Validators.required],
      guardianAddressJob: ['', Validators.required],
      guardianPhoneJob: ['', Validators.required],

      // Sección III: Datos del Estudiante
      postulantNationality: ['Nacional', Validators.required],
      postulantLastName: ['', Validators.required],
      postulantMothersLastName: ['', Validators.required],
      postulantName: ['', Validators.required],
      postulantIdentityCard: [''],
      postulantComplement: [''],
      postulantGender: ['Femenino', Validators.required],
      postulantDateBirth: ['', Validators.required],
      postulantPlaceBirth: ['', Validators.required],

      // Sección IV: Dirección del Estudiante
      postulantMunicipalityResidence: ['', Validators.required],
      postulantAreaResidence: ['ZONA CENTRAL', Validators.required],
      postulantAddressResidence: ['', Validators.required],
      postulantTelephoneResidence: [''],

      // Sección V: Hermanos en la misma unidad
      postulantSiblings: this.fb.array([]),

      // Sección VI: Datos de Pre-Inscripción
      justification: [1, Validators.required],

      educationalLevel: ['', Validators.required],
      yearOfSchoolign: ['', Validators.required],
      parallel: ['', Validators.required],
      placeDate: [`POTOSI, ${this.today.getDate()} DE ${this.getMonthName(this.today.getMonth())} DE ${this.today.getFullYear()}`, Validators.required]
    });

    this.form.get('institutionName')?.valueChanges.subscribe(selected => {
      this.courses = selected.courses
      this.educationalLevels = this.prepareData()
      if(selected) {
        this.form.patchValue({
          institutionId: selected.educationalInstitution.id,
          institutionDependency: selected.educationalInstitution.dependencyType.dependency,
          neighborhoodArea: selected.educationalInstitution.jurisdiction.direction,
          institutionType: selected.educationalInstitution.educationalInstitutionType.description,
          institutionDepartment: selected.educationalInstitution.jurisdiction.localityPlaceType.parent.parent.parent.parent.place,
          institutionMunicipie: selected.educationalInstitution.jurisdiction.localityPlaceType.parent.parent.parent.place,
          educationalLevel: '',
          yearOfSchoolign: '',
          parallel: '',
        })
      } else {
        this.form.patchValue({
          institutionDependency: '',
          neighborhoodArea: '',
          institutionType: '',
          institutionDepartment: '',
          institutionMunicipie: '',
          educationalLevel: '',
          yearOfSchoolign: '',
          parallel: '',
        })
      }
    });

    this.form.get('educationalLevel')?.valueChanges.subscribe(level => {
      if (level) {
        this.grades = level.grades;   // guardamos los grados de ese nivel
        this.form.patchValue({ yearOfSchoolign: '', parallel: '' }); // reset
      } else {
        this.grades = [];
        this.parallels = []
      }
    });

    this.form.get('yearOfSchoolign')?.valueChanges.subscribe(grade => {
      if(grade) {
        this.parallels = grade.parallels;
        this.form.patchValue({ parallel: ''})
      } else {
        this.parallels = []
      }
    })
  }

  onSubmit(): void {
    if (this.form.valid) {
      const formValue = this.form.value
      const data = {
        institution: {
          institutionName: formValue.institutionName,
          institutionId: formValue.institutionId,
          institutionType: formValue.institutionType,
          institutionDependency: formValue.institutionDependency,
          institutionDepartment: formValue.institutionDepartment,
          institutionMunicipie: formValue.institutionMunicipie,
          neighborhoodArea: formValue.neighborhoodArea
        },
        postulant: {
          identityCard: formValue.postulantIdentityCard,
          complement: formValue.postulantComplement,
          lastName: formValue.postulantLastName,
          mothersLastName: formValue.postulantMothersLastName,
          name: formValue.postulantName,
          gender: formValue.postulantGender,
          dateBirth: formValue.postulantDateBirth,
          placeBirth: formValue.postulantPlaceBirth,
          nationality: formValue.postulantNationality
        },
        postulantResidence: {
          muncipality: formValue.postulantMunicipalityResidence,
          area: formValue.postulantAreaResidence,
          address: formValue.postulantAddressResidence,
          telephone: formValue.postulantTelephoneResidence
        },
        guardian:  {
          nationality: formValue.guardianNationality,
          complement: formValue.guardianComplement,
          lastName: formValue.guardianLastName,
          mothersLastName: formValue.guardianMothersLastName,
          name: formValue.guardianName,
          identityCard: formValue.guardianIdentityCard,
          relationship: formValue.guardianRelationship,
          dateBirth: formValue.guardianDateBirth
        },
        guardianWork: {
          address: formValue.guardianAddress,
          placeName: formValue.guardianPlaceNameWork,
          municipality: formValue.guardianMunicipalityWork,
          area: formValue.guardianAreaWork,
          addressJob: formValue.guardianAddressJob,
          phoneJob: formValue.guardianPhoneJob
        },
        courseId: formValue.parallel.courseId,
        justification: formValue.justification
      }
      this._preRgistration.savePreRegistration(data).subscribe((response) => {
        console.log("Response create: ", response)
      })
    } else {
      this.notification.showMessage('Por favor rellené los campos con border rojo para realizar la pre inscripción', 'Advertencia', 'warning')
      Object.values(this.form.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }


  ngOnInit(): void {
    this.loadData()
  }

  loadData() {
    this._highDemand.getHighDemands().subscribe((response) => {
      this.highDemands = response.data
      this.institutions = response.data.map((e:any) => e.educationalInstitution)
    })
    this._preRgistration.getRelationships().subscribe((response) => {
      this.relationships = response.data
    })
    this._preRgistration.getMunicipies().subscribe((response) => {
      this.municipies = response.data
    })
    this._preRgistration.getCriterias().subscribe((response) => {
      this.criterias = response.data
    })
  }

  prepareData() {
    const grouped = Object.values(
      this.courses.reduce((acc: any, item: any) => {
        if(!acc[item.level.id]) {
          acc[item.level.id] = {
            id: item.level.id,
            name: item.level.name,
            grades: {}
          }
        }
        const level = acc[item.level.id]
        // Agrupar por grado dentro del nivel
        if(!level.grades[item.grade.id]) {
          level.grades[item.grade.id] = {
            id: item.grade.id,
            name: item.grade.name,
            parallels: []
          }
        }
        const grade = level.grades[item.grade.id];
        // Agregar paralelo
        grade.parallels.push({
          id: item.parallel.id,
          name: item.parallel.name,
          totalQuota: item.totalQuota,
          courseId: item.id
        });

        return acc;
      }, {} as any)
    ).map((level:any) =>  ({
      ...level,
      grades: Object.values(level.grades)
    }))
    return grouped
  }

  private getMonthName(month: number): string {
    const months = [
      'ENERO', 'FEBRERO', 'MARZO', 'ABRIL', 'MAYO', 'JUNIO',
      'JULIO', 'AGOSTO', 'SEPTIEMBRE', 'OCTUBRE', 'NOVIEMBRE', 'DICIEMBRE'
    ];
    return months[month];
  }

  addBrother(tpl: TemplateRef<{}>): void {
    let rude = '';
    this.confirmModal = this.modal.confirm({
      nzTitle: 'Busar al hermano(a)',
      nzContent: tpl,
      nzOkText: 'Buscar',
      nzCancelText: 'Cancelar',
      nzOnOk: () => {
        const inputEl = document.getElementById(
          'rudeInput'
        ) as HTMLInputElement;
        rude = inputEl?.value || '';
        const selectedInstitution = this.form.get('institutionName')?.value
        if(!selectedInstitution) return
        const sie = selectedInstitution.educationalInstitutionId
        this._preRgistration.searchStudent(sie, rude).subscribe((response) => {
          this.rude = ''
          this.studentBrother = response.data
        })
      }
    });
  }


  // getters y setters
  get justification(): number {
    return this.form.get('justification')?.value;
  }
}