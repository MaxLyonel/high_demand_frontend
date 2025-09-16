// framework angular
import { CommonModule } from "@angular/common";
import { Router } from "@angular/router";
import { Component, EventEmitter, inject, Inject, OnInit, Output, signal } from "@angular/core";
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
import IManagerInstitution from "../../../domain/ports/i-manager-institution";


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
    NzTypographyModule,
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
  institution = signal<any>(null);
  inputValue: number | null = null;

  // --- indicadores de carga
  initLoading = false;

  // ----- variables para seleccionar curso ------
  selectedLevelId: number | null = null;
  selectedGradeId: number | null = null;
  selectedParallelId: number | null = null;
  gradesToShow: any[] = [];
  parallelsToShow: any[] = [];

  confirmModal?: NzModalRef;
  user!: User
  highDemand: any
  showApplication = signal<boolean>(false)

  sieCode: string = '';
  isLoading: boolean = false;
  errorMessage: string = '';

  constructor(
    @Inject('ICourseList')   private _courses    : ICourseList,
    @Inject('IHighDemand')   private _highDemand : IHighDemand,
    @Inject('IManagerInstitution') private _institution: IManagerInstitution
  ) {}

  get hasSavedCourses() {
    return this.appStore.getHighDemandCoursesSaved();
  }

  ngOnInit(): void {
    this.initLoading = true;
    this.user = this.appStore.snapshot.user
    const { institutionInfo } = this.appStore.snapshot
    if (!institutionInfo) {
      return;
    }

    const { id: institutionId } = institutionInfo
    this.getFullInfo(institutionId)

  }

  // ============= FUNCIONES PRINCIPALES ==========
  saveCourses() { // Registrar institución con sus cursos como alta demanda
    const { id: educationalInstitutionId } = this.institution();
    const { user } = this.appStore.snapshot
    const { userId, selectedRole } = user
    const rolAllowed = selectedRole.role.id

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
        this.highDemand = response.data
      },
      error: (err) => {
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
        console.error("Error al enviar alta demanda")
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

  canCreatePostulation = () => {
    if (!this.user) {
      return false;
    }
    const caslUser = {
      id: this.user.userId, // CASL espera "id"
      ...this.user
    };

    // this.abilities.debugCan('manage', 'postulation');
    return this.abilities.getAbility()?.can('create', 'postulation' ) ?? false;
  }

  searchInstitution(): void {
    if (!this.sieCode.trim()) {
      this.errorMessage = 'Por favor ingrese un código SIE válido';
      return;
    }
    this.isLoading = true;
    this.errorMessage = '';
    this.institution.set(null);
    this.getFullInfo(Number(this.sieCode))

  }

  clearSearch(): void {
    this.sieCode = '';
    this.institution.set(null);
    this.errorMessage = '';
  }

  getFullInfo(sie: number) {
    this._institution.getInfo(sie).pipe(
      tap(institution => {
        if(!institution) this.errorMessage = 'No se encontró Unidad Educativa con el SIE introducido';
        this.institution.set(institution);
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
        if (!highDemand) {
          return of([]);
        }
        const { rolId, workflowStateId } = highDemand;
        // Si aún está con el director, y su estado es EN REVISIÓN
        if (rolId === 9 && workflowStateId === 2) {
          this.appStore.setHighDemandCoursesSaved(false);
        } else {
          this.appStore.setHighDemandCoursesSaved(true);
        }
        this.highDemand = highDemand;
        return this._highDemand.getCoures(highDemand.id);
      }),
      finalize(() => {
        this.isLoading = false;
        this.initLoading = false;
      })
    ).subscribe({
      next: (courses) => {
        this.listCourse = courses.map((course:any) => ({
          checked: true,
          name: `${course.levelName} - ${course.gradeName} ${course.parallelName} - cupo:${course.totalQuota}`,
          quota: course.levelId!,
          levelId: course.levelId,
          gradeId: course.gradeId,
          parallelId: course.parallelId
        }));
        this.showApplication.set(true);
        this.selectedCourses.set(this.listCourse);
      },
      error: (err) => {
        this.showApplication.set(false);
        console.error('Error cargando datos', err);
      }
    });
  }

  deleteSelection(index: any) {
    this.listCourse.splice(index, 1)
  }

  canPostulation() {
    const subject = { __typename: 'postulation'}
    return this.abilities.can('create', subject)
  }

}
