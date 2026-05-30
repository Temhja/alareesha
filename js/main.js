/* ============================================
   AL-AREESHA RESTAURANT — MAIN JAVASCRIPT
   Cart, WhatsApp, Tabs, Animations, Lang
   ============================================ */

'use strict';

// ── CONFIGURATION ──
const CONFIG = {
  whatsappNumber: '9647811144842', // ✅ Al-Areesha WhatsApp
  restaurantName: 'مطعم العريشة',
  currency: 'دينار',
};

// ── STATE ──
let cart = [];
let currentMode = 'delivery';
let currentLang = 'ar';
let isCartOpen = false;

// ── DOM READY ──
document.addEventListener('DOMContentLoaded', () => {
  initLoader();
  initHeader();
  initSparks();
  initAOS();
  initTabs();
  initLang();
  initMouseRipple();
  initStickyTabs();
});

// ============================================
// LOADER
// ============================================
function initLoader() {
  const loader = document.getElementById('loader');
  setTimeout(() => {
    loader.classList.add('hidden');
    document.body.style.overflow = 'auto';
  }, 2000);
  document.body.style.overflow = 'hidden';
}

// ============================================
// HEADER SCROLL EFFECT
// ============================================
function initHeader() {
  const header = document.getElementById('header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 80) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }, { passive: true });
}

// ============================================
// FIRE SPARKS in HERO
// ============================================
function initSparks() {
  const container = document.getElementById('heroSparks');
  if (!container) return;

  const count = 18;
  for (let i = 0; i < count; i++) {
    const spark = document.createElement('div');
    spark.className = 'spark';
    spark.style.setProperty('--x', `${Math.random() * 100}%`);
    spark.style.setProperty('--y', `${Math.random() * 20}%`);
    spark.style.setProperty('--dur', `${2 + Math.random() * 4}s`);
    spark.style.setProperty('--del', `${Math.random() * 5}s`);
    // Random warm colors
    const colors = ['#E67E22', '#F39C12', '#E74C3C', '#D4A017', '#C0392B'];
    spark.style.background = colors[Math.floor(Math.random() * colors.length)];
    spark.style.width = `${3 + Math.random() * 5}px`;
    spark.style.height = spark.style.width;
    container.appendChild(spark);
  }
}

// ============================================
// ANIMATE ON SCROLL
// ============================================
function initAOS() {
  const els = document.querySelectorAll('[data-aos]');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  els.forEach((el, i) => {
    el.style.transitionDelay = `${(i % 6) * 0.07}s`;
    observer.observe(el);
  });
}

// Re-run AOS for dynamically shown panels
function refreshAOS() {
  const els = document.querySelectorAll('[data-aos]:not(.visible)');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  els.forEach(el => observer.observe(el));
}

// ============================================
// MOUSE RIPPLE ON MENU ITEMS
// ============================================
function initMouseRipple() {
  document.addEventListener('mousemove', (e) => {
    const card = e.target.closest('.menu-item');
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    card.style.setProperty('--mx', `${x}%`);
    card.style.setProperty('--my', `${y}%`);
  });
}

// ============================================
// STICKY TABS OFFSET
// ============================================
function initStickyTabs() {
  const header = document.getElementById('header');
  const tabs = document.getElementById('tabsWrapper');
  if (!tabs) return;

  const updateOffset = () => {
    const headerH = header.offsetHeight;
    tabs.style.top = `${headerH}px`;
  };
  updateOffset();
  window.addEventListener('resize', updateOffset);
  window.addEventListener('scroll', updateOffset, { passive: true });
}

// ============================================
// CATEGORY TABS
// ============================================
function initTabs() {
  // Set initial active
  showCat('breakfast');
}

function showCat(catId) {
  // Hide all panels
  document.querySelectorAll('.cat-panel').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));

  // Show selected
  const panel = document.getElementById(`cat-${catId}`);
  const tab = document.querySelector(`[data-cat="${catId}"]`);

  if (panel) {
    panel.classList.add('active');
    // Reset AOS inside this panel
    setTimeout(() => {
      panel.querySelectorAll('[data-aos]').forEach((el, i) => {
        el.style.transitionDelay = `${i * 0.06}s`;
        if (!el.classList.contains('visible')) {
          // Observe
          const obs = new IntersectionObserver(entries => {
            entries.forEach(entry => {
              if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                obs.unobserve(entry.target);
              }
            });
          }, { threshold: 0.05 });
          obs.observe(el);
        }
      });
    }, 50);
  }
  if (tab) {
    tab.classList.add('active');
    // Scroll tab into view
    tab.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
  }

  // Scroll menu into view
  const menu = document.getElementById('menu');
  const tabsH = document.getElementById('tabsWrapper')?.offsetHeight || 0;
  const headerH = document.getElementById('header')?.offsetHeight || 0;
  const menuTop = menu.getBoundingClientRect().top + window.scrollY - headerH - tabsH - 10;

  if (window.scrollY > menuTop + 100) {
    window.scrollTo({ top: menuTop, behavior: 'smooth' });
  }
}

