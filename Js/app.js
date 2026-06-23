/* ============================================================
   StorefrontKit — app.js  (shared across all pages)
   ============================================================ */

window.SK = window.SK || {};

// ── CONFIG ─────────────────────────────────────────────────
SK.config = {};
SK.products = [];

SK.loadConfig = async function () {
  try {
    const r = await fetch('./config.json?' + Date.now());
    SK.config = await r.json();
  } catch (e) {
    SK.config = { store: { name: 'My Store', currencySymbol: '$' }, design: {}, contact: { channels: {}, checkoutChannels: [] }, features: {}, api: {}, checkout: {}, footer: {} };
  }
  SK.applyDesign();
  return SK.config;
};

SK.applyDesign = function () {
  const d = SK.config.design || {};
  const theme = d.theme || 'dark';
  const dark = theme !== 'light';
  const r = document.documentElement;
  r.setAttribute('data-theme', theme);
  r.style.setProperty('--primary', d.primaryColor || '#6366f1');
  r.style.setProperty('--accent', d.accentColor || '#f59e0b');
  r.style.setProperty('--success', d.successColor || '#22c55e');
  r.style.setProperty('--danger', d.dangerColor || '#ef4444');
  const bg = d.bgColor || (dark ? '#0a0a0f' : '#f4f4f8');
  const bg2 = d.cardColor || (dark ? '#12121a' : '#ffffff');
  const bg3 = dark ? '#1a1a26' : '#eeeef4';
  r.style.setProperty('--bg', bg);
  r.style.setProperty('--bg2', bg2);
  r.style.setProperty('--bg3', bg3);
  r.style.setProperty('--border', dark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.08)');
  r.style.setProperty('--text', dark ? '#f0f0f8' : '#111118');
  r.style.setProperty('--text2', dark ? '#8888aa' : '#555570');
  r.style.setProperty('--text3', dark ? '#555570' : '#aaaacc');
  const rad = parseInt(d.borderRadius) || 16;
  r.style.setProperty('--radius-sm', Math.max(4, rad - 6) + 'px');
  r.style.setProperty('--radius-md', rad + 'px');
  r.style.setProperty('--radius-lg', (rad + 6) + 'px');
  r.style.setProperty('--radius-full', d.buttonStyle === 'sharp' ? '8px' : d.buttonStyle === 'rounded' ? '12px' : '50px');
  r.style.setProperty('--font-head', `'${d.headingFont || 'Syne'}', sans-serif`);
  r.style.setProperty('--font-body', `'${d.bodyFont || 'DM Sans'}', sans-serif`);
  // Update Google Fonts link
  const hf = d.headingFont || 'Syne';
  const bf = d.bodyFont || 'DM Sans';
  if (hf !== 'Syne' || bf !== 'DM Sans') {
    const existing = document.getElementById('gfonts');
    if (existing) existing.href = `https://fonts.googleapis.com/css2?family=${hf.replace(/ /g,'+')}:wght@400;600;700;800&family=${bf.replace(/ /g,'+')}:wght@300;400;500;600&display=swap`;
  }
  // Apply announcement bar
  const ann = SK.config.announcement || {};
  const bar = document.getElementById('announcementBar');
  if (bar) {
    if (ann.enabled) {
      bar.style.display = 'block';
      bar.style.background = ann.bgColor || '#f59e0b';
      bar.style.color = ann.textColor || '#000';
      bar.textContent = ann.text || '';
    } else {
      bar.style.display = 'none';
    }
  }
  // Store name
  const nameEls = document.querySelectorAll('[data-store-name]');
  nameEls.forEach(el => { el.textContent = SK.config.store?.name || 'My Store'; });
  // Logo
  SK._applyLogo();
  // Favicon
  const fav = SK.config.store?.favicon;
  if (fav) { let l = document.querySelector("link[rel='icon']") || document.createElement('link'); l.rel = 'icon'; l.href = fav; document.head.appendChild(l); }
  // Page title
  if (!document.title.includes('—')) document.title = SK.config.store?.name || 'My Store';
};

