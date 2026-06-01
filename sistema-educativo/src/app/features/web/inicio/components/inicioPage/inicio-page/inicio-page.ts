

import { Component, ViewEncapsulation, OnInit, Renderer2 } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';


@Component({
  selector: 'app-inicio-page',
  standalone: true, // Asumiendo Angular 17+
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './inicio-page.html',
  styleUrl: './inicio-page.css',
  encapsulation: ViewEncapsulation.None
})
export class InicioPage  {


}