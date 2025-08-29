// =================================================================
// FUNCIÓN GENÉRICA PARA LOS OJOS DE VISIBILIDAD
// =================================================================
function setupLayerToggleWithEye(buttonId, iconId, layer, categoryIconId, categoryActiveClass, onStateChangeCallback) {
    const button = document.getElementById(buttonId);
    const icon = document.getElementById(iconId);
    if (!button || !icon || typeof layer === 'undefined') return;

    const updateState = () => {
        icon.className = layer.getVisible() ? 'bi bi-eye-fill' : 'bi bi-eye-slash';
    };

    button.addEventListener('click', (e) => {
        e.stopPropagation();
        layer.setVisible(!layer.getVisible());
        updateState();
        if (typeof onStateChangeCallback === 'function') onStateChangeCallback();
    });

    updateState(); // Estado inicial correcto
    return { layer, update: updateState };
}


// =================================================================
// DROPDOWNS
// =================================================================
function configurarDropdowns() {
  console.log("configurarDropdowns() inicializado");

  const sidebar = document.getElementById('sidebar');
  if (!sidebar) {
    console.error("No se encontró #sidebar en el DOM");
    return;
  }

  // Evitar inicializar dos veces
  if (sidebar.dataset.dropdownsInitialized === "1") {
    console.log("Dropdowns: ya inicializado (skip).");
    return;
  }
  sidebar.dataset.dropdownsInitialized = "1";

  // 1) Toggle de categorías (header)
  document.querySelectorAll('.category-header').forEach(header => {
    header.addEventListener('click', function (e) {
      // Si clickeaste directamente en el botón del ojo (que es <button>) dejamos que su propio handler actúe
      if (e.target.closest('.eye-button')) return;

      const clickedCategory = header.closest('.category');
      if (!clickedCategory) return;
      const shouldOpen = !clickedCategory.classList.contains('active');

      // Cierra otras
      document.querySelectorAll('.category.active').forEach(cat => {
        if (cat !== clickedCategory) cat.classList.remove('active');
      });

      clickedCategory.classList.toggle('active');
    });
  });

  // 2) Delegación de clics dentro del sidebar para abrir/cerrar dropdowns/submenus
  sidebar.addEventListener('click', function (e) {
    // Buscamos el button más cercano (o un elemento con clase btn-tipologia)
    const btn = e.target.closest('.btn-tipologia, .layer-toggle-button, .eye-button');
    if (!btn || !sidebar.contains(btn)) return;

    console.log("Click delegado en botón:", btn.id || btn.className, "target:", e.target);

    // Si clickeaste el icono "ojo" (bi-eye-slash / bi-eye-fill) dentro del botón: no desplegar aquí,
    // dejamos que el listener del eye (setupLayerToggleWithEye u otro) lo maneje.
    const iconClicked = e.target.closest('i');
    if (iconClicked && /bi-eye(-slash|-fill)/.test(iconClicked.className)) {
      console.log("Click en icono OJO -> delego al handler de visibilidad (no abrir desplegable).");
      return;
    }

    // Buscamos el contenedor que agrupa a ese botón (plazas-dropdown o dropdown)
    const parentDropdown = btn.closest('.plazas-dropdown, .dropdown');
    if (!parentDropdown) return;

    // Buscamos el contenido asociado en orden de prioridad
    //  - subcategorias directas (.plazas-subcategorias, .luminarias-subcategorias)
    //  - dropdown-content directo
    let content = parentDropdown.querySelector(':scope > .plazas-subcategorias, :scope > .luminarias-subcategorias, :scope > .dropdown-content');

    // fallback: si no está como hijo directo, buscamos en descendientes razonables
    if (!content) {
      content = parentDropdown.querySelector('.plazas-subcategorias, .luminarias-subcategorias, .dropdown-content');
    }

    if (!content) {
      console.log("No hay contenido desplegable asociado a este botón.");
      return;
    }

    // Cerrar hermanos activos al mismo nivel
    const siblingsContainer = parentDropdown.parentElement;
    if (siblingsContainer) {
      siblingsContainer.querySelectorAll(':scope > .plazas-dropdown.active, :scope > .dropdown.active').forEach(sib => {
        if (sib !== parentDropdown) {
          sib.classList.remove('active');
          const c = sib.querySelector(':scope > .plazas-subcategorias, :scope > .luminarias-subcategorias, :scope > .dropdown-content');
          if (c) c.classList.remove('show');
        }
      });
    }

    // Toggle en el actual
    parentDropdown.classList.toggle('active');
    content.classList.toggle('show');
    console.log("Toggle realizado. parentDropdown:", parentDropdown, "content:", content);
    // Actualizar chevron si existe
    const chevron = btn.querySelector('.chevron-icon') || parentDropdown.querySelector('.chevron-icon');
    if (chevron) {
      chevron.classList.toggle('bi-chevron-compact-up');
      chevron.classList.toggle('bi-chevron-compact-down');
    }
  });

  // 3) Evitar que clicks dentro del contenido cierren todo (con excepción para botones anidados)
  document.querySelectorAll('.plazas-subcategorias, .dropdown-content, .luminarias-subcategorias').forEach(contentArea => {
      contentArea.addEventListener('click', function(e) {
          // Si el elemento clickeado es un botón que debe abrir otro dropdown,
          // no detenemos la propagación para que el handler principal lo pueda gestionar.
          if (e.target.closest('.btn-tipologia, .layer-toggle-button, .eye-button')) {
              return;
          }
          
          // Si no es un botón interactivo, detenemos la propagación para evitar
          // que el menú se cierre al hacer clic en su interior.
          e.stopPropagation();
      });
  });

  // 4) Cerrar todo si clickeás fuera del sidebar
  document.addEventListener('click', function (e) {
    if (sidebar.contains(e.target)) return;
    document.querySelectorAll('.plazas-subcategorias.show, .dropdown-content.show').forEach(c => c.classList.remove('show'));
    document.querySelectorAll('.plazas-dropdown.active, .dropdown.active').forEach(d => d.classList.remove('active'));
    // Aseguramos chevrons en down
    document.querySelectorAll('.chevron-icon').forEach(ch => {
      ch.classList.remove('bi-chevron-compact-up');
      ch.classList.add('bi-chevron-compact-down');
    });
  });

  console.log("configurarDropdowns() listo.");
}