SK._applyLogo = function () {
  const el = document.getElementById('navLogoWrap');
  if (!el) return;
  const s = SK.config.store || {};
  if (s.logo) {
    el.innerHTML = `<img src="${s.logo}" alt="${s.name}" style="height:32px;border-radius:6px;vertical-align:middle;margin-right:8px"><span data-store-name>${s.name || 'My Store'}</span>`;
  } else {
    el.innerHTML = `<span data-store-name>${s.name || 'My Store'}</span>`;
  }
};

// ── PRODUCTS ────────────────────────────────────────────────
SK.loadProducts = async function () {
  const api = SK.config.api || {};
  if (!api.githubRepo) { SK.products = []; return []; }
  try {
    const [owner, repo] = api.githubRepo.split('/');
    const headers = { 'Accept': 'application/vnd.github.v3+json' };
    if (api.githubToken && api.githubToken !== 'YOUR_GITHUB_TOKEN_HERE') headers['Authorization'] = 'token ' + api.githubToken;
    const r = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/products.json`, { headers });
    if (!r.ok) { SK.products = []; return []; }
    const data = await r.json();
    SK.products = JSON.parse(atob(data.content.replace(/\n/g, '')));
  } catch (e) { SK.products = []; }
  return SK.products;
};

SK.getProductImages = function (p) {
  if (Array.isArray(p.images) && p.images.length) return p.images;
  if (p.image) return [p.image];
  return ['https://placehold.co/600x600/1a1a26/555570?text=No+Image'];
};

// ── CART ────────────────────────────────────────────────────
SK.getCart = function () { try { return JSON.parse(localStorage.getItem('sk_cart') || '[]'); } catch { return []; } };
SK.saveCart = function (cart) { localStorage.setItem('sk_cart', JSON.stringify(cart)); SK._updateCartBadge(); };

SK.addToCart = function (product, qty = 1) {
  const cart = SK.getCart();
  const existing = cart.find(x => x.id === product.id);
  if (existing) existing.qty += qty;
  else cart.push({ id: product.id, name: product.name, price: product.price, image: SK.getProductImages(product)[0], qty });
  SK.saveCart(cart);
  SK.toast(`${product.name} added to cart`, 'success');
};

SK.removeFromCart = function (id) {
  SK.saveCart(SK.getCart().filter(x => x.id !== id));
};

SK.changeQty = function (id, delta) {
  const cart = SK.getCart();
  const item = cart.find(x => x.id === id);
  if (!item) return;
  item.qty = Math.max(0, item.qty + delta);
  SK.saveCart(cart.filter(x => x.qty > 0));
};

SK.clearCart = function () { localStorage.removeItem('sk_cart'); SK._updateCartBadge(); };

SK.cartTotal = function () {
  return SK.getCart().reduce((s, i) => s + i.price * i.qty, 0);
};

SK.cartCount = function () {
  return SK.getCart().reduce((s, i) => s + i.qty, 0);
};

SK._updateCartBadge = function () {
  const count = SK.cartCount();
  document.querySelectorAll('[data-cart-count]').forEach(el => {
    el.textContent = count;
    el.style.display = count > 0 ? 'flex' : 'none';
  });
};

// ── FORMAT ─────────────────────────────────────────────────
SK.price = function (amount) {
  const sym = SK.config.store?.currencySymbol || '$';
  return sym + parseFloat(amount).toFixed(2);
};

SK.stockLabel = function (s) {
  if (s === 'out_of_stock') return { label: 'Out of Stock', cls: 'stock-out' };
  if (s === 'limited') return { label: 'Limited Stock', cls: 'stock-limited' };
  return { label: 'In Stock', cls: 'stock-in' };
};

// ── CONTACT ─────────────────────────────────────────────────
// Icons are inline SVG (no emoji) so every page looks the same
// professionally on every OS/browser instead of relying on emoji fonts.
SK.ICONS = {
  whatsapp:  '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.5 14.4c-.3-.1-1.7-.8-2-.9-.3-.1-.5-.1-.7.1-.2.3-.7.9-.9 1-.2.2-.4.2-.7.1-1-.5-2.5-1.5-3.4-2.9-.2-.3-.1-.5.1-.7.2-.2.4-.5.6-.7.2-.2.2-.4.1-.6-.1-.2-.7-1.7-1-2.3-.2-.5-.5-.4-.7-.4-.2 0-.5 0-.7.2-.8.8-1.2 1.7-1.2 2.8 0 2.5 2.3 5.4 2.6 5.7.3.4 2.2 3 5.4 4.1 2.9 1 2.9.7 3.4.6.5-.1 1.7-.7 1.9-1.4.3-.7.3-1.3.2-1.4-.1-.1-.3-.2-.6-.3zM12 2C6.5 2 2 6.5 2 12c0 1.9.5 3.7 1.5 5.2L2 22l4.9-1.3C8.4 21.5 10.1 22 12 22c5.5 0 10-4.5 10-10S17.5 2 12 2z"/></svg>',
  telegram:  '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M21.9 4.7 18.6 20c-.2 1-.8 1.2-1.7.8l-4.6-3.4-2.2 2.1c-.2.2-.4.4-.9.4l.3-4.6 8.4-7.6c.4-.3-.1-.5-.5-.2L7 12.7l-4.5-1.4c-1-.3-1-1 .2-1.4L20.6 3.4c.8-.3 1.6.2 1.3 1.3z"/></svg>',
  instagram: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="3.7"/><circle cx="17.2" cy="6.8" r="1"/></svg>',
  facebook:  '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M14 13.5h2.5l1-4H14V7.5c0-1 .5-2 2-2h1.7V2.1C17.3 2 16 2 14.6 2 11.5 2 9.5 4 9.5 7.2v2.3H6.5v4h3v8.4h4.5V13.5z"/></svg>',
  email:     '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg>',
  phone:     '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M6.6 10.8c1.4 2.7 3.7 5 6.4 6.4l2.1-2.1c.3-.3.7-.4 1-.2 1.2.5 2.5.8 3.9.8.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.6 21 3 13.4 3 4c0-.6.4-1 1-1h3.3c.6 0 1 .4 1 1 0 1.4.3 2.7.8 3.9.1.3.1.7-.2 1l-2.1 2.1z"/></svg>',
  twitter:   '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.3 3h3l-6.6 7.5L21 21h-6.1l-4.8-6.3L4.6 21H1.5l7.1-8-7-10h6.2l4.4 5.8L17.3 3z"/></svg>',
  cart:      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>',
  heart:     '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z"/></svg>',
  star:      '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.4l3 6.2 6.8.9-4.9 4.7 1.2 6.7L12 17.6 5.9 20.9l1.2-6.7-4.9-4.7 6.8-.9z"/></svg>',
  truck:     '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 4h11v11H3z"/><path d="M14 9h4l3 3v3h-7z"/><circle cx="7" cy="18" r="2"/><circle cx="18" cy="18" r="2"/></svg>',
  shield:    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 3l8 3.5v5.5c0 5-3.4 8-8 9.5-4.6-1.5-8-4.5-8-9.5V6.5z"/><path d="m9 12 2 2 4-4"/></svg>',
  refresh:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 12a9 9 0 0 1 15.3-6.4L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-15.3 6.4L3 16"/><path d="M3 21v-5h5"/></svg>',
  lock:      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="11" width="16" height="9" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>',
  check:     '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="m5 12 5 5 9-10"/></svg>',
  arrow:     '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14"/><path d="m13 6 6 6-6 6"/></svg>',
  play:      '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>',
  menu:      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M3 12h18M3 18h18"/></svg>',
  close:     '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 6l12 12M18 6 6 18"/></svg>',
  user:      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 16-4 16 0"/></svg>',
  leaf:      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 21c0-9 5-16 14-16-1 9-7 14-14 16z"/></svg>',
  bolt:      '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M13 2 4 14h6l-1 8 9-12h-6z"/></svg>',
};
SK.icon = function (name, size) {
  const s = size || 18;
  return `<span class="sk-icon" style="display:inline-flex;width:${s}px;height:${s}px;flex-shrink:0">${SK.ICONS[name] || ''}</span>`;
};

SK.CHANNEL_META = {
  whatsapp:  { label: 'WhatsApp',  icon: SK.ICONS.whatsapp,  color: '#25D366', bg: '#25D366' },
  telegram:  { label: 'Telegram',  icon: SK.ICONS.telegram,  color: '#2AABEE', bg: '#2AABEE' },
  instagram: { label: 'Instagram', icon: SK.ICONS.instagram, color: '#E1306C', bg: '#E1306C' },
  facebook:  { label: 'Facebook',  icon: SK.ICONS.facebook,  color: '#1877F2', bg: '#1877F2' },
  email:     { label: 'Email',     icon: SK.ICONS.email,     color: '#6366f1', bg: '#6366f1' },
  phone:     { label: 'Call',      icon: SK.ICONS.phone,     color: '#22c55e', bg: '#22c55e' },
  twitter:   { label: 'Twitter/X', icon: SK.ICONS.twitter,   color: '#1DA1F2', bg: '#1DA1F2' },
};

SK.contactUrl = function (channel, message) {
  const channels = SK.config.contact?.channels || {};
  const val = channels[channel] || '';
  if (!val) return null;
  const enc = encodeURIComponent(message || '');
  switch (channel) {
    case 'whatsapp':  return `https://wa.me/${val.replace(/\D/g,'')}?text=${enc}`;
    case 'telegram':  return val.startsWith('@') ? `https://t.me/${val.slice(1)}` : `https://t.me/${val.replace(/\D/g,'')}`;
    case 'instagram': return `https://instagram.com/${val.replace('@','')}`;
    case 'facebook':  return val.startsWith('http') ? val : `https://facebook.com/${val}`;
    case 'email':     return `mailto:${val}?subject=Order&body=${enc}`;
    case 'phone':     return `tel:${val}`;
    case 'twitter':   return `https://twitter.com/${val.replace('@','')}`;
    default: return val;
  }
};

