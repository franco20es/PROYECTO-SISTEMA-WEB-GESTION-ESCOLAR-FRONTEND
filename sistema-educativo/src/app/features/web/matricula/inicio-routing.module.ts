import { Component } from '@angular/core';
import { Routes, RouterOutlet } from '@angular/router';
import { TopbarWebComponent } from '../matricula/components/topbar-web/topbar-web';
import { FooterWebComponent } from '../matricula/components/footer-web/footer-web';

@Component({
  selector: 'app-inicio-layout',
  standalone: true,
  imports: [TopbarWebComponent, FooterWebComponent, RouterOutlet],
  template: `
    <app-topbar-web></app-topbar-web>
    
    <main class="main-content">
      <router-outlet></router-outlet>
    </main>
    
    <app-footer-web></app-footer-web>
  `,
})
export class InicioLayout {}

export const INICIO_ROUTER: Routes = [
  {
    path: '',
    component: InicioLayout,
    children: [
      // Al entrar a '/inicio', se renderiza directamente el componente base de la Landing Page
      { 
        path: '', 
        loadComponent: () => import('../inicio/inicio/inicio').then(m => m.Inicio) 
      },
      //  Rutas hijas correspondientes: '/inicio/nosotros'
      {
        path: 'nosotros',
        loadComponent: () => import('../inicio/components/nosotros/nosotros/nosotros').then(m => m.Nosotros)
      },
      //  Rutas hijas correspondientes: '/inicio/contacto'
      {
        path: 'contacto',
        loadComponent: () => import('../inicio/components/contacto/contacto/contacto').then(m => m.Contacto)
      },
      //  Rutas hijas correspondientes: '/inicio/niveles'
      {
        path: 'niveles',
        loadComponent: () => import('../inicio/components/niveles/niveles/niveles').then(m => m.Niveles)
      },
      //  Rutas hijas correspondientes: '/inicio/matricula-online'
      {
        path: 'matricula-online',
        loadComponent: () => import('../inicio/components/matricula/matricula-online/matricula-online').then(m => m.MatriculaOnline)
      }
    ]
  }
];