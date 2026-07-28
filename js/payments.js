/* ============================================================
   StorefrontKit — payments.js  (shared across all checkout pages)
   Handles: shipping form, payment method selection, order
   creation + GitHub persistence, and dispatch to each payment
   processor (COD, Social/Chat, Stripe, PayPal, Razorpay).
   Requires js/app.js to be loaded first (uses window.SK).
   ============================================================ */

window.SK = window.SK || {};

// ── EXTRA ICONS (payment methods) ─────────────────────────────
Object.assign(SK.ICONS || (SK.ICONS = {}), {
  card:     '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>',
  chat:     '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>',
  paypal:   '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M7.5 19H5.2c-.4 0-.7-.3-.6-.7L7 4.7c.1-.4.4-.7.9-.7h5.9c2.6 0 4.4 1.5 4 3.9-.4 2.9-2.5 4.5-5.3 4.5H10c-.4 0-.8.3-.9.7l-.7 3.9c-.1.5-.5.9-.9.9zm7.9-11c-.2 1.7-1.4 2.6-3.1 2.6h-1.6l.6-3.5c0-.2.2-.4.5-.4h.9c1.4 0 2.8.2 2.7 1.3z"/></svg>',
  bolt2:    '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M13 2 4 14h6l-1 8 9-12h-6z"/></svg>',
  box:      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 8 12 3 3 8v8l9 5 9-5z"/><path d="M3 8l9 5 9-5"/><path d="M12 13v8"/></svg>',
});

// ── PAYMENT METHOD METADATA ───────────────────────────────────
SK.PAYMENT_META = {
  cod:      { label: 'Cash on Delivery', desc: 'Pay when your order arrives',        icon: 'truck',  bg: '#22c55e' },
  social:   { label: 'Order via Chat',   desc: 'Send your order over WhatsApp/etc.', icon: 'chat',   bg: '#6366f1' },
  stripe:   { label: 'Card Payment',     desc: 'Pay securely by card (Stripe)',      icon: 'card',   bg: '#635bff' },
  paypal:   { label: 'PayPal',           desc: 'Pay with your PayPal account',       icon: 'paypal', bg: '#0070ba' },
  razorpay: { label: 'UPI / Card / Bank', desc: 'Pay via Razorpay',                  icon: 'bolt2',  bg: '#0c2451' },
};

// Returns the ordered list of payment method keys that are enabled in config.json
SK.getEnabledPaymentMethods = function () {
  const p = SK.config.payments || {};
  const methods = p.methods || { cod: true };
  const order = (p.order && p.order.length) ? p.order : Object.keys(SK.PAYMENT_META);
  return order.filter(k => methods[k]);
};

SK._selectedMethod = null;

// Renders the selectable payment-method cards into a container.
// Uses only generic classes (skx-pm-*) styled via CSS vars so it looks
// right on every template without per-template JS.
SK.renderPaymentMethods = function (containerId, onSelect) {
  const el = document.getElementById(containerId);
  if (!el) return;
  const enabled = SK.getEnabledPaymentMethods();
  if (!enabled.length) {
    el.innerHTML = `<div style="font-size:13px;color:var(--skx-mute,#888)">No payment method configured. <a href="./admin.html" style="color:var(--skx-accent,#6366f1)">Set one up</a>.</div>`;
    return;
  }
  el.innerHTML = enabled.map((key, i) => {
    const m = SK.PAYMENT_META[key];
    return `
    <label class="skx-pm-card" data-method="${key}">
      <input type="radio" name="skPayMethod" value="${key}" ${i === 0 ? 'checked' : ''} onchange="SK._onPaymentSelect('${key}')" />
      <span class="skx-pm-icon" style="background:${m.bg}22;color:${m.bg}">${SK.icon(m.icon, 20)}</span>
      <span class="skx-pm-text"><strong>${m.label}</strong><span>${m.desc}</span></span>
      <span class="skx-pm-check">${SK.icon('check', 14)}</span>
    </label>`;
  }).join('');
  SK._selectedMethod = enabled[0];
  if (typeof onSelect === 'function') SK._onPaymentSelect = (k) => { SK._selectedMethod = k; onSelect(k); };
  else SK._onPaymentSelect = (k) => { SK._selectedMethod = k; };
  if (typeof onSelect === 'function') onSelect(enabled[0]);
};

