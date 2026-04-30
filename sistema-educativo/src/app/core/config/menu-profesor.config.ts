export const MENU_PROFESOR = [
  {
    section: 'Principal',
    items: [
      { label: 'Dashboard', icon: 'bi bi-grid-1x2', route: 'profesor/dashboard' },
      { label: 'Mis Cursos', icon: 'bi bi-book', route: 'profesor/cursos' },
      { label: 'Mis Estudiantes', icon: 'bi bi-people', route: 'profesor/estudiantes' }
    ]
  },
  {
    section: 'Académico',
    items: [
      { label: 'Asistencia', icon: 'bi bi-check-circle', route: 'profesor/asistencia' },
      { label: 'Calificaciones', icon: 'bi bi-journal-check', route: 'profesor/calificaciones' },
      { label: 'Evaluaciones', icon: 'bi bi-file-earmark-text', route: 'profesor/evaluaciones' }
    ]
  },
  {
    section: 'Gestión',
    items: [
      { label: 'Horario', icon: 'bi bi-calendar', route: 'profesor/horario' },
      { label: 'Reportes', icon: 'bi bi-bar-chart', route: 'profesor/reportes' }
    ]
  },
  {
    section: 'Cuenta',
    items: [
      { label: 'Perfil', icon: 'bi bi-person-circle', route: 'profesor/perfil' },
      { label: 'Notificaciones', icon: 'bi bi-bell', route: 'profesor/notificaciones' }
    ]
  }
];