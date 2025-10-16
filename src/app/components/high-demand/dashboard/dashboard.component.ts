import { Component, OnInit } from "@angular/core";
import { NzTimelineComponent, NzTimelineItemComponent } from "ng-zorro-antd/timeline";
import { CommonModule } from '@angular/common';
import { Chart, registerables } from 'chart.js'


Chart.register(...registerables)

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.less',
  imports: [CommonModule, NzTimelineComponent, NzTimelineItemComponent],
})
export class DashboardComponent implements OnInit {
  phase = [
    {
      stage: 'postulacion-ue',
      title: 'Fase 1: Postulación UE',
      dateRange: '01/04/2025 - 15/04/2025',
      applicants: '1,248',
      labelApplicants: 'Postulaciones',
      earrings: '342',
      labelEarrings: 'Pendientes',
      percentage: '78%',
      labelPercentage: 'Completado',
      active: true
    },
    {
      stage: 'revision-distrital',
      title: 'Fase 2: Revisión Distrital',
      dateRange: '16/04/2025 - 25/04/2025',
      applicants: '856',
      labelApplicants: 'Revisadas',
      earrings: '124',
      labelEarrings: 'Devueltas',
      percentage: '92%',
      labelPercentage: 'Completado',
      active: false
    },
    {
      stage: 'revision-departamental',
      title: 'Fase 3: Revisión Departamental',
      dateRange: '26/04/2025 - 10/04/2025',
      applicants: '642',
      labelApplicants: 'En proceso',
      earrings: '213',
      labelEarrings: 'Pendientes',
      percentage: '45%',
      labelPercentage: 'Completado',
      active: false
    },
    {
      stage: 'operativo',
      title: 'Fase 4: Operativo Padres de Familia',
      dateRange: '11/05/2025 - 25/04/2025',
      applicants: '428',
      labelApplicants: 'Asignados',
      earrings: '-',
      labelEarrings: 'Por iniciar',
      percentage: '0%',
      labelPercentage: 'Completado',
      active: false
    },
    {
      stage: 'sorteo',
      title: 'Sorteo',
      dateRange: '26/05/2025',
      applicants: '-',
      labelApplicants: 'Por realizar',
      earrings: '-',
      labelEarrings: 'Participantes',
      percentage: '0%',
      labelPercentage: 'Completado',
      active: false
    }
  ]

  colors = {
    primary: '#0D9488',
    primaryLight: '#14B8A6',
    success: '#10b981',
    warning: '#f59e0b',
    danger: '#ef4444',
    secondary: '#6366F1',
    accent: '#8B5CF6'
  }

  activeStage = 'postulacion-ue';
  currentStageData: any  | null = null;
  private chartInstances: { [key: string]: Chart } = {}

