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

let mostrarNombresLocalidades = true; 

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
        zIndex: 999
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
        zIndex: 1000
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


//////////////////////////////////////////////////////////////////////////////////////////////////
//Crear ganadores CENSO
// Crear capa de "ganador" por fracción censal según nivel educativo más frecuente
function crearCapaNivelEducativo(nombreCapa, propiedadGanador = 'nivel_ganador') {
    // 1. Calcular ganadores por fracción
    const ganadoresPorFraccion = {};

    censoNiveleducativo.forEach(entry => {
        // Ajustar índices o nombres según tu estructura real
        const fraccion = entry[0]; // Ej: 637145
        const nivel = entry[1];    // Ej: 'Secundario incompleto'
        const casos = entry[2]; // Ej: 3326

        if (!ganadoresPorFraccion[fraccion]) {
            ganadoresPorFraccion[fraccion] = {};
        }

        if (!ganadoresPorFraccion[fraccion][nivel]) {
            ganadoresPorFraccion[fraccion][nivel] = 0;
        }

        ganadoresPorFraccion[fraccion][nivel] += casos;
    });

    // 2. Determinar el ganador en cada fracción
    Object.keys(ganadoresPorFraccion).forEach(fraccion => {
        const niveles = ganadoresPorFraccion[fraccion];
        let ganador = null;
        let maxCasos = -1;

        for (const [nivel, casos] of Object.entries(niveles)) {
            if (casos > maxCasos) {
                maxCasos = casos;
                ganador = nivel;
            }
        }

        ganadoresPorFraccion[fraccion] = ganador;
    });

    // 3. Cargar features y asignar ganador
    const featuresFracciones = new ol.format.GeoJSON().readFeatures(json_FRACCIONESCENSALES_0, {
        dataProjection: 'EPSG:4326',
        featureProjection: 'EPSG:3857'
    });

    const featuresConGanador = featuresFracciones.map(f => {
        const idFraccion = f.get('name'); // Ajustar al campo real que identifique la fracción
        const ganador = ganadoresPorFraccion[idFraccion];
        if (ganador) {
            f.set(propiedadGanador, ganador);
            return f;
        }
        return null;
    }).filter(f => f !== null);

    // 4. Crear capa con estilo según nivel educativo
const capa = new ol.layer.Vector({
    source: new ol.source.Vector({
        features: featuresConGanador
    }),
    style: function (feature) {
        const ganador = feature.get(propiedadGanador);

        // Preparamos el texto para que el espacio se convierta en un salto de línea
        // Usamos una comprobación para asegurarnos que 'ganador' no sea nulo
        const textoConSalto = ganador ? ganador.replace(' ', '\n') : '';

        let color = 'gray'; // Color por defecto
        if (ganador === 'Primario incompleto') {
            color = 'rgba(238, 47, 255, 0.6)';
        } else if (ganador === 'Primario completo') {
            color = 'rgba(255, 200, 100, 0.6)';
        } else if (ganador === 'Secundario incompleto') {
            color = 'rgba(230, 180, 180, 0.6)';
        } else if (ganador === 'Secundario completo') {
            color = 'rgba(204, 233, 157, 0.6)';
        } else if (ganador === 'Universitario completo') {
            color = 'rgba(45, 133, 18, 0.6)';
        }

        return new ol.style.Style({
            fill: new ol.style.Fill({ color }),
            stroke: new ol.style.Stroke({ color: '#333', width: 1,  lineDash: [2, 5] }),
            text: new ol.style.Text({
                // AQUÍ LA MODIFICACIÓN: Usamos la variable con el salto de línea
                text: textoConSalto,
                textAlign: 'center', // Centra el texto de varias líneas
                font: 'bold 8px "Open Sans", "Arial Unicode MS", "sans-serif"',
                fill: new ol.style.Fill({
                    color: 'rgba(0, 0, 0, 0.75)'
                }),
                stroke: new ol.style.Stroke({
                    color: 'rgba(255, 255, 255, 0.75)', 
                    width: 3
                }),
                overflow: true
            })
        });
    },
    visible: false
});

// 5. Guardar capa y devolver
    window[nombreCapa] = capa;
    return capa;
}

// Ejemplo de uso:
crearCapaNivelEducativo('nivelEducativoLayer');


//////////////////////////////////////////////////////////////////////////////////////////////////
//población con nivel educativo
//////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Crea una capa que muestra el porcentaje de población con estudios secundarios completos o más.
 * @param {string} nombreCapa - El nombre para la variable de la capa (ej. 'capaEstudiosSuperiores').
 * @param {string} propiedadPorcentaje - El nombre de la propiedad para guardar el cálculo (ej. 'porcentaje_altos').
 * @returns {ol.layer.Vector} La capa de OpenLayers creada.
 */
