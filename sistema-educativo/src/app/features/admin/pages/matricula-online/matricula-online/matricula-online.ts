import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface SolicitudMatricula {
  id: string;
  estudiante: string;
  apoderado: string;
  nivel: string;
  grado: string;
  fecha: string;
  estado: 'Pendiente' | 'Aprobado' | 'Rechazado';
}

@Component({
  selector: 'app-matricula-online',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './matricula-online.html',
  styleUrl: './matricula-online.css',
})
export class MatriculaOnline  {
 openCardId: string | null = null;
  filter: string = 'all';
  searchText: string = '';

  toast = {
    show: false,
    msg: '',
    type: 'success'
  };

  solicitudes: any[] = []; // aquí van tus cards

  // ─── TOGGLE CARD ───
  toggleCard(cardId: string) {
    this.openCardId = this.openCardId === cardId ? null : cardId;
  }

  // ─── FILTRAR ───
  filtrar(filtro: string) {
    this.filter = filtro;
  }

  setFilter(f: string) {
    this.filter = f;
  }

  // ─── BUSCAR ───
  buscar(texto: string) {
    this.searchText = texto;
  }

  setSearchText(texto: string) {
    this.searchText = texto;
  }

  get filteredSolicitudes() {
    return this.solicitudes.filter(c => {
      const matchFilter = this.filter === 'all' || c.status === this.filter;
      const matchSearch = c.text.toLowerCase().includes(this.searchText.toLowerCase());
      return matchFilter && matchSearch;
    });
  }

  // ─── ORDENAR ───
  ordenar(val: string) {
    this.showToast('Lista ordenada: ' + val, 'info');
  }

  // ─── CAMBIAR ESTADO ───
  cambiarEstado(id: string, nuevoEstado: string) {
    const item = this.solicitudes.find(c => c.id === id);
    if (!item) return;

    item.status = nuevoEstado;
    this.showToast(`Estado actualizado a: ${nuevoEstado}`);
  }

  // ─── MODAL ───
  modalOpen = false;
  modalData: any = {};

  abrirModal(item: any) {
    this.modalData = { ...item };
    this.modalOpen = true;
  }

  cerrarModal() {
    this.modalOpen = false;
  }

  confirmarMatricula() {
    if (!this.modalData.estudiante) {
      this.showToast('Ingresa el nombre del estudiante', 'error');
      return;
    }

    const code = 'SM-2025-' + String(this.modalData.id).padStart(5, '0');

    this.solicitudes = this.solicitudes.map(s =>
      s.id === this.modalData.id ? { ...s, status: 'matriculado' } : s
    );

    this.modalOpen = false;
    this.showToast(`¡Matrícula tramitada! Código: ${code}`);
  }

  // ─── COMPLETAR ───
  completarMatricula(id: string, nombre: string) {
    const code = 'SM-2025-' + String(id).padStart(5, '0');

    this.solicitudes = this.solicitudes.map(s =>
      s.id === id ? { ...s, status: 'matriculado' } : s
    );

    this.showToast(`${nombre} matriculado/a. Código: ${code}`);
  }

  // ─── ARCHIVAR ───
  archivar(id: string) {
    if (!confirm('¿Archivar esta solicitud?')) return;
    this.solicitudes = this.solicitudes.filter(s => s.id !== id);
    this.showToast('Solicitud archivada', 'info');
  }

  // ─── MARCAR TODAS ───
  marcarTodas() {
    this.solicitudes = this.solicitudes.map(s =>
      s.status === 'nueva' ? { ...s, status: 'pendiente' } : s
    );
    this.showToast('Todas las nuevas marcadas como revisadas', 'info');
  }

  // ─── EXPORTAR ───
  exportar() {
    this.showToast('Exportando lista en CSV...', 'info');
  }

  // ─── TOAST ───
  private timer: any;

  showToast(msg: string, type: string = 'success') {
    clearTimeout(this.timer);
    this.toast = { show: true, msg, type };

    this.timer = setTimeout(() => {
      this.toast.show = false;
    }, 3500);
  }
}

