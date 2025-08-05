import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import UserDetailDisplayer from '../domain/user-detail-displayer';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  template: `<router-outlet/>`,
  providers: [
    { provide: 'IDisplayUserDetail', useClass: UserDetailDisplayer },
    // { provide: 'IManageAuth', useClass: }
  ]
})
export class AppComponent {
  title = 'Alta Demanda'
}
