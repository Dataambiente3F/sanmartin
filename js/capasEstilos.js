        window.selectedFeature = null;
    
    // 3) Carga de capas y mapa
    window.baseLayer = new ol.layer.Tile({
        source: new ol.source.XYZ({
            url: 'https://{a-c}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
            attributions: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/">CARTO</a>'
        })
    });
    
    // ***** SATELITE *****
    window.satelliteLayer = new ol.layer.Tile({
        source: new ol.source.XYZ({
            // La URL original de la fuente de datos de Esri
            url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
            attributions: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
            maxZoom: 19,
            // Aquí está la magia: usamos una función personalizada para cargar cada recuadro (tile)
            tileLoadFunction: function(imageTile, src) {
                const img = new Image();
                img.crossOrigin = 'Anonymous'; // Necesario para manipular imágenes de otro dominio

                // Cuando la imagen original del satélite se carga...
                img.onload = function() {
                    // Crea un lienzo (canvas) temporal del tamaño del recuadro (tile)
                    const canvas = document.createElement('canvas');
                    canvas.width = this.width;
                    canvas.height = this.height;
                    const ctx = canvas.getContext('2d');

                    // 1. Dibuja la imagen del satélite en el lienzo
                    ctx.drawImage(this, 0, 0);

                    // 2. Dibuja un rectángulo blanco con opacidad encima de la imagen
                    ctx.fillStyle = 'rgba(255, 255, 255, 0.25)'; // <-- ¡Puedes ajustar la opacidad aquí (0.2 es 20%)!
                    ctx.fillRect(0, 0, canvas.width, canvas.height);

                    // 3. Usa este lienzo modificado como la imagen final para el recuadro
                    imageTile.getImage().src = canvas.toDataURL();
                };

                // Le decimos al navegador que cargue la imagen del satélite
                img.src = src;
            }
        }),
        visible: false // La capa sigue empezando oculta, como la tenías
    });

    window.geojsonLayer = new ol.layer.Vector({
        source: new ol.source.Vector({
            features: new ol.format.GeoJSON().readFeatures(json_Plazas_0, {
                dataProjection: 'EPSG:4326',
                featureProjection: 'EPSG:3857'
            })
        }),
        style: function (feature) {
            return feature === selectedFeature ? highlightStyle : normalStyle;
        }
    });

//LOCALIDADES
/**
 * @param {string} text - El texto a ajustar.
 * @param {number} maxLineLength - La cantidad máxima de caracteres por línea.
 * @returns {string} El texto con los saltos de línea ('\n') insertados.
 */
function wrapText(text, maxLineLength) {
    const words = text.split(' ');
    let currentLine = '';
    let result = '';

    for (let i = 0; i < words.length; i++) {
        const word = words[i];
        // Si agregar la nueva palabra excede el largo, hacemos el salto de línea.
        if ((currentLine + word).length > maxLineLength) {
            result += currentLine.trim() + '\n';
            currentLine = '';
        }
        currentLine += word + ' ';
    }
    // Agrega la última línea que quedó en el buffer.
    result += currentLine.trim();
    return result;
}

let mostrarNombresLocalidades = false; 

    window.localidadesLayer = new ol.layer.Vector({
        source: new ol.source.Vector({
            features: new ol.format.GeoJSON().readFeatures(json_Localidades_0, {
                dataProjection: 'EPSG:4326',
                featureProjection: 'EPSG:3857'
            })
        }),
        style: function(feature) {
    const originalName = feature.get('Nombre') || '';

    const maxCharsPerLine = 15;
    const wrappedName = wrapText(originalName, maxCharsPerLine);

    const styleBase = new ol.style.Style({
        stroke: new ol.style.Stroke({
            color: '#ffffff',
            width: 4.5,
        })
    });

    const stylePrincipal = new ol.style.Style({
        stroke: new ol.style.Stroke({
            color: 'rgba(30,30,30,0.8)',
            width: 2.5,
            lineDash: [2.5, 4.5]
        }),
        fill: new ol.style.Fill({
            color: 'rgba(0,0,0,0)'
        }),
        text: mostrarNombresLocalidades ? new ol.style.Text({
            text: wrappedName,
            font: 'bold 10px "Open Sans", "Arial Unicode MS", "sans-serif"',
            fill: new ol.style.Fill({
                color: 'rgba(30,30,30,0.75)'
            }),
            stroke: new ol.style.Stroke({
                color: 'rgba(255, 255, 255, 0.6)',
                width: 3
            }),
            overflow: true
        }) : null // 👈 cuando está apagado, NO dibuja texto
    });

    return [styleBase, stylePrincipal];

        },
        zIndex: 2
    });

