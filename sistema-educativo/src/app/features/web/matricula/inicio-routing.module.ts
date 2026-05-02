
import { Router, Routes } from '@angular/router';
import { Matricula } from './matricula/matricula';
import { Nosotros } from '../inicio/components/nosotros/nosotros/nosotros';
import { Contacto } from '../inicio/components/contacto/contacto/contacto';
import { TopbarWebComponent } from '../matricula/components/topbar-web/topbar-web';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-inicio-layout',
  standalone: true,
  imports: [TopbarWebComponent, RouterOutlet],
  template: `<app-topbar-web></app-topbar-web><router-outlet></router-outlet>`,
  styles: [`:host { display: block; }`]
})
class InicioLayout {}

export const INICIO_ROUTER: Routes = [
  {
    path: '',
    component: InicioLayout,
    children: [
      { path: '', redirectTo: 'inicio', pathMatch: 'full' },
      {
        path: 'inicio',
        loadComponent: () => import('../inicio/inicio/inicio').then(m => m.Inicio)
      },
      {
        path: 'nosotros',
        loadComponent: () => import('../inicio/components/nosotros/nosotros/nosotros').then(m => m.Nosotros)
      },
      {
        path: 'contacto',
        loadComponent: () => import('../inicio/components/contacto/contacto/contacto').then(m => m.Contacto)
      },
      {
        path:'niveles',
        loadComponent: () => import('../inicio/components/niveles/niveles/niveles').then(m => m.Niveles)
      },
    
     
    ]
  }
];