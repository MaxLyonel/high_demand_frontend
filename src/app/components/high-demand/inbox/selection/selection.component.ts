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
import { AppStore } from '../../../../infrastructure/store/app.store';
import IHighDemand from '../../../../domain/ports/i-high-demand';
import { finalize, switchMap } from 'rxjs';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { NzRadioModule } from 'ng-zorro-antd/radio';

// Las interfaces se mantienen igual...
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
  justification: string;
  criteriaPost: Criteria;
  selectedParallel: any;
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
    NzEmptyModule,
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
    NzRadioModule
  ],
  providers: [NzModalService]
})
export class SelectionInbox implements OnInit {
  // Datos
  preRegistrations: PreRegistration[] = [];
  filteredPreRegistrations: PreRegistration[] = [];
  selectedPostulant: PreRegistration | null = null;
  selectedPostulants: PreRegistration[] = [];

  // Selectores jerárquicos
  selectedLevel: number | null = null;
  selectedGrade: number | null = null;
  selectedParallel: number | null = null;

  availableGrades: Grade[] = [];
  availableParallels: Parallel[] = [];

  // Filtros
  filters = {
    rudeCode: '',
    lastName: '',
    firstName: '',
    idCard: '',
    criteria: null,
    justification: ''
  };

  // Estados
  loading = false;
  isConfirmVisible = false;
  isConfirmLoading = false;
  isConsolidateVisible = false;
  isConsolidateLoading = false;

  tempChecked: boolean = false;

  criterias: any[] = []
  levels: any[] = []
  highDemand: any
  sie: any;

  criteriaPost: any;

  constructor(
    private message: NzMessageService,
    private appStore: AppStore,
    private modal: NzModalService,
    @Inject('IPreRegistration') private _preRegistration: IPreRegistration,
    @Inject('IHighDemand') private _highDemand: IHighDemand
  ) {}

  ngOnInit(): void {
    const { institutionInfo } = this.appStore.snapshot
    const { id: sie } = institutionInfo
    this.sie = sie
    this.loadCriterias();
    this.loadLevels();
  }

  loadCriterias() {
    this._preRegistration.getCriterias().subscribe((response) => {
      this.criterias = response.data
    })
  }

  loadLevels() {
    this._highDemand.getHighDemandByInstitution(this.sie).pipe(
      switchMap((response: any) => {
        this.highDemand = response;
        return this._highDemand.getHighDemandLevels(this.highDemand.id);
      })
    ).subscribe({
      next: (response: any) => {
        this.levels = response.data;
      },
      error: (err) => {
        console.error('Error al cargar niveles:', err);
      }
    });
  }

  // Nuevos métodos para el flujo jerárquico
  onLevelChange(levelId: number | null): void {
    this.selectedGrade = null;
    this.selectedParallel = null;
    this.availableGrades = [];
    this.availableParallels = [];
    this.filteredPreRegistrations = [];
    if (!levelId) {
      console.warn("No se seleccionó ningún nivel");
      return;
    }
    const selectedLevel: any = this.levels.find((l: any) => l.id === levelId);

    if (selectedLevel) {
      this.availableGrades = selectedLevel.grades || [];
    } else {
      console.warn("No se encontró el nivel con id:", levelId);
    }
  }

  onGradeChange(gradeId: number | null): void {
    this.selectedParallel = null;
    this.availableParallels = [];
    this.filteredPreRegistrations = [];

    const parallels:any = this.availableGrades.find((g: any) => g.id === gradeId)
    this.availableParallels = parallels.parallels

    if (this.selectedLevel && this.selectedGrade) {
      this.loadPostulantsByCourse(this.selectedLevel, this.selectedGrade);
    }
  }

  // onParallelChange(parallelId: number | null): void {
  //   this.filteredPreRegistrations = [];

  //   if (parallelId && this.selectedLevel && this.selectedGrade) {
  //     this.loadPostulantsByCourse(this.selectedLevel, this.selectedGrade);
  //   }
  // }

  loadParallelsByLevelAndGrade(levelId: number, gradeId: number): void {
    this.loading = true;
    // Asumiendo que tienes un método para obtener paralelos por nivel y grado
    // this._preRegistration.getParallelsByLevelAndGrade(levelId, gradeId).subscribe({
    //   next: (response) => {
    //     this.availableParallels = response.data;
    //     this.loading = false;
    //   },
    //   error: (err) => {
    //     console.error('Error cargando paralelos', err);
    //     this.loading = false;
    //     this.message.error('Error al cargar los paralelos');
    //   }
    // });
  }