// Lógica para el botón "Ver/Ocultar Nombres"

const nombresBtn = document.getElementById('toggleNombresLocalidadesBtn');

if (nombresBtn) {
    nombresBtn.addEventListener('click', function(event) {
        event.stopPropagation(); 

        mostrarNombresLocalidades = !mostrarNombresLocalidades;

        // Cambiar el texto
        this.textContent = mostrarNombresLocalidades ? 'Ocultar Nombres' : 'Ver Nombres';

        // Cambiar estilo
        this.classList.toggle('active', mostrarNombresLocalidades);


        // --- LÍNEA MODIFICADA ---
        // Esto fuerza a la capa a re-evaluar su función de estilo. Es más robusto.
        if (window.localidadesLayer) {
            window.localidadesLayer.setStyle(window.localidadesLayer.getStyle());
        }
    });
}




    window.partidoLayer = new ol.layer.Vector({
        source: new ol.source.Vector({
            features: new ol.format.GeoJSON().readFeatures(json_Limites3F_0, {
                dataProjection: 'EPSG:4326',
                featureProjection: 'EPSG:3857'
            })
        }),
        style: new ol.style.Style({
            stroke: new ol.style.Stroke({ color: 'rgba(30,30,30,0.6)', width: 3.0 }),
            fill: new ol.style.Fill({ color: 'rgba(0,0,0)' })
        }),
        zIndex: 10
    });

    window.ejesestructurantesLayer = new ol.layer.Vector({
    source: new ol.source.Vector({
        features: new ol.format.GeoJSON().readFeatures(json_Ejesestructurantes_0, {
            dataProjection: 'EPSG:4326',
            featureProjection: 'EPSG:3857'
        })
    }),
    style: new ol.style.Style({
    stroke: new ol.style.Stroke({
        color: 'rgba(195, 156, 68, 0.6)',  // 80% de opacidad
        width: 12
    }),
    fill: new ol.style.Fill({ color: 'rgba(107, 156, 68)' })
        })
    });

    window.ejessecundariosLayer = new ol.layer.Vector({
    source: new ol.source.Vector({
        features: new ol.format.GeoJSON().readFeatures(json_Ejessecundarios_0, {
            dataProjection: 'EPSG:4326',
            featureProjection: 'EPSG:3857'
        })
    }),
    style: new ol.style.Style({
    stroke: new ol.style.Stroke({
        color: 'rgba(195, 156, 68, 0.25)',  // 80% de opacidad
        width: 8
    }),
    fill: new ol.style.Fill({ color: 'rgba(195, 156, 68)' })
        })
    });


    

// PATRÓN RAYADO (MÁS JUNTO)
function createHatchPattern(color = '#d4ac0d', background = 'rgba(0,0,0,0)') {
    const canvas = document.createElement('canvas');
    
    // 1. Reducimos el tamaño de la baldosa de 6x6 a 3x3
    const tamaño = 4; 
    canvas.width = tamaño;
    canvas.height = tamaño;
    
    const ctx = canvas.getContext('2d');

    // Fondo transparente
    ctx.fillStyle = background;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 2. Ajustamos las coordenadas del dibujo al nuevo tamaño
    ctx.strokeStyle = color;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, tamaño); // Va de (0,3)
    ctx.lineTo(tamaño, 0); // a (3,0)
    ctx.stroke();

    return ctx.createPattern(canvas, 'repeat');
}
// FIN PATRÓN RAYADO

    window.centrosComercialesLayer = new ol.layer.Vector({
        source: new ol.source.Vector({
            features: new ol.format.GeoJSON().readFeatures(json_CentrosComerciales_0, {
                dataProjection: 'EPSG:4326',
                featureProjection: 'EPSG:3857'
            })
        }),
        style: new ol.style.Style({
        stroke: new ol.style.Stroke({
            color: 'rgba(94, 38, 99, 0.6)',  // 80% de opacidad
            width: 6
        }),
        fill: new ol.style.Fill({ color: 'rgba(107, 156, 68)' })
            })
        });


