function initEducacion() {
  //----------------------------------- SECCIÓN EDUCACIÓN ---------------------------------//
  window.educacionToggles = [];

  // 1. Función que actualiza el ícono principal de la categoría
  const actualizarEstadoPadreEducacion = () => {
    const parentIcon = document.getElementById('educacionToggleIcon');
    if (!parentIcon) return;
    const algunaCapaHijaVisible = window.educacionToggles.some(toggle => toggle && toggle.layer.getVisible());
    parentIcon.className = algunaCapaHijaVisible ? 'bi bi-book-fill' : 'bi bi-book';
  };

  // 2. Configuración de los botones para cada capa hija
  window.educacionToggles = [
    setupLayerToggleWithEye(
      'toggleJardinesBtn',
      'jardinesIcon',
      window.jardinesLayer,
      'educacionToggleIcon',
      'bi-book-fill',
      actualizarEstadoPadreEducacion
    ),
    setupLayerToggleWithEye(
      'togglePrimariasBtn',
      'primariasIcon',
      window.primariasLayer,
      'educacionToggleIcon',
      'bi-book-fill',
      actualizarEstadoPadreEducacion
    ),
    setupLayerToggleWithEye(
      'toggleSecundariasBtn',
      'secundariasIcon',
      window.secundariasLayer,
      'educacionToggleIcon',
      'bi-book-fill',
      actualizarEstadoPadreEducacion
    ),
    setupLayerToggleWithEye(
      'toggleUniversidadesBtn',
      'universidadesIcon',
      window.universidadesLayer,
      'educacionToggleIcon',
      'bi-book-fill',
      actualizarEstadoPadreEducacion
    )
  ];

  // 3. Lógica del botón principal de la categoría para prender/apagar todo
  const parentBtn = document.getElementById('educacionToggle');
  if (parentBtn) {
    parentBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      const icon = document.getElementById('educacionToggleIcon');
      const isCurrentlyOn = icon.classList.contains('bi-book-fill');

      window.educacionToggles.forEach(toggle => {
        if (toggle) {
          toggle.layer.setVisible(!isCurrentlyOn);
          toggle.update(); // Actualiza el ícono del ojo de cada capa hija
        }
      });
      actualizarEstadoPadreEducacion(); // Actualiza el ícono principal
    });
  }

  // 4. Llamada inicial para establecer el estado correcto al cargar la página
  actualizarEstadoPadreEducacion();

//----------------------------------- FIN SECCIÓN EDUCACIÓN ---------------------------------//



}