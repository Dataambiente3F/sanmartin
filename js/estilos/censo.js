
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
// Condición Económica
//////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Crea una capa que muestra el porcentaje de una condición de actividad económica específica.
 * @param {string} nombreCapa - El nombre para la variable de la capa (ej. 'capaOcupacion').
 * @param {string} categoriaSeleccionada - La categoría a calcular (ej. 'Ocupado', 'Inactivo', 'Desocupado').
 * @returns {ol.layer.Vector} La capa de OpenLayers creada.
 */
function crearCapaCondicionEconomica(nombreCapa, categoriaSeleccionada) {
    // 1. Definir las categorías para el denominador (población económicamente activa)
    const categoriasPoblacionActiva = ['Ocupado', 'Inactivo', 'Desocupado'];
    
    // 2. Procesar y agregar los datos del censo por fracción
    const datosPorFraccion = {};
    censoCondicioneconomica.forEach(entry => {
        const fraccion = entry[0];
        const condicion = entry[1];
        const casos = entry[2];

        if (!datosPorFraccion[fraccion]) {
            datosPorFraccion[fraccion] = {
                totalPoblacionActiva: 0,
                totalCategoria: 0
            };
        }

        if (categoriasPoblacionActiva.includes(condicion)) {
            datosPorFraccion[fraccion].totalPoblacionActiva += casos;
        }

        // Si la condición de la fila es la que seleccionamos, la sumamos al total de la categoría
        if (condicion === categoriaSeleccionada) {
            datosPorFraccion[fraccion].totalCategoria += casos;
        }
    });

    // 3. Calcular el porcentaje final para cada fracción
    const porcentajesFinales = {};
    Object.keys(datosPorFraccion).forEach(fraccion => {
        const datos = datosPorFraccion[fraccion];
        if (datos.totalPoblacionActiva > 0) {
            const porcentaje = (datos.totalCategoria / datos.totalPoblacionActiva) * 100;
            porcentajesFinales[fraccion] = parseFloat(porcentaje.toFixed(2));
        } else {
            porcentajesFinales[fraccion] = 0;
        }
    });
    
    // Generar un nombre de propiedad dinámico, ej: 'porcentaje_ocupado'
    const propiedadPorcentaje = 'porcentaje_' + categoriaSeleccionada.toLowerCase();

    // 4. Cargar las geometrías y unirlas con los datos
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

    // 5. Crear la capa vectorial con estilo dinámico
    const capa = new ol.layer.Vector({
        source: new ol.source.Vector({
            features: featuresConPorcentaje
        }),
        style: function (feature) {
            const porcentaje = feature.get(propiedadPorcentaje);
            let color = 'rgba(200, 200, 200, 0.6)'; // Gris por defecto

            // Decidir la escala de color según la categoría seleccionada
            if (categoriaSeleccionada === 'Ocupado') {
                // Escala de verdes para 'Ocupado' (más es mejor)
                if (porcentaje >= 80) color = 'rgba(0, 109, 44, 0.85)';
                else if (porcentaje >= 60) color = 'rgba(49, 163, 84, 0.85)';
                else if (porcentaje >= 40) color = 'rgba(116, 196, 118, 0.85)';
                else if (porcentaje >= 20) color = 'rgba(186, 228, 179, 0.85)';
                else if (porcentaje >= 0) color = 'rgba(229, 245, 224, 0.85)';
            } else {
                // Escala de rojos/naranjas para 'Inactivo' y 'Desocupado' (más es alerta)
                if (porcentaje >= 25) color = 'rgba(165, 0, 38, 0.85)';    // Muy alto
                else if (porcentaje >= 20) color = 'rgba(215, 48, 39, 0.85)';   // Alto
                else if (porcentaje >= 15) color = 'rgba(244, 109, 67, 0.85)';  // Medio-alto
                else if (porcentaje >= 10) color = 'rgba(253, 174, 97, 0.85)';  // Medio-bajo
                else if (porcentaje >= 0) color = 'rgba(254, 224, 144, 0.85)'; // Bajo
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

crearCapaCondicionEconomica('censoOcupadosLayer', 'Ocupado');
crearCapaCondicionEconomica('censoDesocupadosLayer', 'Desocupado');
crearCapaCondicionEconomica('censoInactivosLayer', 'Inactivo');