const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
const email = 'bruno.olivcarvalho@gmail.com';
document.querySelector('#year').textContent = new Date().getFullYear();

// Content remains visible if JavaScript or observer support is unavailable.
if ('IntersectionObserver' in window) {
  document.documentElement.classList.add('js-reveal');
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('is-visible'); revealObserver.unobserve(entry.target); }
    });
  }, { threshold: 0.08 });
  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
}

const menuButton = document.querySelector('.menu-toggle');
const mobileNav = document.querySelector('.mobile-nav');
function closeMenu() { menuButton.setAttribute('aria-expanded', 'false'); menuButton.setAttribute('aria-label', 'Abrir menu'); mobileNav.hidden = true; }
menuButton.addEventListener('click', () => {
  const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!isOpen));
  menuButton.setAttribute('aria-label', isOpen ? 'Abrir menu' : 'Fechar menu');
  mobileNav.hidden = isOpen;
});
mobileNav.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
document.addEventListener('keydown', event => { if (event.key === 'Escape' && !mobileNav.hidden) { closeMenu(); menuButton.focus(); } });
document.addEventListener('click', event => { if (!event.target.closest('.header')) closeMenu(); });
matchMedia('(min-width: 721px)').addEventListener('change', e => { if (e.matches) closeMenu(); });

const filters = [...document.querySelectorAll('.filter')];
const cards = [...document.querySelectorAll('.project-card')];
filters.forEach(button => button.addEventListener('click', () => {
  const category = button.dataset.filter;
  filters.forEach(filter => { const active = filter === button; filter.classList.toggle('active', active); filter.setAttribute('aria-pressed', String(active)); });
  let count = 0;
  cards.forEach(card => {
    const show = category === 'all' || card.dataset.category === category;
    card.hidden = !show;
    card.classList.remove('filter-enter');
    if (show) { count++; card.classList.add('is-visible'); }
  });
  // Start the transition only after the new grid has been laid out.
  requestAnimationFrame(() => cards.filter(card => !card.hidden).forEach(card => card.classList.add('filter-enter')));
  document.querySelector('#project-count').textContent = `${count} ${count === 1 ? 'projeto' : 'projetos'}`;
}));

const navLinks = [...document.querySelectorAll('.desktop-nav a, .mobile-nav a')];
const sections = [...document.querySelectorAll('main section[id]')];
const backTop = document.querySelector('.back-top');
let ticking = false;
function updateScroll() {
  const line = Math.min(innerHeight * .35, 250);
  let current = sections[0].id;
  sections.forEach(section => { if (section.getBoundingClientRect().top <= line) current = section.id; });
  if (innerHeight + scrollY >= document.documentElement.scrollHeight - 50) current = 'contato';
  navLinks.forEach(link => { const active = link.hash === `#${current}`; link.classList.toggle('active', active); if (active) link.setAttribute('aria-current', 'location'); else link.removeAttribute('aria-current'); });
  backTop.classList.toggle('visible', scrollY > 500);
  ticking = false;
}
addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(updateScroll); } }, { passive: true });
updateScroll();

let copyTimer;
const copyButton = document.querySelector('#copy-email');
const copyFeedback = document.querySelector('#copy-feedback');
copyButton.addEventListener('click', async () => {
  clearTimeout(copyTimer);
  let copied = false;
  try { await navigator.clipboard.writeText(email); copied = true; }
  catch {
    const field = document.createElement('textarea');
    field.value = email; field.setAttribute('readonly', ''); field.style.cssText = 'position:fixed;left:-9999px;top:0';
    document.body.append(field); field.select();
    try { copied = document.execCommand('copy'); } catch { copied = false; }
    field.remove(); copyButton.focus();
  }
  if (copied) {
    copyFeedback.textContent = 'E-mail copiado! Pronto para começar uma conversa.';
    copyButton.querySelector('use').setAttribute('href', '#check'); copyButton.setAttribute('aria-label', 'E-mail copiado');
  } else { copyFeedback.textContent = `Não foi possível copiar. Selecione o endereço: ${email}`; }
  copyTimer = setTimeout(() => { copyFeedback.textContent = ''; copyButton.querySelector('use').setAttribute('href', '#copy'); copyButton.setAttribute('aria-label', 'Copiar endereço de e-mail'); }, 6000);
});

const typedText = document.querySelector('#typed-text');
const phrases = ['Do conceito à experiência.', 'Uma ideia. Múltiplas plataformas.', 'Tecnologia que faz sentido.'];
let typingTimer, phraseIndex = 0, character = phrases[0].length, deleting = true;
function typeNext() {
  if (reducedMotion.matches || document.hidden) return;
  const phrase = phrases[phraseIndex];
  character += deleting ? -1 : 1;
  typedText.textContent = phrase.slice(0, Math.max(0, character));
  let delay = deleting ? 30 : 65;
  if (character <= 0) { deleting = false; phraseIndex = (phraseIndex + 1) % phrases.length; delay = 300; }
  else if (!deleting && character >= phrase.length) { deleting = true; delay = 3200; }
  typingTimer = setTimeout(typeNext, delay);
}
function resumeTyping() { clearTimeout(typingTimer); if (!reducedMotion.matches && !document.hidden) typingTimer = setTimeout(typeNext, 3000); else typedText.textContent = phrases[0]; }
resumeTyping();
document.addEventListener('visibilitychange', resumeTyping);
reducedMotion.addEventListener('change', resumeTyping);

// Activate depth only on capable devices and only while the hero is visible.
const lowPower = navigator.connection?.saveData || (navigator.deviceMemory && navigator.deviceMemory <= 4) || (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4);
if (lowPower) document.documentElement.classList.add('light-effects');
const heroArt = document.querySelector('.hero-art');
let depthLoaded = false;
async function loadDepth() {
  if (depthLoaded || reducedMotion.matches || lowPower || !matchMedia('(hover:hover) and (pointer:fine)').matches) return;
  depthLoaded = true;
  try { const { enableDepth } = await import('./depth.js'); enableDepth(heroArt, reducedMotion); } catch { /* Static composition remains usable. */ }
}
if ('IntersectionObserver' in window) {
  const depthObserver = new IntersectionObserver(entries => { if (entries.some(e => e.isIntersecting)) loadDepth(); });
  depthObserver.observe(heroArt);
}
