import { Component, inject, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzCardModule } from "ng-zorro-antd/card";
import { NzFormModule } from "ng-zorro-antd/form";
import { NzModalModule, NzModalService } from "ng-zorro-antd/modal";
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzInputModule } from 'ng-zorro-antd/input';
import { CommonModule } from '@angular/common';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzIconModule } from 'ng-zorro-antd/icon';
import IOperative from '../../../domain/ports/i-operative';
import { APP_CONSTANTS } from '../../../infrastructure/constants/constants';

interface PhaseConfig {
  id: string;
  title: string;
  description: string;
  startDateControl: string;
  endDateControl: string;
  color: string;
  icon: string;
  status?: 'pending' | 'active' | 'completed';
}

@Component({
  selector: 'app-operativo-config',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.less'],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NzCardModule,
    NzFormModule,
    NzModalModule,
    NzAlertModule,
    NzButtonModule,
    NzInputModule,
    NzDatePickerModule,
    NzGridModule,
    NzTagModule,
    NzIconModule
  ],
  providers: [
    NzMessageService,
    NzModalService
  ]
})
export class OperativoConfigComponent implements OnInit {
  configForm: FormGroup;
  isLoading = false;
  isVisibleModal = false;
  canManageConfig = false;
  currentConfig: any | null = null;

  phases: PhaseConfig[] = [
    {
      id: 'phase1',
      title: 'POSTULACIÓN UE',
      description: 'Fase de postulación de unidades educativas',
      startDateControl: 'datePosUEIni',
      endDateControl: 'datePosUEEnd',
      color: 'blue',
      icon: 'file-add'
    },
    {
      id: 'phase2',
      title: 'REVISIÓN DISTRITAL',
      description: 'Revisión a nivel distrital',
      startDateControl: 'dateRevDisIni',
      endDateControl: 'dateRevDisEnd',
      color: 'green',
      icon: 'team'
    },
    {
      id: 'phase3',
      title: 'REVISIÓN DEPARTAMENTAL',
      description: 'Revisión a nivel departamental',
      startDateControl: 'dateRevDepIni',
      endDateControl: 'dateRevDepEnd',
      color: 'orange',
      icon: 'global'
    },
    {
      id: 'phase4',
      title: 'OPERATIVO',
      description: 'Fase operativa principal',
      startDateControl: 'dateOpeIni',
      endDateControl: 'dateOpeEnd',
      color: 'purple',
      icon: 'rocket'
    },
    {
      id: 'lottery',
      title: 'SORTEO',
      description: 'Fecha y hora del sorteo',
      startDateControl: 'dateLotteryIni',
      endDateControl: 'dateLotteryEnd',
      color: 'red',
      icon: 'gift'
    }
  ];

  selectedDateRanges: { [key: string]: Date[] } = {};
  selectedLotteryDate: { [key: string]: Date[] } = {};
  modal = inject(NzModalService)

  constructor(
    private fb: FormBuilder,
    private message: NzMessageService,
    @Inject('IOperative') private _operative: IOperative
  ) {
    this.configForm = this.fb.group({
      id: [null],
      datePosUEIni: [null, Validators.required],
      datePosUEEnd: [null, Validators.required],
      dateRevDisIni: [null, Validators.required],
      dateRevDisEnd: [null, Validators.required],
      dateRevDepIni: [null, Validators.required],
      dateRevDepEnd: [null, Validators.required],
      dateOpeIni: [null, Validators.required],
      dateOpeEnd: [null, Validators.required],
      dateLotteryIni: [null, Validators.required],
      dateLotteryEnd: [null, Validators.required],
      gestionId: [new Date().getFullYear(), Validators.required]
    });

    this.canManageConfig = true;
  }

  ngOnInit(): void {
    this.loadCurrentConfig();
  }

  loadCurrentConfig(): void {
    this.isLoading = true;
    this._operative.getOperative(APP_CONSTANTS.CURRENT_YEAR).subscribe({
      next: (config) => {
        if(config && config.data) {
          this.currentConfig = config.data;
          this.configForm.patchValue(config.data);
          this.updateNgModelProperties(config.data);
        } else {
          console.warn('La respuesta no tiene la estructura esperada: ',config)
          this.initializeWithDefaultValues()
        }

        this.updatePhasesStatus();
        this.isLoading = false;
      },
      error: () => {
        this.message.error('Error al cargar la configuración actual');
        this.isLoading = false;
      }
    });
  }

  // Método para inicializar con valores por defecto cuando no hay datos
  private initializeWithDefaultValues(): void {
    const defaultValues = {
      gestionId: new Date().getFullYear()
    };

    this.configForm.patchValue(defaultValues);
    this.initializeEmptyDateRanges();
    this.currentConfig = null;
  }

