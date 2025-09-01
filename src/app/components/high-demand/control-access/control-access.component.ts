import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import IRoles from '../../../domain/ports/i-roles';
import IPermission from '../../../domain/ports/i-permission';

interface Action {
  id: number,
  name: string
}

interface Subject {
  id: number,
  name: string
}

interface Permission {
  id?: number;
  action: Action | null;
  subject: Subject | null;
  condiciones?: any;
  active: boolean;
  description: string,
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
  permissions: Permission[];
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
  filterStatus: string = 'all';
  isPermissionModalVisible: boolean = false;
  isEditingPermission: boolean = false;
  currentPermission: Permission = {
    action: null,
    subject: null,
    active: true,
    description: '',
    conditions: []
  };

  // Variables para la asignación de roles
  userSearchText: string = '';
  loadingUsers: boolean = false;

  // Datos de ejemplo (deberían venir de tu API)
  availableActions: Action[] = [];
  availableSubjects: Subject[] = [];
  availableOperators: any[] = [];
  availableFields: string[] = [];

  availableRoles: Role[] = [];

  users: User[] = [
    { id: 1, nombre: 'Juan Pérez', email: 'juan@educacion.edu', roles: [1] },
    { id: 2, nombre: 'María García', email: 'maria@educacion.edu', roles: [2] },
    { id: 3, nombre: 'Carlos López', email: 'carlos@educacion.edu', roles: [3] },
    { id: 4, nombre: 'Ana Martínez', email: 'ana@educacion.edu', roles: [4] }
  ];

  permissions: Permission[] = [];

  loadingTable: boolean = false
  selectedRole: any

  constructor(
    @Inject('IRoles') private _rol: IRoles,
    @Inject('IPermission') private _permission: IPermission
  ) {}

  ngOnInit(): void {
    this.loadUsers();
    this.loadRoles();
    this.loadActions();
    this.loadResources();
    this.loadOperators();
    this.loadFields();
  }

  // ** Gestión de roles **
  loadRoles() {
    this._rol.showRoles().subscribe((response: any) => {
      this.availableRoles = response.data
      this.selectedRole = this.availableRoles[0]
      this.permissions = this.availableRoles[0].permissions
    })
  }

  adminRol(rol: Role): void {
    this.loadingTable = true
    this.selectedRole = rol
    setTimeout(() => {
      const indexFindedRol = this.availableRoles.findIndex(r => r.id == rol.id)
      this.permissions = this.availableRoles[indexFindedRol].permissions
      this.loadingTable = false
    }, 300)
  }

  // ** Gestión de permisos **
  loadActions() {
    this._permission.getActions().subscribe((response: any) => {
      this.availableActions = response.data
    })
  }

  loadResources() {
    this._permission.getResources().subscribe((response: any) => {
      this.availableSubjects = response.data
    })
  }

  loadOperators() {
    this._permission.getOperators().subscribe((response: any) => {
      this.availableOperators = response.data.map((e:any) => e.unnest)
    })
  }

  loadFields() {
    this._permission.getFields().subscribe((response: any) => {
      this.availableFields = response.data.map((e: any) => e.column_name)
    })
  }

  get filteredPermisos(): Permission[] {
    return this.permissions.filter(permission => {
      const matchesSearch = permission.subject?.name.toLowerCase().includes(this.searchText.toLowerCase()) ||
                           permission.action?.name.toLowerCase().includes(this.searchText.toLowerCase());
      const matchesEstado = this.filterStatus === 'all' ||
                           (this.filterStatus === 'active' && permission.active) ||
                           (this.filterStatus === 'inactive' && !permission.active);
      return matchesSearch && matchesEstado;
    });
  }

  showCreatePermisoModal(): void {
    this.isEditingPermission = false;
    this.currentPermission = {
      action: null,
      subject: null,
      active: true,
      description: '',
      conditions: []
    };
    this.isPermissionModalVisible = true;
  }

  editPermiso(permission: Permission): void {
    this.isEditingPermission = true;
    this.currentPermission = { ...permission };
    if (!this.currentPermission.conditions) {
      this.currentPermission.conditions = [];
    }
    this.isPermissionModalVisible = true;
  }

  closePermissionModal(): void {
    this.isPermissionModalVisible = false;
  }

  savePermission(): void {
    if (this.isEditingPermission) {
      // Actualizar permiso existente
      const index = this.permissions.findIndex(p => p.id === this.currentPermission.id);
      if (index !== -1) {
        this.permissions[index] = { ...this.currentPermission };
      }
    } else {
      // Crear nuevo permiso
      const newId = Math.max(...this.permissions.map(p => p.id || 0)) + 1;
      const newObj = {
        rol: this.selectedRole,
        ...this.currentPermission
      }
      this._permission.createPermission(newObj).subscribe({
        next: response => {
          console.log("Creación de permiso exitoso: ", response)
        }
      })
      this.permissions.push({ ...this.currentPermission, id: newId });
    }

    this.isPermissionModalVisible = false;
  }

  togglePermisoStatus(permission: Permission): void {
    permission.active = !permission.active;
    const permissionProp = {
      ...permission,
      rolId: this.selectedRole.id
    }
    this._permission.changePermissionStatus(permissionProp).subscribe(() => {
      this.loadRoles()
    })
  }

  // ** Gestión de condiciones **
  addCondition(): void {
    this.currentPermission.conditions!.push({ field: '', operator: '', value: '' });
  }

  removeCondition(index: number): void {
    this.currentPermission.conditions!.splice(index, 1);
  }

  // ** Gestión de usuarios **
  get filteredUsers(): User[] {
    return this.users.filter(user =>
      user.nombre.toLowerCase().includes(this.userSearchText.toLowerCase()) ||
      user.email.toLowerCase().includes(this.userSearchText.toLowerCase())
    );
  }

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

  // ** Utilidades **
  getActionColor(action: string | null | undefined): string {
    if(action == null) return 'default'
    const colors: {[key: string]: string} = {
      'create': 'blue',
      'read': 'green',
      'update': 'orange',
      'delete': 'red',
      'manage': 'purple'
    };
    return colors[action] || 'default';
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