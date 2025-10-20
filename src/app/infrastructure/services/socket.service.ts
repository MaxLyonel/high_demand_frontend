// src/app/services/socket.service.ts
import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private socket: Socket;
  private permissionChanged$ = new BehaviorSubject<{ roleId: number } | null>(null);

  constructor() {
    this.socket = io(`${environment.socketUrl}`);
    this.socket.on('permission:changed', (data) => {
      this.permissionChanged$.next(data);
    });
  }

    // Para que cualquier componente pueda suscribirse
  onPermissionChanged(): Observable<{ roleId: number } | null> {
    return this.permissionChanged$.asObservable();
  }

  // Emitir eventos si necesitas
  emitPermissionChange(userId: string) {
    this.socket.emit('permission:changed', { userId });
  }

  // Cerrar la conexión (opcional)
  disconnect() {
    this.socket.disconnect();
  }
}
