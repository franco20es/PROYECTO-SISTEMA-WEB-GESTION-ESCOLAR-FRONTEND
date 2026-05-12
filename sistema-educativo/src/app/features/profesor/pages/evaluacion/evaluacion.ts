import { Component, ChangeDetectionStrategy, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { Router } from '@angular/router';

import { CommonModule } from '@angular/common';

// ── Component ──────────────────────────────────────────────────────────────
@Component({
  selector: 'app-evaluacion',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './evaluacion.html',
  styleUrl: './evaluacion.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Evaluacion {


  
}
