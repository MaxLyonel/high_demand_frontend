import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/infrastructure/app.config';
import { AppComponent } from './app/infrastructure/app.component';

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
