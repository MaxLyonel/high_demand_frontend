import { CommonModule } from "@angular/common";
import { Component, effect, EventEmitter, inject, Inject, input, Input, model, OnInit, Output, signal, TemplateRef } from "@angular/core";
import { NzCardModule } from "ng-zorro-antd/card";
import { NzDescriptionsModule } from "ng-zorro-antd/descriptions";
import { NzDividerModule } from "ng-zorro-antd/divider";
import { NzGridModule } from "ng-zorro-antd/grid";
import { NzIconModule } from "ng-zorro-antd/icon";
import { NzInputModule } from "ng-zorro-antd/input";
import { NzListModule } from "ng-zorro-antd/list";
import { NzModalModule, NzModalRef, NzModalService } from "ng-zorro-antd/modal";
import { NzRadioModule } from "ng-zorro-antd/radio";
import { NzTagModule } from "ng-zorro-antd/tag";
import { finalize, of, switchMap, tap } from "rxjs";
import { FormsModule } from "@angular/forms";
import { NzButtonModule } from "ng-zorro-antd/button";
import { NzTypographyModule } from "ng-zorro-antd/typography";
import { RegistrationStatus } from "../../../domain/models/enum/registration-status.enum";
import { NotificationService } from "../../../infrastructure/services/notify.service";
import IManagerInstitution from "../../../domain/ports/i-manager-institution";
import IHighDemand from "../../../domain/ports/i-high-demand";
import ICourseList from "../../../domain/ports/i-course-list";

interface Registration {
  id: number;
  educationalInstitutionName: string;
  educationalInstitutionId: number;
  createdAt: Date;
  registrationStatus: RegistrationStatus
  workflowState: string,
  observation: string,
  updatedAt: Date;
  userName: string;
  rol: string;
  rolId: number;
  userId: number;
}


@Component({
  selector: 'edit-modal',
  imports: [
    CommonModule,
    FormsModule,
    NzButtonModule,
    NzModalModule,
    NzDescriptionsModule,
    NzGridModule,
    NzDividerModule,
    NzCardModule,
    NzListModule,
    NzRadioModule,
    NzInputModule,
    NzIconModule,
    NzTagModule,
    NzTypographyModule
  ],
  templateUrl: './edit.modal.component.html',
  styleUrl: './edit.modal.components.less'
})
export default class EditModalComponent {
  isVisible  = model<boolean>(false);
  title      = input<string | TemplateRef<{}>>('');
  request    = input<Registration | null>(null);
  sie        = input<number | null>(null);
  canUpdated = input<boolean>(false);
  currentRole = input<number | null>(null);


  notificationService = inject(NotificationService);

  institution = signal<any>(null);
  listCourse: Array<any> = [];
  courseKeys = new Set<string>();
  haveCoursesSaved: boolean = false;
  selectedCourses = signal<Array<any>>([]);

  levels!: any;
  highDemand: any;
  inputValue: number | null = null;
  selectedLevelId: number | null = null;
  selectedGradeId: number | null = null;
  selectedParallelId: number | null = null;
  gradesToShow: any[] = [];
  parallelsToShow: any[] = [];

  confirmModal?: NzModalRef;
  initLoading = false;

  constructor(
    @Inject('IManagerInstitution')
    private readonly _institution: IManagerInstitution,
    @Inject('IHighDemand')
    private readonly _highDemand: IHighDemand,
    @Inject('ICourseList')
    private readonly _courses: ICourseList,
    private modal: NzModalService
  ) {
    effect(() => {
      const currentSie = this.sie();
      if (currentSie) {
        this.getFullInfo(currentSie);
      }
    });
  }

  @Input() width: number = 1300;
  @Input() showFooter: boolean = true;

  @Output() ok = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();


  getFullInfo(sie: number | null) {
    if(!sie) return;
    this._institution.getInfo(sie).pipe(
      tap(institution => {
        if(!institution) return;
        this.institution.set(institution)
      }),
      switchMap(() =>
        this._courses.showCourses(sie, 2025)
      ),
      tap(courses => {
        this.levels = courses
      }),
      switchMap(() =>
        this._highDemand.getHighDemandByInstitution(sie)
      ),
      switchMap((highDemand) => {
        if(!highDemand) {
          return of([]);
        }
        this.highDemand = highDemand;
        return this._highDemand.getCoures(highDemand.id)
      }),
      finalize(() => {
        this.initLoading = false
      })
    ).subscribe({
      next: (courses) => {
        console.log("cursos obtenidos: ", courses)
        this.listCourse = courses.map((course: any) => ({
          checked: true,
          name: `${course.levelName} - ${course.gradeName} - ${course.parallelName} - cupo: ${course.totalQuota}`,
          quota: course.totalQuota,
          levelId: course.levelId,
          gradeId: course.gradeId,
          parallelId: course.parallelId
        }));
        this.courseKeys = new Set(
          this.listCourse.map(c =>
            `${c.levelId}-${c.gradeId}-${c.parallelId}`
          )
        );
        if(this.listCourse.length) this.haveCoursesSaved = true
        else this.haveCoursesSaved = false
        this.selectedCourses.set(this.listCourse)
      },
      error: (err) => {
        console.error('Error cargando datos', err)
      }
    })
  }

