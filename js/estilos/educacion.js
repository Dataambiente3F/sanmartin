// =================================================================
// INICIO CAPAS DE EDUCACIÓN (CON ÍCONOS PERSONALIZADOS)
// =================================================================

// Función auxiliar para crear un estilo con un ícono de imagen
function crearEstiloIcono(rutaIcono) {
    return new ol.style.Style({
        image: new ol.style.Icon({
            anchor: [0.5, 1], // Ancla el ícono en la parte inferior central
            src: rutaIcono,   // Usa la ruta relativa a la imagen
            scale: 0.15        // Ajusta el tamaño del ícono (puedes cambiar este valor)
        })
    });
}

// Función para crear una capa de educación filtrada por categoría
function crearCapaEducacion(categoria, estilo) {
    // Filtramos los datos de Educacion_0.js
    const featuresFiltrados = json_Educacion_0.features.filter(feature =>
        feature.properties.Categoría === categoria
    ).map(feature => {
        // Creamos los objetos 'feature' de OpenLayers
        const props = feature.properties;
        const coords = [props.Longitud, props.Latitud];
        const geometry = new ol.geom.Point(ol.proj.fromLonLat(coords));
        
        return new ol.Feature({
            geometry: geometry,
            ...props // Copiamos todas las propiedades
        });
    });

    return new ol.layer.Vector({
        source: new ol.source.Vector({
            features: featuresFiltrados
        }),
        style: estilo,
        visible: false, // Todas las capas empiezan ocultas
        zIndex: 10
    });
}

// Creamos una capa para cada categoría usando su respectivo ícono
window.jardinesLayer = crearCapaEducacion('Jardín', crearEstiloIcono('images/icons/Educacion_Jardin.png'));
window.primariasLayer = crearCapaEducacion('Escuela Primaria', crearEstiloIcono('images/icons/Educacion_Primaria.png'));
window.secundariasLayer = crearCapaEducacion('Secundaria Básica', crearEstiloIcono('images/icons/Educacion_Secundaria.png'));
window.universidadesLayer = crearCapaEducacion('Universidad', crearEstiloIcono('images/icons/Educacion_Universidad.png'));

// =================================================================
// FIN CAPAS DE EDUCACIÓN
// =================================================================