// Define los estilos para las geometrías en el mapa
const normalStyle = new ol.style.Style({ fill:new ol.style.Fill({color:'rgba(55,74,39,0.8)'}), stroke:new ol.style.Stroke({color:'rgba(55,74,39)',width:2}) });
const highlightStyle = new ol.style.Style({ fill:new ol.style.Fill({color:'rgba(128,128,128,0.6)'}), stroke:new ol.style.Stroke({color:'#666',width:2}) });





//////////////////////////////////////////////////////////////////////////////////////////////////
// FUNCIONES PARA CAPAS DE ELECCIONES
//////////////////////////////////////////////////////////////////////////////////////////////////

const alianzaLLA_JxC = {
    nombre: 'LLA + JxC',
    partidos: ['LA LIBERTAD AVANZA', 'JUNTOS POR EL CAMBIO']
};

// --- Funciones de Estilo y Texto (sin cambios) ---
function obtenerColorParaGanador(ganador) {
    if (ganador === 'LLA + JxC' || ganador === 'LA LIBERTAD AVANZA') {
        return 'rgba(105, 38, 192, 1)'; // Violeta (opacidad base en 1)
    } else if (ganador === 'JUNTOS POR EL CAMBIO') {
        return 'rgba(255, 215, 0, 1)'; // Amarillo (opacidad base en 1)
    } else if (ganador === 'UNION POR LA PATRIA') {
        return 'rgba(38, 169, 192, 1)'; // Celeste (opacidad base en 1)
    } else {
        return 'rgba(128, 128, 128, 1)'; // Gris (opacidad base en 1)
    }
}

function wrapText(text, maxLineLength) {
    if (!text || text.length <= maxLineLength) return text;
    const words = text.split(' ');
    let currentLine = '';
    let result = '';
    for (let i = 0; i < words.length; i++) {
        const word = words[i];
        const lineWithNextWord = currentLine ? currentLine + ' ' + word : word;
        if (lineWithNextWord.length > maxLineLength) {
            result += currentLine + '\n';
            currentLine = word;
        } else {
            currentLine = lineWithNextWord;
        }
    }
    result += currentLine;
    return result;
}


// --- FUNCIÓN PRINCIPAL Y FLEXIBLE CON DIAGNÓSTICO ---

