import { Component } from '@angular/core';
import { TopbarWebComponent } from '../../matricula/components/topbar-web/topbar-web';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [TopbarWebComponent],
  templateUrl: './inicio.html',
  styleUrl: './inicio.css',
})
export class Inicio {}
