'use strict';

const WA_NUMBER = '9647811144842';
let cart = [], orderMode = 'delivery', lang = 'ar', cartOpen = false;

/* ── BOOT ── */
document.addEventListener('DOMContentLoaded', () => {
  initLoader();
  initHeader();
  initSparks();
  initAOS();
  initParallax();
  initSmoothScroll();
  initLang();
  showCat('breakfast');
  updateCartUI();
});

/* ── LOADER ── */
function initLoader() {
  document.body.style.overflow = 'hidden';
  setTimeout(() => {
    document.getElementById('loader').classList.add('hidden');
    document.body.style.overflow = '';
  }, 2000);
}

/* ── HEADER ── */
function initHeader() {
  const h = document.getElementById('header');
  window.addEventListener('scroll', () => {
    h.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });
}

/* ── SPARKS ── */
function initSparks() {
  const c = document.getElementById('heroParticles');
  if (!c) return;
  const colors = ['#C9A45D','#DEB97A','#A3262A','#E8701A','#fff'];
  for (let i = 0; i < 22; i++) {
    const s = document.createElement('div');
    s.className = 'spark';
    const size = 3 + Math.random() * 5;
    s.style.cssText = `
      width:${size}px;height:${size}px;
      background:${colors[Math.floor(Math.random()*colors.length)]};
      --x:${Math.random()*100}%;
      --y:${Math.random()*25}%;
      --dur:${2.5+Math.random()*4}s;
      --del:${Math.random()*6}s;
    `;
    c.appendChild(s);
  }
}

/* ── AOS ── */
function initAOS() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); }});
  }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });
  document.querySelectorAll('[data-aos]').forEach((el, i) => {
    el.style.transitionDelay = (i % 8) * 0.065 + 's';
    obs.observe(el);
  });
}
function refreshAOS() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); }});
  }, { threshold: 0.08 });
  document.querySelectorAll('[data-aos]:not(.visible)').forEach((el, i) => {
    el.style.transitionDelay = (i % 8) * 0.065 + 's';
    obs.observe(el);
  });
}

/* ── PARALLAX ── */
function initParallax() {
  window.addEventListener('scroll', () => {
    if (window.scrollY < window.innerHeight * 1.2)
      document.getElementById('hero')?.style.setProperty('--scroll', window.scrollY + 'px');
  }, { passive: true });
}

/* ── SMOOTH SCROLL ── */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const t = document.querySelector(a.getAttribute('href'));
      if (!t) return;
      e.preventDefault();
      const off = document.getElementById('header').offsetHeight + (document.getElementById('tabsBar')?.offsetHeight || 0);
      window.scrollTo({ top: t.getBoundingClientRect().top + window.scrollY - off - 8, behavior: 'smooth' });
    });
  });
}

