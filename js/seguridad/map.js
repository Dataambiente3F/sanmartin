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
        // Comprobamos si el clic fue SOBRE el ícono del ojo
        if (icon.contains(e.target)) {
            // Si fue en el ojo, detenemos la propagación para no afectar el desplegable
            e.stopPropagation();
            
            // Y SOLO AQUÍ, cambiamos la visibilidad de la capa
            layer.setVisible(!layer.getVisible());
            updateState(); // Actualizamos el ícono (ojo abierto/cerrado)
            
            if (typeof onStateChangeCallback === 'function') {
                onStateChangeCallback();
            }
        }
        // Si el clic fue en cualquier otra parte del botón, no se hace nada aquí.
        // El desplegable se abrirá por su propia funcionalidad (ej. Bootstrap).
    });

    updateState(); // Llama para establecer el estado inicial correcto del ojo
    return { layer, update: updateState };
}



    // 1) Dropdowns Al hacer clic en cualquier botón .btn-tipologia
document.querySelectorAll('.btn-tipologia:not(.no-toggle)').forEach(btn => {
    btn.addEventListener('click', e => {
        // Prevenir que el clic en el ojo afecte al desplegable
        if (e.target.classList.contains('bi-eye-slash') || e.target.classList.contains('bi-eye-fill')) {
            return;
        }

        e.stopPropagation();
        const clickedDropdown = btn.closest('.dropdown');
        if (!clickedDropdown) return;

        const wasActive = clickedDropdown.classList.contains('active');

        // Primero, cierra todos los otros desplegables que estén abiertos
        document.querySelectorAll('.dropdown.active').forEach(activeDropdown => {
            if (activeDropdown !== clickedDropdown) {
                activeDropdown.classList.remove('active');
            }
        });

        // Luego, abre o cierra el desplegable clickeado
        clickedDropdown.classList.toggle('active');
    });
});


// 2) Evitar que clics dentro del contenido cierren el menú
  document.querySelectorAll('.dropdown-content').forEach(content => {
    content.addEventListener('click', e => e.stopPropagation());
  });

  // 3) Al clic fuera de cualquier dropdown, cerrar TODOS
  document.addEventListener('click', () => {
    document.querySelectorAll('.dropdown.active').forEach(drop => {
      drop.classList.remove('active');
      const icon = drop.querySelector('i');
      if (icon) {
        icon.classList.remove('bi-chevron-compact-up');
        icon.classList.add('bi-chevron-compact-down');
      }
    });
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
            zonasalumbradoLayer,
            zonasinundablesLayer, red80Layer, red100Layer, sumiderosLayer,
            rutanocturnaLayer, rutadiurnaLayer, 
            ejesestructurantesLayer, ejessecundariosLayer,
            puntoscriticosLayer, contenedoresLayer, censoalumbradoLayer, totem3FLayer
            // No añadas searchMarkerLayer aquí si ya la añades abajo explícitamente
        ],

        view: new ol.View({
            center: ol.proj.fromLonLat([-58.59, -34.60]),
            zoom: 13
        })
    });