function crearCapaResultados(año, tipoEleccion, cargo, nombreCapa, opciones = {}) {
    const {
        nivelAgregacion,
        alianza = null,
        partidoEspecifico = null
    } = opciones;

    console.log(`%c--- Iniciando diagnóstico para: ${nombreCapa} ---`, 'color: yellow; font-weight: bold;');
    console.log("Modo de operación:", partidoEspecifico ? `Partido Específico (${partidoEspecifico})` : "Ganador General");

    // 1. Filtrar votos
    const datosFiltrados = datosVotos.filter(entry =>
        entry[0] === año &&
        entry[1] === tipoEleccion &&
        entry[2] === cargo &&
        entry[5] === 'POSITIVO'
    );
    console.log("1. Datos de votos filtrados:", datosFiltrados);
    if (datosFiltrados.length === 0) {
        console.error("¡ERROR! No se encontraron votos con los criterios dados.");
    }

// 2. Acumular votos según el modo de operación
    const resultadosPorUnidad = {};

    if (partidoEspecifico) {
        // --- MODO: PARTIDO ESPECÍFICO ---
        datosFiltrados.forEach(entry => {
            const idUnidad = entry[3];
            const agrupacion = entry[4];
            const cantidad = parseInt(entry[6], 10) || 0; // Aseguramos que los votos sean un NÚMERO

            if (!resultadosPorUnidad[idUnidad]) {
                resultadosPorUnidad[idUnidad] = { total: 0, especifico: 0 };
            }
            resultadosPorUnidad[idUnidad].total += cantidad;
            if (agrupacion === partidoEspecifico) {
                resultadosPorUnidad[idUnidad].especifico += cantidad;
            }
        });

    } else {
        // --- MODO: GANADOR (Lógica original) ---
        datosFiltrados.forEach(entry => {
            let agrupacion = entry[4];
            const idUnidad = entry[3];
            const cantidad = entry[6];

            if (alianza && alianza.partidos.includes(agrupacion)) {
                agrupacion = alianza.nombre;
            }

            if (!resultadosPorUnidad[idUnidad]) resultadosPorUnidad[idUnidad] = {};
            if (!resultadosPorUnidad[idUnidad][agrupacion]) resultadosPorUnidad[idUnidad][agrupacion] = 0;
            
            resultadosPorUnidad[idUnidad][agrupacion] += cantidad;
        });
    }
     console.log("2. Votos acumulados:", resultadosPorUnidad);

    // 3. Determinar resultado final por unidad (ganador o porcentaje específico)
  Object.keys(resultadosPorUnidad).forEach(idUnidad => {
        const datos = resultadosPorUnidad[idUnidad];
        if (partidoEspecifico) {
            // Esto ya estaba bien
            const porcentaje = (datos.total > 0) ? (datos.especifico / datos.total) * 100 : 0;
            resultadosPorUnidad[idUnidad] = { nombre: partidoEspecifico, porcentaje, votos: datos.especifico };
        } else {
            // ESTA ES LA LÓGICA QUE FALTABA PARA EL MODO GANADOR
            let ganador = null, maxVotos = -1, totalVotos = 0;
            for (const [agrupacion, votos] of Object.entries(datos)) {
                totalVotos += votos;
                if (votos > maxVotos) {
                    maxVotos = votos;
                    ganador = agrupacion;
                }
            }
            // Calculamos el porcentaje del ganador sobre el total de votos en esa unidad
            const porcentaje = (totalVotos > 0) ? (maxVotos / totalVotos) * 100 : 0;
            // Guardamos tanto el nombre como el porcentaje
            resultadosPorUnidad[idUnidad] = ganador ? { nombre: ganador, porcentaje } : null;
        }
    });

    // 4. Cargar features y asignar resultados
    let featuresBase;
    let idField;

    if (nivelAgregacion === 'circuito') {
        featuresBase = new ol.format.GeoJSON().readFeatures(json_CIRCUITOS_0, {
            dataProjection: 'EPSG:4326', featureProjection: 'EPSG:3857'
        });
        idField = 'name';
    } else if (nivelAgregacion === 'fraccion') {
         featuresBase = new ol.format.GeoJSON().readFeatures(json_FRACCIONESCENSALES_0, {
            dataProjection: 'EPSG:4326', featureProjection: 'EPSG:3857'
        });
        idField = 'fraccion';
    } else {
        console.error("Nivel de agregación no soportado:", nivelAgregacion);
        return;
    }
    console.log("3. Features (formas) del mapa cargadas:", featuresBase);
    
    const featuresConResultados = featuresBase.map(f => {
        const idUnidad = f.get(idField); // No normalizamos, confiando en tu verificación.
        const resultado = resultadosPorUnidad[idUnidad];
        
        const condicionMostrar = partidoEspecifico ? (resultado && resultado.votos > 0) : resultado;

        if (condicionMostrar) {
            f.set('resultado_nombre', resultado.nombre);
            f.set('resultado_porcentaje', resultado.porcentaje);
            return f;
        }
        return null;
    }).filter(f => f !== null);

    console.log("4. Features con datos asignados:", featuresConResultados);
     if (featuresConResultados.length === 0 && featuresBase.length > 0) {
        console.error("¡ERROR! El cruce de datos falló. Verifica que los IDs coincidan perfectamente y que la propiedad del ID en el GeoJSON ('" + idField + "') sea la correcta.");
    }

    // 5. Crear la capa
// 5. Crear la capa
    const capa = new ol.layer.Vector({
        source: new ol.source.Vector({ features: featuresConResultados }),
        
        // --- INICIO DE LA MODIFICACIÓN DE ESTILO ---
style: function (feature) {
            const nombre = feature.get('resultado_nombre') || '';
            const porcentaje = feature.get('resultado_porcentaje') || 0;
            
            // 1. Obtenemos el color base del partido
            const colorBase = obtenerColorParaGanador(nombre);
            const rgb = colorBase.match(/\d+/g);

            // 2. Lógica de rangos (como la que te gustó) para definir la opacidad
            let opacidad = 0.1; // Opacidad por defecto para porcentajes muy bajos o cero
            if (porcentaje >= 80) {
                opacidad = 0.95; // Rango Muy Alto
            } else if (porcentaje >= 60) {
                opacidad = 0.80; // Rango Alto
            } else if (porcentaje >= 40) {
                opacidad = 0.45; // Rango Medio-Alto
            } else if (porcentaje >= 20) {
                opacidad = 0.30; // Rango Medio-Bajo
            } else if (porcentaje > 0) {
                opacidad = 0.15; // Rango Bajo
            }

            // 3. Creamos el color final para las rayas
            const colorParaRayas = `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${opacidad})`;
            const patronFinal = createHatchPattern(colorParaRayas);
            
            // La lógica del texto no cambia
            const nombreFormateado = wrapText(nombre, 12);
            let textoFinal = nombreFormateado;
            if (porcentaje != null) {
                textoFinal += `\n(${Math.round(porcentaje)}%)`;
            }

            return new ol.style.Style({
                fill: new ol.style.Fill({ color: patronFinal }),
                stroke: new ol.style.Stroke({ color: 'rgba(0, 0, 0, 0.75)', width: 1, lineDash: [2, 5] }),
                text: new ol.style.Text({
                    text: textoFinal,
                    font: 'bold 9px "Open Sans", "Arial Unicode MS", "sans-serif"',
                    textAlign: 'center',
                    fill: new ol.style.Fill({ color: 'rgba(0,0,0,0.85)' }),
                    stroke: new ol.style.Stroke({ color: 'rgba(255, 255, 255, 0.85)', width: 3 }),
                    overflow: true
                })
            });
        },
                        visible: false
    });

    window[nombreCapa] = capa;
    return capa;
}

