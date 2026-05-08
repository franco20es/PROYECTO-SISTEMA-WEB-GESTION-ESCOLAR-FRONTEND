import { ChangeDetectorRef, Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { Toast } from '../../../../../core/components/toast/toast/toast';
import { ToastService } from '../../../../../core/services/toast/toast.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, Toast],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class DashboardComponent {

  constructor(private toastService: ToastService) {}

  showToast(msg: string, type: string = 'info') {
    this.toastService.show(msg, type);
  }

  // Array de alertas
  alertas = [
    {
      id: 1,
      tipo: 'err',
      titulo: '4 estudiantes',
      mensaje: 'tienen más del 30% de inasistencias — riesgo de pérdida de año.',
      icono: 'M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z',
      cerrando: false
    },
    {
      id: 2,
      tipo: 'warn',
      titulo: '12 solicitudes de contacto',
      mensaje: 'llevan más de 48 horas sin respuesta.',
      icono: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z',
      cerrando: false
    },
    {
      id: 3,
      tipo: 'info',
      titulo: 'Inicio de período de matrículas',
      mensaje: 'para alumnos nuevos el 01 de julio 2025.',
      icono: 'M17 12h-5v5h5v-5zM16 1v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-1V1h-2zm3 18H5V8h14v11z',
      cerrando: false
    }
  ];

  cerrarAlerta(id: number) {
    // Encontrar el índice
    const index = this.alertas.findIndex(a => a.id === id);
    
    if (index !== -1) {
      // Marcar como cerrando
      this.alertas[index].cerrando = true;
      
      // Esperar la animación y luego remover
      setTimeout(() => {
        this.alertas = this.alertas.filter(a => a.id !== id);
      }, 300);
    }
  }
  
 // Configuración de los KPIs para el *ngFor
  kpiCards = [
    { key: 'alumnos', label: 'Alumnos activos', target: 1248, trend: '+87', trendDir: 'up', class: 'k-blue', icon: 'ki-alumnos', svg: 'M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5z' },
    { key: 'docentes', label: 'Docentes activos', target: 24, trend: '-3 lic.', trendDir: 'down', class: 'k-orange', icon: 'ki-docentes', svg: 'M20 17a2 2 0 002-2V4a2 2 0 00-2-2H9.46c.35.61.54 1.3.54 2h10v11h-9v2h9zM6 2C4.34 2 3 3.34 3 5s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3zM6 10c-2.33 0-7 1.17-7 3.5V16h14v-2.5C13 11.17 8.33 10 6 10z' },
    { key: 'matriculas', label: 'Matrículas 2025', target: 1161, trend: '93%', trendDir: 'up', class: 'k-green', icon: 'ki-matriculas', svg: 'M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z' },
    { key: 'solicitudes', label: 'Solicitudes', target: 21, trend: '4 nuevas', trendDir: 'up', class: 'k-sky', icon: 'ki-solicitudes', svg: 'M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6z' },
    { key: 'docs', label: 'Docs. pendientes', target: 38, trend: 'urgente', trendDir: 'down', class: 'k-warn', icon: 'ki-docs', svg: 'M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z' }
  ];

  // Valores que se muestran en la UI
  kpis: any = { alumnos: 0, docentes: 0, matriculas: 0, solicitudes: 0, docs: 0 };

  ngOnInit() {
    // Iniciamos la animación para cada KPI
    this.kpiCards.forEach(card => {
      this.animarContador(card.key, card.target);
    });
  }

  animarContador(key: string, target: number) {
    const duration = 3000; // Duración total en milisegundos (2 seg)
    const startTime = performance.now();

    const update = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Función de Easing: EaseOutExpo (comienza rápido, termina lento)
      const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      
      this.kpis[key] = Math.floor(easeProgress * target);

      if (progress < 1) {
        requestAnimationFrame(update);
      }
    };

    requestAnimationFrame(update);
  }

}