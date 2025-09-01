import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzContentComponent, NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import IRoles from '../../../domain/ports/i-roles';

interface Permiso {
  id?: number;
  action: any;
  subject: string;
  condiciones?: any;
  activo: boolean;
  conditions?: Condition[];
}

interface Condition {
  field: string;
  operator: string;
  value: any;
}

interface User {
  id: number;
  nombre: string;
  email: string;
  roles: number[];
}

interface Role {
  id: number;
  name: string;
  // descripcion: string;
}

@Component({
  selector: 'app-access-control',
    imports: [
    CommonModule,
    FormsModule,
    NzCardModule,
    NzIconModule,
    NzButtonModule,
    NzTypographyModule,
    NzTableModule,
    NzInputModule,
    NzTagModule,
    NzDividerModule,
    NzModalModule,
    NzFormModule,
    NzSelectModule,
    NzSwitchModule,
    NzAlertModule,
    NzListModule,
    NzTableModule,
    NzTabsModule,
    NzLayoutModule
  ],
  templateUrl: './control-access.component.html',
  styleUrls: ['./control-acess.component.less']
})
export class AccessControlComponent implements OnInit {
  // Variables para la gestión de permisos
  searchText: string = '';
  filterEstado: string = 'all';
  isPermisoModalVisible: boolean = false;
  isEditingPermiso: boolean = false;
  currentPermiso: Permiso = {
    action: '',
    subject: '',
    activo: true,
    conditions: []
  };
  
  // Variables para la asignación de roles
  userSearchText: string = '';
  loadingUsers: boolean = false;
  
  // Datos de ejemplo (deberían venir de tu API)
  availableActions: string[] = ['create', 'read', 'update', 'delete', 'manage'];
  availableSubjects: string[] = ['Postulacion', 'Usuario', 'Rol', 'Reporte'];
  availableOperators: any[] = [
    { value: 'equals', label: 'Igual a' },
    { value: 'notEquals', label: 'Diferente de' },
    { value: 'in', label: 'En' },
    { value: 'notIn', label: 'No en' },
    { value: 'contains', label: 'Contiene' }
  ];
  availableFields: string[] = ['id', 'estado', 'userId', 'departamento'];
  
  availableRoles: Role[] = [
    { id: 1, name: 'DIRECTOR UNIDAD EDUCATIVA' },
    { id: 2, name: 'DISTRITAL' },
    { id: 3, name: 'DEPARTAMENTAL' },
    { id: 4, name: 'ROL VER' }
  ];
  
  users: User[] = [
    { id: 1, nombre: 'Juan Pérez', email: 'juan@educacion.edu', roles: [1] },
    { id: 2, nombre: 'María García', email: 'maria@educacion.edu', roles: [2] },
    { id: 3, nombre: 'Carlos López', email: 'carlos@educacion.edu', roles: [3] },
    { id: 4, nombre: 'Ana Martínez', email: 'ana@educacion.edu', roles: [4] }
  ];
  
  permisos: Permiso[] = [
    { id: 1, action: 'read', subject: 'Postulacion', activo: true },
    { id: 2, action: 'create', subject: 'Postulacion', condiciones: { departamento: 'La Paz' }, activo: true },
    { id: 3, action: 'update', subject: 'Postulacion', activo: true },
    { id: 4, action: 'delete', subject: 'Postulacion', condiciones: { rol: 'admin' }, activo: false }
  ];
  
  constructor(
    @Inject('IRoles') private _rol: IRoles
  ) { }
  
  ngOnInit(): void {
    // Cargar datos iniciales
    this.loadUsers();
    this.loadRoles();
  }

  // Filtrado de permisos
  get filteredPermisos(): Permiso[] {
    return this.permisos.filter(permiso => {
      const matchesSearch = permiso.subject.toLowerCase().includes(this.searchText.toLowerCase()) ||
                           permiso.action.toLowerCase().includes(this.searchText.toLowerCase());
      const matchesEstado = this.filterEstado === 'all' ||
                           (this.filterEstado === 'active' && permiso.activo) ||
                           (this.filterEstado === 'inactive' && !permiso.activo);
      return matchesSearch && matchesEstado;
    });
  }

  // Filtrado de usuarios
  get filteredUsers(): User[] {
    return this.users.filter(user => 
      user.nombre.toLowerCase().includes(this.userSearchText.toLowerCase()) ||
      user.email.toLowerCase().includes(this.userSearchText.toLowerCase())
    );
  }
  
  // Gestión de permisos
  showCreatePermisoModal(): void {
    this.isEditingPermiso = false;
    this.currentPermiso = {
      action: '',
      subject: '',
      activo: true,
      conditions: []
    };
    this.isPermisoModalVisible = true;
  }
  
  editPermiso(permiso: Permiso): void {
    this.isEditingPermiso = true;
    this.currentPermiso = { ...permiso };
    // Asegurarse de que conditions existe
    if (!this.currentPermiso.conditions) {
      this.currentPermiso.conditions = [];
    }
    this.isPermisoModalVisible = true;
  }
  
  closePermisoModal(): void {
    this.isPermisoModalVisible = false;
  }
  
  savePermiso(): void {
    // Aquí iría la lógica para guardar en la base de datos
    if (this.isEditingPermiso) {
      // Actualizar permiso existente
      const index = this.permisos.findIndex(p => p.id === this.currentPermiso.id);
      if (index !== -1) {
        this.permisos[index] = { ...this.currentPermiso };
      }
    } else {
      // Crear nuevo permiso
      const newId = Math.max(...this.permisos.map(p => p.id || 0)) + 1;
      this.permisos.push({ ...this.currentPermiso, id: newId });
    }
    
    this.isPermisoModalVisible = false;
  }
  
  togglePermisoStatus(permiso: Permiso): void {
    permiso.activo = !permiso.activo;
    // Aquí iría la lógica para actualizar en la base de datos
  }
  
  // Gestión de condiciones
  addCondition(): void {
    this.currentPermiso.conditions!.push({ field: '', operator: '', value: '' });
  }
  
  removeCondition(index: number): void {
    this.currentPermiso.conditions!.splice(index, 1);
  }
  
  // Gestión de usuarios y roles
  loadUsers(): void {
    this.loadingUsers = true;
    // Simular carga de usuarios desde API
    setTimeout(() => {
      this.loadingUsers = false;
    }, 1000);
  }
  
  updateUserRoles(user: User): void {
    // Aquí iría la lógica para actualizar los roles del usuario en la base de datos
    console.log(`Actualizando roles del usuario ${user.nombre}:`, user.roles);
  }
  
  // Utilidades
  getActionColor(action: string): string {
    const colors: {[key: string]: string} = {
      'create': 'blue',
      'read': 'green',
      'update': 'orange',
      'delete': 'red',
      'manage': 'purple'
    };
    return colors[action] || 'default';
  }
  
  adminRol(rol: string): void {
    console.log(`Administrando rol: ${rol}`);
    // Aquí podrías navegar a una página específica para administrar ese rol
  }

  loadRoles() {
    this._rol.showRoles().subscribe((response: any) => {
      console.log("roles: ", response)
      this.availableRoles = response.data
    })
  }

  getRoleColor(rolId: number): string {
    switch (rolId) {
      case 9: return '#ff4d4f';
      case 37: return '#fa8c16';
      case 38: return '#eb2f96';
      case 48: return '#52c41a';
      case 49: return '#1890ff';
      default: return '#1890ff';
    }
  }
}