document.addEventListener("DOMContentLoaded", function () {
    // Asegurate de que las capas ya estén creadas antes de esto
    setupLayerToggleWithEye("togglePlazasBtn", "redPlazasIcon", geojsonLayer);
    setupLayerToggleWithEye("toggleLuminariasBtn", "luminariasLayerIcon", censoalumbradoLayer);
    setupLayerToggleWithEye(
    'toggleEjesEstructurantesBtn',
    'ejesEstructurantesIcon',
    ejesestructurantesLayer,
    'altatransitabilidadToggleIcon',
    'bi-people-fill',
    actualizarEstadoPadreAltaTransitabilidad
    );
    setupLayerToggleWithEye("toggleEjesSecundariosBtn", "ejesSecundariosIcon", ejessecundariosLayer);
    setupLayerToggleWithEye("toggleContenedoresBtn", "contenedoresIcon", contenedoresLayer);
    setupLayerToggleWithEye("togglePuntosCriticosBtn", "puntosCriticosIcon", puntoscriticosLayer);
    setupLayerToggleWithEye("toggleCentrosComercialesBtn", "redCentrosComercialesIcon", centrosComercialesLayer);
    setupLayerToggleWithEye("toggleTotem3FBtn", "totem3FIcon", totem3FLayer);
    setupLayerToggleWithEye("toggleZonasAlumbradoBtn", "zonasAlumbradoIcon", zonasalumbradoLayer);
    setupLayerToggleWithEye("toggleSumiderosCapaBtn", "sumiderosCapaIcon", sumiderosLayer);
    setupLayerToggleWithEye("toggleZonasInundablesBtn", "zonasInundablesIcon", zonasinundablesLayer);
    setupLayerToggleWithEye("toggleRedPluvialBtn", "redPluvialIcon", redpluvialLayer);

    // Red 100 y 80 por checkbox
    document.getElementById("toggleRed100Check").addEventListener("change", function () {
        red100Layer.setVisible(this.checked);
        actualizarCapasVisibles();
    });

    document.getElementById("toggleRed80Check").addEventListener("change", function () {
        red80Layer.setVisible(this.checked);
        actualizarCapasVisibles();
    });

    // Llamada inicial para mostrar lo que ya está visible
    actualizarCapasVisibles();
});
    

    // ... más abajo, donde defines searchMarkerLayer ...

    // Modificación para 'searchMarkerLayer':
    window.searchMarkerLayer = new ol.layer.Vector({ // Añade 'window.'
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
    window.map.addLayer(window.searchMarkerLayer); // Usa window.map aquí también





    // En tu script principal, después de inicializar 'map':

     // Lógica para botones sobre el mapa SATELITE 
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


    // Lógica para botones sobre el mapa FILTROS ACTIVOS
    document.getElementById('toggleFiltersBtn').addEventListener('click', function() {
        document.getElementById('filtros-activos').classList.toggle('visible');
    });

    // Estado inicial de las capas (apagadas, excepto las de GENERALES)
    [
        geojsonLayer, censoalumbradoLayer, ejesestructurantesLayer,
        ejessecundariosLayer, zonasinundablesLayer, red80Layer, 
        red100Layer, sumiderosLayer, puntoscriticosLayer, 
        contenedoresLayer, rutanocturnaLayer, rutadiurnaLayer, centrosComercialesLayer, totem3FLayer,
        zonasalumbradoLayer
    ].forEach(layer => layer.setVisible(false));  
   
    // 6) Toggle categorías (abre/cierra la categoría y cambia el ícono chevron si existe)
document.querySelectorAll('.category-header').forEach(header => {
    header.addEventListener('click', () => {
        const clickedCategory = header.closest('.category');
        const shouldOpen = !clickedCategory.classList.contains('active');

        // Primero, cierra todas las otras categorías que estén activas
        document.querySelectorAll('.category.active').forEach(category => {
            if (category !== clickedCategory) {
                category.classList.remove('active');
            }
        });

        // Luego, simplemente abre o cierra la categoría que fue clickeada
        clickedCategory.classList.toggle('active');
    });
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
        { iconId: 'alumbradoToggleIcon', classOff: 'bi bi-lightbulb' },
        { iconId: 'sumiderosToggleIcon', classOff: 'bi bi-droplet' },
    ];
    iconosCategoria.forEach(({ iconId, classOff }) => {
        const icon = document.getElementById(iconId);
        if (icon) icon.className = classOff;
    });

    // Apagar TODAS las capas que no sean de "Generales"
    if (typeof geojsonLayer !== 'undefined') geojsonLayer.setVisible(false);
    if (typeof censoalumbradoLayer !== 'undefined') censoalumbradoLayer.setVisible(false);
    if (typeof ejesestructurantesLayer !== 'undefined') ejesestructurantesLayer.setVisible(false);
    if (typeof ejessecundariosLayer !== 'undefined') ejessecundariosLayer.setVisible(false);
    if (typeof zonasinundablesLayer !== 'undefined') zonasinundablesLayer.setVisible(false);
    if (typeof red80Layer !== 'undefined') red80Layer.setVisible(false);
    if (typeof red100Layer !== 'undefined') red100Layer.setVisible(false);
    if (typeof sumiderosLayer !== 'undefined') sumiderosLayer.setVisible(false);
    if (typeof puntoscriticosLayer !== 'undefined') puntoscriticosLayer.setVisible(false);
    if (typeof contenedoresLayer !== 'undefined') contenedoresLayer.setVisible(false);
    if (typeof rutanocturnaLayer !== 'undefined') rutanocturnaLayer.setVisible(false);
    if (typeof rutadiurnaLayer !== 'undefined') rutadiurnaLayer.setVisible(false);
    if (typeof centrosComercialesLayer !== 'undefined') centrosComercialesLayer.setVisible(false);
    if (typeof totem3FLayer !== 'undefined') totem3FLayer.setVisible(false);
    if (typeof zonasalumbradoLayer !== 'undefined') zonasalumbradoLayer.setVisible(false); // <--- AÑADIR ESTA LÍNEA
        if (document.getElementById('filtroCalleInput')) {
        document.getElementById('filtroCalleInput').value = '';
    }



    // 3. ✅ Resetear todos los FILTROS internos a su estado por defecto (todos marcados)
    document.querySelectorAll(
        '.category-filter, .plazasmanthigiene-filter, .plazasmantequip-filter, .plazascestos-filter, .alumbradotipo-filter'
    ).forEach(cb => cb.checked = true);

    // <-- AJUSTE CLAVE #1: Desactivar explícitamente los checkboxes de Red Pluvial
    document.querySelectorAll('.hidden-checkbox').forEach(cb => {
        cb.checked = false;
    });


    // 4. Aplicar los filtros reseteados
    if (typeof applyEspaciosUrbanosFilters === "function") {
        applyEspaciosUrbanosFilters();
    }
    if (typeof applyAlumbradoFilters === "function") {
        // Esta llamada es crucial, porque aplicará los filtros ya limpios
        applyAlumbradoFilters();
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
    if (typeof sumiderosToggles !== 'undefined') {
        sumiderosToggles.forEach(toggle => toggle && toggle.update());
    }
    
    // <-- AJUSTE CLAVE #2: Sincronizar las capas de Red Pluvial y actualizar el ícono padre
    if(typeof redPluvialHijos !== 'undefined' && typeof chainedCallback === 'function') {
        redPluvialHijos.forEach(hijo => {
            if (hijo.checkbox) {
                // Sincroniza la capa con el checkbox (que ahora es 'false')
                hijo.layer.setVisible(hijo.checkbox.checked);
            }
        });
        // Actualiza los íconos de la categoría "Red Hídrica"
        chainedCallback();
    }

    // 5. Ocultar y limpiar el cuadro de filtros activos
    const contenedorFiltros = document.getElementById("filtros-activos");
    const textoFiltrosActivos = document.getElementById("texto-filtros-activos");
    if (contenedorFiltros) {
        contenedorFiltros.classList.remove('visible');
    }
    if (textoFiltrosActivos) {
        textoFiltrosActivos.textContent = "Ninguno";
    }
            
    // 6. Resetear íconos de círculo de los filtros
    actualizarEstadoIcono('.category-filter', 'CircleTipologia');
    actualizarEstadoIcono('.plazasmanthigiene-filter', 'CircleManthigiene');
    actualizarEstadoIcono('.plazasmantequip-filter', 'CircleMantequip');
    actualizarEstadoIcono('.plazascestos-filter', 'CircleCestos');
    actualizarEstadoIcono('.alumbradotipo-filter', 'CircleLuminarias');


////////////////////////////////////////////// BUSCADOR PLAZAS

            // 7. Limpiar buscador de plazas
            const searchPlazaInput = document.getElementById('searchPlazaInput');
            if(searchPlazaInput) searchPlazaInput.value = '';
            const searchSuggestions = document.getElementById('searchSuggestions');
            if(searchSuggestions) {
                searchSuggestions.innerHTML = '';
                searchSuggestions.style.display = 'none';
            }


            


    searchInput.addEventListener('input', function () {
        const query = this.value.trim().toLowerCase();
        suggestionsContainer.innerHTML = '';
        currentSuggestions = [];
        selectedSuggestionIndex = -1;

        if (query.length < 2) {
            suggestionsContainer.style.display = 'none';
            return;
        }

        const matching = geojsonLayer.getSource().getFeatures().filter(feature => {
            const name = (feature.get('nombre') || '').toLowerCase();
            return name.includes(query);
        });

        if (matching.length === 0) {
            suggestionsContainer.style.display = 'none';
            return;
        }

        matching.forEach((feature, index) => {
            const name = feature.get('nombre') || 'Sin nombre';
            const div = document.createElement('div');
            div.textContent = name;
            div.style.padding = '6px';
            div.style.cursor = 'pointer';
            div.style.borderBottom = '1px solid #eee';

            div.addEventListener('mouseenter', () => {
                highlightSuggestion(index);
            });

            div.addEventListener('mouseleave', () => {
                unhighlightSuggestion(index);
            });

            div.addEventListener('click', function () {
                selectSuggestion(index);
            });

            suggestionsContainer.appendChild(div);
            currentSuggestions.push({ feature, element: div });
        });

        suggestionsContainer.style.display = 'block';
    });

function unhighlightSuggestion(index) {
    if (selectedSuggestionIndex !== index) return;
    currentSuggestions[index].element.classList.remove('active-suggestion');
    selectedSuggestionIndex = -1;
}

    function unhighlightSuggestion(index) {
        if (selectedSuggestionIndex !== index) return;
        currentSuggestions[index].element.style.background = 'white';
        selectedSuggestionIndex = -1;
    }

    function selectSuggestion(index) {
        const selected = currentSuggestions[index];
        if (!selected) return;

        const geometry = selected.feature.getGeometry();
        const extent = geometry.getExtent();
        map.getView().fit(extent, { duration: 500, padding: [50, 50, 50, 50] });

        selectedFeature = selected.feature;
        geojsonLayer.changed();

        searchInput.value = selected.feature.get('nombre') || '';
        suggestionsContainer.innerHTML = '';
        suggestionsContainer.style.display = 'none';
        currentSuggestions = [];
        selectedSuggestionIndex = -1;
    }

    // Teclado: navegar con flechas y seleccionar con Enter
    searchInput.addEventListener('keydown', function (e) {
        if (suggestionsContainer.style.display === 'none') return;

        if (e.key === 'ArrowDown') {
            e.preventDefault();
            const next = (selectedSuggestionIndex + 1) % currentSuggestions.length;
            highlightSuggestion(next);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            const prev = (selectedSuggestionIndex - 1 + currentSuggestions.length) % currentSuggestions.length;
            highlightSuggestion(prev);
        } else if (e.key === 'Enter') {
            e.preventDefault();
            if (selectedSuggestionIndex >= 0) {
                selectSuggestion(selectedSuggestionIndex);
            }
        }
    });

    // Cierra si hacés clic fuera
    document.addEventListener('click', function (e) {
        if (!suggestionsContainer.contains(e.target) && e.target !== searchInput) {
            suggestionsContainer.style.display = 'none';
        }
    });

let currentSuggestionIndex = -1;

searchInput.addEventListener('input', function () {
    const query = this.value.trim().toLowerCase();
    suggestionsContainer.innerHTML = '';
    currentSuggestionIndex = -1;

    if (query === '') return;

    const matched = geojsonLayer.getSource().getFeatures().filter(feature => {
        const nombre = feature.get('nombre'); // ← Cambiar si tu atributo es distinto
        return nombre && nombre.toLowerCase().includes(query);
    });

    matched.forEach((feature, index) => {
        const nombre = feature.get('nombre');
        const item = document.createElement('div');
        item.textContent = nombre;
        item.dataset.index = index;
        item.addEventListener('click', () => {
            const geometry = feature.getGeometry();
            if (geometry) {
                const extent = geometry.getExtent();
                map.getView().fit(extent, { duration: 1000, padding: [100, 100, 100, 100] });
                searchInput.value = nombre;
                suggestionsContainer.innerHTML = '';
                currentSuggestionIndex = -1;
            }
        });
        suggestionsContainer.appendChild(item);
    });
});

searchInput.addEventListener('keydown', function (e) {
    const items = suggestionsContainer.querySelectorAll('div');
    if (items.length === 0) return;

    if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (currentSuggestionIndex < items.length - 1) {
            currentSuggestionIndex++;
        } else {
            currentSuggestionIndex = 0;
        }
        updateActiveSuggestion(items);
    } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (currentSuggestionIndex > 0) {
            currentSuggestionIndex--;
        } else {
            currentSuggestionIndex = items.length - 1;
        }
        updateActiveSuggestion(items);
    } else if (e.key === 'Enter') {
        e.preventDefault();
        if (currentSuggestionIndex >= 0) {
            items[currentSuggestionIndex].click();
        }
    }
});

function updateActiveSuggestion(items) {
    items.forEach((item, index) => {
        if (index === currentSuggestionIndex) {
            item.style.backgroundColor = '#5e5e5e'; // Activo
        } else {
            item.style.backgroundColor = '#757575'; // Inactivo
        }
    });
}



const input = document.getElementById('searchPlazaInput');
const suggestionsContainer = document.getElementById('searchSuggestions');

let currentIndex = -1;

input.addEventListener('keydown', (e) => {
    const suggestions = suggestionsContainer.querySelectorAll('div');
    if (!suggestions.length) return;

    // Flecha abajo
    if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (currentIndex < suggestions.length - 1) {
            currentIndex++;
            updateHighlight();
        }
    }

    // Flecha arriba
    if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (currentIndex > 0) {
            currentIndex--;
            updateHighlight();
        }
    }

    // Enter
    if (e.key === 'Enter') {
        e.preventDefault();
        if (currentIndex >= 0 && currentIndex < suggestions.length) {
            suggestions[currentIndex].click();
        }
    }
});

