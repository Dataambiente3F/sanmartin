var wms_layers = [];


var lyr_OSMStandard_0 = new ol.layer.Tile({
    'title': 'OSM Standard',
    'opacity': 1.000000,
            
            
    source: new ol.source.XYZ({
    attributions: ' &nbsp &middot; <a href="https://www.openstreetmap.org/copyright">© OpenStreetMap contributors, CC-BY-SA</a>',
    url: 'http://tile.openstreetmap.org/{z}/{x}/{y}.png'
    })
});



var format_Plazas_0 = new ol.format.GeoJSON();
var features_Plazas_0 = format_Plazas_0.readFeatures(json_Plazas_0, 
            {dataProjection: 'EPSG:4326', featureProjection: 'EPSG:3857'});
var jsonSource_Plazas_0 = new ol.source.Vector({
    attributions: ' ',
});
jsonSource_Plazas_0.addFeatures(features_Plazas_0);
var lyr_Plazas_0 = new ol.layer.Vector({
                declutter: false,
                source:jsonSource_Plazas_0, 
                style: style_Plazas_0,
                popuplayertitle: 'Plazas',
                interactive: true,
                title: '<img src="styles/legend/Plazas_0.png" /> Plazas'
            });



var format_Limites3F_0 = new ol.format.GeoJSON();
var features_Limites3F_0 = format_Limites3F_0.readFeatures(json_Limites3F_0, 
{dataProjection: 'EPSG:4326', featureProjection: 'EPSG:3857'});
    var jsonSource_Limites3F_0 = new ol.source.Vector({
    attributions: ' ',
});
jsonSource_Limites3F_0.addFeatures(features_Limites3F_0);
var lyr_Limites3F_0 = new ol.layer.Vector({
    declutter: false,
    source:jsonSource_Limites3F_0, 
    style: style_Limites3F_0,
    popuplayertitle: 'Limites 3F',
    interactive: true,
    title: '<img src="styles/legend/Limites3F_0.png" /> Limites 3F'
});



var format_Localidades_0 = new ol.format.GeoJSON();
var features_Localidades_0 = format_Localidades_0.readFeatures(json_Localidades_0, 
            {dataProjection: 'EPSG:4326', featureProjection: 'EPSG:3857'});
var jsonSource_Localidades_0 = new ol.source.Vector({
    attributions: ' ',
});
jsonSource_Localidades_0.addFeatures(features_Localidades_0);
var lyr_Localidades_0 = new ol.layer.Vector({
                declutter: false,
                source:jsonSource_Localidades_0, 
                style: style_Localidades_0,
                popuplayertitle: 'Localidades',
                interactive: true,
                title: '<img src="styles/legend/Localidades_0.png" /> Localidades'
            });

            

var format_Ejesestructurantes_0 = new ol.format.GeoJSON();
var features_Ejesestructurantes_0 = format_Ejesestructurantes_0.readFeatures(json_Ejesestructurantes_0, 
{dataProjection: 'EPSG:4326', featureProjection: 'EPSG:3857'});
    var jsonSource_Ejesestructurantes_0 = new ol.source.Vector({
    attributions: ' ',
});
jsonSource_Ejesestructurantes_0.addFeatures(features_Ejesestructurantes_0);
var lyr_Ejesestructurantes_0 = new ol.layer.Vector({
    declutter: false,
    source:jsonSource_Ejesestructurantes_0, 
    style: style_Ejesestructurantes_0,
    popuplayertitle: 'Ejesestructurantes',
    interactive: true,
    title: '<img src="styles/legend/Ejesestructurantes_0.png" /> Ejesestructurantes'
});     
                                
                  
                                
var format_Ejessecundarios_0 = new ol.format.GeoJSON();
var features_Ejessecundarios_0 = format_Ejessecundarios_0.readFeatures(json_Ejessecundarios_0, 
{dataProjection: 'EPSG:4326', featureProjection: 'EPSG:3857'});
    var jsonSource_Ejessecundarios_0 = new ol.source.Vector({
    attributions: ' ',
});
jsonSource_Ejessecundarios_0.addFeatures(features_Ejessecundarios_0);
var lyr_Ejessecundarios_0 = new ol.layer.Vector({
    declutter: false,
    source:jsonSource_Ejessecundarios_0, 
    style: style_Ejessecundarios_0,
    popuplayertitle: 'Ejessecundarios',
    interactive: true,
    title: '<img src="styles/legend/Ejessecundarios_0.png" /> Ejessecundarios'
});




