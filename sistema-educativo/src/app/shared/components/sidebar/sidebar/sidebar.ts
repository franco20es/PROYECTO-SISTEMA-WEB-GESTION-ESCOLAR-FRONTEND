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

  sidebarOpen = true;

  private router = inject(Router);

  ngOnInit(): void {
    this.nombre = localStorage.getItem('nombre') || '';
    this.rol = localStorage.getItem('rol') || '';
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