function updateHighlight() {
    const suggestions = suggestionsContainer.querySelectorAll('div');
    suggestions.forEach((el, i) => {
        el.classList.toggle('highlighted', i === currentIndex);
    });
}


actualizarCapasVisibles();
});


// 10) SELECCIONAR EL CHECK AL APRETAR EN EL TEXTO 

    const labelCheckTexts = document.querySelectorAll('.label-check-text');

    labelCheckTexts.forEach(function(spanElement) {
        // Cambiar el cursor para indicar que el texto es clickeable
        spanElement.style.cursor = 'pointer';

        spanElement.addEventListener('click', function(event) {
            // Prevenir que el evento de clic en el span también dispare
            // el evento del botón padre si es un <button> y cause un doble toggle.
            event.stopPropagation();

            let checkbox = null;
            // Intentar encontrar el checkbox como hermano anterior
            if (spanElement.previousElementSibling && spanElement.previousElementSibling.type === 'checkbox') {
                checkbox = spanElement.previousElementSibling;
            } 
            // Si no es el hermano anterior, buscarlo dentro del elemento padre (ej. <button class="btn-tipologia">)
            else if (spanElement.parentElement) {
                checkbox = spanElement.parentElement.querySelector('input[type="checkbox"]');
            }

            if (checkbox) {
                checkbox.checked = !checkbox.checked;
                
                // Es importante disparar el evento 'change' manualmente
                // para que cualquier otro código que escuche cambios en el checkbox se ejecute.
                const changeEvent = new Event('change', { bubbles: true });
                checkbox.dispatchEvent(changeEvent);
            }
        });
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
        'togglePlazasBtn',                      // ID del botón que contiene el ojo
        'redPlazasIcon',                        // ID del ícono del ojo
        geojsonLayer,                           // La capa que controla este botón
        'plazasToggleIcon',                     // ID del icono de la categoría padre
        'bi-tree-fill',                         // Clase CSS para el estado "activo" del padre
        actualizarEstadoPadreEspaciosUrbanos    // La función que se debe ejecutar cuando este hijo cambie
    ),
    setupLayerToggleWithEye(
        'toggleCentrosComercialesBtn',      // ID del nuevo botón que crearás en el HTML
        'redCentrosComercialesIcon',        // ID del ícono del ojo para la nueva capa
        centrosComercialesLayer,            // La nueva capa que acabamos de crear
        'plazasToggleIcon',                 // El ícono padre sigue siendo el árbol
        'bi-tree-fill',
        actualizarEstadoPadreEspaciosUrbanos // La función de actualización es la misma
    ),
    setupLayerToggleWithEye(
        'toggleTotem3FBtn',                 // ID del botón en el HTML
        'totem3FIcon',                      // ID del ícono del ojo
        totem3FLayer,                       // La nueva variable de capa
        'plazasToggleIcon',                 // Icono de la categoría padre
        'bi-tree-fill',
        actualizarEstadoPadreEspaciosUrbanos // La misma función de actualización
    )
    // PARA AÑADIR UN FUTURO HIJO:
    // Simplemente agrega una coma y otra llamada a setupLayerToggleWithEye aquí. Ejemplo:
    // ,
    // setupLayerToggleWithEye(
    //     'idDelNuevoBoton',
    //     'idDelNuevoIconoOjo',
    //     nuevaCapa,
    //     'plazasToggleIcon',
    //     'bi-tree-fill',
    //     actualizarEstadoPadreEspaciosUrbanos
    // )
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

    // Finalmente, actualizamos el estado del ícono padre
    actualizarEstadoPadreEspaciosUrbanos();
});

// 5. Llamada inicial para que los íconos reflejen el estado correcto al cargar la página
actualizarEstadoPadreEspaciosUrbanos();



