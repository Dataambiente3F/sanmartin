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

window.localidadesLayer = new ol.layer.Vector({
    source: new ol.source.Vector({
        features: new ol.format.GeoJSON().readFeatures(json_Localidades_0, {
            dataProjection: 'EPSG:4326',
            featureProjection: 'EPSG:3857'
        })
    }),
    style: function(feature) {
        const originalName = feature.get('Nombre') || ''; // Usar '' por si el nombre es nulo

        // --- ¡Este es el valor clave para ajustar! ---
        // Definí cuántos caracteres querés por línea antes de forzar un salto.
        const maxCharsPerLine = 15;

        // Usamos nuestra función para formatear el nombre
        const wrappedName = wrapText(originalName, maxCharsPerLine);
        
        return new ol.style.Style({
            stroke: new ol.style.Stroke({
                color: 'rgba(30,30,30,0.8)',
                width: 2.5,
                lineDash: [2.5, 4.5]
            }),
            fill: new ol.style.Fill({
                color: 'rgba(0,0,0,0)'
            }),
            text: new ol.style.Text({
                // Usamos el texto ya procesado por nuestra función
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
            })
        });
    },
    zIndex: 999
});
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
        })
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
//Crear ganadores ELECCIONES

const alianzaLLA_JxC = {
  nombre: 'LLA + JxC',
  partidos: ['LA LIBERTAD AVANZA', 'JUNTOS POR EL CAMBIO']
};

function obtenerColorParaGanador(ganador) {
    let colorBase;

    if (ganador === 'LLA + JxC' || ganador === 'LA LIBERTAD AVANZA') {
        colorBase = 'rgba(105, 38, 192, 0.75)'; // Violeta
    } else if (ganador === 'JUNTOS POR EL CAMBIO') {
        colorBase = 'rgba(255, 215, 0, 0.75)'; // Amarillo
    } else if (ganador === 'UNION POR LA PATRIA') {
        colorBase = 'rgba(38, 169, 192, 0.75)'; // Celeste
    } else {
        return 'gray'; // Para el 'default', devolvemos un color sólido.
    }

    // Para todos los casos definidos, creamos y devolvemos el patrón.
    return createHatchPattern(colorBase);
}

// La función wrapText no necesita cambios.
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

/**
 * Inserta saltos de línea en un texto para que no exceda una longitud máxima por línea.
 * @param {string} text - El texto a ajustar.
 * @param {number} maxLineLength - La cantidad máxima de caracteres por línea.
 * @returns {string} El texto con los saltos de línea ('\n') insertados.
 */
function wrapText(text, maxLineLength) {
    // Si el texto es corto, lo devolvemos directamente para evitar cálculos.
    if (!text || text.length <= maxLineLength) {
        return text;
    }

    const words = text.split(' ');
    let currentLine = '';
    let result = '';

    for (let i = 0; i < words.length; i++) {
        const word = words[i];
        // Previene agregar un espacio al inicio de una nueva línea.
        const lineWithNextWord = currentLine ? currentLine + ' ' + word : word;

        if (lineWithNextWord.length > maxLineLength) {
            result += currentLine + '\n';
            currentLine = word;
        } else {
            currentLine = lineWithNextWord;
        }
    }
    // Agrega la última línea que quedó en el buffer.
    result += currentLine;
    return result;
}


