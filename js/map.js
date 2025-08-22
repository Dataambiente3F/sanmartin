

document.addEventListener("DOMContentLoaded", function() {


// =================================================================
// FUNCIÓN GENÉRICA PARA LOS OJOS DE VISIBILIDAD
// =================================================================
function setupLayerToggleWithEye(buttonId, iconId, layer, categoryIconId, categoryActiveClass, onStateChangeCallback) {
    const button = document.getElementById(buttonId);
    const icon = document.getElementById(iconId);
    if (!button || !icon || typeof layer === 'undefined') {
        // console.error(`Error al configurar el toggle para #${buttonId}.`);
        return;
    }

    const updateState = () => {
        icon.className = layer.getVisible() ? 'bi bi-eye-fill' : 'bi bi-eye-slash';
    };

    button.addEventListener('click', (e) => {
    e.stopPropagation(); // No cierres el dropdown al tocar el botón
    
    // Siempre que hagan clic en el botón (ya sea en el texto o en el ícono)
    layer.setVisible(!layer.getVisible());
    updateState();

    if (typeof onStateChangeCallback === 'function') {
        onStateChangeCallback();
    }
    });

    /* BOTÓN QUE HACE QUE SOLO AL TOCAR EYE SE PRENDA O APAGUE LA CAPA
    button.addEventListener('click', (e) => {
    // Comprobamos si el clic fue SOBRE el ícono del ojo
    if (icon.contains(e.target)) {
        e.stopPropagation();
        layer.setVisible(!layer.getVisible());
        updateState();
        if (typeof onStateChangeCallback === 'function') {
            onStateChangeCallback();
        }
    }
    // Si el clic fue en cualquier otra parte del botón, no se hace nada aquí.
    });
    */

    updateState(); // Llama para establecer el estado inicial correcto del ojo
    return { layer, update: updateState };
}


function configurarDropdowns() {
  // Botones de submenú (soporta .btn-tipologia y .layer-toggle-button)
  document.querySelectorAll('.btn-tipologia:not(.no-toggle), .layer-toggle-button').forEach(btn => {
    btn.addEventListener('click', e => {
      // Si clickean el ojo, no abrimos/cerramos el desplegable
      if (e.target.classList.contains('bi-eye-slash') || e.target.classList.contains('bi-eye-fill')) return;

      e.stopPropagation();
      const clickedDropdown = btn.closest('.dropdown');
      if (!clickedDropdown) return;

      const isOpening = !clickedDropdown.classList.contains('active');

      // Cerrar otros dropdowns hermanos
      document.querySelectorAll('.dropdown.active').forEach(d => {
        if (d === clickedDropdown) return;
        // Evita cerrar padres/hijos si tenés anidación
        if (d.contains(clickedDropdown) || clickedDropdown.contains(d)) return;
        d.classList.remove('active');
        const ic = d.querySelector('.layer-toggle-button .chevron-icon, .btn-tipologia .chevron-icon');
        if (ic) ic.classList.remove('rotated');
      });

      // Abrir/cerrar el actual
      clickedDropdown.classList.toggle('active', isOpening);

      // Rotar chevron del botón clickeado
      const chev = btn.querySelector('.chevron-icon');
      if (chev) chev.classList.toggle('rotated', isOpening);
    });
  });

  // Evitar cerrar al click interno
  document.querySelectorAll('.dropdown-content, .plazas-subcategorias').forEach(c =>
    c.addEventListener('click', e => e.stopPropagation())
  );

  // Cerrar todo al click afuera
/*
document.addEventListener('click', () => {
    document.querySelectorAll('.dropdown.active').forEach(d => {
      d.classList.remove('active');
      const ic = d.querySelector('.layer-toggle-button .chevron-icon, .btn-tipologia .chevron-icon');
      if (ic) ic.classList.remove('rotated');
    });
});
*/



}

 
// 1) Dropdowns - Lógica para botones desplegables
document.querySelectorAll('.btn-tipologia, .layer-toggle-button').forEach(btn => {
  const tieneChevron = btn.querySelector('.chevron-icon');
  if (!tieneChevron) return;

  btn.addEventListener('click', e => {
    const clickedDropdown = btn.closest('.dropdown');
    if (!clickedDropdown) return;
    e.stopPropagation();

    // cerrar otros dropdowns abiertos (solo hermanos)
    document.querySelectorAll('.dropdown.active').forEach(activeDropdown => {
      if (activeDropdown === clickedDropdown) return;                 // mismo
      if (activeDropdown.contains(clickedDropdown)) return;           // padre
      if (clickedDropdown.contains(activeDropdown)) return;           // hijo
      activeDropdown.classList.remove('active');
      const ic = activeDropdown.querySelector('.chevron-icon');
      if (ic) ic.classList.remove('rotated');
    });

    // abrir/cerrar este
    const isOpening = !clickedDropdown.classList.contains('active');
    clickedDropdown.classList.toggle('active', isOpening);

    // actualizar el chevron de este botón
    const chev = btn.querySelector('.chevron-icon');
    if (chev) {
      chev.classList.toggle('rotated', isOpening);
    }
  });
});

// 2) Evitar que clics dentro del contenido cierren el menú
  document.querySelectorAll('.dropdown-content').forEach(content => {
    content.addEventListener('click', e => e.stopPropagation());
  });


  
    // 4) Inicializar el mapa ORDEN CAPAS
    // Modificación para 'map':
    window.map = new ol.Map({ // Añade 'window.'
        target: 'map',
        layers: [
            baseLayer, 
            satelliteLayer,
            geojsonLayer, 
            centrosComercialesLayer,
            localidadesLayer, partidoLayer,  
            ejesestructurantesLayer, ejessecundariosLayer
        ],

        view: new ol.View({
            center: ol.proj.fromLonLat([-58.55, -34.544]),
            zoom: 13
        })
    });

if (typeof crearCapaResultados === 'function') {
  crearCapaResultados(2023, 'SEGUNDA VUELTA', 'PRESIDENTE Y VICE', 'segundavueltanacional23Layer', {nivelAgregacion: 'circuito'});
  crearCapaResultados(2023, 'GENERAL', 'PRESIDENTE Y VICE', 'generalnacional23Layer', {nivelAgregacion: 'circuito'});
  crearCapaResultados(2023, 'GENERAL', 'GOBERNADOR/A', 'generalprovincial23Layer', {nivelAgregacion: 'circuito'});
  crearCapaResultados(2023, 'GENERAL', 'INTENDENTE/A', 'generalmunicipal23Layer', { nivelAgregacion: 'circuito'});
  crearCapaResultados(2023, 'GENERAL', 'INTENDENTE/A', 'generalmunicipalalianza23Layer', {nivelAgregacion: 'circuito',alianza: alianzaLLA_JxC});
  crearCapaResultados(2023, 'GENERAL', 'PRESIDENTE Y VICE', 'generalnacional23llaLayer', {nivelAgregacion: 'circuito',partidoEspecifico: 'LA LIBERTAD AVANZA'});
  crearCapaResultados(2023, 'GENERAL', 'PRESIDENTE Y VICE', 'generalnacional23jxcLayer', {nivelAgregacion: 'circuito',partidoEspecifico: 'JUNTOS POR EL CAMBIO'});

  if (window.segundavueltanacional23Layer) map.addLayer(window.segundavueltanacional23Layer);
  if (window.generalnacional23Layer) map.addLayer(window.generalnacional23Layer);
  if (window.generalprovincial23Layer) map.addLayer(window.generalprovincial23Layer);
  if (window.generalmunicipal23Layer) map.addLayer(window.generalmunicipal23Layer);
  if (window.generalmunicipalalianza23Layer) map.addLayer(window.generalmunicipalalianza23Layer);
  if (window.generalnacional23llaLayer) map.addLayer(window.generalnacional23llaLayer);
  if (window.generalnacional23jxcLayer) map.addLayer(window.generalnacional23jxcLayer);
}

if (typeof crearCapaNivelEducativo === 'function') {window.nivelEducativoLayer = crearCapaNivelEducativo('nivelEducativoLayer', 'nivel_ganador');
if (window.nivelEducativoLayer) map.addLayer(window.nivelEducativoLayer);
}

if (typeof crearCapaPorcentajeEstudios === 'function') {window.estudiosSuperioresLayer = crearCapaPorcentajeEstudios('estudiosSuperioresLayer', 'porcentaje_altos');
    if (window.estudiosSuperioresLayer) map.addLayer(window.estudiosSuperioresLayer);
}

if (typeof crearCapaPorcentajeEdad === 'function') {
  window.jovenAdultoLayer = crearCapaPorcentajeEdad('jovenAdultoLayer', 'joven');
  window.ninoLayer = crearCapaPorcentajeEdad('ninoLayer', 'nino');
  window.adultoLayer = crearCapaPorcentajeEdad('adultoLayer', 'adulto');
  window.adultomayorLayer = crearCapaPorcentajeEdad('adultomayorLayer', 'adultomayor');
  window.ancianoLayer = crearCapaPorcentajeEdad('ancianoLayer', 'anciano');

if (window.jovenAdultoLayer) map.addLayer(window.jovenAdultoLayer);
if (window.ninoLayer) map.addLayer(window.ninoLayer);
if (window.adultoLayer) map.addLayer(window.adultoLayer);
if (window.adultomayorLayer) map.addLayer(window.adultomayorLayer);
if (window.ancianoLayer) map.addLayer(window.ancianoLayer);
}

if (typeof crearCapaInternet === 'function') {
  window.internetNoLayer = crearCapaInternet('internetNoLayer', 'No');

if (window.internetNoLayer) map.addLayer(window.internetNoLayer);
}

if (typeof crearCapaTotalPoblacion === 'function') {
  window.poblacionTotalLayer = crearCapaTotalPoblacion('poblacionTotalLayer');

if (window.poblacionTotalLayer) map.addLayer(window.poblacionTotalLayer);
}

document.addEventListener("DOMContentLoaded", function () {
    setupLayerToggleWithEye("togglePlazasBtn", "redPlazasIcon", geojsonLayer);
    setupLayerToggleWithEye(
    'toggleEjesEstructurantesBtn',
    'ejesEstructurantesIcon',
    ejesestructurantesLayer,
    'altatransitabilidadToggleIcon',
    'bi-people-fill',
    actualizarEstadoPadreAltaTransitabilidad
    );
    setupLayerToggleWithEye("toggleEjesSecundariosBtn", "ejesSecundariosIcon", ejessecundariosLayer);
    setupLayerToggleWithEye("toggleCentrosComercialesBtn", "redCentrosComercialesIcon", centrosComercialesLayer);

    actualizarCapasVisibles();
});
    

    window.searchMarkerLayer = new ol.layer.Vector({ 
      source: new ol.source.Vector(),
      style: new ol.style.Style({
        image: new ol.style.Icon({
            anchor: [0.5, 1],
            src: 'data:image/svg+xml;charset=utf-8,<svg width="32" height="32" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><path fill="%23CBCBCB" d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10zm0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6z"/></svg>',
            scale: 0.7
        })
        // O tu estilo de círculo:
        // image: new ol.style.Circle({
        //   radius: 8,
        //   fill: new ol.style.Fill({ color: '#FFCC33' }),
        //   stroke: new ol.style.Stroke({ color: '#FFFFFF', width: 2 })
        // })
      }),
      zIndex: 1001 
    });
    window.map.addLayer(window.searchMarkerLayer); 


    // SATELITE 
        document.getElementById('toggleMapStyleBtn').addEventListener('click', function() {
        const overlay = document.getElementById('map-overlay');
        const isSatelliteVisible = satelliteLayer.getVisible();
        
        // Cambia la visibilidad de las capas del mapa
        satelliteLayer.setVisible(!isSatelliteVisible);
        baseLayer.setVisible(isSatelliteVisible);

        // Muestra u oculta la capa blanca según el mapa que esté activo
        if (!isSatelliteVisible) {
            // Si se acaba de activar el satélite, muestra la capa blanca
            overlay.style.display = 'block';
        } else {
            // Si se vuelve al mapa base, oculta la capa blanca
            overlay.style.display = 'none';
        }
    });

    // Estado inicial de las capas (apagadas, excepto las de GENERALES)
    [
        geojsonLayer, ejesestructurantesLayer,
        ejessecundariosLayer, centrosComercialesLayer
    ].forEach(layer => layer.setVisible(false));  
   
    // 6) Toggle categorías (abre/cierra la categoría y cambia el ícono chevron si existe)
document.querySelectorAll('.category-header').forEach(header => {
  header.addEventListener('click', e => {
    e.stopPropagation();
    const clickedCategory = header.closest('.category');
    const isOpening = !clickedCategory.classList.contains('active');

    // Cerrar otras categorías
    document.querySelectorAll('.category.active').forEach(cat => {
    if (cat === clickedCategory) return;
    cat.classList.remove('active');
    const ic = cat.querySelector('.category-header .chevron-icon');
    if (ic) ic.classList.remove('rotated');

    // 🔑 Cerrar todos los dropdowns internos de esa categoría
    cat.querySelectorAll('.dropdown.active').forEach(d => {
        d.classList.remove('active');
        const ic2 = d.querySelector('.chevron-icon');
        if (ic2) ic2.classList.remove('rotated');
    });
    });

    // Abrir/cerrar la clickeada
    clickedCategory.classList.toggle('active', isOpening);

    // Rotar su chevron
    const chev = header.querySelector('.chevron-icon');
    if (chev) chev.classList.toggle('rotated', isOpening);
  });
});

// Evitar que clics dentro de subcategorías cierren el dropdown padre
document.querySelectorAll('.plazas-subcategorias').forEach(content => {
  content.addEventListener('click', e => e.stopPropagation());
});

// 7) Impide que un click DENTRO del dropdown-content cierre el menú
    document.querySelectorAll('.dropdown-content').forEach(content => {
    content.addEventListener('click', e => e.stopPropagation());
    });



// 9) RESETAR PÁGINA PROVISIONAL LIMPIAR FILTROS

document.getElementById('resetPageBtn').addEventListener('click', function () {
    // 1. ✅ Asegurar que "Generales" está activado (esto está bien)
    if (typeof partidoLayer !== 'undefined') partidoLayer.setVisible(true);
    if (typeof localidadesLayer !== 'undefined') localidadesLayer.setVisible(true);
    const iconGen = document.getElementById('generalesToggleIcon');
    if (iconGen) iconGen.className = 'bi bi-map-fill';

    // Actualizar íconos de los botones de la categoría "Generales" para que se vean encendidos
    const partidoIcon = document.getElementById('partidoLayerIcon');
    if(partidoIcon) partidoIcon.className = 'bi bi-eye-fill';
    const localidadesIcon = document.getElementById('localidadesLayerIcon');
    if(localidadesIcon) localidadesIcon.className = 'bi bi-eye-fill';


    // 2. ❌ Apagar íconos de otras categorías y ocultar TODAS sus capas
    const iconosCategoria = [
        { iconId: 'altatransitabilidadToggleIcon', classOff: 'bi bi-people' },
        { iconId: 'plazasToggleIcon', classOff: 'bi bi-tree' },
        { iconId: 'higieneurbanaToggleIcon', classOff: 'bi bi-trash' },
    ];
    iconosCategoria.forEach(({ iconId, classOff }) => {
        const icon = document.getElementById(iconId);
        if (icon) icon.className = classOff;
    });

    // Apagar TODAS las capas que no sean de "Generales"
    if (typeof geojsonLayer !== 'undefined') geojsonLayer.setVisible(false);
    if (typeof ejesestructurantesLayer !== 'undefined') ejesestructurantesLayer.setVisible(false);
    if (typeof ejessecundariosLayer !== 'undefined') ejessecundariosLayer.setVisible(false);
    if (typeof centrosComercialesLayer !== 'undefined') centrosComercialesLayer.setVisible(false);
        if (document.getElementById('filtroCalleInput')) {
        document.getElementById('filtroCalleInput').value = '';
    }



    // 3. ✅ Resetear todos los FILTROS internos a su estado por defecto (todos marcados)
    document.querySelectorAll(
        '.category-filter, .plazasmanthigiene-filter, .plazasmantequip-filter, .plazascestos-filter'
    ).forEach(cb => cb.checked = true);

    // <-- AJUSTE CLAVE #1: Desactivar explícitamente los checkboxes de Red Pluvial
    document.querySelectorAll('.hidden-checkbox').forEach(cb => {
        cb.checked = false;
    });


    // 4. Aplicar los filtros reseteados
    if (typeof applyEspaciosUrbanosFilters === "function") {
        applyEspaciosUrbanosFilters();
    }

    // 4.b. Actualizar TODOS los íconos de ojo para que reflejen el estado "apagado"
    if (typeof altaTransitabilidadToggles !== 'undefined') {
        altaTransitabilidadToggles.forEach(toggle => toggle && toggle.update());
    }
    if (typeof espaciosUrbanosToggles !== 'undefined') {
        espaciosUrbanosToggles.forEach(toggle => toggle && toggle.update());
    }
    if (typeof higieneUrbanaToggles !== 'undefined') {
        higieneUrbanaToggles.forEach(toggle => toggle && toggle.update());
    }
    
            

actualizarCapasVisibles();
});

//----------------------------------- SECCIÓN GENERALES (¡AHORA SÚPER LIMPIA!) ---------------------------------//

    let generalesToggles = []; // Se declara vacío primero

    // 1. CREAMOS LA FUNCIÓN QUE VERIFICA EL ESTADO DEL PADRE "GENERALES"
    const actualizarEstadoPadreGenerales = () => {
        const parentIcon = document.getElementById('generalesToggleIcon');
        if (!parentIcon) return;
        const algunaCapaHijaVisible = generalesToggles.some(toggle => toggle.layer.getVisible());
        parentIcon.className = algunaCapaHijaVisible ? 'bi bi-map-fill' : 'bi bi-map';
    };

    // 2. CONFIGURAMOS LAS CAPAS HIJAS, PASANDO LA FUNCIÓN VERIFICADORA
    generalesToggles = [
        setupLayerToggleWithEye('togglePartidoBtn', 'partidoLayerIcon', partidoLayer, 'generalesToggleIcon', 'bi-map-fill', actualizarEstadoPadreGenerales),
        setupLayerToggleWithEye('toggleLocalidadesBtn', 'localidadesLayerIcon', localidadesLayer, 'generalesToggleIcon', 'bi-map-fill', actualizarEstadoPadreGenerales)
    ];

    // 3. ACTUALIZAMOS EL MANEJADOR DEL BOTÓN PRINCIPAL "GENERALES"
    document.getElementById('generalesToggle').addEventListener('click', function(e) {
        e.stopPropagation();
        const icon = document.getElementById('generalesToggleIcon');
        const isCurrentlyOn = icon.classList.contains('bi-map-fill');
        
        if (isCurrentlyOn) {
            icon.className = 'bi bi-map';
            generalesToggles.forEach(toggle => {
                if (toggle) {
                    toggle.layer.setVisible(false);
                    toggle.update(); // Actualiza el ícono del hijo
                }
            });
        }
        else {
            icon.className = 'bi bi-map-fill'; // Prende al padre
            // Y ahora, prende a todos los hijos también
            generalesToggles.forEach(toggle => {
                if (toggle) {
                    toggle.layer.setVisible(true);
                    toggle.update(); // Pide a cada botón que actualice su ícono
                }
            });
        }
    });

    // 4. ACTUALIZAR
    actualizarEstadoPadreGenerales();

//--------------------------------- FIN SECCIÓN GENERALES -------------------------------//
//
//
//
//
//
//
//
//
//
//
//----------------------------------- SECCIÓN ALTA TRANSITABILDIAD (CON HTML CORRECTO) ---------------------------------//
let altaTransitabilidadToggles = [];

// 1. CREAMOS LA FUNCIÓN QUE VERIFICA EL ESTADO DEL PADRE "GENERALES"
const actualizarEstadoPadreAltaTransitabilidad = () => {
    const parentIcon = document.getElementById('altatransitabilidadToggleIcon');
    if (!parentIcon) return;
    const algunaCapaHijaVisible = altaTransitabilidadToggles.some(toggle => toggle.layer.getVisible());
    parentIcon.className = algunaCapaHijaVisible ? 'bi bi-people-fill' : 'bi bi-people';
};

// 2. CONFIGURAMOS LAS CAPAS HIJAS, PASANDO LA FUNCIÓN VERIFICADORA
altaTransitabilidadToggles = [
    setupLayerToggleWithEye('toggleEjesEstructurantesBtn', 'ejesEstructurantesIcon', ejesestructurantesLayer, 'altatransitabilidadToggleIcon', 'bi-people-fill', actualizarEstadoPadreAltaTransitabilidad),
    setupLayerToggleWithEye('toggleEjesSecundariosBtn', 'ejesSecundariosIcon', ejessecundariosLayer, 'altatransitabilidadToggleIcon', 'bi-people-fill', actualizarEstadoPadreAltaTransitabilidad)
];


// 3. ACTUALIZAMOS EL MANEJADOR DEL BOTÓN PRINCIPAL "GENERALES"
document.getElementById('altatransitabilidadToggle').addEventListener('click', function(e) {
    e.stopPropagation();
    const icon = document.getElementById('altatransitabilidadToggleIcon');
    const isCurrentlyOn = icon.classList.contains('bi-people-fill');
    
    if (isCurrentlyOn) {
        icon.className = 'bi bi-people';
        altaTransitabilidadToggles.forEach(toggle => {
            if (toggle) {
                toggle.layer.setVisible(false);
                toggle.update();
            }
        });
    } else {
        icon.className = 'bi bi-people-fill';
        altaTransitabilidadToggles.forEach(toggle => {
            if (toggle) {
                toggle.layer.setVisible(true);
                toggle.update();
            }
        });
    }
});

// 4. ACTUALIZAR
actualizarEstadoPadreAltaTransitabilidad();
    
//----------------------------------- FIN SECCIÓN ALTA TRANSITABILDIAD ---------------------------------//
//
//
//
//
//
//
//
//
//
//
//----------------------------- SECCIÓN ESPACIOS URBANOS ---------------------------//
let espaciosUrbanosToggles = []; // 1. Array para guardar los controles de las capas hijas

// 2. Función que revisa si alguna capa hija está visible para actualizar el ícono del padre
const actualizarEstadoPadreEspaciosUrbanos = () => {
    const parentIcon = document.getElementById('plazasToggleIcon');
    if (!parentIcon) return;
    const algunaCapaHijaVisible = espaciosUrbanosToggles.some(toggle => toggle && toggle.layer.getVisible());
    parentIcon.className = algunaCapaHijaVisible ? 'bi bi-tree-fill' : 'bi bi-tree';
};

// 3. Configuración de las capas hijas
// Aquí añadimos cada capa hija al array. Por ahora solo hay una.
espaciosUrbanosToggles = [
    setupLayerToggleWithEye(
        'togglePlazasBtn',
        'redPlazasIcon',
        geojsonLayer,
        'plazasToggleIcon',
        'bi-tree-fill',
        actualizarEstadoPadreEspaciosUrbanos
    ),
    setupLayerToggleWithEye(
        'toggleCentrosComercialesBtn',
        'redCentrosComercialesIcon',
        centrosComercialesLayer,
        'plazasToggleIcon',
        'bi-tree-fill',
        actualizarEstadoPadreEspaciosUrbanos
    )
];

// 4. Configuración del botón principal (padre) para que controle a todos los hijos
document.getElementById('plazasToggle').addEventListener('click', function(e) {
    e.stopPropagation();
    const icon = document.getElementById('plazasToggleIcon');
    const isCurrentlyOn = icon.classList.contains('bi-tree-fill');
    
    // El click en el padre prenderá o apagará TODOS los hijos en el array
    espaciosUrbanosToggles.forEach(toggle => {
        if (toggle) {
            toggle.layer.setVisible(!isCurrentlyOn);
            toggle.update(); // Le pedimos a cada hijo que actualice su propio ícono de ojo
        }
    });
    actualizarEstadoPadreEspaciosUrbanos();
});

actualizarEstadoPadreEspaciosUrbanos();
    
//----------------------------- FIN SECCIÓN ESPACIOS URBANOS ---------------------------//


//--------------------------------- SECCIÓN CENSO -------------------------------//

let censoToggles = [];

const actualizarEstadoPadreCenso = () => {
    const parentIcon = document.getElementById('censoToggleIcon');
    if (!parentIcon) return;
    const algunaCapaHijaVisible = censoToggles.some(toggle => toggle && toggle.layer.getVisible());
    parentIcon.className = algunaCapaHijaVisible ? 'bi bi-map-fill' : 'bi bi-map';
};

censoToggles = [
        setupLayerToggleWithEye(
        'togglecensoniveleducativoBtn',
        'censoniveleducativoIcon',
        nivelEducativoLayer,  // Capa global creada en capasEstilos.js
        'censoToggleIcon',
        'bi-map-fill',
        actualizarEstadoPadreCenso
    ),
    setupLayerToggleWithEye(
        'togglecensoniveleducativo2Btn',
        'censoniveleducativo2Icon',
        estudiosSuperioresLayer,  // Capa global creada en capasEstilos.js
        'censoToggleIcon',
        'bi-map-fill',
        actualizarEstadoPadreCenso
    ),
    setupLayerToggleWithEye(
        'toggleedadjovenadultoBtn',
        'edadjovenadultoIcon',
        jovenAdultoLayer,  // Capa global creada en capasEstilos.js
        'censoToggleIcon',
        'bi-map-fill',
        actualizarEstadoPadreCenso
    ),
    setupLayerToggleWithEye(
        'toggleedadninoBtn',
        'edadninoIcon',
        ninoLayer,  // Capa global creada en capasEstilos.js
        'censoToggleIcon',
        'bi-map-fill',
        actualizarEstadoPadreCenso
    ),
    setupLayerToggleWithEye(
        'toggleedadadultoBtn',
        'edadadultoIcon',
        adultoLayer,  // Capa global creada en capasEstilos.js
        'censoToggleIcon',
        'bi-map-fill',
        actualizarEstadoPadreCenso
    ),
    setupLayerToggleWithEye(
        'toggleedadadultomayorBtn',
        'edadadultomayorIcon',
        adultomayorLayer,  // Capa global creada en capasEstilos.js
        'censoToggleIcon',
        'bi-map-fill',
        actualizarEstadoPadreCenso
    ),
    setupLayerToggleWithEye(
        'toggleedadancianoBtn',
        'edadancianoIcon',
        ancianoLayer,  // Capa global creada en capasEstilos.js
        'censoToggleIcon',
        'bi-map-fill',
        actualizarEstadoPadreCenso
    ),
    setupLayerToggleWithEye(
        'toggleinternetnoBtn',
        'internetnoIcon',
        internetNoLayer,  // Capa global creada en capasEstilos.js
        'censoToggleIcon',
        'bi-map-fill',
        actualizarEstadoPadreCenso
    ),
    setupLayerToggleWithEye(
    'togglepoblaciontotalBtn',
    'poblaciontotalIcon',
    poblacionTotalLayer,
    'censoToggleIcon',
    'bi-map-fill',
    actualizarEstadoPadreCenso
    )
];

document.getElementById('censoToggle').addEventListener('click', function (e) {
    e.stopPropagation();
    const icon = document.getElementById('censoToggleIcon');
    const isCurrentlyOn = icon.classList.contains('bi-map-fill');

    censoToggles.forEach(toggle => {
        if (toggle) {
            toggle.layer.setVisible(!isCurrentlyOn);
            toggle.update();
        }
    });

    actualizarEstadoPadreCenso();
});

actualizarEstadoPadreCenso();

//----------------------------- FIN SECCIÓN CENSO ---------------------------------//




//--------------------------------- SECCIÓN ELECCIONES -------------------------------//

let eleccionesToggles = [];

const actualizarEstadoPadreElecciones = () => {
    const parentIcon = document.getElementById('eleccionesToggleIcon');
    if (!parentIcon) return;
    const algunaCapaHijaVisible = eleccionesToggles.some(toggle => toggle && toggle.layer.getVisible());
    parentIcon.className = algunaCapaHijaVisible ? 'bi bi-map-fill' : 'bi bi-map';
};

eleccionesToggles = [
        setupLayerToggleWithEye(
        'togglesegundavueltanacional23Btn',
        'segundavueltanacional23Icon',
        segundavueltanacional23Layer,  // Capa global creada en capasEstilos.js
        'eleccionesToggleIcon',
        'bi-map-fill',
        actualizarEstadoPadreElecciones
    ), 
    setupLayerToggleWithEye(
        'toggle2023GeneralesNacionalBtn',
        'generales2023Icon',
        generalnacional23Layer,  // Capa global creada en capasEstilos.js
        'eleccionesToggleIcon',
        'bi-map-fill',
        actualizarEstadoPadreElecciones
    ), 
    setupLayerToggleWithEye(
        'toggle2023GeneralProvincialBtn',
        'generalprovincial2023Icon',
        generalprovincial23Layer,  // Capa global creada en capasEstilos.js
        'eleccionesToggleIcon',
        'bi-map-fill',
        actualizarEstadoPadreElecciones
    ), 
    setupLayerToggleWithEye(
        'toggle2023GeneralMunicipalBtn',
        'generalmunicipal2023Icon',
        generalmunicipal23Layer,  // Capa global creada en capasEstilos.js
        'eleccionesToggleIcon',
        'bi-map-fill',
        actualizarEstadoPadreElecciones
    ), 
    setupLayerToggleWithEye(
        'toggle2023GeneralMunicipalAlianzaBtn',
        'generalmunicipalalianza2023Icon',
        generalmunicipalalianza23Layer,  // Capa global creada en capasEstilos.js
        'eleccionesToggleIcon',
        'bi-map-fill',
        actualizarEstadoPadreElecciones
    ), 
    setupLayerToggleWithEye(
        'toggle2023GeneralesNacionalLLABtn',
        'generales2023llaIcon',
        generalnacional23llaLayer,  // Capa global creada en capasEstilos.js
        'eleccionesToggleIcon',
        'bi-map-fill',
        actualizarEstadoPadreElecciones
    ),
    setupLayerToggleWithEye(
        'toggle2023GeneralesNacionalJXCBtn',
        'generales2023jxcIcon',
        generalnacional23jxcLayer,  // Capa global creada en capasEstilos.js
        'eleccionesToggleIcon',
        'bi-map-fill',
        actualizarEstadoPadreElecciones
    )
];

document.getElementById('eleccionesToggles').addEventListener('click', function (e) {
    e.stopPropagation();
    const icon = document.getElementById('eleccionesToggleIcon');
    const isCurrentlyOn = icon.classList.contains('bi-map-fill');

    eleccionesToggles.forEach(toggle => {
        if (toggle) {
            toggle.layer.setVisible(!isCurrentlyOn);
            toggle.update();
        }
    });

    actualizarEstadoPadreElecciones();
});

actualizarEstadoPadreElecciones();

//----------------------------- FIN SECCIÓN ELECCIONES ---------------------------------//

// =================================================================
// GESTOR DE CLICS Y POPUPS UNIFICADO (REEMPLAZA TODOS LOS map.on('click'))
// =================================================================
map.on('click', function(evt) {
    // 1. Ocultar todos los popups al inicio de cada clic
    // (Creamos una lista de todos tus objetos popup para manejarlos fácilmente)
    const allPopups = [
        popup, popupComerciales, 
        popupCriticos, popupZonas
    ];
    allPopups.forEach(p => p.setPosition(undefined));

    // 2. Detectar qué feature y capa se ha clickeado
    let clickedFeature = null;
    let clickedLayer = null;
    map.forEachFeatureAtPixel(evt.pixel, function(feature, layer) {
        // Nos quedamos con la primera feature que encuentre
        if (!clickedFeature) {
            clickedFeature = feature;
            clickedLayer = layer;
        }
    }, {
        hitTolerance: 5 // Aumenta la tolerancia para facilitar el clic en líneas y puntos
    });

    // 3. Si no se clickeó ninguna feature de interés, no hacemos nada más
    if (!clickedFeature) {
        // Deseleccionar la plaza si estaba seleccionada
        if (selectedFeature) {
            selectedFeature = null;
            geojsonLayer.changed();
        }
        return;
    }

});



//seleccionExclusiva
if (window.makeExclusiveByVisibility) {
  window.makeExclusiveByVisibility(censoToggles);
}

//seleccionExclusiva
if (window.makeExclusiveByVisibility) {
  window.makeExclusiveByVisibility(eleccionesToggles);
}


map.addLayer(segundavueltanacional23Layer);
map.addLayer(generalnacional23Layer);
map.addLayer(generalprovincial23Layer);
map.addLayer(generalmunicipal23Layer);
map.addLayer(generalmunicipalalianza23Layer);
map.addLayer(generalnacional23llaLayer);
map.addLayer(generalnacional23jxcLayer);
map.addLayer(nivelEducativoLayer);
map.addLayer(estudiosSuperioresLayer);

map.addLayer(jovenAdultoLayer);
map.addLayer(ninoLayer);
map.addLayer(adultoLayer);
map.addLayer(adultomayorLayer);
map.addLayer(ancianoLayer);

map.addLayer(internetNoLayer);

map.addLayer(poblacionTotalLayer);
});