// Filtros Espacios Urbanos
function applyEspaciosUrbanosFilters() {
    const tipologiaCB = document.querySelectorAll(".category-filter");
    const higieneCB = document.querySelectorAll(".plazasmanthigiene-filter");
    const equipCB = document.querySelectorAll(".plazasmantequip-filter");
    const cestosCB = document.querySelectorAll(".plazascestos-filter");

    const valsTip = Array.from(tipologiaCB).filter(cb => cb.checked).map(cb => cb.value);
    const valsHig = Array.from(higieneCB).filter(cb => cb.checked).map(cb => cb.value);
    const valsEqu = Array.from(equipCB).filter(cb => cb.checked).map(cb => cb.value);
    const valsCes = Array.from(cestosCB).filter(cb => cb.checked).map(cb => cb.value);
    geojsonLayer.getSource().getFeatures().forEach(feature => {
        const cat = feature.get("Categoría"), hig = feature.get("Mant Higiene"), equ = feature.get("Mant Equip"), ces = feature.get("Cestos");
        const mCat = valsTip.length > 0 && (valsTip.includes(cat) || (cat == null && valsTip.includes("null")));
        const mHig = valsHig.length > 0 && (valsHig.includes(hig) || (hig == null && valsHig.includes("null")));
        const mEqu = valsEqu.length > 0 && (valsEqu.includes(equ) || (equ == null && valsEqu.includes("null")));
        const mCes = valsCes.length > 0 && (valsCes.includes(ces) || (ces == null && valsCes.includes("null")));
        feature.setStyle((mCat && mHig && mEqu && mCes) ? null :
            new ol.style.Style({
                fill: new ol.style.Fill({ color: "rgba(0,0,0,0)" }),
                stroke: new ol.style.Stroke({ color: "rgba(0,0,0,0)" })
            })
        );
    });
    actualizarResumenDeFiltros();
}

// Mapa de filtros para la lógica de "Seleccionar Todos" y "Aislar".
const selectAllMap = {
    'category-filter': 'espaciosUrbanosSelectAll',
    'plazasmanthigiene-filter': 'espaciosUrbanosSelectAll2',
    'plazasmantequip-filter': 'espaciosUrbanosSelectAll3',
    'plazascestos-filter': 'espaciosUrbanosSelectAll4'
};

// Mapa para relacionar filtros con sus íconos de círculo.
const filterIconMap = {
    'category-filter': 'CircleTipologia',
    'plazasmanthigiene-filter': 'CircleManthigiene',
    'plazasmantequip-filter': 'CircleMantequip',
    'plazascestos-filter': 'CircleCestos'
};

// --- LÓGICA DE FILTROS RESUMIDA ---

// Función para actualizar los íconos de círculo (la moví aquí para tener todo junto)
function actualizarEstadoIconoCirculo(grupoCheckboxesSelector, iconoId) {
    const checkboxes = document.querySelectorAll(grupoCheckboxesSelector);
    const icono = document.getElementById(iconoId);
    if (!icono || checkboxes.length === 0) return;

    const total = checkboxes.length;
    const marcados = Array.from(checkboxes).filter(cb => cb.checked).length;

    icono.classList.toggle('bi-circle-fill', marcados === total);
    icono.classList.toggle('bi-circle', marcados !== total);
}


// 1. Listener ÚNICO para TODOS los checkboxes de filtros.
document.querySelectorAll('.category-filter, .plazasmanthigiene-filter, .plazasmantequip-filter, .plazascestos-filter')
    .forEach(cb => {
        cb.addEventListener('change', () => {
            // Siempre se aplican los filtros al mapa.
            applyEspaciosUrbanosFilters();
            
            // Se busca a qué grupo pertenece y se actualiza solo su ícono de círculo.
            const groupClass = Array.from(cb.classList).find(c => c.endsWith('-filter'));
            if (filterIconMap[groupClass]) {
                actualizarEstadoIcono(`.${groupClass}`, filterIconMap[groupClass]);
            }
        });
    });

// Bucle ÚNICO para TODOS los "Seleccionar Todos".
for (const [filterClass, selectAllId] of Object.entries(selectAllMap)) {
    const selectAllCheckbox = document.getElementById(selectAllId);
    if (selectAllCheckbox) {
        selectAllCheckbox.addEventListener('change', function() {
            document.querySelectorAll(`.${filterClass}`).forEach(cb => {
                cb.checked = this.checked;
            });
            applyEspaciosUrbanosFilters();
            if (filterIconMap[filterClass]) {
                actualizarEstadoIcono(`.${filterClass}`, filterIconMap[filterClass]);
            }
        });
    }
}

// 3. Listener ÚNICO para TODOS los botones "Aislar".
document.querySelectorAll('.select-only-btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
        e.preventDefault(); // <-- AÑADE ESTA LÍNEA PARA PREVENIR EL DOBLE COMPORTAMIENTO
        e.stopPropagation();
        const groupClass = this.dataset.group;
        const onlyValue  = this.dataset.value;

        // Desmarcar "Seleccionar Todos"
        const selectAllId = selectAllMap[groupClass];
        if (selectAllId) {
            const selectAllCb = document.getElementById(selectAllId);
            if (selectAllCb) selectAllCb.checked = false;
        }

        // Marcar solo la opción clicada.
        document.querySelectorAll(`.${groupClass}`).forEach(cb => {
            cb.checked = (cb.value === onlyValue);
        });

        // Aplicar filtros y actualizar el ícono de círculo.
        applyEspaciosUrbanosFilters();
        if (filterIconMap[groupClass]) {
            actualizarEstadoIcono(`.${groupClass}`, filterIconMap[groupClass]);
        }
    });
});

// Define los estilos para las geometrías en el mapa
const normalStyle = new ol.style.Style({ fill:new ol.style.Fill({color:'rgba(55,74,39,0.8)'}), stroke:new ol.style.Stroke({color:'rgba(55,74,39)',width:2}) });
const highlightStyle = new ol.style.Style({ fill:new ol.style.Fill({color:'rgba(128,128,128,0.6)'}), stroke:new ol.style.Stroke({color:'#666',width:2}) });
applyEspaciosUrbanosFilters();

    map.on('pointermove', function(evt){
        map.getViewport().style.cursor = map.hasFeatureAtPixel(evt.pixel) ? 'pointer' : '';
    });

