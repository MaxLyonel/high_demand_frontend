import { Component, computed, inject, Inject, OnInit, signal } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService, NzModalModule, NzModalRef } from 'ng-zorro-antd/modal';
import { NzCardModule } from "ng-zorro-antd/card";
import { NzSpaceModule } from "ng-zorro-antd/space";
import { NzTagModule } from "ng-zorro-antd/tag";
import { NzTabsModule } from "ng-zorro-antd/tabs";
import { NzDescriptionsModule } from "ng-zorro-antd/descriptions";
import { NzListModule } from "ng-zorro-antd/list";
import { NzAvatarModule } from "ng-zorro-antd/avatar";
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzTableModule } from "ng-zorro-antd/table";
import { NzInputModule } from "ng-zorro-antd/input";
import { FormsModule } from '@angular/forms';
import { NzTimePickerModule } from 'ng-zorro-antd/time-picker';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { CommonModule } from '@angular/common';
import { NzTimelineModule } from 'ng-zorro-antd/timeline';
import { NzButtonComponent } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import IHistory from '../../../domain/ports/i-history';
import { RegistrationStatus } from '../../../domain/models/enum/registration-status.enum';
import IHighDemand from '../../../domain/ports/i-high-demand';
import { AppStore } from '../../../infrastructure/store/app.store';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { AbilityService } from '../../../infrastructure/services/ability.service';
import { finalize, of, switchMap, tap } from 'rxjs';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import IManagerInstitution from '../../../domain/ports/i-manager-institution';
import ICourseList from '../../../domain/ports/i-course-list';
import { NotificationService } from '../../../infrastructure/services/notify.service';
import { Router } from '@angular/router';

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


interface EventHistory {
  updatedAt: Date;
  registrationStatus: RegistrationStatus
  workflowState: string;
  userName: string;
  rol: string;
  observation?: string;
}

@Component({
  selector: 'app-seguimiento',
  templateUrl: './follow-up.component.html',
  styleUrls: ['./follow-up.component.less'],
  imports: [
    CommonModule,
    FormsModule,
    NzAvatarModule,
    NzButtonComponent,
    NzCardModule,
    NzDescriptionsModule,
    NzDividerModule,
    NzIconModule,
    NzInputModule,
    NzGridModule,
    NzListModule,
    NzModalModule,
    NzRadioModule,
    NzSelectModule,
    NzSpaceModule,
    NzTableModule,
    NzTabsModule,
    NzTabsModule,
    NzTagModule,
    NzTimelineModule,
    NzTimePickerModule,
    NzToolTipModule,
    NzTypographyModule,
    NzDatePickerModule
  ]
})
export class SeguimientoComponent implements OnInit {
  searchValue = signal('');
  filterEstado = signal<string | null>(null)
  filterStatusWorkflow = signal<string | null>(null)
  filterFecha =signal<Date | null>(null);

  loading = false;
  pageSize = 10;
  pageIndex = 1;
  total = 0;
  isVisibleModal = false;
  solicitudSeleccionada: Registration | null = null;


  appStore = inject(AppStore)
  historial: EventHistory[] = [];
  RegistrationStatus = RegistrationStatus;

  allRegistrations = signal<Registration[]>([])
  registration = signal<Registration[]>([]);

  abilitiesLoaded = signal(false);
  user!: any
  selectedRole!: any

  // *** variables para editar postulación ***
  levels!: any;
  institution = signal<any>(null);
  inputValue: number | null = null;

  selectedLevelId: number | null = null;
  selectedGradeId: number | null = null;
  selectedParallelId: number | null = null;
  gradesToShow: any[] = [];
  parallelsToShow: any[] = [];
  errorMessage: string = '';
  highDemand: any;
  isLoading: boolean = false;
  initLoading = false;
  listCourse: Array<any> = [];
  selectedCourses = signal<Array<any>>([])
  courseKeys = new Set<string>();
  haveCoursesSaved: boolean = false;
  showApplication = signal<boolean>(false)

  confirmModal?: NzModalRef;
  notificationService = inject(NotificationService)
  router = inject(Router)

