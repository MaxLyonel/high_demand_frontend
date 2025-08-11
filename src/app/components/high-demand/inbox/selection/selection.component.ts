import { Component, OnInit } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzFormItemComponent, NzFormLabelComponent } from "ng-zorro-antd/form";
import { NzColDirective, NzGridModule } from "ng-zorro-antd/grid";
import { NzSelectModule } from "ng-zorro-antd/select";
import { NzTableComponent, NzTableModule } from "ng-zorro-antd/table";
import { NzTagComponent, NzTagModule } from "ng-zorro-antd/tag";
import { NzModalComponent, NzModalModule, NzModalService } from "ng-zorro-antd/modal";
import { NzAlertComponent } from "ng-zorro-antd/alert";
import { NzListModule } from "ng-zorro-antd/list";
import { FormsModule } from '@angular/forms';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';
import { NzButtonComponent, NzButtonModule } from 'ng-zorro-antd/button';
import { NzInputModule } from 'ng-zorro-antd/input';
import { CommonModule } from '@angular/common';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTypographyModule } from 'ng-zorro-antd/typography';

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

@Component({
  selector: 'app-student-selection',
  templateUrl: './selection.component.html',
  styleUrls: ['./selection.component.less'],
  imports: [
    FormsModule,
    CommonModule,
    NzCollapseModule,
    NzGridModule,
    NzButtonModule,
    NzInputModule,
    NzIconModule,
    NzFormItemComponent,
    NzFormLabelComponent,
    NzColDirective,
    NzSelectModule,
    NzTableModule,
    NzTagModule,
    NzModalModule,
    NzAlertComponent,
    NzListModule,
    NzTypographyModule
  ]
  ,
  providers: [NzModalService]
})
export class SelectionInbox implements OnInit {
  // Datos
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

  constructor(private message: NzMessageService) {}

  ngOnInit(): void {
    this.loadStudents();
  }

  loadStudents(): void {
    this.loading = true;
    // Simular carga de datos (reemplazar con llamada API real)
    setTimeout(() => {
      this.students = [
        {
          id: '1',
          rudeCode: 'R001',
          lastName1: 'Pérez',
          lastName2: 'Gómez',
          firstName: 'Juan',
          idCard: '1234567',
          criteria: 'CRITERIO_A',
          level: 'SECUNDARIA',
          schoolYear: '2023'
        },
                {
          id: '2',
          rudeCode: 'R002',
          lastName1: 'Vargas',
          lastName2: 'Ramirez',
          firstName: 'Leonel Maximo',
          idCard: '1234567',
          criteria: 'CRITERIO_A',
          level: 'SECUNDARIA',
          schoolYear: '2022'
        },
        // ... más datos de ejemplo
      ];
      this.filteredStudents = [...this.students];
      this.loading = false;
    }, 1000);
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

  selectStudent(student: Student): void {
    this.selectedStudent = student;
    this.isConfirmVisible = true;
  }

  handleCancel(): void {
    this.isConfirmVisible = false;
  }

  handleOk(): void {
    if (!this.selectedStudent) return;
    
    this.isConfirmLoading = true;
    // Simular procesamiento
    setTimeout(() => {
      this.selectedStudent!.selected = true;
      this.selectedStudents.push(this.selectedStudent!);
      this.isConfirmVisible = false;
      this.isConfirmLoading = false;
      this.message.success(`Estudiante ${this.selectedStudent?.firstName} seleccionado`);
    }, 800);
  }

  confirmSelection(): void {
    if (this.selectedStudents.length === 0) return;
    this.isConsolidateVisible = true;
  }

  handleConsolidateCancel(): void {
    this.isConsolidateVisible = false;
  }

  handleConsolidateOk(): void {
    this.isConsolidateLoading = true;
    // Simular consolidación
    setTimeout(() => {
      this.message.success(`${this.selectedStudents.length} estudiantes consolidados`);
      this.selectedStudents = [];
      this.isConsolidateVisible = false;
      this.isConsolidateLoading = false;
    }, 1000);
  }

  getCriteriaColor(criteria: string): string {
    switch (criteria) {
      case 'CRITERIO_A': return 'green';
      case 'CRITERIO_B': return 'orange';
      case 'CRITERIO_C': return 'red';
      default: return 'blue';
    }
  }
}