// BUSCADOR PLAZAS
    const searchInput = document.getElementById('searchPlazaInput');
    const suggestionsContainer = document.getElementById('searchSuggestions');
    let currentSuggestions = [];
    let selectedSuggestionIndex = -1;

    searchInput.addEventListener('input', function () {
        const query = this.value.trim().toLowerCase();
        suggestionsContainer.innerHTML = '';
        currentSuggestions = [];
        selectedSuggestionIndex = -1;

        if (query.length < 2) {
            suggestionsContainer.style.display = 'none';
            return;
        }

        const matching = geojsonLayer.getSource().getFeatures().filter(feature => {
            const name = (feature.get('nombre') || '').toLowerCase();
            return name.includes(query);
        });

        if (matching.length === 0) {
            suggestionsContainer.style.display = 'none';
            return;
        }

        matching.forEach((feature, index) => {
            const name = feature.get('nombre') || 'Sin nombre';
            const div = document.createElement('div');
            div.textContent = name;
            div.style.padding = '6px';
            div.style.cursor = 'pointer';
            div.style.borderBottom = '1px solid #eee';

            div.addEventListener('mouseenter', () => {
                highlightSuggestion(index);
            });

            div.addEventListener('mouseleave', () => {
                unhighlightSuggestion(index);
            });

            div.addEventListener('click', function () {
                selectSuggestion(index);
            });

            suggestionsContainer.appendChild(div);
            currentSuggestions.push({ feature, element: div });
        });

        suggestionsContainer.style.display = 'block';
    });

    function highlightSuggestion(index) {
        currentSuggestions.forEach((s, i) => {
            s.element.style.background = i === index ? '#f0f0f0' : 'white';
        });
        selectedSuggestionIndex = index;
    }

    function unhighlightSuggestion(index) {
        if (selectedSuggestionIndex !== index) return;
        currentSuggestions[index].element.style.background = 'white';
        selectedSuggestionIndex = -1;
    }

    function selectSuggestion(index) {
        const selected = currentSuggestions[index];
        if (!selected) return;

        const geometry = selected.feature.getGeometry();
        const extent = geometry.getExtent();
        map.getView().fit(extent, { duration: 500, padding: [50, 50, 50, 50] });

        selectedFeature = selected.feature;
        geojsonLayer.changed();

        searchInput.value = selected.feature.get('nombre') || '';
        suggestionsContainer.innerHTML = '';
        suggestionsContainer.style.display = 'none';
        currentSuggestions = [];
        selectedSuggestionIndex = -1;
    }

    // Teclado: navegar con flechas y seleccionar con Enter
    searchInput.addEventListener('keydown', function (e) {
        if (suggestionsContainer.style.display === 'none') return;

        if (e.key === 'ArrowDown') {
            e.preventDefault();
            const next = (selectedSuggestionIndex + 1) % currentSuggestions.length;
            highlightSuggestion(next);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            const prev = (selectedSuggestionIndex - 1 + currentSuggestions.length) % currentSuggestions.length;
            highlightSuggestion(prev);
        } else if (e.key === 'Enter') {
            e.preventDefault();
            if (selectedSuggestionIndex >= 0) {
                selectSuggestion(selectedSuggestionIndex);
            }
        }
    });

    // Cierra si hacés clic fuera
    document.addEventListener('click', function (e) {
        if (!suggestionsContainer.contains(e.target) && e.target !== searchInput) {
            suggestionsContainer.style.display = 'none';
        }
    });






    


    // 4) Actualizar Estado HIGIENE -- PRUEBA VERSIÓN GENERICA
        function actualizarEstadoIcono(grupoCheckboxesSelector, iconoId) {
            const checkboxes = document.querySelectorAll(grupoCheckboxesSelector);
            const icono = document.getElementById(iconoId);

            if (!icono) {
                console.warn(`Icono '${iconoId}' no encontrado.`);
                return;
            }

            if (checkboxes.length === 0) {
                icono.classList.remove('bi-circle-fill');
                icono.classList.add('bi-circle');
                return;
            }

            const total = checkboxes.length;
            const marcados = Array.from(checkboxes).filter(cb => cb.checked).length;

            if (marcados === total) {
                icono.classList.remove('bi-circle');
                icono.classList.add('bi-circle-fill');
            } else {
                icono.classList.remove('bi-circle-fill');
                icono.classList.add('bi-circle');
            }
        }

    // 4) ASIGNAR FUNCIÓN

actualizarEstadoIcono('#tipologiaFilter .category-filter', 'CircleTipologia');
actualizarEstadoIcono('#plazasmanthigieneFilter .plazasmanthigiene-filter', 'CircleManthigiene'); // si tenés ese ID
actualizarEstadoIcono('#plazasmantequipFilter .plazasmantequip-filter', 'CircleMantequip'); // NUEVA
actualizarEstadoIcono('#plazascestosFilter .plazascestos-filter', 'CircleCestos');       // NUEVA


// Asignar para cada grupo

function asignarActualizacionIcono(grupoSelector, iconoId) {
    document.querySelectorAll(grupoSelector).forEach(cb => {
        cb.addEventListener('change', () => {
            actualizarEstadoIcono(grupoSelector, iconoId);
        });
    });
}

asignarActualizacionIcono('.category-filter', 'CircleTipologia');
asignarActualizacionIcono('.plazasmanthigiene-filter', 'CircleManthigiene');
asignarActualizacionIcono('.plazasmantequip-filter', 'CircleMantequip'); // NUEVA
asignarActualizacionIcono('.plazascestos-filter', 'CircleCestos');       // NUEVA


// Subcategorias

// Mostrar/ocultar las subcategorías de "Plazas"
const plazasBtn = document.getElementById('togglePlazasBtn');
const subcategorias = document.querySelector('.plazas-subcategorias');

if (plazasBtn && subcategorias) {
    plazasBtn.addEventListener('click', function (e) {
        const eyeIcon = document.getElementById('redPlazasIcon');
        if (eyeIcon && eyeIcon.contains(e.target)) {
            return;
        }
        e.stopPropagation();

        // <-- AÑADIR ESTA LÍNEA
        this.closest('.plazas-dropdown').classList.toggle('submenu-activo');
        
        const isVisible = subcategorias.classList.contains('show');
        document.querySelectorAll('.plazas-subcategorias.show').forEach(menu => {
            if (menu !== subcategorias) { // Cierra otros menús pero no el actual
                 menu.classList.remove('show');
                 menu.closest('.plazas-dropdown').classList.remove('submenu-activo');
            }
        });
        
        if (!isVisible) {
            subcategorias.classList.add('show');
        } else {
            subcategorias.classList.remove('show');
        }
    });
}


    
//----------------------------- FIN SECCIÓN ESPACIOS URBANOS ---------------------------//



//----------------------------------- SECCIÓN HIGIENE URBANA (CON LÓGICA SIMÉTRICA) ---------------------------------//

let higieneUrbanaToggles = []; // Se declara vacío primero

// 1. FUNCIÓN QUE VERIFICA EL ESTADO DEL PADRE "HIGIENE URBANA"
const actualizarEstadoPadreHigieneUrbana = () => {
    const parentIcon = document.getElementById('higieneurbanaToggleIcon');
    if (!parentIcon) return;

    // Verificamos si ALGUNA de las capas hijas está visible
    const algunaCapaHijaVisible = higieneUrbanaToggles.some(toggle => toggle.layer.getVisible());

    // Si alguna está visible, el padre se prende. Si NINGUNA está visible, se apaga.
    parentIcon.className = algunaCapaHijaVisible ? 'bi bi-trash-fill' : 'bi bi-trash';
};

// 2. SINCRONIZAR LAS DOS CAPAS DE RUTAS
// Hacemos que la visibilidad de la capa diurna SIEMPRE sea igual a la de la nocturna.
// Así, controlando una, controlamos las dos.
if (typeof rutanocturnaLayer !== 'undefined' && typeof rutadiurnaLayer !== 'undefined') {
    rutanocturnaLayer.on('change:visible', function() {
        rutadiurnaLayer.setVisible(rutanocturnaLayer.getVisible());
    });
}