  onLevelSelected(levelId: number) {
    this.inputValue = null;
    this.selectedGradeId = null;
    this.selectedParallelId = null;
    this.parallelsToShow = []
    const level = this.levels.find((l: any) => l.id === levelId)
    this.gradesToShow = level ? level.grades : []
  }

  onGradeSelected(gradeId: number) {
    this.inputValue = null;
    this.selectedParallelId = null;
    this.parallelsToShow = [];
    const grade = this.gradesToShow.find((g: any) => g.id === gradeId)
    this.parallelsToShow = grade ? grade.parallels : []
  }

  addCourseForRegister() { // Agregar cursos a la lista
    const { level, grade, parallel } = this.getStructure(this.selectedLevelId!, this.selectedGradeId!, this.selectedParallelId!)
    const key = `${this.selectedLevelId}-${this.selectedGradeId}-${this.selectedParallelId}`
    if(this.courseKeys.has(key)) {
      this.notificationService.showMessage(
        'El curso ya fue agregado',
        'Solicitud inválida',
        'warning'
      )
      return;
    }
    this.initLoading = true
    this.listCourse.push({
      checked: true,
      name: `${level.name} ${grade.name} ${parallel.name} - cupo:${this.inputValue}`,
      quota: this.inputValue!,
      levelId: this.selectedLevelId!,
      gradeId: this.selectedGradeId!,
      parallelId: this.selectedParallelId!
    })
    this.courseKeys.add(key)
    this.selectedCourses.set(this.listCourse)
    // Limpiar valores del formulario
    this.inputValue = null
    this.selectedLevelId = null;
    this.selectedGradeId = null;
    this.selectedParallelId = null;
    this.gradesToShow = [];
    this.parallelsToShow = [];

    setTimeout(() => {
      this.initLoading = false
    }, 300)
  }

  deleteSelection(index: any) {
    const course = this.listCourse[index]
    if(!course) return;
    const key = `${course.levelId}-${course.gradeId}-${course.parallelId}`;
    this.listCourse.splice(index, 1);
    this.courseKeys.delete(key);
    this.selectedCourses.set(this.listCourse)
  }

  getStructure(levelId: number, gradeId: number, parallelId: number) {
    const level = this.levels.find((e: any) => e.id == levelId)
    const grade = level.grades.find((e: any) => e.id == gradeId)
    const parallel = grade.parallels.find((e: any) => e.id == parallelId)
    return {
      level,
      grade,
      parallel
    }
  }

  submitHighDemand() { // Registrar institución con sus cursos como alta demanda
    const highDemand = this.highDemand

    const courses = this.selectedCourses().map((item: any) => ({
      levelId: item.levelId,
      gradeId: item.gradeId,
      parallelId: item.parallelId,
      totalQuota: item.quota
    }));

    const requestData = {
      highDemand,
      courses,
      currentRole: this.currentRole()
    };

    this._highDemand.editHighDemand(requestData).subscribe({
      next: (response: any) => {
        console.log("todo salio bien")
      },
      error: (err) => {
        console.error('Error durante la edición de alta demanda', err)
      }
    })
  }

  handleOk(): void {
    this.ok.emit()
  }

  handleCancel(): void {
    this.cancel.emit()
  }

  // Funciones auxiliares
  getColorEstado(state?: string): string {
    switch (state) {
      case 'APROBADO': return 'success';
      case 'RECHAZADO': return 'error';
      case 'ANULADA': return 'error';
      case 'OBSERVADO': return 'warning';
      default: return 'processing';
    }
  }

  disabledButtonRegisterCourse() {
    if(
      this.inputValue === null ||
      this.inputValue === 0 ||
      this.inputValue > 40 ||
      this.haveCoursesSaved === null ||
      this.selectedLevelId === null ||
      this.selectedGradeId === null ||
      this.selectedParallelId === null
    ) {
      return true
    } else return false
  }

  // Funciones de confirmación registro de cupo
  showConfirmRegistrationQuota(): void {
    this.confirmModal = this.modal.confirm({
      nzTitle: 'Registrar la cantidad de cupos',
      nzContent: 'Asegurese de registrar la cantidad correcta de cupos',
      nzOnOk: () => this.addCourseForRegister()
    })
  }

  // Modal cuando se registra la institución como alta demanda
  showConfirmRegistrationHighDemand(): void {
    this.modal.confirm({
      nzTitle: '¿Está seguro de editar la postulación de la Unidad Educativa?',
      nzContent: 'Esta edición es posible siempre y cuando no lo recepcione su distrital',
      nzOnOk: () => {
        this.submitHighDemand()
      }
    })
  }

}