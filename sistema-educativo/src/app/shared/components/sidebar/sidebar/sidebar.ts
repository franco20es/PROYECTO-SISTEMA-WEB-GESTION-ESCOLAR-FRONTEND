import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

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
}
