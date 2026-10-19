/* ============================================================================
   Antique Khan — wishlist.js (wishlist.html)
============================================================================ */
(function () {
  'use strict';

  var root = document.getElementById('wishlist-root');
  AK.mountChrome('wishlist');

  function skeleton() {
    root.innerHTML =
      '<div class="container" style="padding-top:1.5rem;padding-bottom:2.5rem;">' +
      '<div class="skel" style="height:2rem;width:12rem;"></div>' +
      '<div class="cart-list" style="margin-top:1.25rem;">' +
      [0, 1].map(function () {
        return '<div class="wl-row"><div class="skel" style="height:5rem;width:5rem;border-radius:0.5rem;"></div>' +
          '<div style="flex:1;display:flex;flex-direction:column;gap:0.5rem;padding:0.25rem 0;">' +
          '<div class="skel" style="height:1rem;width:75%;"></div><div class="skel" style="height:0.75rem;width:33%;"></div>' +
          '<div class="skel" style="height:0.75rem;width:25%;"></div></div></div>';
      }).join('') +
      '</div></div>';
  }

  function empty() {
    root.innerHTML =
      '<div class="container" style="padding-top:1.5rem;padding-bottom:2.5rem;">' +
      '<div class="section-head"><div><h2 class="section-head__title">Your Wishlist</h2></div></div>' +
      AK.emptyState('heart', 'Your wishlist is empty', 'Tap the heart on any piece to save it here.',
        '<div style="display:flex;justify-content:center;"><a class="btn btn--primary btn--h11" href="shop.html">Discover Antiques</a></div>') +
      '</div>';
  }

  function render(fresh, loaded) {
    var items = AK.wishlist.items;
    if (items.length === 0) { empty(); return; }
    var byId = {};
    (fresh || []).forEach(function (p) { byId[p.id] = p; });

    root.innerHTML =
      '<div class="container" style="padding-top:1.5rem;padding-bottom:2.5rem;">' +
      '<div class="section-head"><div><h2 class="section-head__title">Your Wishlist</h2></div></div>' +
      '<p class="count-line" style="margin-top:-0.75rem;">' + items.length + ' saved piece' + (items.length === 1 ? '' : 's') + '</p>' +
      '<div class="cart-list">' +
      items.map(function (item) {
        var p = byId[item.productId];
        var status = p ? p.status : item.status;
        var active = !!p && status === 'active';
        return (
          '<div class="wl-row" data-pid="' + AK.esc(item.productId) + '">' +
          '<a href="product.html?id=' + encodeURIComponent(item.productId) + '" aria-label="' + AK.esc(item.title) + '" class="cart-thumb">' +
          (item.image
            ? '<img src="' + AK.esc(item.image) + '" alt="' + AK.esc(item.title) + '" loading="lazy" decoding="async" draggable="false" onerror="AK.imgFail(this)" />'
            : '<span class="cart-thumb--ph" style="display:flex;width:100%;height:100%;">' + AK.icon('image', 'ic--20 tx-muted') + '</span>') +
          '</a>' +
          '<div class="cart-mid">' +
          '<a class="cart-title" href="product.html?id=' + encodeURIComponent(item.productId) + '">' + AK.esc(item.title) + '</a>' +
          '<p class="cart-price">' + AK.fmtEGP(item.price) + '</p>' +
          '<div class="wl-status">' + AK.statusBadge(status) + '</div>' +
          '</div>' +
          '<div class="wl-end">' +
          '<button type="button" class="btn btn--primary btn--h10" data-add="1"' + (active ? '' : ' disabled') + '><span class="spin-btn">' + AK.icon('shopping-bag') + 'Add to Cart</span></button>' +
          '<button type="button" class="cart-remove" data-remove="1" aria-label="Remove ' + AK.esc(item.title) + ' from wishlist">' + AK.icon('x') + '</button>' +
          '</div></div>'
        );
      }).join('') +
      '</div>' +
      '<p class="footnote">Wishlist is saved on this device.</p>' +
      '</div>';

    root.querySelectorAll('.wl-row').forEach(function (row) {
      var pid = row.getAttribute('data-pid');
      var addBtn = row.querySelector('[data-add]');
      if (addBtn) {
        addBtn.addEventListener('click', function () {
          var p = byId[pid];
          if (p && p.status === 'active') {
            AK.cart.add(p, 1);
            AK.toast.success('Added to cart — ' + p.title);
          } else {
            AK.toast.error('This piece is no longer available');
          }
        });
      }
      var rm = row.querySelector('[data-remove]');
      if (rm) {
        rm.addEventListener('click', function () {
          var item = AK.wishlist.items.find(function (i) { return i.productId === pid; });
          AK.wishlist.remove(pid);
          AK.toast('Removed from wishlist — ' + (item ? item.title : 'piece'));
          load();
        });
      }
    });
  }

  function load() {
    var items = AK.wishlist.items;
    if (items.length === 0) { empty(); return; }
    render([], false);
    var ids = items.map(function (i) { return i.productId; });
    AK.fetchProducts({ ids: ids }).then(function (res) {
      render(res.error ? [] : res.products, true);
    });
  }

  skeleton();
  if (AK.isConfigured()) load();
})();