function crearCapaPorcentajeEstudios(nombreCapa, propiedadPorcentaje = 'porcentaje_altos') {
    const nivelesSuperiores = ['Terciario completo', 'Terciario incompleto', 'Universitario incompleto', 'Universitario completo', 'Posgrado completo', 'Posgrado incompleto'];

    const datosPorFraccion = {};

    censoNiveleducativo.forEach(entry => {
        const fraccion = entry[0];
        const nivel = entry[1];
        const casos = entry[2];

        if (!datosPorFraccion[fraccion]) {
            datosPorFraccion[fraccion] = {
                totalPoblacion: 0,
                totalSuperiores: 0
            };
        }

        datosPorFraccion[fraccion].totalPoblacion += casos;

        if (nivelesSuperiores.includes(nivel)) {
            datosPorFraccion[fraccion].totalSuperiores += casos;
        }
    });

    const porcentajesFinales = {};
    Object.keys(datosPorFraccion).forEach(fraccion => {
        const datos = datosPorFraccion[fraccion];
        if (datos.totalPoblacion > 0) {
            const porcentaje = (datos.totalSuperiores / datos.totalPoblacion) * 100;
            porcentajesFinales[fraccion] = parseFloat(porcentaje.toFixed(2));
        } else {
            porcentajesFinales[fraccion] = 0;
        }
    });

    const featuresFracciones = new ol.format.GeoJSON().readFeatures(json_FRACCIONESCENSALES_0, {
        dataProjection: 'EPSG:4326',
        featureProjection: 'EPSG:3857'
    });

    const featuresConPorcentaje = featuresFracciones.map(f => {
        const idFraccion = f.get('name');
        const porcentaje = porcentajesFinales[idFraccion];

        // Usamos '!= null' para incluir casos donde el porcentaje sea 0
        if (porcentaje != null) {
            f.set(propiedadPorcentaje, porcentaje);
            return f;
        }
        return null;
    }).filter(f => f !== null);

    const capa = new ol.layer.Vector({
        source: new ol.source.Vector({
            features: featuresConPorcentaje
        }),
        style: function (feature) {
            const porcentaje = feature.get(propiedadPorcentaje);
            
            // Escala de colores: de un verde claro a un verde oscuro
            // a mayor porcentaje, más oscuro el color.
            let color = 'rgba(200, 200, 200, 0.6)'; // Gris para datos no encontrados
            if (porcentaje >= 80) {
                color = 'rgba(0, 109, 44, 0.85)'; // Muy alto
            } else if (porcentaje >= 60) {
                color = 'rgba(49, 163, 84, 0.85)'; // Alto
            } else if (porcentaje >= 40) {
                color = 'rgba(116, 196, 118, 0.85)'; // Medio-alto
            } else if (porcentaje >= 20) {
                color = 'rgba(186, 228, 179, 0.85)'; // Medio-bajo
            } else if (porcentaje >= 0) {
                color = 'rgba(229, 245, 224, 0.85)'; // Bajo
            }

            return new ol.style.Style({
                fill: new ol.style.Fill({ color }),
                stroke: new ol.style.Stroke({ color: '#333', width: 1,  lineDash: [2, 5] }),
                 text: new ol.style.Text({
                    // El texto a mostrar: el valor del porcentaje con el símbolo "%"
                    text: Math.round(porcentaje) + '%',
                    // Tamaño y tipo de fuente
                    font: 'bold 11px "Open Sans", "Arial Unicode MS", "sans-serif"',
                    // Color del texto
                    fill: new ol.style.Fill({
                        color: 'rgba(0, 0, 0, 0.75)'
                    }),
                    // Borde para el texto, mejora mucho la legibilidad
                    stroke: new ol.style.Stroke({
                        color: 'rgba(255, 255, 255, 0.75)', 
                        width: 3
                    }),
                    // Permite que el texto se muestre aunque no quepa perfectamente en el polígono
                    overflow: true
                })
            });
        },
        visible: false
    });

    // 6. Guardar la capa en una variable global y devolverla
    window[nombreCapa] = capa;
    return capa;
}

crearCapaPorcentajeEstudios('estudiosSuperioresLayer');