var format_CentrosComerciales_0 = new ol.format.GeoJSON();
var features_CentrosComerciales_0 = format_CentrosComerciales_0.readFeatures(json_CentrosComerciales_0, 
            {dataProjection: 'EPSG:4326', featureProjection: 'EPSG:3857'});
var jsonSource_CentrosComerciales_0 = new ol.source.Vector({
    attributions: ' ',
});
jsonSource_CentrosComerciales_0.addFeatures(features_CentrosComerciales_0);
var lyr_CentrosComerciales_0 = new ol.layer.Vector({
                declutter: false,
                source:jsonSource_CentrosComerciales_0, 
                style: style_CentrosComerciales_0,
                popuplayertitle: 'Centros Comerciales',
                interactive: true,
                title: '<img src="styles/legend/CentrosComerciales_0.png" /> Centros Comerciales'
            });


var format_CIRCUITOS_0 = new ol.format.GeoJSON();
var features_CIRCUITOS_0 = format_CIRCUITOS_0.readFeatures(json_CIRCUITOS_0, 
            {dataProjection: 'EPSG:4326', featureProjection: 'EPSG:3857'});
var jsonSource_CIRCUITOS_0 = new ol.source.Vector({
    attributions: ' ',
});
jsonSource_CIRCUITOS_0.addFeatures(features_CIRCUITOS_0);
var lyr_CIRCUITOS_0 = new ol.layer.Vector({
                declutter: false,
                source:jsonSource_CIRCUITOS_0, 
                style: style_CIRCUITOS_0,
                popuplayertitle: 'CIRCUITOS',
                interactive: true,
                title: '<img src="styles/legend/CIRCUITOS_0.png" /> CIRCUITOS'
            });



var format_FRACCIONESCENSALES_0 = new ol.format.GeoJSON();
var features_FRACCIONESCENSALES_0 = format_FRACCIONESCENSALES_0.readFeatures(json_FRACCIONESCENSALES_0, 
            {dataProjection: 'EPSG:4326', featureProjection: 'EPSG:3857'});
var jsonSource_FRACCIONESCENSALES_0 = new ol.source.Vector({
    attributions: ' ',
});
jsonSource_FRACCIONESCENSALES_0.addFeatures(features_FRACCIONESCENSALES_0);
var lyr_FRACCIONESCENSALES_0 = new ol.layer.Vector({
                declutter: false,
                source:jsonSource_FRACCIONESCENSALES_0, 
                style: style_FRACCIONESCENSALES_0,
                popuplayertitle: 'FRACCIONESCENSALES',
                interactive: true,
                title: '<img src="styles/legend/FRACCIONESCENSALES_0.png" /> FRACCIONESCENSALES'
            });



lyr_OSMStandard_0.setVisible(true);
lyr_Plazas_0.setVisible(true);
lyr_Limites3F_0.setVisible(true);
lyr_Localidades_0.setVisible(true);
lyr_Ejesestructurantes_0.setVisible(true);
lyr_Ejessecundarios_0.setVisible(true);
lyr_CentrosComerciales_0.setVisible(true);
lyr_CIRCUITOS_0.setVisible(true);
lyr_FRACCIONESCENSALES_0.setVisible(true);



var layersList = [
    lyr_Plazas_0,
    lyr_OSMStandard_0,
    lyr_Plazas_1,
    lyr_Senderos_2,
    lyr_Limites3F_0,
    lyr_Localidades_0,
    lyr_Ejesestructurantes_0,
    lyr_Ejessecundarios_0,
    lyr_CentrosComerciales_0,
    lyr_CIRCUITOS_0,
    lyr_FRACCIONESCENSALES_0
];



