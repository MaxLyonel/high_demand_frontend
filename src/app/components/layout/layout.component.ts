import { Component, ViewEncapsulation, AfterViewInit, OnInit } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { NzButtonModule } from "ng-zorro-antd/button";
import { NzCardModule } from "ng-zorro-antd/card";
import { NzFormModule } from "ng-zorro-antd/form";
import { NzGridModule } from "ng-zorro-antd/grid";
import { NzInputModule } from "ng-zorro-antd/input";
import { PreRegistrationComponent } from "./components/pre-registration/pre-registration.component";
import { FollowUpComponent } from "./components/follow-up/follow-up.component";
import { LoginComponent } from "./components/login/login.component";

@Component({
  selector: 'app-auth-layout',
  imports: [
    NzCardModule,
    NzFormModule,
    NzInputModule,
    NzButtonModule,
    NzGridModule,
    ReactiveFormsModule,
    PreRegistrationComponent,
    FollowUpComponent,
    LoginComponent
  ],
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.less'],
  encapsulation: ViewEncapsulation.None
})
export default class LayoutComponent implements OnInit {

  ngOnInit() {
    this.createParticles(200);
  }

  createParticles(count: number) {
    const background = document.getElementById('background');
    const symbols = ['★', '✪', '✶', '✷', '✸', '✹', '✺'];

    // 👉 Selecciona un símbolo UNA sola vez
    const chosenSymbol = symbols[Math.floor(Math.random() * symbols.length)];

    for (let i = 0; i < count; i++) {
      const particle = document.createElement('div');
      particle.className = 'code-particle';
      // Todas las partículas usan el mismo símbolo
      // particle.textContent = chosenSymbol.repeat(Math.floor(Math.random() * 3) + 1);
      particle.textContent = chosenSymbol;
      // Posición aleatoria
      const left = Math.random() * 100;
      particle.style.left = `${left}%`;
      // Tamaño aleatorio
      const size = 15 + Math.random() * 10;
      particle.style.fontSize = `${size}px`;
      // Opacidad aleatoria
      const opacity = 0.2 + Math.random() * 0.3;
      particle.style.opacity = opacity.toString();
      // Retraso de animación aleatorio
      const delay = Math.random() * 20;
      particle.style.animationDelay = `${delay}s`;
      // Duración de animación aleatoria
      const duration = 12 + Math.random() * 1;
      particle.style.animationDuration = `${duration}s`;

      if (background) {
        background.appendChild(particle);
      }
    }
  }

}