import { Component } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { RouterLink, RouterOutlet } from "@angular/router";
import { NzAvatarModule } from "ng-zorro-antd/avatar";
import { NzDropDownModule } from "ng-zorro-antd/dropdown";
import { NzIconModule } from "ng-zorro-antd/icon";
import { NzLayoutModule } from "ng-zorro-antd/layout";
import { NzMenuModule } from "ng-zorro-antd/menu";


@Component({
  selector: 'app-layout',
  imports: [
    RouterLink,
    RouterOutlet,
    NzIconModule,
    NzLayoutModule,
    NzMenuModule,
    FormsModule,
    NzDropDownModule,
    NzAvatarModule
  ],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.less'
})
export default class LayoutComponent {
  isCollapsed = false;
}