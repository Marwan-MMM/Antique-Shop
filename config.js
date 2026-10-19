/* ============================================================================
   Antique Khan — site configuration (the ONLY file with settings you edit)
   ============================================================================

   1. SUPABASE_ANON_KEY — paste the "anon / publishable" key from
      Supabase Dashboard → Project Settings → API. It is safe to expose
      publicly (Row Level Security protects the data).
   2. Never put the service-role key in this file or anywhere in the frontend.

   The business details below are the official Antique Khan information.
   InstaPay details are intentionally left empty — the shop owner fills them
   in Admin → Settings (or here) once they are ready; nothing is invented.
============================================================================ */

window.AK_CONFIG = {
  /* ---- Supabase ---- */
  SUPABASE_URL: 'https://vvwrexpwdmhvjsyyhnxn.supabase.co',
  SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ2d3JleHB3ZG1odmpzeXlobnhuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI0MjY3ODAsImV4cCI6MjA3ODAwMjc4MH0.8VT1NJ1tEBLOYEjXUo8C_x8hQzuhrZ8Wb-Lm4U4eSRM',
  STORAGE_BUCKET: 'product-images',

  /* Path prefix if the site is NOT hosted at the domain root
     (e.g. GitHub Pages project site). Leave '' when using a custom domain
     or a username.github.io repository. Relative links need no prefix. */
  BASE_PATH: '',

  /* ---- Brand (official Antique Khan information) ---- */
  BRAND: {
    name: 'Antique Khan',
    type: 'Antique shop and gallery',
    /* Main slogan — shown on the homepage hero */
    sloganLines: ['From the Past', 'For the Future'],
    sloganNote: 'Each piece has a story — make it part of yours and your children\u2019s.',
    /* Short line used in the footer under the logo */
    tagline: 'From the Past, For the Future',
    /* Official business introduction (used on the Contact page) */
    about:
      'Antique Khan is more than a gallery \u2014 it is a living archive of culture and history. Each piece is hand-curated to preserve stories of craftsmanship, heritage, and beauty. From Alexandria\u2019s coastal charm to Cairo\u2019s bustling streets, our journey is rooted in discovery and storytelling. Yet our vision extends far beyond Egypt \u2014 we bring together antiques from across the world, each with its own heritage and soul. We believe antiques are more than objects; they are living witnesses of history, waiting to become part of your story today and tomorrow.',
    phoneDisplay: '01200057054',
    phoneHref: '+201200057054',
    email: 'Antiquekhan.EG@gmail.com',
    address: 'Cairo City \u2013 Alexandria City',
    /* Opening hours were not provided — leave '' to hide the line everywhere */
    hours: '',
    instagram: 'https://www.instagram.com/Antiquekhan.EG',
    facebook: 'https://facebook.com/AntiqueKhan.Egypt',
  },

  /* WhatsApp business number, international format without "+"
     (official: https://wa.me/201200057054) */
  WHATSAPP_NUMBER: '201200057054',

  /* InstaPay details — NOT provided yet, so they stay empty on purpose.
     Fill them in Admin → Settings (saved to Supabase, applies everywhere)
     or here as a fallback. While empty, checkout tells customers that the
     payment details will be shared by the shop after ordering. */
  INSTAPAY: {
    handle: '',
    number: '',
    name: '',
  },

  /* ---- Catalog ---- */
  CATEGORIES: [
    'Furniture',
    'Kitchenware',
    'Clocks',
    'Glassware',
    'Lighting',
    'Wall & Art',
    'Mirrors',
    'Sculptures',
    'Vases',
  ],

  GOVERNORATES: [
    'Alexandria', 'Aswan', 'Asyut', 'Beheira', 'Beni Suef', 'Cairo',
    'Dakahlia', 'Damietta', 'Fayoum', 'Gharbia', 'Giza', 'Ismailia',
    'Kafr El Sheikh', 'Luxor', 'Matrouh', 'Minya', 'Monufia', 'New Valley',
    'North Sinai', 'Port Said', 'Qalyubia', 'Qena', 'Red Sea', 'Sharqia',
    'Sohag', 'South Sinai', 'Suez',
  ],

  SORT_OPTIONS: [
    { value: 'newest', label: 'Newest first' },
    { value: 'price-asc', label: 'Price: Low to High' },
    { value: 'price-desc', label: 'Price: High to Low' },
  ],

  STATUS_LABELS: { active: 'Available', sold: 'Sold', inactive: 'Hidden' },
  ORDER_STATUS_LABELS: { new: 'New', confirmed: 'Confirmed', delivered: 'Delivered', cancelled: 'Cancelled' },
  ORDER_STATUSES: ['new', 'confirmed', 'delivered', 'cancelled'],

  /* Delivery fee — leave unset here; the live value comes from Admin → Settings.
     When unset, the site says the fee will be confirmed by the shop and never
     invents an amount. */
  DELIVERY_NOTE_DEFAULT: 'Delivery fee will be confirmed by the shop',

  /* Egyptian mobile: 01XXXXXXXXX / 1XXXXXXXXX / +201XXXXXXXXX / 201XXXXXXXXX */
  EGYPT_PHONE_REGEX: /^(\+?20)?1[0125]\d{8}$/,
};