configurarDropdowns();


// =================================================================
// RESET PAGE (seguro y sintetizado)
// =================================================================
const resetBtn = document.getElementById('resetPageBtn');
if (resetBtn) {
  resetBtn.addEventListener('click', function () {
    
    // 1. CONFIGURACIÓN CENTRALIZADA DE CAPAS
    // Aquí definimos todas las capas a gestionar.
    // 'resetState: true' -> la capa estará visible tras el reseteo.
    // 'resetState: false' -> la capa estará oculta tras el reseteo.
    const capasAGestionar = [
      // GENERALES (Visibles por defecto)
      { layer: window.partidoLayer, iconId: 'partidoLayerIcon', resetState: true },
      { layer: window.localidadesLayer, iconId: 'localidadesLayerIcon', resetState: true },

      // ALTA TRANSITABILIDAD
      { layer: window.ejesestructurantesLayer, iconId: 'ejesEstructurantesIcon', resetState: false },
      { layer: window.ejessecundariosLayer, iconId: 'ejesSecundariosIcon', resetState: false },
      
      // EDUCACIÓN
      { layer: window.jardinesLayer, iconId: 'jardinesIcon', resetState: false },
      { layer: window.primariasLayer, iconId: 'primariasIcon', resetState: false },
      { layer: window.secundariasLayer, iconId: 'secundariasIcon', resetState: false },
      { layer: window.universidadesLayer, iconId: 'universidadesIcon', resetState: false },

      // ESPACIOS URBANOS
      { layer: window.geojsonLayer, iconId: 'redPlazasIcon', resetState: false }, // Asumo que es la capa de Espacios Verdes
      { layer: window.centrosComercialesLayer, iconId: 'redCentrosComercialesIcon', resetState: false },

      // CENSO 2022 (Agregamos todas las capas de censo que antes faltaban)
      { layer: window.poblacionTotalLayer, iconId: 'poblaciontotalIcon', resetState: false },
      { layer: window.ninoLayer, iconId: 'edadninoIcon', resetState: false },
      { layer: window.jovenAdultoLayer, iconId: 'edadjovenadultoIcon', resetState: false },
      { layer: window.adultoLayer, iconId: 'edadadultoIcon', resetState: false },
      { layer: window.adultomayorLayer, iconId: 'edadadultomayorIcon', resetState: false },
      { layer: window.ancianoLayer, iconId: 'edadancianoIcon', resetState: false },
      { layer: window.nivelEducativoLayer, iconId: 'censoniveleducativoIcon', resetState: false },
      { layer: window.estudiosSuperioresLayer, iconId: 'censoniveleducativo2Icon', resetState: false },
      { layer: window.internetNoLayer, iconId: 'internetnoIcon', resetState: false },
      { layer: window.censoOcupadosLayer, iconId: 'ocupadosIcon', resetState: false },
      { layer: window.censoDesocupadosLayer, iconId: 'desocupadosIcon', resetState: false },
      { layer: window.censoInactivosLayer, iconId: 'inactivosIcon', resetState: false },
      
      // ELECCIONES 2023 (Agregamos todas las capas de elecciones que antes faltaban)
      { layer: window.segundavueltanacional23Layer, iconId: 'segundavueltanacional23Icon', resetState: false },
      { layer: window.generalnacional23Layer, iconId: 'generales2023Icon', resetState: false },
      { layer: window.generalprovincial23Layer, iconId: 'generalprovincial2023Icon', resetState: false },
      { layer: window.generalmunicipal23Layer, iconId: 'generalmunicipal2023Icon', resetState: false },
      { layer: window.generalnacional23llaLayer, iconId: 'generales2023llaIcon', resetState: false },
      { layer: window.generalnacional23jxcLayer, iconId: 'generales2023jxcIcon', resetState: false }
    ];

    // 2. APLICACIÓN DE ESTADOS
    // Un único bucle para establecer la visibilidad de cada capa y su ícono.
    capasAGestionar.forEach(item => {
      if (item && typeof item.layer !== 'undefined') {
        item.layer.setVisible(item.resetState);
        
        const icon = document.getElementById(item.iconId);
        if (icon) {
          icon.className = item.resetState ? 'bi bi-eye-fill' : 'bi bi-eye-slash';
        }
      }
    });

    // 3. RESETEO DE ÍCONOS DE CATEGORÍAS PRINCIPALES
    // (Estos no son capas, sino los toggles generales de cada sección)
    const iconosCategoria = [
        { iconId: 'generalesToggleIcon', classOn: 'bi bi-map-fill' }, // Se queda "activo"
        { iconId: 'altatransitabilidadToggleIcon', classOff: 'bi bi-people' },
        { iconId: 'educacionToggleIcon', classOff: 'bi bi-book' },
        { iconId: 'censoToggleIcon', classOff: 'bi bi-map' },
        { iconId: 'plazasToggleIcon', classOff: 'bi bi-tree' },
        { iconId: 'eleccionesToggleIcon', classOff: 'bi bi-map' },
    ];
    iconosCategoria.forEach(({ iconId, classOn, classOff }) => {
        const icon = document.getElementById(iconId);
        if (icon) {
            icon.className = classOn || classOff;
        }
    });

    // 4. RESETEO DE OTROS ELEMENTOS DE LA UI
    // (Filtros, checkboxes, etc. como ya tenías)
    if (document.getElementById('filtroCalleInput')) {
      document.getElementById('filtroCalleInput').value = '';
    }
    document.querySelectorAll('.category-filter, .plazasmanthigiene-filter, .plazasmantequip-filter, .plazascestos-filter')
      .forEach(cb => cb.checked = true);
    document.querySelectorAll('.hidden-checkbox').forEach(cb => cb.checked = false);
    
    // Llama a las funciones de actualización si existen
    if (typeof applyEspaciosUrbanosFilters === "function") {
      applyEspaciosUrbanosFilters();
    }
    if (typeof actualizarCapasVisibles === 'function') {
      actualizarCapasVisibles();
    }
    
    console.log('Página reseteada al estado inicial.');
  });
}