  private updateNgModelProperties(configData: any): void {
    this.selectedDateRanges = {}
    this.selectedLotteryDate = {}

    if(!configData) {
      this.initializeEmptyDateRanges();
      return;
    }

    this.phases.forEach(phase => {
      try {
        const startDate = configData[phase.startDateControl];
        const endDate = configData[phase.endDateControl];

        if(startDate && endDate) {
          const startDateObj = new Date(startDate);
          const endDateObj = new Date(endDate);

          if(!isNaN(startDateObj.getTime()) && !isNaN(endDateObj.getTime())) {
            if(phase.id === 'lottery') {
              this.selectedLotteryDate[phase.id] = [ startDate, endDate ];
            } else {
              this.selectedDateRanges[phase.id] = [ startDate, endDate ];
            }
          } else {
            console.warn(`Fechas inválidas para ${phase.title}:`, startDate, endDate)
            this.setEmptyDateRange(phase)
          }
        } else {
          this.setEmptyDateRange(phase)
        }
      } catch(error) {
        console.error(`Error procesando fechas para ${phase.title}:`, error)
        this.setEmptyDateRange(phase)
      }
    });
    console.log('selectedDateRanges actualizado: ', this.selectedDateRanges);
    console.log('selectedLotteryDate actualizado: ', this.selectedLotteryDate);
  }

  // Método auxiliar para establecer array vacío
  private setEmptyDateRange(phase: PhaseConfig): void {
    if (phase.id === 'lottery') {
      this.selectedLotteryDate[phase.id] = [];
    } else {
      this.selectedDateRanges[phase.id] = [];
    }
  }

  // Método para inicializar todos los arrays vacíos
  private initializeEmptyDateRanges(): void {
    this.phases.forEach(phase => {
      this.setEmptyDateRange(phase);
    });
  }

  updatePhasesStatus(): void {
    const now = new Date();

    this.phases.forEach(phase => {
      if (phase.id === 'lottery') {
        const lotteryDate = this.configForm.get('dateLottery')?.value;
        if (lotteryDate) {
          phase.status = new Date(lotteryDate) < now ? 'completed' : 'pending';
        }
      } else {
        const startDate = this.configForm.get(phase.startDateControl)?.value;
        const endDate = this.configForm.get(phase.endDateControl)?.value;

        if (startDate && endDate) {
          const start = new Date(startDate);
          const end = new Date(endDate);

          if (now < start) {
            phase.status = 'pending';
          } else if (now > end) {
            phase.status = 'completed';
          } else {
            phase.status = 'active';
          }
        }
      }
    });
  }

  onDateRangeChange(dates: Date[], phase: PhaseConfig): void {
    if (dates && dates.length === 2 && phase.id !== 'lottery') {
      // 1. Actualizar la fase actual
      this.configForm.patchValue({
        [phase.startDateControl]: dates[0],
        [phase.endDateControl]: dates[1]
      });

      // 2. Limpiar fases siguientes
      this.clearSubsequentPhases(phase.id);

      // 3. Actualizar estados
      this.updatePhasesStatus();
    }
  }

  onAcceptDateRange(event: any, phase: PhaseConfig): void {
    // Si el usuario no seleccionó nada, no hacemos nada
    if (!event) {
      return;
    }

    // Convertimos el valor recibido (puede ser Dayjs[]) a Date[]
    const dates = Array.isArray(event)
      ? event.map((d: any) => d.toDate ? d.toDate() : new Date(d))
      : [];

    this.modal.confirm({
      nzTitle: '¿Confirmar selección de fechas?',
      nzContent: `
        Las fechas seleccionadas son:
        <br><b>Inicio:</b> ${dates[0]?.toLocaleString() ?? '-'}
        <br><b>Fin:</b> ${dates[1]?.toLocaleString() ?? '-'}
      `,
      nzOnOk: () => this.onDateRangeChange(dates, phase),
    });
  }


  // Método para limpiar fases siguientes
  private clearSubsequentPhases(currentPhaseId: string): void {
    const currentPhaseIndex = this.phases.findIndex(phase => phase.id === currentPhaseId);

    // Si no se encuentra la fase o es la última, no hay nada que limpiar
    if (currentPhaseIndex === -1 || currentPhaseIndex >= this.phases.length - 1) {
      return;
    }

    // Limpiar todas las fases siguientes
    for (let i = currentPhaseIndex + 1; i < this.phases.length; i++) {
      const subsequentPhase = this.phases[i];

      this.configForm.patchValue({
        [subsequentPhase.startDateControl]: null,
        [subsequentPhase.endDateControl]: null
      })

      if(subsequentPhase.id === 'lottery') {
        this.selectedLotteryDate[subsequentPhase.id] = []
      } else {
        this.selectedDateRanges[subsequentPhase.id] = []
      }
    }

    // Mostrar mensaje informativo
    // this.message.info('Las fases siguientes han sido limpiadas debido al cambio en la fase actual');
  }

