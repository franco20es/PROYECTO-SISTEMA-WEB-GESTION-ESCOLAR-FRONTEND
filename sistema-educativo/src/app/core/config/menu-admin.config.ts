export const MENU_ADMIN = [
  {
    section: 'Principal',
    items: [
      { label: 'Dashboard', icon: 'bi bi-grid-1x2', route: 'admin/dashboard' },
      { label: 'Estudiantes', icon: 'bi bi-people', route: 'admin/estudiantes' },
      { label: 'Profesores', icon: 'bi bi-person', route: 'admin/profesores' },
      { label: 'Cursos', icon: 'bi bi-book', route: 'admin/cursos' }
    ]
  },
  {
    section: 'Administración',
    items: [
      // Nueva gestión de Solicitudes Online
      { 
        label: 'Solicitudes Online', 
        icon: 'bi bi-clipboard-check', 
        route: 'admin/solicitudes' // Aquí llegan los formularios de las imágenes
      },
      { label: 'Matricula Directa', icon: 'bi bi-person-circle', route: 'admin/matricula' },
      { label: 'Asistencia', icon: 'bi bi-shield-lock', route: 'admin/asistencia' },
      { label: 'Calificaciones', icon: 'bi bi-phone', route: 'admin/calificaciones' },
      { label: 'Finanzas', icon: 'bi bi-cash', route: 'admin/finanzas' }
    ]
  },
  {
    section: 'Sistema',
    items: [
      { label: 'Notificaciones', icon: 'bi bi-bell', route: 'admin/notificaciones' },
      { label: 'Configuración', icon: 'bi bi-gear', route: 'admin/configuracion' }
    ]
  }
];