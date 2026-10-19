# Antique Khan — Static Edition (HTML + CSS + Vanilla JS + Supabase)

The **same** Antique Khan store, migrated from the Next.js/React/Prisma/SQLite
app to a plain static website: **HTML5, CSS3, vanilla JavaScript, Supabase
PostgreSQL, Supabase Storage and Supabase Auth**. No build step, no npm, no
server-side code. Deploy the files in this folder to any static host
(GitHub Pages works out of the box).

> This was a technology migration, not a redesign. Every page, color, font,
> layout, animation and feature was ported from the original project.

## Official business information (integrated)

| | |
|---|---|
| **Brand** | Antique Khan — antique shop and gallery |
| **Slogan** | From the Past · For the Future — *"Each piece has a story — make it part of yours and your children's."* |
| **Phone** | [01200057054](tel:+201200057054) |
| **WhatsApp** | https://wa.me/201200057054 (orders + contact) |
| **Email** | [Antiquekhan.EG@gmail.com](mailto:Antiquekhan.EG@gmail.com) |
| **Location** | Cairo City – Alexandria City |
| **Instagram** | https://www.instagram.com/Antiquekhan.EG |
| **Facebook** | https://facebook.com/AntiqueKhan.Egypt |

The official business introduction is shown on the **Contact Us** page
("About Antique Khan") and the slogan on the **homepage hero**.

---

## 1. Files

| File | Purpose |
|---|---|
| `index.html` / `home.js` | Home: hero (official slogan), categories, featured, newly added, value props, contact + about |
| `shop.html` / `shop.js` | Shop grid, filters sheet (9 official categories), price min/max, sorting, active-filter chips, **Past Gems of Antique Khan** archive |
| `product.html` / `product.js` | Product detail: swipe gallery, dots, thumbnails, height/length (only when provided), caption, sticky buy bar, related pieces |
| `wishlist.html` / `wishlist.js` | Saved pieces (per device, localStorage) |
| `cart.html` / `cart.js` | Cart with quantity steppers and live availability checks against Supabase |
| `checkout.html` / `checkout.js` | Checkout form (name, phone, optional second phone, searchable 27-governorate list, city/area, address, notes), COD/InstaPay, WhatsApp hand-off |
| `contact.html` / `contact.js` | Contact page: official contact details, social links, About section |
| `admin.html` / `admin.js` | Admin: Supabase Auth login, stats (Total/Available/Sold/Hidden), product CRUD, camera/gallery uploads, orders, **Settings (InstaPay + delivery fee)** |
| `config.js` | **The only file you edit**: Supabase key + business settings |
| `common.js` | Shared engine: Supabase client, cart/wishlist, header/footer, toasts, sheets, icons |
| `style.css` | The full design system (ivory / espresso / brass, Cormorant Garamond + Jost) |
| `supabase.js` | Official supabase-js v2 (vendored UMD build — no CDN needed) |
| `supabase-setup.sql` | One-time **additive** database setup (safe on a live table) |
| `migrate-images.mjs` | One-time helper: uploads the old project's photos into Supabase Storage |
| `README.md` | This file |

Cart and wishlist keep working — they are stored in the browser's localStorage
under the same keys (`ak-cart`, `ak-wishlist`) and the loader understands both
the new and the old (Zustand) formats. They only ever remember *your own*
selections; prices and availability are always re-checked against Supabase.

---

## 2. Setup checklist (one-time, ~10 minutes)

### Step 1 — Run the SQL against your existing database
1. Open your Supabase dashboard → **SQL Editor**.
2. Open `supabase-setup.sql` and in **section 4** replace `admin@example.com`
   with the email you want to log in with.
3. Paste the whole file into the SQL Editor and run it.

The script is **additive and non-destructive** — it is designed for your
existing `public.products` table:
- it never drops or recreates tables, never deletes or overwrites rows;
- it only *adds* the optional columns the website uses
  (`description`, `height`, `length`, `featured`, `updated_at`);
- it fixes the old `'''active'''` status default and normalizes any
  quote-wrapped status values to `active` / `sold` / `inactive`;
- it creates the `orders` and `settings` tables, the `admin_users` allow-list,
  Row Level Security policies and the public `product-images` Storage bucket.

**About `image_urls`** (existing text column): the website reads it
defensively and understands a JSON array of URLs, a JSON array of objects
with a `url` property, newline/comma-separated URLs, or a single URL. The
admin panel writes a JSON array of URL strings and stores the cover photo in
`image_url`. **Your existing values stay valid — nothing needs converting.**

### Step 2 — Create the admin user
1. Dashboard → **Authentication → Users → Add user → Create new user**.
2. Use the **same email** you put in `admin_users`, set a strong password,
   and tick *Auto Confirm User*.
3. Recommended: Dashboard → **Authentication → Sign In / Providers** → turn
   **off** "Allow new users to sign up" so nobody else can create an account.

### Step 3 — Connect the website
1. Dashboard → **Project Settings → API** → copy the **anon / publishable**
   key (NOT the service-role key).
2. Open `config.js` and paste it into `SUPABASE_ANON_KEY`.
3. Open `index.html` — the store loads your live catalog.

