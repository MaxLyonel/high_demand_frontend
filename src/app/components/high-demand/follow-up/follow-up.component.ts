import { Component, computed, inject, Inject, OnInit, signal, TemplateRef } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService, NzModalModule } from 'ng-zorro-antd/modal';
import { NzCardModule } from "ng-zorro-antd/card";
import { NzSpaceModule } from "ng-zorro-antd/space";
import { NzTagModule } from "ng-zorro-antd/tag";
import { NzTabsModule } from "ng-zorro-antd/tabs";
import { NzDescriptionsModule } from "ng-zorro-antd/descriptions";
import { NzListModule } from "ng-zorro-antd/list";
import { NzAvatarModule } from "ng-zorro-antd/avatar";
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzTableModule } from "ng-zorro-antd/table";
import { NzInputModule } from "ng-zorro-antd/input";
import { FormsModule } from '@angular/forms';
import { NzTimePickerModule } from 'ng-zorro-antd/time-picker';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { CommonModule } from '@angular/common';
import { NzTimelineModule } from 'ng-zorro-antd/timeline';
import { NzButtonComponent } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import IHistory from '../../../domain/ports/i-history';
import { RegistrationStatus } from '../../../domain/models/enum/registration-status.enum';
import IHighDemand from '../../../domain/ports/i-high-demand';
import { AppStore } from '../../../infrastructure/store/app.store';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { AbilityService } from '../../../infrastructure/services/ability.service';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import IManagerInstitution from '../../../domain/ports/i-manager-institution';
import ICourseList from '../../../domain/ports/i-course-list';
import EditModalComponent from '../shared/edit-modal.component';
import { NzAlertModule } from 'ng-zorro-antd/alert';

interface Registration {
  id: number;
  educationalInstitutionName: string;
  educationalInstitutionId: number;
  createdAt: Date;
  registrationStatus: RegistrationStatus
  workflowState: string,
  observation: string,
  updatedAt: Date;
  userName: string;
  rol: string;
  rolId: number;
  userId: number;
}


interface EventHistory {
  updatedAt: Date;
  registrationStatus: RegistrationStatus
  workflowState: string;
  userName: string;
  rol: string;
  observation?: string;
}

@Component({
  selector: 'app-seguimiento',
  templateUrl: './follow-up.component.html',
  styleUrls: ['./follow-up.component.less'],
  imports: [
    CommonModule,
    FormsModule,
    NzAvatarModule,
    NzButtonComponent,
    NzCardModule,
    NzDescriptionsModule,
    NzDividerModule,
    NzIconModule,
    NzInputModule,
    NzGridModule,
    NzListModule,
    NzModalModule,
    NzRadioModule,
    NzSelectModule,
    NzSpaceModule,
    NzTableModule,
    NzTabsModule,
    NzTabsModule,
    NzTagModule,
    NzTimelineModule,
    NzTimePickerModule,
    NzToolTipModule,
    NzTypographyModule,
    NzAlertModule,
    NzDatePickerModule,
    EditModalComponent
  ]
})
export class SeguimientoComponent implements OnInit {
  searchValue = signal('');
  filterEstado = signal<string | null>(null)
  filterStatusWorkflow = signal<string | null>(null)
  filterFecha =signal<Date | null>(null);

  loading = false;
  pageSize = 10;
  pageIndex = 1;
  total = 0;
  isVisibleModal = false;
  solicitudSeleccionada: Registration | null = null;


  appStore = inject(AppStore)
  historial: EventHistory[] = [];
  RegistrationStatus = RegistrationStatus;

  allRegistrations = signal<Registration[]>([])
  registration = signal<Registration[]>([]);

  abilitiesLoaded = signal(false);
  user!: any
  selectedRole!: any

  // *** variables para editar postulación ***
  institutionId!: any;

  // Computed signal para el filtrado reactivo
  filteredRegistrations = computed(() => {
    if(!this.abilitiesLoaded()) {
      return []
    }
    const all = [...this.registration()];
    const search = this.normalizeText(this.searchValue()?.trim() || '');
    const estado = this.normalizeText(this.filterEstado() || '');
    const fecha = this.filterFecha();
    const workflowState = this.normalizeText(this.filterStatusWorkflow() || '')

    return all.filter(reg => {
      if(!this.canViewRequest(reg)) {
        return false;
      }
      const name = this.normalizeText(reg.educationalInstitutionName);
      const sie = this.normalizeText(reg.educationalInstitutionId.toString());
      const status = this.normalizeText(reg.registrationStatus);
      const workflowStatus = this.normalizeText(reg.workflowState);

      const matchesSearch = !search || name.includes(search) || sie.includes(search);
      const matchesEstado = !estado || status === estado;
      const matchesWorkflow = !workflowState || workflowStatus === workflowState
      const matchesFecha = !fecha ||
        new Date(reg.updatedAt).toDateString() === fecha.toDateString();

      return matchesSearch && matchesEstado && matchesFecha && matchesWorkflow;
    });
  });

  cancellationMessage='Una vez que se anule la postulación, no podrá recuperase y no se enviará al Director Distrital para su revisión. ¿Está seguro de continuar?'

