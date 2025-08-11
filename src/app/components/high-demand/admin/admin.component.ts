import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
// import { OperativoService } from '../../services/operativo.service';
import { NzMessageService } from 'ng-zorro-antd/message';
// import { Ability } from '@casl/ability';
import { NzCardComponent } from "ng-zorro-antd/card";
import { NzTimelineComponent, NzTimelineItemComponent } from "ng-zorro-antd/timeline";
import { NzFormItemComponent, NzFormModule } from "ng-zorro-antd/form";
import { NzModalComponent, NzModalService } from "ng-zorro-antd/modal";
import { NzTimePickerComponent, NzTimePickerModule } from 'ng-zorro-antd/time-picker';
// import { Operativo } from '../../interfaces/operativo.interface';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzInputModule } from 'ng-zorro-antd/input';

@Component({
  selector: 'app-operativo-config',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.less'],
  imports: [
    FormsModule,
    NzCardComponent,
    NzTimelineComponent,
    NzTimelineItemComponent,
    NzFormItemComponent,
    NzModalComponent,
    NzFormModule,
    NzTimePickerModule,
    NzAlertModule,
    NzButtonModule,
    ReactiveFormsModule,
    NzInputModule
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
  // currentConfig: Operativo | null = null;

  constructor(
    private fb: FormBuilder,
    // private operativoService: OperativoService,
    private message: NzMessageService,
    // private ability: Ability
  ) {
    this.configForm = this.fb.group({
      fec_pos_ue_ini: [null, Validators.required],
      fec_pos_ue_fin: [null, Validators.required],
      fec_rev_dis_ini: [null, Validators.required],
      fec_rev_dis_fin: [null, Validators.required],
      fec_rev_dep_ini: [null, Validators.required],
      fec_rev_dep_fin: [null, Validators.required],
      fec_ope_ini: [null, Validators.required],
      fec_ope_fin: [null, Validators.required],
      fecha_sorteo: [null, Validators.required],
      gestion_id: [new Date().getFullYear(), Validators.required]
    });

    // Verificar permisos con CASL
    // this.canManageConfig = this.ability.can('manage', 'OperativoConfig');
    this.canManageConfig = false
  }

  ngOnInit(): void {
    this.loadCurrentConfig();
  }

  loadCurrentConfig(): void {
    this.isLoading = true;
    // this.operativoService.getCurrentConfig().subscribe({
    //   next: (config) => {
    //     this.currentConfig = config;
    //     this.configForm.patchValue(config);
    //     this.isLoading = false;
    //   },
    //   error: () => {
    //     this.message.error('Error al cargar la configuración actual');
    //     this.isLoading = false;
    //   }
    // });
  }

  submitForm(): void {
    this.isVisibleModal = true;
  }

  handleOk(): void {
    this.isLoading = true;
    const formData = this.configForm.value;

    // this.operativoService.updateConfig(formData).subscribe({
    //   next: () => {
    //     this.message.success('Configuración guardada exitosamente');
    //     this.isLoading = false;
    //     this.isVisibleModal = false;
    //     this.loadCurrentConfig();
    //   },
    //   error: () => {
    //     this.message.error('Error al guardar la configuración');
    //     this.isLoading = false;
    //     this.isVisibleModal = false;
    //   }
    // });
  }

  handleCancel(): void {
    this.isVisibleModal = false;
  }

  resetForm(): void {
    // if (this.currentConfig) {
    //   this.configForm.reset(this.currentConfig);
    // } else {
    //   this.configForm.reset({
    //     gestion_id: new Date().getFullYear()
    //   });
    // }
  }

  // Verificación de fechas (puedes agregar validaciones cruzadas)
  validateDates(): void {
    // Implementar lógica de validación de fechas
    // Ejemplo: fec_pos_ue_ini debe ser menor que fec_pos_ue_fin
  }
}