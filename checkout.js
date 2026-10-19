/* ============================================================================
   Antique Khan — checkout.js (checkout.html)
   Single-column mobile form, searchable governorate sheet, COD/InstaPay,
   server-side-backed validation parity, WhatsApp hand-off.
============================================================================ */
(function () {
  'use strict';

  var C = window.AK_CONFIG;
  var root = document.getElementById('checkout-root');
  AK.mountChrome(null);

  var form = {
    customerName: '', phone: '', phone2: '', governorate: '', cityArea: '', address: '', notes: '',
    paymentMethod: 'cod',
  };
  var errors = {};
  var placed = null;
  var submitting = false;
  var freshLoaded = false;
  var freshById = {};
  var shop = { loaded: false, s: null };

  function resolveShop() { return AK.resolveShopSettings(shop.s || {}); }

  function knownTotal() {
    var s = resolveShop();
    var subtotal = AK.cart.subtotal();
    return subtotal + (s.deliveryFee || 0);
  }

  function anyUnavailable() {
    return freshLoaded && form_items().some(function (i) {
      var p = freshById[i.productId];
      return !!p && p.status !== 'active';
    });
  }

  function form_items() {
    return AK.cart.items;
  }

  function skeleton() {
    root.innerHTML =
      '<div class="container" style="padding-top:1.5rem;padding-bottom:2.5rem;">' +
      '<div class="skel" style="height:2rem;width:10rem;"></div>' +
      '<div class="skel" style="height:6rem;width:100%;margin-top:1.25rem;border-radius:0.75rem;"></div>' +
      '<div class="skel" style="height:16rem;width:100%;margin-top:1.25rem;border-radius:0.75rem;"></div>' +
      '</div>';
  }

  function emptyCart() {
    root.innerHTML =
      '<div class="container" style="padding-top:1.5rem;padding-bottom:2.5rem;">' +
      '<div class="section-head"><div><h2 class="section-head__title">Checkout</h2></div></div>' +
      AK.emptyState('shopping-bag', 'Your cart is empty', 'Discover one-of-a-kind antiques.',
        '<div style="display:flex;justify-content:center;"><a class="btn btn--primary btn--h11" href="shop.html">Browse the Collection</a></div>') +
      '</div>';
  }

  /* ------------------------------------------------------------- success */
  function renderSuccess(order) {
    root.innerHTML =
      '<div class="container" style="padding-top:3.5rem;padding-bottom:3.5rem;">' +
      '<div class="success-panel">' +
      AK.icon('circle-check', 'big-ic') +
      '<h1>Order Saved</h1>' +
      '<p>Order <b>' + AK.esc(order.code) + '</b> has been saved. Send the WhatsApp message to complete it — we will confirm your order and delivery details shortly.</p>' +
      '<a class="success-wa" target="_blank" rel="noreferrer" href="' + AK.waLink(AK.orderMessage(order)) + '">' + AK.icon('message-circle') + 'Send Order on WhatsApp</a>' +
      '<a class="btn btn--outline btn--h12 btn--block btn--15" href="shop.html">Continue Shopping</a>' +
      '</div></div>';
  }

  /* --------------------------------------------------------- order summary */
  function orderSummaryHtml(subtotal) {
    var items = form_items();
    var s = resolveShop();
    return (
      '<div class="accordion">' +
      '<button type="button" class="acc-trigger" id="sum-trigger" aria-expanded="true" aria-controls="sum-content">' +
      '<span>Order summary · ' + AK.fmtEGP(subtotal) + '</span>' + AK.icon('chevron-down') + '</button>' +
      '<div class="acc-content is-open" id="sum-content">' +
      items.map(function (item) {
        return (
          '<div class="acc-item">' +
          '<div class="acc-thumb">' + (item.image ? '<img src="' + AK.esc(item.image) + '" alt="" loading="lazy" onerror="AK.imgFail(this)" />' : '') + '</div>' +
          '<div style="min-width:0;flex:1;"><p class="acc-name line-clamp-1">' + AK.esc(item.title) + '</p><p class="acc-qty">×' + item.qty + '</p></div>' +
          '<p class="acc-amt">' + AK.fmtEGP(item.price * item.qty) + '</p>' +
          '</div>'
        );
      }).join('') +
      '<hr class="sep" style="margin-top:0.75rem;" />' +
      '<div class="acc-row acc-row--muted" style="margin-top:0.75rem;"><span>Subtotal</span><span>' + AK.fmtEGP(subtotal) + '</span></div>' +
      (shop.loaded && s.deliveryFee !== null
        ? '<div class="acc-row acc-row--muted"><span>Delivery</span><span>' + AK.fmtEGP(s.deliveryFee) + '</span></div>' +
          '<div class="acc-row acc-row--bold"><span>Total</span><span>' + AK.fmtEGP(subtotal + s.deliveryFee) + '</span></div>'
        : '<div class="acc-row acc-row--muted"><span>Delivery</span><span>' + AK.esc(s.deliveryNote) + '</span></div>' +
          '<div class="acc-row acc-row--bold"><span>Total</span><span>' + AK.fmtEGP(subtotal) + ' <span class="acc-total-note">+ delivery</span></span></div>') +
      '<p class="acc-note">Cash on Delivery available across Egypt.</p>' +
      '</div></div>'
    );
  }

  /* ------------------------------------------------------------ gov select */
  function openGovernorate() {
    var search = '';
    AK.openSheet({
      side: 'bottom',
      title: 'Select Governorate',
      description: '27 governorates across Egypt',
      build: function (body, close) {
        function list() {
          var q = search.trim().toLowerCase();
          var filtered = q ? C.GOVERNORATES.filter(function (g) { return g.toLowerCase().indexOf(q) !== -1; }) : C.GOVERNORATES;
          if (filtered.length === 0) {
            return '<p class="gov-empty">No governorates match “' + AK.esc(search) + '”</p>';
          }
          return filtered.map(function (g) {
            return (
              '<button type="button" class="gov-row' + (form.governorate === g ? ' is-selected' : '') + '" data-g="' + AK.esc(g) + '">' +
              '<span>' + AK.esc(g) + '</span>' +
              (form.governorate === g ? AK.icon('check') : '') +
              '</button>'
            );
          }).join('');
        }
        body.innerHTML =
          '<div class="gov-search"><input class="input" id="gov-search" inputmode="search" aria-label="Search governorates" placeholder="Search governorates…" /></div>' +
          '<div class="gov-list scrollbar-thin" id="gov-list" style="flex:1;overflow-y:auto;">' + list() + '</div>';
        var input = body.querySelector('#gov-search');
        input.addEventListener('input', function () {
          search = input.value;
          body.querySelector('#gov-list').innerHTML = list();
        });
        body.querySelector('#gov-list').addEventListener('click', function (e) {
          var b = e.target.closest('[data-g]');
          if (!b) return;
          setField('governorate', b.getAttribute('data-g'));
          close();
          render(); // reflect the chosen governorate immediately (no focus to preserve)
        });
        setTimeout(function () { input.focus(); }, 120);
      },
    });
  }

  /* ------------------------------------------------------------------ form */
  function fieldErr(key) {
    return errors[key]
      ? '<p class="err-text" role="alert">' + AK.esc(errors[key]) + '</p>'
      : '';
  }

  function render() {
    if (placed) { renderSuccess(placed); return; }
    var items = form_items();
    if (items.length === 0) { emptyCart(); return; }
    var subtotal = AK.cart.subtotal();
    var unavail = anyUnavailable();
    var s = resolveShop();

    root.innerHTML =
      '<div class="container" style="padding-top:1.5rem;padding-bottom:2.5rem;">' +
      '<div style="max-width:48rem;margin-inline:auto;">' +
      '<div class="section-head"><div><h2 class="section-head__title">Checkout</h2></div></div>' +
      '<p class="count-line">Cash on Delivery or InstaPay — confirm on WhatsApp</p>' +
      (unavail
        ? '<div class="amber-alert" role="alert" style="margin-top:1.25rem;">' +
          '<p style="display:flex;align-items:flex-start;gap:0.5rem;">' + AK.icon('triangle-alert') + '<span>Some pieces in your cart are no longer available. Please remove them to continue.</span></p>' +
          '<a class="btn btn--outline btn--h11 btn--block" style="margin-top:0.75rem;" href="cart.html">Back to Cart</a></div>'
        : '') +
      '<div class="checkout-grid">' +
      /* summary — first on mobile, right column on desktop (order swaps via CSS) */
      '<div class="order-first-lg" id="summary-host">' + orderSummaryHtml(subtotal) + '</div>' +
      '<form novalidate class="checkout-form" id="co-form">' +
      '<div class="field"><label class="label" for="customerName">Full Name <span class="req">*</span></label>' +
      '<input class="input" id="customerName" autocomplete="name" placeholder="e.g., Omar Hassan" value="' + AK.esc(form.customerName) + '"' + (errors.customerName ? ' aria-invalid="true"' : '') + ' />' + fieldErr('customerName') + '</div>' +
      '<div class="field"><label class="label" for="phone">Phone Number <span class="req">*</span></label>' +
      '<input class="input" id="phone" type="tel" inputmode="tel" autocomplete="tel" placeholder="01XXXXXXXXX" value="' + AK.esc(form.phone) + '"' + (errors.phone ? ' aria-invalid="true"' : '') + ' />' +
      '<p class="hint">Egyptian mobile number — we use it to confirm delivery</p>' + fieldErr('phone') + '</div>' +
      '<div class="field"><label class="label" for="phone2">Additional Phone (optional)</label>' +
      '<input class="input" id="phone2" type="tel" inputmode="tel" autocomplete="tel" placeholder="Another number, if any" value="' + AK.esc(form.phone2) + '"' + (errors.phone2 ? ' aria-invalid="true"' : '') + ' />' +
      fieldErr('phone2') + '</div>' +
      '<div class="field"><label class="label" id="gov-label">Governorate <span class="req">*</span></label>' +
      '<button type="button" class="gov-btn' + (errors.governorate ? ' is-error' : '') + '" id="gov-open" role="combobox" aria-expanded="false" aria-labelledby="gov-label">' +
      '<span class="gov-btn__val' + (form.governorate ? '' : ' is-placeholder') + '">' + AK.esc(form.governorate || 'Select governorate…') + '</span>' +
      AK.icon('chevrons-up-down') + '</button>' + fieldErr('governorate') + '</div>' +
      '<div class="field"><label class="label" for="cityArea">Area / City <span class="req">*</span></label>' +
      '<input class="input" id="cityArea" placeholder="e.g., Nasr City" value="' + AK.esc(form.cityArea) + '"' + (errors.cityArea ? ' aria-invalid="true"' : '') + ' />' + fieldErr('cityArea') + '</div>' +
      '<div class="field"><label class="label" for="address">Full Address <span class="req">*</span></label>' +
      '<textarea class="textarea" id="address" rows="3" placeholder="Street, building, floor, apartment, landmarks…"' + (errors.address ? ' aria-invalid="true"' : '') + '>' + AK.esc(form.address) + '</textarea>' + fieldErr('address') + '</div>' +
      '<div class="field"><label class="label" for="notes">Notes (optional)</label>' +
      '<textarea class="textarea" id="notes" rows="2" placeholder="Delivery timing, gift wrapping…">' + AK.esc(form.notes) + '</textarea></div>' +
      '<fieldset class="filter-set"><span class="form-legend">Payment Method <span class="req">*</span></span>' +
      '<div class="pay-grid" role="radiogroup" aria-label="Payment method">' +
      payCard('cod', 'banknote', 'Cash on Delivery', 'Pay cash when it arrives') +
      payCard('instapay', 'smartphone', 'InstaPay', 'Transfer after confirming') +
      '</div>' +
      (form.paymentMethod === 'instapay'
        ? (s.instapayConfigured
            ? '<div class="instapay-box"><p>Send your transfer to <b>' + AK.esc(s.instapayNumber) + '</b>' + (s.instapayName ? ' — ' + AK.esc(s.instapayName) : '') + '</p>' +
              (s.instapayHandle ? '<p class="hint">InstaPay handle ' + AK.esc(s.instapayHandle) + '. </p>' : '') +
              '<p class="hint">After placing the order, send the transfer receipt on WhatsApp to confirm.</p></div>'
            : '<div class="instapay-box"><p>The shop will share the InstaPay payment details with you on WhatsApp after you place the order.</p>' +
              '<p class="hint">You can also ask us for the details before ordering.</p></div>')
        : '') +
      '</fieldset>' +
      '<button type="submit" class="place-btn"' + (submitting || unavail ? ' disabled' : '') + ' id="place-btn">' +
      (submitting
        ? '<span class="spin-btn"><svg class="ic spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>Placing order…</span>'
        : '<span class="spin-btn">' + AK.icon('message-circle') + 'Place Order via WhatsApp</span>') +
      '</button>' +
      '<p class="place-note">Your order details will open in WhatsApp for confirmation.</p>' +
      '</form>' +
      '</div></div></div>';

    function payCard(value, icon, title, sub) {
      var checked = form.paymentMethod === value;
      return (
        '<button type="button" role="radio" aria-checked="' + checked + '" class="pay-card' + (checked ? ' is-checked' : '') + '" data-pay="' + value + '">' +
        AK.icon(icon) +
        '<span class="pay-card__title">' + title + '</span>' +
        '<span class="pay-card__sub">' + sub + '</span>' +
        '</button>'
      );
    }

    /* wire events */
    ['customerName', 'phone', 'phone2', 'cityArea'].forEach(function (id) {
      var input = document.getElementById(id);
      input.addEventListener('input', function () { setField(id, input.value); });
    });
    var addr = document.getElementById('address');
    addr.addEventListener('input', function () { setField('address', addr.value); });
    var notes = document.getElementById('notes');
    notes.addEventListener('input', function () { setField('notes', notes.value); });

    document.getElementById('gov-open').addEventListener('click', openGovernorate);
    root.querySelectorAll('[data-pay]').forEach(function (b) {
      b.addEventListener('click', function () {
        form.paymentMethod = b.getAttribute('data-pay');
        render();
      });
    });
    var sumTrigger = document.getElementById('sum-trigger');
    sumTrigger.addEventListener('click', function () {
      var open = sumTrigger.getAttribute('aria-expanded') === 'true';
      sumTrigger.setAttribute('aria-expanded', String(!open));
      document.getElementById('sum-content').classList.toggle('is-open', !open);
    });
    document.getElementById('co-form').addEventListener('submit', onSubmit);
  }

  /* Update state without re-rendering: rebuilding the form while the user
     types would destroy the focused input (vanilla-DOM has no reconciliation).
     Field errors are cleared surgically in place instead. */
  function clearFieldError(key) {
    if (!errors[key]) return;
    delete errors[key];
    var el = document.getElementById(key === 'governorate' ? 'gov-open' : key);
    if (!el) return;
    if (key === 'governorate') el.classList.remove('is-error');
    else el.removeAttribute('aria-invalid');
    if (el.parentElement) {
      var errEl = el.parentElement.querySelector('.err-text');
      if (errEl) errEl.remove();
    }
  }

  function setField(key, value) {
    form[key] = value;
    clearFieldError(key);
  }

  function scrollToInvalid() {
    var el = document.querySelector('[aria-invalid="true"]');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  function onSubmit(e) {
    e.preventDefault();
    var errs = {};
    if (form.customerName.trim().length < 3) errs.customerName = 'Please enter your full name';
    if (!C.EGYPT_PHONE_REGEX.test(AK.normalizePhone(form.phone))) errs.phone = 'Enter a valid Egyptian mobile number (e.g. 01012345678)';
    if (form.phone2.trim() && !C.EGYPT_PHONE_REGEX.test(AK.normalizePhone(form.phone2))) errs.phone2 = 'Enter a valid Egyptian mobile number (or leave this empty)';
    if (!form.governorate) errs.governorate = 'Select your governorate';
    if (!form.cityArea.trim()) errs.cityArea = 'Enter your area or city';
    if (form.address.trim().length < 8) errs.address = 'Enter a complete delivery address';
    if (Object.keys(errs).length > 0) {
      errors = errs;
      render();
      scrollToInvalid();
      AK.toast.error('Please fix the highlighted fields');
      return;
    }
    errors = {};
    submitting = true;
    render();

    var s = resolveShop();
    var items = form_items().map(function (i) {
      return { productId: i.productId, title: i.title, price: i.price, qty: i.qty };
    });
    var subtotal = items.reduce(function (sum, i) { return sum + i.price * i.qty; }, 0);
    var fee = s.deliveryFee;

    AK.createOrder({
      customerName: form.customerName.trim(),
      phone: form.phone.replace(/[\s-]/g, ''),
      phone2: form.phone2.trim() ? form.phone2.replace(/[\s-]/g, '') : null,
      governorate: form.governorate,
      cityArea: form.cityArea.trim(),
      address: form.address.trim(),
      notes: form.notes.trim() || null,
      paymentMethod: form.paymentMethod,
      items: items,
      subtotal: subtotal,
      deliveryFee: fee,
      total: subtotal + (fee || 0),
    })
      .then(function (order) {
        submitting = false;
        placed = order;
        AK.cart.clear();
        render();
        try {
          window.open(AK.waLink(AK.orderMessage(order)), '_blank');
        } catch (err) {
          /* popup blocked — success panel offers the manual link */
        }
      })
      .catch(function (err) {
        submitting = false;
        render();
        AK.toast.error(AK.errMessage(err));
      });
  }

  /* ------------------------------------------------------------------ boot */
  skeleton();
  if (!AK.isConfigured()) {
    root.innerHTML = '';
    return;
  }
  if (AK.cart.items.length === 0) {
    emptyCart();
  } else {
    render();
    AK.fetchSettings().then(function (map) {
      shop = { loaded: true, s: map };
      if (!placed) render();
    });
    var ids = form_items().map(function (i) { return i.productId; });
    AK.fetchProducts({ ids: ids }).then(function (res) {
      freshById = {};
      if (!res.error) {
        res.products.forEach(function (p) { freshById[p.id] = { status: p.status }; });
      }
      freshLoaded = true;
      if (!placed) render(); // refresh the unavailable warning like the original
    });
  }
})();
