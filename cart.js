/* ============================================================================
   Antique Khan — cart.js (cart.html)
============================================================================ */
(function () {
  'use strict';

  var root = document.getElementById('cart-root');
  AK.mountChrome('cart');

  function skeleton() {
    root.innerHTML =
      '<div class="container" style="padding-top:1.5rem;padding-bottom:2.5rem;">' +
      '<div class="skel" style="height:2rem;width:10rem;"></div>' +
      '<div class="cart-list" style="margin-top:1.25rem;">' +
      [0, 1].map(function () {
        return '<div class="cart-row"><div class="skel" style="height:5rem;width:5rem;border-radius:0.5rem;"></div>' +
          '<div style="flex:1;display:flex;flex-direction:column;gap:0.5rem;padding:0.25rem 0;">' +
          '<div class="skel" style="height:1rem;width:75%;"></div><div class="skel" style="height:0.75rem;width:33%;"></div>' +
          '<div class="skel" style="height:2.25rem;width:9rem;"></div></div></div>';
      }).join('') +
      '</div></div>';
  }

  function emptyCart() {
    root.innerHTML =
      '<div class="container" style="padding-top:1.5rem;padding-bottom:2.5rem;">' +
      '<div class="section-head"><div><h2 class="section-head__title">Your Cart</h2></div></div>' +
      AK.emptyState('shopping-bag', 'Your cart is empty', 'Discover one-of-a-kind antiques.',
        '<div style="display:flex;justify-content:center;"><a class="btn btn--primary btn--h11" href="shop.html">Browse the Collection</a></div>') +
      '</div>';
  }

  function renderCart(fresh, loaded) {
    var items = AK.cart.items;
    if (items.length === 0) { emptyCart(); return; }
    var byId = {};
    (fresh || []).forEach(function (p) { byId[p.id] = p; });

    function available(item) {
      var p = byId[item.productId];
      return !!p && p.status === 'active';
    }
    var anyUnavailable = loaded && items.some(function (i) { return !available(i); });
    var count = AK.cart.count();
    var subtotal = AK.cart.subtotal();

    root.innerHTML =
      '<div class="container" style="padding-top:1.5rem;padding-bottom:2.5rem;">' +
      '<div class="section-head"><div><h2 class="section-head__title">Your Cart</h2></div></div>' +
      '<p class="count-line" style="margin-top:-0.75rem;">' + count + ' item' + (count === 1 ? '' : 's') + ' in your cart</p>' +
      '<div class="cart-list">' +
      items.map(function (item) {
        var avail = available(item);
        return (
          '<div class="cart-row" data-pid="' + AK.esc(item.productId) + '">' +
          '<a href="product.html?id=' + encodeURIComponent(item.productId) + '" aria-label="' + AK.esc(item.title) + '" class="cart-thumb">' +
          (item.image
            ? '<img src="' + AK.esc(item.image) + '" alt="' + AK.esc(item.title) + '" loading="lazy" decoding="async" draggable="false" onerror="AK.imgFail(this)" />'
            : '<span class="cart-thumb--ph" style="display:flex;width:100%;height:100%;">' + AK.icon('image', 'ic--20 tx-muted') + '</span>') +
          '</a>' +
          '<div class="cart-mid">' +
          '<a class="cart-title" href="product.html?id=' + encodeURIComponent(item.productId) + '">' + AK.esc(item.title) + '</a>' +
          '<p class="cart-price">' + AK.fmtEGP(item.price) + '</p>' +
          (avail
            ? '<div style="margin-top:0.5rem;"><div class="qty" role="group" aria-label="Quantity">' +
              '<button type="button" class="qty__btn" data-q="-1" aria-label="Decrease quantity"' + (item.qty <= 1 ? ' disabled' : '') + '>' + AK.icon('minus') + '</button>' +
              '<span class="qty__val" aria-live="polite">' + item.qty + '</span>' +
              '<button type="button" class="qty__btn" data-q="1" aria-label="Increase quantity"' + (item.qty >= 99 ? ' disabled' : '') + '>' + AK.icon('plus') + '</button>' +
              '</div></div>'
            : '<p class="cart-unavail">' + AK.icon('triangle-alert') + 'No longer available</p>') +
          '</div>' +
          '<div class="cart-end">' +
          '<p class="cart-total">' + AK.fmtEGP(item.price * item.qty) + '</p>' +
          '<button type="button" class="cart-remove" data-remove="1" aria-label="Remove ' + AK.esc(item.title) + '">' + AK.icon('trash-2') + '</button>' +
          '</div></div>'
        );
      }).join('') +
      '</div>' +
      '<div class="cart-summary">' +
      '<div class="cart-summary__row"><span class="cart-summary__label">Items (' + count + ')</span></div>' +
      '<div class="cart-summary__row"><span class="cart-summary__total">Subtotal</span><span class="cart-summary__num">' + AK.fmtEGP(subtotal) + '</span></div>' +
      '<p class="cart-summary__note">Delivery is arranged via WhatsApp after ordering · Cash on Delivery available across Egypt</p>' +
      (anyUnavailable ? '<p class="amber-alert" role="alert">Some pieces in your cart are no longer available. Remove them to continue.</p>' : '') +
      '<button type="button" class="btn btn--primary btn--h12 btn--block btn--15" id="to-checkout"' + (anyUnavailable ? ' disabled' : '') + '>Proceed to Checkout ' + AK.icon('arrow-right') + '</button>' +
      '<a class="continue-link" href="shop.html">Continue shopping</a>' +
      '</div></div>';

    root.querySelectorAll('.cart-row').forEach(function (row) {
      var pid = row.getAttribute('data-pid');
      row.querySelectorAll('[data-q]').forEach(function (b) {
        b.addEventListener('click', function () {
          var item = AK.cart.items.find(function (i) { return i.productId === pid; });
          if (!item) return;
          AK.cart.setQty(pid, item.qty + Number(b.getAttribute('data-q')));
          load();
        });
      });
      var rm = row.querySelector('[data-remove]');
      if (rm) {
        rm.addEventListener('click', function () {
          var item = AK.cart.items.find(function (i) { return i.productId === pid; });
          AK.cart.remove(pid);
          AK.toast('Removed from cart — ' + (item ? item.title : 'item'));
          load();
        });
      }
    });
    var toCheckout = document.getElementById('to-checkout');
    if (toCheckout) {
      toCheckout.addEventListener('click', function () {
        window.location.href = 'checkout.html';
      });
    }
  }

  function load() {
    var items = AK.cart.items;
    if (items.length === 0) { emptyCart(); return; }
    renderCart([], false); // render immediately, then re-render once fresh data lands
    var ids = items.map(function (i) { return i.productId; });
    AK.fetchProducts({ ids: ids }).then(function (res) {
      renderCart(res.error ? [] : res.products, true);
    });
  }

  skeleton();
  if (AK.isConfigured()) load();
  else AK.on('cart', function () { /* config banner already shown */ });
})();
