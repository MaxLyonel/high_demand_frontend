import { Component, Input } from "@angular/core";
import { NzButtonComponent } from "ng-zorro-antd/button";
import { NzCardModule } from "ng-zorro-antd/card";


@Component({
  selector: 'app-pre-registration',
  imports: [
    NzCardModule,
    NzButtonComponent
  ],
  templateUrl: 'pre-registration.component.html',
  styleUrls: ['./pre-registration.comonent.less']
})
export class PreRegistrationComponent {
  @Input() title: string = 'Pre-inscripciones';
  @Input() description: string = 'Completa tu proceso de pre-inscripción para el próximo ciclo escolar';
  @Input() buttonText: string = 'Iniciar proceso';
}