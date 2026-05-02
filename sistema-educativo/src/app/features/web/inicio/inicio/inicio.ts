import { Component } from '@angular/core';
import { InicioPage } from '../components/inicioPage/inicio-page/inicio-page';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [InicioPage],
  templateUrl: './inicio.html',
  styleUrl: './inicio.css',
})
export class Inicio {}