// ── SHIPPING FORM ──────────────────────────────────────────────
SK.SHIPPING_FIELDS = ['ckName', 'ckPhone', 'ckEmail', 'ckAddr1', 'ckAddr2', 'ckCity', 'ckState', 'ckZip', 'ckCountry', 'ckNotes'];

SK.collectShipping = function () {
  const g = id => (document.getElementById(id)?.value || '').trim();
  return {
    name: g('ckName'), phone: g('ckPhone'), email: g('ckEmail'),
    address1: g('ckAddr1'), address2: g('ckAddr2'), city: g('ckCity'),
    state: g('ckState'), zip: g('ckZip'), country: g('ckCountry'), notes: g('ckNotes'),
  };
};

SK.validateShipping = function (data) {
  const errs = [];
  const chk = SK.config.checkout || {};
  if (!data.name) errs.push('Full name is required');
  if (chk.requirePhone !== false && !data.phone) errs.push('Phone number is required');
  if (chk.requireEmail && !data.email) errs.push('Email is required');
  if (!data.address1) errs.push('Address is required');
  if (!data.city) errs.push('City is required');
  if (!data.country) errs.push('Country is required');
  return { valid: errs.length === 0, errors: errs };
};

SK.highlightShippingErrors = function () {
  const req = { ckName: 'name', ckPhone: 'phone', ckAddr1: 'address1', ckCity: 'city', ckCountry: 'country' };
  Object.keys(req).forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    if (!el.value.trim()) { el.style.borderColor = 'var(--skx-danger,#ef4444)'; }
    else { el.style.borderColor = ''; }
  });
};

// ── ORDER OBJECT ───────────────────────────────────────────────
SK.buildOrderObject = function (method) {
  const cart = SK.getCart();
  const shipping = SK.collectShipping();
  const store = SK.config.store || {};
  return {
    id: SK._getOrderId(),
    createdAt: new Date().toISOString(),
    status: 'new',
    paymentMethod: method,
    paymentStatus: method === 'cod' ? 'cod' : (method === 'social' ? 'pending' : 'pending'),
    customer: shipping,
    items: cart.map(i => ({ id: i.id, name: i.name, price: i.price, qty: i.qty })),
    total: SK.cartTotal(),
    currency: store.currency || 'USD',
    currencySymbol: store.currencySymbol || '$',
    storeName: store.name || 'My Store',
  };
};

