import { Component } from '@angular/core';

@Component({
  selector: 'app-footer-web',
  standalone: true,
  imports: [], // No se requiere CommonModule para el nuevo flujo de control
  templateUrl: './footer-web.html',
  styleUrls: ['./footer-web.css']
})
export class FooterWebComponent {
  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  aliados = [
    { nombre: 'BCP', img: 'https://res.cloudinary.com/dfspsnrmp/image/upload/v1780226236/bcp-4_pgz0c0.svg' },
    { nombre: 'Interbank', img: 'https://res.cloudinary.com/dfspsnrmp/image/upload/v1780226365/interbank-2_kf9qcc.svg' },
    { nombre: 'BBVA', img: 'https://res.cloudinary.com/dfspsnrmp/image/upload/v1780227662/bbva-2_hllzyt.svg' },
    { nombre: 'IBM', img: 'https://res.cloudinary.com/dfspsnrmp/image/upload/v1780227745/ibm_bdftio.svg' },
    { nombre: 'Microsoft', img: 'https://res.cloudinary.com/dfspsnrmp/image/upload/v1780227788/microsoft-6_d8kfyw.svg' },
    { nombre: 'Oracle', img: 'https://res.cloudinary.com/dfspsnrmp/image/upload/v1780227888/oracle-logo_cfwxnx.svg' },
    { nombre: 'Cisco', img: 'https://res.cloudinary.com/dfspsnrmp/image/upload/v1780228059/cisco-2_cdbzrn.svg' },
    { nombre: 'Google', img: 'https://res.cloudinary.com/dfspsnrmp/image/upload/v1780228104/google-1-1_vu5ebw.svg' },
    { nombre: 'AWS', img: 'https://res.cloudinary.com/dfspsnrmp/image/upload/v1780228150/aws-2_jd6jtl.svg' }
  ];
}