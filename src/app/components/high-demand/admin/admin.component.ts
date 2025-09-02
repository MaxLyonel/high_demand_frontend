import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
// import { OperativoService } from '../../services/operativo.service';
import { NzMessageService } from 'ng-zorro-antd/message';
// import { Ability } from '@casl/ability';
import { NzCardComponent, NzCardModule } from "ng-zorro-antd/card";
import { NzTimelineComponent, NzTimelineItemComponent, NzTimelineModule } from "ng-zorro-antd/timeline";
import { NzFormItemComponent, NzFormModule } from "ng-zorro-antd/form";
import { NzModalComponent, NzModalModule, NzModalService } from "ng-zorro-antd/modal";
import { NzTimePickerComponent, NzTimePickerModule } from 'ng-zorro-antd/time-picker';
// import { Operativo } from '../../interfaces/operativo.interface';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzInputModule } from 'ng-zorro-antd/input';
import { CommonModule } from '@angular/common';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import IOperative from '../../../domain/ports/i-operative';

@Component({
  selector: 'app-operativo-config',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.less'],
  imports: [
    CommonModule,
    FormsModule,
    NzCardModule,
    NzTimelineModule,
    NzTimelineItemComponent,
    NzFormItemComponent,
    NzFormModule,
    NzModalModule,
    NzFormModule,
    NzTimePickerModule,
    NzAlertModule,
    NzButtonModule,
    ReactiveFormsModule,
    NzInputModule,
    NzDatePickerModule
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
  ability: any;
  currentConfig: any | null = null;

  constructor(
    private fb: FormBuilder,
    private message: NzMessageService,
    @Inject('IOperative') private _operative: IOperative
    // private ability: Ability
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
      dateLottery: [null, Validators.required],
      gestionId: [new Date().getFullYear(), Validators.required]
    });

    // Verificar permisos con CASL
    // this.canManageConfig = this.ability.can('manage', '');
    this.canManageConfig = true
  }

  ngOnInit(): void {
    this.loadCurrentConfig();
  }

  loadCurrentConfig(): void {
    this.isLoading = true;
    this._operative.getOperative(2025).subscribe({
      next: (config) => {
        console.log("Configuración obtenida: ", config.data)
        this.currentConfig = config.data;
        this.configForm.patchValue(config.data);
        this.isLoading = false;
      },
      error: () => {
        this.message.error('Error al cargar la configuración actual');
        this.isLoading = false;
      }
    });
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
    } else {
      this.configForm.reset({
        gestion_id: new Date().getFullYear()
      });
    }
  }

  // Verificación de fechas (puedes agregar validaciones cruzadas)
  validateDates(): void {
    // Implementar lógica de validación de fechas
    // Ejemplo: fec_pos_ue_ini debe ser menor que fec_pos_ue_fin
  }
}