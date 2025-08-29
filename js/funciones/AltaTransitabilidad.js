function initAltaTransitabilidad() {
  //----------------------------------- SECCIÓN ALTA TRANSITABILIDAD ---------------------------------//

  window.altaTransitabilidadToggles = [];

  // 1. CREAMOS LA FUNCIÓN QUE VERIFICA EL ESTADO DEL PADRE
  const actualizarEstadoPadreAltaTransitabilidad = () => {
    const parentIcon = document.getElementById('altatransitabilidadToggleIcon');
    if (!parentIcon) return;
    const algunaCapaHijaVisible = window.altaTransitabilidadToggles.some(toggle => toggle && toggle.layer.getVisible());
    parentIcon.className = algunaCapaHijaVisible ? 'bi bi-people-fill' : 'bi bi-people';
  };

  // 2. CONFIGURAMOS LAS CAPAS HIJAS, PASANDO LA FUNCIÓN VERIFICADORA
  window.altaTransitabilidadToggles = [
    setupLayerToggleWithEye(
      'toggleEjesEstructurantesBtn',
      'ejesEstructurantesIcon',
      window.ejesestructurantesLayer,
      'altatransitabilidadToggleIcon',
      'bi-people-fill',
      actualizarEstadoPadreAltaTransitabilidad
    ),
    setupLayerToggleWithEye(
      'toggleEjesSecundariosBtn',
      'ejesSecundariosIcon',
      window.ejessecundariosLayer,
      'altatransitabilidadToggleIcon',
      'bi-people-fill',
      actualizarEstadoPadreAltaTransitabilidad
    )
  ];

  // 3. ACTUALIZAMOS EL MANEJADOR DEL BOTÓN PRINCIPAL
  const parentBtn = document.getElementById('altatransitabilidadToggle');
  if (parentBtn) {
    parentBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      const icon = document.getElementById('altatransitabilidadToggleIcon');
      const isCurrentlyOn = icon.classList.contains('bi-people-fill');

      if (isCurrentlyOn) {
        icon.className = 'bi bi-people';
        window.altaTransitabilidadToggles.forEach(toggle => {
          if (toggle) {
            toggle.layer.setVisible(false);
            toggle.update();
          }
        });
      } else {
        icon.className = 'bi bi-people-fill';
        window.altaTransitabilidadToggles.forEach(toggle => {
          if (toggle) {
            toggle.layer.setVisible(true);
            toggle.update();
          }
        });
      }
    });
  }

  // 4. ACTUALIZAR
  actualizarEstadoPadreAltaTransitabilidad();

  //----------------------------------- FIN SECCIÓN ALTA TRANSITABILIDAD ---------------------------------//
}