import { Component, OnInit } from '@angular/core';
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

interface UnidadEducativa {
  id: number;
  nombre: string;
  sie: string;
  cursos: number;
  estado: 'Activo' | 'Inactivo' | 'Pendiente';
  estadoFlujo: 'En revisión' | 'Aprobado' | 'Rechazado' | 'Observado';
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
    NzTypographyModule
  ],
  providers: [NzModalService]
})
export class BandejaComponent implements OnInit {
  // Datos de ejemplo
  unidadesEducativas: UnidadEducativa[] = [
    {
      id: 1,
      nombre: 'Colegio Nacional Mixto "San Calixto"',
      sie: '12345',
      cursos: 12,
      estado: 'Activo',
      estadoFlujo: 'Aprobado'
    },
    {
      id: 2,
      nombre: 'Unidad Educativa "San Ignacio"',
      sie: '54321',
      cursos: 8,
      estado: 'Pendiente',
      estadoFlujo: 'En revisión'
    },
    {
      id: 3,
      nombre: 'Colegio Don Bosco',
      sie: '98765',
      cursos: 15,
      estado: 'Activo',
      estadoFlujo: 'Observado'
    },
    {
      id: 4,
      nombre: 'Liceo Militar "Tte. Edmundo Andrade"',
      sie: '45678',
      cursos: 10,
      estado: 'Inactivo',
      estadoFlujo: 'Rechazado'
    },
    {
      id: 5,
      nombre: 'Colegio La Salle',
      sie: '34567',
      cursos: 14,
      estado: 'Activo',
      estadoFlujo: 'Aprobado'
    }
  ];

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
  activeBandeja: 'entrada' | 'recepcion' | 'salida' = 'entrada';

  constructor(
    private message: NzMessageService,
    private modal: NzModalService
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.loading = true;
    // Simular carga de datos
    setTimeout(() => {
      this.loading = false;
    }, 1000);
  }

  onQueryParamsChange(params: NzTableQueryParams): void {
    const { pageSize, pageIndex } = params;
    this.pageSize = pageSize;
    this.pageIndex = pageIndex;
    this.loadData();
  }

  // Métodos para acciones
  enviar(unidad: UnidadEducativa): void {
    this.message.success(`Se envió la unidad educativa ${unidad.nombre}`);
  }

  observar(unidad: UnidadEducativa): void {
    this.modal.confirm({
      nzTitle: `¿Observar la unidad educativa ${unidad.nombre}?`,
      nzContent: 'Ingrese el motivo de la observación:',
      nzOkText: 'Confirmar',
      nzCancelText: 'Cancelar',
      nzOnOk: () => this.message.success(`Observación enviada para ${unidad.nombre}`)
    });
  }

  anular(unidad: UnidadEducativa): void {
    this.modal.confirm({
      nzTitle: `¿Anular la unidad educativa ${unidad.nombre}?`,
      nzContent: 'Esta acción no se puede deshacer',
      nzOkText: 'Sí, anular',
      nzOkType: 'primary',
      nzOkDanger: true,
      nzCancelText: 'Cancelar',
      nzOnOk: () => this.message.success(`Unidad ${unidad.nombre} anulada`)
    });
  }

  verCursos(unidad: UnidadEducativa): void {
    this.modal.info({
      nzTitle: `Cursos de ${unidad.nombre}`,
      nzContent: `La unidad educativa tiene ${unidad.cursos} cursos registrados.`,
      nzOkText: 'Cerrar'
    });
  }

  // Métodos para cambiar entre bandejas
  cambiarBandeja(tipo: 'entrada' | 'recepcion' | 'salida'): void {
    this.activeBandeja = tipo;
    this.loadData();
    this.message.info(`Mostrando bandeja de ${tipo}`);
  }
}