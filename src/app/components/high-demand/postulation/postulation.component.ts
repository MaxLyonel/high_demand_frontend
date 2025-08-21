// framework angular
import { CommonModule } from "@angular/common";
import { Router } from "@angular/router";
import { Component, inject, Inject, OnInit, signal } from "@angular/core";
// external dependencies
import { FormsModule } from "@angular/forms";
import { finalize, of, switchMap, tap } from 'rxjs';
// libreries framework components
import { NzButtonModule } from "ng-zorro-antd/button";
import { NzCardComponent } from "ng-zorro-antd/card";
import { NzCheckboxModule } from "ng-zorro-antd/checkbox";
import { NzDescriptionsModule } from "ng-zorro-antd/descriptions";
import { NzGridModule } from "ng-zorro-antd/grid";
import { NzIconModule } from "ng-zorro-antd/icon";
import { NzInputModule } from "ng-zorro-antd/input";
import { NzInputNumberModule } from "ng-zorro-antd/input-number";
import { NzListModule } from "ng-zorro-antd/list";
import { NzRadioModule } from "ng-zorro-antd/radio";
import { NzSpaceModule } from "ng-zorro-antd/space";
import { NzTabsModule } from "ng-zorro-antd/tabs";
import { NzTypographyModule } from "ng-zorro-antd/typography";
import { NzModalModule, NzModalRef, NzModalService } from "ng-zorro-antd/modal";
import { NzTagComponent } from "ng-zorro-antd/tag";
// own implementations
import ICourseList from "../../../domain/ports/i-course-list";
import { LocalStorageService } from "../../../infrastructure/services/local-storage.service";
import IHighDemand from "../../../domain/ports/i-high-demand";
import { AppStore } from '../../../infrastructure/store/app.store';
import { AbilityService } from "../../../infrastructure/services/ability.service";
import { User } from "../../../domain/models/user.model";


interface CourseList {
  name: string;
  checked?: boolean;
  quota: number;
  levelId: number;
  gradeId: number;
  parallelId: number;
}

@Component({
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NzButtonModule,
    NzCardComponent,
    NzCheckboxModule,
    NzDescriptionsModule,
    NzGridModule,
    NzIconModule,
    NzInputModule,
    NzInputNumberModule,
    NzListModule,
    NzModalModule,
    NzRadioModule,
    NzSpaceModule,
    NzTabsModule,
    NzTagComponent,
    NzTypographyModule
  ],
  selector: 'app-postulation',
  templateUrl: './postulation.component.html',
  styleUrl: './postulation.component.less'
})
export class PostulationComponent implements OnInit {

  // injects
  modal               = inject(NzModalService)
  localStorageService = inject(LocalStorageService)
  router              = inject(Router)
  appStore            = inject(AppStore)
  abilities           = inject(AbilityService)

  // signals
  selectedCourses = signal<Array<Omit<CourseList, 'name' | 'checked'>>>([])
  listCourse: Array<CourseList> = [];

  // --- variables receptoras ---
  levels!: any
  institution!: any
  inputValue: number | null = null;

  // --- indicadores de carga
  initLoading = false;

  // ----- variables para seleccionar curso ------
  selectedLevelId: number | null = null;
  selectedGradeId: number | null = null;
  selectedParallelId: number | null = null;
  gradesToShow: any[] = [];
  parallelsToShow: any[] = [];

  // --- control de flujo
  hasSavedCourses: boolean = false
  confirmModal?: NzModalRef;
  user!: User
  highDemand: any

  constructor(
    @Inject('ICourseList')   private _courses    : ICourseList,
    @Inject('IHighDemand')   private _highDemand : IHighDemand
  ) {}

  ngOnInit(): void {
    this.initLoading = true;
    this.user = this.appStore.snapshot.user
    const { institutionInfo } = this.appStore.snapshot
    if (!institutionInfo) {
      return;
    }

    const { id: institutionId } = institutionInfo
    this.institution = institutionInfo

    this._courses.showCourses(institutionId, 2025).pipe(
      finalize(() => {
        this.initLoading = false
      }),
      tap(courses => {
        this.levels = courses;
      }),
      switchMap(() => this._highDemand.getHighDemandByInstitution(institutionId)),
      switchMap((highDemand) => {
        if(!highDemand) {
          return of([])
        }
        this.highDemand = highDemand
        return this._highDemand.getCoures(highDemand.id)
      })
    ).subscribe({
        next: (courses) => {
          this.listCourse = []
          for(let course of courses) {
            this.listCourse.push({
              checked: true,
              name: `${course.levelName} - ${course.gradeName} ${course.parallelName} - cupo:${course.totalQuota}`,
              quota: course.levelId!,
              levelId: course.levelId,
              gradeId: course.gradeId,
              parallelId: course.parallelId
            })
          }
          this.selectedCourses.set(this.listCourse)
          if(this.listCourse.length > 0) {
            this.hasSavedCourses = true
          } else this.hasSavedCourses = false
        },
        error: (err) => {
          console.error('Error cargando datos', err);
        }
    })
  }

