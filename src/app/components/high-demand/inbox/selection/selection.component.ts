import { Component } from "@angular/core";
import { NzTableModule } from "ng-zorro-antd/table";
import { NzTypographyComponent } from "ng-zorro-antd/typography";


@Component({
  imports: [
    NzTypographyComponent,
    NzTableModule
  ],
  selector: 'selection-inbox',
  templateUrl: './selection.component.html'
})
export class SelectionInbox {

}