// js/funciones/seleccionExclusiva.js
(function () {
  // toggleList = [{ layer, update }, ...]
  function makeExclusiveByVisibility(toggleList) {
    if (!Array.isArray(toggleList)) return;
    let internal = false;

    toggleList.forEach((t) => {
      if (!t || !t.layer || typeof t.layer.on !== 'function') return;

      t.layer.on('change:visible', () => {
        // Si la visibilidad cambió por nosotros, no recursar
        if (internal) return;

        // Si esta capa se prendió, apagamos todas las demás del grupo
        if (t.layer.getVisible()) {
          internal = true;
          toggleList.forEach((other) => {
            if (other && other !== t && other.layer && other.layer.getVisible()) {
              other.layer.setVisible(false);
              if (typeof other.update === 'function') other.update();
            }
          });
          if (typeof t.update === 'function') t.update();
          internal = false;
        } else {
          // Si se apagó, solo actualizamos su icono
          if (typeof t.update === 'function') t.update();
        }
      });
    });
  }

  // Exponerla en window para poder llamarla desde map.js
  window.makeExclusiveByVisibility = makeExclusiveByVisibility;
})();