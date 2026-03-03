# myvylo.com — marketing site

Single-page static site for [myvylo.com](https://www.myvylo.com).

## Stack
- Plain HTML + Tailwind CSS (CDN) — no build step required
- Vanilla JS for nav scroll effect, mobile menu, and FAQ accordion

## Deploy to Cloudflare Pages

1. Push this repo to GitHub
2. In Cloudflare Pages → **Create project** → connect the repo
3. Build settings:
   - **Build command**: *(leave blank)*
   - **Output directory**: `/` (root)
4. Set custom domain → `www.myvylo.com`

Cloudflare will serve `index.html` automatically.

## Local preview

```bash
npx serve .
# or just open index.html directly in a browser
```

## Updating

All content is in `index.html`. The design tokens at the top of the `<style>` block
mirror the app at `app.myvylo.com` — update them there if the brand evolves.