SK.buildOrderMessage = function () {
  const cart = SK.getCart();
  const base = SK.config.contact?.orderMessage || 'Hi! I want to place an order.';
  const lines = cart.map(i => `• ${i.name} x${i.qty} = ${SK.price(i.price * i.qty)}`).join('\n');
  const total = SK.cartTotal();
  const orderId = SK._getOrderId();
  return `${base}\n\n*Order #${orderId}*\n${lines}\n\n*Total: ${SK.price(total)}*\n*Payment: Cash on Delivery*`;
};

SK._getOrderId = function () {
  if (!sessionStorage.getItem('sk_oid')) sessionStorage.setItem('sk_oid', 'ORD' + Date.now().toString(36).toUpperCase());
  return sessionStorage.getItem('sk_oid');
};

// ── RECENTLY VIEWED ─────────────────────────────────────────
SK.addRecentlyViewed = function (id) {
  let rv = JSON.parse(localStorage.getItem('sk_rv') || '[]');
  rv = [id, ...rv.filter(x => x !== id)].slice(0, 8);
  localStorage.setItem('sk_rv', JSON.stringify(rv));
};

SK.getRecentlyViewed = function () {
  return JSON.parse(localStorage.getItem('sk_rv') || '[]');
};

// ── TOAST ───────────────────────────────────────────────────
let _toastTimer;
SK.toast = function (msg, type = '') {
  let t = document.getElementById('_sk_toast');
  if (!t) {
    t = document.createElement('div'); t.id = '_sk_toast';
    t.style.cssText = 'position:fixed;bottom:80px;left:50%;transform:translateX(-50%) translateY(20px);background:var(--bg2);border:1px solid var(--border);border-left:3px solid var(--primary);padding:12px 20px;border-radius:10px;font-size:14px;font-weight:500;z-index:9999;opacity:0;transition:opacity .25s,transform .25s;white-space:nowrap;pointer-events:none;font-family:var(--font-body);color:var(--text);';
    document.body.appendChild(t);
  }
  t.textContent = msg;
  t.style.borderLeftColor = type === 'success' ? 'var(--success)' : type === 'error' ? 'var(--danger)' : 'var(--primary)';
  t.style.opacity = '1'; t.style.transform = 'translateX(-50%) translateY(0)';
  clearTimeout(_toastTimer);
  _toastTimer = setTimeout(() => { t.style.opacity = '0'; t.style.transform = 'translateX(-50%) translateY(20px)'; }, 2800);
};