  stageData: { [key: string]: any } = {
    'postulacion-ue': {
      title: 'Postulación de Unidades Educativas',
      subtitle: 'Fase 1: Del 01/04/2023 al 15/04/2023',
      status: 'En Progreso',
      statusClass: 'active',
      charts: [
        {
          id: 'ue-aprobadas-registradas',
          title: 'Unidades Educativas registradas como Alta Demanda',
          type: 'bar',
          data: {
            labels: ['La Paz', 'Chuquisaca', 'Beni'],
            datasets: [{
              label: 'Cantidad',
              data: [856, 1248, 124],
              backgroundColor: [
                this.colors.success,
                // this.colors.primary,
                this.colors.primary,
                this.colors.danger
              ]
            }]
          }
        },
        // {
        //   id: 'tipo-institucion',
        //   title: 'Tipo de Institución - Alta Demanda',
        //   type: 'doughnut',
        //   data: {
        //     labels: ['Fiscales', 'Privadas', 'Convenio'],
        //     datasets: [{
        //       data: [645, 187, 100],
        //       backgroundColor: [
        //         this.colors.primary,
        //         this.colors.secondary,
        //         this.colors.accent
        //       ]
        //     }]
        //   }
        // },
        // {
        //   id: 'frecuencia-registros',
        //   title: 'Frecuencia de Registros por Día',
        //   type: 'line',
        //   data: {
        //     labels: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15'],
        //     datasets: [{
        //       label: 'Registros',
        //       data: [45, 62, 78, 91, 105, 120, 135, 148, 162, 175, 188, 200, 215, 230, 248],
        //       borderColor: this.colors.primary,
        //       backgroundColor: 'rgba(13, 148, 136, 0.1)',
        //       tension: 0.3,
        //       fill: true
        //     }]
        //   }
        // },
        // {
        //   id: 'estado-alta-demanda',
        //   title: 'Estado de Altas Demandas',
        //   type: 'pie',
        //   data: {
        //     labels: ['Aprobadas', 'Rechazadas', 'En Revisión', 'Pendientes'],
        //     datasets: [{
        //       data: [645, 124, 163, 316],
        //       backgroundColor: [
        //         this.colors.success,
        //         this.colors.danger,
        //         this.colors.warning,
        //         this.colors.primaryLight
        //       ]
        //     }]
        //   }
        // }
      ]
    },
    'revision-distrital': {
      title: 'Revisión Distrital',
      subtitle: 'Fase 2: Del 16/04/2023 al 25/04/2023',
      status: 'Completado',
      statusClass: 'completed',
      charts: [
        {
          id: 'bandeja-distrital',
          title: 'Bandeja Distrital - Por Distrito',
          type: 'bar',
          data: {
            labels: ['Distrito 1', 'Distrito 2', 'Distrito 3', 'Distrito 4', 'Distrito 5'],
            datasets: [
              {
                label: 'Recibidas',
                data: [320, 280, 240, 200, 160],
                backgroundColor: this.colors.primary
              },
              {
                label: 'Recepcionadas',
                data: [280, 240, 200, 180, 156],
                backgroundColor: this.colors.success
              },
              {
                label: 'Rechazadas',
                data: [40, 40, 40, 20, 4],
                backgroundColor: this.colors.danger
              }
            ]
          }
        },
        {
          id: 'estado-revision-distrital',
          title: 'Estado de Revisión Distrital',
          type: 'doughnut',
          data: {
            labels: ['Aprobadas', 'Rechazadas', 'En Proceso'],
            datasets: [{
              data: [732, 124, 0],
              backgroundColor: [
                this.colors.success,
                this.colors.danger,
                this.colors.warning
              ]
            }]
          }
        },
        {
          id: 'barra-horizontal',
          title: 'Barras horizontales',
          type: 'bar',
          data: {
            labels: ['2019', '2020', '2021', '2022', '2023', '2024', '2025', '2026'],
            datasets: [{
              label: 'Frecuencia de registros',
              data: [120, 180, 250, 310, 290, 450, 720, 820],
              backgroundColor: 'linear-gradient(90deg, #00c6ff 0%, #0072ff 100%)',
              borderRadius: 10
            }]
          },
          options: {
            indexAxis: 'y', // 🔹 Esto hace las barras horizontales
            responsive: true,
            plugins: {
              legend: { display: false },
              title: {
                display: true,
                text: 'Frecuencia de registros por año'
              }
            },
            scales: {
              x: {
                beginAtZero: true,
                ticks: { stepSize: 100 }
              }
            }
          }
        }
      ]
    },
    'revision-departamental': {
      title: 'Revisión Departamental',
      subtitle: 'Fase 3: Del 26/04/2023 al 10/05/2023',
      status: 'En Progreso',
      statusClass: 'active',
      charts: [
        {
          id: 'bandeja-departamental',
          title: 'Bandeja Departamental - Por Departamento',
          type: 'bar',
          data: {
            labels: ['La Paz', 'Cochabamba', 'Santa Cruz', 'Oruro', 'Potosí'],
            datasets: [
              {
                label: 'Recibidas',
                data: [280, 240, 200, 180, 156],
                backgroundColor: this.colors.primary
              },
              {
                label: 'Recepcionadas',
                data: [240, 200, 180, 160, 142],
                backgroundColor: this.colors.success
              },
              {
                label: 'Rechazadas',
                data: [40, 40, 20, 20, 14],
                backgroundColor: this.colors.danger
              }
            ]
          }
        },
        {
          id: 'progreso-departamental',
          title: 'Progreso de Revisión por Departamento',
          type: 'line',
          data: {
            labels: ['26', '27', '28', '29', '30', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10'],
            datasets: [
              {
                label: 'La Paz',
                data: [85, 120, 155, 190, 225, 260, 295, 330, 365, 400, 435, 470, 505, 540, 575],
                borderColor: this.colors.primary,
                tension: 0.3
              },
              {
                label: 'Cochabamba',
                data: [65, 95, 125, 155, 185, 215, 245, 275, 305, 335, 365, 395, 425, 455, 485],
                borderColor: this.colors.secondary,
                tension: 0.3
              },
              {
                label: 'Santa Cruz',
                data: [45, 70, 95, 120, 145, 170, 195, 220, 245, 270, 295, 320, 345, 370, 395],
                borderColor: this.colors.success,
                tension: 0.3
              }
            ]
          }
        }
      ]
    },
    'operativo': {
      title: 'Operativo de Postulación',
      subtitle: 'Fase 4: Del 11/05/2023 al 25/05/2023',
      status: 'Pendiente',
      statusClass: 'pending',
      charts: [
        {
          id: 'postulantes-demografia',
          title: 'Postulantes por Edad y Género',
          type: 'bar',
          data: {
            labels: ['18-25', '26-35', '36-45', '46-55', '56+'],
            datasets: [
              {
                label: 'Mujeres',
                data: [120, 185, 210, 95, 45],
                backgroundColor: this.colors.accent
              },
              {
                label: 'Hombres',
                data: [110, 170, 195, 85, 40],
                backgroundColor: this.colors.primary
              }
            ]
          }
        },
        {
          id: 'criterio-registro',
          title: 'Criterio de Registro',
          type: 'doughnut',
          data: {
            labels: ['Hermandad', 'Trabajo', 'Residencia'],
            datasets: [{
              data: [320, 210, 150],
              backgroundColor: [
                this.colors.primary,
                this.colors.secondary,
                this.colors.success
              ]
            }]
          }
        },
        {
          id: 'nivel-educativo',
          title: 'Postulantes por Nivel Educativo',
          type: 'pie',
          data: {
            labels: ['Inicial', 'Primaria', 'Secundaria'],
            datasets: [{
              data: [180, 320, 180],
              backgroundColor: [
                this.colors.primary,
                this.colors.success,
                this.colors.warning
              ]
            }]
          }
        },
        {
          id: 'escolaridad',
          title: 'Postulantes por Año de Escolaridad',
          type: 'bar',
          data: {
            labels: ['1ro', '2do', '3ro', '4to', '5to', '6to'],
            datasets: [{
              label: 'Cantidad',
              data: [120, 135, 110, 95, 80, 65],
              backgroundColor: this.colors.primary
            }]
          }
        }
      ]
    },
    'sorteo': {
      title: 'Sorteo',
      subtitle: '26/05/2023',
      status: 'Pendiente',
      statusClass: 'pending',
      charts: [
        {
          id: 'sorteo-instituciones',
          title: 'Sorteo por Institución Educativa',
          type: 'bar',
          data: {
            labels: ['UE San Miguel', 'UE La Paz', 'UE San Calixto', 'UE Santa Ana', 'UE San Ignacio'],
            datasets: [{
              label: 'Sorteados',
              data: [45, 38, 32, 28, 25],
              backgroundColor: this.colors.primary
            }]
          }
        },
        {
          id: 'sorteo-criterios',
          title: 'Sorteados por Criterio',
          type: 'doughnut',
          data: {
            labels: ['Hermandad', 'Trabajo', 'Residencia'],
            datasets: [{
              data: [215, 140, 105],
              backgroundColor: [
                this.colors.primary,
                this.colors.secondary,
                this.colors.success
              ]
            }]
          }
        },
        {
          id: 'sorteo-nivel',
          title: 'Sorteados por Nivel Educativo',
          type: 'pie',
          data: {
            labels: ['Inicial', 'Primaria', 'Secundaria'],
            datasets: [{
              data: [120, 215, 125],
              backgroundColor: [
                this.colors.primary,
                this.colors.success,
                this.colors.warning
              ]
            }]
          }
        },
        {
          id: 'sorteo-escolaridad',
          title: 'Sorteados por Año de Escolaridad',
          type: 'bar',
          data: {
            labels: ['1ro', '2do', '3ro', '4to', '5to', '6to'],
            datasets: [{
              label: 'Sorteados',
              data: [75, 80, 70, 65, 60, 50],
              backgroundColor: this.colors.success
            }]
          }
        }
      ]
    }
  };

  stats = [
    { 
      title: 'Postulación UE', 
      value: '1,248', 
      change: 12, 
      positive: true, 
      stage: 'postulacion-ue',
      icon: 'fa-school'
    },
    { 
      title: 'Revisión Distrital', 
      value: '856', 
      change: 8, 
      positive: true, 
      stage: 'revision-distrital',
      icon: 'fa-map-marker-alt'
    },
    { 
      title: 'Revisión Departamental', 
      value: '642', 
      change: -5, 
      positive: false, 
      stage: 'revision-departamental',
      icon: 'fa-building'
    },
    { 
      title: 'Operativo', 
      value: '428', 
      change: 15, 
      positive: true, 
      stage: 'operativo',
      icon: 'fa-cogs'
    }
  ];

  ngOnInit(): void {
    this.initDashboard()
  }

  ngAfterWiewInit() {
    this.renderCharts(this.stageData[this.activeStage])
  }

  ngOnDestroy() {
    this.destroyCharts()
  }

  changeStageFromTimeline(stageId: string): void {
    this.changeStage(stageId)

    this.phase.forEach(item => {
      item.active = item.stage === stageId
    })
  }

  changeStage(stageId: string) {
    const stage = this.stageData[stageId];
    if(!stage) return;

    this.activeStage = stageId;
    this.currentStageData = stage;
    this.renderCharts(stage);
  }

  isTimelineItemActive(stage: string): boolean {
    return this.activeStage === stage;
  }

  isActiveStage(stage: string): boolean {
    return this.activeStage === stage;
  }

  getStageStatusClass(stage: string): string {
    return this.currentStageData?.statusClass || 'active'
  }

  getChangeClass(positive: boolean): string {
    return positive ? 'positive' : 'negative'
  }

  getChangeIcon(positive: boolean) : string {
    return positive ? 'fa-arrow-up' : 'fa-arrow-down'
  }

  private renderCharts(stage: any) {
    this.destroyCharts();

    setTimeout(() => {
      stage.charts.forEach((chartConfig:any) => {
        const canvas = document.getElementById(`chart-${chartConfig.id}`) as HTMLCanvasElement;
        if(canvas) {
          const ctx = canvas.getContext('2d')
          if(ctx) {
            this.chartInstances[chartConfig.id] = new Chart(ctx, {
              type: chartConfig.type,
              data: chartConfig.data,
              options: this.getChartOptions(chartConfig.type)
            });
          }
        }
      });
    }, 100)
  }

  private destroyCharts() {
    Object.values(this.chartInstances).forEach(chart => {
      if(chart && typeof chart.destroy === 'function') {
        chart.destroy()
      }
    })
    this.chartInstances = {}
  }

  private getChartOptions(type: string): any {
    const baseOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom' as const,
          labels: {
            padding: 20,
            usePointStyle: true,
            pointStyle: 'circle',
            color: '#64748B'
          }
        },
        tooltip: {
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          titleColor: '#1E293B',
          bodyColor: '#64748B',
          borderColor: '#E2E8F0',
          borderWidth: 1,
          cornerRadius: 8,
          displayColors: true
        }
      }
    };
    if(type === 'bar' || type === 'line') {
      return {
        ...baseOptions,
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              color: 'rgba(226, 232, 240, 0.5)'
            },
            ticks: {
              color: '#64748B'
            }
          },
          x: {
            grid: {
              color: type === 'line' ? 'rgba(226, 232, 240, 0.5)': 'transparent'
            },
            ticks: {
              color: '#64748B'
            }
          }
        },
        ...(type === 'line' && {
          elements: {
            point: {
              backgroundColor: this.colors.primary,
              borderColor: '#FFFFFF',
              borderWidth: 2,
              radius: 4,
              hoverRadius: 6
            }
          }
        })
      }
    }
    return baseOptions;
  }

  private initDashboard() {
    this.changeStage('postulacion-ue')
  }
}