# StorefrontKit

**Free, open-source e-commerce store builder. Fork it, configure it, ship it. No coding required.**

Built for indie sellers, dropshippers, and resellers. Works fully on mobile, including the admin panel. Hosts free forever on GitHub Pages or Vercel.

---

## What's Included

- **7 storefront templates** — pick the one that fits your brand, delete the rest
- Homepage, product page, cart, and checkout for every template
- Shared pages: About, Services, Privacy Policy, Terms of Service
- Admin dashboard (password protected) to add, edit, and delete products, plus a live template preview + cleanup-command generator
- 8-step setup wizard covering store identity, template choice, brand colors, your story, business/legal details, contact channels, API keys, and hero/features
- 7 contact channels at checkout: WhatsApp, Telegram, Instagram, Facebook, Email, Phone, Twitter/X
- Cash-on-Delivery checkout flow with order summary
- Colors, fonts, and store details editable from `config.json` — no template-1 coding needed
- Products stored as JSON in your repo, images hosted free via ImgBB
- Auto-deploys on every commit (GitHub Pages or Vercel)

---

## The Templates

Each template is a fully self-contained set of 4 pages (`index`, `product`, `cart`, `checkout`) sharing the same product catalog and contact settings, but with its own distinct look. Browse them live, pick a favorite, then delete the rest.

| # | Name | Style | Files |
|---|------|-------|-------|
| 1 | Default | Clean general-purpose store | `index.html`, `product.html`, `cart.html`, `checkout.html` |
| 2 | Velocity | Bold sportswear / multi-product | `index2.html`, `product2.html`, `cart2.html`, `checkout2.html` |
| 3 | Essentials | Minimal clothing brand | `index3.html`, `product3.html`, `cart3.html`, `checkout3.html` |
| 4 | Pure | Beauty / skincare | `index4.html`, `product4.html`, `cart4.html`, `checkout4.html` |
| 5 | Nova | Dark electronics / tech store | `index5.html`, `product5.html`, `cart5.html`, `checkout5.html` |
| 6 | Spotlight | Single-product landing page | `index6.html`, `product6.html`, `cart6.html`, `checkout6.html` |
| 7 | Noir | Dark luxury streetwear / editorial | `index7.html`, `product7.html`, `cart7.html`, `checkout7.html` |

**To go live with one template:** decide which number you like, then delete the other templates' files from your repo. Optionally rename your chosen template's files to the plain names (`index3.html` → `index.html`, etc.) if you want a clean root URL — not required, `yoursite.com/index3.html` works fine as-is.

All 7 templates, plus Privacy, Terms, About, and Services, read from the **same** `config.json` and `products.json` — so your store name, products, colors, and contact info stay in sync no matter which template you keep.

---

## Choose Your Hosting

| | GitHub Pages | Vercel |
|---|---|---|
| Cost | Free | Free |
| Repo must be public | Yes | No — keep it private |
| Credentials hidden | Exposed in public repo | Safe in private repo |
| Custom domain | Yes | Yes |

**Recommendation:** use **Vercel** if you want your GitHub Token, ImgBB key, and admin password to stay private. Your repo can stay private and the store still works 100%.

### Option A — GitHub Pages (Public Repo)

1. Click **"Use this template"** → create a new repository
2. Visit `https://yourusername.github.io/your-repo/setup.html` and fill in the wizard
3. Download the generated `config.json` → upload it to your repo root → commit
4. Settings → Pages → Source → **GitHub Actions** → Save
5. Live at `https://yourusername.github.io/your-repo`

Visit `/admin.html` to add products.

### Option B — Vercel (Private Repo, Recommended)

