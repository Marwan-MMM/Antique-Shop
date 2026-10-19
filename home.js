/* ============================================================================
   Antique Khan — home.js (index.html)
============================================================================ */
(function () {
  'use strict';

  var B = window.AK_CONFIG.BRAND;
  var root = document.getElementById('home-root');

  AK.mountChrome('home');

  root.innerHTML =
    /* Hero — official Antique Khan slogan */
    '<section aria-labelledby="hero-title">' +
    '<div class="hero-img-wrap">' +
    '<img id="hero-img" alt="Inside the Antique Khan gallery" decoding="async" draggable="false" />' +
    '<div class="hero-shade" aria-hidden="true"></div>' +
    '</div>' +
    '<div class="container hero-card-wrap">' +
    '<div class="hero-card">' +
    '<p class="eyebrow">Antique Khan · Antique Shop &amp; Gallery</p>' +
    '<h1 id="hero-title" class="hero-title">' + AK.esc(B.sloganLines[0]) + '<br>' + AK.esc(B.sloganLines[1]) + '</h1>' +
    '<p class="hero-sub">' + AK.esc(B.sloganNote) + '</p>' +
    '<div class="hero-actions">' +
    '<a href="shop.html" class="btn btn--primary btn--h12 btn--px8 btn--15">Shop the Collection ' + AK.icon('arrow-right') + '</a>' +
    '<a target="_blank" rel="noreferrer" class="btn btn--outline btn--h12 btn--px8 btn--15" href="' + AK.waLink('Hello Antique Khan!') + '">' + AK.icon('message-circle') + 'WhatsApp Us</a>' +
    '</div></div></div></section>' +

    /* Categories */
    '<section aria-label="Browse by category"><div class="container section">' +
    '<div class="section-head"><div><h2 class="section-head__title">Browse the Collection</h2></div>' +
    '<a href="shop.html" class="viewall">View all →</a></div>' +
    '<div class="chips-row no-scrollbar" id="cat-chips"></div>' +
    '</div></section>' +

    /* Featured */
    '<section aria-label="Featured antiques"><div class="container section">' +
    '<div class="section-head"><div><p class="eyebrow">Curated</p><h2 class="section-head__title">Featured Antiques</h2></div>' +
    '<a href="shop.html" class="viewall">View all →</a></div>' +
    '<div id="featured"></div>' +
    '</div></section>' +

    /* Newly added */
    '<section aria-label="Newly added antiques"><div class="container section">' +
    '<div class="section-head"><div><h2 class="section-head__title">Newly Added</h2></div>' +
    '<a href="shop.html" class="viewall">View all →</a></div>' +
    '<div id="newly"></div>' +
    '</div></section>' +

    /* Value props */
    '<section aria-label="Why shop with us"><div class="container" style="padding-top:2rem;padding-bottom:2rem;">' +
    '<div class="value-grid" id="values"></div>' +
    '</div></section>' +

    /* Contact */
    '<section id="contact" aria-label="Contact Antique Khan" style="scroll-margin-top:5rem;">' +
    '<div class="container" style="padding-top:2.5rem;padding-bottom:3.5rem;">' +
    '<div class="contact-card" id="contact-card"></div>' +
    '</div></section>';

  /* static pieces ---------------------------------------------------------- */
  document.getElementById('cat-chips').innerHTML =
    '<a class="chip" href="shop.html">All Antiques</a>' +
    window.AK_CONFIG.CATEGORIES.map(function (cat) {
      return '<a class="chip" href="shop.html?cat=' + encodeURIComponent(cat) + '">' + AK.esc(cat) + '</a>';
    }).join('');

  var VALUE_PROPS = [
    { icon: 'shield-check', title: 'Authentic & Curated', sub: 'Every piece inspected by our experts' },
    { icon: 'truck', title: 'Delivery Across Egypt', sub: 'Careful packaging to all 27 governorates' },
    { icon: 'banknote', title: 'Cash on Delivery', sub: 'COD or InstaPay — pay your way' },
  ];
  document.getElementById('values').innerHTML = VALUE_PROPS.map(function (v) {
    return (
      '<div class="value-item">' +
      '<div class="value-item__ic">' + AK.icon(v.icon, 'ic--20') + '</div>' +
      '<div class="min-w-0"><p class="value-item__t">' + v.title + '</p><p class="value-item__s">' + v.sub + '</p></div>' +
      '</div>'
    );
  }).join('');

  document.getElementById('contact-card').innerHTML =
    '<div>' +
    '<div class="section-head" style="margin-bottom:0;"><div><p class="eyebrow">Visit Us</p><h2 class="section-head__title">Contact Antique Khan</h2></div></div>' +
    '<ul class="contact-list">' +
    '<li>' + AK.icon('map-pin', 'ic--16 ic--accent') + '<span style="color:color-mix(in srgb, var(--foreground) 90%, transparent);">' + AK.esc(B.address) + '</span></li>' +
    '<li>' + AK.icon('phone', 'ic--16 ic--accent') + '<a href="tel:' + AK.esc(B.phoneHref) + '">' + AK.esc(B.phoneDisplay) + '</a></li>' +
    '<li>' + AK.icon('message-circle', 'ic--16 ic--accent') + '<a target="_blank" rel="noopener noreferrer" href="' + AK.waLink('Hello Antique Khan!') + '">WhatsApp: wa.me/201200057054</a></li>' +
    '<li>' + AK.icon('mail', 'ic--16 ic--accent') + '<a href="mailto:' + AK.esc(B.email) + '" style="overflow-wrap:break-word;">' + AK.esc(B.email) + '</a></li>' +
    (B.hours ? '<li>' + AK.icon('clock', 'ic--16 ic--accent') + '<span style="color:color-mix(in srgb, var(--foreground) 90%, transparent);">' + AK.esc(B.hours) + '</span></li>' : '') +
    '</ul></div>' +
    '<div class="contact-wa">' +
    '<p class="contact-wa__t">Questions about a piece?</p>' +
    '<p class="contact-wa__s">Message us on WhatsApp — we reply quickly.</p>' +
    '<a class="btn-wa" target="_blank" rel="noreferrer" href="' + AK.waLink('Hello Antique Khan! I have a question about a piece.') + '">' + AK.icon('message-circle') + 'Chat on WhatsApp</a>' +
    '<a class="btn btn--outline btn--h12 btn--block btn--15" href="tel:' + AK.esc(B.phoneHref) + '">Call us</a>' +
    '<a class="btn btn--outline btn--h12 btn--block btn--15" target="_blank" rel="noopener noreferrer" href="' + AK.esc(B.instagram) + '">' + AK.icon('instagram') + 'Follow on Instagram</a>' +
    '<a class="btn btn--outline btn--h12 btn--block btn--15" target="_blank" rel="noopener noreferrer" href="' + AK.esc(B.facebook) + '">' + AK.icon('facebook') + 'Find us on Facebook</a>' +
    '</div>' +
    '<div class="about-block"><div class="section-head" style="margin-bottom:0;"><div><p class="eyebrow">Our Story</p><h2 class="section-head__title">About Antique Khan</h2></div></div>' +
    '<p class="about-text">' + AK.esc(B.about) + '</p></div>';

  /* hero image: from the Storage bucket (seed/hero.jpg) with graceful fallback */
  var hero = document.getElementById('hero-img');
  hero.loading = 'eager';
  hero.fetchPriority = 'high';
  hero.src = AK.storageUrl('seed/hero.jpg');
  hero.onerror = function () {
    hero.onerror = null;
    hero.style.display = 'none';
    hero.parentElement.style.background = 'var(--secondary)';
  };

  /* data ------------------------------------------------------------------- */
  var featuredEl = document.getElementById('featured');
  var newlyEl = document.getElementById('newly');
  featuredEl.innerHTML = AK.gridSkeleton('grid-skel--md4', 4);
  newlyEl.innerHTML = AK.gridSkeleton('grid-skel--md4', 4);

  function retryButtons() {
    return '<div style="display:flex;justify-content:center;"><button type="button" class="btn btn--outline btn--h11" data-retry="1">Retry</button></div>';
  }

  function renderFeatured(items) {
    featuredEl.innerHTML =
      '<div class="grid-products grid-products--md4">' +
      items.slice(0, 4).map(function (p, i) { return AK.productCard(p, i < 2); }).join('') +
      '</div>';
  }

  function renderNewly(items) {
    newlyEl.innerHTML =
      '<div class="grid-products grid-products--md4">' +
      items.slice(0, 4).map(function (p, i) { return AK.productCard(p, i < 2); }).join('') +
      '</div>';
  }

  var latest = { featured: [], newest: [] };

  function load() {
    featuredEl.innerHTML = AK.gridSkeleton('grid-skel--md4', 4);
    newlyEl.innerHTML = AK.gridSkeleton('grid-skel--md4', 4);

    var featuredQ = AK.fetchProducts({ status: 'active', featured: true });
    var newestQ = AK.fetchProducts({ status: 'active', sort: 'newest' });

    newestQ.then(function (res) {
      if (res.error) {
        newestQ.err = true;
      } else {
        latest.newest = res.products;
        renderNewly(res.products);
      }
      checkFeatured();
    });

    featuredQ.then(function (res) {
      featuredQ.res = res;
      checkFeatured();
    });

    function checkFeatured() {
      if (!featuredQ.res) return; // newest may finish first; wait for featured too
      var res = featuredQ.res;
      if (res.error) {
        if (newestQ.err) {
          featuredEl.innerHTML = AK.emptyState('shield-check', "Couldn't load the collection", 'Please check your connection and try again.', retryButtons());
          newlyEl.innerHTML = AK.emptyState('shield-check', "Couldn't load the collection", 'Please check your connection and try again.', retryButtons());
        } else if (latest.newest.length > 0) {
          renderFeatured(latest.newest); // newest-fallback (same as the original)
        }
        return;
      }
      var items = res.products.length > 0 ? res.products : latest.newest;
      if (items.length === 0) {
        featuredEl.innerHTML = AK.emptyState('package-open', 'No pieces yet', 'Our curators are preparing the next drop — check back soon.');
      } else {
        renderFeatured(items);
      }
    }
  }

  root.addEventListener('click', function (e) {
    if (e.target.closest('[data-retry]')) load();
  });

  if (AK.isConfigured()) load();
  else { featuredEl.innerHTML = ''; newlyEl.innerHTML = ''; }
})();
