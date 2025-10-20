import { Component, computed, inject, Inject, OnInit, signal } from '@angular/core';
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
import { switchMap } from 'rxjs';

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
    NzListModule,
    NzModalModule,
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
    NzDatePickerModule
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

  constructor(
    private message: NzMessageService,
    private modal: NzModalService,
    public abilityService: AbilityService,
    @Inject('IHistory') private readonly _history: IHistory,
    @Inject('IHighDemand') private readonly _highDemand: IHighDemand,
  ) {}

  ngOnInit(): void {
    const { user } = this.appStore.snapshot;
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
  }

  handleCancel(): void {
    this.isVisibleModal = false;
  }

  handleOk(): void {
    this.message.success('Acción confirmada');
    this.isVisibleModal = false;
  }

  descargarDocumentos(solicitud: any): void {
    this.message.info(`Descargando documentos de ${solicitud.unidadEducativa}`);
  }

  cancelRequest(request: any): void {
    this.modal.confirm({
      nzTitle: `¿Cancelar solicitud de ${request.educationalInstitutionName}?`,
      nzContent: 'Esta acción no se puede deshacer',
      nzOkText: 'Sí, cancelar',
      nzOkType: 'primary',
      nzOkDanger: true,
      nzCancelText: 'No',
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
    //! El recurso 'follow' (seguimiento) puede ser administrado
    //! siempre y cuando el Rol del usuario sea 'VER'
    return this.abilityService.getAbility()?.can('read', { __typename: 'history', rol_id: this.selectedRole?.id.toString()}) || false;
  }

  canAnnularRequest(request: Registration): boolean {
    const subject = { __typename: 'postulation', user_id: request.userId }
    return this.abilityService.can('delete', subject)
  }

  canDownloadRequest(request: Registration): boolean {
    const result = this.abilityService.getAbility()
      ?.can('read', { __typename: 'request-report', user_id: request.userId }) || false
    return result
  }

  canViewRequest(request: Registration): boolean {
    //! El recurso 'history' (historial) puede ser leido
    //! siempre y cuando el usuario (user_id) sea el propietario
    console.log("userId", request)
    const result =  this.abilityService.getAbility()
      ?.can('read', { __typename: 'history', user_id: request.userId}) || false;
    return result
  }

  canSeeOnlyRequest(request: Registration): boolean {
    if(request.rolId !== 37) { // Es distrital
      const subject = { __typename: 'history', educationalInstitutionId: request.educationalInstitutionId }
      return this.abilityService.can('read', subject)
    } else return false
  }

}