// =================================================================
// POPUPS Unificados (robusto con etiquetas de capa)
// =================================================================
window.addEventListener('DOMContentLoaded', () => {
  if (!window.map) {
    console.error('❌ No se encontró el mapa al momento de crear los popups.');
    return;
  }

  // Helpers
  function crearPopup(id) {
    const el = document.getElementById(id);
    if (!el) {
      console.warn(`⚠️ No existe el contenedor #${id}`);
      return null;
    }
    return new ol.Overlay({
      element: el,
      autoPan: { animation: { duration: 250 } },
    });
  }

  function setupCloser(id, overlay) {
    if (!overlay) return;
    const closer = document.getElementById(id);
    if (closer) {
      closer.onclick = function () {
        const element = overlay.getElement();
        if (element) element.classList.remove('visible');
        overlay.setPosition(undefined);
        this.blur();
        return false;
      };
    }
  }

  function centerOf(geom) {
    return geom.getType() === 'Point'
      ? geom.getCoordinates()
      : ol.extent.getCenter(geom.getExtent());
  }

  // Crear overlays
  window.popupPlazas       = crearPopup('popup-plazas');
  window.popupEducacion    = crearPopup('popup-educacion');
  window.popupComerciales  = crearPopup('popup-comerciales');

  const allPopups = [popupPlazas, popupEducacion, popupComerciales].filter(Boolean);
  allPopups.forEach(p => map.addOverlay(p));

  setupCloser('popup-plazas-closer', popupPlazas);
  setupCloser('popup-educacion-closer', popupEducacion);
  setupCloser('popup-comerciales-closer', popupComerciales);

  // ============================
  // 1) Agrupar y ETIQUETAR capas
  // ============================
  const capasEducacion = [
    window.jardinesLayer,
    window.primariasLayer,
    window.secundariasLayer,
    window.universidadesLayer,
  ].filter(Boolean);

  const capasPlazas = [
    window.plazasLayer,
    window.redPlazasLayer,
    window.lyr_Plazas_0,
    window.Plazas_0,
    window.geojsonLayer, // quítalo si no son plazas
  ].filter(Boolean);

  const capasComerciales = [
    window.centrosComercialesLayer,
    window.comercialesLayer,
    window.lyr_CentrosComerciales_0,
    window.CentrosComerciales_0,
  ].filter(Boolean);

  // Etiquetas (clave del fix)
  capasEducacion.forEach(l => l.set('grupo', 'educacion'));
  capasPlazas.forEach(l => l.set('grupo', 'plazas'));
  capasComerciales.forEach(l => l.set('grupo', 'comerciales'));

  // Útil si algunas capas vienen de qgis2web con 'title'
  function resolverGrupo(layer) {
    if (!layer) return null;
    const g = layer.get('grupo');
    if (g) return g;
    const title = (layer.get && layer.get('title')) || (layer.getProperties && layer.getProperties().title);
    if (!title) return null;
    const t = String(title).toLowerCase();
    if (t.includes('plaza')) return 'plazas';
    if (t.includes('comercial') || t.includes('shopping') || t.includes('centro')) return 'comerciales';
    if (t.includes('jardin') || t.includes('primaria') || t.includes('secundaria') || t.includes('universidad')) return 'educacion';
    return null;
  }

  // ============================
  // 2) Click handler unificado
  // ============================
 map.on('singleclick', function (evt) {
  let feat = null;
  let lyr  = null;

  map.forEachFeatureAtPixel(evt.pixel,
    function (f, l) {
      feat = f;
      lyr  = l;
      return true; // corta en la primera encontrada
    },
    {
      hitTolerance: 6,
      layerFilter: function (layer) {
        // ✅ Solo capas que nos interesan
        return [
          window.plazasLayer,
          window.redPlazasLayer,
          window.lyr_Plazas_0,
          window.Plazas_0,
          window.geojsonLayer,
          window.centrosComercialesLayer,
          window.comercialesLayer,
          window.lyr_CentrosComerciales_0,
          window.CentrosComerciales_0,
          window.jardinesLayer,
          window.primariasLayer,
          window.secundariasLayer,
          window.universidadesLayer
        ].filter(Boolean).includes(layer);
      }
    }
  );

  // 🔹 Cerrar todos los popups antes de abrir otro
  [popupPlazas, popupEducacion, popupComerciales].forEach(p => {
    if (p) {
      const el = p.getElement();
      if (el) el.classList.remove('visible');
      p.setPosition(undefined);
    }
  });

  if (!feat) return;

  const props = feat.getProperties();
  const geom  = feat.getGeometry();
  const coord = (geom.getType() === 'Point')
    ? geom.getCoordinates()
    : ol.extent.getCenter(geom.getExtent());

  // PLAZAS
  if ([window.plazasLayer, window.redPlazasLayer, window.lyr_Plazas_0, window.Plazas_0, window.geojsonLayer].includes(lyr)) {
  const nombre = props.Nombre || props.nombre || "Plaza sin nombre";
  document.getElementById('popup-plazas-content').innerHTML = `<strong>${nombre}</strong>`;

  popupPlazas.setPositioning('bottom-center');
  popupPlazas.setOffset([0, -10]);
  showPopup(popupPlazas, coord);   // ✅ usar la función con animación
  return;
}

  // COMERCIALES
  if ([window.centrosComercialesLayer, window.comercialesLayer, window.lyr_CentrosComerciales_0, window.CentrosComerciales_0].includes(lyr)) {
  const nombre = props.Nombre || props.name || props.Centro || "Centro comercial";
  document.getElementById('popup-comerciales-content').innerHTML = `<strong>${nombre}</strong>`;

  popupComerciales.setPositioning('bottom-center');
  popupComerciales.setOffset([0, -10]);
  showPopup(popupComerciales, coord);   // 👈 ahora con animación
  return;
}

  // EDUCACIÓN
  if ([window.jardinesLayer, window.primariasLayer, window.secundariasLayer, window.universidadesLayer].includes(lyr)) {
  document.getElementById('popup-educacion-content').innerHTML = `
    <strong>${props.Nombre || 'Sin nombre'}</strong><br>
    Categoría: ${props.Categoría || props.Categoria || 'N/A'}<br>
    Dirección: ${props.Dirección || props.Direccion || 'No disponible'}
  `;

  popupEducacion.setPositioning('bottom-center');
  popupEducacion.setOffset([0, -27]);
  showPopup(popupEducacion, coord);   // 👈 ahora con animación
  return;
}
});


function showPopup(popup, coord) {
  const el = popup.getElement();

  // quitar la animación anterior
  el.classList.remove('animate');
  void el.offsetWidth; // ⚡ truco para forzar reflow
  el.classList.add('animate');

  el.classList.add('visible');
  popup.setPosition(coord);
}

// ============================
// Cursor tipo "pointer" en TODAS las capas con popup
// ============================
map.on('pointermove', function (evt) {
  if (evt.dragging) return; // evita cambios mientras se arrastra el mapa

  const hit = map.hasFeatureAtPixel(evt.pixel, {
    layerFilter: function (layer) {
      return [
        // Plazas
        window.plazasLayer,
        window.redPlazasLayer,
        window.lyr_Plazas_0,
        window.Plazas_0,
        window.geojsonLayer,
        // Comerciales
        window.centrosComercialesLayer,
        window.comercialesLayer,
        window.lyr_CentrosComerciales_0,
        window.CentrosComerciales_0,
        // Educación
        window.jardinesLayer,
        window.primariasLayer,
        window.secundariasLayer,
        window.universidadesLayer
      ].filter(Boolean).includes(layer);
    }
  });

  map.getTargetElement().style.cursor = hit ? 'pointer' : '';
});

});