1. Click **"Use this template"** → create a new repository
2. [vercel.com](https://vercel.com) → Sign in with GitHub → **Add New → Project** → Import your repo → Deploy
3. Visit `https://your-store.vercel.app/setup.html` → fill in the wizard → commit `config.json`
4. GitHub → repo → **Settings → Danger Zone → Make private**

Full guide + FAQ: [VERCEL-SETUP.md](./VERCEL-SETUP.md)

---

## File Structure

```
storefront-kit/
├── index.html, product.html, cart.html, checkout.html        Template 1 (Default)
├── index2.html, product2.html, cart2.html, checkout2.html    Template 2 (Velocity)
├── index3.html, product3.html, cart3.html, checkout3.html    Template 3 (Essentials)
├── index4.html, product4.html, cart4.html, checkout4.html    Template 4 (Pure)
├── index5.html, product5.html, cart5.html, checkout5.html    Template 5 (Nova)
├── index6.html, product6.html, cart6.html, checkout6.html    Template 6 (Spotlight)
├── index7.html, product7.html, cart7.html, checkout7.html    Template 7 (Noir)
├── about.html           Shared About page (all templates link here)
├── services.html        Shared shipping / returns / support info
├── privacy.html         Shared Privacy Policy
├── terms.html           Shared Terms of Service
├── admin.html           Admin dashboard (password protected) — Products + Orders + Settings
├── setup.html           One-time setup wizard
├── congrats.html        Shared order-confirmation screen (all templates)
├── config.json          All your settings — edit this!
├── orders.json          Created automatically on the first checkout — customer + order data
├── vercel.json          Vercel config (already set up — do not edit)
├── js/app.js            Shared engine: cart, config, design tokens, icons
├── js/payments.js        Shared checkout engine: shipping form, payment methods, order saving
├── api/create-checkout-session.js   Vercel-only serverless function powering Stripe checkout
├── assets/
│   ├── site/                       Images for About/default template
│   ├── congrats/                   congrats.jpg / congrats.mp4 / congrats.mp3 — post-checkout screen
│   └── templates/template1-7/      hero.jpg / hero.mp4 per template (see below)
├── AI-SETUP.md          Prompts to customize your store with AI
├── VERCEL-SETUP.md      Full Vercel guide + FAQ
├── README.md
└── .github/workflows/deploy.yml    Auto GitHub Pages deploy
```

---

## Adding Your Own Images & Videos

The `assets/` folders are empty on purpose — they're just reserved paths. To add your own media:

1. Go to `assets/templates/templateN/` for the template you're using (e.g. `assets/templates/template3/` for Essentials)
2. Upload a file named exactly **`hero.jpg`** — that becomes the homepage hero image automatically, no code changes needed
3. Optionally also upload **`hero.mp4`** — templates with video heroes will play it automatically and fall back to `hero.jpg` if the browser can't play it
4. If neither file exists, the page falls back to a plain gradient — nothing breaks

The same pattern applies to `assets/site/about.jpg` for the About page, and to `assets/congrats/` for the post-checkout confirmation screen — drop in `congrats.jpg`, `congrats.mp4`, and/or `congrats.mp3` (any combination) and `congrats.html` picks them up automatically, video winning over image if both are present, audio playing alongside either. Product photos are uploaded separately through `/admin.html` (hosted on ImgBB), not through this folder.

---

## config.json — Key Sections

### `store`
```json
"store": { "name": "My Store", "tagline": "...", "currency": "USD", "currencySymbol": "$" }
```

### `design` — AI-changeable visual tokens (Template 1 only; templates 2-7 have their own fixed look)
```json
"design": { "theme": "dark", "primaryColor": "#6366f1", "accentColor": "#f59e0b", "headingFont": "Syne", "bodyFont": "DM Sans" }
```

### `contact` — all 7 channels, leave any blank to disable
```json
"contact": { "channels": { "whatsapp": "", "telegram": "", "instagram": "", "facebook": "", "email": "", "phone": "", "twitter": "" }, "checkoutChannels": ["whatsapp","email"] }
```

### `business` and `legal` — power the About / Services / Privacy / Terms pages
```json
"business": { "legalName": "", "address": "", "supportEmail": "", "supportPhone": "", "returnsWindowDays": "30", "shippingNote": "" },
"legal": { "privacyNotes": "", "termsNotes": "", "returnsNotes": "" }
```
All of these have sensible generic fallback text if left blank — fill them in through `setup.html` for a personalized result.

### `announcement` — top banner
```json
"announcement": { "enabled": true, "text": "Free shipping on all orders!", "bgColor": "#f59e0b", "textColor": "#000000" }
```

### `payments` — which checkout options customers see
```json
"payments": {
  "methods": { "cod": true, "social": true, "stripe": false, "paypal": false, "razorpay": false },
  "order": ["cod","social","stripe","paypal","razorpay"],
  "stripe": { "publishableKey": "" },
  "paypal": { "clientId": "", "currency": "USD" },
  "razorpay": { "keyId": "" }
}
```
Toggle any combination on. `cod` (Cash on Delivery) and `social` (order via your existing chat/social channels) work everywhere with zero setup. Stripe/PayPal/Razorpay need a free account with that processor — see **Payments & Orders** below.

### `congrats` — the order-confirmation screen
```json
"congrats": { "heading": "Order Placed Successfully!", "message": "...", "imageUrl": "", "videoUrl": "", "audioUrl": "" }
```
`videoUrl` takes priority over `imageUrl` if both are set; `audioUrl` plays independently alongside either one.

---

## Payments & Orders

Every checkout now collects full shipping details (name, phone, email, address, notes) — not just a cart total — the same way Amazon or Shopify checkout does, regardless of which payment method the customer picks.

**Payment methods:**
- **Cash on Delivery** and **Order via Chat/Social** — free, work on any hosting, no setup.
- **PayPal** and **Razorpay** — use their client-side SDKs directly, so they also work on plain GitHub Pages. Just add your Client ID / Key ID in Step 7 of the setup wizard (or `config.json`).
- **Stripe** — the one exception. Stripe requires a real server to safely create a checkout session for a variable cart total, which is why `api/create-checkout-session.js` **only works when this site is deployed on Vercel**. Add your Stripe **publishable key** to `config.json`, and set `STRIPE_SECRET_KEY` as a Vercel Environment Variable (never commit the secret key to the repo) — see VERCEL-SETUP.md. On GitHub Pages, the Stripe option will show an error telling the customer to pick another method.

**Orders:** every completed checkout is saved to `orders.json` in your repo (created automatically on the first order), the same way products are saved to `products.json`. Manage them in **`/admin.html` → Orders**: mark as New / In Process / Done / Blocked, view full customer details, message or call the customer directly, or delete an order.

**⚠️ Privacy note:** because this is a static site, `config.json`'s GitHub token — and now customer orders — are only as private as your repo. On public GitHub Pages, anyone can read `orders.json`'s commit history, including customer names, phone numbers, and addresses. **Use Vercel with a private repo (see VERCEL-SETUP.md) before you have real customers checking out.** The admin dashboard will show a warning banner if it detects your repo is public.

---

## AI Customization

See [AI-SETUP.md](./AI-SETUP.md) for ready-made prompts to paste into Claude or ChatGPT. Describe what you want and the AI generates your updated `config.json` in one shot.

---

## API Keys

**GitHub Token:** Settings → Developer settings → Personal access tokens → Fine-grained → New token → Contents: Read & Write on your store repo.

**ImgBB Key:** Register free at [imgbb.com](https://imgbb.com) → [api.imgbb.com](https://api.imgbb.com) → copy key.

On Vercel with a private repo, your API keys in `config.json` are completely hidden from the public.

**Stripe Secret Key (Vercel only):** unlike the other keys above, this one must **never** go in `config.json` since that file is fetched by the browser. In your Vercel project → Settings → Environment Variables, add `STRIPE_SECRET_KEY` with your `sk_live_…` or `sk_test_…` value, then redeploy. This powers `api/create-checkout-session.js`. Stripe's **publishable key** (`pk_live_…`) is safe to put in `config.json` as usual.

---

## License

MIT — free to use, fork, modify, and build businesses with.

Made by [IAMBOYYY](https://github.com/IAMBOYYY)
