import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  imports: [CommonModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class UsuarioSidebar implements OnInit {
  @Output() navigate = new EventEmitter<string>();
  @Input() menuItems: any[] = [];

  nombre = '';
  rol = '';
  avatarUrl = '';
  sidebarOpen = true;

  private router = inject(Router);

  // Imágenes de avatar por rol (Cloudinary)
  private AVATARES: Record<string, string> = {
    ALUMNO:   'https://res.cloudinary.com/dgrdonnsk/image/upload/v1778545065/ChatGPT_Image_11_may_2026_19_17_41_h5tlxr.png',
    DOCENTE:  'https://res.cloudinary.com/dgrdonnsk/image/upload/v1778544948/ChatGPT_Image_11_may_2026_19_15_37_nq8plo.png',
    ADMIN:    'https://res.cloudinary.com/dgrdonnsk/image/upload/v1778545328/ChatGPT_Image_11_may_2026_19_22_02_yyevyr.png',
  };

  ngOnInit(): void {
    this.nombre = localStorage.getItem('nombre') || '';
    this.rol = localStorage.getItem('rol') || '';
    this.avatarUrl = this.resolverAvatar(this.rol);
  }

  // Devuelve la imagen según el rol (normaliza variantes como DIRECTOR/SECRETARIA → admin)
  private resolverAvatar(rol: string): string {
    const r = (rol || '').toUpperCase();
    if (this.AVATARES[r]) return this.AVATARES[r];
    // Roles administrativos usan la imagen de admin
    if (r === 'DIRECTOR' || r === 'SECRETARIA') return this.AVATARES['ADMIN'];
    return '';  // sin imagen → cae a la inicial
  }

  toggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen;
  }

  emitNavigate(route: string): void {
    this.navigate.emit(route);
  }

  cerrarSesion(): void {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}