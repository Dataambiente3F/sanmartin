console.log('[MAP.JS] cargado ' + new Date().toISOString());


document.addEventListener("DOMContentLoaded", function() {



// =================================================================
// MAPA PRINCIPAL
// =================================================================
window.map = new ol.Map({
    target: 'map',
    layers: [
        baseLayer, satelliteLayer, geojsonLayer, centrosComercialesLayer, 
        localidadesLayer, partidoLayer,  
        ejesestructurantesLayer, ejessecundariosLayer, 
        jardinesLayer, primariasLayer, secundariasLayer, universidadesLayer
    ],
    view: new ol.View({
        center: ol.proj.fromLonLat([-58.55, -34.544]),
        zoom: 13
    })
});

// =================================================================
// CAPAS EXTRAS (Elecciones / Censo) - solo si las funciones existen
// =================================================================
if (typeof crearCapaResultados === 'function') {
  crearCapaResultados(2023, 'SEGUNDA VUELTA', 'PRESIDENTE Y VICE', 'segundavueltanacional23Layer', {nivelAgregacion: 'circuito'});
  crearCapaResultados(2023, 'GENERAL', 'PRESIDENTE Y VICE', 'generalnacional23Layer', {nivelAgregacion: 'circuito'});
  crearCapaResultados(2023, 'GENERAL', 'GOBERNADOR/A', 'generalprovincial23Layer', {nivelAgregacion: 'circuito'});
  crearCapaResultados(2023, 'GENERAL', 'INTENDENTE/A', 'generalmunicipal23Layer', {nivelAgregacion: 'circuito'});
  crearCapaResultados(2023, 'GENERAL', 'INTENDENTE/A', 'generalmunicipalalianza23Layer', {nivelAgregacion: 'circuito', alianza: alianzaLLA_JxC});
  crearCapaResultados(2023, 'GENERAL', 'PRESIDENTE Y VICE', 'generalnacional23llaLayer', {nivelAgregacion: 'circuito', partidoEspecifico: 'LA LIBERTAD AVANZA'});
  crearCapaResultados(2023, 'GENERAL', 'PRESIDENTE Y VICE', 'generalnacional23jxcLayer', {nivelAgregacion: 'circuito', partidoEspecifico: 'JUNTOS POR EL CAMBIO'});

  [
    'segundavueltanacional23Layer','generalnacional23Layer','generalprovincial23Layer',
    'generalmunicipal23Layer','generalmunicipalalianza23Layer',
    'generalnacional23llaLayer','generalnacional23jxcLayer'
  ].forEach(k => { if (window[k]) map.addLayer(window[k]); });
}

if (typeof crearCapaNivelEducativo === 'function') {
  window.nivelEducativoLayer = crearCapaNivelEducativo('nivelEducativoLayer', 'nivel_ganador');
  if (window.nivelEducativoLayer) map.addLayer(window.nivelEducativoLayer);
}
if (typeof crearCapaPorcentajeEstudios === 'function') {
  window.estudiosSuperioresLayer = crearCapaPorcentajeEstudios('estudiosSuperioresLayer', 'porcentaje_altos');
  if (window.estudiosSuperioresLayer) map.addLayer(window.estudiosSuperioresLayer);
}
if (typeof crearCapaPorcentajeEdad === 'function') {
  window.jovenAdultoLayer = crearCapaPorcentajeEdad('jovenAdultoLayer', 'joven');
  window.ninoLayer = crearCapaPorcentajeEdad('ninoLayer', 'nino');
  window.adultoLayer = crearCapaPorcentajeEdad('adultoLayer', 'adulto');
  window.adultomayorLayer = crearCapaPorcentajeEdad('adultomayorLayer', 'adultomayor');
  window.ancianoLayer = crearCapaPorcentajeEdad('ancianoLayer', 'anciano');
  ['jovenAdultoLayer','ninoLayer','adultoLayer','adultomayorLayer','ancianoLayer'].forEach(k => { if (window[k]) map.addLayer(window[k]); });
}
if (typeof crearCapaInternet === 'function') {
  window.internetNoLayer = crearCapaInternet('internetNoLayer', 'No');
  if (window.internetNoLayer) map.addLayer(window.internetNoLayer);
}
if (typeof crearCapaCondicionEconomica === 'function'){
  window.censoOcupadosLayer = crearCapaCondicionEconomica('censoOcupadosLayer', 'Ocupado');
  window.censoDesocupadosLayer = crearCapaCondicionEconomica('censoDesocupadosLayer', 'Desocupado');
  window.censoInactivosLayer = crearCapaCondicionEconomica('censoInactivosLayer', 'Inactivo');
  ['censoOcupadosLayer','censoDesocupadosLayer','censoInactivosLayer'].forEach(k => { if (window[k]) map.addLayer(window[k]); });
}
if (typeof crearCapaTotalPoblacion === 'function') {
  window.poblacionTotalLayer = crearCapaTotalPoblacion('poblacionTotalLayer');
  if (window.poblacionTotalLayer) map.addLayer(window.poblacionTotalLayer);
}

// =================================================================
// TOGGLE SATÉLITE
// =================================================================
const styleBtn = document.getElementById('toggleMapStyleBtn');
if (styleBtn) styleBtn.addEventListener('click', function() {
  const overlay = document.getElementById('map-overlay');
  const isSatelliteVisible = satelliteLayer.getVisible();
  satelliteLayer.setVisible(!isSatelliteVisible);
  baseLayer.setVisible(isSatelliteVisible);
  if (overlay) overlay.style.display = !isSatelliteVisible ? 'block' : 'none';
});

// Estado inicial de capas
[geojsonLayer, ejesestructurantesLayer, ejessecundariosLayer, centrosComercialesLayer]
  .forEach(layer => layer.setVisible(false));


// =================================================================
// Inicializar módulos
// =================================================================
if (typeof initGenerales === "function") initGenerales();
if (typeof initEspaciosUrbanos === "function") initEspaciosUrbanos();
if (typeof initAltaTransitabilidad === "function") initAltaTransitabilidad();
if (typeof initEducacion === "function") initEducacion();
if (typeof initCenso === "function") initCenso();
if (typeof initElecciones === "function") initElecciones();

// =================================================================
// Exclusividad de toggles
// =================================================================
if (window.makeExclusiveByVisibility && window.censoToggles)
  window.makeExclusiveByVisibility(window.censoToggles);
if (window.makeExclusiveByVisibility && window.eleccionesToggles)
  window.makeExclusiveByVisibility(window.eleccionesToggles);


// Loader
window.addEventListener("load", function () {
  const loader = document.getElementById("loader");
  if (loader) loader.style.display = "none";
});


}); // FIN DOMContentLoaded
