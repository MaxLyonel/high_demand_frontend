import { Component, Inject, OnInit } from "@angular/core";
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
    NzCheckboxModule
  ],
  selector: 'app-postulation',
  templateUrl: './postulation.component.html',
})
export class PostulationComponent implements OnInit {
  tabs: Array<{ name: string; content: string; disabled: boolean }> = [];
  nzTabPosition: NzTabPosition = 'left';
  selectedIndex = 2;


  initLoading = false;


  levels = [
    { id: 11, name: 'Inicial en Familia Comunitaria', disabled: false, content: 'Content inicial'},
    { id: 12, name: 'Primaria Comunitaria Vocacional', disabled: false, content: 'Content primaria'},
    { id: 13, name: 'Secundaria Comunitaria Productiva', disabled: false, content: 'Content Secundaria'}
  ]
  inputValue: string | null = null;
  list: Array<{ loading: boolean; name: any}> =[{
    loading: false,
    name: 'Inicial en Familia Comunitaria - Segundo - A - 123'
  }]

  allChecked = false;
  value: Array<string | number> = ['Apple', 'Orange'];
  options: NzCheckboxOption[] = [
    { label: '', value: 'Apple'}
  ]

  // mis variables
  institution!: any

  constructor(@Inject('IInstituionDetail') private _institution: IInstituionDetail) {}

  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  log(args: any[]): void {
    console.log(args);
  }

  ngOnInit(): void {
    this._institution.getInfoInstitution(30680007).subscribe(
      (institution: any) => {
        console.log("institution", institution)
        this.institution = institution
      }
    )
    for (let i = 0; i < 3; i++) {
      this.tabs.push({
        name: `Tab ${i}`,
        disabled: i === 4,
        content: `Content of tab ${i}`
      });
    }
  }
  updateSingleCheked(): void {
    this.allChecked = this.value.length === this.options.length;
  }
}
