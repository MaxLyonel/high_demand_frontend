import { Component, inject, Inject, OnInit } from '@angular/core';
import { NzTableQueryParams, NzTableComponent, NzTableModule } from 'ng-zorro-antd/table';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalLegacyAPI, NzModalService } from 'ng-zorro-antd/modal';
import { NzCardComponent } from "ng-zorro-antd/card";
import { NzRadioComponent, NzRadioGroupComponent } from "ng-zorro-antd/radio";
import { NzButtonModule } from "ng-zorro-antd/button";
import { NzSpaceModule } from "ng-zorro-antd/space";
import { NzTagComponent } from "ng-zorro-antd/tag";
import { FormsModule } from '@angular/forms';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import IHighDemand from '../../../../domain/ports/i-high-demand';
import { AppStore } from '../../../../infrastructure/store/app.store';

import { NzToolTipModule } from 'ng-zorro-antd/tooltip';

interface Institution {
  id: number;
  name: string;
}

interface User {
  id: number;
  username: number;
}

interface WorkflowState {
  id: number;
  name: string;
}

interface Rol {
  id: number;
  name: string
}

interface HighDemand {
  id: number;
  institution: Institution;
  user: User;
  workflowState: WorkflowState;
  workflow: number;
  registrationStatus: string;
  inbox: boolean;
  rol: Rol;
  course: any
}

@Component({
  selector: 'app-bandeja',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.less'],
  imports: [
    FormsModule,
    NzCardComponent,
    NzRadioGroupComponent,
    NzButtonModule,
    NzSpaceModule,
    NzTableModule,
    NzTagComponent,
    NzRadioComponent,
    NzInputModule,
    NzIconModule,
    NzTypographyModule,
    NzToolTipModule
  ],
  providers: [NzModalService]
})
export class BandejaComponent implements OnInit {
  // Datos de ejemplo
  highDemands: HighDemand[] = [];

  // Configuración de paginación
  pageSize = 10;
  pageIndex = 1;
  total = 50;
  loading = false;

  // Filtros
  filterEstado: string[] = [];
  filterEstadoFlujo: string[] = [];
  searchValue = '';

  // Tipo de bandeja activa
  activeTray: 'entrada' | 'recepcion' | 'salida' = 'entrada';

  appStore = inject(AppStore)

  constructor(
    private message: NzMessageService,
    private modal: NzModalService,
    @Inject('IHighDemand') private _highDemand: IHighDemand
  ) {}

  ngOnInit(): void {

    this.loadData(this.activeTray);
  }

  loadData(type: string): void {
    this.loading = true;
    const { user } = this.appStore.snapshot
    const rolId = user.roles[0].id
    this.highDemands = []
    switch(type) {
      case 'entrada':
        setTimeout(() => {
          this._highDemand.getListHighDemandByRolState(rolId, 1).subscribe((response) => {
            this.highDemands = response.data
          })
          this.loading = false;
        }, 300);
        break;
      case 'recepcion':
        setTimeout(() => {
          this.loading = false;
        }, 1000)
        break;
      case 'salida':
        setTimeout(() => {
          this.loading = false;
        }, 1000)
        break;
    }
  }

  onQueryParamsChange(params: NzTableQueryParams): void {
    const { pageSize, pageIndex } = params;
    this.pageSize = pageSize;
    this.pageIndex = pageIndex;
    this.loadData(this.activeTray);
  }

  // Métodos para acciones
  receive(highDemand: HighDemand): void {
    const { id } = highDemand
    this._highDemand.receiveHighDemand(id).subscribe((response) => {
      console.log("se ejecuto exitosamente")
    })
  }

  enviar(unidad: HighDemand): void {
    this.message.success(`Se envió la unidad educativa ${unidad.institution.name}`);
  }

  observar(unidad: HighDemand): void {
    this.modal.confirm({
      nzTitle: `¿Observar la unidad educativa ${unidad.institution.name}?`,
      nzContent: 'Ingrese el motivo de la observación:',
      nzOkText: 'Confirmar',
      nzCancelText: 'Cancelar',
      nzOnOk: () => this.message.success(`Observación enviada para ${unidad.institution.name}`)
    });
  }

  anular(unidad: HighDemand): void {
    this.modal.confirm({
      nzTitle: `¿Anular la unidad educativa ${unidad.institution.name}?`,
      nzContent: 'Esta acción no se puede deshacer',
      nzOkText: 'Sí, anular',
      nzOkType: 'primary',
      nzOkDanger: true,
      nzCancelText: 'Cancelar',
      nzOnOk: () => this.message.success(`Unidad ${unidad.institution.name} anulada`)
    });
  }

  verCursos(unidad: HighDemand): void {
    this.modal.info({
      nzTitle: `Cursos de ${unidad.institution.name}`,
      nzContent: `La unidad educativa tiene ${unidad.course} cursos registrados.`,
      nzOkText: 'Cerrar'
    });
  }

  // Métodos para cambiar entre bandejas
  changeInbox(type: 'entrada' | 'recepcion' | 'salida'): void {
    this.activeTray = type;
    this.loadData(type);
    this.message.info(`Mostrando bandeja de ${type}`);
  }
}