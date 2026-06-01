import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  imports: [CommonModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class UsuarioSidebar {
  @Output() navigate = new EventEmitter<string>();

  @Input() menuItems: any[] = [];


   sidebarOpen = true;

  toggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen;
  }

  emitNavigate(route: string): void {
    this.navigate.emit(route);
  }

 // Agrega en la clase
private router = inject(Router);

cerrarSesion(): void {
  // Limpiar todo el localStorage
  localStorage.clear();
  
  // Redirigir al login
  this.router.navigate(['/login']);
}
}