// ── NAV RENDERER ─────────────────────────────────────────────
SK.renderNav = function (activePage = 'home') {
  const nav = document.getElementById('mainNav');
  if (!nav) return;
  const f = SK.config.features || {};
  const cartCount = SK.cartCount();
  nav.innerHTML = `
    <a href="./index.html" class="nav-logo" id="navLogoWrap" data-store-name>${SK.config.store?.name || 'My Store'}</a>
    <div class="nav-right">
      ${f.search ? `<div class="search-wrap"><svg class="search-icon" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg><input type="text" id="navSearch" placeholder="Search…" autocomplete="off" /></div>` : ''}
      ${f.cart !== false ? `<a href="./cart.html" class="cart-btn" title="Cart"><svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg><span data-cart-count style="display:${cartCount>0?'flex':'none'}">${cartCount}</span></a>` : ''}
    </div>
  `;
  SK._applyLogo();
  // Search handler
  const si = document.getElementById('navSearch');
  if (si && activePage === 'home') {
    si.addEventListener('input', e => {
      if (typeof SK._onSearch === 'function') SK._onSearch(e.target.value);
    });
  } else if (si) {
    si.addEventListener('keydown', e => {
      if (e.key === 'Enter') window.location.href = `./index.html#search=${encodeURIComponent(e.target.value)}`;
    });
  }
};