  // Computed signal para el filtrado reactivo
  filteredRegistrations = computed(() => {
    if(!this.abilitiesLoaded()) {
      return []
    }
    const all = [...this.registration()];
    const search = this.normalizeText(this.searchValue()?.trim() || '');
    const estado = this.normalizeText(this.filterEstado() || '');
    const fecha = this.filterFecha();
    const workflowState = this.normalizeText(this.filterStatusWorkflow() || '')

    return all.filter(reg => {
      if(!this.canViewRequest(reg)) {
        return false;
      }
      const name = this.normalizeText(reg.educationalInstitutionName);
      const sie = this.normalizeText(reg.educationalInstitutionId.toString());
      const status = this.normalizeText(reg.registrationStatus);
      const workflowStatus = this.normalizeText(reg.workflowState);

      const matchesSearch = !search || name.includes(search) || sie.includes(search);
      const matchesEstado = !estado || status === estado;
      const matchesWorkflow = !workflowState || workflowStatus === workflowState
      const matchesFecha = !fecha ||
        new Date(reg.updatedAt).toDateString() === fecha.toDateString();

      return matchesSearch && matchesEstado && matchesFecha && matchesWorkflow;
    });
  });

  constructor(
    private message: NzMessageService,
    private modal: NzModalService,
    public abilityService: AbilityService,
    @Inject('IHistory') private readonly _history: IHistory,
    @Inject('IHighDemand') private readonly _highDemand: IHighDemand,
    @Inject('IManagerInstitution') private _institution: IManagerInstitution,
    @Inject('ICourseList') private _courses: ICourseList
  ) {}

  ngOnInit(): void {
    const { user } = this.appStore.snapshot;
    this.user = user;
    this.abilityService.loadAbilities(user.userId).subscribe(() => {
      this.abilitiesLoaded.set(true);
      this.loadData();
    });
  }

  // loadData(): void {
  //   const { user } = this.appStore.snapshot
  //   this.user = user
  //   this.selectedRole = user.selectedRole
  //   this.loading = true;
  //   this.abilityService.loadAbilities(user.userId).pipe(
  //     switchMap(() => this._history.showGeneralList())
  //   ).subscribe({
  //     next: (response:any) => {
  //       const filtered = response.data.filter((r: Registration) => this.canViewRequest(r))
  //       this.registration.set([...filtered]);
  //       this.historial = [...filtered];
  //       this.loading = false;
  //     },
  //     error: (err) => {
  //       this.loading = false
  //     }
  //   })
  // }

  loadData(): void {
    const { user } = this.appStore.snapshot;
    this.user = user;
    this.selectedRole = user.selectedRole;
    this.loading = true;
    this._history.showGeneralList().subscribe({
      next: (response: any) => {
        this.registration.set([...response.data]);
        this.historial = [...response.data];
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
      }
    });
  }

  onQueryParamsChange(params: any): void {
    const { pageSize, pageIndex } = params;
    this.pageSize = pageSize;
    this.pageIndex = pageIndex;
    this.loadData();
  }

  seeDetail(solicitud: Registration): void {
    this.solicitudSeleccionada = solicitud;
    this.isVisibleModal = true;

    const { institutionInfo } = this.appStore.snapshot
    const { id: institutionId } = institutionInfo
    this.getFullInfo(institutionId)
  }

  handleCancel(): void {
    this.isVisibleModal = false;
  }

  handleOk(): void {
    this.message.success('Acción confirmada');
    this.isVisibleModal = false;
  }

  descargarDocumentos(solicitud: any): void {
    this.message.info(`Descargando documentos de ${solicitud.unidadEducativa}`);
  }

  cancelRequest(request: any): void {
    this.modal.confirm({
      nzTitle: `¿Anular la postulación de la Unidad Educativa ${request.educationalInstitutionName}?`,
      nzContent: 'Esta acción no se reversible',
      nzOkText: 'Sí, anular',
      nzOkType: 'primary',
      nzOkDanger: true,
      nzCancelText: 'No',
      nzOnOk: () => {
        this._highDemand.cancelHighDemand(request).subscribe(response => {
          this.loading = true;
          this._history.showList(request.highDemandRegistrationId).subscribe((history:any) => {
            this.registration.set(history.data); // asegurarme que history.data existe
            this.historial = history.data
            this.loading = false;
          })
        })
      }
    });
  }

  getColorEstado(state?: string): string {
    switch (state) {
      case 'APROBADO': return 'success';
      case 'RECHAZADO': return 'error';
      case 'ANULADA': return 'error';
      case 'OBSERVADO': return 'warning';
      default: return 'processing';
    }
  }

  // Funciones para la búsqueda
  private normalizeText(text: string): string {
    return text
      ? text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
      : '';
  }

