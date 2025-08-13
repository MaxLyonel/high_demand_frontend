import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzMessageModule, NzMessageService } from 'ng-zorro-antd/message';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzTypographyComponent, NzTypographyModule } from 'ng-zorro-antd/typography';

interface Permiso {
  id: number;
  descriptor: string;
  admio: boolean;
  activo: boolean;
}

interface UnidadEducativa {
  id: number;
  nombre: string;
  permisos: number;
  estado: string;
}

@Component({
  selector: 'app-permisos-admin',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NzCardModule,
    NzRadioModule,
    NzInputModule,
    NzButtonModule,
    NzIconModule,
    NzTableModule,
    NzTagModule,
    NzSwitchModule,
    NzSpaceModule,
    NzModalModule,
    NzFormModule,
    NzMessageModule,
    NzTypographyModule
  ],
  templateUrl: './permisos-admin.component.html',
  styleUrls: ['./permisos-admin.component.less']
})
export class PermisosAdminComponent implements OnInit {
  isSuperAdmin = true;
  activeTab: string = 'permisos';
  searchValue: string = '';
  filterActivo: boolean = false;
  
  permisos: Permiso[] = [
    { id: 1, descriptor: 'Crea Babilianu', admio: true, activo: true },
    { id: 2, descriptor: 'Edita Usuarios', admio: true, activo: true },
    { id: 3, descriptor: 'Gestiona Unidades', admio: true, activo: false }
  ];
  
  unidadesEducativas: UnidadEducativa[] = [
    { id: 1, nombre: 'Distrito Unidad E.', permisos: 5, estado: 'Activo' },
    { id: 2, nombre: 'Alumnos Físicos Av.', permisos: 3, estado: 'Activo' },
    { id: 3, nombre: 'Av. U. E.', permisos: 5, estado: 'Activo' },
    { id: 4, nombre: 'Distrito L.', permisos: 5, estado: 'Activo' },
    { id: 5, nombre: 'Apoderadores', permisos: 5, estado: 'Activo' }
  ];
  
  permisoForm: FormGroup;
  isVisible = false;
  isConfirmLoading = false;

  constructor(private fb: FormBuilder, private message: NzMessageService) {
    this.permisoForm = this.fb.group({
      descriptor: [''],
      admio: [false],
      activo: [true]
    });
  }

  ngOnInit(): void {}

  cambiarTab(tab: string): void {
    this.activeTab = tab;
  }

  showModal(): void {
    this.isVisible = true;
  }

  handleOk(): void {
    this.isConfirmLoading = true;
    setTimeout(() => {
      const newPermiso: Permiso = {
        id: this.permisos.length + 1,
        descriptor: this.permisoForm.value.descriptor,
        admio: this.permisoForm.value.admio,
        activo: this.permisoForm.value.activo
      };
      this.permisos = [...this.permisos, newPermiso];
      this.isVisible = false;
      this.isConfirmLoading = false;
      this.permisoForm.reset();
      this.message.success('Permiso creado exitosamente');
    }, 1000);
  }

  handleCancel(): void {
    this.isVisible = false;
    this.permisoForm.reset();
  }

  cambiarEstadoPermiso(permiso: Permiso): void {
    permiso.activo = !permiso.activo;
    this.message.success(`Permiso ${permiso.activo ? 'activado' : 'desactivado'}`);
  }

  get filteredPermisos(): Permiso[] {
    let result = [...this.permisos];
    
    if (this.searchValue) {
      result = result.filter(p => 
        p.descriptor.toLowerCase().includes(this.searchValue.toLowerCase())
      );
    }
    
    if (this.filterActivo) {
      result = result.filter(p => p.activo);
    }
    
    return result;
  }

  get filteredUnidades(): UnidadEducativa[] {
    let result = [...this.unidadesEducativas];
    
    if (this.searchValue) {
      result = result.filter(u => 
        u.nombre.toLowerCase().includes(this.searchValue.toLowerCase())
      );
    }
    
    return result;
  }
}