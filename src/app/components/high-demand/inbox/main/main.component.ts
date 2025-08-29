import { Component, inject, Inject, OnInit, TemplateRef } from '@angular/core';
import {
  NzTableQueryParams,
  NzTableComponent,
  NzTableModule,
} from 'ng-zorro-antd/table';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalLegacyAPI, NzModalService } from 'ng-zorro-antd/modal';
import { NzCardComponent } from 'ng-zorro-antd/card';
import { NzRadioComponent, NzRadioGroupComponent } from 'ng-zorro-antd/radio';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzTagComponent } from 'ng-zorro-antd/tag';
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
  name: string;
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
  course: any;
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
    NzToolTipModule,
  ],
  providers: [NzModalService],
})
export class BandejaComponent implements OnInit {
  // Datos de ejemplo
  highDemands: HighDemand[] = [];
  highDemandsReceive: HighDemand[] = [];

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
  rolId: number | null = null;

  appStore = inject(AppStore);
  actionRoles: Array<any> = [];
  motivo: any

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
    const { user } = this.appStore.snapshot;
    this.rolId = user.selectedRole.id;
    this._highDemand.getActionFromRoles(this.rolId!).subscribe((response) => {
      this.actionRoles = response.data;
    });
    this.highDemands = [];
    switch (type) {
      case 'entrada':
        setTimeout(() => {
          this._highDemand
            .getListHighDemandByRolState(this.rolId!, 1)
            .subscribe((response) => {
              this.highDemands = response.data;
            });
          this.loading = false;
        }, 300);
        break;
      case 'recepcion':
        setTimeout(() => {
          this._highDemand.getListReceive(this.rolId!).subscribe((response) => {
            this.highDemands = response.data;
          });
          this.loading = false;
        }, 300);
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
    const { id } = highDemand;
    this.modal.confirm({
      nzTitle: `¿Esta seguro que quiere recepcionar la Alta Damanda?`,
      nzContent: '',
      nzOkText: 'Sí, recepcionar',
      nzOkType: 'primary',
      nzOkDanger: false,
      nzCancelText: 'Cancelar',
      nzOnOk: () => {
        this._highDemand.receiveHighDemand(id).subscribe((response) => {
          this.message.success(`Recepcionado exitosamente`);
          this._highDemand
            .getListHighDemandByRolState(this.rolId!, 1)
            .subscribe((response) => {
              this.highDemands = response.data;
            });
        });
      },
    });
  }

  derive(highDemand: HighDemand, rolId: number): void {
    this.modal.confirm({
      nzTitle: `¿Derivar la Unidad Educativa de Alta Demanda ${highDemand.institution.name}?`,
      nzContent: 'Por favor revise bien si corresponde',
      nzOkText: 'Confirmar',
      nzCancelText: 'Cancelar',
      nzOnOk: () => {
        const obj = {
          highDemand: highDemand,
          rolId: rolId,
        };
        this._highDemand.deriveHighDemand(obj).subscribe((response) => {
          this.message.success(
            `Se ha derivado la Alta demanda de ${highDemand.institution.name}`
          );
          this._highDemand.getListReceive(this.rolId!).subscribe((response) => {
            this.highDemands = response.data;
          });
        });
      },
    });
  }

  back(highDemand: HighDemand, rolId: number, tpl: TemplateRef<{}>): void {
    let motivo = ''; // variable para guardar lo que escriba el usuario

    this.modal.confirm({
      nzTitle: `¿Devolver la alta demanda de ${highDemand.institution.name} a ${rolId}?`,
      nzContent: tpl,
      nzOkText: 'Confirmar',
      nzOkDanger: true,
      nzCancelText: 'Cancelar',
      nzOnOk: () => {
        const inputEl = document.getElementById(
          'motivoInput'
        ) as HTMLInputElement;
        motivo = inputEl?.value || '';
        const obj = {
          highDemand: highDemand,
          rolId: rolId,
          observation: motivo
        };

        this._highDemand.deriveHighDemand(obj).subscribe(() => {
          this.motivo = ''
          this.message.success(
            `Se ha devuelto la Alta demanda de ${highDemand.institution.name}`
          );
          this._highDemand.getListReceive(this.rolId!).subscribe((response) => {
            this.highDemands = response.data;
          });
        });
      },
    });
  }

  finalize(highDemand: HighDemand): void {
    this.modal.confirm({
      nzTitle: `¿Esta seguro de inscribir a la Unidad Educativa ${highDemand.institution.name} como alta demanda?`,
      nzContent: 'Por favor revise bien si corresponde',
      nzOkText: 'Confirmar',
      nzCancelText: 'Cancelar',
      nzOnOk: () => {
        const obj = {
          highDemand: highDemand,
        };
        this._highDemand.approveHighDemand(obj).subscribe((response) => {
          this.message.success(
            `Se ha registrado la Unidad Educativa ${highDemand.institution.name} como alta demanda`
          );
          this._highDemand.getListReceive(this.rolId!).subscribe((response) => {
            this.highDemands = response.data;
          });
        });
      },
    });
  }

  rejected(highDemand: HighDemand): void {
    this.modal.confirm({
      nzTitle: `¿Esta seguro de rechazar a la Unidad Educativa${highDemand.institution.name} como alta demanda?`,
      nzContent: 'Por favor revise bien si corresponde',
      nzOkText: 'Confirmar',
      nzCancelText: 'Cancelar',
      nzOnOk: () => {
        const obj = {
          highDemand: highDemand,
        };
        this._highDemand.declineHighDeamand(obj).subscribe((response) => {
          this.message.success(
            `Se ha rechzado la Unidad Educativa ${highDemand.institution.name} como alta demanda`
          );
          this._highDemand.getListReceive(this.rolId!).subscribe((response) => {
            this.highDemands = response.data;
          });
        });
      },
    });
  }

  verCursos(unidad: HighDemand): void {
    this.modal.info({
      nzTitle: `Cursos de ${unidad.institution.name}`,
      nzContent: `La unidad educativa tiene ${unidad.course} cursos registrados.`,
      nzOkText: 'Cerrar',
    });
  }

  // Métodos para cambiar entre bandejas
  changeInbox(type: 'entrada' | 'recepcion' | 'salida'): void {
    this.activeTray = type;
    this.loadData(type);
    this.message.info(`Mostrando bandeja de ${type}`);
  }
}
