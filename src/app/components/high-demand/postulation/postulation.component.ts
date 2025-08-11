import { Component, inject, Inject, OnInit, signal } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { NzButtonModule } from "ng-zorro-antd/button";
import { NzCardComponent } from "ng-zorro-antd/card";
import { NzCheckboxModule, NzCheckboxOption } from "ng-zorro-antd/checkbox";
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
import { switchMap, tap, catchError } from 'rxjs';
import { CommonModule } from "@angular/common";
import ICourseList from "../../../domain/ports/i-course-list";
import { NzModalModule, NzModalRef, NzModalService } from "ng-zorro-antd/modal";
import { NzTagComponent } from "ng-zorro-antd/tag";
import IManagerTeacher from "../../../domain/ports/i-manager-teacher";
import { LocalStorageService } from "../../../infrastructure/services/local-storage.service";
import IInstituionDetail from "../../../domain/ports/i-institution-detail";
import IHighDemand from "../../../domain/ports/i-high-demand";
import { Router } from "@angular/router";


interface CourseRegister {
  id: number;
  level: number;
  grade: number;
  parallel: number;
}

@Component({
  standalone: true,
  imports: [
    CommonModule,
    NzDescriptionsModule,
    FormsModule,
    NzTabsModule,
    NzInputNumberModule,
    NzRadioModule,
    NzTypographyModule,
    NzCardComponent,
    NzSpaceModule,
    NzGridModule,
    NzListModule,
    NzButtonModule,
    NzInputModule,
    NzIconModule,
    NzCheckboxModule,
    //modal
    NzModalModule,
    NzTagComponent
],
  selector: 'app-postulation',
  templateUrl: './postulation.component.html',
  styleUrl: './postulation.component.less'
})
export class PostulationComponent implements OnInit {
  selectedLevelIndex = 0;
  selectedGradeIndex = 0;
  selectedParallelIndex = 0;

  initLoading = false;

  inputValue: number | null = null;

  allChecked = false;
  selectedCourses = signal<Array<any>>([])

  // mis variables
  institution!: any
  levels!: any
  // modal
  modal = inject(NzModalService)
  localStorageService = inject(LocalStorageService)
  router = inject(Router)
  confirmModal?: NzModalRef;

  registeredCourses: Array<CourseRegister[]> = []

  selectedLevel: any;
  selectedGrade: any;
  selectedParallel: any;
  listCourse: Array<{ name: string, checked?: boolean, quota: number, levelId: number, gradeId: number, parallelId: number }> = [];

  constructor(
    @Inject('IInstituionDetail') private _institution: IInstituionDetail,
    @Inject('ICourseList') private _courses: ICourseList,
    @Inject('IMangerTeacher') private _teacher: IManagerTeacher,
    @Inject('IHighDemand') private _highDemand: IHighDemand
  ) {}

  onLevelChange(index: any[]): void {
    this.selectedLevel = this.levels[this.selectedLevelIndex]
  }

  onGradeChange(index: any[]): void {
    const levelSelected = this.levels[this.selectedLevelIndex]
    this.selectedGrade = levelSelected.grades[this.selectedGradeIndex];
  }

