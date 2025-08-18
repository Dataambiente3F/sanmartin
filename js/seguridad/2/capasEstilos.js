        window.selectedFeature = null;


            const featuresCenso = new ol.format.GeoJSON().readFeatures(json_CensoAlumbrado_0, {
            dataProjection: 'EPSG:4326',
            featureProjection: 'EPSG:3857'
            });

            // Reemplazamos la geometría usando Latitud y Longitud de las propiedades
            featuresCenso.forEach(feature => {
                const props = feature.getProperties();
                const lat = parseFloat(props.Latitud);
                const lon = parseFloat(props.Longitud);
                if (!isNaN(lat) && !isNaN(lon)) {
                    const point = new ol.geom.Point(ol.proj.fromLonLat([lon, lat]));
                    feature.setGeometry(point);
                }
            });

    
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

    window.localidadesLayer = new ol.layer.Vector({
        source: new ol.source.Vector({
            features: new ol.format.GeoJSON().readFeatures(json_Localidades_0, {
                dataProjection: 'EPSG:4326',
                featureProjection: 'EPSG:3857'
            })
        }),
        style: new ol.style.Style({
            stroke: new ol.style.Stroke({ color: 'rgba(30,30,30,0.8)', width: 2.5, lineDash: [2.5,4.5] }),
            fill: new ol.style.Fill({ color: 'rgba(0,0,0,0)' })
        })
    });

    window.partidoLayer = new ol.layer.Vector({
        source: new ol.source.Vector({
            features: new ol.format.GeoJSON().readFeatures(json_Limites3F_0, {
                dataProjection: 'EPSG:4326',
                featureProjection: 'EPSG:3857'
            })
        }),
        style: new ol.style.Style({
            stroke: new ol.style.Stroke({ color: 'rgba(30,30,30,0.8)', width: 3.5 }),
            fill: new ol.style.Fill({ color: 'rgba(0,0,0)' })
        })
    });

    // Creación de la capa vectorial de Alumbrado con estilo dinámico
    window.censoalumbradoLayer = new ol.layer.Vector({
        source: new ol.source.Vector({
            features: featuresCenso // featuresCenso ya está definido y procesado arriba
        }),
        style: function(feature) {
            // Obtenemos el valor de la propiedad "TIPO DE LAMPARA" de cada punto.
            // Usamos .toUpperCase() y .trim() para evitar errores por mayúsculas/minúsculas o espacios.
            const tipoLampara = (feature.get('TIPO DE LAMPARA') || '').toUpperCase().trim();

            // Comparamos el valor y devolvemos el estilo correspondiente
            switch (tipoLampara) {
                case 'LED':
                    return estiloLed;
                case 'SAP':
                    return estiloSap;
                case 'MEZCLADORA':
                    return estiloMezcladora;
                case 'MERCURIO HALOGENADO':
                    return estiloMercurio;
                default:
                    // Para cualquier otro valor o si no tiene la propiedad, usamos el estilo por defecto.
                    return estiloDefaultAlumbrado;
            }
        }
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

    window.zonasinundablesLayer = new ol.layer.Vector({
        source: new ol.source.Vector({
            features: new ol.format.GeoJSON().readFeatures(json_Zonasinundables_0, {
                dataProjection: 'EPSG:4326',
                featureProjection: 'EPSG:3857'
            })
        }),
        style: new ol.style.Style({
        stroke: new ol.style.Stroke({ color: '#a32e2e', width: 1, lineDash: [1,2] }),
        fill: new ol.style.Fill({ color: 'rgba(163, 46, 46, 0.3)' })
        })
    });

    window.red80Layer = new ol.layer.Vector({
        source: new ol.source.Vector({
            features: new ol.format.GeoJSON().readFeatures(json_Red80_0, {
                dataProjection: 'EPSG:4326',
                featureProjection: 'EPSG:3857'
            })
        }),
        style: new ol.style.Style({
        stroke: new ol.style.Stroke({
            color: 'rgba(214, 179, 79, 0.6)',  // 80% de opacidad
            width: 3
        }),
        fill: new ol.style.Fill({ color: 'rgba(107, 156, 68)' })
            })
        });

    window.red100Layer = new ol.layer.Vector({
        source: new ol.source.Vector({
            features: new ol.format.GeoJSON().readFeatures(json_Red100_0, {
                dataProjection: 'EPSG:4326',
                featureProjection: 'EPSG:3857'
            })
        }),
        style: new ol.style.Style({
        stroke: new ol.style.Stroke({
            color: 'rgba(158, 45, 21, 0.6)',  // 80% de opacidad
            width: 4
        }),
        fill: new ol.style.Fill({ color: 'rgba(107, 156, 68)' })
            })
        });

    window.sumiderosLayer = new ol.layer.Vector({
        source: new ol.source.Vector({
            features: new ol.format.GeoJSON().readFeatures(json_Sumideros_0, {
                dataProjection: 'EPSG:4326',
                featureProjection: 'EPSG:3857'
            })
        }),
        style: new ol.style.Style({
        stroke: new ol.style.Stroke({
            color: 'rgba(158, 45, 21, 0.6)',  // 80% de opacidad
            width: 4
        }),
        fill: new ol.style.Fill({ color: 'rgba(107, 156, 68)' })
            })
        });

    window.puntoscriticosLayer = new ol.layer.Vector({
        source: new ol.source.Vector({
            features: new ol.format.GeoJSON().readFeatures(
            json_Puntoscriticos_0, {
                dataProjection: 'EPSG:4326',
                featureProjection: 'EPSG:3857'
            }
            )
        }),
        style: new ol.style.Style({
            image: new ol.style.Icon({
            src: 'images/basura.png',      // ruta a tu icono
            scale: 0.025,                // ajusta tamaño (depende de la resolución del PNG)
            anchor: [0.5, 1],           // ancla el punto al pie del icono
            anchorXUnits: 'fraction',
            anchorYUnits: 'fraction'
            })
        })
        });

    window.contenedoresLayer = new ol.layer.Vector({
        source: new ol.source.Vector({
            features: new ol.format.GeoJSON().readFeatures(
            json_Contenedores_0, {
                dataProjection: 'EPSG:4326',
                featureProjection: 'EPSG:3857'
            }
            )
        }),
        style: new ol.style.Style({
            image: new ol.style.Icon({
            src: 'images/contenedor.png',      // ruta a tu icono
            scale: 0.025,                // ajusta tamaño (depende de la resolución del PNG)
            anchor: [0.5, 1],           // ancla el punto al pie del icono
            anchorXUnits: 'fraction',
            anchorYUnits: 'fraction'
            })
        })
        });

    window.totem3FLayer = new ol.layer.Vector({
        source: new ol.source.Vector({
            features: new ol.format.GeoJSON().readFeatures(json_Totem3F_0, {
                dataProjection: 'EPSG:4326',
                featureProjection: 'EPSG:3857'
            })
        }),
        style: new ol.style.Style({
            image: new ol.style.Icon({
                src: 'images/3Ficono.png', // Puedes cambiar esto por un ícono específico para el tótem
                scale: 0.04,
                anchor: [0.5, 1],
                anchorXUnits: 'fraction',
                anchorYUnits: 'fraction'
            })
        })
    });

    window.zonasalumbradoLayer = new ol.layer.Vector({
    source: new ol.source.Vector({
        features: new ol.format.GeoJSON().readFeatures(json_Zonasalumbrado_0, {
            dataProjection: 'EPSG:4326',
            featureProjection: 'EPSG:3857'
        })
    }),
    style: function(feature) {
        // Obtenemos el nombre de la zona desde la propiedad 'name'.
        const zoneName = feature.get('name');

        // 1. Definimos un estilo para cada empresa.
        const styleSach = new ol.style.Style({
            stroke: new ol.style.Stroke({ color: 'rgba(184, 105, 47, 0.9)', width: 2 }),
            fill: new ol.style.Fill({
                // Usamos la función para crear un patrón con líneas púrpuras y un fondo púrpura muy claro.
                color: createHatchPattern('rgba(184, 105, 47, 0.8)', 'rgba(184, 105, 47, 0.1)') 
            })
        });

        const styleFermad = new ol.style.Style({
            stroke: new ol.style.Stroke({ color: 'rgba(105, 142, 143, 0.9)', width: 2 }),
            fill: new ol.style.Fill({
                // Usamos la función para crear un patrón con líneas púrpuras y un fondo púrpura muy claro.
                color: createHatchPattern('rgba(105, 142, 143, 0.8)', 'rgba(105, 142, 143, 0.1)') 
            })
        });

        
        const styleMantelectric = new ol.style.Style({
            stroke: new ol.style.Stroke({ color: 'rgba(193, 165, 174, 0.9)', width: 2 }),
            fill: new ol.style.Fill({
                // Usamos la función para crear un patrón con líneas púrpuras y un fondo púrpura muy claro.
                color: createHatchPattern('rgba(193, 165, 174, 0.8)', 'rgba(193, 165, 174, 0.1)') 
            })
        });


        const styleDefault = new ol.style.Style({
            stroke: new ol.style.Stroke({ color: 'rgba(154, 35, 239, 0.9)', width: 2 }),
            fill: new ol.style.Fill({
                // Usamos la función para crear un patrón con líneas púrpuras y un fondo púrpura muy claro.
                color: createHatchPattern('rgba(154, 35, 239, 0.8)', 'rgba(154, 35, 239, 0.1)') 
            })
        });


        // 2. Comparamos el nombre y devolvemos el estilo que corresponde.
        if (zoneName === 'Sach') {
            return styleSach;
        } else if (zoneName === 'Fermad') {
            return styleFermad;
        } else if (zoneName === 'Mantelectric') {
            return styleMantelectric;
        } else {
            return styleDefault;
        }
    }
});

    

// PATRÓN RAYADO
function createHatchPattern(color = '#d4ac0d', background = 'rgba(0,0,0,0)') {
    const canvas = document.createElement('canvas');
    canvas.width = 6;
    canvas.height = 6;
    const ctx = canvas.getContext('2d');

    // Fondo transparente
    ctx.fillStyle = background;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Línea diagonal de esquina inferior izquierda a superior derecha
    ctx.strokeStyle = color;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, 6);
    ctx.lineTo(6, 0);
    ctx.stroke();

    return ctx.createPattern(canvas, 'repeat');
}
// FIN PATRÓN RAYADO



    window.rutanocturnaLayer = new ol.layer.Vector({
            source: new ol.source.Vector({
                features: new ol.format.GeoJSON().readFeatures(json_Rutanocturna_0, {
                    dataProjection: 'EPSG:4326',
                    featureProjection: 'EPSG:3857'
                })
            }),
        style: new ol.style.Style({
            stroke: new ol.style.Stroke({ color: 'rgba(212,172,13, 0.4)', width: 1 }),
            fill: new ol.style.Fill({
                color: createHatchPattern('rgba(212,172,13, 0.6)')
            })
        })
    });

    window.rutadiurnaLayer = new ol.layer.Vector({
        source: new ol.source.Vector({
            features: new ol.format.GeoJSON().readFeatures(json_Rutadiurna_0, {
                dataProjection: 'EPSG:4326',
                featureProjection: 'EPSG:3857'
            })
        }),
            style: new ol.style.Style({
            stroke: new ol.style.Stroke({ color: 'rgba(21, 67, 96, 0.4)', width: 1, lineDash: [1,2] }),
            fill: new ol.style.Fill({
                color: createHatchPattern('rgba(21, 67, 96, 0.6)')
            })
        })
    });

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


        // Estilo para Lámparas LED: Círculo Azul brillante
window.estiloLed = new ol.style.Style({
    image: new ol.style.Circle({
        radius: 5,
        fill: new ol.style.Fill({ color: 'rgba(0, 191, 255, 0.8)' }), // Azul brillante
        stroke: new ol.style.Stroke({ color: 'rgba(255, 255, 255, 0.9)', width: 1.5 })
    })
});

// Estilo para Lámparas SAP (Sodio): Círculo Naranja/Ámbar
window.estiloSap = new ol.style.Style({
    image: new ol.style.Circle({
        radius: 5,
        fill: new ol.style.Fill({ color: 'rgba(255, 165, 0, 0.8)' }), // Naranja
        stroke: new ol.style.Stroke({ color: 'rgba(0, 0, 0, 0.9)', width: 1 })
    })
});

// Estilo para Lámparas MEZCLADORA: Círculo Magenta
window.estiloMezcladora = new ol.style.Style({
    image: new ol.style.Circle({
        radius: 5,
        fill: new ol.style.Fill({ color: 'rgba(255, 0, 255, 0.7)' }), // Magenta
        stroke: new ol.style.Stroke({ color: 'rgba(0, 0, 0, 0.9)', width: 1 })
    })
});

// Estilo para Lámparas MERCURIO HALOGENADO: Círculo Verde
window.estiloMercurio = new ol.style.Style({
    image: new ol.style.Circle({
        radius: 5,
        fill: new ol.style.Fill({ color: 'rgba(50, 205, 50, 0.7)' }), // Verde
        stroke: new ol.style.Stroke({ color: 'rgba(0, 0, 0, 0.9)', width: 1 })
    })
});

// Estilo por defecto para otros tipos o sin datos: Círculo Gris
window.estiloDefaultAlumbrado = new ol.style.Style({
    image: new ol.style.Circle({
        radius: 4,
        fill: new ol.style.Fill({ color: 'rgba(128, 128, 128, 0.7)' }), // Gris
        stroke: new ol.style.Stroke({ color: 'rgba(0, 0, 0, 0.9)', width: 1 })
    })
});

// Define los estilos para las geometrías en el mapa
const normalStyle = new ol.style.Style({ fill:new ol.style.Fill({color:'rgba(55,74,39,0.8)'}), stroke:new ol.style.Stroke({color:'rgba(55,74,39)',width:2}) });
const highlightStyle = new ol.style.Style({ fill:new ol.style.Fill({color:'rgba(128,128,128,0.6)'}), stroke:new ol.style.Stroke({color:'#666',width:2}) });













// 1. Agrupar votos por circuito (solo POSITIVOS)
const votosPorCircuito = {};

datosVotos.forEach(entry => {
    const circuito = entry[3]; // ← circuito como string
    const fuerza = entry[4];
    const tipoVoto = entry[5];
    const cantidad = entry[6];

    if (tipoVoto !== 'POSITIVO') return;

    if (!votosPorCircuito[circuito]) {
        votosPorCircuito[circuito] = {};
    }

    if (!votosPorCircuito[circuito][fuerza]) {
        votosPorCircuito[circuito][fuerza] = 0;
    }

    votosPorCircuito[circuito][fuerza] += cantidad;
});

// 2. Determinar el ganador por circuito
const ganadoresPorCircuito = {};

Object.entries(votosPorCircuito).forEach(([circuito, fuerzas]) => {
    let maxVotos = -1;
    let ganador = null;

    for (const fuerza in fuerzas) {
        if (fuerzas[fuerza] > maxVotos) {
            maxVotos = fuerzas[fuerza];
            ganador = fuerza;
        }
    }

    ganadoresPorCircuito[circuito] = ganador;
});

// 3. Crear capa con features coloreados según el ganador
const featuresCircuitos = new ol.format.GeoJSON().readFeatures(json_CIRCUITOS_0, {
    dataProjection: 'EPSG:4326',
    featureProjection: 'EPSG:3857'
});
console.log("Propiedades de un feature:", featuresCircuitos[0].getProperties());


const featuresConGanador = featuresCircuitos.map(f => {
    const idCircuito = f.get('name'); // ⬅️ CAMBIA ESTO si tu campo no se llama así
    const ganador = ganadoresPorCircuito[idCircuito];
    if (ganador) {
        f.set('ganador', ganador);
        return f;
    }
    return null;
}).filter(f => f !== null);

window.generales2023Layer = new ol.layer.Vector({
    source: new ol.source.Vector({
        features: featuresConGanador
    }),
    style: function (feature) {
        const ganador = feature.get('ganador');

        let color = 'gray'; // default
        if (ganador === 'LA LIBERTAD AVANZA') {
            color = 'rgba(255, 0, 0, 0.4)';
        } else if (ganador === 'UNION POR LA PATRIA') {
            color = 'rgba(0, 0, 255, 0.4)';
        }

        return new ol.style.Style({
            fill: new ol.style.Fill({ color }),
            stroke: new ol.style.Stroke({ color: '#333', width: 1 })
        });
    },
    visible: false
});
