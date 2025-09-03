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
    switch(type) {
      case 'success':
        this.notification.success(title, message, { nzPlacement: 'bottomRight' });
      break;
      case 'info':
        this.notification.info(title, message, { nzPlacement: 'bottomRight' });
      break;
      case 'warning':
        this.notification.warning(title, message, { nzPlacement: 'bottomRight' });
        break;
      case 'error':
        this.notification.error(title, message, { nzPlacement: 'bottomRight' });
    }
  }
}