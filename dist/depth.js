export function enableDepth(element, reducedMotion) {
  let frame;
  function reset() { cancelAnimationFrame(frame); element.style.setProperty('--rx', '0deg'); element.style.setProperty('--ry', '0deg'); }
  element.addEventListener('pointermove', event => {
    if (reducedMotion.matches || event.pointerType === 'touch') return;
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(() => {
      const bounds = element.getBoundingClientRect();
      const x = (event.clientX - bounds.left) / bounds.width - .5;
      const y = (event.clientY - bounds.top) / bounds.height - .5;
      element.style.setProperty('--ry', `${x * 7}deg`);
      element.style.setProperty('--rx', `${-y * 5}deg`);
    });
  }, { passive: true });
  element.addEventListener('pointerleave', reset);
  reducedMotion.addEventListener('change', reset);
}