// ── FLOATING CONTACT ─────────────────────────────────────────
SK.renderFloatingContact = function () {
  if (!(SK.config.features?.floatingContact)) return;
  const c = SK.config.contact || {};
  const ch = c.floatingChannel || c.primaryChannel || 'whatsapp';
  const url = SK.contactUrl(ch, c.orderMessage || 'Hi!');
  if (!url) return;
  const meta = SK.CHANNEL_META[ch] || { icon: SK.ICONS.email, bg: '#6366f1', label: 'Contact' };
  const btn = document.createElement('a');
  btn.href = url; btn.target = '_blank';
  btn.style.cssText = `position:fixed;bottom:24px;right:24px;z-index:800;width:52px;height:52px;border-radius:50%;background:${meta.bg};display:flex;align-items:center;justify-content:center;color:#fff;box-shadow:0 4px 20px rgba(0,0,0,0.4);text-decoration:none;transition:transform .2s;`;
  btn.innerHTML = `<span style="width:24px;height:24px;display:flex">${meta.icon}</span>`;
  btn.title = 'Contact us via ' + meta.label;
  btn.addEventListener('mouseenter', () => btn.style.transform = 'scale(1.1)');
  btn.addEventListener('mouseleave', () => btn.style.transform = 'scale(1)');
  document.body.appendChild(btn);
};

