import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NzContentComponent } from "ng-zorro-antd/layout";
import { NzCardComponent } from "ng-zorro-antd/card";
import { NzListModule } from "ng-zorro-antd/list";
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSpaceModule } from "ng-zorro-antd/space";
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzTagModule } from "ng-zorro-antd/tag";

@Component({
  selector: 'app-dashboard',
  templateUrl: './control-access.component.html',
  styleUrls: ['./control-acess.component.less'],
  imports: [
    CommonModule,
    NzBadgeModule,
    NzDropDownModule,
    NzBreadCrumbModule,
    NzIconModule,
    NzButtonModule,
    NzTypographyModule,
    NzInputModule,
    NzContentComponent,
    NzCardComponent,
    NzListModule,
    NzSpaceModule,
    NzTableModule,
    NzTagModule
]
})
export class ControlAccessComponent implements OnInit {

  showPermissions: boolean = false;
  isLoadingTable: boolean = false;

  ngOnInit(): void {
  }

  adminRol() {
    this.showPermissions = true
    this.isLoadingTable = true
    setTimeout(() => {
      this.isLoadingTable = false
    }, 300)
  }

}