import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-asistencia',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './asistencia.html',
  styles: [`
    :host {
      /* Tu Paleta Indigo SaaS */
      --primary: #6366f1; --primary-lt: #eef2ff; --primary-md: #a5b4fc; --primary-dk: #4338ca;
      --bg: #f8faff; --surface: #ffffff; --border: #e2e8f0;
      --txt-primary: #0f172a; --txt-secondary: #475569; --txt-muted: #94a3b8;
      --r-md: 10px; --r-lg: 14px; --shadow-sm: 0 2px 8px rgba(0,0,0,0.06);
      --f-body: 'Plus Jakarta Sans', sans-serif;
      display: block; background: var(--bg); font-family: var(--f-body); padding: 20px;
    }

    .container { max-width: 900px; margin: 0 auto; }
    .card { background: var(--surface); border: 1px solid var(--border); border-radius: var(--r-lg); box-shadow: var(--shadow-sm); overflow: hidden; }
    .card-hdr { padding: 16px 20px; border-bottom: 1px solid var(--border); background: #fff; }
    .card-title { font-size: 1.1rem; font-weight: 700; color: var(--txt-primary); margin: 0; }
    .card-body { padding: 24px; }

    /* Form Styles */
    .form-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin-bottom: 20px; }
    @media (max-width: 640px) { .form-grid { grid-template-columns: 1fr; } }
    
    .form-group { display: flex; flex-direction: column; gap: 6px; }
    .form-label { font-size: 0.8rem; font-weight: 600; color: var(--txt-secondary); }
    .form-input, .form-select {
      padding: 10px 14px; border: 1px solid var(--border); border-radius: var(--r-md);
      font-size: 0.9rem; transition: all 0.2s;
    }
    .form-input:focus { border-color: var(--primary); outline: none; box-shadow: 0 0 0 3px var(--primary-lt); }
    
    /* UI Elements */
    .radio-group { display: flex; gap: 12px; }
    .radio-card {
      flex: 1; display: flex; align-items: center; gap: 8px; padding: 10px;
      border: 1.5px solid var(--border); border-radius: var(--r-md); cursor: pointer; transition: 0.2s;
    }
    .radio-card.selected { border-color: var(--primary); background: var(--primary-lt); color: var(--primary-dk); }
    .radio-card input { display: none; }

    .btn-primary {
      background: var(--primary); color: #fff; border: none; padding: 12px 24px;
      border-radius: var(--r-md); font-weight: 600; cursor: pointer; transition: 0.2s;
    }
    .btn-primary:hover { background: var(--primary-dk); transform: translateY(-1px); }
  `]
})
export class Asistencia implements  OnInit {
  
// Estado
  step: number = 1;
  progress: string = '0%';
  mostrarGrados: boolean = false;
  grados: string[] = [];

  // Datos
  niveles: any = {
    inicial: ['3 años', '4 años', '5 años'],
    primaria: ['1°', '2°', '3°', '4°', '5°', '6°'],
    secundaria: ['1°', '2°', '3°', '4°', '5°']
  };

  ngOnInit() {}

  seleccionarNivel(nivel: string) {
    this.grados = this.niveles[nivel];
    this.mostrarGrados = true;
    this.actualizarProgreso();
  }

  actualizarProgreso() {
    // Lógica simple de ejemplo para el progreso
    this.progress = this.mostrarGrados ? '50%' : '20%';
  }

  enviar() {
    alert('Matrícula Procesada con éxito');
  }
}