// ── SHARED CSS (injected into page head) ─────────────────────
SK.injectBaseCSS = function () {
  if (document.getElementById('sk-base-css')) return;
  const s = document.createElement('style'); s.id = 'sk-base-css';
  s.textContent = `
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    :root {
      --primary: #6366f1; --accent: #f59e0b; --success: #22c55e; --danger: #ef4444;
      --bg: #0a0a0f; --bg2: #12121a; --bg3: #1a1a26;
      --border: rgba(255,255,255,0.07);
      --text: #f0f0f8; --text2: #8888aa; --text3: #555570;
      --radius-sm: 10px; --radius-md: 16px; --radius-lg: 22px; --radius-full: 50px;
      --font-head: 'Syne', sans-serif; --font-body: 'DM Sans', sans-serif;
    }
    [data-theme="light"] { --bg:#f4f4f8; --bg2:#ffffff; --bg3:#eeeef4; --border:rgba(0,0,0,0.08); --text:#111118; --text2:#555570; --text3:#aaaacc; }
    html { scroll-behavior: smooth; }
    body.sk-default { background: var(--bg); color: var(--text); font-family: var(--font-body); min-height:100vh; overflow-x:hidden; }
    #announcementBar { display:none; padding:8px 20px; text-align:center; font-size:13px; font-weight:600; }
    nav#mainNav {
      position:sticky; top:0; z-index:200;
      background:rgba(10,10,15,.88); backdrop-filter:blur(24px);
      border-bottom:1px solid var(--border);
      height:60px; padding:0 24px;
      display:flex; align-items:center; justify-content:space-between; gap:16px;
    }
    [data-theme="light"] nav#mainNav { background:rgba(244,244,248,.9); }
    .nav-logo {
      font-family:var(--font-head); font-weight:800; font-size:1.3rem;
      color:var(--primary); text-decoration:none; letter-spacing:-0.5px;
      display:flex; align-items:center; gap:8px; white-space:nowrap;
    }
    .nav-logo img { height:30px; border-radius:6px; }
    .nav-right { display:flex; align-items:center; gap:10px; }
    .search-wrap { position:relative; display:flex; align-items:center; }
    .search-wrap input {
      background:var(--bg3); border:1px solid var(--border); border-radius:var(--radius-full);
      padding:8px 16px 8px 36px; color:var(--text); font-family:var(--font-body); font-size:13px;
      width:180px; outline:none; transition:border-color .2s,width .3s;
    }
    .search-wrap input:focus { border-color:var(--primary); width:230px; }
    .search-wrap input::placeholder { color:var(--text3); }
    .search-icon { position:absolute; left:11px; color:var(--text3); pointer-events:none; }
    .cart-btn {
      position:relative; background:var(--bg3); border:1px solid var(--border);
      border-radius:50%; width:42px; height:42px;
      display:flex; align-items:center; justify-content:center;
      text-decoration:none; color:var(--text);
      transition:background .2s, border-color .2s;
    }
    .cart-btn:hover { background:var(--primary); border-color:var(--primary); color:#fff; }
    .sk-default [data-cart-count] {
      position:absolute; top:-4px; right:-4px;
      background:var(--accent); color:#000; font-size:10px; font-weight:700;
      width:18px; height:18px; border-radius:50%;
      display:flex; align-items:center; justify-content:center;
    }
    .btn { display:inline-flex; align-items:center; gap:8px; font-family:var(--font-head); font-weight:700; border:none; cursor:pointer; transition:transform .15s, opacity .2s, box-shadow .2s; text-decoration:none; }
    .btn-primary { background:var(--primary); color:#fff; border-radius:var(--radius-full); padding:13px 28px; font-size:15px; box-shadow:0 4px 20px color-mix(in srgb,var(--primary) 40%,transparent); }
    .btn-primary:hover { opacity:.88; transform:translateY(-1px); box-shadow:0 6px 28px color-mix(in srgb,var(--primary) 50%,transparent); }
    .btn-ghost { background:var(--bg3); border:1px solid var(--border); color:var(--text); border-radius:var(--radius-full); padding:11px 22px; font-size:14px; }
    .btn-ghost:hover { border-color:var(--primary); color:var(--primary); }
    .section { padding:48px 24px; max-width:1280px; margin:0 auto; }
    .section-label { font-family:var(--font-head); font-size:.7rem; font-weight:700; letter-spacing:3px; text-transform:uppercase; color:var(--primary); margin-bottom:8px; }
    .section-title { font-family:var(--font-head); font-size:clamp(1.4rem,3vw,2rem); font-weight:800; letter-spacing:-.5px; margin-bottom:24px; }
    .cat-pills { display:flex; gap:8px; flex-wrap:wrap; margin-bottom:32px; }
    .cat-pill { padding:7px 16px; border-radius:var(--radius-full); background:var(--bg3); border:1px solid var(--border); color:var(--text2); font-size:13px; font-weight:500; cursor:pointer; transition:all .2s; user-select:none; }
    .cat-pill:hover, .cat-pill.active { background:var(--primary); border-color:var(--primary); color:#fff; }
    .products-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(220px,1fr)); gap:18px; }
    .product-card { background:var(--bg2); border:1px solid var(--border); border-radius:var(--radius-md); overflow:hidden; cursor:pointer; transition:transform .22s, box-shadow .22s, border-color .22s; display:flex; flex-direction:column; }
    .product-card:hover { transform:translateY(-5px); box-shadow:0 18px 45px rgba(0,0,0,.35); border-color:color-mix(in srgb,var(--primary) 35%,transparent); }
    .product-img-wrap { position:relative; aspect-ratio:1; background:var(--bg3); overflow:hidden; }
    .product-img-wrap img { width:100%; height:100%; object-fit:cover; transition:transform .4s; }
    .product-card:hover .product-img-wrap img { transform:scale(1.06); }
    .img-dots { position:absolute; bottom:8px; left:50%; transform:translateX(-50%); display:flex; gap:4px; }
    .img-dot { width:5px; height:5px; border-radius:50%; background:rgba(255,255,255,.4); }
    .img-dot.active { background:#fff; }
    .product-badge { position:absolute; top:10px; left:10px; background:var(--accent); color:#000; font-size:10px; font-weight:700; padding:3px 8px; border-radius:var(--radius-full); letter-spacing:.5px; }
    .product-body { padding:14px; flex:1; display:flex; flex-direction:column; }
    .product-cat { font-size:10px; font-weight:700; letter-spacing:2px; text-transform:uppercase; color:var(--primary); margin-bottom:5px; }
    .product-name { font-family:var(--font-head); font-size:.95rem; font-weight:700; margin-bottom:5px; line-height:1.3; }
    .product-desc { font-size:12px; color:var(--text2); margin-bottom:12px; flex:1; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden; }
    .product-footer { display:flex; align-items:center; justify-content:space-between; gap:6px; }
    .product-price { font-family:var(--font-head); font-size:1.1rem; font-weight:800; }
    .product-old { font-size:.8rem; color:var(--text3); text-decoration:line-through; }
    .add-btn { background:var(--primary); color:#fff; border:none; border-radius:var(--radius-full); padding:7px 14px; font-size:12px; font-weight:700; cursor:pointer; font-family:var(--font-body); transition:background .2s,transform .15s; white-space:nowrap; }
    .add-btn:hover { opacity:.85; transform:scale(1.04); }
    .stock-in { color:var(--success); } .stock-limited { color:var(--accent); } .stock-out { color:var(--danger); }
    .skeleton { background:linear-gradient(90deg,var(--bg3) 25%,color-mix(in srgb,var(--bg3) 60%,#fff 6%) 50%,var(--bg3) 75%); background-size:800px 100%; animation:shimmer 1.4s infinite; border-radius:8px; }
    @keyframes shimmer { 0%{background-position:-400px 0} 100%{background-position:400px 0} }
    .sk-default footer { border-top:1px solid var(--border); padding:28px 24px; text-align:center; color:var(--text3); font-size:13px; }
    .sk-default footer a { color:var(--primary); text-decoration:none; }
    @media(max-width:600px) { .search-wrap{display:none} .products-grid{grid-template-columns:repeat(2,1fr);gap:12px} }
    @media(max-width:360px) { .products-grid{grid-template-columns:1fr} }
  `;
  document.head.appendChild(s);
};

