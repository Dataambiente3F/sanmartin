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
    window.popupComerciales = crearPopup('popup-comerciales', map);
    window.popupCriticos = crearPopup('popup-criticos', map);



    map.addOverlay(popup);
    map.addOverlay(popupComerciales);
    map.addOverlay(popupCriticos);


    
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
    setupCloser('popup-criticos-closer', popupCriticos);

[
    popup, popupComerciales,
    popupCriticos
].forEach(p => p.setPosition(undefined));

});