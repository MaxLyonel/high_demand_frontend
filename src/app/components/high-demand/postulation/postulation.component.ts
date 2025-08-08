import { Component, inject, Inject, OnInit } from "@angular/core";
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
import { NzTabPosition, NzTabsModule } from "ng-zorro-antd/tabs";
import { NzTypographyModule } from "ng-zorro-antd/typography";
import IInstituionDetail from "../../../domain/ports/i-institution-detail";
import { map, tap } from "rxjs";
import { CommonModule } from "@angular/common";
import ICourseList from "../../../domain/ports/i-course-list";
import { NzModalModule, NzModalRef, NzModalService } from "ng-zorro-antd/modal";


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
  ],
  selector: 'app-postulation',
  templateUrl: './postulation.component.html',
})
export class PostulationComponent implements OnInit {
  selectedLevelIndex = 0;
  selectedGradeIndex = 0;
  selectedParallelIndex = 0;


  initLoading = false;

  inputValue: string | null = null;
  // listCourse: Array<{ loading: boolean; name: any}> =[]

  allChecked = false;
  value: Array<string | number> = ['1', '2'];
  options: NzCheckboxOption[] = [
    { label: '', value: '1'}
  ]

  // mis variables
  institution!: any
  levels!: any
  // modal
  modal = inject(NzModalService)
  confirmModal?: NzModalRef;

  registeredCourses: Array<CourseRegister[]> = []

  selectedLevelId?: number;
  selectedGradeId?: number;
  selectedParallelId?: number;
  listCourse: Array<{ name: string, checked?: boolean }> = [];

  constructor(
    @Inject('IInstituionDetail') private _institution: IInstituionDetail,
    @Inject('ICourseList') private _courses: ICourseList
  ) {}


  onCheckChange(index: number): void {
    console.log(this.listCourse[index].name, 'checked?', this.listCourse[index].checked);
  }

  onLevelChange(index: any[]): void {
    this.selectedLevelId = this.levels[this.selectedLevelIndex]?.levelId
  }

  onGradeChange(index: any[]): void {
    const levelSelected = this.levels[this.selectedLevelIndex]
    this.selectedGradeId = levelSelected.grades[this.selectedGradeIndex]?.gradeId;
  }

  onParallelChange(obj: any[]): void {
    const levelSelected = this.levels[this.selectedLevelIndex]
    const gradeSelected = levelSelected.grades[this.selectedGradeIndex]
    this.selectedParallelId = gradeSelected.parallels[this.selectedParallelIndex]?.parallelId
    console.log("this.selectedParallelId: ", this.selectedParallelId)
  }

  ngOnInit(): void {
    this._institution.getInfoInstitution(30680007).subscribe(
      (institution: any) => {
        console.log("institution", institution)
        this.institution = institution
      }
    )

    this._courses.showCourses(30680007, 2025).subscribe(
      (courses: any) => {
        console.log("cursos obtenidos ", courses)
        this.levels = courses
      }
    )
  }
  updateSingleCheked(): void {
    this.allChecked = this.value.length === this.options.length;
  }

  showConfirmRegistrationQuota(): void {
    this.confirmModal = this.modal.confirm({
      nzTitle: 'Registrar la cantidad de cupos',
      nzContent: 'Asegurese de registrar la cantidad correcta de cupos',
      nzOnOk: () =>
        new Promise((resolve, reject) => {
          setTimeout(Math.random() > 0.5 ? resolve : reject, 1000);
          this.listCourse.push({
            checked: true,
            name: `${this.selectedLevelId} ${this.selectedGradeId} ${this.selectedParallelId} ${this.inputValue}`
          })
        }).catch(() => console.log('Oops errors!'))
    });
  }

  showConfirmRegistrationHighDemand(): void {
    this.confirmModal = this.modal.confirm({
      nzTitle: 'Registrar la Unidad Educativa como Alta Demanda',
      nzContent: 'Revise antes de confirmar',
      nzOnOk: () =>
        new Promise((resolve, reject) => {
          setTimeout(Math.random() > 0.5 ? resolve : reject, 1000);
        }).catch(() => console.log('Oops errors!'))
    })
  }
}