// ── HERO MEDIA (image/video with graceful fallback) ──────────
// Every template's hero looks for ./assets/templates/<id>/hero.mp4 first;
// if it 404s or fails to play, the <video> hides itself and the hero
// image (or gradient) underneath shows instead. Works the same way for
// a user's own uploaded media — just replace the file, same filename.
SK.bindHeroVideo = function (videoEl) {
  if (!videoEl) return;
  const fail = () => { videoEl.style.display = 'none'; };
  videoEl.addEventListener('error', fail);
  videoEl.addEventListener('stalled', fail);
  videoEl.play().catch(fail);
};

// ── STAR RATING (no emoji) ────────────────────────────────────
SK.renderStars = function (rating, size) {
  const s = size || 14;
  const full = Math.round((rating || 0) * 2) / 2;
  let out = '';
  for (let i = 1; i <= 5; i++) {
    const fill = i <= full ? 1 : (i - 0.5 === full ? 0.5 : 0);
    out += `<span style="display:inline-flex;width:${s}px;height:${s}px;color:${fill ? 'var(--accent)' : 'var(--text3)'}">${SK.ICONS.star}</span>`;
  }
  return out;
};

SK.init = async function () {
  SK.injectBaseCSS();
  await SK.loadConfig();
  SK._updateCartBadge();
  SK.renderFloatingContact();
};

// ── FOUC GUARD ─────────────────────────────────────────────
// Pages start with html.sk-loading (body hidden via inline <style> in <head>).
// Call SK.reveal() once the real theme + content for that page is in place.
// This stops users from seeing a flash of default/wrong-theme content before
// config.json loads — whatever loads first (default config or a configured
// store) is the only thing they ever see.
SK.reveal = function () {
  document.documentElement.classList.remove('sk-loading');
};
// Safety net: if a page errors out before calling SK.reveal(), never leave
// it hidden forever.
setTimeout(SK.reveal, 2500);