// =================================================================
// FUNCIÓN CENTRAL PARA ACTUALIZAR EL RESUMEN DE FILTROS ACTIVOS
// =================================================================

function actualizarCapasVisibles() {
    const texto = document.getElementById("texto-filtros-activos");
    if (!texto) return;

    const capasVisibles = [];

    const listaCapas = [
        { layer: geojsonLayer, nombre: "Espacios Verdes" },
        { layer: ejesestructurantesLayer, nombre: "Ejes Estructurantes" },
        { layer: ejessecundariosLayer, nombre: "Ejes Secundarios" },
        { layer: centrosComercialesLayer, nombre: "Centros Comerciales" }
        // Agregá más si tenés otras
    ];

    listaCapas.forEach(({ layer, nombre }) => {
        if (layer && layer.getVisible()) {
            capasVisibles.push(nombre);
        }
    });

    texto.textContent = capasVisibles.length > 0 ? capasVisibles.join(" • ") : "Ninguno";
}

// ------- CÓDIGO CON LA SOLUCIÓN DEFINITIVA Y ESTRICTA PARA TRES DE FEBRERO -------


window.addEventListener("load", function () {
  // Esto se dispara cuando TODO el sitio está cargado
  const loader = document.getElementById("loader");
  if (loader) loader.style.display = "none";
});


map.addLayer(window.localidadesLayer);