// 3. CONFIGURAMOS LAS CAPAS HIJAS, USANDO LA ESTRUCTURA DE BOTONES
higieneUrbanaToggles = [
    setupLayerToggleWithEye('togglePuntosCriticosBtn', 'puntosCriticosIcon', puntoscriticosLayer, 'higieneurbanaToggleIcon', 'bi bi-trash-fill', actualizarEstadoPadreHigieneUrbana),
    setupLayerToggleWithEye('toggleContenedoresBtn', 'contenedoresIcon', contenedoresLayer, 'higieneurbanaToggleIcon', 'bi bi-trash-fill', actualizarEstadoPadreHigieneUrbana),
    // El botón de rutas controla la capa nocturna, y la diurna la seguirá gracias al sincronizador de arriba.
    setupLayerToggleWithEye('toggleRutasBtn', 'rutasIcon', rutanocturnaLayer, 'higieneurbanaToggleIcon', 'bi bi-trash-fill', actualizarEstadoPadreHigieneUrbana)
];

// 4. MANEJADOR DEL BOTÓN PRINCIPAL "HIGIENE URBANA"
document.getElementById('higieneurbanaToggle').addEventListener('click', function(e) {
    e.stopPropagation();
    const icon = document.getElementById('higieneurbanaToggleIcon');
    const isCurrentlyOn = icon.classList.contains('bi-trash-fill');
    
    // Si está encendido, el click lo apagará a él y a todos sus hijos.
    if (isCurrentlyOn) {
        icon.className = 'bi bi-trash';
        higieneUrbanaToggles.forEach(toggle => {
            if (toggle) {
                toggle.layer.setVisible(false);
                toggle.update();
            }
        });
    }
    // Si está apagado, el click lo prenderá a él y a todos sus hijos.
    else {
        icon.className = 'bi bi-trash-fill';
        higieneUrbanaToggles.forEach(toggle => {
            if (toggle) {
                toggle.layer.setVisible(true);
                toggle.update();
            }
        });
    }
});

// Llamada inicial para que los íconos reflejen el estado inicial de las capas
actualizarEstadoPadreHigieneUrbana();

//--------------------------------- FIN SECCIÓN HIGIENE URBANA -------------------------------//


//----------------------------- SECCIÓN ALUMBRADO ---------------------------------//

// --- LÓGICA DE CAPAS REFACTORIZADA ---
let luminariasToggles = []; 

const actualizarEstadoPadreLuminarias = () => {
    const parentIcon = document.getElementById('alumbradoToggleIcon');
    if (!parentIcon) return;
    const algunaCapaHijaVisible = luminariasToggles.some(toggle => toggle && toggle.layer.getVisible());
    parentIcon.className = algunaCapaHijaVisible ? 'bi bi-lightbulb-fill' : 'bi bi-lightbulb';
};

luminariasToggles = [
    setupLayerToggleWithEye(
        'toggleLuminariasBtn',
        'luminariasLayerIcon',
        censoalumbradoLayer,
        'alumbradoToggleIcon',
        'bi-lightbulb-fill',
        actualizarEstadoPadreLuminarias
    ),
    setupLayerToggleWithEye(
        'toggleZonasAlumbradoBtn',      // <-- ID del nuevo botón
        'zonasAlumbradoIcon',           // <-- ID de su ícono de ojo
        zonasalumbradoLayer,            // <-- La nueva variable de capa
        'alumbradoToggleIcon',
        'bi-lightbulb-fill',
        actualizarEstadoPadreLuminarias
    )
];






document.querySelectorAll('.select-only-btn').forEach(btn => { /* ... El resto de la lógica de "Aislar" y subcategorías sigue igual ... */ });
// Mostrar/ocultar las subcategorías de "Luminarias"
const luminariasBtn = document.getElementById('toggleLuminariasBtn');
const subcategoriasLuminarias = luminariasBtn?.nextElementSibling;

if (luminariasBtn && subcategoriasLuminarias) {
    luminariasBtn.addEventListener('click', function (e) {
        const eyeIcon = document.getElementById('luminariasLayerIcon');
        if (eyeIcon && eyeIcon.contains(e.target)) return;
        e.stopPropagation();

        this.closest('.plazas-dropdown').classList.toggle('submenu-activo');

        const isVisible = subcategoriasLuminarias.classList.contains('show');
        document.querySelectorAll('.plazas-subcategorias.show').forEach(menu => {
            if (menu !== subcategoriasLuminarias) {
                menu.classList.remove('show');
                menu.closest('.plazas-dropdown')?.classList.remove('submenu-activo');
            }
        });

        if (!isVisible) {
            subcategoriasLuminarias.classList.add('show');
        } else {
            subcategoriasLuminarias.classList.remove('show');
        }
    });
}

document.getElementById('alumbradoToggle').addEventListener('click', function(e) {
    e.stopPropagation();
    const icon = document.getElementById('alumbradoToggleIcon');
    const isCurrentlyOn = icon.classList.contains('bi-lightbulb-fill');
    
    luminariasToggles.forEach(toggle => {
        if (toggle) {
            toggle.layer.setVisible(!isCurrentlyOn);
            toggle.update();
        }
    });
    actualizarEstadoPadreLuminarias();
});

actualizarEstadoPadreLuminarias(); // Llamada inicial


function applyAlumbradoFilters() {
    // --- Lógica de filtros existente ---
    const cbTipo = document.querySelectorAll(".alumbradotipo-filter");
    const seleccionados = Array.from(cbTipo).filter(cb => cb.checked).map(cb => cb.value);

    // --- NUEVA LÓGICA ---
    // 1. Leemos el valor del nuevo campo de búsqueda de calle
    const filtroCalleInput = document.getElementById("filtroCalleInput");
    const calleQuery = filtroCalleInput ? filtroCalleInput.value.toLowerCase().trim() : "";

    censoalumbradoLayer.getSource().getFeatures().forEach(f => {
        const tipoPostacion = f.get("POSTACION");
        
        // 2. Obtenemos el nombre de la calle de la luminaria (asegurándonos de que no sea nulo)
        const calleFeature = (f.get("CALLE") || '').toLowerCase();

        // 3. Comparamos si la calle coincide (además del tipo de postación)
        const postacionMatch = seleccionados.includes(tipoPostacion) || (tipoPostacion == null && seleccionados.includes("null"));
        const calleMatch = calleQuery === '' || calleFeature.includes(calleQuery); // La calle coincide si el campo está vacío o si el nombre la incluye

        // La luminaria se muestra solo si AMBAS condiciones son verdaderas
        const mostrar = postacionMatch && calleMatch;

        f.setStyle(mostrar ? null : new ol.style.Style({
            image: new ol.style.Circle({
                radius: 0, // Radio 0 para ocultar el punto
                fill: new ol.style.Fill({ color: 'rgba(0,0,0,0)' })
            })
        }));
    });

    actualizarEstadoIcono(".alumbradotipo-filter", "CircleLuminarias");
    actualizarResumenDeFiltros();
}

// Listener para el nuevo filtro de calle
const filtroCalleInput = document.getElementById("filtroCalleInput");
if (filtroCalleInput) {
    filtroCalleInput.addEventListener("input", applyAlumbradoFilters);
}

document.getElementById("alumbradoSelectAll").addEventListener("change", function () {
    const estado = this.checked;
    document.querySelectorAll(".alumbradotipo-filter").forEach(cb => cb.checked = estado);
    applyAlumbradoFilters();
});

document.querySelectorAll(".select-only-btn").forEach(btn => {
    btn.addEventListener("click", function (e) {
        e.preventDefault();
        e.stopPropagation();
        const grupo = this.dataset.group;
        const valor = this.dataset.value;

        // Desmarcar "Seleccionar todos"
        if (grupo === "alumbradotipo-filter") {
            document.getElementById("alumbradoSelectAll").checked = false;
        }

        document.querySelectorAll(`.${grupo}`).forEach(cb => {
            cb.checked = (cb.value === valor);
        });

        applyAlumbradoFilters();
    });
});

