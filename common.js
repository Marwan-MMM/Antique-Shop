/* ============================================================================
   Antique Khan — common.js
   Shared engine: Supabase client, icons, formatting, cart & wishlist,
   header/footer, mobile menu, sheets, dialogs, toasts, data access.
   Loaded by every page (after config.js and supabase.js).
============================================================================ */
(function () {
  'use strict';

  var C = window.AK_CONFIG;
  var ICONS = {};
  // Auto-generated from lucide-static 0.525.0 (same icon set the original site used).
// name -> inner SVG markup (24x24, stroke-based).
var ICONS = {
"facebook": "<path d=\"M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z\" />",
"info": "<circle cx=\"12\" cy=\"12\" r=\"10\" />\n  <path d=\"M12 16v-4\" />\n  <path d=\"M12 8h.01\" />",
"circle-check": "<circle cx=\"12\" cy=\"12\" r=\"10\" />\n  <path d=\"m9 12 2 2 4-4\" />","arrow-left":"<path d=\"m12 19-7-7 7-7\" />\n  <path d=\"M19 12H5\" />","house":"<path d=\"M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8\" />\n  <path d=\"M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z\" />","arrow-right":"<path d=\"M5 12h14\" />\n  <path d=\"m12 5 7 7-7 7\" />","ruler":"<path d=\"M21.3 15.3a2.4 2.4 0 0 1 0 3.4l-2.6 2.6a2.4 2.4 0 0 1-3.4 0L2.7 8.7a2.41 2.41 0 0 1 0-3.4l2.6-2.6a2.41 2.41 0 0 1 3.4 0Z\" />\n  <path d=\"m14.5 12.5 2-2\" />\n  <path d=\"m11.5 9.5 2-2\" />\n  <path d=\"m8.5 6.5 2-2\" />\n  <path d=\"m17.5 15.5 2-2\" />","rotate-ccw":"<path d=\"M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8\" />\n  <path d=\"M3 3v5h5\" />","message-circle":"<path d=\"M7.9 20A9 9 0 1 0 4 16.1L2 22Z\" />","plus":"<path d=\"M5 12h14\" />\n  <path d=\"M12 5v14\" />","x":"<path d=\"M18 6 6 18\" />\n  <path d=\"m6 6 12 12\" />","instagram":"<rect width=\"20\" height=\"20\" x=\"2\" y=\"2\" rx=\"5\" ry=\"5\" />\n  <path d=\"M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z\" />\n  <line x1=\"17.5\" x2=\"17.51\" y1=\"6.5\" y2=\"6.5\" />","triangle-alert":"<path d=\"m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3\" />\n  <path d=\"M12 9v4\" />\n  <path d=\"M12 17h.01\" />","image-plus":"<path d=\"M16 5h6\" />\n  <path d=\"M19 2v6\" />\n  <path d=\"M21 11.5V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7.5\" />\n  <path d=\"m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21\" />\n  <circle cx=\"9\" cy=\"9\" r=\"2\" />","minus":"<path d=\"M5 12h14\" />","menu":"<path d=\"M4 12h16\" />\n  <path d=\"M4 18h16\" />\n  <path d=\"M4 6h16\" />","package-open":"<path d=\"M12 22v-9\" />\n  <path d=\"M15.17 2.21a1.67 1.67 0 0 1 1.63 0L21 4.57a1.93 1.93 0 0 1 0 3.36L8.82 14.79a1.655 1.655 0 0 1-1.64 0L3 12.43a1.93 1.93 0 0 1 0-3.36z\" />\n  <path d=\"M20 13v3.87a2.06 2.06 0 0 1-1.11 1.83l-6 3.08a1.93 1.93 0 0 1-1.78 0l-6-3.08A2.06 2.06 0 0 1 4 16.87V13\" />\n  <path d=\"M21 12.43a1.93 1.93 0 0 0 0-3.36L8.83 2.2a1.64 1.64 0 0 0-1.63 0L3 4.57a1.93 1.93 0 0 0 0 3.36l12.18 6.86a1.636 1.636 0 0 0 1.63 0z\" />","truck":"<path d=\"M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2\" />\n  <path d=\"M15 18H9\" />\n  <path d=\"M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14\" />\n  <circle cx=\"17\" cy=\"18\" r=\"2\" />\n  <circle cx=\"7\" cy=\"18\" r=\"2\" />","heart":"<path d=\"M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z\" />","log-out":"<path d=\"m16 17 5-5-5-5\" />\n  <path d=\"M21 12H9\" />\n  <path d=\"M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4\" />","mail":"<path d=\"m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7\" />\n  <rect x=\"2\" y=\"4\" width=\"20\" height=\"16\" rx=\"2\" />","clock":"<path d=\"M12 6v6l4 2\" />\n  <circle cx=\"12\" cy=\"12\" r=\"10\" />","sparkles":"<path d=\"M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z\" />\n  <path d=\"M20 3v4\" />\n  <path d=\"M22 5h-4\" />\n  <path d=\"M4 17v2\" />\n  <path d=\"M5 18H3\" />","image":"<rect width=\"18\" height=\"18\" x=\"3\" y=\"3\" rx=\"2\" ry=\"2\" />\n  <circle cx=\"9\" cy=\"9\" r=\"2\" />\n  <path d=\"m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21\" />","circle-alert":"<circle cx=\"12\" cy=\"12\" r=\"10\" />\n  <line x1=\"12\" x2=\"12\" y1=\"8\" y2=\"12\" />\n  <line x1=\"12\" x2=\"12.01\" y1=\"16\" y2=\"16\" />","camera":"<path d=\"M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z\" />\n  <circle cx=\"12\" cy=\"13\" r=\"3\" />","chevrons-up-down":"<path d=\"m7 15 5 5 5-5\" />\n  <path d=\"m7 9 5-5 5 5\" />","banknote":"<rect width=\"20\" height=\"12\" x=\"2\" y=\"6\" rx=\"2\" />\n  <circle cx=\"12\" cy=\"12\" r=\"2\" />\n  <path d=\"M6 12h.01M18 12h.01\" />","eye-off":"<path d=\"M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49\" />\n  <path d=\"M14.084 14.158a3 3 0 0 1-4.242-4.242\" />\n  <path d=\"M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143\" />\n  <path d=\"m2 2 20 20\" />","check":"<path d=\"M20 6 9 17l-5-5\" />","phone":"<path d=\"M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384\" />","smartphone":"<rect width=\"14\" height=\"20\" x=\"5\" y=\"2\" rx=\"2\" ry=\"2\" />\n  <path d=\"M12 18h.01\" />","eye":"<path d=\"M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0\" />\n  <circle cx=\"12\" cy=\"12\" r=\"3\" />","shield-check":"<path d=\"M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z\" />\n  <path d=\"m9 12 2 2 4-4\" />","map-pin":"<path d=\"M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0\" />\n  <circle cx=\"12\" cy=\"10\" r=\"3\" />","chevron-left":"<path d=\"m15 18-6-6 6-6\" />","chevron-down":"<path d=\"m6 9 6 6 6-6\" />","trash-2":"<path d=\"M3 6h18\" />\n  <path d=\"M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6\" />\n  <path d=\"M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2\" />\n  <line x1=\"10\" x2=\"10\" y1=\"11\" y2=\"17\" />\n  <line x1=\"14\" x2=\"14\" y1=\"11\" y2=\"17\" />","store":"<path d=\"m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7\" />\n  <path d=\"M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8\" />\n  <path d=\"M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4\" />\n  <path d=\"M2 7h20\" />\n  <path d=\"M22 7v3a2 2 0 0 1-2 2a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 16 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 12 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 8 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 4 12a2 2 0 0 1-2-2V7\" />","package":"<path d=\"M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73z\" />\n  <path d=\"M12 22V12\" />\n  <polyline points=\"3.29 7 12 12 20.71 7\" />\n  <path d=\"m7.5 4.27 9 5.15\" />","star":"<path d=\"M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z\" />","bell":"<path d=\"M10.268 21a2 2 0 0 0 3.464 0\" />\n  <path d=\"M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326\" />","tag":"<path d=\"M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z\" />\n  <circle cx=\"7.5\" cy=\"7.5\" r=\".5\" fill=\"currentColor\" />","search-x":"<path d=\"m13.5 8.5-5 5\" />\n  <path d=\"m8.5 8.5 5 5\" />\n  <circle cx=\"11\" cy=\"11\" r=\"8\" />\n  <path d=\"m21 21-4.3-4.3\" />","chevron-right":"<path d=\"m9 18 6-6-6-6\" />","search":"<path d=\"m21 21-4.34-4.34\" />\n  <circle cx=\"11\" cy=\"11\" r=\"8\" />","sliders-horizontal":"<line x1=\"21\" x2=\"14\" y1=\"4\" y2=\"4\" />\n  <line x1=\"10\" x2=\"3\" y1=\"4\" y2=\"4\" />\n  <line x1=\"21\" x2=\"12\" y1=\"12\" y2=\"12\" />\n  <line x1=\"8\" x2=\"3\" y1=\"12\" y2=\"12\" />\n  <line x1=\"21\" x2=\"16\" y1=\"20\" y2=\"20\" />\n  <line x1=\"12\" x2=\"3\" y1=\"20\" y2=\"20\" />\n  <line x1=\"14\" x2=\"14\" y1=\"2\" y2=\"6\" />\n  <line x1=\"8\" x2=\"8\" y1=\"10\" y2=\"14\" />\n  <line x1=\"16\" x2=\"16\" y1=\"18\" y2=\"22\" />","pencil":"<path d=\"M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z\" />\n  <path d=\"m15 5 4 4\" />","shopping-bag":"<path d=\"M16 10a4 4 0 0 1-8 0\" />\n  <path d=\"M3.103 6.034h17.794\" />\n  <path d=\"M3.4 5.467a2 2 0 0 0-.4 1.2V20a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6.667a2 2 0 0 0-.4-1.2l-2-2.667A2 2 0 0 0 17 2H7a2 2 0 0 0-1.6.8z\" />","loader-circle":"<path d=\"M21 12a9 9 0 1 1-6.219-8.56\" />","grip-vertical":"<circle cx=\"9\" cy=\"12\" r=\"1\" /><circle cx=\"9\" cy=\"5\" r=\"1\" /><circle cx=\"9\" cy=\"19\" r=\"1\" /><circle cx=\"15\" cy=\"12\" r=\"1\" /><circle cx=\"15\" cy=\"5\" r=\"1\" /><circle cx=\"15\" cy=\"19\" r=\"1\" />","chevron-up":"<path d=\"m18 15-6-6-6 6\" />","link":"<path d=\"M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71\" /><path d=\"M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71\" />"};

  var AK = (window.AK = {});

  /* ------------------------------------------------------------------ */
  /* Supabase client                                                     */
  /* ------------------------------------------------------------------ */
  var MISSING = !C.SUPABASE_ANON_KEY || C.SUPABASE_ANON_KEY.indexOf('PASTE_') === 0;

  AK.isConfigured = function () {
    return !MISSING;
  };

  /* Optional local-preview hook: when a reverse gateway needs a port hint
     (e.g. sandbox previews), every same-origin request gets the query param
     appended automatically. In normal deployments this global is undefined
     and fetch is used unchanged. */
  function gatewayFetch(url, init) {
    var port = window.AK_GATEWAY_PORT;
    if (port && typeof url === 'string' && url.indexOf('XTransformPort=') === -1) {
      url += (url.indexOf('?') === -1 ? '?' : '&') + 'XTransformPort=' + port;
    }
    return fetch(url, init);
  }

  AK.db = window.supabase
    ? window.supabase.createClient(C.SUPABASE_URL, C.SUPABASE_ANON_KEY, {
        global: { fetch: gatewayFetch },
        auth: { persistSession: true, autoRefreshToken: true },
      })
    : null;

  /* ------------------------------------------------------------------ */
  /* Small helpers                                                       */
  /* ------------------------------------------------------------------ */
  AK.esc = function (s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  };

  AK.icon = function (name, cls) {
    var body = ICONS[name] || '';
    return (
      '<svg class="ic' + (cls ? ' ' + cls : '') + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
      body +
      '</svg>'
    );
  };

  AK.fmtEGP = function (n) {
    return 'EGP ' + new Intl.NumberFormat('en-EG', { maximumFractionDigits: 0 }).format(n);
  };

  AK.fmtDate = function (iso) {
    return new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(iso));
  };

  AK.fmtDateTime = function (iso) {
    return new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }).format(new Date(iso));
  };

  AK.waLink = function (message) {
    return 'https://wa.me/' + C.WHATSAPP_NUMBER + '?text=' + encodeURIComponent(message);
  };

  /* Mirrors the original server logic: strip spaces/dashes, drop ONE leading 0. */
  AK.normalizePhone = function (raw) {
    var digits = String(raw || '').replace(/[\s-]/g, '');
    return digits.charAt(0) === '0' ? digits.slice(1) : digits;
  };

  AK.errMessage = function (err) {
    return (err && err.message) || 'Something went wrong';
  };

  /* ------------------------------------------------------------------ */
  /* Order → WhatsApp message (sent to the official Antique Khan number) */
  /* ------------------------------------------------------------------ */
  AK.orderMessage = function (order) {
    var L = [];
    L.push('ANTIQUE KHAN — NEW ORDER');
    L.push('');
    L.push('Order ' + order.code);
    L.push('');
    (order.items || []).forEach(function (it) {
      L.push('• ' + it.title);
      L.push('  ' + it.qty + ' × ' + AK.fmtEGP(it.price) + ' = ' + AK.fmtEGP(it.price * it.qty));
    });
    L.push('');
    L.push('Subtotal: ' + AK.fmtEGP(order.subtotal));
    var fee = order.deliveryFee;
    if (fee === null || fee === undefined || fee === '') {
      L.push('Delivery fee: to be confirmed by the shop');
      L.push('Total (before delivery): ' + AK.fmtEGP(order.subtotal));
    } else {
      L.push('Delivery fee: ' + AK.fmtEGP(Number(fee)));
      L.push('Total: ' + AK.fmtEGP(Number(order.total)));
    }
    L.push('Payment: ' + (order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'InstaPay'));
    L.push('');
    L.push('Name: ' + order.customerName);
    L.push('Phone: ' + order.phone);
    if (order.phone2) L.push('Additional phone: ' + order.phone2);
    L.push('Governorate: ' + order.governorate);
    L.push('Area / City: ' + order.cityArea);
    L.push('Address: ' + order.address);
    if (order.notes) L.push('Notes: ' + order.notes);
    L.push('');
    L.push('— Sent from the Antique Khan website');
    return L.join('\n');
  };

  /* ------------------------------------------------------------------ */
  /* Product mapping (live Supabase schema → site Product shape)         */
  /*   products table: id uuid, title, category, price, status,          */
  /*   image_url (cover), image_urls (text), caption, created_at         */
  /*   + additive columns: description, height, length,                  */
  /*     updated_at (added by supabase-setup.sql)                        */
  /* ------------------------------------------------------------------ */

  /* image_urls is an existing TEXT column, so it is parsed defensively:
     · JSON array of URL strings        → used as-is
     · JSON array of objects            → first url/src/link/image prop
     · newline- or comma-separated URLs → split
     The admin panel always writes a JSON array of URL strings. */
  function parseImageUrls(raw) {
    if (raw === null || raw === undefined) return [];
    var s = String(raw).trim();
    if (!s) return [];
    if (s.charAt(0) === '[') {
      try {
        var v = JSON.parse(s);
        if (Array.isArray(v)) {
          var out = [];
          v.forEach(function (x) {
            var u = '';
            if (typeof x === 'string') u = x;
            else if (x && typeof x === 'object') u = x.url || x.src || x.link || x.image || '';
            u = String(u).trim();
            if (u) out.push(u);
          });
          if (out.length) return out;
        }
      } catch (e) { /* fall through to plain-text parsing */ }
    }
    return s.split(/[\n,]+/).map(function (x) { return x.trim(); }).filter(Boolean);
  }

  /* Accepts absolute URLs, root-relative URLs and bare Storage paths. */
  AK.normalizeImgUrl = function (u) {
    var s = String(u || '').trim();
    if (!s) return '';
    if (/^https?:\/\//i.test(s) || s.charAt(0) === '/' || s.charAt(0) === '#') return s;
    if (/^data:image\//i.test(s)) return s;
    return AK.storageUrl(s.replace(/^\.\//, ''));
  };

  AK.mapProduct = function (row) {
    var urls = parseImageUrls(row.image_urls).map(AK.normalizeImgUrl);
    var cover = AK.normalizeImgUrl(row.image_url);
    /* display order: cover first, then the remaining gallery images */
    var ordered = cover ? [cover] : [];
    urls.forEach(function (u) {
      if (ordered.indexOf(u) === -1) ordered.push(u);
    });
    return {
      id: row.id,
      title: row.title,
      description: row.description || '',
      price: row.price === null || row.price === undefined ? 0 : Number(row.price),
      category: row.category || '',
      status: row.status || 'active',
      featured: !!row.featured,
      caption: row.caption || '',
      height: row.height || '',
      length: row.length || '',
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      cover: ordered[0] || null,
      images: ordered.map(function (u, i) { return { url: u, isMain: i === 0 }; }),
    };
  };

  AK.mainImage = function (p) {
    if (p.cover) return p.cover;
    var m = null;
    for (var i = 0; i < p.images.length; i++) if (p.images[i].isMain) { m = p.images[i]; break; }
    return (m || p.images[0] || {}).url || null;
  };

  /* Serialise the admin/editor image list back into the two DB columns. */
  AK.serializeImages = function (images) {
    var urls = (images || []).map(function (im) { return im.url; }).filter(Boolean);
    var cover = null;
    for (var i = 0; i < (images || []).length; i++) {
      if (images[i].isMain) { cover = images[i].url; break; }
    }
    if (!cover && urls.length) cover = urls[0];
    return { image_url: cover, image_urls: JSON.stringify(urls) };
  };

  AK.storageUrl = function (path) {
    var base = C.SUPABASE_URL + '/storage/v1/object/public/' + C.STORAGE_BUCKET + '/' + path;
    if (window.AK_GATEWAY_PORT && base.indexOf('XTransformPort=') === -1) {
      base += (base.indexOf('?') === -1 ? '?' : '&') + 'XTransformPort=' + window.AK_GATEWAY_PORT;
    }
    return base;
  };

  /* Broken-image fallback → hide img, mark wrapper (CSS shows a placeholder). */
  AK.imgFail = function (img) {
    img.style.display = 'none';
    if (img.parentElement) img.parentElement.classList.add('img-failed');
  };

  /* ------------------------------------------------------------------ */
  /* Cart & wishlist (localStorage — survives refresh, per device)       */
  /* ------------------------------------------------------------------ */
  function loadKey(key) {
    try {
      var raw = JSON.parse(localStorage.getItem(key) || 'null');
      if (Array.isArray(raw)) return raw;
      /* compatible with the old Next.js app's zustand format */
      if (raw && raw.state && Array.isArray(raw.state.items)) return raw.state.items;
    } catch (e) { /* ignore */ }
    return [];
  }

  var listeners = {};
  function emit(ev) {
    AK.refreshBadges();
    (listeners[ev] || []).forEach(function (cb) { try { cb(); } catch (e) { console.error(e); } });
  }

  var cart = {
    items: loadKey('ak-cart'),
    save: function () { localStorage.setItem('ak-cart', JSON.stringify(this.items)); emit('cart'); },
    count: function () { return this.items.reduce(function (s, i) { return s + i.qty; }, 0); },
    subtotal: function () { return this.items.reduce(function (s, i) { return s + i.price * i.qty; }, 0); },
    add: function (product, qty) {
      qty = qty || 1;
      var q = Math.max(1, Math.min(qty, 99));
      var existing = null;
      for (var i = 0; i < this.items.length; i++) if (this.items[i].productId === product.id) existing = this.items[i];
      if (existing) {
        existing.qty = Math.max(1, Math.min(existing.qty + q, 99));
      } else {
        this.items.push({
          productId: product.id, title: product.title,
          price: product.price, image: AK.mainImage(product), qty: q,
        });
      }
      this.save();
    },
    setQty: function (id, qty) {
      this.items = this.items.map(function (i) {
        return i.productId === id ? { ...i, qty: Math.max(1, Math.min(qty, 99)) } : i;
      });
      this.save();
    },
    remove: function (id) {
      this.items = this.items.filter(function (i) { return i.productId !== id; });
      this.save();
    },
    clear: function () { this.items = []; this.save(); },
  };

  var wishlist = {
    items: loadKey('ak-wishlist'),
    save: function () { localStorage.setItem('ak-wishlist', JSON.stringify(this.items)); emit('wishlist'); },
    has: function (id) { return this.items.some(function (i) { return i.productId === id; }); },
    toggle: function (product) {
      var added;
      if (this.has(product.id)) {
        this.items = this.items.filter(function (i) { return i.productId !== product.id; });
        added = false;
      } else {
        this.items.push({
          productId: product.id, title: product.title,
          price: product.price, image: AK.mainImage(product), status: product.status,
        });
        added = true;
      }
      this.save();
      return added;
    },
    remove: function (id) {
      this.items = this.items.filter(function (i) { return i.productId !== id; });
      this.save();
    },
  };

  AK.cart = cart;
  AK.wishlist = wishlist;
  AK.on = function (ev, cb) { (listeners[ev] = listeners[ev] || []).push(cb); };

  /* ------------------------------------------------------------------ */
  /* Toasts (sonner-style, top center)                                  */
  /* ------------------------------------------------------------------ */
  var toastBox = null;
  AK.toast = function (msg, type) {
    type = type || 'info';
    if (!toastBox) {
      toastBox = document.createElement('div');
      toastBox.className = 'toaster';
      toastBox.setAttribute('aria-live', 'polite');
      document.body.appendChild(toastBox);
    }
    var t = document.createElement('div');
    t.className = 'toast toast--' + type;
    t.setAttribute('role', 'status');
    var ic = type === 'success' ? AK.icon('circle-check') : type === 'error' ? AK.icon('circle-alert') : AK.icon('info');
    t.innerHTML = '<span class="toast__ic">' + ic + '</span><span class="toast__msg">' + AK.esc(msg) + '</span>';
    toastBox.appendChild(t);
    requestAnimationFrame(function () { t.classList.add('is-in'); });
    setTimeout(function () {
      t.classList.remove('is-in');
      setTimeout(function () { t.remove(); }, 250);
    }, 3400);
  };
  AK.toast.success = function (m) { AK.toast(m, 'success'); };
  AK.toast.error = function (m) { AK.toast(m, 'error'); };

  /* ------------------------------------------------------------------ */
  /* Sheet (bottom on mobile-first usage, right for menus/forms)          */
  /* ------------------------------------------------------------------ */
  var openSheets = 0;

  AK.openSheet = function (opts) {
    var overlay = document.createElement('div');
    overlay.className = 'sheet-overlay';
    var sheet = document.createElement('div');
    sheet.className = 'sheet sheet--' + (opts.side || 'bottom');
    sheet.setAttribute('role', 'dialog');
    sheet.setAttribute('aria-modal', 'true');
    var headerHtml =
      '<div class="sheet__head">' +
      '<div><h2 class="sheet__title">' + AK.esc(opts.title || '') + '</h2>' +
      (opts.description ? '<p class="sheet__desc">' + AK.esc(opts.description) + '</p>' : '') +
      '</div>' +
      '<button type="button" class="sheet__x" aria-label="Close">' + AK.icon('x') + '</button>' +
      '</div>';
    sheet.innerHTML = headerHtml + '<div class="sheet__body"></div>';
    overlay.appendChild(sheet);
    document.body.appendChild(overlay);
    document.body.style.overflow = 'hidden';
    openSheets++;

    function close() {
      if (!overlay.parentNode) return;
      openSheets--;
      if (openSheets <= 0) document.body.style.overflow = '';
      overlay.classList.add('is-closing');
      setTimeout(function () { overlay.remove(); }, 220);
      document.removeEventListener('keydown', onKey);
      if (opts.onClose) opts.onClose();
    }
    function onKey(e) { if (e.key === 'Escape') close(); }

    overlay.addEventListener('click', function (e) { if (e.target === overlay) close(); });
    sheet.querySelector('.sheet__x').addEventListener('click', close);
    document.addEventListener('keydown', onKey);

    if (opts.build) opts.build(sheet.querySelector('.sheet__body'), close);
    requestAnimationFrame(function () { overlay.classList.add('is-in'); });
    return { close: close, sheet: sheet };
  };

  /* Confirmation dialog (delete etc.) — resolves true/false. */
  AK.confirm = function (opts) {
    return new Promise(function (resolve) {
      var overlay = document.createElement('div');
      overlay.className = 'modal-overlay';
      overlay.innerHTML =
        '<div class="modal" role="alertdialog" aria-modal="true">' +
        '<h2 class="modal__title">' + AK.esc(opts.title) + '</h2>' +
        '<p class="modal__desc">' + AK.esc(opts.description || '') + '</p>' +
        '<div class="modal__foot">' +
        '<button type="button" class="btn btn--outline modal__cancel">Cancel</button>' +
        '<button type="button" class="btn ' + (opts.destructive === false ? 'btn--primary' : 'btn--destructive') + ' modal__ok">' +
        AK.esc(opts.confirmLabel || 'Delete') + '</button>' +
        '</div></div>';
      document.body.appendChild(overlay);
      document.body.style.overflow = 'hidden';
      function done(v) {
        overlay.remove();
        document.body.style.overflow = '';
        resolve(v);
      }
      overlay.addEventListener('click', function (e) {
        if (e.target === overlay) done(false);
      });
      overlay.querySelector('.modal__cancel').addEventListener('click', function () { done(false); });
      overlay.querySelector('.modal__ok').addEventListener('click', function () { done(true); });
      requestAnimationFrame(function () { overlay.classList.add('is-in'); });
    });
  };

  /* ------------------------------------------------------------------ */
  /* Header / mobile menu / footer                                       */
  /* ------------------------------------------------------------------ */
  var PAGES = {
    home: 'index.html',
    shop: 'shop.html',
    wishlist: 'wishlist.html',
    cart: 'cart.html',
  };

  function logoHtml() {
    return (
      '<a href="index.html" class="logo" aria-label="Antique Khan — home">' +
      '<span class="logo__text">Antique <span class="logo__accent">Khan</span></span>' +
      '<span class="logo__gem" aria-hidden="true"></span></a>'
    );
  }

  AK.renderHeader = function (activeKey) {
    var host = document.getElementById('site-header');
    if (!host) return;
    var links = [
      { key: 'home', label: 'Home' },
      { key: 'shop', label: 'Shop' },
      { key: 'wishlist', label: 'Wishlist' },
      { key: 'cart', label: 'Cart' },
    ];
    var navHtml = links.map(function (l) {
      return (
        '<a href="' + PAGES[l.key] + '"' + (activeKey === l.key ? ' aria-current="page"' : '') +
        ' class="nav__link' + (activeKey === l.key ? ' is-active' : '') + '">' + l.label + '</a>'
      );
    }).join('');

    host.innerHTML =
      '<header class="site-header">' +
      '<div class="container site-header__row">' +
      '<div class="site-header__left">' +
      '<button type="button" class="btn btn--ghost btn--icon burger" aria-label="Open menu" aria-expanded="false" aria-controls="mobile-menu">' + AK.icon('menu', 'ic--20') + '</button>' +
      logoHtml() +
      '<nav aria-label="Main navigation" class="nav">' + navHtml +
      '<button type="button" class="nav__link nav__contact">Contact</button>' +
      '</nav></div>' +
      '<div class="site-header__right">' +
      '<a href="wishlist.html" aria-label="Wishlist" class="iconlink" data-badge="wishlist">' + AK.icon('heart', 'ic--20') + '<span class="iconlink__badge" hidden></span></a>' +
      '<a href="cart.html" aria-label="Cart" class="iconlink" data-badge="cart">' + AK.icon('shopping-bag', 'ic--20') + '<span class="iconlink__badge" hidden></span></a>' +
      '</div></div></header>' +
      '<div id="mobile-menu"></div>';

    var menuHost = host.querySelector('#mobile-menu');
    host.querySelector('.burger').addEventListener('click', function () {
      AK.openMobileMenu(activeKey, menuHost);
    });
    host.querySelector('.nav__contact').addEventListener('click', function () {
      AK.goToContact(activeKey);
    });
    AK.refreshBadges();
  };

  AK.goToContact = function (activeKey) {
    if (activeKey === 'home') {
      var el = document.getElementById('contact');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      window.location.href = 'index.html#contact';
    }
  };

  AK.openMobileMenu = function (activeKey, host) {
    host = host || document.getElementById('mobile-menu');
    if (!host) return;
    var rows = [
      { key: 'home', label: 'Home', icon: 'house' },
      { key: 'shop', label: 'Shop', icon: 'store' },
      { key: 'wishlist', label: 'Wishlist', icon: 'heart' },
      { key: 'cart', label: 'Cart', icon: 'shopping-bag' },
    ];
    var B = C.BRAND;
    AK.openSheet({
      side: 'right',
      title: '',
      build: function (body, close) {
        body.parentElement.classList.add('sheet--menu');
        body.innerHTML =
          '<div class="menu__brandrow">' + logoHtml() + '</div>' +
          '<nav aria-label="Mobile navigation" class="menu__nav"><ul>' +
          rows.map(function (r) {
            return (
              '<li><button type="button" data-nav="' + r.key + '" class="menu__row' + (activeKey === r.key ? ' is-active' : '') + '">' +
              AK.icon(r.icon, 'ic--18 ic--accent') + r.label + '</button></li>'
            );
          }).join('') +
          '<li><button type="button" data-nav="contact" class="menu__row">' +
          AK.icon('phone', 'ic--18 ic--accent') + 'Contact</button></li>' +
          '</ul></nav>' +
          '<div class="menu__foot">' +
          '<a class="btn btn--outline btn--h11 btn--block" target="_blank" rel="noopener noreferrer" href="' + AK.waLink('Hello Antique Khan! I have a question.') + '">' +
          AK.icon('message-circle', 'ic--16 ic--whatsapp') + 'Chat on WhatsApp</a>' +
          '<p class="menu__addr">' + AK.icon('map-pin', 'ic--14 ic--accent') + '<span>' + AK.esc(B.address) + (B.hours ? '<br>' + AK.esc(B.hours) : '') + '</span></p>' +
          '<a class="menu__addr menu__addr--link" href="' + AK.esc(B.instagram) + '" target="_blank" rel="noopener noreferrer">' + AK.icon('instagram', 'ic--14 ic--accent') + '<span>@Antiquekhan.EG</span></a>' +
          '<a class="menu__addr menu__addr--link" href="' + AK.esc(B.facebook) + '" target="_blank" rel="noopener noreferrer">' + AK.icon('facebook', 'ic--14 ic--accent') + '<span>AntiqueKhan.Egypt</span></a>' +
          '</div>';
        body.querySelectorAll('[data-nav]').forEach(function (btn) {
          btn.addEventListener('click', function () {
            var k = btn.getAttribute('data-nav');
            close();
            if (k === 'contact') { setTimeout(function () { AK.goToContact(activeKey); }, 80); return; }
            var target = PAGES[k];
            if (k === activeKey) return;
            window.location.href = target;
          });
        });
      },
    });
  };

  AK.refreshBadges = function () {
    var map = { wishlist: wishlist.items.length, cart: cart.count() };
    document.querySelectorAll('[data-badge]').forEach(function (el) {
      var kind = el.getAttribute('data-badge');
      var badge = el.querySelector('.iconlink__badge');
      if (!badge) return;
      var n = map[kind] || 0;
      badge.textContent = n;
      badge.hidden = n === 0;
      var link = el;
      link.setAttribute('aria-label', (kind === 'cart' ? 'Cart' : 'Wishlist') + (n > 0 ? ', ' + n + ' items' : ''));
    });
  };

  AK.renderFooter = function () {
    var host = document.getElementById('site-footer');
    if (!host) return;
    var B = C.BRAND;
    var year = new Date().getFullYear();
    host.innerHTML =
      '<footer class="site-footer">' +
      '<div class="container site-footer__gridwrap">' +
      '<div class="site-footer__grid">' +
      '<div><p class="footerlogo">Antique <span class="logo__accent">Khan</span><span class="logo__gem" aria-hidden="true"></span></p>' +
      '<p class="site-footer__tag">' + AK.esc(B.tagline) + '</p>' +
      '<div class="footer-social">' +
      '<a href="' + AK.waLink('Hello Antique Khan!') + '" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" class="footerinsta">' + AK.icon('message-circle', 'ic--20') + '</a>' +
      '<a href="' + AK.esc(B.instagram) + '" target="_blank" rel="noopener noreferrer" aria-label="Instagram" class="footerinsta">' + AK.icon('instagram', 'ic--20') + '</a>' +
      '<a href="' + AK.esc(B.facebook) + '" target="_blank" rel="noopener noreferrer" aria-label="Facebook" class="footerinsta">' + AK.icon('facebook', 'ic--20') + '</a>' +
      '</div></div>' +
      '<nav aria-label="Footer navigation"><h3 class="site-footer__h">Explore</h3><ul>' +
      ['home:Home', 'shop:Shop', 'wishlist:Wishlist', 'cart:Cart'].map(function (pair) {
        var p = pair.split(':');
        return '<li><a class="site-footer__link" href="' + PAGES[p[0]] + '">' + p[1] + '</a></li>';
      }).join('') +
      '</ul></nav>' +
      '<div><h3 class="site-footer__h">Contact</h3><ul class="site-footer__contact">' +
      '<li>' + AK.icon('map-pin', 'ic--16 ic--accent') + '<span>' + AK.esc(B.address) + '</span></li>' +
      '<li>' + AK.icon('phone', 'ic--16 ic--accent') + '<a href="tel:' + AK.esc(B.phoneHref) + '">' + AK.esc(B.phoneDisplay) + '</a></li>' +
      '<li>' + AK.icon('message-circle', 'ic--16 ic--accent') + '<a href="' + AK.waLink('Hello Antique Khan!') + '" target="_blank" rel="noopener noreferrer">WhatsApp us</a></li>' +
      '<li>' + AK.icon('mail', 'ic--16 ic--accent') + '<a href="mailto:' + AK.esc(B.email) + '">' + AK.esc(B.email) + '</a></li>' +
      (B.hours ? '<li>' + AK.icon('clock', 'ic--16 ic--accent') + '<span>' + AK.esc(B.hours) + '</span></li>' : '') +
      '</ul></div>' +
      '</div></div>' +
      '<div class="site-footer__bar"><div class="container site-footer__barrow">' +
      '<p>© ' + year + ' Antique Khan — From the Past, For the Future</p>' +
      '<a class="site-footer__admin" href="admin.html">Store Admin</a>' +
      '</div></div></footer>';
  };

  /* ------------------------------------------------------------------ */
  /* Data access (Supabase)                                              */
  /* ------------------------------------------------------------------ */
  function sanitizeQ(q) {
    return String(q).replace(/[*(),]/g, ' ').trim();
  }

  /**
   * fetchProducts({status, category, featured, q, ids, sort, minPrice, maxPrice})
   * Mirrors the original API semantics. Returns Promise<{products}|{error}>.
   */
  AK.fetchProducts = function (params) {
    params = params || {};
    if (!AK.isConfigured()) return Promise.resolve({ error: new Error('Supabase is not configured') });
    var q = AK.db.from('products').select('*');
    var status = params.status || 'active';
    if (params.ids && params.ids.length) {
      q = q.in('id', params.ids); // id lookup bypasses the status filter (cart revalidation)
    } else if (status !== 'all') {
      q = q.eq('status', status);
    }
    if (params.category) q = q.eq('category', params.category);
    if (params.featured) q = q.eq('featured', true);
    if (params.q) {
      var pat = '*' + sanitizeQ(params.q) + '*';
      q = q.or('title.ilike.' + pat + ',description.ilike.' + pat);
    }
    if (params.minPrice !== undefined && params.minPrice !== null && params.minPrice !== '') q = q.gte('price', Number(params.minPrice));
    if (params.maxPrice !== undefined && params.maxPrice !== null && params.maxPrice !== '') q = q.lte('price', Number(params.maxPrice));
    if (params.sort === 'price-asc') q = q.order('price', { ascending: true });
    else if (params.sort === 'price-desc') q = q.order('price', { ascending: false });
    else q = q.order('created_at', { ascending: false });

    return q.then(function (res) {
      if (res.error) return { error: res.error };
      return { products: (res.data || []).map(AK.mapProduct) };
    });
  };

  AK.fetchProductById = function (id) {
    if (!AK.isConfigured()) return Promise.resolve({ error: new Error('Supabase is not configured') });
    if (!id) return Promise.resolve({ product: null });
    return AK.db
      .from('products')
      .select('*')
      .eq('id', id)
      .maybeSingle()
      .then(function (res) {
        if (res.error) return { error: res.error };
        if (!res.data) return { product: null };
        var p = AK.mapProduct(res.data);
        if (p.status === 'inactive') {
          /* hidden pieces are invisible to the public (RLS also blocks them) */
          return AK.db.auth.getSession().then(function (s) {
            var admin = !!(s && s.data && s.data.session);
            return admin ? { product: p } : { product: null };
          });
        }
        return { product: p };
      });
  };

  /* Public checkout: generates the AK-XXXXX code and inserts the order.
     Orders are INSERT-only for visitors (RLS); the code is created here. */
  AK.createOrder = function (input) {
    if (!AK.isConfigured()) return Promise.reject(new Error('Supabase is not configured'));
    function attempt(n) {
      var bytes = new Uint8Array(3);
      (window.crypto || { getRandomValues: function () { } }).getRandomValues
        ? crypto.getRandomValues(bytes)
        : (bytes = [Math.random() * 255, Math.random() * 255, Math.random() * 255].map(Math.floor));
      var code = 'AK-' + Array.from(bytes, function (b) { return b.toString(16).padStart(2, '0').toUpperCase(); }).join('').slice(0, 5);
      var row = {
        code: code,
        customer_name: input.customerName,
        phone: input.phone,
        phone2: input.phone2 || null,
        governorate: input.governorate,
        city_area: input.cityArea,
        address: input.address,
        notes: input.notes || null,
        payment_method: input.paymentMethod,
        items: input.items,
        subtotal: input.subtotal,
        delivery_fee: input.deliveryFee === null || input.deliveryFee === undefined ? null : input.deliveryFee,
        total: input.total,
        status: 'new',
      };
      return AK.db.from('orders').insert(row).then(function (res) {
        if (res.error) {
          if (res.error.code === '23505' && n < 5) return attempt(n + 1);
          throw res.error;
        }
        return {
          id: null, code: code, customerName: input.customerName, phone: input.phone,
          phone2: input.phone2 || null,
          governorate: input.governorate, cityArea: input.cityArea, address: input.address,
          notes: input.notes || null, paymentMethod: input.paymentMethod,
          items: input.items, subtotal: input.subtotal,
          deliveryFee: input.deliveryFee === null || input.deliveryFee === undefined ? null : input.deliveryFee,
          total: input.total, status: 'new',
          createdAt: new Date().toISOString(),
        };
      });
    }
    return attempt(0);
  };

  /* ------------------------------------------------------------------ */
  /* Shop settings (InstaPay details, delivery fee — Admin → Settings)   */
  /*   Public read; only the admin can write (RLS). Cached briefly.      */
  /* ------------------------------------------------------------------ */
  var settingsCache = { at: 0, value: null };

  AK.fetchSettings = function (force) {
    if (!AK.isConfigured()) return Promise.resolve({});
    if (!force && settingsCache.value && Date.now() - settingsCache.at < 120000) {
      return Promise.resolve(settingsCache.value);
    }
    return AK.db.from('settings').select('key,value').then(function (res) {
      if (res.error || !res.data) return settingsCache.value || {};
      var map = {};
      (res.data || []).forEach(function (r) { map[r.key] = r.value; });
      settingsCache = { at: Date.now(), value: map };
      return map;
    }).catch(function () { return settingsCache.value || {}; });
  };

  /* Resolved checkout settings: InstaPay details (settings table first,
     then config.js) and the delivery fee (null = not configured). */
  AK.resolveShopSettings = function (map) {
    map = map || {};
    var C = window.AK_CONFIG;
    var feeRaw = map.delivery_fee;
    var fee = feeRaw === undefined || feeRaw === null || String(feeRaw).trim() === '' ? null : Number(feeRaw);
    if (fee !== null && (!isFinite(fee) || fee < 0)) fee = null;
    return {
      instapayHandle: map.instapay_handle || C.INSTAPAY.handle || '',
      instapayNumber: map.instapay_number || C.INSTAPAY.number || '',
      instapayName: map.instapay_name || C.INSTAPAY.name || '',
      instapayConfigured: !!(map.instapay_number || map.instapay_handle || C.INSTAPAY.number || C.INSTAPAY.handle),
      deliveryFee: fee,
      deliveryNote: map.delivery_note || C.DELIVERY_NOTE_DEFAULT,
    };
  };

  /* ------------------------------------------------------------------ */
  /* Featured Pieces — the admin-curated homepage showcase.              */
  /*   A pure SELECTOR over the shop's existing products: each entry     */
  /*   stores only the chosen product's id + display order + a           */
  /*   published/hidden flag. The card always uses the product's OWN     */
  /*   image, title and caption — nothing is uploaded or duplicated.     */
  /*   Available AND Sold products are both selectable; selling a        */
  /*   featured product keeps it in the showcase until the admin hides   */
  /*   or removes the entry. Hiding/removing an entry never touches the  */
  /*   product itself (deleting the product removes its entry).          */
  /* ------------------------------------------------------------------ */
  AK.mapFeaturedPiece = function (row) {
    return {
      id: row.id,
      productId: row.product_id || null,
      product: row.product ? AK.mapProduct(row.product) : null,
      displayOrder: row.display_order === null || row.display_order === undefined ? 0 : Number(row.display_order),
      active: row.active !== false,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  };

  /**
   * fetchFeaturedPieces({all}) → Promise<{pieces}|{error}>
   * Default (homepage): ONLY published entries, saved display order,
   * each with its product embedded.
   * opts.all (admin): every entry including hidden ones.
   */
  AK.fetchFeaturedPieces = function (opts) {
    if (!AK.isConfigured()) return Promise.resolve({ error: new Error('Supabase is not configured') });
    var q = AK.db
      .from('featured_pieces')
      .select('*, product:products(*)')
      .order('display_order', { ascending: true })
      .order('created_at', { ascending: true });
    if (!(opts && opts.all)) q = q.eq('active', true);
    return q.then(function (res) {
      if (res.error) return { error: res.error };
      return { pieces: (res.data || []).map(AK.mapFeaturedPiece) };
    });
  };

  /* The homepage Featured Pieces card — the EXACT same product card used
     by the "Newly Added" section, so the whole homepage is consistent and
     the admin preview shows precisely what visitors get. Sold pieces show
     their Sold badge and a disabled button, exactly like in Past Gems.
     Shared with the admin manager's previews. */
  AK.featuredCard = function (f, priority) {
    var p = f.product;
    if (!p) return '';
    return AK.productCard(p, priority);
  };

  /* Horizontal carousel enhancement for a scroll track inside a
     .hscroll-wrap: wires the prev/next arrow buttons (desktop), converts
     the vertical mouse wheel to horizontal scrolling over the track (the
     page keeps scrolling normally at either edge), and keeps the arrow
     states in sync on scroll/resize. Touch swiping and trackpad scrolling
     stay fully native — CSS scroll-snap does the polish. */
  AK.initHScroll = function (track) {
    if (!track || track.dataset.hscrollInit) return;
    track.dataset.hscrollInit = '1';
    var wrap = track.closest('.hscroll-wrap');
    var prev = wrap ? wrap.querySelector('.hscroll-arrow--prev') : null;
    var next = wrap ? wrap.querySelector('.hscroll-arrow--next') : null;
    var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var behavior = reduceMotion ? 'auto' : 'smooth';
    var EDGE = 4; /* px tolerance for rounding */

    function maxScroll() { return track.scrollWidth - track.clientWidth; }
    function update() {
      var max = maxScroll();
      var hasOverflow = max > EDGE;
      if (prev) {
        prev.classList.toggle('is-hidden', !hasOverflow);
        prev.disabled = !hasOverflow || track.scrollLeft <= EDGE;
      }
      if (next) {
        next.classList.toggle('is-hidden', !hasOverflow);
        next.disabled = !hasOverflow || track.scrollLeft >= max - EDGE;
      }
    }
    function step() { return Math.max(track.clientWidth * 0.85, 240); }
    if (prev) prev.addEventListener('click', function () { track.scrollBy({ left: -step(), behavior: behavior }); });
    if (next) next.addEventListener('click', function () { track.scrollBy({ left: step(), behavior: behavior }); });
    track.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    /* mouse wheel over the track scrolls it horizontally; the page keeps
       scrolling normally at either edge. Scroll-snap is suspended while
       the wheel is active (each small step would otherwise be pulled back
       to the nearest card) and restored once the wheel idles, letting the
       row settle smoothly onto the closest card. */
    var snapTimer = null;
    track.addEventListener('wheel', function (e) {
      var max = maxScroll();
      if (max <= EDGE) return;
      /* sideways deltas (trackpad) scroll natively */
      if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return;
      var d = e.deltaY;
      if ((d < 0 && track.scrollLeft <= EDGE) || (d > 0 && track.scrollLeft >= max - EDGE)) return;
      e.preventDefault();
      track.style.scrollSnapType = 'none';
      track.scrollLeft += d;
      if (snapTimer) clearTimeout(snapTimer);
      snapTimer = setTimeout(function () {
        snapTimer = null;
        track.style.scrollSnapType = '';
      }, 180);
    }, { passive: false });
    update();
  };

  /* ------------------------------------------------------------------ */
  /* Auth (admin)                                                        */
  /* ------------------------------------------------------------------ */
  AK.getSession = function () {
    if (!AK.isConfigured()) return Promise.resolve(null);
    return AK.db.auth.getSession().then(function (s) { return (s && s.data && s.data.session) || null; });
  };

  AK.signIn = function (email, password) {
    return AK.db.auth.signInWithPassword({ email: email, password: password }).then(function (res) {
      if (res.error) throw res.error;
      return res.data;
    });
  };

  AK.signOut = function () {
    return AK.db.auth.signOut();
  };

  /* ------------------------------------------------------------------ */
  /* Product card (shared by home / shop / past gems / product page)     */
  /* ------------------------------------------------------------------ */
  var productIndex = {};
  AK.remember = function (p) { productIndex[p.id] = p; };
  AK.getProduct = function (id) { return productIndex[id] || null; };

  AK.productCard = function (p, priority) {
    AK.remember(p);
    var url = AK.mainImage(p);
    var isSold = p.status === 'sold';
    var wished = wishlist.has(p.id);
    return (
      '<article class="pcard" data-pid="' + AK.esc(p.id) + '">' +
      '<a class="pcard__media" href="product.html?id=' + encodeURIComponent(p.id) + '" aria-label="' + AK.esc(p.title) + '">' +
      (url
        ? '<img src="' + AK.esc(url) + '" alt="' + AK.esc(p.title) + '" loading="' + (priority ? 'eager' : 'lazy') + '" decoding="async" draggable="false" onerror="AK.imgFail(this)"' + (isSold ? ' class="is-sold"' : '') + ' />'
        : '') +
      (p.status === 'sold' ? '<div class="pcard__soldshade" aria-hidden="true"></div>' : '') +
      '<div class="pcard__status">' + AK.statusBadge(p.status) + '</div>' +
      '</a>' +
      '<button type="button" class="pcard__heart' + (wished ? ' is-active' : '') + '" aria-label="Toggle wishlist" aria-pressed="' + wished + '">' + AK.icon('heart') + '</button>' +
      '<div class="pcard__body">' +
      '<p class="pcard__cat">' + AK.esc(p.category) + '</p>' +
      '<h3 class="pcard__title"><a href="product.html?id=' + encodeURIComponent(p.id) + '">' + AK.esc(p.title) + '</a></h3>' +
      '<p class="pcard__price">' + AK.fmtEGP(p.price) + '</p>' +
      (isSold
        ? '<button type="button" class="btn btn--secondary pcard__btn" disabled><span class="spin-btn">' + AK.icon('shopping-bag') + 'Sold</span></button>'
        : '<button type="button" class="btn btn--primary pcard__btn pcard__add"><span class="spin-btn">' + AK.icon('shopping-bag') + 'Add to Cart</span></button>') +
      '</div></article>'
    );
  };

  AK.statusBadge = function (status) {
    var labels = C.STATUS_LABELS;
    var cls = { active: 'status-badge--active', sold: 'status-badge--sold', inactive: 'status-badge--inactive' }[status] || 'status-badge--inactive';
    return '<span class="badge badge--outline ' + cls + '"><span class="dot" aria-hidden="true"></span>' + AK.esc(labels[status] || status) + '</span>';
  };

  AK.emptyState = function (iconName, title, desc, actionsHtml) {
    return (
      '<div class="empty">' +
      '<div class="empty__ic">' + AK.icon(iconName) + '</div>' +
      '<h3 class="empty__title">' + AK.esc(title) + '</h3>' +
      (desc ? '<p class="empty__desc">' + AK.esc(desc) + '</p>' : '') +
      (actionsHtml || '') +
      '</div>'
    );
  };

  AK.gridSkeleton = function (modifier, count) {
    var out = '<div class="grid-skel ' + (modifier || '') + '">';
    for (var i = 0; i < (count || 4); i++) {
      out += '<div class="grid-skel__card"><div class="skel grid-skel__img"></div><div class="skel grid-skel__l1"></div><div class="skel grid-skel__l2"></div></div>';
    }
    return out + '</div>';
  };

  /* One delegated listener handles every product card on every page. */
  document.addEventListener('click', function (e) {
    var heart = e.target.closest('.pcard__heart');
    if (heart) {
      e.preventDefault();
      e.stopPropagation();
      var card = heart.closest('.pcard');
      var p = AK.getProduct(card && card.getAttribute('data-pid'));
      if (!p) return;
      var added = wishlist.toggle(p);
      document.querySelectorAll('.pcard[data-pid="' + card.getAttribute('data-pid') + '"] .pcard__heart').forEach(function (h) {
        h.classList.toggle('is-active', added);
        h.setAttribute('aria-pressed', String(added));
      });
      if (added) AK.toast.success('Saved to wishlist');
      else AK.toast('Removed from wishlist');
      return;
    }
    var addBtn = e.target.closest('.pcard__add');
    if (addBtn) {
      var card2 = addBtn.closest('.pcard');
      var p2 = AK.getProduct(card2 && card2.getAttribute('data-pid'));
      if (!p2) return;
      cart.add(p2, 1);
      AK.toast.success('Added to cart — ' + p2.title);
    }
  });

  /* ------------------------------------------------------------------ */
  /* Not-configured banner (shown until the anon key is pasted)          */
  /* ------------------------------------------------------------------ */
  AK.configNotice = function () {
    if (AK.isConfigured()) return null;
    var el = document.createElement('div');
    el.className = 'config-banner';
    el.setAttribute('role', 'alert');
    el.innerHTML =
      '<b>Supabase is not connected yet.</b> Open <code>config.js</code> and paste your ' +
      'anon/publishable key from Supabase → Project Settings → API, then reload this page. ' +
      'See README.md for the full setup.';
    return el;
  };

  AK.mountChrome = function (activeKey) {
    AK.renderHeader(activeKey);
    AK.renderFooter();
    var notice = AK.configNotice();
    if (notice) {
      var main = document.getElementById('main');
      if (main) main.insertBefore(notice, main.firstChild);
    }
  };
})();
