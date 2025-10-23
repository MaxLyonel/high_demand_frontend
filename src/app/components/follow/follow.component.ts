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
      applicationCode: apiResponse.code,
      applicantName: `${apiResponse.postulant.name} ${apiResponse.postulant.lastName} ${apiResponse.postulant.mothersLastName}`.trim(),
      applicationDate: this.formatDateTime(apiResponse.createdAt || '', false),
      institutionName: apiResponse.highDemandCourse?.highDemandRegistration?.educationalInstitution?.name ?? '',
      educationalLevel: apiResponse.highDemandCourse?.level?.name,
      course: `${apiResponse.highDemandCourse?.grade?.name}`,
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

  private formatDateTime(isoString: string, withoutTime: boolean): string {
    if (!isoString) return '';
    const date = new Date(isoString);

    const day = date.getDate();
    const month = date.toLocaleString('es-ES', { month: 'long' });
    const year = date.getFullYear();

    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');

    const ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    if (hours === 0) hours = 12;

    if(withoutTime) {
      return `${day} de ${month} de ${year}`;
    } else return `${day} de ${month} de ${year}, ${hours}:${minutes} ${ampm}`;
  }
}