  onParallelChange(obj: any[]): void {
    const levelSelected = this.levels[this.selectedLevelIndex]
    const gradeSelected = levelSelected.grades[this.selectedGradeIndex]
    this.selectedParallel = gradeSelected.parallels[this.selectedParallelIndex]
  }

ngOnInit(): void {
  const user = this.localStorageService.getUser();
  const { personId } = user;

  this._teacher.getInfoTeacher(personId).pipe(
    switchMap(res => {
      const { educationalInstitutionId: sie } = res;
      return this._institution.getInfoInstitution(sie);
    }),
    tap(institution => this.institution = institution),
    switchMap(institution => 
      this._courses.showCourses(institution.id, 2025).pipe(
        tap(courses => {
          this.levels = courses;
          if (this.levels.length > 0) {
            this.selectedLevel = this.levels[0];
            if (this.selectedLevel.grades.length > 0) {
              this.selectedGrade = this.selectedLevel.grades[0];
              if (this.selectedGrade.parallels.length > 0) {
                this.selectedParallel = this.selectedGrade.parallels[0];
              }
            }
          }
        }),
        switchMap(() => this._highDemand.getHighDemandByInstitution(institution.id))
      )
    ),
    switchMap(highDemand => this._highDemand.getCoures(highDemand.id))
  ).subscribe({
    next: (courses) => {
      this.listCourse = []; // limpia la lista antes de agregar
      for (let course of courses) {
        this.listCourse.push({
          checked: true,
          name: `${course.levelName} ${course.gradeName} ${course.parallelName} - cupo:${course.totalQuota}`,
          quota: course.levelId!,
          levelId: course.levelId,
          gradeId: course.gradeId,
          parallelId: course.parallelId
        });
      }
    },
    error: (err) => {
      console.error('Error cargando datos', err);
    }
  });
}


  onCheckboxChange(item: any, isChecked: boolean) {
    item.checked = isChecked;
    this.updateSelectedCourses();
  }

  updateSelectedCourses() {
    this.selectedCourses.set(this.listCourse.filter(c => c.checked))
    console.log('Cursos seleccionados:', this.selectedCourses());
  }


saveCourses() {
  const { id: educationalInstitutionId } = this.institution;
  const { userId } = this.localStorageService.getUser();

  const highDemand = {
    educationalInstitutionId,
    userId
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

  console.log('Datos a enviar:', requestData);

  // Enviar al servicio
  this._highDemand.registerHighDemand(requestData).subscribe({
    next: (response) => {
      console.log("id a ir 1", response.data)
      console.log("id a ir 2", response.data.highDemandRegistration)
      const newId = response.data.highDemandRegistration.id
      console.log("id a ir 3", newId)
      setTimeout(() => {
        this.router.navigate(['/alta-demanda/follow-up'])
      }, 1000)
    },
    error: (err) => {
      console.error('Error al registrar:', err);
    }
  });
}



  // Modales
  showConfirmRegistrationQuota(): void {
    this.confirmModal = this.modal.confirm({
      nzTitle: 'Registrar la cantidad de cupos',
      nzContent: 'Asegurese de registrar la cantidad correcta de cupos',
      nzOnOk: () => {
        this.listCourse.push({
          checked: true,
          name: `${this.selectedLevel.levelName} ${this.selectedGrade.gradeName} ${this.selectedParallel.parallelName} - cupo:${this.inputValue}`,
          quota: this.inputValue!,
          levelId: this.selectedLevel.levelId,
          gradeId: this.selectedGrade.gradeId,
          parallelId: this.selectedParallel.parallelId
        })
        this.selectedCourses.set(this.listCourse)
        this.inputValue = null
      }
    });
  }

  showConfirmRegistrationHighDemand(): void {
    this.confirmModal = this.modal.confirm({
      nzTitle: 'Registrar la Unidad Educativa como Alta Demanda',
      nzContent: 'Revise antes de confirmar',
      nzOnOk: () => {
        const { userId } = this.localStorageService.getUser();
        this._highDemand.getHighDemandByInstitution(this.institution.id).subscribe({
          next: (highDemand) => {
            const obj = {
              highDemandRegistrationId: highDemand.id,
              userId: userId,
              workflowStateId: 2,
              registrationStatus: highDemand.registrationStatus,
              observation: ''
            }
            this._highDemand.updateWorkflowState(obj).subscribe({
              next: () => console.log('todo salio bien'),
            })
          }
        }
        )
      }
        // new Promise((resolve, reject) => {
        //   setTimeout(Math.random() > 0.5 ? resolve : reject, 1000);
        // }).catch(() => console.log('Oops errors!'))
    })
  }
}
