import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface NivelEducativo {
  id: number;
  nombre: string;
  grados: Grado[];
}

interface Grado {
  id: number;
  nombre: string;
  paralelos: Paralelo[];
}

interface Paralelo {
  id: number;
  nombre: string;
  inscritos: number;
  capacidad: number;
  demandaAlta: boolean;
}

@Component({
  selector: 'app-welcome',
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './welcome.component.html',
  styleUrl: './welcome.component.less'
})
export class WelcomeComponent {
  nivelesEducativos: NivelEducativo[] = [
    {
      id: 1,
      nombre: 'Inicial',
      grados: [
        { id: 1, nombre: 'Kinder 1', paralelos: [] },
        { id: 2, nombre: 'Kinder 2', paralelos: [] },
        { id: 3, nombre: 'Kinder 3', paralelos: [] }
      ]
    },
    {
      id: 2,
      nombre: 'Primaria',
      grados: [
        { id: 4, nombre: 'Primero', paralelos: [] },
        { id: 5, nombre: 'Segundo', paralelos: [] },
        { id: 6, nombre: 'Tercero', paralelos: [] },
        { id: 7, nombre: 'Cuarto', paralelos: [] },
        { id: 8, nombre: 'Quinto', paralelos: [] },
        { id: 9, nombre: 'Sexto', paralelos: [] }
      ]
    },
    {
      id: 3,
      nombre: 'Secundaria',
      grados: [
        { id: 10, nombre: 'Primero', paralelos: [] },
        { id: 11, nombre: 'Segundo', paralelos: [] },
        { id: 12, nombre: 'Tercero', paralelos: [] },
        { id: 13, nombre: 'Cuarto', paralelos: [] },
        { id: 14, nombre: 'Quinto', paralelos: [] },
        { id: 15, nombre: 'Sexto', paralelos: [] }
      ]
    }
  ];

  nivelSeleccionado: NivelEducativo | null = null;
  gradoSeleccionado: Grado | null = null;
  paralelos: Paralelo[] = [];
  nuevoParalelo: string = '';

  constructor() {
    // Inicializar algunos datos de ejemplo
    this.inicializarDatosEjemplo();
  }

  inicializarDatosEjemplo(): void {
    // Agregar paralelos de ejemplo a algunos grados
    this.nivelesEducativos.forEach(nivel => {
      nivel.grados.forEach(grado => {
        const letras = ['A', 'B', 'C', 'D'];
        grado.paralelos = letras.map((letra, index) => ({
          id: index + 1,
          nombre: letra,
          inscritos: Math.floor(Math.random() * 30),
          capacidad: 30,
          demandaAlta: Math.random() > 0.7
        }));
      });
    });
  }

  seleccionarNivel(nivel: NivelEducativo): void {
    this.nivelSeleccionado = nivel;
    this.gradoSeleccionado = null;
    this.paralelos = [];
  }

  seleccionarGrado(grado: Grado): void {
    this.gradoSeleccionado = grado;
    this.paralelos = [...grado.paralelos];
  }

  agregarParalelo(): void {
    if (this.nuevoParalelo.trim() && this.gradoSeleccionado) {
      const nuevoId = this.gradoSeleccionado.paralelos.length + 1;
      const nuevoParalelo: Paralelo = {
        id: nuevoId,
        nombre: this.nuevoParalelo.toUpperCase(),
        inscritos: 0,
        capacidad: 30,
        demandaAlta: false
      };

      this.gradoSeleccionado.paralelos.push(nuevoParalelo);
      this.paralelos = [...this.gradoSeleccionado.paralelos];
      this.nuevoParalelo = '';
    }
  }

  actualizarDemanda(paralelo: Paralelo): void {
    paralelo.demandaAlta = paralelo.inscritos >= paralelo.capacidad * 0.8;
  }

  guardarCambios(): void {
    // Aquí iría la lógica para guardar en el backend
    alert('Cambios guardados exitosamente');
  }
}
