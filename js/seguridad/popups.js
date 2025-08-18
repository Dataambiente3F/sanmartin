// =================================================================
// Creación de POPUPS
// =================================================================
window.addEventListener('DOMContentLoaded', () => {
    if (!window.map) {
        console.error('❌ No se encontró el mapa al momento de crear los popups.');
        return;
    }

    function crearPopup(id, map, positioning = 'bottom-center', offset = [0, -60]) {
        const container = document.getElementById(id);
        return new ol.Overlay({
            element: container,
            positioning,
            offset,
            autoPan: true,
            autoPanAnimation: {
                duration: 250
            }
        });
    }

    window.popup = crearPopup('popup', map, 'bottom-center',[0, 0]);
    window.popupAlumbrado = crearPopup('popupalumbrado', map);
    window.popupComerciales = crearPopup('popup-comerciales', map);
    window.popupTotems = crearPopup('popup-totems', map);
    window.popupContenedores = crearPopup('popup-contenedores', map);
    window.popupCriticos = crearPopup('popup-criticos', map);
    window.popupRutas = crearPopup('popup-rutas', map);
    window.popupZonas = crearPopup('popup-zonas', map);



    map.addOverlay(popup);
    map.addOverlay(popupAlumbrado);
    map.addOverlay(popupComerciales);
    map.addOverlay(popupTotems);
    map.addOverlay(popupContenedores);
    map.addOverlay(popupCriticos);
    map.addOverlay(popupRutas);
    map.addOverlay(popupZonas);


    
    // Closers (botones para cerrar los popups)
    const setupCloser = (id, popup) => {
        const closer = document.getElementById(id);
        if (closer) {
            closer.onclick = function() {
                popup.setPosition(undefined);
                this.blur();
                return false;
            };
        }
    };

    setupCloser('popup-closer', popup);
    setupCloser('popup-comerciales-closer', popupComerciales);
    setupCloser('popup-totems-closer', popupTotems);
    setupCloser('popup-contenedores-closer', popupContenedores);
    setupCloser('popup-criticos-closer', popupCriticos);
    setupCloser('popup-rutas-closer', popupRutas);
    setupCloser('popup-alumbrado-closer', popupAlumbrado);
    setupCloser('popup-zonas-closer', popupZonas);

[
    popup, popupAlumbrado, popupComerciales, popupTotems,
    popupContenedores, popupCriticos, popupRutas, popupZonas
].forEach(p => p.setPosition(undefined));

});