function actualizarEstadoIcono(grupoSelector, iconoId) {
    const checkboxes = document.querySelectorAll(grupoSelector);
    const icono = document.getElementById(iconoId);
    if (!icono || checkboxes.length === 0) return;

    const total = checkboxes.length;
    const marcados = Array.from(checkboxes).filter(cb => cb.checked).length;

    icono.classList.toggle("bi-circle-fill", marcados === total);
    icono.classList.toggle("bi-circle", marcados !== total);
}

document.querySelectorAll(".alumbradotipo-filter").forEach(cb => {
    cb.addEventListener("change", () => {
        applyAlumbradoFilters();
    });
});

//----------------------------- FIN SECCIÓN ALUMBRADO ---------------------------//


//----------------------------------- SECCIÓN RED HÍDRICA / SUMIDEROS (CON CONTROLES MIXTOS) ---------------------------------//

// --- Función Auxiliar para los nuevos controles tipo Checkbox ---
function setupCheckboxToggle(checkboxId, layer, updateCallbacks) {
    const checkbox = document.getElementById(checkboxId);
    if (!checkbox || !layer) return { layer, checkbox: null };

    // Sincronizar la capa cuando el checkbox cambia
    checkbox.addEventListener('change', () => {
        layer.setVisible(checkbox.checked);
        if(typeof updateCallbacks === 'function') updateCallbacks();
    });

    // Sincronizar el checkbox cuando la capa cambia (por un control maestro)
    layer.on('change:visible', () => {
        checkbox.checked = layer.getVisible();
        // No es necesario cambiar la clase del icono aquí; el CSS lo hará automáticamente.
    });

    // Estado inicial
    layer.setVisible(checkbox.checked);
    return { layer, checkbox };
}

// --- El resto de la lógica adaptada ---

let sumiderosToggles = [];
let redPluvialHijos = [];
const redPluvialBtnIcon = document.getElementById('redPluvialIcon');

const actualizarIconoRedPluvial = () => {
    if (!redPluvialBtnIcon) return;
    const algunoEncendido = redPluvialHijos.some(h => h.layer.getVisible());
    redPluvialBtnIcon.className = algunoEncendido ? 'bi bi-eye-fill' : 'bi bi-eye-slash';
};

const actualizarEstadoAbueloSumideros = () => {
    const abueloIcon = document.getElementById('sumiderosToggleIcon');
    if (!abueloIcon) return;
    
    const hijosDirectosVisibles = sumiderosToggles.some(h => h.layer.getVisible());
    const subcategoriaVisible = redPluvialHijos.some(h => h.layer.getVisible());
    
    abueloIcon.className = (hijosDirectosVisibles || subcategoriaVisible) ? 'bi bi-droplet-fill' : 'bi bi-droplet';
};

const chainedCallback = () => {
    actualizarIconoRedPluvial();
    actualizarEstadoAbueloSumideros();
};

// --- Configuración de los botones y checkboxes ---

sumiderosToggles = [
    setupLayerToggleWithEye('toggleSumiderosCapaBtn', 'sumiderosCapaIcon', sumiderosLayer, null, null, actualizarEstadoAbueloSumideros),
    setupLayerToggleWithEye('toggleZonasInundablesBtn', 'zonasInundablesIcon', zonasinundablesLayer, null, null, actualizarEstadoAbueloSumideros)
];

redPluvialHijos = [
    setupCheckboxToggle('toggleRed100Check', red100Layer, chainedCallback),
    setupCheckboxToggle('toggleRed80Check', red80Layer, chainedCallback)
];

// --- Event Listeners para los botones MAESTROS ---

// Listener para el BOTÓN principal "Red Pluvial" (el que tiene el chevron y el ojo resumen)
document.getElementById('toggleRedPluvialBtn').addEventListener('click', function(e) {
    const eyeIcon = document.getElementById('redPluvialIcon');

    // Esta parte maneja el clic en el ÍCONO DEL OJO (para prender/apagar capas)
    if (eyeIcon && eyeIcon.contains(e.target)) {
        e.stopPropagation(); // Detiene el evento para no desplegar el menú
        const isCurrentlyOn = eyeIcon.classList.contains('bi-eye-fill');
        redPluvialHijos.forEach(hijo => {
            if (hijo.checkbox) {
                hijo.checkbox.checked = !isCurrentlyOn;
                hijo.checkbox.dispatchEvent(new Event('change'));
            }
        });
        return; // Termina la ejecución aquí
    }

    // Esta parte maneja el clic en el RESTO DEL BOTÓN (para desplegar el menú)
    e.stopPropagation();

    // La línea clave que activa la animación del chevron
    this.closest('.plazas-dropdown').classList.toggle('submenu-activo');

    // El código que muestra u oculta las opciones de "Red 100" y "Red 80"
    const subcategorias = this.closest('.dropdown').querySelector('.plazas-subcategorias');
    if (subcategorias) {
        subcategorias.classList.toggle('show');
    }
});

// Listener para el OJO principal de "Red Hídrica" (el abuelo)
document.getElementById('sumiderosToggle').addEventListener('click', function(e) {
    e.stopPropagation();
    const isCurrentlyOn = this.querySelector('i').classList.contains('bi-droplet-fill');

    // Alternar visibilidad de las capas directas de Sumideros (usando setupLayerToggleWithEye)
    sumiderosToggles.forEach(toggle => {
        if (toggle) { // Asegura que el toggle existe
            toggle.layer.setVisible(!isCurrentlyOn);
            toggle.update(); // Actualiza el icono del ojo del botón
        }
    });
    // Alternar visibilidad de las capas hijas de Red Pluvial (usando setupCheckboxToggle)
    redPluvialHijos.forEach(hijo => {
        if (hijo.checkbox) { // Asegurarse de que el checkbox existe
            hijo.checkbox.checked = !isCurrentlyOn;
            hijo.checkbox.dispatchEvent(new Event('change')); // Dispara el evento change
        }
    });

    chainedCallback(); // Actualiza el icono resumen de "Red Pluvial" y el abuelo "Red Hídrica"
});

// Sincronización inicial al cargar la página
actualizarIconoRedPluvial();
actualizarEstadoAbueloSumideros();


//----------------------------------- FIN SECCIÓN SUMIDEROS ---------------------------------//


