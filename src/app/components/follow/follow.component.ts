import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import IPreRegistration from '../../domain/ports/i-pre-registration';

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
  searchResults: PreInscription[] = []
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

  constructor(
    @Inject('IPreRegistration') private _preRegistration: IPreRegistration
  ) {}

  searchApplication(): void {
    if (!this.searchTerm.trim()) {
      return;
    }

    this.isLoading = true;

    this._preRegistration.getListPreRegistrationFollow(this.searchTerm).subscribe({
      next: response => {
        if(response?.data?.length === 0) {
          this.searchResults = []
        } else {
          const mapped = response.data.map((item: any) => this.mapToPreInscription(item));
          // 👇 si quieres guardar solo el primero
          // this.searchResults = mapped.length ? mapped[0] : null;

          // 👇 si prefieres manejarlo como lista en vez de único resultado
          this.searchResults = mapped;
        }

        this.isLoading = false;
      },
      error: () => {
        this.searchResults = [];
        this.isLoading = false;
      }
    });
  }


  downloadCertificate(): void {
    // Lógica para descargar constancia
    alert('Iniciando descarga de la constancia de pre inscripción...');
    // En una implementación real, aquí iría la lógica para generar/descargar el PDF
  }

  private mapToPreInscription(apiResponse: any): PreInscription {
    return {
      id: apiResponse.id,
      applicationCode: `PI-${new Date(apiResponse.createdAt).getFullYear()}-${String(apiResponse.id).padStart(6, '0')}`,
      applicantName: `${apiResponse.postulant.name} ${apiResponse.postulant.lastName} ${apiResponse.postulant.mothersLastName}`.trim(),
      applicationDate: new Date(apiResponse.createdAt).toLocaleDateString('es-BO', {
        day: '2-digit', month: 'long', year: 'numeric'
      }),
      institutionName: apiResponse.highDemandCourse?.highDemandRegistration?.educationalInstitution?.name ?? '',
      educationalLevel: apiResponse.highDemandCourse?.level?.name, // puedes mapear el id → string
      course: `${apiResponse.highDemandCourse?.grade?.name} ${apiResponse.highDemandCourse?.parallel?.name}`, // puedes juntar grado + paralelo
      justification: apiResponse.criteria?.description ?? '',
      status: apiResponse.state,
      statusClass: this.mapStatusClass(apiResponse.state),
      identityCard: apiResponse.postulant.identityCard
    };
  }

  private mapStatusClass(state: string): string {
    switch (state) {
      case 'ACEPTADO': return 'status-aprobado';
      case 'NO ACEPTADO': return 'status-procesado';
      case 'VALIDADO': return 'status-pendiente';
      case 'INVALIDADO': return 'status-rechazado';
      case 'REGISTRADO': return 'status-procesando';
      default: return 'status-default';
    }
  }
}