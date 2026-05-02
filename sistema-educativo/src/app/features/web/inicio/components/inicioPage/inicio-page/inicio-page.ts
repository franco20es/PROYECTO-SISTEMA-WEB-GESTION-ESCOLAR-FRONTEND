import { Component, ViewEncapsulation, OnInit, Renderer2 } from '@angular/core';


@Component({
  selector: 'app-inicio-page',
  standalone: true, // Asumiendo Angular 17+
  imports: [],
  templateUrl: './inicio-page.html',
  styleUrl: './inicio-page.css',
  encapsulation: ViewEncapsulation.None
})
export class InicioPage {}
