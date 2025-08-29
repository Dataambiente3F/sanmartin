function initGenerales() {
//----------------------------------- SECCIÓN GENERALES (¡AHORA SÚPER LIMPIA!) ---------------------------------//

    window.generalesToggles = []; // Se declara vacío primero

    // 1. CREAMOS LA FUNCIÓN QUE VERIFICA EL ESTADO DEL PADRE "GENERALES"
    const actualizarEstadoPadreGenerales = () => {
        const parentIcon = document.getElementById('generalesToggleIcon');
        if (!parentIcon) return;
        const algunaCapaHijaVisible = generalesToggles.some(toggle => toggle.layer.getVisible());
        parentIcon.className = algunaCapaHijaVisible ? 'bi bi-map-fill' : 'bi bi-map';
    };

    // 2. CONFIGURAMOS LAS CAPAS HIJAS, PASANDO LA FUNCIÓN VERIFICADORA
    window.generalesToggles = [
        setupLayerToggleWithEye('togglePartidoBtn', 'partidoLayerIcon', window.partidoLayer, 'generalesToggleIcon', 'bi-map-fill', actualizarEstadoPadreGenerales),
        setupLayerToggleWithEye('toggleLocalidadesBtn', 'localidadesLayerIcon', window.localidadesLayer, 'generalesToggleIcon', 'bi-map-fill', actualizarEstadoPadreGenerales)
    ];

    // 3. ACTUALIZAMOS EL MANEJADOR DEL BOTÓN PRINCIPAL "GENERALES"
    document.getElementById('generalesToggle').addEventListener('click', function(e) {
        e.stopPropagation();
        const icon = document.getElementById('generalesToggleIcon');
        const isCurrentlyOn = icon.classList.contains('bi-map-fill');
        
        if (isCurrentlyOn) {
            icon.className = 'bi bi-map';
            generalesToggles.forEach(toggle => {
                if (toggle) {
                    toggle.layer.setVisible(false);
                    toggle.update(); // Actualiza el ícono del hijo
                }
            });
        }
        else {
            icon.className = 'bi bi-map-fill'; // Prende al padre
            // Y ahora, prende a todos los hijos también
            generalesToggles.forEach(toggle => {
                if (toggle) {
                    toggle.layer.setVisible(true);
                    toggle.update(); // Pide a cada botón que actualice su ícono
                }
            });
        }
    });

    // 4. ACTUALIZAR
    actualizarEstadoPadreGenerales();

//--------------------------------- FIN SECCIÓN GENERALES -------------------------------//

}