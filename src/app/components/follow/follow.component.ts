// follow.component.ts
import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzMessageService } from 'ng-zorro-antd/message';
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
  postulant: any
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
  isDownloading: { [key: number]: boolean } = {};

  constructor(
    @Inject('IPreRegistration') private _preRegistration: IPreRegistration,
    private http: HttpClient,
    private message: NzMessageService
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

  viewDetails(preinscripcion: PreInscription): void {
    // Lógica para ver detalles de la preinscripción
    const detailMessage = `
      Código: ${preinscripcion.applicationCode}
      Postulante: ${preinscripcion.applicantName}
      Fecha: ${preinscripcion.applicationDate}
      Institución: ${preinscripcion.institutionName}
      Nivel: ${preinscripcion.educationalLevel}
      Curso: ${preinscripcion.course}
      Estado: ${preinscripcion.status}
      Justificación: ${preinscripcion.justification}
    `;
    alert(`Detalles de la preinscripción:\n\n${detailMessage}`);
  }

  downloadCertificate(preinscripcion: PreInscription): void {

    this.isDownloading[preinscripcion.id] = true;

    // URL de la API para generar el PDF
    // const url = `http://localhost:3000/api/pre-registration/print/${preinscripcion.id}`;

    this._preRegistration.download(preinscripcion.id).subscribe({
      next: (response) => {
        this.isDownloading[preinscripcion.id] = false;
        // Crear el blob y descargar el archivo
        const blob = new Blob([response.body!], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        // Crear enlace para descarga
        const link = document.createElement('a');
        link.href = url;
        // Obtener el nombre del archivo del header o usar uno por defecto
        const contentDisposition = response.headers.get('Content-Disposition');
        let fileName = `preinscripcion_${preinscripcion.applicationCode}.pdf`;
        if (contentDisposition) {
          const fileNameMatch = contentDisposition.match(/filename="?(.+)"?/);
          if (fileNameMatch && fileNameMatch.length === 2) {
            fileName = fileNameMatch[1];
          }
        }
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        this.message.success('PDF descargado correctamente');
      },
      error: (error) => {
        this.isDownloading[preinscripcion.id] = false;
        console.error('Error al descargar el PDF:', error);
        if (error.status === 404) {
          this.message.error('No se encontró el PDF solicitado');
        } else if (error.status === 500) {
          this.message.error('Error del servidor al generar el PDF');
        } else {
          this.message.error('Error al descargar el PDF');
        }
      }
    })

    // this.http.get(url, {
    //   responseType: 'blob',
    //   observe: 'response'
    // }).subscribe({
    //   next: (response) => {
    //     this.isDownloading[preinscripcion.id] = false;
    //     // Crear el blob y descargar el archivo
    //     const blob = new Blob([response.body!], { type: 'application/pdf' });
    //     const url = window.URL.createObjectURL(blob);
    //     // Crear enlace para descarga
    //     const link = document.createElement('a');
    //     link.href = url;
    //     // Obtener el nombre del archivo del header o usar uno por defecto
    //     const contentDisposition = response.headers.get('Content-Disposition');
    //     let fileName = `preinscripcion_${preinscripcion.applicationCode}.pdf`;
    //     if (contentDisposition) {
    //       const fileNameMatch = contentDisposition.match(/filename="?(.+)"?/);
    //       if (fileNameMatch && fileNameMatch.length === 2) {
    //         fileName = fileNameMatch[1];
    //       }
    //     }
    //     link.download = fileName;
    //     document.body.appendChild(link);
    //     link.click();
    //     document.body.removeChild(link);
    //     window.URL.revokeObjectURL(url);
    //     this.message.success('PDF descargado correctamente');
    //   },
    //   error: (error) => {
    //     this.isDownloading[preinscripcion.id] = false;
    //     console.error('Error al descargar el PDF:', error);
    //     if (error.status === 404) {
    //       this.message.error('No se encontró el PDF solicitado');
    //     } else if (error.status === 500) {
    //       this.message.error('Error del servidor al generar el PDF');
    //     } else {
    //       this.message.error('Error al descargar el PDF');
    //     }
    //   }
    // });
  }

  // Método alternativo usando window.open (más simple)
  downloadCertificateAlternative(preinscripcion: PreInscription): void {
    this.isDownloading[preinscripcion.id] = true;
    const url = `http://localhost:3000/api/pre-registration/print/${preinscripcion.id}`;
    const newWindow = window.open(url, '_blank');
    if (!newWindow) {
      this.message.warning('Por favor, permite ventanas emergentes para ver el PDF');
      this.downloadCertificate(preinscripcion);
    } else {
      this.isDownloading[preinscripcion.id] = false;
    }
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
      identityCard: apiResponse.postulant.identityCard,
      postulant: apiResponse.postulant
    };
  }

  private mapStatusClass(state: string): string {
    switch (state) {
      case 'ACEPTADO': return 'status-ACEPTADO';
      case 'NO ACEPTADO': return 'status-NO_ACEPTADO';
      case 'VALIDADO': return 'status-VALIDADO';
      case 'INVALIDADO': return 'status-INVALIDADO';
      case 'REGISTRADO': return 'status-REGISTRADO';
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