  onLotteryDateChange(dates: Date[], phase: PhaseConfig): void {
    if (dates && dates.length === 2 && phase.id === 'lottery') {
      this.configForm.patchValue({
        dateLotteryIni: dates[0],
        dateLotteryEnd: dates[1]
      });
      this.selectedLotteryDate[phase.id] = dates
      this.updatePhasesStatus();
    }
  }

  getPhaseDateRange(phase: PhaseConfig): Date[] {
    const startDate = this.configForm.get(phase.startDateControl)?.value;
    const endDate = this.configForm.get(phase.endDateControl)?.value;

    return startDate && endDate ? [new Date(startDate), new Date(endDate)] : [];
  }

  getStatusText(status: string): string {
    switch (status) {
      case 'pending': return 'Pendiente';
      case 'active': return 'En Curso';
      case 'completed': return 'Completado';
      default: return 'No configurado';
    }
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'pending': return 'default';
      case 'active': return 'processing';
      case 'completed': return 'success';
      default: return 'default';
    }
  }

  submitForm(): void {
    this.isVisibleModal = true;
  }

  handleOk(): void {
    this.isLoading = true;
    const formData = this.configForm.value;

    this._operative.saveOperative(formData).subscribe({
      next: () => {
        this.message.success('Configuración guardada exitosamente');
        this.isLoading = false;
        this.isVisibleModal = false;
        this.loadCurrentConfig();
      },
      error: () => {
        this.message.error('Error al guardar la configuración');
        this.isLoading = false;
        this.isVisibleModal = false;
      }
    });
  }

  handleCancel(): void {
    this.isVisibleModal = false;
  }

  resetForm(): void {
    if (this.currentConfig) {
      this.configForm.reset(this.currentConfig);
      this.updatePhasesStatus();
    } else {
      this.configForm.reset({
        gestionId: new Date().getFullYear()
      });
    }
  }

  formatDate(date: Date): string {
    if (!date) return 'No definida';
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  // Método auxiliar para TypeScript (agregar al componente)
  getPhaseColor(color: string): string {
    const colorMap: { [key: string]: string } = {
      blue: '#0D9488',
      green: '#0D9488',
      orange: '#0D9488',
      purple: '#0D9488',
      red: '#0D9488'
    };
    return colorMap[color] || '#1890ff';
  }

  disabledDate = (current: Date): boolean => {
    // Deshabilitar fechas anteriores al día actual
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Establecer a inicio del día
    return current < today;
  };

  // Método para deshabilitar fechas basado en la fase actual
  getDisabledDateForPhase(phaseId: string): (current: Date) => boolean {
    return (current: Date): boolean => {
      // 1. Deshabilitar fechas anteriores al día actual
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (current < today) {
        return true;
      }

      // 2. Obtener el índice de la fase actual
      const currentPhaseIndex = this.phases.findIndex(phase => phase.id === phaseId);

      // 3. Si es la primera fase, solo deshabilitar fechas pasadas
      if (currentPhaseIndex <= 0) {
        return false;
      }

      // 4. Para fases posteriores, deshabilitar fechas que estén dentro de rangos de fases anteriores
      for (let i = 0; i < currentPhaseIndex; i++) {
        const previousPhase = this.phases[i];

        // Obtener las fechas de la fase anterior
        const previousStartDate = this.configForm.get(previousPhase.startDateControl)?.value;
        const previousEndDate = this.configForm.get(previousPhase.endDateControl)?.value;

        if (previousStartDate && previousEndDate) {
          const start = new Date(previousStartDate);
          const end = new Date(previousEndDate);

          // Deshabilitar si la fecha actual está dentro del rango de una fase anterior
          if (current >= start && current <= end) {
            return true;
          }
          // Para la fase inmediatamente siguiente, también deshabilitar si es igual al fin de la anterior
          // (para evitar solapamiento)
          if (i === currentPhaseIndex - 1 && current <= end) {
            return true;
          }
        }
      }

      return false;
    };
  }

  // Método específico para el sorteo (debe ser después de todas las fases)
  getDisabledDateForLottery(): (current: Date) => boolean {
    return (current: Date): boolean => {
      // 1. Deshabilitar fechas anteriores al día actual
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (current < today) {
        return true;
      }

      // 2. Obtener la última fase operativa (antes del sorteo)
      const lastOperativePhase = this.phases.find(phase => phase.id === 'phase4');
      if (lastOperativePhase) {
        const lastEndDate = this.configForm.get(lastOperativePhase.endDateControl)?.value;
        if (lastEndDate) {
          const end = new Date(lastEndDate);
          // El sorteo debe ser después del fin de la última fase operativa
          return current <= end;
        }
      }

      return false;
    };
  }
}