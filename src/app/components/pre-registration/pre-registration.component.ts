import { Component } from '@angular/core';
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
export default class FormularioInscripcionComponent {
  form: FormGroup;
  today = new Date();

  unidadesEducativas = [
    { value: 'ue1', label: 'Unidad Educativa 1' },
    { value: 'ue2', label: 'Unidad Educativa 2' },
    { value: 'ue3', label: 'Unidad Educativa 3' }
  ];


  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      // Sección I: Datos de la Unidad Educativa
      nombreUnidadEducativa: ['81480018 - JOSE ALONSO DE IBAÑEZA', Validators.required],
      turnoUnidadEducativa: ['MAÑANA', Validators.required],
      dependenciaUnidadEducativa: ['FISCAL', Validators.required],
      departamento: ['POTOSI', Validators.required],
      municipio: ['POTOSI', Validators.required],
      zonaBarrio: ['BOLIVAR Nro 997', Validators.required],

      // Sección II: Datos del Padre/Madre/Tutor
      apellidoPaternoTutor: ['', Validators.required],
      apellidoMaternoTutor: ['', Validators.required],
      nombresTutor: ['', Validators.required],
      ciTutor: ['', Validators.required],
      direccionTutor: ['', Validators.required],
      parentescoTutor: [''],
      lugarTrabajoTutor: [''],
      municipioTrabajoTutor: [''],
      zonaTrabajoTutor: [''],
      direccionTrabajoTutor: [''],
      telefonoTrabajoTutor: [''],

      // Sección III: Datos del Estudiante
      apellidoPaternoEstudiante: ['', Validators.required],
      apellidoMaternoEstudiante: ['', Validators.required],
      nombresEstudiante: ['', Validators.required],
      ciEstudiante: [''],
      generoEstudiante: ['Femenino', Validators.required],
      fechaNacimientoEstudiante: ['', Validators.required],
      lugarNacimientoEstudiante: ['', Validators.required],
      edadEstudianteAnios: ['', Validators.required],
      edadEstudianteMeses: ['', Validators.required],

      // Sección IV: Dirección del Estudiante
      municipioResidencia: ['POTOSI', Validators.required],
      zonaResidencia: ['ZONA CENTRAL', Validators.required],
      direccionResidencia: ['', Validators.required],
      telefonoResidencia: [''],

      // Sección V: Hermanos en la misma unidad
      hermanos: this.fb.array([]),

      // Sección VI: Datos de Pre-Inscripción
      nivelEducativo: ['Primer año de escolaridad', Validators.required],
      justificativo: ['Vivienda', Validators.required],
      lugarFecha: [`POTOSI, ${this.today.getDate()} DE ${this.getMonthName(this.today.getMonth())} DE ${this.today.getFullYear()}`, Validators.required]
    });
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