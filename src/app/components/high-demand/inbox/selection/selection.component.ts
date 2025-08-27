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
import { switchMap } from 'rxjs';

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

  // Filtros
  filters = {
    rudeCode: '',
    lastName: '',
    firstName: '',
    idCard: '',
    criteria: null,
    level: null,
    schoolYear: ''
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

  constructor(
    private message: NzMessageService,
    private appStore: AppStore,
    @Inject('IPreRegistration') private _preRegistration: IPreRegistration,
    @Inject('IHighDemand') private _highDemand: IHighDemand
  ) {}

  ngOnInit(): void {
    const { institutionInfo } = this.appStore.snapshot
    const { id: sie } = institutionInfo
    this.loadCriterias();
    this.loadLevels();
    this.loadPostulants(sie);
  }

  loadCriterias() {
    this._preRegistration.getCriterias().subscribe((response) => {
      this.criterias = response.data
    })
  }

  loadLevels() {
    this._preRegistration.getLevels().subscribe((response) => {
      this.levels = response.data
    })
  }

  loadPostulants(sie: number) {
    this._highDemand.getHighDemandByInstitution(sie).pipe(
      switchMap(response => {
        this.highDemand = response
        return this._preRegistration.getListPreRegistration(this.highDemand.id);
      })
    ).subscribe({
      next: preRegResponse => {
        this.preRegistrations = preRegResponse.data;
        this.filteredPreRegistrations = [...this.preRegistrations];
        this.loading = false;
      },
      error: err => {
        console.error('Error cargando datos', err)
        this.loading = false
      }
    })
  }

  applyFilters(): void {
    this.filteredPreRegistrations = this.preRegistrations.filter(pr => {
      const p = pr.postulant;
      const c = pr.criteria;
      const hc = pr.highDemandCourse;

      return (
        (!this.filters.rudeCode || (p.codeRude && p.codeRude.includes(this.filters.rudeCode))) &&
        (!this.filters.lastName ||
          p.lastName.toLowerCase().includes(this.filters.lastName.toLowerCase()) ||
          p.mothersLastName.toLowerCase().includes(this.filters.lastName.toLowerCase())) &&
        (!this.filters.firstName || p.name.toLowerCase().includes(this.filters.firstName.toLowerCase())) &&
        (!this.filters.idCard || (p.identityCard && p.identityCard.includes(this.filters.idCard))) &&
        (!this.filters.criteria || (c.id && c.id === this.filters.criteria)) &&
        (!this.filters.level || (hc.level.id && hc.level.id === this.filters.level)) &&
        (!this.filters.schoolYear || (hc.grade.name && hc.grade.name === this.filters.schoolYear))
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
      level: null,
      schoolYear: ''
    };
    this.filteredPreRegistrations = [...this.preRegistrations];
  }

  handleCancel(): void {
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
  }
}