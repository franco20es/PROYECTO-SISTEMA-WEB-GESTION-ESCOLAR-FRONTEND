import { Component, EventEmitter, HostListener, Output, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar implements OnInit {

  scrolled = false;
  mobileMenuOpen = false;
  userMenuOpen = false;

  currentModule = 'Dashboard'; // alumno / admin / profesor
  currentPage = 'Dashboard';   // cursos / notas / etc

  @Output() toggleSidebar = new EventEmitter<void>();
  @Output() navigate = new EventEmitter<string>();

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        const url = event.urlAfterRedirects;

        const parts = url.split('/').filter(Boolean);

        // ejemplo: /alumno/cursos
        const module = parts[0]; // alumno
        const page = parts[1];   // cursos

        this.currentModule = this.formatLabel(module);
        this.currentPage = this.formatLabel(page);
      });
  }

  //  convierte texto bonito automático
  private formatLabel(text: string | undefined): string {
    if (!text) return 'Dashboard';

    return text
      .replace(/[-_]/g, ' ')
      .replace(/\b\w/g, l => l.toUpperCase());
  }

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