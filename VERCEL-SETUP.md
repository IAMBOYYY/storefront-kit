# 🚀 Vercel Deployment Guide

Deploy StorefrontKit on **Vercel** for a free website with a **private GitHub repo** — so your API keys, GitHub token, and admin password stay hidden from everyone.

> ✅ `vercel.json` is already included in this template. You do not need to add or change any files.

---

## 🆚 Why Vercel Over GitHub Pages?

| | GitHub Pages | Vercel |
|---|---|---|
| Cost | Free | Free |
| Repo must be public | ✅ Yes | ❌ No |
| Credentials visible to public | ⚠️ Yes | 🔒 No |
| Custom domain | ✅ | ✅ |
| Deploy on every commit | ✅ | ✅ |
| Setup | Easy | Easy |

---

## 🔒 Setup: Fork → Vercel → Private

### Step 1 — Fork / use the template

Click **"Use this template"** on the StorefrontKit repo → create your own repo.

---

### Step 2 — Import to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Sign in with your **GitHub account**
3. Click **Add New… → Project**
4. Find your store repo and click **Import**
5. Click **Deploy** — no settings to change, everything is pre-configured

Your store is live in about 20 seconds at:
```
https://your-repo-name.vercel.app
```

---

### Step 3 — Run the setup wizard

Open your Vercel URL and go to `/setup.html`:
```
https://your-store.vercel.app/setup.html
```

Fill in:
- Store name, currency
- GitHub Token (for saving products)
- ImgBB Key (for image uploads)
- GitHub repo name (`username/my-store`)
- Admin password
- Contact channels (WhatsApp, Telegram, etc.)

Download the `config.json` it generates → upload it to your GitHub repo → commit.

Vercel auto-detects the new commit and re-deploys in seconds.

---

### Step 4 — Make your GitHub repo private

Now that Vercel is hosting your site, make the repo private:

1. Go to your GitHub repo → **Settings**
2. Scroll to the bottom → **Danger Zone**
3. Click **"Change repository visibility"** → **Make private**
4. Confirm

> Vercel continues to deploy from private repos — it uses your GitHub OAuth connection, not a public URL. Your store keeps working exactly the same.

---

### Step 5 — Add products

Go to `/admin.html` on your Vercel URL:
```
https://your-store.vercel.app/admin.html
```

Log in with your admin password → **Add Product** → upload images → done.

---

## ✅ What Works on Vercel

| Feature | Works? |
|---|---|
| Homepage, product pages, cart, checkout | ✅ |
| `config.json` design & settings | ✅ |
| Products (loading) | ✅ via GitHub API + your token |
| Admin — add / edit / delete products | ✅ via GitHub API + your token |
| Image uploads (ImgBB) | ✅ |
| Auto-deploy on every commit | ✅ Vercel watches your repo |
| Custom domain | ✅ Add in Vercel dashboard → Domains |

---

## 🌐 Custom Domain (Optional)

1. In Vercel dashboard → your project → **Domains**
2. Click **Add** → type your domain (e.g. `mystore.com`)
3. Update your DNS records as shown by Vercel
4. Free SSL is automatic

---

## ❓ FAQ

**Q: Do I need to change any files before importing to Vercel?**
No. `vercel.json` is already in the template. Just import and deploy.

**Q: Will my products disappear after making the repo private?**
No. Products are stored in `products.json` in your repo and read via the GitHub API using your token. Private or public, it works the same.

**Q: Do I need to change my GitHub Token or ImgBB key?**
No. Everything in `config.json` stays exactly the same.

**Q: Can I still update my store from my phone?**
Yes. Go to `yourstore.vercel.app/admin.html` from any browser.

**Q: What if I want to go back to GitHub Pages?**
Re-enable GitHub Pages in your repo settings (Settings → Pages → Source → GitHub Actions) and make the repo public again. You can even run both simultaneously.

**Q: Is the free Vercel plan enough?**
Yes. Vercel's free Hobby plan supports unlimited static sites with 100GB bandwidth/month — more than enough for any store.

**Q: What about the `deploy.yml` GitHub Actions file?**
That file is for GitHub Pages only. On Vercel you can ignore it — Vercel handles deployment on its own. You can disable it under repo → Actions → Deploy to GitHub Pages → "..." → Disable workflow.

---

Made with ❤️ by [IAMBOYYY](https://github.com/IAMBOYYY)
