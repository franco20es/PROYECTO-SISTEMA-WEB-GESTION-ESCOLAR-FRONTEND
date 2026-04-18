import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  imports: [],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class UsuarioSidebar {
  @Output() navigate = new EventEmitter<string>();

   sidebarOpen = true;

  toggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen;
  }

  emitNavigate(route: string): void {
    this.navigate.emit(route);
  }
}
