import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  toast = signal({
    show: false,
    mensaje: '',
    tipo: 'info'
  });

  show(msg: string, tipo: string = 'info') {
    this.toast.set({
      show: true,
      mensaje: msg,
      tipo: tipo
    });

    setTimeout(() => {
      this.toast.set({
        show: false,
        mensaje: msg,
        tipo: tipo
      });
    }, 3000);
  }
}