//////////////////////////////////////////////////////////////////////////////////////////////////
// población según edad (función genérica para 4 grupos etarios)
//////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Crea una capa que muestra el porcentaje de población de un grupo etario específico.
 * @param {string} nombreCapa - El nombre para la variable de la capa (ej. 'capaJovenAdulto').
 * @param {string} grupoEdad - El grupo de edad a calcular: 'nino', 'joven', 'adulto', 'adultomayor'.
 * @returns {ol.layer.Vector} La capa de OpenLayers creada.
 */
function crearCapaPorcentajeEdad(nombreCapa, grupoEdad) {
    // Definición de los grupos etarios
    const grupos = {
        nino: ['00 a 04', '05 a 09', '10 a 14', '15 a 19'],
        joven: ['20 a 24', '25 a 29', '30 a 34', '35 a 39'],
        adulto: ['40 a 44', '45 a 49', '50 a 54', '55 a 59'],
        adultomayor: ['60 a 64', '65 a 69', '70 a 74', '75 a 79'],
        anciano: ['80 a 84', '85 a 89', '90 a 94', '95 a 99', '100 a 104', '105 y más']
    };

    if (!grupos[grupoEdad]) {
        console.error("Grupo de edad inválido. Use: 'nino', 'joven', 'adulto', 'adultomayor', 'anciano'");
        return null;
    }

    const rangosSeleccionados = grupos[grupoEdad];
    const propiedadPorcentaje = `porcentaje_${grupoEdad}`;

    const datosPorFraccion = {};

    censoEdad.forEach(entry => {
        const fraccion = entry[0];
        const rango = entry[1];
        const casos = entry[2];

        if (!datosPorFraccion[fraccion]) {
            datosPorFraccion[fraccion] = {
                totalPoblacion: 0,
                totalGrupo: 0
            };
        }

        datosPorFraccion[fraccion].totalPoblacion += casos;

        if (rangosSeleccionados.includes(rango)) {
            datosPorFraccion[fraccion].totalGrupo += casos;
        }
    });

    const porcentajesFinales = {};
    Object.keys(datosPorFraccion).forEach(fraccion => {
        const datos = datosPorFraccion[fraccion];
        if (datos.totalPoblacion > 0) {
            const porcentaje = (datos.totalGrupo / datos.totalPoblacion) * 100;
            porcentajesFinales[fraccion] = parseFloat(porcentaje.toFixed(2));
        } else {
            porcentajesFinales[fraccion] = 0;
        }
    });

    const featuresFracciones = new ol.format.GeoJSON().readFeatures(json_FRACCIONESCENSALES_0, {
        dataProjection: 'EPSG:4326',
        featureProjection: 'EPSG:3857'
    });

    const featuresConPorcentaje = featuresFracciones.map(f => {
        const idFraccion = f.get('name');
        const porcentaje = porcentajesFinales[idFraccion];

        if (porcentaje != null) {
            f.set(propiedadPorcentaje, porcentaje);
            return f;
        }
        return null;
    }).filter(f => f !== null);

    const capa = new ol.layer.Vector({
        source: new ol.source.Vector({
            features: featuresConPorcentaje
        }),
        style: function (feature) {
            const porcentaje = feature.get(propiedadPorcentaje);

            // Escala de colores (azules)
            let color = 'rgba(200, 200, 200, 0.6)'; // gris si no hay datos
            if (porcentaje >= 40) {
                color = 'rgba(8, 48, 107, 0.85)';
            } else if (porcentaje >= 30) {
                color = 'rgba(33, 113, 181, 0.85)';
            } else if (porcentaje >= 20) {
                color = 'rgba(66, 146, 198, 0.85)';
            } else if (porcentaje >= 10) {
                color = 'rgba(107, 174, 214, 0.85)';
            } else {
                color = 'rgba(189, 215, 231, 0.85)';
            }

            return new ol.style.Style({
                fill: new ol.style.Fill({ color }),
                stroke: new ol.style.Stroke({ color: '#333', width: 1, lineDash: [2, 5] }),
                text: new ol.style.Text({
                    text: Math.round(porcentaje) + '%',
                    font: 'bold 11px "Open Sans", "Arial Unicode MS", "sans-serif"',
                    fill: new ol.style.Fill({ color: 'rgba(0, 0, 0, 0.75)' }),
                    stroke: new ol.style.Stroke({ color: 'rgba(255, 255, 255, 0.75)', width: 3 }),
                    overflow: true
                })
            });
        },
        visible: false
    });

    window[nombreCapa] = capa;
    return capa;
}