// ============================================
// ORDER MODE
// ============================================
function setMode(mode) {
  currentMode = mode;
  document.querySelectorAll('.mode-card').forEach(c => c.classList.remove('active'));
  const card = document.querySelector(`[data-mode="${mode}"]`);
  if (card) card.classList.add('active');

  // Update cart badge
  const badges = {
    delivery: '🛵 توصيل',
    dine: '🪑 داخل المطعم',
    pickup: '🏠 استلام'
  };
  const badge = document.getElementById('cartModeBadge');
  if (badge) badge.textContent = badges[mode] || '';

  // Smooth scroll to menu
  setTimeout(() => {
    document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, 300);
}

// ============================================
// CART MANAGEMENT
// ============================================
function addToCart(name, price, emoji = '🍽️') {
  const existing = cart.find(item => item.name === name);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ name, price, emoji, qty: 1, id: Date.now() });
  }

  updateCartUI();
  animateCartButton();
  showAddFeedback(name);
}

function removeFromCart(id) {
  cart = cart.filter(item => item.id !== id);
  updateCartUI();
}

function changeQty(id, delta) {
  const item = cart.find(i => i.id === id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) removeFromCart(id);
  else updateCartUI();
}

function updateCartUI() {
  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const count = cart.reduce((sum, item) => sum + item.qty, 0);

  // Update count badges
  document.getElementById('cartCount').textContent = count;
  document.getElementById('floatCount').textContent = `${count} عنصر · ${total.toLocaleString('ar-IQ')} د`;

  // Float button
  const floatCart = document.getElementById('floatCart');
  floatCart.style.display = count > 0 ? 'flex' : 'none';

  // Cart drawer items
  const cartItemsEl = document.getElementById('cartItems');
  const cartFooter = document.getElementById('cartFooter');

  if (cart.length === 0) {
    cartItemsEl.innerHTML = `
      <div class="cart-empty">
        <span>🛒</span>
        <p>سلتك فارغة</p>
        <p class="cart-empty-en">Your cart is empty</p>
      </div>`;
    cartFooter.style.display = 'none';
  } else {
    cartItemsEl.innerHTML = cart.map(item => `
      <div class="cart-item-row">
        <div class="cart-item-emoji">${item.emoji}</div>
        <div class="cart-item-info">
          <div class="cart-item-name">${item.name}</div>
          <div class="cart-item-price">${(item.price * item.qty).toLocaleString('ar-IQ')} دينار</div>
        </div>
        <div class="cart-qty">
          <button class="qty-btn" onclick="changeQty(${item.id}, -1)">−</button>
          <span class="qty-num">${item.qty}</span>
          <button class="qty-btn" onclick="changeQty(${item.id}, +1)">+</button>
        </div>
      </div>
    `).join('');
    cartFooter.style.display = 'block';
    document.getElementById('cartTotal').textContent = `${total.toLocaleString('ar-IQ')} دينار`;
  }
}