lyr_Plazas_0.set('fieldAliases', {'ID': 'ID', 'nombre': 'nombre', 'Categoría': 'Categoría', 'Mant Equip': 'Mant Equip', 'Mant Higiene': 'Mant Higiene', 'Estado': 'Estado', 'Dirección': 'Dirección', 'Localidad': 'Localidad', 'Frecuencia de uso': 'Frecuencia de uso', 'Cestos': 'Cestos', 'Cantidad de cestos': 'Cantidad de cestos', 'Posta aeróbica': 'Posta aeróbica', 'Juegos infantiles': 'Juegos infantiles', 'Juegos integradores': 'Juegos integradores', 'Cancha de básquet': 'Cancha de básquet', 'Cancha de fútbol-tenis': 'Cancha de fútbol-tenis', 'Documentación': 'Documentación', });
lyr_Limites3F_0.set('fieldAliases', {'name': 'name', 'folders': 'folders', 'descriptio': 'descriptio', 'altitude': 'altitude', 'alt_mode': 'alt_mode', 'time_begin': 'time_begin', 'time_end': 'time_end', 'time_when': 'time_when', });
lyr_Localidades_0.set('fieldAliases', {'Nombre': 'Nombre', 'Descripción': 'Descripción', });
lyr_Ejesestructurantes_0.set('fieldAliases', {'name': 'name', 'folders': 'folders', 'descriptio': 'descriptio', 'altitude': 'altitude', 'alt_mode': 'alt_mode', 'time_begin': 'time_begin', 'time_end': 'time_end', 'time_when': 'time_when', });
lyr_Ejessecundarios_0.set('fieldAliases', {'name': 'name', 'folders': 'folders', 'description': 'description', 'altitude': 'altitude', 'alt_mode': 'alt_mode', 'time_begin': 'time_begin', 'time_end': 'time_end', 'time_when': 'time_when', });
lyr_CentrosComerciales_0.set('fieldAliases', {'name': 'name', 'folders': 'folders', 'descriptio': 'descriptio', 'altitude': 'altitude', 'alt_mode': 'alt_mode', 'time_begin': 'time_begin', 'time_end': 'time_end', 'time_when': 'time_when', 'ID': 'ID', 'descripci�': 'descripci�', });
lyr_CIRCUITOS_0.set('fieldAliases', {'name': 'name', 'folders': 'folders', 'descriptio': 'descriptio', 'altitude': 'altitude', 'alt_mode': 'alt_mode', 'time_begin': 'time_begin', 'time_end': 'time_end', 'time_when': 'time_when', });
lyr_FRACCIONESCENSALES_0.set('fieldAliases', {'name': 'name', 'folders': 'folders', 'descriptio': 'descriptio', 'altitude': 'altitude', 'alt_mode': 'alt_mode', 'time_begin': 'time_begin', 'time_end': 'time_end', 'time_when': 'time_when', });



lyr_Plazas_0.set('fieldImages', {'ID': 'TextEdit', 'nombre': 'TextEdit', 'Categoría': 'TextEdit', 'Mant Equip': 'TextEdit', 'Mant Higiene': 'TextEdit', 'Estado': 'TextEdit', 'Dirección': 'TextEdit', 'Localidad': 'TextEdit', 'Frecuencia de uso': 'TextEdit', 'Cestos': 'TextEdit', 'Cantidad de cestos': 'TextEdit', 'Posta aeróbica': 'TextEdit', 'Juegos infantiles': 'TextEdit', 'Juegos integradores': 'TextEdit', 'Cancha de básquet': 'TextEdit', 'Cancha de fútbol-tenis': 'TextEdit', 'Documentación': 'TextEdit', });
lyr_Limites3F_0.set('fieldImages', {'name': 'TextEdit', 'folders': 'TextEdit', 'descriptio': 'TextEdit', 'altitude': 'TextEdit', 'alt_mode': 'TextEdit', 'time_begin': 'TextEdit', 'time_end': 'TextEdit', 'time_when': 'TextEdit', });
lyr_Localidades_0.set('fieldImages', {'Nombre': 'TextEdit', 'Descripción': 'TextEdit', });
lyr_Ejesestructurantes_0.set('fieldImages', {'name': 'TextEdit', 'folders': 'TextEdit', 'descriptio': 'TextEdit', 'altitude': 'TextEdit', 'alt_mode': 'TextEdit', 'time_begin': 'TextEdit', 'time_end': 'TextEdit', 'time_when': 'TextEdit', });
lyr_Ejessecundarios_0.set('fieldImages', {'name': 'TextEdit', 'folders': 'TextEdit', 'description': 'TextEdit', 'altitude': 'TextEdit', 'alt_mode': 'TextEdit', 'time_begin': 'TextEdit', 'time_end': 'TextEdit', 'time_when': 'TextEdit', });
lyr_CentrosComerciales_0.set('fieldImages', {'name': 'TextEdit', 'folders': 'TextEdit', 'descriptio': '', 'altitude': 'TextEdit', 'alt_mode': 'TextEdit', 'time_begin': 'TextEdit', 'time_end': 'TextEdit', 'time_when': 'TextEdit', 'ID': 'TextEdit', 'descripci�': '', });
lyr_CIRCUITOS_0.set('fieldImages', {'name': 'TextEdit', 'folders': 'TextEdit', 'descriptio': '', 'altitude': 'TextEdit', 'alt_mode': 'TextEdit', 'time_begin': 'TextEdit', 'time_end': 'TextEdit', 'time_when': 'TextEdit', });
lyr_FRACCIONESCENSALES_0.set('fieldImages', {'name': 'TextEdit', 'folders': 'TextEdit', 'descriptio': '', 'altitude': 'TextEdit', 'alt_mode': 'TextEdit', 'time_begin': 'TextEdit', 'time_end': 'TextEdit', 'time_when': 'TextEdit', });