// Ejemplo: crear la capa de Jóvenes Adultos (20–39)
crearCapaPorcentajeEdad('jovenAdultoLayer', 'joven');
crearCapaPorcentajeEdad('ninoLayer', 'nino');
crearCapaPorcentajeEdad('adultoLayer', 'adulto');
crearCapaPorcentajeEdad('adultomayorLayer', 'adultomayor');
crearCapaPorcentajeEdad('ancianoLayer', 'anciano');

//////////////////////////////////////////////////////////////////////////////////////////////////
// Fin población según edad (ejemplo: % Joven Adulto 20–39 años)
//////////////////////////////////////////////////////////////////////////////////////////////////


//////////////////////////////////////////////////////////////////////////////////////////////////
// INTENERT
//////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Crea una capa que muestra el porcentaje de hogares CON o SIN internet por fracción censal.
 * @param {string} nombreCapa - Nombre de la variable global que guardará la capa.
 * @param {string} tipo - "Sí" o "No" (indica qué porcentaje calcular).
 * @returns {ol.layer.Vector} La capa de OpenLayers creada.
 */
function crearCapaInternet(nombreCapa, tipo = "Sí") {
    const datosPorFraccion = {};

    // Recorrer dataset
    censoInternet.forEach(entry => {
    const fraccion = entry[0];
    const tieneInternet = entry[1];
    // --- LÍNEA CORREGIDA ---
    // Aseguramos que 'casos' sea un número entero antes de usarlo.
    const casos = parseInt(entry[2], 10);

    // Si 'casos' no es un número válido, saltamos esta entrada para evitar errores.
    if (isNaN(casos)) {
        return; 
    }
    
    if (!datosPorFraccion[fraccion]) {
        datosPorFraccion[fraccion] = { total: 0, seleccionados: 0 };
    }

    datosPorFraccion[fraccion].total += casos;
    if (tieneInternet === tipo) {
        datosPorFraccion[fraccion].seleccionados += casos;
    }
});

    // Calcular porcentajes
    const porcentajesFinales = {};
    Object.keys(datosPorFraccion).forEach(fraccion => {
        const { total, seleccionados } = datosPorFraccion[fraccion];
        porcentajesFinales[fraccion] = total > 0 ? parseFloat(((seleccionados / total) * 100).toFixed(2)) : 0;
    });

    // GeoJSON de fracciones
    const featuresFracciones = new ol.format.GeoJSON().readFeatures(json_FRACCIONESCENSALES_0, {
        dataProjection: 'EPSG:4326',
        featureProjection: 'EPSG:3857'
    });

    // Asignar porcentaje a cada fracción
    const featuresConPorcentaje = featuresFracciones.map(f => {
        const idFraccion = f.get('name');
        const porcentaje = porcentajesFinales[idFraccion];
        if (porcentaje != null) {
            f.set('porcentaje_internet_' + tipo, porcentaje);
            return f;
        }
        return null;
    }).filter(f => f !== null);

    // Crear capa vectorial
    const capa = new ol.layer.Vector({
        source: new ol.source.Vector({ features: featuresConPorcentaje }),
        style: function (feature) {
            const porcentaje = feature.get('porcentaje_internet_' + tipo);
            let color = 'rgba(200,200,200,0.6)';

            if (porcentaje >= 80) {
                color = 'rgba(8, 104, 172, 0.85)';
            } else if (porcentaje >= 60) {
                color = 'rgba(43, 140, 190, 0.85)';
            } else if (porcentaje >= 40) {
                color = 'rgba(78, 179, 211, 0.85)';
            } else if (porcentaje >= 20) {
                color = 'rgba(123, 204, 196, 0.85)';
            } else {
                color = 'rgba(204, 236, 230, 0.85)';
            }

            return new ol.style.Style({
                fill: new ol.style.Fill({ color }),
                stroke: new ol.style.Stroke({ color: '#333', width: 1, lineDash: [2, 5] }),
                text: new ol.style.Text({
                    text: Math.round(porcentaje) + '%',
                    font: 'bold 11px "Open Sans", "Arial Unicode MS", "sans-serif"',
                    fill: new ol.style.Fill({ color: 'rgba(0,0,0,0.75)' }),
                    stroke: new ol.style.Stroke({ color: 'rgba(255,255,255,0.75)', width: 3 }),
                    overflow: true
                })
            });
        },
        visible: false
    });

    window[nombreCapa] = capa;
    return capa;
}

crearCapaInternet('internetNoLayer', 'No');

//////////////////////////////////////////////////////////////////////////////////////////////////
// FIN INTERNET
//////////////////////////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////////////////////////////////////
// TOTAL POBLACIÓN
//////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Crea una capa que muestra la población total Y EL PORCENTAJE por fracción censal.
 * Colorea cada fracción según la cantidad de habitantes.
 * @param {string} nombreCapa - Nombre de la variable global que guardará la capa
 * @returns {ol.layer.Vector} La capa de OpenLayers creada
 */