function animateCartButton() {
  const btn = document.getElementById('cartBtn');
  const count = document.getElementById('cartCount');
  btn.style.transform = 'scale(1.2)';
  count.classList.add('bump');
  setTimeout(() => {
    btn.style.transform = '';
    count.classList.remove('bump');
  }, 300);
}

function showAddFeedback(name) {
  const toast = document.createElement('div');
  toast.className = 'add-toast';
  toast.innerHTML = `✓ أُضيف: ${name}`;
  toast.style.cssText = `
    position: fixed; bottom: 5rem; left: 50%; transform: translateX(-50%);
    background: var(--text-main); color: white; padding: 0.75rem 1.5rem;
    border-radius: 99px; font-size: 0.88rem; font-weight: 600; z-index: 2000;
    animation: floatUp 0.3s ease, fadeOut 0.4s ease 1.6s forwards;
    white-space: nowrap; box-shadow: 0 8px 25px rgba(0,0,0,0.2);
    border-right: 3px solid var(--tanoor);
  `;
  document.body.appendChild(toast);

  // Add fadeOut keyframe if not exists
  if (!document.getElementById('toastStyle')) {
    const style = document.createElement('style');
    style.id = 'toastStyle';
    style.textContent = `@keyframes fadeOut { to { opacity: 0; transform: translateX(-50%) translateY(-10px); } }`;
    document.head.appendChild(style);
  }

  setTimeout(() => toast.remove(), 2100);
}

// ============================================
// CART DRAWER
// ============================================
function toggleCart() {
  isCartOpen ? closeCart() : openCart();
}

function openCart() {
  isCartOpen = true;
  document.getElementById('cartDrawer').classList.add('open');
  document.getElementById('cartOverlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeCart() {
  isCartOpen = false;
  document.getElementById('cartDrawer').classList.remove('open');
  document.getElementById('cartOverlay').classList.remove('open');
  document.body.style.overflow = '';
}

document.getElementById('cartBtn')?.addEventListener('click', toggleCart);

// ============================================
// SEND ORDER TO WHATSAPP
// ============================================
function sendToWhatsApp() {
  if (cart.length === 0) {
    alert('سلتك فارغة! أضف أصنافاً أولاً.');
    return;
  }

  const note = document.getElementById('cartNote')?.value?.trim() || '';
  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  const modeLabels = {
    delivery: '🛵 توصيل',
    dine: '🪑 داخل المطعم',
    pickup: '🏠 استلام'
  };

  let msg = `🔥 *طلب جديد - ${CONFIG.restaurantName}*\n`;
  msg += `━━━━━━━━━━━━━━━━\n`;
  msg += `📋 *نوع الطلب:* ${modeLabels[currentMode]}\n\n`;
  msg += `🛒 *الأصناف:*\n`;

  cart.forEach(item => {
    msg += `  ${item.emoji} ${item.name}\n`;
    msg += `     الكمية: ${item.qty}  |  السعر: ${(item.price * item.qty).toLocaleString('ar-IQ')} دينار\n`;
  });

  msg += `\n━━━━━━━━━━━━━━━━\n`;
  msg += `💰 *المجموع: ${total.toLocaleString('ar-IQ')} دينار*\n`;

  if (note) {
    msg += `\n📝 *ملاحظات:*\n${note}\n`;
  }

  msg += `\n⏰ وقت الطلب: ${new Date().toLocaleTimeString('ar-IQ')}\n`;
  msg += `━━━━━━━━━━━━━━━━\n`;
  msg += `شكراً لاختيارك مطعم العريشة 🔥`;

  const encoded = encodeURIComponent(msg);
  const url = `https://wa.me/${CONFIG.whatsappNumber}?text=${encoded}`;
  window.open(url, '_blank');
}

// ============================================
// LANGUAGE TOGGLE
// ============================================
function initLang() {
  const btn = document.getElementById('langBtn');
  if (!btn) return;

  btn.addEventListener('click', () => {
    currentLang = currentLang === 'ar' ? 'en' : 'ar';
    btn.textContent = currentLang === 'ar' ? 'EN' : 'ع';

    const html = document.documentElement;
    if (currentLang === 'en') {
      html.setAttribute('dir', 'ltr');
      html.setAttribute('lang', 'en');
      document.body.classList.add('lang-en');
    } else {
      html.setAttribute('dir', 'rtl');
      html.setAttribute('lang', 'ar');
      document.body.classList.remove('lang-en');
    }
  });
}

// ============================================
// SMOOTH SCROLL FOR NAV LINKS
// ============================================
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', (e) => {
    const id = link.getAttribute('href');
    if (id === '#') return;
    const target = document.querySelector(id);
    if (!target) return;
    e.preventDefault();

    const headerH = document.getElementById('header')?.offsetHeight || 70;
    const top = target.getBoundingClientRect().top + window.scrollY - headerH - 10;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

// ============================================
// TABS KEYBOARD NAVIGATION
// ============================================
document.getElementById('tabsWrapper')?.addEventListener('keydown', (e) => {
  const tabs = [...document.querySelectorAll('.tab')];
  const active = document.querySelector('.tab.active');
  const idx = tabs.indexOf(active);

  if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
    e.preventDefault();
    const next = tabs[(idx + 1) % tabs.length];
    next?.click();
  } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
    e.preventDefault();
    const prev = tabs[(idx - 1 + tabs.length) % tabs.length];
    prev?.click();
  }
});