  loadPostulantsByCourse(levelId: number, gradeId: number): void {
    this.loading = true;

    this._preRegistration.getListValidPreRegistration(this.highDemand.id, levelId, gradeId).subscribe({
      next: response => {
        this.preRegistrations = response.data.map((p:any) => ({
          ...p,
          selected: p.state === 'ACEPTADO'
        }))
        this.filteredPreRegistrations = [...this.preRegistrations]
        this.loading = false;

        if (this.preRegistrations.length === 0) {
          this.message.info('No se encontraron estudiantes para el curso seleccionado');
        }
      },
      error: err => {
        console.error('Error cargando datos', err)
        this.loading = false
        this.message.error('Error al cargar los estudiantes');
      }
    })

    // this._highDemand.getHighDemandByInstitution(this.sie).pipe(
    //   // switchMap(response => {
    //   //   this.highDemand = response;
    //   //   // Asumiendo que tienes un método que filtra por curso específico
    //   //   // return this._preRegistration.getPreRegistrationsByCourse(
    //   //   //   this.highDemand.id,
    //   //   //   levelId,
    //   //   //   gradeId,
    //   //   //   parallelId
    //   //   // );
    //   // })
    // ).subscribe({
    //   next: preRegResponse => {
    //     this.preRegistrations = preRegResponse.data.map((p: any) => ({
    //       ...p,
    //       selected: p.state === 'ACEPTADO'
    //     }));
    //     this.filteredPreRegistrations = [...this.preRegistrations];
    //     this.loading = false;

    //     if (this.preRegistrations.length === 0) {
    //       this.message.info('No se encontraron estudiantes para el curso seleccionado');
    //     }
    //   },
    //   error: err => {
    //     console.error('Error cargando estudiantes', err);
    //     this.loading = false;
    //     this.message.error('Error al cargar los estudiantes');
    //   }
    // });
  }

  applyFilters(): void {
    if (this.preRegistrations.length === 0) return;

    this.filteredPreRegistrations = this.preRegistrations.filter(pr => {
      const p = pr.postulant;
      const c = pr.criteria;

      return (
        (!this.filters.rudeCode || (p.codeRude && p.codeRude.includes(this.filters.rudeCode))) &&
        (!this.filters.lastName ||
          p.lastName.toLowerCase().includes(this.filters.lastName.toLowerCase()) ||
          p.mothersLastName.toLowerCase().includes(this.filters.lastName.toLowerCase())) &&
        (!this.filters.firstName || p.name.toLowerCase().includes(this.filters.firstName.toLowerCase())) &&
        (!this.filters.idCard || (p.identityCard && p.identityCard.includes(this.filters.idCard))) &&
        (!this.filters.criteria || (c.id && c.id === this.filters.criteria)) &&
        (!this.filters.justification || 
          (pr.justification && pr.justification.toLowerCase().includes(this.filters.justification.toLowerCase())))
      );
    });
  }

  clearFilters(): void {
    this.filters = {
      rudeCode: '',
      lastName: '',
      firstName: '',
      idCard: '',
      criteria: null,
      justification: ''
    };
    
    // Si hay selección actual, recargar los estudiantes del curso
    if (this.selectedLevel && this.selectedGrade && this.selectedParallel) {
      this.filteredPreRegistrations = [...this.preRegistrations];
    } else {
      this.filteredPreRegistrations = [];
    }
  }

  clearAllSelections(): void {
    this.selectedLevel = null;
    this.selectedGrade = null;
    this.selectedParallel = null;
    this.availableGrades = [];
    this.availableParallels = [];
    this.preRegistrations = [];
    this.filteredPreRegistrations = [];
    this.selectedPostulants = [];
    this.clearFilters();
  }

  // handleCancel(): void {
  //   this.isConfirmVisible = false;
  //   this.criteriaPost = null;
  // }

  confirmSelection(): void {
    if (this.selectedPostulants.length === 0) return;
    this.isConsolidateVisible = true;
  }

  handleConsolidateCancel(): void {
    this.isConsolidateVisible = false;
  }

  handleConsolidateOk(): void {
    this.isConsolidateLoading = true;
    this._preRegistration.acceptPreRegistrations(this.selectedPostulants)
      .pipe(
        finalize(() => {
          this.isConfirmLoading = false
          this.isConsolidateVisible = false
          this.selectedPostulants = []
        })
      ).subscribe({
        next: response => {
          // Recargar los estudiantes del curso actual
          if (this.selectedLevel && this.selectedGrade && this.selectedParallel) {
            this.loadPostulantsByCourse(this.selectedLevel, this.selectedGrade);
          }
          this.message.success(`${this.selectedPostulants.length} estudiantes consolidados`);
        },
        error: err => {
          this.criteriaPost = null
          this.isConsolidateLoading = false;
        }
      })
  }

