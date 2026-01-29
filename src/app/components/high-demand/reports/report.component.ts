import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzProgressModule } from 'ng-zorro-antd/progress';
import { NzSpinModule } from 'ng-zorro-antd/spin';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.less'],
  imports: [
    CommonModule,
    FormsModule,
    NzSelectModule,
    NzDatePickerModule,
    NzButtonModule,
    NzCardModule,
    NzIconModule,
    NzAlertModule,
    NzProgressModule,
    NzSpinModule
  ]
})
export class ReportComponent implements OnInit {
  // Estados de la aplicación
  isLoading = false;
  isGenerating = false;
  generationProgress = 0;
  
  // Datos de filtros
  reportTypes = [
    // { id: 'general', name: 'Reporte General del Proceso', icon: 'pie-chart' },
    // { id: 'postulacion', name: 'Postulaciones por UE', icon: 'bank' },
    // { id: 'distrital', name: 'Revisión Distrital', icon: 'global' },
    // { id: 'departamental', name: 'Revisión Departamental', icon: 'environment' },
    // { id: 'operativo', name: 'Operativo Padres de Familia', icon: 'team' },
    { id: 'sorteo', name: 'Resultados de Sorteo', icon: 'gift' },
    // { id: 'estadisticas', name: 'Estadísticas Detalladas', icon: 'bar-chart' },
    // { id: 'comparativo', name: 'Comparativo por Año', icon: 'line-chart' }
  ];

  formatOptions = [
    { value: 'excel', label: 'Excel (.xlsx)', icon: 'file-excel' },
    { value: 'csv', label: 'CSV (.csv)', icon: 'file-text' },
    // { value: 'pdf', label: 'PDF (.pdf)', icon: 'file-pdf' }
  ];

  timeRangeOptions = [
    // { value: 'today', label: 'Hoy' },
    // { value: 'week', label: 'Esta semana' },
    // { value: 'month', label: 'Este mes' },
    // { value: 'quarter', label: 'Este trimestre' },
    { value: 'custom', label: 'Personalizado' }
  ];

  departmentOptions = [
    { value: 'all', label: 'Todos los departamentos' },
    { value: 'lp', label: 'La Paz' },
    { value: 'sc', label: 'Santa Cruz' },
    { value: 'cb', label: 'Cochabamba' },
    { value: 'or', label: 'Oruro' },
    { value: 'pt', label: 'Potosí' },
    { value: 'tj', label: 'Tarija' },
    { value: 'ch', label: 'Chuquisaca' },
    { value: 'bn', label: 'Beni' },
    { value: 'pn', label: 'Pando' }
  ];

  // Valores seleccionados
  selectedReportType = this.reportTypes[0];
  selectedFormat = 'excel';
  selectedTimeRange = 'month';
  selectedDepartments = ['all'];
  includeCharts = true;
  includeRawData = true;
  
  // Fechas personalizadas
  customStartDate: Date | null = null;
  customEndDate: Date | null = null;
  
  // Historial de reportes
  reportHistory = [
    { 
      id: 1, 
      name: 'Reporte General Abril 2025', 
      type: 'general', 
      date: '2025-04-28', 
      size: '2.4 MB', 
      status: 'completed',
      downloadCount: 15
    },
    { 
      id: 2, 
      name: 'Postulaciones UE La Paz', 
      type: 'postulacion', 
      date: '2025-04-25', 
      size: '1.8 MB', 
      status: 'completed',
      downloadCount: 8
    },
    { 
      id: 3, 
      name: 'Estadísticas Sorteo 2024', 
      type: 'estadisticas', 
      date: '2025-04-20', 
      size: '3.1 MB', 
      status: 'completed',
      downloadCount: 22
    },
    { 
      id: 4, 
      name: 'Comparativo 2024-2025', 
      type: 'comparativo', 
      date: '2025-04-15', 
      size: '4.2 MB', 
      status: 'completed',
      downloadCount: 12
    }
  ];

  // Métricas de reportes
  reportMetrics = {
    totalGenerated: 24,
    totalSize: '48.5 MB',
    mostPopular: 'Reporte General',
    lastGenerated: '2025-04-28 14:30'
  };

  ngOnInit(): void {
    this.setDefaultDates();
  }

  setDefaultDates(): void {
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    this.customStartDate = startOfMonth;
    this.customEndDate = today;
  }

  onReportTypeSelect(type: any): void {
    this.selectedReportType = type;
  }

  toggleDepartment(dept: string): void {
    if (dept === 'all') {
      this.selectedDepartments = ['all'];
    } else {
      const index = this.selectedDepartments.indexOf('all');
      if (index > -1) {
        this.selectedDepartments.splice(index, 1);
      }
      
      const deptIndex = this.selectedDepartments.indexOf(dept);
      if (deptIndex > -1) {
        this.selectedDepartments.splice(deptIndex, 1);
      } else {
        this.selectedDepartments.push(dept);
      }
      
      if (this.selectedDepartments.length === 0) {
        this.selectedDepartments.push('all');
      }
    }
  }

  generateReport(): void {
    if (this.isGenerating) return;
    
    this.isGenerating = true;
    this.generationProgress = 0;
    
    // Simulación de progreso
    const interval = setInterval(() => {
      this.generationProgress += Math.random() * 10;
      
      if (this.generationProgress >= 100) {
        clearInterval(interval);
        this.generationProgress = 100;
        
        // Simular tiempo de procesamiento
        setTimeout(() => {
          this.isGenerating = false;
          this.generationProgress = 0;
          
          // Agregar al historial
          const newReport = {
            id: this.reportHistory.length + 1,
            name: `${this.selectedReportType.name} - ${new Date().toLocaleDateString()}`,
            type: this.selectedReportType.id,
            date: new Date().toISOString().split('T')[0],
            size: `${(Math.random() * 3 + 1).toFixed(1)} MB`,
            status: 'completed',
            downloadCount: 0
          };
          
          this.reportHistory.unshift(newReport);
        }, 500);
      }
    }, 200);
  }

  downloadReport(report: any): void {
    // Simular descarga
    report.downloadCount++;
  }

  deleteReport(report: any): void {
    const index = this.reportHistory.indexOf(report);
    if (index > -1) {
      this.reportHistory.splice(index, 1);
    }
  }

  getReportIcon(type: string): string {
    const reportType = this.reportTypes.find(r => r.id === type);
    return reportType?.icon || 'file-text';
  }

  getSelectedDepartmentsCount(): number {
    if (this.selectedDepartments.includes('all')) {
      return this.departmentOptions.length - 1; // Excluir "Todos"
    }
    return this.selectedDepartments.length;
  }

  formatDate(date: Date | null): string {
    if (!date) return '';
    return date.toLocaleDateString('es-ES');
  }

  onTimeRangeChange(): void {
    if (this.selectedTimeRange !== 'custom') {
      const today = new Date();
      let startDate: Date;
      
      switch (this.selectedTimeRange) {
        case 'today':
          startDate = today;
          break;
        case 'week':
          startDate = new Date(today.setDate(today.getDate() - 7));
          break;
        case 'month':
          startDate = new Date(today.getFullYear(), today.getMonth(), 1);
          break;
        case 'quarter':
          const quarter = Math.floor(today.getMonth() / 3);
          startDate = new Date(today.getFullYear(), quarter * 3, 1);
          break;
        default:
          startDate = today;
      }
      
      this.customStartDate = startDate;
      this.customEndDate = new Date();
    }
  }
}