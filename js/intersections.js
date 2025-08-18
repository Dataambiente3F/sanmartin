document.addEventListener("DOMContentLoaded", function() {
    // Espera a que el HTML esté completamente cargado

    // Referencias a los elementos del buscador en el HTML
    const calle1Input = document.getElementById('calle1Input');
    const calle2Input = document.getElementById('calle2Input');
    const buscarBtn = document.getElementById('buscarInterseccionBtn');
    const resultDiv = document.getElementById('intersectionResult');

    // Verifica si los elementos y los datos existen antes de continuar
    if (!calle1Input || !calle2Input || !buscarBtn || !resultDiv) {
        // Si estás usando el buscador unificado, este error es normal y puedes ignorarlo.
        // console.error("No se encontraron los elementos del buscador de intersecciones en el HTML.");
        return;
    }

    if (typeof json_intersecciones_0 === 'undefined') {
        console.error("Los datos 'json_intersecciones_0' no están definidos. Asegúrate de que 'layers/intersecciones.js' se cargue correctamente.");
        resultDiv.textContent = "Error: Faltan datos de calles.";
        return;
    }

    // Convertimos el GeoJSON a 'features' de OpenLayers para buscar más eficientemente.
    const sourceIntersecciones = new ol.source.Vector({
        features: new ol.format.GeoJSON().readFeatures(json_intersecciones_0, {
            dataProjection: 'EPSG:4326',
            featureProjection: 'EPSG:3857' // La proyección de tu mapa
        })
    });

    /**
     * Función principal que busca la esquina y actualiza el mapa.
     */
    function buscarEsquina() {
        const calle1 = calle1Input.value.trim().toLowerCase();
        const calle2 = calle2Input.value.trim().toLowerCase();

        // Limpia resultados anteriores
        if (window.searchMarkerLayer) {
            window.searchMarkerLayer.getSource().clear();
        }
        resultDiv.textContent = "";


        if (!calle1 || !calle2) {
            resultDiv.textContent = "Por favor, ingresá ambas calles.";
            return;
        }

        // Buscamos en todas las 'features' de nuestro archivo
        const encontrada = sourceIntersecciones.getFeatures().find(feature => {
            const props = feature.getProperties();
            const nombreCal1 = (props.nombre_cal || '').toLowerCase();
            const nombreCal2 = (props.nombre_cal_2 || '').toLowerCase();

            // Comprueba la coincidencia en ambos órdenes
            return (nombreCal1 === calle1 && nombreCal2 === calle2) || 
                   (nombreCal1 === calle2 && nombreCal2 === calle1);
        });

        if (encontrada) {
            const coordinates = encontrada.getGeometry().getCoordinates();

            // Usamos window.map porque está definido globalmente en map.js
            window.map.getView().animate({
                center: coordinates,
                zoom: 18,
                duration: 1000 // Animación de 1 segundo
            });

            // Reutilizamos la capa de marcador de tu buscador de direcciones para mostrar un punto
            if (window.searchMarkerLayer) {
                const markerSource = window.searchMarkerLayer.getSource();
                markerSource.clear(); // Limpiamos marcadores anteriores
                const marker = new ol.Feature(new ol.geom.Point(coordinates));
                markerSource.addFeature(marker);
            }

            resultDiv.innerHTML = `<span style="color: #a5d6a7;">¡Intersección encontrada!</span>`;

        } else {
            resultDiv.innerHTML = `<span style="color: #ef9a9a;">Esa intersección no existe.</span>`;
        }
    }

    // Asignamos la función al clic del botón
    buscarBtn.addEventListener('click', buscarEsquina);

    // Permitimos buscar presionando "Enter" en cualquiera de los campos
    calle1Input.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            buscarEsquina();
        }
    });

    calle2Input.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            buscarEsquina();
        }
    });
});