  getCriteriaColor(criteria: string): string {
    switch (criteria) {
      case 'HERMANOS': return 'green';
      case 'VIVIENDA': return 'orange';
      case 'LUGAR_TRABAJO': return 'red';
      default: return 'blue';
    }
  }

  // onToggleStudent(checked: boolean, postulant: any): void {
  //   this.selectedPostulant = postulant

  //   if(postulant.selected && !checked) {
  //     this.modal.confirm({
  //       nzTitle: '¿Desea deseleccionar este postulante?',
  //       nzContent: `El estudiante ${postulant.postulant.name} será removido de la selección.`,
  //       nzOkText: 'Sí, deseleccionar',
  //       nzCancelText: 'Cancelar',
  //       nzOnOk: () => {
  //         postulant.selected = false;
  //         this.selectedPostulants = this.selectedPostulants.filter(p => p.id !== postulant.id)
  //         this.message.info(`Postulante ${postulant.postulant.name} deseleccionado`)
  //       },
  //       nzOnCancel: () => {
  //         postulant.selected = true;
  //       }
  //     });
  //     return;
  //   }

  //   this.tempChecked = checked
  //   // postulant.selected = !checked;
  //   postulant.selected = true;
  //   this.isConfirmVisible = true;
  // }

  onToggleStudent(checked: boolean, postulant: any): void {
    // Si ya está seleccionado y quieren deseleccionar
    if (this.isPostulantSelected(postulant) && !checked) {
      this.modal.confirm({
        nzTitle: '¿Desea deseleccionar este postulante?',
        nzContent: `El estudiante ${postulant.postulant.name} será removido de la selección.`,
        nzOkText: 'Sí, deseleccionar',
        nzCancelText: 'Cancelar',
        nzOnOk: () => {
          this.uncheck()
          this.removePostulantFromSelection(postulant);
          this.message.info(`Postulante ${postulant.postulant.name} deseleccionado`);
        },
        nzOnCancel: () => {
          postulant.selected = true
        }
      });
      return;
    }
    // Si quieren seleccionar (checked = true)
    if (checked && !this.isPostulantSelected(postulant)) {
      this.selectedPostulant = postulant;
      this.isConfirmVisible = true;
    }
  }

  // Verifica si un postulante está seleccionado
  isPostulantSelected(postulant: any): boolean {
    return this.selectedPostulants.some(p => p.id === postulant.id);
  }

  // Remueve un postulante de la selección
  removePostulantFromSelection(postulant: any): void {
    this.selectedPostulants = this.selectedPostulants.filter(p => p.id !== postulant.id);
  }

  // Maneja el OK del diálogo de confirmación
  handleOk(): void {
    if (!this.selectedPostulant || !this.criteriaPost || !this.selectedParallel) {
      this.isConfirmVisible = false;
      return;
    }

    this.isConfirmLoading = true;
    // Asignar los valores seleccionados
    this.selectedPostulant.criteriaPost = this.criteriaPost;
    this.selectedPostulant.selectedParallel = this.selectedParallel;
    // Agregar a la selección solo si no está ya incluido
    if (!this.isPostulantSelected(this.selectedPostulant)) {
      this.selectedPostulants.push(this.selectedPostulant);
    }
    this.isConfirmVisible = false;
    this.isConfirmLoading = false;
    this.message.success(`Postulante ${this.selectedPostulant.postulant.name} seleccionado`);
    // Limpiar selección temporal
    this.selectedPostulant = null;
    this.criteriaPost = null;
    this.selectedParallel = null;
  }

  uncheck() {
    const res: PreRegistration | undefined = this.filteredPreRegistrations.find(p => {
      return p?.postulant?.id == this.selectedPostulant?.postulant?.id
    })
    if(res) {
      res.selected = false
    }
  }
  check() {
    const res: PreRegistration | undefined = this.filteredPreRegistrations.find(p => {
      return p?.postulant?.id == this.selectedPostulant?.postulant?.id
    })
    if(res) {
      res.selected = true
    }

  }

// Maneja el cancelar del diálogo
  handleCancel(): void {
    this.uncheck()
    this.isConfirmVisible = false;
    this.selectedPostulant = null;
    this.criteriaPost = null;
    this.selectedParallel = null;
  }
}