// ── GITHUB PERSISTENCE (orders.json) — mirrors admin.html's product save pattern
SK.saveOrder = async function (order) {
  const api = SK.config.api || {};
  if (!api.githubToken || api.githubToken === 'YOUR_GITHUB_TOKEN_HERE' || !api.githubRepo) {
    // No GitHub configured — keep a local fallback so the order isn't silently lost
    try {
      const pending = JSON.parse(localStorage.getItem('sk_pending_orders') || '[]');
      pending.push(order);
      localStorage.setItem('sk_pending_orders', JSON.stringify(pending));
    } catch (e) {}
    return false;
  }
  try {
    const [owner, repo] = api.githubRepo.split('/');
    const headers = { 'Authorization': 'token ' + api.githubToken, 'Accept': 'application/vnd.github.v3+json' };
    let orders = [];
    let sha = null;
    const r = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/orders.json`, { headers });
    if (r.ok) {
      const data = await r.json();
      sha = data.sha;
      try { orders = JSON.parse(atob(data.content.replace(/\n/g, ''))); } catch (e) { orders = []; }
    }
    orders.unshift(order);
    const body = {
      message: sha ? `New order ${order.id} via checkout` : 'Create orders.json',
      content: btoa(unescape(encodeURIComponent(JSON.stringify(orders, null, 2)))),
      branch: api.githubBranch || 'main',
    };
    if (sha) body.sha = sha;
    const put = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/orders.json`, {
      method: 'PUT',
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    return put.ok;
  } catch (e) {
    try {
      const pending = JSON.parse(localStorage.getItem('sk_pending_orders') || '[]');
      pending.push(order);
      localStorage.setItem('sk_pending_orders', JSON.stringify(pending));
    } catch (e2) {}
    return false;
  }
};

// Best-effort status update after an async payment redirect completes (Stripe/PayPal/Razorpay)
SK.markOrderPaid = async function (orderId) {
  const api = SK.config.api || {};
  if (!api.githubToken || api.githubToken === 'YOUR_GITHUB_TOKEN_HERE' || !api.githubRepo) return false;
  try {
    const [owner, repo] = api.githubRepo.split('/');
    const headers = { 'Authorization': 'token ' + api.githubToken, 'Accept': 'application/vnd.github.v3+json' };
    const r = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/orders.json`, { headers });
    if (!r.ok) return false;
    const data = await r.json();
    const sha = data.sha;
    const orders = JSON.parse(atob(data.content.replace(/\n/g, '')));
    const o = orders.find(x => x.id === orderId);
    if (!o) return false;
    o.paymentStatus = 'paid';
    const body = { message: `Mark ${orderId} paid`, content: btoa(unescape(encodeURIComponent(JSON.stringify(orders, null, 2)))), sha, branch: api.githubBranch || 'main' };
    const put = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/orders.json`, { method: 'PUT', headers: { ...headers, 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    return put.ok;
  } catch (e) { return false; }
};

// ── SCRIPT LOADER ──────────────────────────────────────────────
SK._loadedScripts = {};
SK.loadScript = function (src) {
  if (SK._loadedScripts[src]) return SK._loadedScripts[src];
  SK._loadedScripts[src] = new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.src = src; s.onload = resolve; s.onerror = reject;
    document.head.appendChild(s);
  });
  return SK._loadedScripts[src];
};

// ── CONGRATS REDIRECT ──────────────────────────────────────────
SK.goToCongrats = function (orderId, homeFile, extra) {
  SK.clearCart();
  const params = new URLSearchParams({ order: orderId, home: homeFile || './index.html', ...(extra || {}) });
  window.location.href = './congrats.html?' + params.toString();
};

// ── MAIN DISPATCH — called by the "Place Order" button ────────
// homeFile: e.g. './index.html' or './index3.html' — passed by each
// template so the congrats page's "Continue Shopping" button works.
SK.placeOrder = async function (homeFile, btnEl) {
  SK.highlightShippingErrors();
  const shipping = SK.collectShipping();
  const check = SK.validateShipping(shipping);
  if (!check.valid) {
    SK.toast(check.errors[0], 'error');
    return;
  }
  const method = SK._selectedMethod || 'cod';
  if (btnEl) { btnEl.disabled = true; btnEl.dataset._label = btnEl.textContent; btnEl.textContent = 'Processing…'; }

  try {
    const order = SK.buildOrderObject(method);

    if (method === 'cod') {
      await SK.saveOrder(order);
      SK.goToCongrats(order.id, homeFile, { method: 'cod' });
      return;
    }

    if (method === 'social') {
      await SK.saveOrder(order);
      const c = SK.config.contact || {};
      const channels = c.channels || {};
      const checkoutChannels = c.checkoutChannels?.length ? c.checkoutChannels : Object.keys(channels).filter(k => channels[k]);
      const firstChannel = checkoutChannels.find(ch => channels[ch]) || c.primaryChannel;
      const msg = SK.buildOrderMessage() + `\n\nName: ${shipping.name}\nPhone: ${shipping.phone}\nAddress: ${[shipping.address1, shipping.address2, shipping.city, shipping.state, shipping.zip, shipping.country].filter(Boolean).join(', ')}`;
      const url = SK.contactUrl(firstChannel, msg);
      if (url) window.open(url, '_blank');
      SK.goToCongrats(order.id, homeFile, { method: 'social' });
      return;
    }

    if (method === 'razorpay') {
      const rp = SK.config.payments?.razorpay || {};
      if (!rp.keyId) { SK.toast('Razorpay is not configured yet', 'error'); throw 0; }
      await SK.saveOrder(order);
      await SK.loadScript('https://checkout.razorpay.com/v1/checkout.js');
      const store = SK.config.store || {};
      const rzp = new Razorpay({
        key: rp.keyId,
        amount: Math.round(order.total * 100),
        currency: store.currency || 'USD',
        name: store.name || 'My Store',
        description: 'Order #' + order.id,
        prefill: { name: shipping.name, email: shipping.email, contact: shipping.phone },
        handler: async function () {
          await SK.markOrderPaid(order.id);
          SK.goToCongrats(order.id, homeFile, { method: 'razorpay', paid: '1' });
        },
        modal: { ondismiss: function () { if (btnEl) { btnEl.disabled = false; btnEl.textContent = btnEl.dataset._label; } } },
      });
      rzp.open();
      return;
    }

    if (method === 'stripe') {
      await SK.saveOrder(order);
      const res = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: order.items, currency: (order.currency || 'usd').toLowerCase(),
          orderId: order.id, customerEmail: shipping.email,
          successUrl: window.location.origin + '/congrats.html?order=' + order.id + '&home=' + encodeURIComponent(homeFile || './index.html') + '&method=stripe&paid=1',
          cancelUrl: window.location.href,
        }),
      });
      if (!res.ok) throw new Error('unavailable');
      const data = await res.json();
      if (data.url) { window.location.href = data.url; return; }
      throw new Error('no session url');
    }
  } catch (e) {
    if (method === 'stripe') {
      SK.toast('Card payment needs Vercel hosting — try another payment method', 'error');
    } else if (e && e.message) {
      SK.toast('Something went wrong. Please try again.', 'error');
    }
  }
  if (btnEl) { btnEl.disabled = false; btnEl.textContent = btnEl.dataset._label || 'Place Order'; }
};

