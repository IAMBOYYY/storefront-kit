# ⚡ StorefrontKit

**Free open-source e-commerce store builder. Fork → configure → ship. No coding required.**

Built for indie sellers, dropshippers, and resellers. Works fully on mobile. Free forever on GitHub Pages.

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
| 🚀 Auto Deploy | GitHub Actions deploys on every commit |

---

## 🚀 5-Step Quick Start

**Step 1** — Click **"Use this template"** → Create new repository → Name it anything (e.g. `my-store`)

**Step 2** — Go to `setup.html` on your GitHub Pages URL and fill in the wizard

**Step 3** — Download your `config.json` → upload to repo root → commit

**Step 4** — Settings → Pages → Source → **GitHub Actions** → Save

**Step 5** — Live at `https://yourusername.github.io/repo-name` 🎉

Visit `/admin.html` to add products with images.

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
├── config.json         ← All settings (edit this!)
├── js/app.js           ← Shared JS (cart, config, design tokens)
├── AI-SETUP.md         ← AI customization prompt
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

See [AI-SETUP.md](./AI-SETUP.md) for a ready-made prompt to paste into Claude or ChatGPT. Describe what you want and the AI generates your updated `config.json` in one shot.

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

---

## 📱 Mobile-First

StorefrontKit works completely on mobile — building, managing, and shopping. Product image gallery has swipe support. Admin dashboard works fully on phone browsers.

---

## 📄 License

MIT — free to use, fork, modify, and build businesses with.

---

Made with ❤️ by [IAMBOYYY](https://github.com/IAMBOYYY)
