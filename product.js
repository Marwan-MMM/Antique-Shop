/* ============================================================================
   Antique Khan — product.js (product.html?id=…)
============================================================================ */
(function () {
  'use strict';

  var root = document.getElementById('product-root');

  AK.mountChrome(null);

  var productId = new URLSearchParams(window.location.search).get('id') || '';

  root.innerHTML =
    '<div class="container" style="padding-top:1rem;padding-bottom:7rem;">' +
    '<div id="detail"></div>' +
    '</div>' +
    '<div id="buybar-host"></div>';

  var el = document.getElementById('detail');

  function skeleton() {
    el.innerHTML =
      '<div class="detail-skel">' +
      '<div class="skel" style="aspect-ratio:1/1;width:100%;border-radius:0.75rem;"></div>' +
      '<div class="detail-skel__col">' +
      '<div class="skel" style="height:0.75rem;width:7rem;"></div>' +
      '<div class="skel" style="height:2rem;width:75%;"></div>' +
      '<div class="skel" style="height:1.5rem;width:9rem;"></div>' +
      '<div class="skel" style="height:1rem;width:66%;"></div>' +
      '<div class="skel" style="height:6rem;width:100%;"></div>' +
      '<div class="skel" style="height:3rem;width:14rem;"></div>' +
      '</div></div>';
  }

  function notFound() {
    el.innerHTML = AK.emptyState('search-x', 'Piece not found', 'It may have been sold or removed.',
      '<div style="display:flex;justify-content:center;"><a class="btn btn--primary btn--h11" href="shop.html">Back to Shop</a></div>');
  }

  if (!AK.isConfigured()) { el.innerHTML = ''; return; }
  skeleton();

  var product = null;
  var idx = 0;

  AK.fetchProductById(productId).then(function (res) {
    if (!res.product) { notFound(); return; }
    product = res.product;
    render();
    loadRelated();
  });

  function galleryHtml(p) {
    var imgs = p.images;
    var count = imgs.length || 1;
    var slides;
    if (imgs.length) {
      slides = imgs.map(function (img, i) {
        return (
          '<div class="gal-slide">' +
          '<img src="' + AK.esc(img.url) + '" alt="' + AK.esc(p.title) + ' — image ' + (i + 1) + ' of ' + count + '" loading="' + (i === 0 ? 'eager' : 'lazy') + '" decoding="async" draggable="false" onerror="AK.imgFail(this)" />' +
          (p.status === 'sold' && i === 0 ? '<div style="position:absolute;top:0.75rem;left:0.75rem;">' + AK.statusBadge('sold') + '</div>' : '') +
          '</div>'
        );
      }).join('');
    } else {
      slides =
        '<div class="gal-slide"><div style="display:flex;height:100%;width:100%;align-items:center;justify-content:center;">' +
        AK.icon('image', 'ic--20 tx-muted') + '</div>' +
        (p.status === 'sold' ? '<div style="position:absolute;top:0.75rem;left:0.75rem;">' + AK.statusBadge('sold') + '</div>' : '') +
        '</div>';
    }
    var arrows = count > 1
      ? '<button type="button" class="gal-arrow gal-arrow--prev" data-go="-1" aria-label="Previous image">' + AK.icon('chevron-left', 'ic--20') + '</button>' +
        '<button type="button" class="gal-arrow gal-arrow--next" data-go="1" aria-label="Next image">' + AK.icon('chevron-right', 'ic--20') + '</button>'
      : '';
    var dots = count > 1
      ? '<div class="gal-dots" id="gal-dots">' +
        Array.from({ length: count }, function (_, i) {
          return '<button type="button" class="gal-dot' + (i === 0 ? ' is-active' : '') + '" data-dot="' + i + '" aria-label="Go to image ' + (i + 1) + '" aria-current="' + (i === 0) + '"></button>';
        }).join('') + '</div>'
      : '';
    var thumbs = count > 1 && imgs.length
      ? '<div class="gal-thumbs no-scrollbar" id="gal-thumbs">' +
        imgs.map(function (img, i) {
          return '<button type="button" class="gal-thumb' + (i === 0 ? ' is-active' : '') + '" data-dot="' + i + '" aria-label="Go to image ' + (i + 1) + '">' +
            '<img src="' + AK.esc(img.url) + '" alt="" loading="lazy" decoding="async" draggable="false" onerror="AK.imgFail(this)" /></button>';
        }).join('') + '</div>'
      : '';
    return (
      '<div class="gal-wrap">' +
      '<div class="gal-track no-scrollbar" id="gal-track" aria-label="' + AK.esc(p.title) + ' — image gallery">' + slides + '</div>' +
      arrows + '</div>' + dots + thumbs
    );
  }

  function render() {
    var p = product;
    var available = p.status === 'active';
    var wished = AK.wishlist.has(p.id);
    var availNote;
    if (p.status === 'active') {
      availNote = '<span class="detail-stock-note">Available now — delivery arranged on WhatsApp</span>';
    } else {
      availNote = '<span class="detail-soldline">This piece has found a new home.</span>';
    }

    el.innerHTML =
      '<button type="button" class="backlink" id="back-btn">' + AK.icon('arrow-left') + 'Back to Shop</button>' +
      '<div class="detail-grid">' +
      '<div>' + galleryHtml(p) + '</div>' +
      '<div class="detail-info">' +
      '<p class="eyebrow eyebrow--tight">' + AK.esc(p.category) + '</p>' +
      '<h1 class="detail-title">' + AK.esc(p.title) + '</h1>' +
      '<div class="detail-price-row"><p class="detail-price">' + AK.fmtEGP(p.price) + '</p>' + AK.statusBadge(p.status) + '</div>' +
      (p.height
        ? '<p class="detail-dims">' + AK.icon('ruler', 'ic--16 ic--accent') + '<span style="overflow-wrap:break-word;">Height: ' + AK.esc(p.height) + '</span></p>'
        : '') +
      (p.length
        ? '<p class="detail-dims">' + AK.icon('ruler', 'ic--16 ic--accent') + '<span style="overflow-wrap:break-word;">Length: ' + AK.esc(p.length) + '</span></p>'
        : '') +
      '<p aria-live="polite">' + availNote + '</p>' +
      (p.description ? '<p class="detail-desc">' + AK.esc(p.description) + '</p>' : '') +
      (p.caption ? '<p class="detail-caption">' + AK.esc(p.caption) + '</p>' : '') +
      '<div class="detail-actions">' +
      '<button type="button" class="btn btn--primary btn--h12" id="d-add" ' + (available ? '' : 'disabled') + '>' + AK.icon('shopping-bag') + 'Add to Cart</button>' +
      '<button type="button" class="btn btn--outline btn--h12 detail-wishbtn' + (wished ? ' is-active' : '') + '" id="d-wish" aria-pressed="' + wished + '" aria-label="' + (wished ? 'Remove from wishlist' : 'Save to wishlist') + '">' + AK.icon('heart') + '</button>' +
      '</div>' +
      '<hr class="sep" />' +
      '<ul class="trust-list">' +
      '<li>' + AK.icon('truck', 'ic--16 ic--accent') + '<span>Insured delivery across Egypt — arranged on WhatsApp</span></li>' +
      '<li>' + AK.icon('banknote', 'ic--16 ic--accent') + '<span>Cash on Delivery or InstaPay</span></li>' +
      '<li>' + AK.icon('shield-check', 'ic--16 ic--accent') + '<span>Authenticity guaranteed by Antique Khan</span></li>' +
      '</ul>' +
      '</div></div>' +
      '<div class="related" id="related-host" style="display:none;">' +
      '<div class="section-head"><div><h2 class="section-head__title">You May Also Like</h2></div></div>' +
      '<div class="grid-products grid-products--md3 grid-products--lg4" id="related-grid"></div>' +
      '</div>';

    document.getElementById('back-btn').addEventListener('click', function () {
      window.location.href = 'shop.html';
    });

    var addBtn = document.getElementById('d-add');
    if (addBtn) {
      addBtn.addEventListener('click', function () {
        AK.cart.add(p, 1);
        AK.toast.success('Added to cart — ' + p.title);
      });
    }
    var wishBtn = document.getElementById('d-wish');
    if (wishBtn) {
      wishBtn.addEventListener('click', function () {
        var added = AK.wishlist.toggle(p);
        wishBtn.classList.toggle('is-active', added);
        wishBtn.setAttribute('aria-pressed', String(added));
        wishBtn.setAttribute('aria-label', added ? 'Remove from wishlist' : 'Save to wishlist');
        if (added) AK.toast.success('Saved to wishlist');
        else AK.toast('Removed from wishlist');
      });
    }

    /* gallery behaviour: scroll-snap sync, dots, thumbs, arrows */
    var track = document.getElementById('gal-track');
    var count = p.images.length || 1;
    if (track && count > 1) {
      var syncIdx = function () {
        var i = Math.min(count - 1, Math.max(0, Math.round(track.scrollLeft / track.clientWidth)));
        if (i !== idx) {
          idx = i;
          paintDots();
        }
      };
      var paintDots = function () {
        document.querySelectorAll('#gal-dots .gal-dot, #gal-thumbs .gal-thumb').forEach(function (d) {
          var on = Number(d.getAttribute('data-dot')) === idx;
          d.classList.toggle('is-active', on);
          d.setAttribute('aria-current', String(on));
        });
        var prev = document.querySelector('.gal-arrow--prev');
        var next = document.querySelector('.gal-arrow--next');
        if (prev) prev.disabled = idx === 0;
        if (next) next.disabled = idx === count - 1;
      };
      track.addEventListener('scroll', syncIdx, { passive: true });
      document.querySelectorAll('[data-dot]').forEach(function (d) {
        d.addEventListener('click', function () {
          goTo(Number(d.getAttribute('data-dot')));
        });
      });
      document.querySelectorAll('[data-go]').forEach(function (b) {
        b.addEventListener('click', function () {
          goTo(idx + Number(b.getAttribute('data-go')));
        });
      });
      var goTo = function (i) {
        var clamped = Math.min(count - 1, Math.max(0, i));
        idx = clamped;
        track.scrollTo({ left: clamped * track.clientWidth, behavior: 'smooth' });
        paintDots();
      };
    }

    /* sticky buy bar */
    document.getElementById('buybar-host').innerHTML =
      '<div class="buybar"><div class="container buybar__row">' +
      '<div style="min-width:0;">' +
      '<p class="buybar__price">' + AK.fmtEGP(p.price) + '</p>' +
      '<p class="buybar__note">' + (available ? 'Available now' : 'No longer available') + '</p>' +
      '</div>' +
      (available
        ? '<button type="button" class="btn btn--primary" id="bar-add"><span class="spin-btn">' + AK.icon('shopping-bag') + 'Add to Cart</span></button>'
        : '<button type="button" class="btn btn--secondary" disabled>Sold</button>') +
      '</div></div>';
    var barAdd = document.getElementById('bar-add');
    if (barAdd) {
      barAdd.addEventListener('click', function () {
        AK.cart.add(p, 1);
        AK.toast.success('Added to cart — ' + p.title);
      });
    }
  }

  function loadRelated() {
    AK.fetchProducts({ status: 'active', category: product.category }).then(function (res) {
      if (res.error) return;
      var related = res.products.filter(function (p) { return p.id !== product.id; }).slice(0, 4);
      if (related.length === 0) return;
      document.getElementById('related-host').style.display = 'block';
      document.getElementById('related-grid').innerHTML = related.map(function (p) { return AK.productCard(p); }).join('');
    });
  }
})();
