import { Component, Inject, OnInit } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzFormItemComponent, NzFormLabelComponent } from "ng-zorro-antd/form";
import { NzColDirective, NzGridModule } from "ng-zorro-antd/grid";
import { NzSelectModule } from "ng-zorro-antd/select";
import { NzTableModule } from "ng-zorro-antd/table";
import { NzTagModule } from "ng-zorro-antd/tag";
import { NzModalModule, NzModalService } from "ng-zorro-antd/modal";
import { NzAlertComponent } from "ng-zorro-antd/alert";
import { NzListModule } from "ng-zorro-antd/list";
import { FormsModule } from '@angular/forms';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzInputModule } from 'ng-zorro-antd/input';
import { CommonModule } from '@angular/common';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import IPreRegistration from '../../../../domain/ports/i-pre-registration';
import { NzCheckboxComponent } from "ng-zorro-antd/checkbox";

interface Student {
  id: string;
  rudeCode: string;
  lastName1: string;
  lastName2: string;
  firstName: string;
  idCard: string;
  criteria: string;
  level: string;
  schoolYear: string;
  selected?: boolean;
  loading?: boolean;
}

interface Level {
  id: number;
  name: string;
}

interface Grade {
  id: number;
  name: string;
}

interface Parallel {
  id: number;
  name: string;
}

interface HighDemandCourse {
  id: number;
  highDemandRegistrationId: number;
  totalQuota: number;
  createdAt: Date;
  level: Level;
  grade: Grade;
  parallel: Parallel
}

interface Representative {
  id: number;
  identityCard: string;
  complement: string;
  lastName: string;
  mothersLastName: string;
  name: string;
  dateBirth: Date;
  nationality: boolean;
  createdAt: Date;
}

interface Postulant {
  id: number;
  identityCard: string;
  lastName: string;
  mothersLastName: string;
  name: string;
  dateBirth: Date;
  placeBirth: string;
  gender: boolean;
  codeRude: string | null;
  createdAt: Date;
}

interface Criteria {
  id: number;
  name: string;
  description: string;
}

interface PreRegistration {
  id: number;
  highDemandCourse: HighDemandCourse;
  representative: Representative;
  postulant: Postulant;
  criteria: Criteria;
  state: any;
  createdAt: Date;
  selected?: boolean;
  loading?: boolean;
}

@Component({
  selector: 'app-student-selection',
  templateUrl: './selection.component.html',
  styleUrls: ['./selection.component.less'],
  imports: [
    CommonModule,
    FormsModule,
    NzAlertComponent,
    NzButtonModule,
    NzCheckboxComponent,
    NzColDirective,
    NzCollapseModule,
    NzFormItemComponent,
    NzFormLabelComponent,
    NzGridModule,
    NzIconModule,
    NzInputModule,
    NzListModule,
    NzModalModule,
    NzSelectModule,
    NzTableModule,
    NzTagModule,
    NzTypographyModule,
  ],
  providers: [NzModalService]
})
export class SelectionInbox implements OnInit {
  // Datos
  preRegistrations: PreRegistration[] = [];
  filteredPreRegistrations: PreRegistration[] = [];
  selectedPostulant: PreRegistration | null = null;
  selectedPostulants: PreRegistration[] = [];

  students: Student[] = [];
  filteredStudents: Student[] = [];
  selectedStudents: Student[] = [];
  selectedStudent: Student | null = null;

  // Filtros
  filters = {
    rudeCode: '',
    lastName: '',
    firstName: '',
    idCard: '',
    criteria: '',
    level: '',
    schoolYear: ''
  };

  // Estados
  loading = false;
  isConfirmVisible = false;
  isConfirmLoading = false;
  isConsolidateVisible = false;
  isConsolidateLoading = false;


  tempChecked: boolean = false;

  constructor(
    private message: NzMessageService,
    @Inject('IPreRegistration') private _preRegistration: IPreRegistration
  ) {}

  ngOnInit(): void {
    this.loadStudents();
  }

