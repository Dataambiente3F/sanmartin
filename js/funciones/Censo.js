function initCenso() {
  //--------------------------------- SECCIÓN CENSO -------------------------------//
  window.censoToggles = [];

  const actualizarEstadoPadreCenso = () => {
    const parentIcon = document.getElementById('censoToggleIcon');
    if (!parentIcon) return;
    const algunaCapaHijaVisible = window.censoToggles.some(toggle => toggle && toggle.layer.getVisible());
    parentIcon.className = algunaCapaHijaVisible ? 'bi bi-map-fill' : 'bi bi-map';
  };

  // Definición de capas (todas tienen que existir antes de armar los toggles)
  const censoLayerConfigs = [
    { name: 'censoniveleducativo',    layer: window.nivelEducativoLayer },
    { name: 'censoniveleducativo2',   layer: window.estudiosSuperioresLayer },
    { name: 'edadjovenadulto',        layer: window.jovenAdultoLayer },
    { name: 'edadnino',               layer: window.ninoLayer },
    { name: 'edadadulto',             layer: window.adultoLayer },
    { name: 'edadadultomayor',        layer: window.adultomayorLayer },
    { name: 'edadanciano',            layer: window.ancianoLayer },
    { name: 'internetno',             layer: window.internetNoLayer },
    { name: 'poblaciontotal',         layer: window.poblacionTotalLayer },
    { name: 'ocupados',               layer: window.censoOcupadosLayer },
    { name: 'desocupados',            layer: window.censoDesocupadosLayer },
    { name: 'inactivos',              layer: window.censoInactivosLayer }
  ];

  // Array Censo
  window.censoToggles = censoLayerConfigs.map(config =>
    setupLayerToggleWithEye(
      `toggle${config.name}Btn`,
      `${config.name}Icon`,
      config.layer,
      'censoToggleIcon',
      'bi-map-fill',
      actualizarEstadoPadreCenso
    )
  );

  // Prioridad a "Población total"
  const parentBtn = document.getElementById('censoToggle');
  if (parentBtn) {
    parentBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      const icon = document.getElementById('censoToggleIcon');
      const isCurrentlyOn = icon.classList.contains('bi-map-fill');

      if (isCurrentlyOn) {
        window.censoToggles.forEach(toggle => {
          if (toggle) {
            toggle.layer.setVisible(false);
            toggle.update();
          }
        });
      } else {
        window.censoToggles.forEach(toggle => {
          if (toggle) {
            if (toggle.layer === window.poblacionTotalLayer) {
              toggle.layer.setVisible(true);
            } else {
              toggle.layer.setVisible(false);
            }
            toggle.update();
          }
        });
      }

      actualizarEstadoPadreCenso();
    });
  }

  actualizarEstadoPadreCenso();
  //----------------------------- FIN SECCIÓN CENSO ---------------------------------//
}