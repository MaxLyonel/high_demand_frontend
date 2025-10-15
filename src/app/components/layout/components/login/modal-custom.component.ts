import { CommonModule } from "@angular/common";
import { Component, inject, Input } from "@angular/core";
import { NzButtonModule } from "ng-zorro-antd/button";
import { NZ_MODAL_DATA, NzModalRef } from "ng-zorro-antd/modal";
import { Rol } from "../../../../domain/models/rol.model";
import { NzListModule } from 'ng-zorro-antd/list';
import { NzRadioModule } from "ng-zorro-antd/radio";
import { NzTypographyModule } from "ng-zorro-antd/typography";
import { FormsModule } from '@angular/forms';
import * as iconv from 'iconv-lite'
import { Buffer } from 'buffer'

@Component({
  selector: 'nz-modal-custom-component',
  imports: [
    FormsModule,
    NzTypographyModule,
    NzListModule,
    NzButtonModule,
    CommonModule,
    NzRadioModule
  ],
  templateUrl: './moda-custom.component.html',
})
export class NzModalCustomComponent {
  @Input() title?: string;
  @Input() subtitle?: string;

  readonly #modal = inject(NzModalRef);
  readonly nzModalData: { roles: any[] } = inject(NZ_MODAL_DATA);

  selectedRoleId: any;

  destroyModal(): void {
    const rolSeleccionado = this.nzModalData.roles.find(
      r => r.id === this.selectedRoleId
    );
    this.#modal.destroy(rolSeleccionado);
  }

  decode(word: string) {
    const buffer = Buffer.from(word, 'latin1')
    return iconv.decode(buffer, 'utf-8')
  }
}