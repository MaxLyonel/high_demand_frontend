import { Component, Inject, OnInit } from '@angular/core';
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

@Component({
  selector: 'app-formulario-inscripcion',
  templateUrl: './pre-registration.component.html',
  styleUrls: ['./pre-registration.component.less'],
  imports: [
    ReactiveFormsModule,
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
    NzSelectModule
]
})
export default class FormularioInscripcionComponent implements OnInit{
  form: FormGroup;
  today = new Date();

  institutions:any = [ ];

  constructor(
    private fb: FormBuilder,
    @Inject('IHighDemand') private _highDemand: IHighDemand
  ) {
    this.form = this.fb.group({
      // Sección I: Datos de la Unidad Educativa
      institutionName: ['', Validators.required],
      institutionType: ['', Validators.required],
      institutionDependency: ['', Validators.required],
      department: ['', Validators.required],
      municipie: ['', Validators.required],
      neighborhoodArea: ['', Validators.required],

      // Sección II: Datos del Padre/Madre/Tutor
      guardianPaternalSurname: ['', Validators.required],
      guardianMaternalSurname: ['', Validators.required],
      guardianName: ['', Validators.required],
      ciTutor: ['', Validators.required],
      guardianAddress: ['', Validators.required],
      relationshipGuardian: ['', Validators.required],
      placeWorkTutor: ['', Validators.required],
      municipalityWorkTutor: ['', Validators.required],
      areaWorkTutor: ['', Validators.required],
      addressJobTutor: ['', Validators.required],
      phoneJobTutor: ['', Validators.required],

      // Sección III: Datos del Estudiante
      surnamePaternalStudent: ['', Validators.required],
      surnameMaternalStudent: ['', Validators.required],
      namesStudent: ['', Validators.required],
      ciStudent: [''],
      genderStudent: ['Femenino', Validators.required],
      dateBirthStudent: ['', Validators.required],
      placeBirthStudent: ['', Validators.required],
      ageStudentYears: ['', Validators.required],
      ageStudentMonths: ['', Validators.required],

      // Sección IV: Dirección del Estudiante
      municipalityResidence: ['POTOSI', Validators.required],
      areaResidence: ['ZONA CENTRAL', Validators.required],
      addressResidence: ['', Validators.required],
      telephoneResidence: [''],

      // Sección V: Hermanos en la misma unidad
      siblings: this.fb.array([]),

      // Sección VI: Datos de Pre-Inscripción
      educationalLevel: ['Primer año de escolaridad', Validators.required],
      justification: ['Vivienda', Validators.required],
      placeDate: [`POTOSI, ${this.today.getDate()} DE ${this.getMonthName(this.today.getMonth())} DE ${this.today.getFullYear()}`, Validators.required]
    });

    this.form.get('institutionName')?.valueChanges.subscribe(selected => {
      if(selected) {
        this.form.patchValue({
          institutionDependency: selected.dependencyType.dependency,
          neighborhoodArea: selected.jurisdiction.direction,
          institutionType: selected.educationalInstitutionType.description
        })
      } else {
        this.form.patchValue({
          institutionDependency: '',
          neighborhoodArea: '',
          institutionType: ''
        })
      }
    });
  }

  ngOnInit(): void {
    this.loadData()
  }

  loadData() {
    this._highDemand.getHighDemands().subscribe((response) => {
      this.institutions = response.data.map((e:any) => e.educationalInstitution)
      console.log("Esto es obtenido: ", response)
    })
  }

  private getMonthName(month: number): string {
    const months = [
      'ENERO', 'FEBRERO', 'MARZO', 'ABRIL', 'MAYO', 'JUNIO',
      'JULIO', 'AGOSTO', 'SEPTIEMBRE', 'OCTUBRE', 'NOVIEMBRE', 'DICIEMBRE'
    ];
    return months[month];
  }

  addHermano() {
  }

  onSubmit(): void {
    if (this.form.valid) {
      console.log('Formulario enviado:', this.form.value);
      // Aquí iría la lógica para enviar el formulario
    } else {
      Object.values(this.form.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }
}