  constructor(
    private message: NzMessageService,
    private modal: NzModalService,
    public abilityService: AbilityService,
    @Inject('IHistory') private readonly _history: IHistory,
    @Inject('IHighDemand') private readonly _highDemand: IHighDemand,
    @Inject('IManagerInstitution') private _institution: IManagerInstitution,
    @Inject('ICourseList') private _courses: ICourseList
  ) {}

  ngOnInit(): void {
    const { user } = this.appStore.snapshot;
    this.user = user;
    this.abilityService.loadAbilities(user.userId).subscribe(() => {
      this.abilitiesLoaded.set(true);
      this.loadData();
    });
  }

  // loadData(): void {
  //   const { user } = this.appStore.snapshot
  //   this.user = user
  //   this.selectedRole = user.selectedRole
  //   this.loading = true;
  //   this.abilityService.loadAbilities(user.userId).pipe(
  //     switchMap(() => this._history.showGeneralList())
  //   ).subscribe({
  //     next: (response:any) => {
  //       const filtered = response.data.filter((r: Registration) => this.canViewRequest(r))
  //       this.registration.set([...filtered]);
  //       this.historial = [...filtered];
  //       this.loading = false;
  //     },
  //     error: (err) => {
  //       this.loading = false
  //     }
  //   })
  // }

  loadData(): void {
    const { user } = this.appStore.snapshot;
    this.user = user;
    this.selectedRole = user.selectedRole;
    this.loading = true;
    this._history.showGeneralList().subscribe({
      next: (response: any) => {
        this.registration.set([...response.data]);
        this.historial = [...response.data];
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
      }
    });
  }

  onQueryParamsChange(params: any): void {
    const { pageSize, pageIndex } = params;
    this.pageSize = pageSize;
    this.pageIndex = pageIndex;
    this.loadData();
  }

  seeDetail(solicitud: Registration): void {
    this.solicitudSeleccionada = solicitud;
    this.isVisibleModal = true;

    const { institutionInfo } = this.appStore.snapshot
    const { id: institutionId } = institutionInfo
    this.institutionId = institutionId
  }

  handleCancel(): void {
    this.isVisibleModal = false;
    this.loadData()
  }

  handleOk(): void {
    this.message.success('Acción confirmada');
    this.isVisibleModal = false;
    this.loadData()
  }

  descargarDocumentos(solicitud: any): void {
    this.message.info(`Descargando documentos de ${solicitud.unidadEducativa}`);
  }

  cancelRequest(request: any, tpl: TemplateRef<{}>): void {
    this.modal.confirm({
      nzTitle: `¿Está seguro de que quiere anular la postulación de la Unidad Educativa ${request.educationalInstitutionName}?`,
      // nzContent: 'Una vez que se anule la postulación, no podrá recuperase y no se enviará al Director Distrital para su revisión. ¿Está seguro de continuar?',
      nzContent: tpl,
      nzOkText: 'Sí, anular mi postulación',
      nzOkType: 'primary',
      nzOkDanger: true,
      nzCancelText: 'No',
      nzWidth: 600,
      nzOnOk: () => {
        this._highDemand.cancelHighDemand(request).subscribe(response => {
          this.loading = true;
          this._history.showList(request.highDemandRegistrationId).subscribe((history:any) => {
            this.registration.set(history.data); // asegurarme que history.data existe
            this.historial = history.data
            this.loading = false;
          })
        })
      }
    });
  }

  getColorEstado(state?: string): string {
    switch (state) {
      case 'APROBADO': return 'success';
      case 'RECHAZADO': return 'error';
      case 'ANULADA': return 'error';
      case 'OBSERVADO': return 'warning';
      default: return 'processing';
    }
  }

  // Funciones para la búsqueda
  private normalizeText(text: string): string {
    return text
      ? text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
      : '';
  }

  onSearchChange(value: string): void {
    this.searchValue.set(value)
  }

  onEstadoChange(value: string | null): void {
    this.filterEstado.set(value)
  }

  onFechaChange(value: Date | null): void {
    this.filterFecha.set(value)
  }

  onWorkflowStatusChange(value: string | null): void {
    this.filterStatusWorkflow.set(value)
  }

  // **  ============== ACCESOS ===================== **
  canViewAllRequests(): boolean {
    const subject = { __typename: 'history'}
    return this.abilityService.getAbility()?.can('manage', subject) || false;
  }

  canAnnularRequest(): boolean {
    const subject = { __typename: 'postulation' }
    return this.abilityService.can('delete', subject)
  }

  canUpdateRequest(): boolean {
    const subject = { __typename: 'postulation'}
    return this.abilityService.can('update', subject)
  }

  canDownloadRequest(request: Registration): boolean {
    const result = this.abilityService.getAbility()
      ?.can('read', { __typename: 'request-report', user_id: request.userId }) || false
    return result
  }

  canViewRequest(request: Registration): boolean {
    return true
  }

  canSeeOnlyRequest(request: Registration): boolean {
    if(request.rolId !== 37) { // Es distrital
      const subject = { __typename: 'history', educationalInstitutionId: request.educationalInstitutionId }
      return this.abilityService.can('read', subject)
    } else return false
  }
}