lyr_Plazas_0.set('fieldLabels', {'ID': 'no label', 'nombre': 'no label', 'Categoría': 'no label', 'Mant Equip': 'no label', 'Mant Higiene': 'no label', 'Estado': 'no label', 'Dirección': 'no label', 'Localidad': 'no label', 'Frecuencia de uso': 'no label', 'Cestos': 'no label', 'Cantidad de cestos': 'no label', 'Posta aeróbica': 'no label', 'Juegos infantiles': 'no label', 'Juegos integradores': 'no label', 'Cancha de básquet': 'no label', 'Cancha de fútbol-tenis': 'no label', 'Documentación': 'no label', });
lyr_Limites3F_0.set('fieldLabels', {'name': 'no label', 'folders': 'no label', 'descriptio': 'no label', 'altitude': 'no label', 'alt_mode': 'no label', 'time_begin': 'no label', 'time_end': 'no label', 'time_when': 'no label', });
lyr_Localidades_0.set('fieldLabels', {'Nombre': 'no label', 'Descripción': 'no label', });
lyr_Ejesestructurantes_0.set('fieldLabels', {'name': 'no label', 'folders': 'no label', 'descriptio': 'no label', 'altitude': 'no label', 'alt_mode': 'no label', 'time_begin': 'no label', 'time_end': 'no label', 'time_when': 'no label', });
lyr_Ejessecundarios_0.set('fieldLabels', {'name': 'no label', 'folders': 'no label', 'description': 'no label', 'altitude': 'no label', 'alt_mode': 'no label', 'time_begin': 'no label', 'time_end': 'no label', 'time_when': 'no label', });
lyr_CentrosComerciales_0.set('fieldLabels', {'name': 'no label', 'folders': 'no label', 'descriptio': 'no label', 'altitude': 'no label', 'alt_mode': 'no label', 'time_begin': 'no label', 'time_end': 'no label', 'time_when': 'no label', 'ID': 'no label', 'descripci�': 'no label', });
lyr_CIRCUITOS_0.set('fieldLabels', {'name': 'no label', 'folders': 'no label', 'descriptio': 'no label', 'altitude': 'no label', 'alt_mode': 'no label', 'time_begin': 'no label', 'time_end': 'no label', 'time_when': 'no label', });
lyr_FRACCIONESCENSALES_0.set('fieldLabels', {'name': 'no label', 'folders': 'no label', 'descriptio': 'no label', 'altitude': 'no label', 'alt_mode': 'no label', 'time_begin': 'no label', 'time_end': 'no label', 'time_when': 'no label', });



lyr_Plazas_0.on('precompose', function(evt) {
    evt.context.globalCompositeOperation = 'normal';
});

lyr_Limites3F_0.on('precompose', function(evt) {
    evt.context.globalCompositeOperation = 'normal';
});

lyr_Localidades_0.on('precompose', function(evt) {
    evt.context.globalCompositeOperation = 'normal';
});

lyr_Ejesestructurantes_0.on('precompose', function(evt) {
    evt.context.globalCompositeOperation = 'normal';
});

lyr_Ejessecundarios_0.on('precompose', function(evt) {
    evt.context.globalCompositeOperation = 'normal';
});

lyr_CentrosComerciales_0.on('precompose', function(evt) {
    evt.context.globalCompositeOperation = 'normal';
});

lyr_CIRCUITOS_0.on('precompose', function(evt) {
    evt.context.globalCompositeOperation = 'normal';
});

lyr_FRACCIONESCENSALES_0.on('precompose', function(evt) {
    evt.context.globalCompositeOperation = 'normal';
});