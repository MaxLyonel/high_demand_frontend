import { Injectable } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzNotificationService } from 'ng-zorro-antd/notification';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  constructor(
    private notification: NzNotificationService,
    private message: NzMessageService
  ) {}

  showMessage(message: string, title = 'Info', type: 'success' | 'info' | 'warning' | 'error' = 'info') {
    // this.message.create('success', message)
    // this.notification.blank(title, message);
    // También podés usar:
    this.notification.success(title, message, { nzPlacement: 'bottomRight' });
    // this.notification.error(title, message);
    // etc.
  }

  error(message: string, title: string) {
    this.notification.error(message, title, { nzPlacement: 'bottomRight' })
  }
}