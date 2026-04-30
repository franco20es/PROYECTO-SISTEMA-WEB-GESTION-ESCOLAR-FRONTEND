
//configuración del menú para el alumno

export const MENU_ALUMNO = [
  {
    section: 'Principal',
    items: [
      { label: 'Dashboard', icon: 'bi bi-grid-1x2', route: 'alumno/dashboard' },
      { label: 'Mis Cursos', icon: 'bi bi-book', route: 'alumno/cursos' },
      { label: 'Mis Notas', icon: 'bi bi-file-earmark', route: 'alumno/notas' }
    ]
  },
  {
    section: 'Académico',
    items: [
      { label: 'Asistencia', icon: 'bi bi-check-circle', route: 'alumno/asistencia' },
      { label: 'Horario', icon: 'bi bi-calendar', route: 'alumno/horario' }
    ]
  },
  {
    section: 'Cuenta',
    items: [
      { label: 'Perfil', icon: 'bi bi-person-circle', route: 'alumno/perfil' },
      { label: 'Pagos', icon: 'bi bi-credit-card', route: 'alumno/pagos' },
      { label: 'Notificaciones', icon: 'bi bi-bell', route: 'alumno/notificaciones' }
    ]
  }
];