  loadStudents(): void {
    this.loading = true;
    this._preRegistration.getListPreRegistration().subscribe((response) => {
      this.preRegistrations = response.data
      this.filteredPreRegistrations = [...this.preRegistrations]
      this.loading = false
    })
    // Simular carga de datos (reemplazar con llamada API real)
    // setTimeout(() => {
    //   this.students = [
    //     {
    //       id: '1',
    //       rudeCode: 'R001',
    //       lastName1: 'Pérez',
    //       lastName2: 'Gómez',
    //       firstName: 'Juan',
    //       idCard: '1234567',
    //       criteria: 'CRITERIO_A',
    //       level: 'SECUNDARIA',
    //       schoolYear: '2023'
    //     },
    //     {
    //       id: '2',
    //       rudeCode: 'R002',
    //       lastName1: 'Vargas',
    //       lastName2: 'Ramirez',
    //       firstName: 'Leonel Maximo',
    //       idCard: '1234567',
    //       criteria: 'CRITERIO_A',
    //       level: 'SECUNDARIA',
    //       schoolYear: '2022'
    //     },
    //     // ... más datos de ejemplo
    //   ];
    //   this.filteredStudents = [...this.students];
    //   this.loading = false;
    // }, 1000);
  }

  applyFilters(): void {
    this.filteredStudents = this.students.filter(student => {
      return (
        (!this.filters.rudeCode || student.rudeCode.includes(this.filters.rudeCode)) &&
        (!this.filters.lastName || 
          student.lastName1.toLowerCase().includes(this.filters.lastName.toLowerCase()) || 
          student.lastName2.toLowerCase().includes(this.filters.lastName.toLowerCase())) &&
        (!this.filters.firstName || student.firstName.toLowerCase().includes(this.filters.firstName.toLowerCase())) &&
        (!this.filters.idCard || student.idCard.includes(this.filters.idCard)) &&
        (!this.filters.criteria || student.criteria === this.filters.criteria) &&
        (!this.filters.level || student.level === this.filters.level)
      );
    });
  }

  clearFilters(): void {
    this.filters = {
      rudeCode: '',
      lastName: '',
      firstName: '',
      idCard: '',
      criteria: '',
      level: '',
      schoolYear: ''
    };
    this.filteredStudents = [...this.students];
  }

  selectStudent(postulant: PreRegistration): void {
    // this.selectedStudent = student;
    this.selectedPostulant = postulant
    this.isConfirmVisible = true;
  }

  handleCancel(): void {
    // if(this.selectedPostulant) {
    //   this.selectedPostulant.selected = !this.tempChecked
    // }
    this.isConfirmVisible = false;
  }

  confirmSelection(): void {
    if (this.selectedPostulants.length === 0) return;
    this.isConsolidateVisible = true;
  }

  handleConsolidateCancel(): void {
    this.isConsolidateVisible = false;
  }

  handleConsolidateOk(): void {
    this.isConsolidateLoading = true;
    // Simular consolidación
    setTimeout(() => {
      this.message.success(`${this.selectedPostulants.length} estudiantes consolidados`);
      this.selectedPostulants = [];
      this.isConsolidateVisible = false;
      this.isConsolidateLoading = false;
    }, 1000);
  }

  getCriteriaColor(criteria: string): string {
    switch (criteria) {
      case 'HERMANOS': return 'green';
      case 'VIVIENDA': return 'orange';
      case 'LUGAR_TRABAJO': return 'red';
      default: return 'blue';
    }
  }

  onToggleStudent(checked: boolean, postulant: any): void {
    this.selectedPostulant = postulant
    this.tempChecked = checked
    postulant.selected = !checked;
    this.isConfirmVisible = true;
  }

  handleOk(): void {
    if(!this.selectedPostulant) return;

    this.isConfirmLoading = true;
    const { id: preRegistrationId } = this.selectedPostulant
    this._preRegistration.updatedStatus(preRegistrationId).subscribe(response => {
      this.selectedPostulant!.selected = this.tempChecked;
      this.selectedPostulants.push(this.selectedPostulant!)
      this.isConfirmVisible = false;
      this.isConfirmLoading = false;
      this.message.success(`Postulante ${this.selectedPostulant?.postulant.name} seleccionado`);
    })
    // setTimeout(() => {
    // }, 800);
  }

  updatedStatus():void {
    
  }
}