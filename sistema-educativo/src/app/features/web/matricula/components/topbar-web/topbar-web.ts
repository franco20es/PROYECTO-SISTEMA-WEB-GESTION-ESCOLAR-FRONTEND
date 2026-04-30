import { Component, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterModule } from '@angular/router';

interface Evento {
  id: number;
  titulo: string;
  categoria: string;
  descripcion: string;
  precio: number;
  imagen: string;
  tag: string;
}

@Component({
  selector: 'app-topbar-web',
  imports: [CommonModule, RouterModule],
  templateUrl: './topbar-web.html',
  styleUrl: './topbar-web.css',
})
export class TopbarWebComponent implements OnInit {
  
  isMenuOpen: boolean = false;
  activeLink: string = 'inicio';

  eventos: Evento[] = [];

  ngOnInit(): void {
    // Inicializar eventos si es necesario
  }

  /**
   * Abrir/cerrar menú mobile
   */
  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  /**
   * Establecer link activo en navegación
   */
  setActive(link: string): void {
    this.activeLink = link;
    this.isMenuOpen = false; // Cerrar menú al hacer click
  }

  /**
   * Detectar scroll para efecto del navbar
   */
  @HostListener('window:scroll')
  onScroll(): void {
    const navbar = document.getElementById('navbar');
    if (navbar) {
      if (window.scrollY > 60) {
        navbar.style.boxShadow = '0 4px 30px rgba(0,0,0,0.08)';
      } else {
        navbar.style.boxShadow = 'none';
      }
    }
  }
}
