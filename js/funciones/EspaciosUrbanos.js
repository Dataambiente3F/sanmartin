function initEspaciosUrbanos() {
  //----------------------------- SECCIÓN ESPACIOS URBANOS ---------------------------//
  window.espaciosUrbanosToggles = []; // 1. Array global para guardar los toggles hijos

  // 2. Función que revisa si alguna capa hija está visible para actualizar el ícono del padre
  const actualizarEstadoPadreEspaciosUrbanos = () => {
    const parentIcon = document.getElementById('plazasToggleIcon');
    if (!parentIcon) return;
    const algunaCapaHijaVisible = window.espaciosUrbanosToggles.some(toggle => toggle && toggle.layer.getVisible());
    parentIcon.className = algunaCapaHijaVisible ? 'bi bi-tree-fill' : 'bi bi-tree';
  };

  // 3. Configuración de las capas hijas
  window.espaciosUrbanosToggles = [
    setupLayerToggleWithEye(
      'togglePlazasBtn',
      'redPlazasIcon',
      window.geojsonLayer, // 👈 siempre como window
      'plazasToggleIcon',
      'bi-tree-fill',
      actualizarEstadoPadreEspaciosUrbanos
    ),
    setupLayerToggleWithEye(
      'toggleCentrosComercialesBtn',
      'redCentrosComercialesIcon',
      window.centrosComercialesLayer, // 👈 igual acá
      'plazasToggleIcon',
      'bi-tree-fill',
      actualizarEstadoPadreEspaciosUrbanos
    )
  ];

  // 4. Configuración del botón principal (padre)
  const parentBtn = document.getElementById('plazasToggle');
  if (parentBtn) {
    parentBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      const icon = document.getElementById('plazasToggleIcon');
      const isCurrentlyOn = icon.classList.contains('bi-tree-fill');

      window.espaciosUrbanosToggles.forEach(toggle => {
        if (toggle) {
          toggle.layer.setVisible(!isCurrentlyOn);
          toggle.update();
        }
      });

      actualizarEstadoPadreEspaciosUrbanos();
    });
  }

  actualizarEstadoPadreEspaciosUrbanos();
  //----------------------------- FIN SECCIÓN ESPACIOS URBANOS ---------------------------//
}