// =================================================================
// GESTOR DE CLICS Y POPUPS UNIFICADO (REEMPLAZA TODOS LOS map.on('click'))
// =================================================================
map.on('click', function(evt) {
    // 1. Ocultar todos los popups al inicio de cada clic
    // (Creamos una lista de todos tus objetos popup para manejarlos fácilmente)
    const allPopups = [
        popup, popupAlumbrado, popupComerciales, popupTotems, 
        popupContenedores, popupCriticos, popupRutas, popupZonas
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

    // 4. Calcular el centro del elemento clickeado (será el ancla para TODOS los popups)
    const featureCenter = ol.extent.getCenter(clickedFeature.getGeometry().getExtent());
    
    // 5. Mostrar el popup correspondiente según la capa
    let popupToShow = null;
    let contentElementId = '';
    let htmlContent = '';

    // --- Lógica para cada tipo de capa ---

    if (clickedLayer === geojsonLayer) { // Popups de Plazas
        if(clickedFeature !== selectedFeature){
            selectedFeature = clickedFeature;
            geojsonLayer.changed();
        }
        const n = clickedFeature.get("nombre") || "Sin dato";
        const cat = clickedFeature.get("Categoría") || "Sin dato";
        const loc = clickedFeature.get("Localidad") || "Sin dato";
        const id = clickedFeature.get("ID") || "";
        const img = `<img src="images/${id}.jpg" alt="${n}" style="width:100%; max-width:200px; height:auto;">`;
        htmlContent = `<strong>${n}</strong><br>${img}<br><b>ID:</b> ${id}<br><b>Tipología:</b> ${cat}<br><b>Localidad:</b> ${loc}`;
        
        popupToShow = popup;
        contentElementId = 'popup-content';
    } 
    else if (clickedLayer === censoalumbradoLayer) { // Popups de Alumbrado
        const props = clickedFeature.getProperties();
        htmlContent = `<strong>${props.POSTACION || "Sin dato"}</strong><br>
            <b>ID:</b> ${props.ID || ""}<br>
            <b>Tipo de lampara:</b> ${props['TIPO DE LAMPARA'] || ""}<br>
            <b>Postación:</b> ${props['POSTACION'] || ""}<br>
            <b>Dirección:</b> ${props['DIRECCION RESUMIDA'] || "Sin dato"}`;
            
        
        popupToShow = popupAlumbrado;
        contentElementId = 'popup-alumbrado-content';
    }
    else if (clickedLayer === centrosComercialesLayer) { // Popups de Centros Comerciales
        htmlContent = `<strong>Centro Comercial:</strong><br>${clickedFeature.get('name') || "Sin Nombre"}`;
        popupToShow = popupComerciales;
        contentElementId = 'popup-comerciales-content';
    }
    else if (clickedLayer === totem3FLayer) { // Popups de Tótems
        htmlContent = `<strong>Totem 3F:</strong><br>${clickedFeature.get('name') || "Información no disponible"}`;
        popupToShow = popupTotems;
        contentElementId = 'popup-totems-content';
    }
    else if (clickedLayer === contenedoresLayer) { // Popups de Contenedores
        htmlContent = `<strong>Contenedor</strong><br>Ubicación: ${clickedFeature.get('Nombre') || "Sin ubicación"}`;
        popupToShow = popupContenedores;
        contentElementId = 'popup-contenedores-content';
    }
    else if (clickedLayer === puntoscriticosLayer) { // Popups de Puntos Críticos
        htmlContent = `<strong>Punto Crítico</strong><br>Ubicación: ${clickedFeature.get('Dirección') || "Sin ubicación"}`;
        popupToShow = popupCriticos;
        contentElementId = 'popup-criticos-content';
    }
    else if (clickedLayer === rutanocturnaLayer || clickedLayer === rutadiurnaLayer) { // Popups de Rutas
        const tipoRuta = (clickedLayer === rutanocturnaLayer) ? "Nocturna" : "Diurna";
        htmlContent = `<strong>Ruta</strong><br>${clickedFeature.get('name') || "Sin nombre"}`;
        popupToShow = popupRutas;
        contentElementId = 'popup-rutas-content';
    }
    else if (clickedLayer === zonasalumbradoLayer) { // Popups de Zonas de Alumbrado
        htmlContent = `<strong>Zona:</strong> ${clickedFeature.get('name') || "Sin Nombre"}`;
        popupToShow = popupZonas;
        contentElementId = 'popup-zonas-content';
    }

    // 6. Si se encontró un popup para mostrar, se le asigna el contenido y la posición
    if (popupToShow) {
        document.getElementById(contentElementId).innerHTML = htmlContent;
        popupToShow.setPosition(featureCenter); // <-- ¡LA MAGIA OCURRE AQUÍ!
    }
});
// =================================================================
// FIN GESTOR DE CLICS Y POPUPS UNIFICADO (REEMPLAZA TODOS LOS map.on('click'))
// =================================================================


});

// =================================================================
// FUNCIÓN CENTRAL PARA ACTUALIZAR EL RESUMEN DE FILTROS ACTIVOS
// =================================================================
function actualizarResumenDeFiltros() {
    // Estas dos líneas se mantienen igual
    const contenedor = document.getElementById("filtros-activos");
    const textoContenedor = document.getElementById("texto-filtros-activos");
    const todosLosResumenes = [];

    // --- Revisa filtros de ESPACIOS URBANOS --- (Esta parte no cambia)
    const tipologiaCB = document.querySelectorAll(".category-filter:checked");
    if (tipologiaCB.length > 0 && tipologiaCB.length < document.querySelectorAll(".category-filter").length) {
        todosLosResumenes.push("Tipología: " + Array.from(tipologiaCB).map(cb => cb.value).join(", "));
    }
    const higieneCB = document.querySelectorAll(".plazasmanthigiene-filter:checked");
    if (higieneCB.length > 0 && higieneCB.length < document.querySelectorAll(".plazasmanthigiene-filter").length) {
        todosLosResumenes.push("Mant. Higiene: " + Array.from(higieneCB).map(cb => cb.value).join(", "));
    }
    const equipCB = document.querySelectorAll(".plazasmantequip-filter:checked");
    if (equipCB.length > 0 && equipCB.length < document.querySelectorAll(".plazasmantequip-filter").length) {
        todosLosResumenes.push("Mant. Equip.: " + Array.from(equipCB).map(cb => cb.value).join(", "));
    }
    const cestosCB = document.querySelectorAll(".plazascestos-filter:checked");
    if (cestosCB.length > 0 && cestosCB.length < document.querySelectorAll(".plazascestos-filter").length) {
        todosLosResumenes.push("Cestos: " + Array.from(cestosCB).map(cb => cb.value).join(", "));
    }


    // --- Actualiza el cuadro de texto PERO SIN ALTERAR SU VISIBILIDAD ---
    if (todosLosResumenes.length > 0) {
        textoContenedor.innerHTML = "<br>" + todosLosResumenes.join("<br>");
        // SE ELIMINÓ la línea: contenedor.classList.add('visible');
    } else {
        textoContenedor.textContent = "Ninguno";
        // SE ELIMINÓ la línea: contenedor.classList.remove('visible');
    }
}

function actualizarCapasVisibles() {
    const texto = document.getElementById("texto-filtros-activos");
    if (!texto) return;

    const capasVisibles = [];

    const listaCapas = [
        { layer: geojsonLayer, nombre: "Espacios Verdes" },
        { layer: censoalumbradoLayer, nombre: "Luminarias" },
        { layer: ejesestructurantesLayer, nombre: "Ejes Estructurantes" },
        { layer: ejessecundariosLayer, nombre: "Ejes Secundarios" },
        { layer: puntoscriticosLayer, nombre: "Puntos Críticos" },
        { layer: contenedoresLayer, nombre: "Contenedores" },
        { layer: rutanocturnaLayer, nombre: "Ruta Nocturna" },
        { layer: rutadiurnaLayer, nombre: "Ruta Diurna" },
        { layer: centrosComercialesLayer, nombre: "Centros Comerciales" },
        { layer: totem3FLayer, nombre: "Totem 3F" },
        { layer: zonasalumbradoLayer, nombre: "Zonas de Alumbrado" }
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
