import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzAlertModule } from 'ng-zorro-antd/alert';

interface PreInscription {
  id: number;
  applicationCode: string;
  applicantName: string;
  applicationDate: string;
  institutionName: string;
  educationalLevel: string;
  course: string;
  justification: string;
  status: string;
  statusClass: string;
  identityCard: string;
}

@Component({
  selector: 'app-pre-inscription-tracking',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NzCardModule,
    NzInputModule,
    NzButtonModule,
    NzIconModule,
    NzGridModule,
    NzAlertModule
  ],
  templateUrl: './follow.component.html',
  styleUrls: ['./follow.component.less']
})
export default class PreInscriptionTrackingComponent {
  searchTerm: string = '';
  searchResults: PreInscription | null = null;
  isLoading: boolean = false;

  // Datos de ejemplo
  preinscripcionesData: PreInscription[] = [
    {
      id: 1,
      applicationCode: 'PI-2025-008532',
      applicantName: 'MARÍA FERNANDA GUTIÉRREZ LÓPEZ',
      applicationDate: '15 de Agosto, 2024',
      institutionName: 'Colegio Nacional Florida',
      educationalLevel: 'Secundaria',
      course: '3ro de Secundaria "B"',
      justification: 'Hermanos en la misma unidad educativa',
      status: 'APROBADO',
      statusClass: 'status-aprobado',
      identityCard: '12345'
    },
    {
      id: 2,
      applicationCode: 'PI-2025-007891',
      applicantName: 'CARLOS ANDRÉS MARTÍNEZ SUÁREZ',
      applicationDate: '12 de Agosto, 2024',
      institutionName: 'Unidad Educativa Villa Alegre',
      educationalLevel: 'Primaria',
      course: '5to de Primaria "A"',
      justification: 'Proximidad al domicilio',
      status: 'PENDIENTE',
      statusClass: 'status-pendiente',
      identityCard: '67890'
    },
    {
      id: 3,
      applicationCode: 'PI-2025-009123',
      applicantName: 'SOFÍA VALENTINA RODRÍGUEZ PAZ',
      applicationDate: '18 de Agosto, 2024',
      institutionName: 'Colegio San Miguel',
      educationalLevel: 'Inicial',
      course: 'Kínder "C"',
      justification: 'Proximidad al trabajo del tutor',
      status: 'RECHAZADO',
      statusClass: 'status-rechazado',
      identityCard: '54321'
    },
    {
      id: 4,
      applicationCode: 'PI-2025-008756',
      applicantName: 'JOSÉ LUIS FERNÁNDEZ GARCÍA',
      applicationDate: '14 de Agosto, 2024',
      institutionName: 'Unidad Educativa Bicentenario',
      educationalLevel: 'Secundaria',
      course: '2do de Secundaria "D"',
      justification: 'Hermanos en la misma unidad educativa',
      status: 'PROCESANDO',
      statusClass: 'status-procesando',
      identityCard: '98765'
    }
  ];

  searchApplication(): void {
    if (!this.searchTerm.trim()) {
      return;
    }

    this.isLoading = true;
    
    // Simular llamada a API
    setTimeout(() => {
      this.searchResults = this.preinscripcionesData.find(item => 
        item.applicationCode === this.searchTerm || item.identityCard === this.searchTerm
      ) || null;
      
      this.isLoading = false;
    }, 500);
  }

  downloadCertificate(): void {
    // Lógica para descargar constancia
    alert('Iniciando descarga de la constancia de pre inscripción...');
    // En una implementación real, aquí iría la lógica para generar/descargar el PDF
  }
}