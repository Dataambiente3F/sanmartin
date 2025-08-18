document.addEventListener("DOMContentLoaded", function() {

    // --- REFERENCIAS Y GUARDIA DE SEGURIDAD ---
    const searchInput = document.getElementById('unifiedSearchInput');
    if (!searchInput) {
        console.log("Buscador unificado no encontrado en esta página. El script no se ejecutará.");
        return;
    }
    const searchBtn = document.getElementById('unifiedSearchBtn');
    const errorDiv = document.getElementById('searchErrorResult');
    const suggestionsDiv = document.getElementById('suggestionResults');

    // --- PREPARACIÓN DE FUENTES DE DATOS ---
    const interseccionesSource = new ol.source.Vector({
        features: new ol.format.GeoJSON().readFeatures(json_intersecciones_0, { dataProjection: 'EPSG:4326', featureProjection: 'EPSG:3857' })
    });

    const callejeroSource = new ol.source.Vector({
        features: new ol.format.GeoJSON().readFeatures(json_callejero_normalizado_0, { dataProjection: 'EPSG:4326', featureProjection: 'EPSG:3857' })
    });
    
    const highlightLayer = new ol.layer.Vector({
        source: new ol.source.Vector(),
        style: new ol.style.Style({ stroke: new ol.style.Stroke({ color: '#00FFFF', width: 6 }) }),
        zIndex: 1002
    });
    window.map.addLayer(highlightLayer);

    // --- LISTA MAESTRA DE CALLES PARA AUTOCOMPLETADO ---
    const masterStreetList = [...new Set(callejeroSource.getFeatures().map(f => f.get('nombre_cal')))].sort();
    let selectedSuggestionIndex = -1;
    let currentSuggestions = [];

    // --- LÓGICA DEL BUSCADOR INTELIGENTE ---
    function smartSearch() {
        clearResults();
        suggestionsDiv.style.display = 'none';
        const query = searchInput.value.trim().toLowerCase();
        if (!query) return;

        if (/\d/.test(query)) {
            const match = query.match(/^(.*[a-zA-Z])\s+(\d+)$/);
            if (match) {
                searchAddress(match[1].trim(), parseInt(match[2], 10));
            } else {
                showError("Formato de dirección no válido. Use 'Calle 1234'.");
            }
        } else if (query.includes(' y ') || query.includes(' e ') || query.includes(',')) {
            const separator = / y | e |,/;
            const calles = query.split(separator);
            if (calles.length === 2) {
                searchIntersection(calles[0].trim(), calles[1].trim());
            } else {
                showError("Formato de intersección no válido. Use 'Calle y Calle'.");
            }
        } else {
            showError("Especifique altura o intersección.");
        }
    }

function expandirRango(numero) {
    if (numero < 50) {
        return [0, 50];
    } else if (numero < 100) {
        return [0, 100];
    } else {
        const base = Math.floor(numero / 100) * 100;
        return [base, base + 100];
    }
}


    // --- LÓGICA DE AUTOCOMPLETADO ---
function handleAutocomplete() {
    const fullQuery = searchInput.value;
    const separator = / y | e |,/;
    const parts = fullQuery.split(separator);
    const currentPart = parts[parts.length - 1].trim().toLowerCase();

    if (currentPart.length < 2) {
        suggestionsDiv.style.display = 'none';
        return;
    }

    let suggestions = [];

    if (parts.length === 2) {
        // Buscar solo calles que intersectan con la primera
        const callePrincipal = parts[0].trim();
        const callesIntersecan = getIntersectingStreets(callePrincipal);
        suggestions = callesIntersecan.filter(street => 
            street && street.toLowerCase().includes(currentPart)
        );
    } else {
        // Autocompletado normal de la primera calle
        suggestions = masterStreetList.filter(street => 
            street && street.toLowerCase().includes(currentPart)
        );
    }

    const prefix = parts.length > 1 ? fullQuery.substring(0, fullQuery.lastIndexOf(parts[parts.length - 1])) : '';
    displaySuggestions(suggestions, prefix);
}

function displaySuggestions(suggestions, prefix) {
    currentSuggestions = suggestions;
    selectedSuggestionIndex = -1;

    suggestionsDiv.innerHTML = '';
    if (suggestions.length === 0) {
        suggestionsDiv.style.display = 'none';
        return;
    }

    suggestions.slice(0, 10).forEach((suggestion, index) => {
        const item = document.createElement('div');
        item.textContent = suggestion;
        item.classList.add('autocomplete-item');
        item.dataset.index = index;

        item.addEventListener('click', () => {
            searchInput.value = prefix + suggestion + ' ';
            suggestionsDiv.style.display = 'none';
            searchInput.focus();
        });

        suggestionsDiv.appendChild(item);
    });
    suggestionsDiv.style.display = 'block';
}

function updateActiveSuggestion(items) {
    items.forEach((item, index) => {
        if (index === selectedSuggestionIndex) {
            item.classList.add('active');
            item.scrollIntoView({ block: 'nearest' });
        } else {
            item.classList.remove('active');
        }
    });
}


    // --- FUNCIONES DE BÚSQUEDA Y AUXILIARES ---
function searchAddress(calle, numero) {
    const calleNormalizada = calle.normalize("NFD").replace(/[\u0300-\u036f]/g, '').toLowerCase();
    const [rangoMin, rangoMax] = expandirRango(numero);

    const tramos = callejeroSource.getFeatures().filter(feature => {
        const nombreCal = (feature.get('nombre_cal') || '');
        const nombreCalNormalizado = nombreCal.normalize("NFD").replace(/[\u0300-\u036f]/g, '').toLowerCase();
        return nombreCalNormalizado === calleNormalizada;
    });

    const tramoConAltura = tramos.find(feature => {
        const props = feature.getProperties();

        const alt_ini_pa = props.alt_ini_pa ?? props.alt_ini_par_n;
        const alt_fin_pa = props.alt_fin_pa ?? props.alt_fin_par_n;
        const alt_ini_im = props.alt_ini_im ?? props.alt_ini_impar_n;
        const alt_fin_im = props.alt_fin_im ?? props.alt_fin_impar_n;

        const matchPar = alt_ini_pa != null && alt_fin_pa != null &&
            (rangoMin <= Math.max(alt_ini_pa, alt_fin_pa) && rangoMax >= Math.min(alt_ini_pa, alt_fin_pa));

        const matchImpar = alt_ini_im != null && alt_fin_im != null &&
            (rangoMin <= Math.max(alt_ini_im, alt_fin_im) && rangoMax >= Math.min(alt_ini_im, alt_fin_im));

        return matchPar || matchImpar;
    });

    if (tramoConAltura) {
        highlightLayer.getSource().addFeature(tramoConAltura);
        window.map.getView().fit(tramoConAltura.getGeometry().getExtent(), {
            duration: 1000,
            padding: [100, 100, 100, 100],
            maxZoom: 18
        });
    } else {
        showError(`No se encontró la altura ${numero} en la calle ${calle}.`);
    }
}

function searchIntersection(calle1, calle2) {
        const encontrada = interseccionesSource.getFeatures().find(feature => {
            const props = feature.getProperties();
            const nombreCal1 = (props.nombre_cal || '').toLowerCase();
            const nombreCal2 = (props.nombre_cal_2 || '').toLowerCase();
            return (nombreCal1 === calle1 && nombreCal2 === calle2) || (nombreCal1 === calle2 && nombreCal2 === calle1);
        });
        if (encontrada) {
            const coordinates = encontrada.getGeometry().getCoordinates();
            window.map.getView().animate({ center: coordinates, zoom: 18, duration: 1000 });
            if (window.searchMarkerLayer) {
                window.searchMarkerLayer.getSource().addFeature(new ol.Feature(new ol.geom.Point(coordinates)));
            }
        } else {
            showError(`No se encontró la intersección de ${calle1} y ${calle2}.`);
        }
    }
    
    function clearResults() {
        if (window.searchMarkerLayer) window.searchMarkerLayer.getSource().clear();
        highlightLayer.getSource().clear();
        errorDiv.style.display = 'none';
    }

    function showError(message) {
        errorDiv.textContent = message;
        errorDiv.style.display = 'block';
    }

function getIntersectingStreets(nombreCalle) {
    const nombreNormalizado = nombreCalle.normalize("NFD").replace(/[\u0300-\u036f]/g, '').toLowerCase();
    const intersecting = new Set();

    interseccionesSource.getFeatures().forEach(feature => {
        const props = feature.getProperties();
        const cal1 = (props.nombre_cal || '').normalize("NFD").replace(/[\u0300-\u036f]/g, '').toLowerCase();
        const cal2 = (props.nombre_cal_2 || '').normalize("NFD").replace(/[\u0300-\u036f]/g, '').toLowerCase();

        if (cal1 === nombreNormalizado) intersecting.add(props.nombre_cal_2);
        if (cal2 === nombreNormalizado) intersecting.add(props.nombre_cal);
    });

    return Array.from(intersecting).sort();
}


    // --- EVENTOS ---
    
// Solo intenta agregar el 'click' si el botón realmente existe
if (searchBtn) {
    searchBtn.addEventListener('click', smartSearch);
}

searchInput.addEventListener('keydown', (e) => {
    const items = suggestionsDiv.querySelectorAll('.autocomplete-item');

    if (e.key === 'Enter') {
        if (suggestionsDiv.style.display === 'block' && selectedSuggestionIndex >= 0) {
            items[selectedSuggestionIndex].click();
            e.preventDefault();
        } else {
            smartSearch();
        }
    } else if (e.key === 'ArrowDown') {
        if (items.length > 0) {
            selectedSuggestionIndex = (selectedSuggestionIndex + 1) % items.length;
            updateActiveSuggestion(items);
            e.preventDefault();
        }
    } else if (e.key === 'ArrowUp') {
        if (items.length > 0) {
            selectedSuggestionIndex = (selectedSuggestionIndex - 1 + items.length) % items.length;
            updateActiveSuggestion(items);
            e.preventDefault();
        }
    }
});

searchInput.addEventListener('input', handleAutocomplete);

document.addEventListener('click', (e) => { 
    if (e.target !== searchInput) {
        suggestionsDiv.style.display = 'none';
    }
});

});