  onSearchChange(value: string): void {
    this.searchValue.set(value)
  }

  onEstadoChange(value: string | null): void {
    this.filterEstado.set(value)
  }

  onFechaChange(value: Date | null): void {
    this.filterFecha.set(value)
  }

  onWorkflowStatusChange(value: string | null): void {
    this.filterStatusWorkflow.set(value)
  }

  // **  ============== ACCESOS ===================== **
  canViewAllRequests(): boolean {
    const subject = { __typename: 'history'}
    return this.abilityService.getAbility()?.can('manage', subject) || false;
  }

  canAnnularRequest(request: Registration): boolean {
    const subject = { __typename: 'postulation' }
    return this.abilityService.can('delete', subject)
  }

  canUpdateRequest(request: Registration): boolean {
    const subject = { __typename: 'postulation'}
    return this.abilityService.can('update', subject)
  }

  canDownloadRequest(request: Registration): boolean {
    const result = this.abilityService.getAbility()
      ?.can('read', { __typename: 'request-report', user_id: request.userId }) || false
    return result
  }

  canViewRequest(request: Registration): boolean {
    //! El recurso 'history' (historial) puede ser leido
    //! siempre y cuando el usuario (user_id) sea el propietario
    // console.log("userId", request)
    // const result =  this.abilityService.getAbility()
    //   ?.can('read', { __typename: 'history', user_id: request.userId}) || false;
    // return result
    return true
  }

  canSeeOnlyRequest(request: Registration): boolean {
    if(request.rolId !== 37) { // Es distrital
      const subject = { __typename: 'history', educationalInstitutionId: request.educationalInstitutionId }
      return this.abilityService.can('read', subject)
    } else return false
  }

  // *** funciones para editar la postulacioń ***
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
        this.courseKeys = new Set(
          this.listCourse.map(c =>
            `${c.levelId}-${c.gradeId}-${c.parallelId}`
          )
        );
        if(this.listCourse.length) this.haveCoursesSaved = true
        else this.haveCoursesSaved = false
        this.selectedCourses.set(this.listCourse);
        this.showApplication.set(true);
      },
      error: (err) => {
        this.showApplication.set(false);
        console.error('Error cargando datos', err);
      }
    });
  }

  onLevelSelected(levelId: number) {
    this.inputValue = null;
    this.selectedGradeId = null;
    this.selectedParallelId = null;
    this.gradesToShow = []
    this.parallelsToShow = []
    const level = this.levels.find((l:any) => l.id === levelId)
    this.gradesToShow = level ? level.grades : []
  }

  onGradeSelected(gradeId: number) {
    this.inputValue = null;
    this.selectedParallelId = null;
    this.parallelsToShow = [];
    const grade = this.gradesToShow.find((g:any) => g.id === gradeId)
    this.parallelsToShow = grade ? grade.parallels : []
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

  showConfirmRegistrationQuota(): void { // Modal cuando se registra el cursos y la cuota
    this.confirmModal = this.modal.confirm({
      nzTitle: 'Registrar la cantidad de cupos',
      nzContent: 'Asegurese de registrar la cantidad correcta de cupos',
      nzOnOk: () => this.addCourseForRegister()
    });
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

  deleteSelection(index: any) {
    const course = this.listCourse[index]
    if(!course) return
    const key = `${course.levelId}-${course.gradeId}-${course.parallelId}`
    this.listCourse.splice(index, 1)
    this.courseKeys.delete(key)
    this.selectedCourses.set(this.listCourse)
  }

  showConfirmRegistrationHighDemand(): void { // Modal cuando se registra la institución como alta demanda
    this.confirmModal = this.modal.confirm({
      nzTitle: '¿Finalizar la postulación de la Unidad Educativa?',
      nzContent: 'Favor aproximarse al distrito correspondiente para ratificar su solicitud',
      nzOnOk: () => {
        this.submitHighDemand()
      }
    })
  }

  canUpdatePostulation() {
    const subject = { __typename: 'postulation'}
    return this.abilityService.can('update', subject)
  }

  submitHighDemand() { // Registrar institución con sus cursos como alta demanda
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

    this._highDemand.registerHighDemand(requestData).subscribe({
      next: (response: any) => {
        this.highDemand = response.data
        this.router.navigate(['/alta-demanda/follow-up'])
      },
      error: (err) => {
        console.error('Error durante el  flujo de alta demanda: ', err)
      }
    })
  }

}