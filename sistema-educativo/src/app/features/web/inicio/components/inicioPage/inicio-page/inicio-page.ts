

import { Component, ViewEncapsulation, OnInit, Renderer2 } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { TopbarWebComponent } from "../../../../matricula/components/topbar-web/topbar-web";
import { Hero } from '../../../../matricula/components/hero/hero/hero';


@Component({
  selector: 'app-inicio-page',
  standalone: true, // Asumiendo Angular 17+

  templateUrl: './inicio-page.html',
  styleUrl: './inicio-page.css',
  encapsulation: ViewEncapsulation.None,
  imports: [Hero]
})
export class InicioPage  {

irAMatricula(): void {
  window.location.href = '/inicio/matricula-online';
}
}