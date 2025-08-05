import { Component } from "@angular/core";
import { NzButtonModule } from "ng-zorro-antd/button";
import { NzCardModule } from "ng-zorro-antd/card";


@Component({
  selector: 'app-follow-up',
  imports: [
    NzCardModule,
    NzButtonModule
  ],
  templateUrl: './follow-up.component.html',
  styleUrls: ['./follow-up.component.less']
})
export class FollowUpComponent {

}