  // ============= FUNCIONES PRINCIPALES ==========
  saveCourses() { // Registrar institución con sus cursos como alta demanda
    const { id: educationalInstitutionId } = this.institution;
    const { user } = this.appStore.snapshot
    const { userId, selectedRole } = user
    const rolAllowed = selectedRole.id

    const highDemand = {
      educationalInstitutionId,
      userId,
      rolId: rolAllowed
    };

    const courses = this.selectedCourses().map((item: any) => ({
      levelId: item.levelId,
      gradeId: item.gradeId,
      parallelId: item.parallelId,
      totalQuota: item.quota
    }));

    const requestData = {
      highDemand,
      courses
    };

    // Enviar al servicio
    this._highDemand.registerHighDemand(requestData).subscribe({
      next: (response: any) => {
        this.hasSavedCourses = true
        this.highDemand = response.data
        // setTimeout(() => {
        //   this.router.navigate(['/alta-demanda/follow-up'])
        // }, 400)
      },
      error: (err) => {
        this.hasSavedCourses = false
        console.error('Error al registrar:', err);
      }
    });
  }

  sendHighDemand() {
    const { user } = this.appStore.snapshot
    this._highDemand.sendHighDemand(this.highDemand).subscribe({
      next: (response: any) => {
        this.router.navigate(['/alta-demanda/follow-up'])
      },
      error: (err) => {
        console.log("Error al enviar alta demanda")
      }
    })
  }

  addCourseForRegister() { // Agregar cursos a la lista
    const { level, grade, parallel } = this.getStructure(this.selectedLevelId!, this.selectedGradeId!, this.selectedParallelId!)
    this.initLoading = true
    this.listCourse.push({
      checked: true,
      name: `${level.name} ${grade.name} ${parallel.name} - cupo:${this.inputValue}`,
      quota: this.inputValue!,
      levelId: this.selectedLevelId!,
      gradeId: this.selectedGradeId!,
      parallelId: this.selectedParallelId!
    })
    this.inputValue = null
    this.selectedCourses.set(this.listCourse)
    setTimeout(() => {
      this.initLoading = false
    }, 300)
  }

  // ============= FUNCIONES DE INTERFAZ DE USUARIO ===============
  onLevelSelected(levelId: number) { // Cuando se selecciona el nivel
    const level = this.levels.find((l:any) => l.id === levelId)
    this.gradesToShow = level ? level.grades : []
  }

  onGradeSelected(gradeId: number) { // Cuando se selecciona el grado
    const grade = this.gradesToShow.find((g:any) => g.id === gradeId)
    this.parallelsToShow = grade ? grade.parallels : []
  }

  onCheckboxChange(item: any, isChecked: boolean) { // Cuando se cambia el estadod el Checkbox
    item.checked = isChecked;
    this.selectedCourses.set(this.listCourse.filter(c => c.checked))
  }

  // ================== FUNCIONES AUXILIARES =======================
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

  //  ========================= MODALES ============================
  showConfirmRegistrationQuota(): void { // Modal cuando se registra el cursos y la cuota
    this.confirmModal = this.modal.confirm({
      nzTitle: 'Registrar la cantidad de cupos',
      nzContent: 'Asegurese de registrar la cantidad correcta de cupos',
      nzOnOk: () => this.addCourseForRegister()
    });
  }

  showConfirmRegistrationHighDemand(): void { // Modal cuando se registra la institución como alta demanda
    this.confirmModal = this.modal.confirm({
      nzTitle: 'Registrar la Unidad Educativa como Alta Demanda',
      nzContent: 'Revise antes de confirmar',
      nzOnOk: () => {
        this.sendHighDemand()
      }
    })
  }
  //  ====================== FIN MODALES ============================

  canUpdateUser = () => {
    if (!this.user) {
      return false;
    }
    const caslUser = {
      id: this.user.userId, // CASL espera "id"
      ...this.user
    };

    this.abilities.debugCan('manage', 'postulation');
    return this.abilities.getAbility()?.can('manage', 'postulation' ) ?? false;
  }

}