crearCapaResultados(2023, 'SEGUNDA VUELTA', 'PRESIDENTE Y VICE', 'segundavueltanacional23Layer', {
    nivelAgregacion: 'circuito'
});

crearCapaResultados(2023, 'GENERAL', 'PRESIDENTE Y VICE', 'generalnacional23Layer', {
    nivelAgregacion: 'circuito'
});

crearCapaResultados(2023, 'GENERAL', 'GOBERNADOR/A', 'generalprovincial23Layer', {
    nivelAgregacion: 'circuito'
});

crearCapaResultados(2023, 'GENERAL', 'INTENDENTE/A', 'generalmunicipal23Layer', {
    nivelAgregacion: 'circuito'
});

crearCapaResultados(2023, 'GENERAL', 'INTENDENTE/A', 'generalmunicipalalianza23Layer', {
    nivelAgregacion: 'circuito',
    alianza: alianzaLLA_JxC
});

crearCapaResultados(2023, 'GENERAL', 'PRESIDENTE Y VICE', 'generalnacional23llaLayer', {
    nivelAgregacion: 'circuito',
    partidoEspecifico: 'LA LIBERTAD AVANZA'
});

crearCapaResultados(2023, 'GENERAL', 'PRESIDENTE Y VICE', 'generalnacional23jxcLayer', {
    nivelAgregacion: 'circuito',
    partidoEspecifico: 'JUNTOS POR EL CAMBIO'
});



//////////////////////////////////////////////////////////////////////////////////////////////////



