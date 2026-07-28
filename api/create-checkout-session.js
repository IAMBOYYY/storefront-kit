// StorefrontKit — Stripe Checkout Session creator
//
// Why this file exists: Stripe does NOT allow creating a Checkout Session
// with a dynamic cart amount from client-side JS alone — it requires a
// server call with your SECRET key. This is the one part of the payments
// feature that needs a real server, which is why it only works when this
// site is deployed on Vercel (not plain GitHub Pages).
//
// Setup: In your Vercel project → Settings → Environment Variables, add:
//   STRIPE_SECRET_KEY = sk_live_... (or sk_test_... while testing)
// Then redeploy. See VERCEL-SETUP.md for the full walkthrough.
//
// This file deliberately avoids the `stripe` npm package (no package.json /
// build step needed) — it just calls Stripe's REST API directly with fetch.

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const secret = process.env.STRIPE_SECRET_KEY;
  if (!secret) {
    res.status(500).json({ error: 'STRIPE_SECRET_KEY is not set. Add it in Vercel → Project Settings → Environment Variables, then redeploy.' });
    return;
  }

  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch (e) { body = {}; }
  }
  const { items, currency, orderId, customerEmail, successUrl, cancelUrl } = body || {};

  if (!Array.isArray(items) || !items.length) {
    res.status(400).json({ error: 'No items provided' });
    return;
  }

  const params = new URLSearchParams();
  params.append('mode', 'payment');
  params.append('success_url', successUrl || '');
  params.append('cancel_url', cancelUrl || successUrl || '');
  if (customerEmail) params.append('customer_email', customerEmail);
  if (orderId) params.append('metadata[order_id]', orderId);

  items.forEach((item, i) => {
    const unitAmount = Math.round(Number(item.price || 0) * 100);
    params.append(`line_items[${i}][price_data][currency]`, (currency || 'usd').toLowerCase());
    params.append(`line_items[${i}][price_data][product_data][name]`, String(item.name || 'Item').slice(0, 250));
    params.append(`line_items[${i}][price_data][unit_amount]`, String(unitAmount));
    params.append(`line_items[${i}][quantity]`, String(item.qty || 1));
  });

  try {
    const r = await fetch('https://api.stripe.com/v1/checkout/sessions', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + secret,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    });
    const data = await r.json();
    if (!r.ok) {
      res.status(400).json({ error: (data.error && data.error.message) || 'Stripe declined the request' });
      return;
    }
    res.status(200).json({ url: data.url, id: data.id });
  } catch (e) {
    res.status(500).json({ error: 'Could not reach Stripe. Please try again.' });
  }
};
