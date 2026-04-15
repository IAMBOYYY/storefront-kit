# 🤖 AI Customization Guide

No coding needed. Paste this prompt into Claude, ChatGPT, or any AI to fully customize your store.

---

## The Master Prompt (copy → paste into your AI)

```
I have an open-source e-commerce store called StorefrontKit.

Here is my current config.json:
[PASTE YOUR ENTIRE config.json HERE]

Please update this config.json with the following:

STORE:
- Store name: [YOUR STORE NAME]
- Tagline: [ONE LINE DESCRIPTION]
- What I sell: [TYPE OF PRODUCTS]
- Currency: [e.g. USD, INR, EUR, GBP]
- Currency symbol: [e.g. $, ₹, €, £]

DESIGN:
- Theme: [Dark / Light]
- Primary color: [COLOR NAME OR HEX CODE]
- Accent color: [COLOR FOR BADGES/HIGHLIGHTS]
- Heading font: [GOOGLE FONT NAME, e.g. Playfair Display, Oswald, Raleway]
- Body font: [GOOGLE FONT NAME, e.g. Lato, Nunito, Poppins]
- Button style: [pill / rounded / sharp]
- Card hover effect: [lift / glow / none]

HERO SECTION:
- Headline: [MAIN HEADING]
- Subheadline: [SUPPORTING TEXT]
- Button text: [e.g. Shop Now, Browse Collection, See Products]

CONTACT CHANNELS (leave blank to disable):
- WhatsApp: [PHONE WITH COUNTRY CODE, e.g. +911234567890]
- Telegram: [@username]
- Instagram: [@username]
- Facebook: [page URL or username]
- Email: [email address]
- Phone: [phone number]
- Twitter/X: [@username]
- Primary channel for floating button: [whatsapp / telegram / instagram / email]
- Channels to show on checkout page: [e.g. whatsapp, telegram, email]

ORDER MESSAGE (sent when customer places order):
[e.g. "Hi! I want to order from your store."]

DELIVERY NOTE (shown on checkout):
[e.g. "We'll call you within 2 hours to confirm your order and delivery."]

API KEYS (don't change if already set):
- ImgBB key: [YOUR KEY]
- GitHub token: [YOUR TOKEN]
- GitHub repo: [username/repo-name]
- Admin password: [YOUR PASSWORD]

FEATURES (on/off):
- Search bar: [yes/no]
- Category filter: [yes/no]
- Cart and checkout: [yes/no]
- Related products: [yes/no]
- Product specs table: [yes/no]
- Floating contact button: [yes/no]

ANNOUNCEMENT BAR (top of every page):
- Enabled: [yes/no]
- Text: [e.g. "🚚 Free shipping on all orders!"]
- Background color: [color]

Return ONLY the updated config.json. No explanation, no markdown, just raw JSON.
```

---

## What the AI can change

Everything in `config.json` automatically cascades to all pages:

| What you tell AI | What changes |
|---|---|
| Primary color | Nav logo, buttons, links, highlights across all pages |
| Theme dark/light | Background, text, card colors |
| Heading font | All titles across all pages |
| Body font | All paragraph text |
| Button style pill/sharp | All buttons across all pages |
| Add WhatsApp number | Floating button + checkout channel |
| Remove Telegram | Removed from checkout, floating button |
| Disable search | Removed from nav on all pages |
| Change hero text | Homepage hero updated |
| Enable announcement bar | Yellow banner at top of every page |

---

## After the AI gives you config.json

1. Go to your GitHub repo
2. Click `config.json` → ✏️ pencil icon
3. Select all → paste new JSON
4. Click **Commit changes**
5. Store updates in ~30 seconds

---

## Getting API Keys

### GitHub Token
1. github.com → Settings → Developer settings → Personal access tokens → Fine-grained
2. New token → set expiration → select your repo
3. Permissions: **Contents: Read and Write**
4. Generate and copy

### ImgBB Key (free image hosting)
1. Sign up at [imgbb.com](https://imgbb.com)
2. Visit [api.imgbb.com](https://api.imgbb.com)
3. Copy your API key

---

## Adding Products with Multiple Images

In admin.html:
1. Log in with your admin password
2. Click **Add Product**
3. Tap the image area to select **multiple images at once**
4. Or paste image URLs (one per line) in the text field
5. Fill in name, price, category, specs etc.
6. Click **Add Product** — it uploads to GitHub automatically

Product JSON structure (if editing manually):
```json
{
  "id": "p_001",
  "name": "Product Name",
  "images": ["url1", "url2", "url3"],
  "price": 29.99,
  "oldPrice": 39.99,
  "category": "Electronics",
  "badge": "NEW",
  "description": "Full description here",
  "specs": {
    "Brand": "Samsung",
    "Color": "Black",
    "Warranty": "1 Year"
  },
  "stock": "in_stock",
  "featured": true
}
```

Stock values: `in_stock` / `limited` / `out_of_stock`

---

## Store Pages

| Page | URL | Purpose |
|---|---|---|
| Homepage | `/index.html` | Product grid, hero, categories |
| Product Detail | `/product.html?id=XXX` | Gallery, specs, add to cart |
| Cart | `/cart.html` | Cart items, subtotal |
| Checkout | `/checkout.html` | COD summary, contact channels |
| Admin | `/admin.html` | Add/manage products |
| Setup | `/setup.html` | One-time setup wizard |