// ── PAYPAL BUTTON (renders in place of the generic Place Order button) ──
SK.renderPayPalButton = async function (containerId, homeFile) {
  const el = document.getElementById(containerId);
  if (!el) return;
  const pp = SK.config.payments?.paypal || {};
  if (!pp.clientId) { el.innerHTML = `<div style="font-size:13px;color:var(--skx-danger,#ef4444)">PayPal is not configured yet.</div>`; return; }
  el.innerHTML = `<div id="skPaypalMount"></div>`;
  try {
    await SK.loadScript(`https://www.paypal.com/sdk/js?client-id=${encodeURIComponent(pp.clientId)}&currency=${encodeURIComponent(pp.currency || 'USD')}`);
    paypal.Buttons({
      style: { layout: 'vertical', label: 'paypal' },
      createOrder: function (data, actions) {
        const shipping = SK.collectShipping();
        const check = SK.validateShipping(shipping);
        if (!check.valid) { SK.highlightShippingErrors(); SK.toast(check.errors[0], 'error'); return Promise.reject(new Error('invalid')); }
        return actions.order.create({ purchase_units: [{ amount: { value: SK.cartTotal().toFixed(2), currency_code: pp.currency || 'USD' } }] });
      },
      onApprove: async function (data, actions) {
        const order = SK.buildOrderObject('paypal');
        order.paymentStatus = 'paid';
        order.paypalOrderId = data.orderID;
        await SK.saveOrder(order);
        await actions.order.capture().catch(() => {});
        SK.goToCongrats(order.id, homeFile, { method: 'paypal', paid: '1' });
      },
      onError: function () { SK.toast('PayPal payment failed. Please try again.', 'error'); },
    }).render('#skPaypalMount');
  } catch (e) {
    el.innerHTML = `<div style="font-size:13px;color:var(--skx-danger,#ef4444)">Couldn't load PayPal. Check your connection and try again.</div>`;
  }
};

// ── PLACE-ORDER AREA RENDERER — swaps between generic button and PayPal mount ──
SK.renderPlaceOrderArea = function (containerId, homeFile) {
  const el = document.getElementById(containerId);
  if (!el) return;
  const render = (method) => {
    if (method === 'paypal') {
      el.innerHTML = `<div id="skPayPalArea"></div>`;
      SK.renderPayPalButton('skPayPalArea', homeFile);
    } else {
      const labels = { cod: 'Place Order — Cash on Delivery', social: 'Send Order via Chat', stripe: 'Continue to Card Payment', razorpay: 'Pay Now' };
      el.innerHTML = `<button type="button" class="skx-place-btn" onclick="SK.placeOrder('${homeFile}', this)">${labels[method] || 'Place Order'}</button>`;
    }
  };
  SK.renderPaymentMethods('skPaymentMethods', render);
};
