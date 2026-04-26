import { Component, EventEmitter, HostListener, Output } from '@angular/core';

@Component({
  selector: 'app-navbar',
  imports: [],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {

  scrolled = false;
  mobileMenuOpen = false;
  userMenuOpen = false;

  @Output() toggleSidebar = new EventEmitter<void>();
  @Output() navigate = new EventEmitter<string>();

  @HostListener('window:scroll', [])
  onScroll(): void {
    this.scrolled = window.scrollY > 8;
  }

  toggleMobileMenu(): void {
    this.mobileMenuOpen = !this.mobileMenuOpen;
    this.toggleSidebar.emit();
  }

  requestToggleSidebar(): void {
    this.toggleSidebar.emit();
  }

  navigateTo(route: string): void {
    this.navigate.emit(route);
  }

  toggleUserMenu(): void {
    this.userMenuOpen = !this.userMenuOpen;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.user-menu-wrap')) {
      this.userMenuOpen = false;
    }
  }
}