/* ── TABS ── */
function showCat(id) {
  document.querySelectorAll('.cat-panel').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  const panel = document.getElementById('cat-' + id);
  const tab   = document.querySelector(`[data-cat="${id}"]`);
  if (panel) { panel.classList.add('active'); setTimeout(refreshAOS, 60); }
  if (tab)   { tab.classList.add('active'); tab.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' }); }
}

/* ── MODE ── */
function setMode(m) {
  orderMode = m;
  document.querySelectorAll('.mode-card').forEach(c => c.classList.toggle('active', c.dataset.mode === m));
  const labels = { delivery: '🛵 توصيل', dine: '🪑 داخل المطعم', pickup: '🏠 استلام' };
  const pill = document.getElementById('cartModePill');
  if (pill) pill.textContent = labels[m];
  setTimeout(() => document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 250);
}

/* ── CART ── */
function addToCart(name, price, img, emoji) {
  const ex = cart.find(i => i.name === name);
  if (ex) ex.qty++;
  else cart.push({ id: Date.now(), name, price, img: img || '', emoji: emoji || '🍽️', qty: 1 });
  updateCartUI();
  bumpCartBtn();
  showToast(name);
}
function changeQty(id, d) {
  const item = cart.find(i => i.id === id);
  if (!item) return;
  item.qty += d;
  if (item.qty <= 0) cart = cart.filter(i => i.id !== id);
  updateCartUI();
}
function updateCartUI() {
  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const count = cart.reduce((s, i) => s + i.qty, 0);
  ['cartCount'].forEach(id => { const el = document.getElementById(id); if (el) el.textContent = count; });
  const fc = document.getElementById('floatCart');
  if (fc) { fc.style.display = count > 0 ? 'flex' : 'none'; fc.querySelector('#floatCount').textContent = count + ' | ' + total.toLocaleString('ar-IQ') + ' د'; }
  const ci = document.getElementById('cartItems');
  const cf = document.getElementById('cartFooter');
  if (!ci) return;
  if (!cart.length) {
    ci.innerHTML = `<div class="cart-empty"><span>🛒</span><p>سلتك فارغة</p><p class="en">Your cart is empty</p></div>`;
    if (cf) cf.style.display = 'none';
  } else {
    ci.innerHTML = cart.map(item => `
      <div class="cart-item-row">
        <div class="cart-item-img">${item.img ? `<img src="${item.img}" onerror="this.outerHTML='${item.emoji}'">` : item.emoji}</div>
        <div class="cart-item-info">
          <div class="cart-item-name">${item.name}</div>
          <div class="cart-item-price">${(item.price * item.qty).toLocaleString('ar-IQ')} دينار</div>
        </div>
        <div class="cart-qty">
          <button class="qty-btn" onclick="changeQty(${item.id},-1)">−</button>
          <span class="qty-num">${item.qty}</span>
          <button class="qty-btn" onclick="changeQty(${item.id},+1)">+</button>
        </div>
      </div>`).join('');
    if (cf) { cf.style.display = 'block'; document.getElementById('cartTotal').textContent = total.toLocaleString('ar-IQ') + ' دينار'; }
  }
}
function bumpCartBtn() {
  const b = document.getElementById('cartBtn'), c = document.getElementById('cartCount');
  if (b) { b.style.transform = 'scale(1.25)'; setTimeout(() => b.style.transform = '', 300); }
  if (c) { c.classList.add('bump'); setTimeout(() => c.classList.remove('bump'), 300); }
}
function showToast(name) {
  const t = document.createElement('div');
  t.style.cssText = 'position:fixed;bottom:5.5rem;left:50%;transform:translateX(-50%);background:#4A3428;color:#F8F5F0;padding:.65rem 1.4rem;border-radius:99px;font-size:.84rem;font-weight:600;z-index:3000;white-space:nowrap;box-shadow:0 8px 24px rgba(0,0,0,.2);border-right:3px solid #A3262A;animation:fadeSlideIn .3s ease';
  t.textContent = '✓ أُضيف: ' + name;
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 2000);
}

/* ── CART DRAWER ── */
function toggleCart()  { cartOpen ? closeCart() : openCart(); }
function openCart()    { cartOpen = true; document.getElementById('cartDrawer').classList.add('open'); document.getElementById('cartOverlay').classList.add('open'); document.body.style.overflow = 'hidden'; document.getElementById('cartBtn').onclick = closeCart; }
function closeCart()   { cartOpen = false; document.getElementById('cartDrawer').classList.remove('open'); document.getElementById('cartOverlay').classList.remove('open'); document.body.style.overflow = ''; document.getElementById('cartBtn').onclick = openCart; }
document.getElementById('cartBtn').onclick = openCart;

/* ── WHATSAPP ── */
function sendToWhatsApp() {
  if (!cart.length) { alert('سلتك فارغة!'); return; }
  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const modeLabel = { delivery: '🛵 توصيل', dine: '🪑 داخل المطعم', pickup: '🏠 استلام' }[orderMode];
  const note = document.getElementById('cartNote')?.value?.trim() || '';
  let msg = `🔥 *طلب جديد - مطعم العريشة*\n━━━━━━━━━━━━━━━\n📋 *نوع الطلب:* ${modeLabel}\n\n🛒 *الأصناف:*\n`;
  cart.forEach(i => { msg += `  ${i.emoji} ${i.name}\n     الكمية: ${i.qty}  |  ${(i.price * i.qty).toLocaleString('ar-IQ')} دينار\n`; });
  msg += `\n━━━━━━━━━━━━━━━\n💰 *المجموع: ${total.toLocaleString('ar-IQ')} دينار*\n`;
  if (note) msg += `\n📝 *ملاحظات:*\n${note}\n`;
  msg += `\n⏰ ${new Date().toLocaleTimeString('ar-IQ')}\n━━━━━━━━━━━━━━━\nشكراً لاختيارك مطعم العريشة 🔥`;
  window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank');
}

/* ── LANG ── */
function initLang() {
  document.getElementById('langBtn')?.addEventListener('click', () => {
    lang = lang === 'ar' ? 'en' : 'ar';
    const html = document.documentElement;
    html.setAttribute('lang', lang);
    html.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
    document.getElementById('langBtn').textContent = lang === 'ar' ? 'EN' : 'ع';
    document.body.classList.toggle('en-mode', lang === 'en');
  });
}
