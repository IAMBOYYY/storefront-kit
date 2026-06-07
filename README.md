# ⚡ StorefrontKit

**Free open-source e-commerce store builder. Fork → configure → ship. No coding required.**

Built for indie sellers, dropshippers, and resellers. Works fully on mobile. **Two ways to host — both free forever.**

---

## ✨ What's Included

| Feature | Details |
|---|---|
| 🛍️ Homepage | Hero, product grid, category filters, search |
| 📄 Product Pages | Multi-image gallery (swipe on mobile), specs, related products |
| 🛒 Cart | Full cart page with qty controls |
| 💳 Checkout | COD-only, order summary, multi-channel contact |
| ⚙️ Admin | Add products with multiple images, manage catalog |
| 📲 7 Contact Channels | WhatsApp, Telegram, Instagram, Facebook, Email, Phone, Twitter |
| 🎨 AI-Changeable Design | Colors, fonts, theme, layout — all in config.json |
| 📦 GitHub Storage | Products stored as JSON in your repo |
| 🖼️ ImgBB Uploads | Free image hosting, up to 6 images per product |
| 🚀 Auto Deploy | GitHub Actions (Pages) or Vercel — both auto-deploy on commit |

---

## 🚦 Choose Your Hosting

| | GitHub Pages | Vercel |
|---|---|---|
| Cost | Free | Free |
| Repo must be public | ✅ Yes | ❌ No — keep it private |
| Credentials hidden | ❌ Exposed in public repo | ✅ Safe in private repo |
| Custom domain | ✅ | ✅ |
| Setup difficulty | Easy | Easy |

> 🔒 **Recommendation:** Use **Vercel** if you want to keep your GitHub Token, ImgBB key, and admin password private. Your repo stays private and your store still works 100%.

---

## 🚀 Option A — GitHub Pages (Public Repo)

**Step 1** — Click **"Use this template"** → Create new repository → Name it anything (e.g. `my-store`)

**Step 2** — Go to `https://yourusername.github.io/my-store/setup.html` and fill in the setup wizard

**Step 3** — Download your `config.json` → upload it to your repo root → commit

**Step 4** — Settings → Pages → Source → **GitHub Actions** → Save

**Step 5** — Live at `https://yourusername.github.io/my-store` 🎉

Visit `/admin.html` to add products.

---

## 🔒 Option B — Vercel (Private Repo — Recommended)

No extra files needed — `vercel.json` is already included in this template.

**Step 1** — Click **"Use this template"** → Create new repository → Name it anything

**Step 2** — Go to [vercel.com](https://vercel.com) → Sign in with GitHub → **Add New → Project**

**Step 3** — Find your repo → click **Import** → click **Deploy** (no settings to change)

**Step 4** — Your store is live at `https://your-store.vercel.app` in ~20 seconds ⚡

**Step 5** — Open `https://your-store.vercel.app/setup.html` → fill in the wizard → commit `config.json`

**Step 6** — Go to GitHub → your repo → **Settings → Danger Zone → Make private** 🔒

Your credentials are now hidden. Vercel keeps deploying automatically on every commit.

> ✅ Everything works on Vercel — admin panel, product uploads, images, checkout. See [VERCEL-SETUP.md](./VERCEL-SETUP.md) for full details and FAQ.

---

## 📁 Files

```
storefront-kit/
├── index.html          ← Homepage
├── product.html        ← Product detail page
├── cart.html           ← Cart page
├── checkout.html       ← COD checkout with contact channels
├── admin.html          ← Admin dashboard (password protected)
├── setup.html          ← One-time setup wizard
├── config.json         ← All your settings (edit this!)
├── vercel.json         ← Vercel config (already set up — do not edit)
├── js/app.js           ← Shared JS (cart, config, design tokens)
├── AI-SETUP.md         ← Prompts to customize your store with AI
├── VERCEL-SETUP.md     ← Full Vercel guide + FAQ
├── README.md
└── .github/workflows/
    └── deploy.yml      ← Auto GitHub Pages deploy
```

---

## ⚙️ config.json — Full Reference

### `store` — Basic info
```json
"store": {
  "name": "My Store",
  "tagline": "Quality products, delivered fast.",
  "logo": "https://url-to-your-logo.png",
  "favicon": "",
  "currency": "USD",
  "currencySymbol": "$"
}
```

### `design` — AI-changeable visual tokens
```json
"design": {
  "theme": "dark",
  "primaryColor": "#6366f1",
  "accentColor": "#f59e0b",
  "headingFont": "Syne",
  "bodyFont": "DM Sans",
  "borderRadius": "16",
  "buttonStyle": "pill"
}
```
> Change `theme` to `"light"` for a light store. Change `headingFont` to any Google Font name.

### `contact` — All 7 channels
```json
"contact": {
  "channels": {
    "whatsapp": "+911234567890",
    "telegram": "@mystore",
    "instagram": "@mystore",
    "facebook": "facebook.com/mystore",
    "email": "hello@mystore.com",
    "phone": "+911234567890",
    "twitter": "@mystore"
  },
  "primaryChannel": "whatsapp",
  "checkoutChannels": ["whatsapp", "telegram", "email"],
  "floatingButton": true,
  "floatingChannel": "whatsapp"
}
```
Leave any channel blank (`""`) to disable it.

### `announcement` — Top banner
```json
"announcement": {
  "enabled": true,
  "text": "🚚 Free shipping on all orders!",
  "bgColor": "#f59e0b",
  "textColor": "#000000"
}
```

### `features` — Toggle features
```json
"features": {
  "search": true,
  "categories": true,
  "cart": true,
  "relatedProducts": true,
  "productSpecs": true,
  "stockBadge": true,
  "floatingContact": true
}
```

---

## 🤖 AI Customization

See [AI-SETUP.md](./AI-SETUP.md) for ready-made prompts to paste into Claude or ChatGPT. Describe what you want and the AI generates your updated `config.json` in one shot.

**Examples of what you can ask AI:**
- "Change my store to a light theme with a green primary color"
- "Switch heading font to Playfair Display"
- "Add my Telegram channel and make it the primary checkout option"
- "Change the hero to: 'Fresh Drops Daily' with a red background"
- "Disable the search bar and related products"

---

## 🔑 API Keys

**GitHub Token:** Settings → Developer settings → Personal access tokens → Fine-grained → New token → Contents: Read & Write on your store repo.

**ImgBB Key:** Register free at [imgbb.com](https://imgbb.com) → [api.imgbb.com](https://api.imgbb.com) → copy key.

> 🔒 On Vercel with a private repo, your API keys in `config.json` are completely hidden from the public.

---

## 📱 Mobile-First

StorefrontKit works completely on mobile — building, managing, and shopping. Product image gallery has swipe support. Admin dashboard works fully on phone browsers.

---

## 📄 License

MIT — free to use, fork, modify, and build businesses with.

---

Made with ❤️ by [IAMBOYYY](https://github.com/IAMBOYYY)