function crearCapaGanadores(año, tipoEleccion, cargo, nombreCapa, alianza = null, propiedadGanador = 'ganador') {
    // 1. Filtrar votos
    const datosFiltrados = datosVotos.filter(entry =>
        entry[0] === año &&
        entry[1] === tipoEleccion &&
        entry[2] === cargo &&
        entry[5] === 'POSITIVO'
    );

    // 2. Acumular votos por circuito (CON LÓGICA DE ALIANZA)
    const ganadoresPorCircuito = {};
    datosFiltrados.forEach(entry => {
        let agrupacion = entry[4]; // Usamos let para poder modificarla
        const circuito = entry[3];
        const cantidad = entry[6];

        // Si se definió una alianza y la agrupación actual pertenece a ella...
        if (alianza && alianza.partidos.includes(agrupacion)) {
            // ...usamos el nombre de la alianza en su lugar.
            agrupacion = alianza.nombre;
        }

        if (!ganadoresPorCircuito[circuito]) ganadoresPorCircuito[circuito] = {};
        if (!ganadoresPorCircuito[circuito][agrupacion]) ganadoresPorCircuito[circuito][agrupacion] = 0;
        
        ganadoresPorCircuito[circuito][agrupacion] += cantidad;
    });
    
    // El resto de la función (pasos 3, 4, 5 y 6) ya es correcto y no necesita cambios.
    // ...
    // 3. Determinar el ganador Y CALCULAR SU PORCENTAJE en cada circuito
    Object.keys(ganadoresPorCircuito).forEach(circuito => {
        const agrupaciones = ganadoresPorCircuito[circuito];
        let ganador = null, maxVotos = -1, totalVotos = 0;
        for (const [agrupacion, votos] of Object.entries(agrupaciones)) {
            totalVotos += votos;
            if (votos > maxVotos) {
                maxVotos = votos;
                ganador = agrupacion;
            }
        }
        const porcentaje = (totalVotos > 0) ? (maxVotos / totalVotos) * 100 : 0;
        if (ganador) {
            ganadoresPorCircuito[circuito] = { nombre: ganador, porcentaje: porcentaje };
        } else {
            ganadoresPorCircuito[circuito] = null;
        }
    });

    // 4. Cargar features y asignar ganador CON SU PORCENTAJE
    const featuresCircuitos = new ol.format.GeoJSON().readFeatures(json_CIRCUITOS_0, {
        dataProjection: 'EPSG:4326', featureProjection: 'EPSG:3857'
    });
    const featuresConGanador = featuresCircuitos.map(f => {
        const idCircuito = f.get('name');
        const datosGanador = ganadoresPorCircuito[idCircuito];
        if (datosGanador) {
            f.set(propiedadGanador, datosGanador.nombre);
            f.set('porcentaje', datosGanador.porcentaje);
            return f;
        }
        return null;
    }).filter(f => f !== null);

    // 5. Crear capa con estilo personalizado que USA EL PORCENTAJE
    const capa = new ol.layer.Vector({
        source: new ol.source.Vector({ features: featuresConGanador }),
        style: function (feature) {
            const ganador = feature.get(propiedadGanador) || '';
            const porcentaje = feature.get('porcentaje');
            const color = obtenerColorParaGanador(ganador);
            const maxChars = 12;
            const nombreFormateado = wrapText(ganador, maxChars);
            let textoFinal = nombreFormateado;

            if (porcentaje != null) {
                textoFinal += `\n(${Math.round(porcentaje)}%)`;
            }
            return new ol.style.Style({
                fill: new ol.style.Fill({ color }),
                stroke: new ol.style.Stroke({ color: 'rgba(0, 0, 0, 0.75)', width: 1, lineDash: [2, 5] }),
                text: new ol.style.Text({
                    text: textoFinal,
                    font: 'bold 9px "Open Sans", "Arial Unicode MS", "sans-serif"',
                    textAlign: 'center',
                    fill: new ol.style.Fill({ color: 'rgba(0,0,0,0.75)' }),
                    stroke: new ol.style.Stroke({ color: 'rgba(255, 255, 255, 0.75)', width: 3 }),
                    overflow: true
                })
            });
        },
        visible: false
    });

    // 6. Guardar y agregar al mapa (Sin cambios)
    window[nombreCapa] = capa;
    return capa;
}

crearCapaGanadores(2023, 'SEGUNDA VUELTA', 'PRESIDENTE Y VICE', 'segundavueltanacional23Layer');
crearCapaGanadores(2023, 'GENERAL', 'PRESIDENTE Y VICE', 'generalnacional23Layer');
crearCapaGanadores(2023, 'GENERAL', 'GOBERNADOR/A', 'generalprovincial23Layer');
crearCapaGanadores(2023, 'GENERAL', 'INTENDENTE/A', 'generalmunicipal23Layer');
crearCapaGanadores(2023, 'GENERAL', 'INTENDENTE/A', 'generalmunicipalalianza23Layer',  alianzaLLA_JxC);
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