// ============================================
// ENGLISH MODE STYLES
// ============================================
const enStyles = document.createElement('style');
enStyles.textContent = `
  .lang-en .hero-ar, .lang-en .hero-desc { display: none !important; }
  .lang-en .hero-en, .lang-en .hero-desc-en { display: block !important; color: var(--text-mid); font-size: 1rem; }
  .lang-en .tab-ar { display: none; }
  .lang-en .tab-en { display: inline; font-size: 0.85rem; letter-spacing: 0; opacity: 1; }
  .lang-en .logo-ar { display: none; }
  .lang-en .logo-en { font-size: 1.2rem; font-weight: 700; color: var(--tanoor-dark); }
  .lang-en .title-ar { display: none; }
  .lang-en .title-en { font-size: clamp(1.8rem, 4vw, 2.5rem); font-weight: 700; color: var(--text-main); letter-spacing: 0; text-transform: none; }
  .lang-en .cat-title-en { font-size: clamp(1.8rem, 4vw, 2.8rem); color: white; font-weight: 700; display: block; letter-spacing: 0; text-transform: none; }
  .lang-en .cat-title { font-size: 0; }
  .lang-en .cat-title .cat-title-en { font-size: clamp(1.8rem, 4vw, 2.8rem); }
`;
document.head.appendChild(enStyles);

// ============================================
// PARALLAX HERO (subtle)
// ============================================
window.addEventListener('scroll', () => {
  const hero = document.getElementById('hero');
  if (!hero) return;
  const scrolled = window.scrollY;
  if (scrolled < window.innerHeight) {
    hero.style.setProperty('--scroll', scrolled + 'px');
  }
}, { passive: true });

// Add parallax variable support
const parallaxStyle = document.createElement('style');
parallaxStyle.textContent = `
  #hero .hero-tanoor-bg {
    transform: translateY(calc(var(--scroll, 0px) * 0.3));
    will-change: transform;
  }
`;
document.head.appendChild(parallaxStyle);

// ============================================
// ACTIVE NAV HIGHLIGHT ON SCROLL
// ============================================
const sections = ['hero', 'menu', 'about', 'contact'];
const navLinks = document.querySelectorAll('.desktop-nav a');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(id => {
    const el = document.getElementById(id);
    if (el && window.scrollY >= el.offsetTop - 150) {
      current = id;
    }
  });
  navLinks.forEach(link => {
    link.style.color = link.getAttribute('href') === `#${current}` ? 'var(--tanoor)' : '';
  });
}, { passive: true });

// ============================================
// INIT
// ============================================
updateCartUI();
