import { Component, inject, Inject, OnInit, signal } from '@angular/core';
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
import { LocalStorageService } from '../../../infrastructure/services/local-storage.service';
import IInstituionDetail from '../../../domain/ports/i-institution-detail';
import IManagerTeacher from '../../../domain/ports/i-manager-teacher';
import { switchMap, tap } from 'rxjs';

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
}
  // documentos: Documento[];

interface Documento {
  id: number;
  nombre: string;
  tipo: string;
  url: string;
}

interface EventoHistorial {
  fecha: Date;
  accion: string;
  responsable: string;
  comentario?: string;
}

@Component({
  selector: 'app-seguimiento',
  templateUrl: './follow-up.component.html',
  styleUrls: ['./follow-up.component.less'],
  imports: [
    FormsModule,
    NzCardModule,
    NzSpaceModule,
    NzTagModule,
    NzTabsModule,
    NzModalModule,
    NzDescriptionsModule,
    NzListModule,
    NzAvatarModule,
    NzSelectModule,
    NzTableModule,
    NzTabsModule,
    NzInputModule,
    NzTimePickerModule,
    NzDividerModule,
    CommonModule,
    NzTimelineModule,
    NzButtonComponent,
    NzIconModule,
    NzTypographyModule
  ]
})
export class SeguimientoComponent implements OnInit {
  searchValue = '';
  filterEstado: string | null = null;
  filterFecha: Date | null = null;
  loading = false;
  pageSize = 10;
  pageIndex = 1;
  total = 0;
  isVisibleModal = false;
  solicitudSeleccionada: Registration | null = null;

  RegistrationStatus = RegistrationStatus;
  registration = signal<Registration[]>([]);

  historial: EventoHistorial[] = [
    {
      fecha: new Date(2023, 5, 15, 10, 30),
      accion: 'Solicitud creada',
      responsable: 'Sistema',
      comentario: 'Solicitud ingresada al sistema'
    },
    {
      fecha: new Date(2023, 5, 15, 10, 30),
      accion: 'Solicitud creada',
      responsable: 'Sistema',
      comentario: 'Solicitud ingresada al sistema'
    },
  ];

  LocalStorageService = inject(LocalStorageService)

  constructor(
    private message: NzMessageService,
    private modal: NzModalService,
    @Inject('IHistory') private readonly _history: IHistory,
    @Inject('IHighDemand') private readonly _highDemand: IHighDemand,
    @Inject('IInstituionDetail') private _institution: IInstituionDetail,
    @Inject('IMangerTeacher') private _teacher: IManagerTeacher,
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

loadData(): void {
  this.loading = true;
  const user = this.LocalStorageService.getUser();
  const { personId } = user;

  this._teacher.getInfoTeacher(personId).pipe(
    switchMap(res => {
      const { educationalInstitutionId: sie } = res;
      return this._institution.getInfoInstitution(sie);
    }),
    switchMap(institution => {
      const { id } = institution;
      return this._highDemand.getHighDemandByInstitution(id);
    }),
    switchMap(highDemand => {
      return this._history.showList(highDemand.id);
    })
  ).subscribe({
    next: (history: any) => {
      this.registration.set(history.data); // asegurarme que history.data existe
      this.loading = false;
    },
    error: (err) => {
      console.error('Error cargando datos', err);
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

  verDetalle(solicitud: Registration): void {
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

  cancelarSolicitud(solicitud: Registration): void {
    this.modal.confirm({
      nzTitle: `¿Cancelar solicitud de ${solicitud.educationalInstitutionName}?`,
      nzContent: 'Esta acción no se puede deshacer',
      nzOkText: 'Sí, cancelar',
      nzOkType: 'primary',
      nzOkDanger: true,
      nzCancelText: 'No',
      nzOnOk: () => {
        solicitud.registrationStatus = RegistrationStatus.REJECTED;
        this.message.success('Solicitud cancelada');
      }
    });
  }

  getColorEstado(estado?: string): string {
    switch (estado) {
      case 'Aprobado': return 'success';
      case 'Rechazado': return 'error';
      case 'Observado': return 'warning';
      default: return 'processing';
    }
  }
}