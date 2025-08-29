function initElecciones() {
  //--------------------------------- SECCIÓN ELECCIONES -------------------------------//

  window.eleccionesToggles = [];

  const actualizarEstadoPadreElecciones = () => {
    const parentIcon = document.getElementById('eleccionesToggleIcon');
    if (!parentIcon) return;
    const algunaCapaHijaVisible = window.eleccionesToggles.some(toggle => toggle && toggle.layer.getVisible());
    parentIcon.className = algunaCapaHijaVisible ? 'bi bi-map-fill' : 'bi bi-map';
  };

  window.eleccionesToggles = [
    setupLayerToggleWithEye(
      'togglesegundavueltanacional23Btn',
      'segundavueltanacional23Icon',
      window.segundavueltanacional23Layer,
      'eleccionesToggleIcon',
      'bi-map-fill',
      actualizarEstadoPadreElecciones
    ),
    setupLayerToggleWithEye(
      'toggle2023GeneralesNacionalBtn',
      'generales2023Icon',
      window.generalnacional23Layer,
      'eleccionesToggleIcon',
      'bi-map-fill',
      actualizarEstadoPadreElecciones
    ),
    setupLayerToggleWithEye(
      'toggle2023GeneralProvincialBtn',
      'generalprovincial2023Icon',
      window.generalprovincial23Layer,
      'eleccionesToggleIcon',
      'bi-map-fill',
      actualizarEstadoPadreElecciones
    ),
    setupLayerToggleWithEye(
      'toggle2023GeneralMunicipalBtn',
      'generalmunicipal2023Icon',
      window.generalmunicipal23Layer,
      'eleccionesToggleIcon',
      'bi-map-fill',
      actualizarEstadoPadreElecciones
    ),
    setupLayerToggleWithEye(
      'toggle2023GeneralMunicipalAlianzaBtn',
      'generalmunicipalalianza2023Icon',
      window.generalmunicipalalianza23Layer,
      'eleccionesToggleIcon',
      'bi-map-fill',
      actualizarEstadoPadreElecciones
    ),
    setupLayerToggleWithEye(
      'toggle2023GeneralesNacionalLLABtn',
      'generales2023llaIcon',
      window.generalnacional23llaLayer,
      'eleccionesToggleIcon',
      'bi-map-fill',
      actualizarEstadoPadreElecciones
    ),
    setupLayerToggleWithEye(
      'toggle2023GeneralesNacionalJXCBtn',
      'generales2023jxcIcon',
      window.generalnacional23jxcLayer,
      'eleccionesToggleIcon',
      'bi-map-fill',
      actualizarEstadoPadreElecciones
    )
  ];

  // 👀 Asegurate que el ID en HTML sea "eleccionesToggle" (no "eleccionesToggles")
  const parentBtn = document.getElementById('eleccionesToggle');
  if (parentBtn) {
    parentBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      const icon = document.getElementById('eleccionesToggleIcon');
      const isCurrentlyOn = icon.classList.contains('bi-map-fill');

      window.eleccionesToggles.forEach(toggle => {
        if (toggle) {
          toggle.layer.setVisible(!isCurrentlyOn);
          toggle.update();
        }
      });

      actualizarEstadoPadreElecciones();
    });
  }

  actualizarEstadoPadreElecciones();

  //----------------------------- FIN SECCIÓN ELECCIONES ---------------------------------//
}