# Gokulanath K — Portfolio

A Next.js portfolio site: dark theme, computer-vision-inspired "landmark tracker"
animation in the hero, scroll-triggered reveals, an animated academic timeline,
and object-detection-style skill cards.

## 1. Run it locally (optional, to preview before deploying)

You need [Node.js](https://nodejs.org) (v18 or newer) installed on your computer.

```bash
npm install
npm run dev
```

Then open **http://localhost:3000** in your browser.

## 2. Add your resume PDF

The "Download Résumé" button points to `/resume.pdf`. Once you have your final
resume (with the project screenshots you mentioned), just drop the file into:

```
public/resume.pdf
```

Name it exactly `resume.pdf` — no code changes needed, the button will start
working the moment the file exists.

## 3. Deploy to Vercel

**Option A — via GitHub (recommended):**
1. Create a new repository on GitHub and push this project to it:
   ```bash
   git init
   git add .
   git commit -m "Initial portfolio"
   git branch -M main
   git remote add origin https://github.com/<your-username>/<repo-name>.git
   git push -u origin main
   ```
2. Go to [vercel.com](https://vercel.com), sign in with GitHub.
3. Click **Add New → Project**, select your repository.
4. Vercel auto-detects Next.js — just click **Deploy**. No config needed.
5. You'll get a live URL like `your-project.vercel.app`.

**Option B — via Vercel CLI (no GitHub needed):**
```bash
npm install -g vercel
vercel
```
Follow the prompts — it'll deploy directly from your machine.

## 4. Update content later

- **Photo**: replace `public/profile.jpg` (keep it roughly square, 800×800px works well).
- **Projects / text**: edit `app/page.js` — all copy lives directly in the JSX.
- **Colors / fonts / spacing**: edit `app/globals.css` — CSS variables are defined
  at the top under `:root`.
- **Page title / meta description**: edit the `metadata` object in `app/layout.js`.

## Project structure

```
app/
  layout.js      → fonts, page metadata
  page.js         → all page content + animations (client component)
  globals.css     → all styling (CSS variables, layout, animation keyframes)
public/
  profile.jpg     → your photo (already cropped to 800×800)
  resume.pdf      → add this yourself (see step 2 above)
```
