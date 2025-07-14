import { Component, OnInit } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { NzButtonModule } from "ng-zorro-antd/button";
import { NzCardComponent } from "ng-zorro-antd/card";
import { NzDescriptionsModule } from "ng-zorro-antd/descriptions";
import { NzGridModule } from "ng-zorro-antd/grid";
import { NzInputNumberModule } from "ng-zorro-antd/input-number";
import { NzListModule } from "ng-zorro-antd/list";
import { NzRadioModule } from "ng-zorro-antd/radio";
import { NzSpaceModule } from "ng-zorro-antd/space";
import { NzTabPosition, NzTabsModule } from "ng-zorro-antd/tabs";
import { NzTypographyModule } from "ng-zorro-antd/typography";


@Component({
  standalone: true,
  imports: [
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
    NzButtonModule
  ],
  selector: 'app-postulation',
  templateUrl: './postulation.component.html',
})
export class PostulationComponent implements OnInit {
  tabs: Array<{ name: string; content: string; disabled: boolean }> = [];
  nzTabPosition: NzTabPosition = 'left';
  selectedIndex = 2;


  initLoading = false;

  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  log(args: any[]): void {
    console.log(args);
  }

  ngOnInit(): void {
    for (let i = 0; i < 3; i++) {
      this.tabs.push({
        name: `Tab ${i}`,
        disabled: i === 4,
        content: `Content of tab ${i}`
      });
    }
  }
}