### Step 4 — Product photos
- New photos upload straight from the admin panel (phone camera or gallery,
  compressed in the browser, stored in the `product-images` bucket).
- To reuse the old project's photos, run once from a trusted machine:
  ```bash
  SUPABASE_SERVICE_ROLE_KEY="eyJ…" node migrate-images.mjs /path/to/old/project
  ```
  The service-role key is used **only** by this script on your machine and is
  **never** put in the website. (Dashboard → Storage drag-and-drop works too.)

---

## 3. Deploy to GitHub Pages

1. Create a repository and commit all the website files in this folder
   (`*.html`, `*.js`, `*.css`, `supabase-setup.sql`, `migrate-images.mjs`, `README.md`).
   The old Next.js project folders (`src/`, `db/`, `prisma/`, …) can stay as
   your backup until you are satisfied — GitHub Pages simply ignores them.
2. Repo → **Settings → Pages** → Source: *Deploy from a branch* → `main` / root → Save.
3. Your site appears at `https://<username>.github.io/<repo>/`.
   All links between pages are **relative**, so it works under the repo path
   with no configuration.
4. Supabase → **Authentication → URL Configuration** → set **Site URL** to
   your Pages URL.

To update the site later: edit the files, commit, push. Products, orders and
settings change through the admin page — no redeploy needed.

---

## 4. Business settings you still need to provide

These are intentionally **not invented** anywhere in the site:

| Setting | Where to enter it | What customers see until then |
|---|---|---|
| **InstaPay number / handle / account name** | Admin → Settings (stored in Supabase; also editable in `config.js`) | "The shop will share the InstaPay payment details with you on WhatsApp after you place the order." |
| **Delivery fee** | Admin → Settings | "Delivery fee will be confirmed by the shop" — totals show subtotal + delivery; no amount is invented. |
| **Opening hours** (optional) | `config.js` → `BRAND.hours` | The line is hidden entirely while empty. |

Everything else (phone, WhatsApp, email, location, Instagram, Facebook,
slogan, About text) is already integrated from the official information.

---

## 5. How ordering works

1. Customer adds active pieces to the cart (sold pieces are locked; hidden
   pieces are never even downloadable by the public — enforced by RLS).
2. Checkout collects name, phone, optional additional phone, one of the 27
   governorates (searchable), city/area, full address, notes, and the payment
   method (Cash on Delivery or InstaPay).
3. The order is saved into the Supabase `orders` table (guests may only
   *insert* — customer details are never publicly readable) and an
   **AK-XXXXX** code is issued.
4. WhatsApp opens on the official number **201200057054** with a prefilled
   message: shop name, order code, items with quantities and unit prices,
   subtotal, delivery fee (only when configured — otherwise "to be confirmed
   by the shop"), total from known amounts only, payment method, and the full
   delivery details.
5. The site says the order was **saved** and asks the customer to send the
   WhatsApp message — it never claims the order is confirmed.

---

## 6. Security model (what replaced the old server)

| Concern | Old (Next.js server) | Now (Supabase) |
|---|---|---|
| Who can read the catalog | API returned `active`+`sold` only | RLS: `status in ('active','sold')` for everyone |
| Who sees Hidden pieces | admin-only API flag | RLS: extra policy for emails in `admin_users` |
| Who can edit products | server checked session cookie | RLS: INSERT/UPDATE/DELETE need `is_admin()` |
| Who can read orders | admin-only endpoint | RLS: SELECT needs `is_admin()` |
| Who can place orders | public endpoint | RLS: INSERT-only for guests, nothing else |
| Shop settings | config file | `settings` table: public read, admin-only write |
| Image uploads | server route writing to disk | Storage policies: read public, write admin only |
| Admin login | username/password + signed cookie | Supabase Auth (email + password) |

The anon key in `config.js` is safe to expose — every permission is enforced
inside Supabase by RLS and Storage policies, not by the website code.
**The service-role key must never be placed in the frontend.**

---

## 7. Editing content

- Business info, WhatsApp number, categories, governorates → `config.js`.
- InstaPay details & delivery fee → **Admin → Settings** (no redeploy needed).
- Colors / fonts → `style.css` (`:root` tokens at the top).
- Database changes → Supabase SQL Editor.
- Admin account → Supabase Auth users + `admin_users` table.

## 8. Troubleshooting

| Symptom | Fix |
|---|---|
| Yellow "Supabase is not connected" banner | Paste the anon key into `config.js` |
| Admin login fails "Invalid login credentials" | Create the user in Auth → Users (Step 2), same email as `admin_users` |
| Admin operations say "row-level security" | Your email is missing from `admin_users` (SQL editor, section 4) |
| Admin sees 0 products while the shop shows some | The admin email in `admin_users` doesn't match your Auth login email |
| Status shows odd quotes in the DB | Re-run `supabase-setup.sql` (section 1 normalizes them) |
| New signups possible | Disable "Allow new users to sign up" (Step 2.3) |
| Checkout insert fails | Re-run `supabase-setup.sql` and check the `orders` INSERT policy |
