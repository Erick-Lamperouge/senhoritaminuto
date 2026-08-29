export function createPortalController({ left, right, interaction, clamp }) {
  const globals = [left, right];

  function resetGlobal(portal) {
    portal.classList.remove('is-open', 'future-color', 'anchored');
    portal.style.left = '';
    portal.style.right = '';
    portal.style.top = '';
  }

  function closeGlobals() {
    globals.forEach(resetGlobal);
  }

  function closeInteraction() {
    interaction.classList.remove('active');
  }

  function closeAll() {
    closeGlobals();
    closeInteraction();
  }

  function positionGlobal(portal, x, y) {
    portal.classList.add('anchored');
    portal.style.right = 'auto';
    portal.style.left = `${clamp(x, 6, Math.max(6, window.innerWidth - 96))}px`;
    portal.style.top = `${clamp(y, 52, Math.max(52, window.innerHeight - 52))}px`;
  }

  function openGlobal(portal, { x, y, future = false } = {}) {
    if (Number.isFinite(x) && Number.isFinite(y)) positionGlobal(portal, x, y);
    portal.classList.toggle('future-color', future);
    portal.classList.add('is-open');
  }

  function closeGlobal(portal) {
    resetGlobal(portal);
  }

  function openInteraction({ power = false } = {}) {
    interaction.classList.toggle('power-portal', power);
    interaction.classList.add('active');
  }

  function closeInteractionPortal() {
    interaction.classList.remove('active', 'power-portal');
  }

  return {
    closeAll,
    closeGlobals,
    openGlobal,
    closeGlobal,
    openInteraction,
    closeInteraction: closeInteractionPortal,
  };
}
