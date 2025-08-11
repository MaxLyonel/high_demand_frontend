import { Component, OnInit } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Router } from '@angular/router';
import { NzLayoutComponent, NzSiderComponent, NzHeaderComponent, NzContentComponent } from "ng-zorro-antd/layout";
import { NzAvatarComponent } from "ng-zorro-antd/avatar";
import { NzCardComponent } from "ng-zorro-antd/card";
import { NzListModule } from "ng-zorro-antd/list";
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { CommonModule } from '@angular/common';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzButtonComponent, NzButtonModule } from 'ng-zorro-antd/button';

interface Activity {
  user: string;
  action: string;
  time: Date;
  avatar: string;
}

interface Stats {
  institutions: number;
  newApplications: number;
  pendingReviews: number;
  completedProcesses: number;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.less'],
  imports: [
    CommonModule,
    NzBadgeModule,
    NzDropDownModule,
    NzBreadCrumbModule,
    NzIconModule,
    NzButtonModule,
    NzLayoutComponent,
    NzSiderComponent,
    NzHeaderComponent,
    NzAvatarComponent,
    NzContentComponent,
    NzCardComponent,
    NzListModule
  ]
})
export class DashboardComponent implements OnInit {
  isCollapsed = false;
  selectedMenu = 'dashboard';
  currentUser = { name: 'Admin User', role: 'Administrador' };
  
  stats: Stats = {
    institutions: 42,
    newApplications: 15,
    pendingReviews: 8,
    completedProcesses: 37
  };

  recentActivities: Activity[] = [
    {
      user: 'Juan Pérez',
      action: 'Registró una nueva unidad educativa',
      time: new Date(Date.now() - 1000 * 60 * 5),
      avatar: 'https://randomuser.me/api/portraits/men/1.jpg'
    },
    {
      user: 'María Gómez',
      action: 'Revisó la postulación #12345',
      time: new Date(Date.now() - 1000 * 60 * 30),
      avatar: 'https://randomuser.me/api/portraits/women/1.jpg'
    },
    {
      user: 'Carlos Rojas',
      action: 'Aprobó la unidad educativa "San Calixto"',
      time: new Date(Date.now() - 1000 * 60 * 60 * 2),
      avatar: 'https://randomuser.me/api/portraits/men/2.jpg'
    },
    {
      user: 'Ana Fernández',
      action: 'Generó el reporte mensual',
      time: new Date(Date.now() - 1000 * 60 * 60 * 5),
      avatar: 'https://randomuser.me/api/portraits/women/2.jpg'
    }
  ];

  constructor(
    private message: NzMessageService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Aquí puedes cargar datos reales desde tu API
  }

  selectMenu(menu: string): void {
    this.selectedMenu = menu;
    if (menu !== 'dashboard') {
      this.router.navigate([menu]);
    }
  }

  goTo(route: string): void {
    this.router.navigate([route]);
  }

  logout(): void {
    this.message.success('Sesión cerrada correctamente');
    // Aquí iría la lógica real de logout
    this.router.navigate(['/login']);
  }
}