function crearCapaTotalPoblacion(nombreCapa) {
    const datosPorFraccion = {};

    // 1. Recorrer dataset de edades y sumar población total por fracción
    censoEdad.forEach(entry => {
        const fraccion = entry[0];
        // Aseguramos que los casos se traten como números
        const casos = parseInt(entry[2], 10) || 0; 

        if (!datosPorFraccion[fraccion]) {
            datosPorFraccion[fraccion] = 0;
        }
        datosPorFraccion[fraccion] += casos;
    });
    
    // 2. // NUEVO: Calcular la población total general sumando los totales de cada fracción
    const poblacionTotalGeneral = Object.values(datosPorFraccion).reduce((sum, current) => sum + current, 0);

    // GeoJSON de fracciones
    const featuresFracciones = new ol.format.GeoJSON().readFeatures(json_FRACCIONESCENSALES_0, {
        dataProjection: 'EPSG:4326',
        featureProjection: 'EPSG:3857'
    });

    // 3. Asignar población total Y PORCENTAJE a cada fracción
    const featuresConTotales = featuresFracciones.map(f => {
        const idFraccion = f.get('name');
        const totalFraccion = datosPorFraccion[idFraccion] || 0;
        f.set('poblacion_total', totalFraccion);
        
        // // NUEVO: Calcular y asignar el porcentaje
        let porcentaje = 0;
        if (poblacionTotalGeneral > 0) {
            porcentaje = parseFloat(((totalFraccion / poblacionTotalGeneral) * 100).toFixed(2));
        }
        f.set('porcentaje_poblacion', porcentaje);

        return f;
    });

    // Crear capa vectorial
    const capa = new ol.layer.Vector({
        source: new ol.source.Vector({ features: featuresConTotales }),
        style: function (feature) {
                    const total = feature.get('poblacion_total');
                    const porcentaje = feature.get('porcentaje_poblacion');

                    // 1. Se calcula el color base como antes
                    let colorBase = 'rgba(200,200,200,0.6)';
                    if (total >= 8000) {
                        colorBase = 'rgba(8, 48, 107, 0.85)';
                    } else if (total >= 6000) {
                        colorBase = 'rgba(33, 113, 181, 0.85)';
                    } else if (total >= 4000) {
                        colorBase = 'rgba(66, 146, 198, 0.85)';
                    } else if (total >= 2000) {
                        colorBase = 'rgba(107, 174, 214, 0.85)';
                    } else if (total > 0) {
                        colorBase = 'rgba(189, 215, 231, 0.85)';
                    }

                    // 2. Se crea una versión del color con 50% de opacidad para el fondo
                    //    Esto reemplaza el valor alfa del string 'rgba(...)'
                    const colorFondo = colorBase.replace(/, [0-9\.]+\)/, ', 0.5)');

                    // 3. Se crea el patrón rayado con el color base (opaco)
                    const patronRayado = createHatchPattern(colorBase);

                    // 4. Se devuelve un array con los dos estilos. Se dibujan en orden.
                    return [
                        // Estilo 1: El fondo sólido semitransparente
                        new ol.style.Style({
                            fill: new ol.style.Fill({
                                color: colorFondo
                            })
                        }),
                        // Estilo 2: El patrón rayado, el borde y el texto por encima
                        new ol.style.Style({
                            fill: new ol.style.Fill({
                                color: patronRayado
                            }),
                            stroke: new ol.style.Stroke({
                                color: '#333',
                                width: 1,
                                lineDash: [2, 5]
                            }),
                            text: new ol.style.Text({
                                text: total ? `${total.toString()}\n(${porcentaje}%)` : '',
                                font: 'bold 11px "Open Sans", "Arial Unicode MS", "sans-serif"',
                                fill: new ol.style.Fill({ color: 'rgba(0,0,0,0.6)' }),
                                stroke: new ol.style.Stroke({ color: 'rgba(255,255,255,0.6)', width: 3 }),
                                overflow: true
                            })
                        })
                    ];
                },
            visible: false
        });

    window[nombreCapa] = capa;
    return capa;
}

crearCapaTotalPoblacion('poblacionTotalLayer');
crearCapaTotalPoblacion('poblacionTotalLayer');

//////////////////////////////////////////////////////////////////////////////////////////////////
// FIN TOTAL POBLACIÓN
//////////////////////////////////////////////////////////////////////////////////////////////////
