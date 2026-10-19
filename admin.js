/* ============================================================================
   Antique Khan — admin.js (admin.html)
   Supabase Auth gate → dashboard (stats + tabs) → product CRUD with phone
   camera/gallery uploads to Supabase Storage → orders management.
============================================================================ */
(function () {
  'use strict';

  var C = window.AK_CONFIG;
  var root = document.getElementById('admin-root');

  var state = {
    view: 'loading', // loading | login | dashboard
    tab: 'products',
    products: [],
    orders: [],
    loadingProducts: true,
    loadingOrders: true,
    search: '',
    statusFilter: 'all',
    orderFilter: 'all',
    formOpen: false,
    editing: null,
    busyId: null,
  };

  AK.mountChrome(null);

  root.innerHTML = '<div id="admin-view"></div>';
  var view = document.getElementById('admin-view');

  function spinner() {
    return '<div style="display:flex;min-height:60vh;align-items:center;justify-content:center;">' +
      '<svg class="ic spin" style="width:2rem;height:2rem;color:var(--accent);" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg></div>';
  }

  function errText(err) {
    var msg = AK.errMessage(err);
    if (err && (err.code === '42501' || /row-level security/i.test(msg))) {
      msg += ' — make sure your account email is listed in admin_users (see README).';
    }
    return msg;
  }

  /* Raw-XHR storage URLs honour the optional gateway hint (see common.js). */
  function gatewayParam(base) {
    if (window.AK_GATEWAY_PORT && base.indexOf('XTransformPort=') === -1) {
      return base + (base.indexOf('?') === -1 ? '?' : '&') + 'XTransformPort=' + window.AK_GATEWAY_PORT;
    }
    return base;
  }
  function storeUrl(path) {
    return gatewayParam(C.SUPABASE_URL + '/storage/v1/object/' + C.STORAGE_BUCKET + '/' + path);
  }
  function publicStoreUrl(path) {
    return gatewayParam(C.SUPABASE_URL + '/storage/v1/object/public/' + C.STORAGE_BUCKET + '/' + path);
  }

  /* ================================================================== AUTH */
  function renderLogin() {
    view.innerHTML =
      '<div class="auth-wrap">' +
      '<div class="auth-card">' +
      '<div class="auth-card__head">' +
      '<p class="auth-brand">Antique <span class="logo__accent">Khan</span></p>' +
      '<h1 class="auth-title">Store Admin</h1>' +
      '<p class="auth-desc">Sign in to manage your collection</p>' +
      '</div>' +
      '<div class="auth-card__body">' +
      '<form id="login-form" novalidate style="display:flex;flex-direction:column;gap:1rem;">' +
      '<div class="field"><label class="label" for="admin-email">Email</label>' +
      '<input class="input" id="admin-email" name="email" type="email" autocomplete="username" autocapitalize="none" autocorrect="off" spellcheck="false" required /></div>' +
      '<div class="field"><label class="label" for="admin-password">Password</label>' +
      '<input class="input" id="admin-password" name="password" type="password" autocomplete="current-password" required /></div>' +
      '<p class="auth-error" id="login-error" role="alert" style="display:none;"></p>' +
      '<button type="submit" class="btn btn--primary btn--h11 btn--block" id="login-btn">Sign In</button>' +
      '</form>' +
      '<p class="hint tx-center">Admin access is protected by Supabase Auth and Row Level Security.</p>' +
      '</div></div></div>';

    var form = document.getElementById('login-form');
    var errEl = document.getElementById('login-error');
    var btn = document.getElementById('login-btn');
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      errEl.style.display = 'none';
      btn.disabled = true;
      btn.innerHTML = '<span class="spin-btn"><svg class="ic spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>Sign In</span>';
      AK.signIn(document.getElementById('admin-email').value.trim(), document.getElementById('admin-password').value)
        .then(function () {
          AK.toast.success('Welcome back');
          state.view = 'dashboard';
          loadAll();
        })
        .catch(function (err) {
          errEl.textContent = AK.errMessage(err);
          errEl.style.display = 'block';
          btn.disabled = false;
          btn.textContent = 'Sign In';
        });
    });
  }

  /* ============================================================= DASHBOARD */
  function loadAll() {
    state.loadingProducts = true;
    state.loadingOrders = true;
    render();
    refreshProducts();
    refreshOrders();
  }

  function refreshProducts() {
    return AK.db
      .from('products')
      .select('*')
      .order('created_at', { ascending: false })
      .then(function (res) {
        state.loadingProducts = false;
        if (res.error) {
          AK.toast.error(errText(res.error));
          state.products = [];
        } else {
          state.products = res.data.map(AK.mapProduct);
        }
        render();
      });
  }

  function refreshOrders() {
    return AK.db
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false })
      .then(function (res) {
        state.loadingOrders = false;
        if (res.error) {
          AK.toast.error(errText(res.error));
          state.orders = [];
        } else {
          state.orders = res.data.map(function (o) {
            return {
              id: o.id, code: o.code, customerName: o.customer_name, phone: o.phone,
              phone2: o.phone2 || null,
              governorate: o.governorate, cityArea: o.city_area, address: o.address,
              notes: o.notes, paymentMethod: o.payment_method, items: o.items || [],
              subtotal: Number(o.subtotal),
              deliveryFee: o.delivery_fee === null || o.delivery_fee === undefined ? null : Number(o.delivery_fee),
              total: o.total === null || o.total === undefined ? null : Number(o.total),
              status: o.status, createdAt: o.created_at,
            };
          });
        }
        render();
      });
  }

  function renderDashboard() {
    var activeCount = state.products.filter(function (p) { return p.status === 'active'; }).length;
    var soldCount = state.products.filter(function (p) { return p.status === 'sold'; }).length;
    var inactiveCount = state.products.filter(function (p) { return p.status === 'inactive'; }).length;
    var newOrders = state.orders.filter(function (o) { return o.status === 'new'; }).length;

    view.innerHTML =
      '<header class="admin-header">' +
      '<div class="container admin-header__row">' +
      '<div style="display:flex;align-items:center;gap:0.5rem;">' +
      '<h1 class="admin-header__title">Admin</h1>' +
      '<span class="badge badge--secondary admin-header__brand">Antique Khan</span></div>' +
      '<div style="display:flex;align-items:center;gap:0.25rem;">' +
      '<a href="index.html" class="btn btn--ghost btn--h11" aria-label="View store">' + AK.icon('store') + '<span style="display:none;" class="sm-inline">View store</span></a>' +
      '<button type="button" class="btn btn--ghost btn--h11 tx-destructive" id="logout-btn" aria-label="Sign out">' + AK.icon('log-out') + '</button>' +
      '</div></div></header>' +
      '<div class="container" style="padding-top:1.5rem;padding-bottom:2.5rem;">' +
      '<div style="display:flex;flex-direction:column;gap:1.5rem;">' +
      '<section aria-label="Overview"><div class="stats-grid">' +
      stat('package', 'Total', state.products.length, state.loadingProducts) +
      stat('shield-check', 'Available', activeCount, state.loadingProducts) +
      stat('sparkles', 'Sold', soldCount, state.loadingProducts) +
      stat('eye-off', 'Hidden', inactiveCount, state.loadingProducts) +
      '</div></section>' +
      '<section aria-label="Management">' +
      '<div class="tabs">' +
      '<button type="button" class="tab' + (state.tab === 'products' ? ' is-active' : '') + '" data-tab="products">Products</button>' +
      '<button type="button" class="tab' + (state.tab === 'orders' ? ' is-active' : '') + '" data-tab="orders">Orders' +
      (newOrders > 0 ? '<span class="pill-count">' + newOrders + '</span>' : '') + '</button>' +
      '<button type="button" class="tab' + (state.tab === 'settings' ? ' is-active' : '') + '" data-tab="settings">Settings</button>' +
      '</div>' +
      '<div style="margin-top:1rem;" id="tab-body"></div>' +
      '</section></div></div>';

    function stat(icon, label, value, loading) {
      return (
        '<div class="stat"><div class="stat__top">' + AK.icon(icon) +
        '<span class="stat__label">' + label + '</span></div>' +
        (loading
          ? '<div class="skel" style="margin-top:0.375rem;height:1.75rem;width:2.5rem;"></div>'
          : '<p class="stat__value">' + value + '</p>') +
        '</div>'
      );
    }

    document.getElementById('logout-btn').addEventListener('click', function () {
      AK.signOut()
        .then(function () {
          state.view = 'login';
          renderLogin();
        })
        .catch(function (err) { AK.toast.error(AK.errMessage(err)); });
    });
    view.querySelectorAll('[data-tab]').forEach(function (b) {
      b.addEventListener('click', function () {
        state.tab = b.getAttribute('data-tab');
        render();
      });
    });

    var body = document.getElementById('tab-body');
    if (state.tab === 'products') renderProductsTab(body);
    else if (state.tab === 'orders') renderOrdersTab(body);
    else renderSettingsTab(body);
  }

  /* ========================================================= PRODUCTS TAB */
  function renderProductsTab(host) {
    var query = state.search.trim().toLowerCase();
    var filtered = state.products.filter(function (p) {
      if (state.statusFilter !== 'all' && p.status !== state.statusFilter) return false;
      if (query && p.title.toLowerCase().indexOf(query) === -1 && p.category.toLowerCase().indexOf(query) === -1) return false;
      return true;
    });
    var counts = {
      all: state.products.length,
      active: state.products.filter(function (p) { return p.status === 'active'; }).length,
      sold: state.products.filter(function (p) { return p.status === 'sold'; }).length,
      inactive: state.products.filter(function (p) { return p.status === 'inactive'; }).length,
    };

    host.innerHTML =
      '<div class="admin-toolbar">' +
      '<div class="admin-search">' + AK.icon('search') +
      '<input class="input" id="psearch" placeholder="Search pieces…" aria-label="Search pieces" value="' + AK.esc(state.search) + '" /></div>' +
      '<button type="button" class="btn btn--primary btn--h11" id="add-btn"><span class="spin-btn">' + AK.icon('plus') + 'Add Piece</span></button>' +
      '</div>' +
      '<div class="status-chips no-scrollbar" role="group" aria-label="Filter by status" style="margin-top:0.75rem;">' +
      ['all:All', 'active:Available', 'sold:Sold', 'inactive:Hidden'].map(function (pair) {
        var kv = pair.split(':');
        var f = kv[0];
        return '<button type="button" class="schip' + (state.statusFilter === f ? ' is-active' : '') + '" data-sf="' + f + '" aria-pressed="' + (state.statusFilter === f) + '">' +
          kv[1] + ' (' + counts[f] + ')</button>';
      }).join('') +
      '</div>' +
      '<div id="plist-host"></div>';

    var listHost = document.getElementById('plist-host');

    if (state.loadingProducts) {
      listHost.innerHTML = '<div style="margin-top:0.75rem;display:flex;flex-direction:column;gap:0.75rem;">' +
        [0, 1, 2].map(function () { return '<div class="skel" style="height:6rem;border-radius:0.75rem;"></div>'; }).join('') + '</div>';
    } else if (filtered.length === 0) {
      var hasFilters = state.search || state.statusFilter !== 'all';
      listHost.innerHTML = AK.emptyState('package', hasFilters ? 'No pieces match' : 'No pieces yet',
        hasFilters ? 'Try a different search or status filter.' : 'Add your first antique with photos straight from your phone.',
        '<div style="display:flex;justify-content:center;"><button type="button" class="btn btn--primary btn--h11" data-addfirst="1"><span class="spin-btn">' + AK.icon('plus') + 'Add your first piece</span></button></div>');
    } else {
      listHost.innerHTML = '<ul class="plist">' + filtered.map(function (p) {
        var main = AK.mainImage(p);
        var actions = ['<button type="button" class="rowbtn" data-edit="' + p.id + '"><span class="spin-btn">' + AK.icon('pencil') + 'Edit</span></button>'];
        if (p.status === 'active') {
          actions.push(rowAction(p, 'sold', 'tag', 'Mark Sold'));
          actions.push(rowAction(p, 'inactive', 'eye-off', 'Hide'));
        } else if (p.status === 'sold') {
          actions.push(rowAction(p, 'active', 'rotate-ccw', 'Mark Available'));
        } else if (p.status === 'inactive') {
          actions.push(rowAction(p, 'active', 'eye', 'Show'));
        }
        actions.push('<button type="button" class="rowbtn rowbtn--danger" data-del="' + p.id + '"><span class="spin-btn">' + AK.icon('trash-2') + 'Delete</span></button>');
        return (
          '<li class="pitem">' +
          (main
            ? '<img class="pitem__thumb" src="' + AK.esc(main) + '" alt="' + AK.esc(p.title) + '" loading="lazy" onerror="AK.imgFail(this)" />'
            : '<div class="pitem__thumb pitem__thumb--ph">' + AK.icon('image', 'ic--18 tx-muted') + '</div>') +
          '<div class="pitem__mid"><p class="pitem__title line-clamp-1">' + AK.esc(p.title) + '</p>' +
          '<p class="pitem__meta truncate">' + AK.esc(p.category) + ' · ' + AK.fmtEGP(p.price) + '</p>' +
          '<div style="margin-top:0.25rem;">' + AK.statusBadge(p.status) + '</div></div>' +
          '<div class="pitem__actions">' + actions.join('') + '</div>' +
          '</li>'
        );
      }).join('') + '</ul>';
    }

    function rowAction(p, status, icon, label) {
      var busy = state.busyId === p.id + ':' + status;
      return '<button type="button" class="rowbtn" data-status="' + status + '" data-pid="' + p.id + '"' + (busy ? ' disabled' : '') + '>' +
        (busy ? spinnerSmall() : '<span class="spin-btn">' + AK.icon(icon) + label + '</span>') + '</button>';
    }

    document.getElementById('psearch').addEventListener('input', function () {
      state.search = this.value;
      renderProductsTab(host); // cheap re-render preserves focus via value re-set
    });
    var addBtn = document.getElementById('add-btn');
    addBtn.addEventListener('click', function () { openForm(null); });
    host.querySelectorAll('[data-sf]').forEach(function (b) {
      b.addEventListener('click', function () {
        state.statusFilter = b.getAttribute('data-sf');
        render();
      });
    });
    host.querySelectorAll('[data-addfirst]').forEach(function (b) {
      b.addEventListener('click', function () { openForm(null); });
    });
    host.querySelectorAll('[data-edit]').forEach(function (b) {
      b.addEventListener('click', function () {
        var p = state.products.find(function (x) { return x.id === b.getAttribute('data-edit'); });
        openForm(p);
      });
    });
    host.querySelectorAll('[data-status]').forEach(function (b) {
      b.addEventListener('click', function () {
        changeStatus(b.getAttribute('data-pid'), b.getAttribute('data-status'));
      });
    });
    host.querySelectorAll('[data-del]').forEach(function (b) {
      b.addEventListener('click', function () {
        var p = state.products.find(function (x) { return x.id === b.getAttribute('data-del'); });
        handleDelete(p);
      });
    });
  }

  function spinnerSmall() {
    return '<svg class="ic spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>';
  }

  function changeStatus(pid, status) {
    if (state.busyId) return;
    var p = state.products.find(function (x) { return x.id === pid; });
    if (!p) return;
    state.busyId = pid + ':' + status;
    render();
    AK.db
      .from('products')
      .update({ status: status, updated_at: new Date().toISOString() })
      .eq('id', pid)
      .then(function (res) {
        state.busyId = null;
        if (res.error) AK.toast.error(errText(res.error));
        else AK.toast.success('"' + p.title + '" is now ' + (C.STATUS_LABELS[status] || status));
        refreshProducts();
      });
  }

  function handleDelete(p) {
    if (!p) return;
    AK.confirm({
      title: 'Delete “' + p.title + '”?',
      description: 'This permanently removes the piece and its photos. This action cannot be undone.',
      confirmLabel: 'Delete',
    }).then(function (ok) {
      if (!ok) return;
      /* best-effort storage cleanup */
      p.images.forEach(function (img) {
        var m = String(img.url).match(/\/storage\/v1\/object\/public\/[^/]+\/(.+)$/);
        if (m) deleteStorageObject(m[1]);
      });
      AK.db.from('products').delete().eq('id', p.id).then(function (res) {
        if (res.error) AK.toast.error(errText(res.error));
        else AK.toast.success('"' + p.title + '" deleted');
        refreshProducts();
      });
    });
  }

  function deleteStorageObject(path) {
    return AK.getSession().then(function (session) {
      if (!session) return;
      return fetch(storeUrl(path), {
        method: 'DELETE',
        headers: { apikey: C.SUPABASE_ANON_KEY, Authorization: 'Bearer ' + session.access_token },
      }).catch(function () { /* best effort */ });
    });
  }

  /* ==================================================== PRODUCT FORM SHEET */
  function openForm(product) {
    state.formOpen = true;
    state.editing = product;
    var isEdit = !!product;
    var data = {
      title: product ? product.title : '',
      price: product ? String(product.price) : '',
      category: product ? product.category : '',
      status: product ? product.status : 'active',
      featured: product ? product.featured : false,
      description: product ? product.description || '' : '',
      caption: product ? product.caption || '' : '',
      height: product ? product.height || '' : '',
      length: product ? product.length || '' : '',
    };
    var images = product ? product.images.map(function (im) { return { url: im.url, isMain: im.isMain }; }) : [];
    var fieldErrors = {};
    var saving = false;

    AK.openSheet({
      side: 'right',
      title: isEdit ? 'Edit Piece' : 'Add a New Piece',
      description: isEdit ? product.title : 'Photos, details and pricing',
      onClose: function () { state.formOpen = false; state.editing = null; },
      build: function (body, close) {
        body.parentElement.classList.add('sheet--form');
        body.innerHTML = '<div class="aform" id="aform"></div>' +
          '<div class="aform-foot">' +
          '<button type="button" class="btn btn--outline" id="af-cancel">Cancel</button>' +
          '<button type="button" class="btn btn--primary" id="af-save">Save Piece</button>' +
          '</div>';

        var formEl = body.querySelector('#aform');

        function errP(key) {
          return fieldErrors[key] ? '<p class="err-text" role="alert">' + AK.esc(fieldErrors[key]) + '</p>' : '';
        }

        function renderForm() {
          formEl.innerHTML =
            '<div class="field"><label class="label" for="f-title">Title <span class="req">*</span></label>' +
            '<input class="input" id="f-title" value="' + AK.esc(data.title) + '"' + (fieldErrors.title ? ' aria-invalid="true"' : '') + ' />' + errP('title') + '</div>' +

            '<div class="field"><label class="label" for="f-price">Price (EGP) <span class="req">*</span></label>' +
            '<input class="input" id="f-price" type="number" inputmode="decimal" min="1" step="any" value="' + AK.esc(data.price) + '"' + (fieldErrors.price ? ' aria-invalid="true"' : '') + ' />' + errP('price') + '</div>' +

            '<div class="field"><label class="label" for="f-category">Category <span class="req">*</span></label>' +
            '<select class="select" id="f-category">' +
            '<option value="">Select a category…</option>' +
            C.CATEGORIES.map(function (c) { return '<option value="' + AK.esc(c) + '"' + (data.category === c ? ' selected' : '') + '>' + AK.esc(c) + '</option>'; }).join('') +
            '</select>' + errP('category') + '</div>' +

            '<div class="field"><label class="label" for="f-status">Status</label>' +
            '<select class="select" id="f-status">' +
            ['active:Available', 'sold:Sold', 'inactive:Hidden'].map(function (pair) {
              var kv = pair.split(':');
              return '<option value="' + kv[0] + '"' + (data.status === kv[0] ? ' selected' : '') + '>' + kv[1] + '</option>';
            }).join('') +
            '</select></div>' +

            '<div class="field-row">' +
            '<div class="field"><label class="label" for="f-height">Height (optional)</label>' +
            '<input class="input" id="f-height" placeholder="e.g., 62 cm" value="' + AK.esc(data.height) + '" /></div>' +
            '<div class="field"><label class="label" for="f-length">Length (optional)</label>' +
            '<input class="input" id="f-length" placeholder="e.g., 55 cm" value="' + AK.esc(data.length) + '" /></div>' +
            '</div>' +

            '<div class="field"><label class="label" for="f-caption">Caption (optional)</label>' +
            '<input class="input" id="f-caption" placeholder="A short caption shown under the description" value="' + AK.esc(data.caption) + '" /></div>' +

            '<div class="switchrow"><div><p class="label" style="font-size:15px;">Featured piece</p>' +
            '<p class="hint">Featured pieces appear in the Home page featured section</p></div>' +
            '<input type="checkbox" class="switch" id="f-featured"' + (data.featured ? ' checked' : '') + ' aria-label="Featured piece" /></div>' +

            '<div class="field"><label class="label" for="f-description">Description <span class="req">*</span></label>' +
            '<textarea class="textarea" id="f-description" rows="5"' + (fieldErrors.description ? ' aria-invalid="true"' : '') + '>' + AK.esc(data.description) + '</textarea>' + errP('description') + '</div>' +

            '<div class="field"><span class="label">Photos <span class="req">*</span></span>' +
            '<div id="uploader"></div></div>';

          /* inputs → data (errors cleared in place — re-rendering mid-typing
             would destroy the focused input) */
          function clearErr(el) {
            el.removeAttribute('aria-invalid');
            if (el.parentElement) {
              var errEl = el.parentElement.querySelector('.err-text');
              if (errEl) errEl.remove();
            }
          }
          ['title', 'price', 'height', 'length', 'caption', 'description'].forEach(function (k) {
            var input = formEl.querySelector('#f-' + k);
            input.addEventListener('input', function () {
              data[k] = input.value;
              if (fieldErrors[k]) { delete fieldErrors[k]; clearErr(input); }
            });
          });
          formEl.querySelector('#f-category').addEventListener('change', function () {
            data.category = this.value;
            if (fieldErrors.category) { delete fieldErrors.category; clearErr(this); }
          });
          formEl.querySelector('#f-status').addEventListener('change', function () {
            data.status = this.value;
          });
          formEl.querySelector('#f-featured').addEventListener('change', function () {
            data.featured = this.checked;
          });

          renderUploader(formEl.querySelector('#uploader'));
        }

        /* ------------------------------------------------------ uploader */
        function renderUploader(host2) {
          var maxIdx = -1;
          for (var i = 0; i < images.length; i++) if (images[i].isMain) { maxIdx = i; break; }
          if (maxIdx === -1 && images.length) { images[0].isMain = true; maxIdx = 0; }

          host2.innerHTML =
            '<div class="uploader">' +
            '<div class="uploader__btns">' +
            '<button type="button" class="btn btn--outline btn--h11" id="up-gallery"><span class="spin-btn">' + AK.icon('image-plus') + 'Choose photos</span></button>' +
            '<button type="button" class="btn btn--outline btn--h11" id="up-camera"><span class="spin-btn">' + AK.icon('camera') + 'Take a photo</span></button>' +
            '</div>' +
            '<input type="file" id="up-input-gallery" accept="image/*" multiple hidden />' +
            '<input type="file" id="up-input-camera" accept="image/*" capture="environment" hidden />' +
            '<div id="up-progress" style="display:none;">' +
            '<div class="upbar"><div class="upbar__fill" id="up-fill"></div></div>' +
            '<p class="uploader__progress-text" id="up-text" style="margin-top:0.25rem;"></p></div>' +
            (images.length
              ? '<div class="upgrid">' + images.map(function (im, i) {
                  return (
                    '<div class="uptile">' +
                    (im.isMain ? '<span class="uptile__main">Main</span>' : '') +
                    '<img src="' + AK.esc(im.url) + '" alt="Product photo ' + (i + 1) + '" onerror="AK.imgFail(this)" />' +
                    '<div class="uptile__ctl">' +
                    '<button type="button" data-act="main" data-i="' + i + '" class="' + (im.isMain ? 'star is-main' : 'star') + '" aria-label="Set as main photo">' + AK.icon('star') + '</button>' +
                    '<button type="button" data-act="left" data-i="' + i + '" aria-label="Move earlier"' + (i === 0 ? ' disabled' : '') + '>' + AK.icon('chevron-left') + '</button>' +
                    '<button type="button" data-act="right" data-i="' + i + '" aria-label="Move later"' + (i === images.length - 1 ? ' disabled' : '') + '>' + AK.icon('chevron-right') + '</button>' +
                    '<button type="button" data-act="del" data-i="' + i + '" aria-label="Remove photo">' + AK.icon('x') + '</button>' +
                    '</div></div>'
                  );
                }).join('') + '</div>'
              : '<p class="hint">Add at least one photo — the first one is the main photo.</p>') +
            '</div>';

          var galleryInput = host2.querySelector('#up-input-gallery');
          var cameraInput = host2.querySelector('#up-input-camera');
          host2.querySelector('#up-gallery').addEventListener('click', function () { galleryInput.click(); });
          host2.querySelector('#up-camera').addEventListener('click', function () { cameraInput.click(); });
          galleryInput.addEventListener('change', function () { handleFiles(this.files); this.value = ''; });
          cameraInput.addEventListener('change', function () { handleFiles(this.files); this.value = ''; });

          host2.querySelectorAll('[data-act]').forEach(function (b) {
            b.addEventListener('click', function () {
              var act = b.getAttribute('data-act');
              var i = Number(b.getAttribute('data-i'));
              if (act === 'main') {
                images = images.map(function (im, j) { return { url: im.url, isMain: j === i }; });
              } else if (act === 'left' && i > 0) {
                var t = images[i - 1]; images[i - 1] = images[i]; images[i] = t;
              } else if (act === 'right' && i < images.length - 1) {
                var t2 = images[i + 1]; images[i + 1] = images[i]; images[i] = t2;
              } else if (act === 'del') {
                images.splice(i, 1);
              }
              normalize();
              renderForm();
            });
          });

          function normalize() {
            var hasMain = images.some(function (im) { return im.isMain; });
            if (!hasMain && images.length) images[0].isMain = true;
            else if (hasMain) {
              var seen = false;
              images.forEach(function (im) {
                if (im.isMain && !seen) seen = true;
                else im.isMain = false;
              });
            }
          }

          /* client-side compression (identical to the original: ≤1600px JPEG 0.82) */
          function compressToJpeg(file) {
            return new Promise(function (resolve) {
              var done = function (source, w, h, cleanup) {
                try {
                  var scale = Math.min(1, 1600 / Math.max(w, h));
                  var cw = Math.max(1, Math.round(w * scale));
                  var ch = Math.max(1, Math.round(h * scale));
                  var canvas = document.createElement('canvas');
                  canvas.width = cw;
                  canvas.height = ch;
                  var ctx = canvas.getContext('2d');
                  if (!ctx) { cleanup(); resolve(null); return; }
                  ctx.drawImage(source, 0, 0, cw, ch);
                  canvas.toBlob(function (blob) { cleanup(); resolve(blob); }, 'image/jpeg', 0.82);
                } catch (e) { cleanup(); resolve(null); }
              };
              if (window.createImageBitmap) {
                createImageBitmap(file).then(function (bmp) {
                  done(bmp, bmp.width, bmp.height, function () { bmp.close(); });
                }).catch(function () { fallbackImg(); });
              } else fallbackImg();

              function fallbackImg() {
                var url = URL.createObjectURL(file);
                var img = new Image();
                img.onload = function () { done(img, img.naturalWidth || img.width, img.naturalHeight || img.height, function () { URL.revokeObjectURL(url); }); };
                img.onerror = function () { URL.revokeObjectURL(url); resolve(null); };
                img.src = url;
              }
            });
          }

          function uploadOne(blob, filename, token) {
            return new Promise(function (resolve, reject) {
              var path = 'products/' + filename;
              var ext = (blob.type === 'image/png' && '.png') || (blob.type === 'image/webp' && '.webp') || '.jpg';
              path = 'products/' + Date.now() + '-' + Math.random().toString(36).slice(2, 8) + ext;
              var xhr = new XMLHttpRequest();
              xhr.open('POST', storeUrl(path));
              xhr.setRequestHeader('apikey', C.SUPABASE_ANON_KEY);
              xhr.setRequestHeader('authorization', 'Bearer ' + token);
              xhr.setRequestHeader('x-upsert', 'true');
              xhr.upload.onprogress = function (e) {
                if (e.lengthComputable) {
                  var pct = Math.round((e.loaded / e.total) * 100);
                  var fill = document.getElementById('up-fill');
                  var txt = document.getElementById('up-text');
                  if (fill) fill.style.width = pct + '%';
                  if (txt) txt.textContent = 'Uploading… ' + pct + '%';
                }
              };
              xhr.onload = function () {
                if (xhr.status >= 200 && xhr.status < 300) {
                  resolve({ url: publicStoreUrl(path), path: path });
                } else {
                  var msg = 'Upload failed (' + xhr.status + ')';
                  try { msg = JSON.parse(xhr.responseText).message || msg; } catch (e) { /* keep */ }
                  reject(new Error(msg));
                }
              };
              xhr.onerror = function () { reject(new Error('Network error during upload')); };
              xhr.send(blob);
            });
          }

          function handleFiles(fileList) {
            var files = Array.prototype.slice.call(fileList || []).filter(function (f) { return /^image\//.test(f.type); });
            if (!files.length) return;
            var progress = document.getElementById('up-progress');
            var fill = document.getElementById('up-fill');
            var txt = document.getElementById('up-text');
            progress.style.display = 'block';
            fill.style.width = '0%';
            txt.textContent = 'Preparing…';

            AK.getSession().then(function (session) {
              if (!session) throw new Error('Session expired — please sign in again');
              var chain = Promise.resolve();
              files.forEach(function (file) {
                chain = chain.then(function () {
                  return compressToJpeg(file).then(function (blob) {
                    var out = blob || file;
                    var name = file.name.replace(/\.[^./\\]+$/, '').replace(/[^\w-]+/g, '-').slice(0, 40) || 'photo';
                    return uploadOne(out, name + '-' + Date.now() + '-' + Math.floor(Math.random() * 1e4) + '.jpg', session.access_token)
                      .then(function (r) {
                        images.push({ url: r.url, isMain: false });
                        normalize();
                      });
                  });
                });
              });
              return chain;
            }).then(function () {
              progress.style.display = 'none';
              renderForm();
            }).catch(function (err) {
              progress.style.display = 'none';
              AK.toast.error(AK.errMessage(err));
              renderForm();
            });
          }
        }

        /* ---------------------------------------------------------- save */
        body.querySelector('#af-cancel').addEventListener('click', close);
        body.querySelector('#af-save').addEventListener('click', function () {
          if (saving) return;
          /* client validation mirrors the original form + server rules */
          fieldErrors = {};
          if (data.title.trim().length < 3) fieldErrors.title = 'Title must be at least 3 characters';
          var priceNum = Number(data.price);
          if (!data.price || !Number.isFinite(priceNum) || priceNum <= 0) fieldErrors.price = 'Price must be a positive number';
          if (!data.category) fieldErrors.category = 'Category is required';
          if (data.description.trim().length < 10) fieldErrors.description = 'Description must be at least 10 characters';
          if (images.length < 1) {
            AK.toast.error('Add at least one photo of the piece');
            return;
          }
          if (Object.keys(fieldErrors).length) {
            renderForm();
            AK.toast.error('Please fix the highlighted fields');
            return;
          }

          saving = true;
          var saveBtn = body.querySelector('#af-save');
          saveBtn.disabled = true;
          saveBtn.innerHTML = '<span class="spin-btn">' + spinnerSmall() + 'Saving…</span>';

          var imgCols = AK.serializeImages(images);
          var row = {
            title: data.title.trim(),
            description: data.description.trim() || null,
            caption: data.caption.trim() || null,
            height: data.height.trim() || null,
            length: data.length.trim() || null,
            price: priceNum,
            category: data.category,
            status: data.status,
            featured: data.featured,
            image_url: imgCols.image_url,
            image_urls: imgCols.image_urls,
            updated_at: new Date().toISOString(),
          };

          var op;
          if (isEdit) {
            op = AK.db.from('products').update(row).eq('id', product.id);
          } else {
            /* id + created_at are generated by the database (uuid / now()) */
            op = AK.db.from('products').insert(row);
          }

          op.then(function (res) {
            if (res.error) throw res.error;
            saving = false;
            AK.toast.success(isEdit ? 'Piece updated' : '"' + row.title + '" added to the shop');
            close();
            refreshProducts();
          }).catch(function (err) {
            saving = false;
            saveBtn.disabled = false;
            saveBtn.textContent = 'Save Piece';
            AK.toast.error(errText(err));
          });
        });

        renderForm();
      },
    });
  }

  /* =========================================================== ORDERS TAB */
  function renderOrdersTab(host) {
    var counts = {
      all: state.orders.length,
      new: state.orders.filter(function (o) { return o.status === 'new'; }).length,
      confirmed: state.orders.filter(function (o) { return o.status === 'confirmed'; }).length,
      delivered: state.orders.filter(function (o) { return o.status === 'delivered'; }).length,
      cancelled: state.orders.filter(function (o) { return o.status === 'cancelled'; }).length,
    };
    var filtered = state.orderFilter === 'all' ? state.orders : state.orders.filter(function (o) { return o.status === state.orderFilter; });

    host.innerHTML =
      '<div class="status-chips no-scrollbar" role="group" aria-label="Filter orders by status">' +
      ['all:All', 'new:New', 'confirmed:Confirmed', 'delivered:Delivered', 'cancelled:Cancelled'].map(function (pair) {
        var kv = pair.split(':');
        return '<button type="button" class="schip' + (state.orderFilter === kv[0] ? ' is-active' : '') + '" data-of="' + kv[0] + '">' +
          kv[1] + ' (' + counts[kv[0]] + ')</button>';
      }).join('') +
      '</div><div id="olist-host"></div>';

    var listHost = document.getElementById('olist-host');

    if (state.loadingOrders) {
      listHost.innerHTML = '<div style="display:flex;flex-direction:column;gap:0.75rem;margin-top:0.75rem;">' +
        [0, 1, 2].map(function () { return '<div class="skel" style="height:16rem;border-radius:0.75rem;"></div>'; }).join('') + '</div>';
      return;
    }
    if (filtered.length === 0) {
      listHost.innerHTML = AK.emptyState('shopping-bag', 'No orders yet', 'Orders placed through checkout appear here.');
      return;
    }

    var badgeCls = { new: 'order-badge--new', confirmed: 'order-badge--confirmed', delivered: 'order-badge--delivered', cancelled: 'order-badge--cancelled' };
    listHost.innerHTML = '<ul class="olist">' + filtered.map(function (o) {
      return (
        '<li class="oitem" data-oid="' + AK.esc(o.id) + '">' +
        '<div class="oitem__toprow"><div style="min-width:0;">' +
        '<p class="oitem__code">' + AK.esc(o.code) + '</p>' +
        '<p class="oitem__date">' + AK.fmtDateTime(o.createdAt) + '</p></div>' +
        '<span class="badge badge--outline ' + badgeCls[o.status] + '">' + (C.ORDER_STATUS_LABELS[o.status] || o.status) + '</span></div>' +
        '<div class="oitem__cust">' +
        '<p class="fw-medium">' + AK.esc(o.customerName) + '</p>' +
        '<a href="tel:' + AK.esc(o.phone) + '">' + AK.icon('phone', 'ic--14') + AK.esc(o.phone) + '</a>' +
        (o.phone2 ? '<a href="tel:' + AK.esc(o.phone2) + '">' + AK.icon('smartphone', 'ic--14') + AK.esc(o.phone2) + '</a>' : '') +
        '<p style="display:inline-flex;align-items:center;gap:0.375rem;">' + AK.icon('map-pin', 'ic--14 ic--accent') + AK.esc(o.governorate) + ' — ' + AK.esc(o.cityArea) + '</p>' +
        '<p class="oitem__addr">' + AK.esc(o.address) + '</p>' +
        '<p style="display:inline-flex;align-items:center;gap:0.375rem;color:var(--muted-foreground);">' +
        (o.paymentMethod === 'cod' ? AK.icon('banknote', 'ic--14') + 'Cash on Delivery' : AK.icon('smartphone', 'ic--14') + 'InstaPay') + '</p>' +
        '</div>' +
        '<div class="oitem__items">' +
        o.items.map(function (it) {
          return '<div class="oitem__line"><span class="line-clamp-1">' + AK.esc(it.title) + ' ×' + it.qty + '</span><span style="flex-shrink:0;">' + AK.fmtEGP(it.price * it.qty) + '</span></div>';
        }).join('') +
        '<div class="oitem__line"><span>Subtotal</span><span>' + AK.fmtEGP(o.subtotal) + '</span></div>' +
        (o.deliveryFee !== null
          ? '<div class="oitem__line"><span>Delivery</span><span>' + AK.fmtEGP(o.deliveryFee) + '</span></div>' +
            '<div class="oitem__line oitem__line--bold"><span>Total</span><span>' + AK.fmtEGP(o.total || (o.subtotal + o.deliveryFee)) + '</span></div>'
          : '<div class="oitem__line"><span>Delivery</span><span>To be confirmed</span></div>') +
        '</div>' +
        (o.notes ? '<p class="oitem__notes">Notes: ' + AK.esc(o.notes) + '</p>' : '') +
        '<div style="display:flex;flex-direction:column;gap:0.375rem;">' +
        '<label class="label tx-xs" for="ost-' + AK.esc(o.id) + '">Order status</label>' +
        '<select class="select" id="ost-' + AK.esc(o.id) + '" data-ost="' + AK.esc(o.id) + '"' + (state.busyId === o.id ? ' disabled' : '') + ' aria-label="Order status for ' + AK.esc(o.code) + '">' +
        C.ORDER_STATUSES.map(function (s) {
          return '<option value="' + s + '"' + (o.status === s ? ' selected' : '') + '>' + (C.ORDER_STATUS_LABELS[s] || s) + '</option>';
        }).join('') +
        '</select></div>' +
        '</li>'
      );
    }).join('') + '</ul>';

    host.querySelectorAll('[data-of]').forEach(function (b) {
      b.addEventListener('click', function () {
        state.orderFilter = b.getAttribute('data-of');
        render();
      });
    });
    host.querySelectorAll('[data-ost]').forEach(function (sel) {
      sel.addEventListener('change', function () {
        var oid = sel.getAttribute('data-ost');
        var order = state.orders.find(function (o) { return o.id === oid; });
        var status = sel.value;
        state.busyId = oid;
        render();
        AK.db.from('orders').update({ status: status }).eq('id', oid).then(function (res) {
          state.busyId = null;
          if (res.error) AK.toast.error(errText(res.error));
          else AK.toast.success('Order ' + order.code + ' → ' + (C.ORDER_STATUS_LABELS[status] || status));
          refreshOrders();
          refreshProducts();
        });
      });
    });
  }

  /* ======================================================== SETTINGS TAB */
  function renderSettingsTab(host) {
    host.innerHTML =
      '<div style="max-width:34rem;"><div class="skel" style="height:18rem;border-radius:0.75rem;"></div></div>';

    AK.fetchSettings(true).then(function (map) {
      var s = AK.resolveShopSettings(map);
      var valueOf = function (k) { return map[k] === undefined || map[k] === null ? '' : String(map[k]); };

      host.innerHTML =
        '<div class="settings-card">' +
        '<div class="settings-block">' +
        '<p class="settings-h">Delivery fee</p>' +
        '<p class="hint">Leave empty while the fee is not decided — checkout will show “' + AK.esc(C.DELIVERY_NOTE_DEFAULT) + '” and never invent an amount.</p>' +
        '<div class="field" style="margin-top:0.75rem;"><label class="label" for="s-fee">Delivery fee (EGP)</label>' +
        '<input class="input" id="s-fee" type="number" inputmode="decimal" min="0" step="any" placeholder="Not configured" value="' + AK.esc(valueOf('delivery_fee')) + '" /></div>' +
        '<div class="field"><label class="label" for="s-note">Delivery note</label>' +
        '<input class="input" id="s-note" placeholder="' + AK.esc(C.DELIVERY_NOTE_DEFAULT) + '" value="' + AK.esc(valueOf('delivery_note')) + '" /></div>' +
        '</div>' +
        '<div class="settings-block">' +
        '<p class="settings-h">InstaPay payment details</p>' +
        '<p class="hint">Shown on checkout when a customer selects InstaPay. Leave empty until you are ready — checkout will tell customers the details will be shared on WhatsApp. Nothing is invented.</p>' +
        '<div class="field" style="margin-top:0.75rem;"><label class="label" for="s-ip-number">InstaPay number / address</label>' +
        '<input class="input" id="s-ip-number" placeholder="e.g., 01XXXXXXXXX" value="' + AK.esc(valueOf('instapay_number')) + '" /></div>' +
        '<div class="field"><label class="label" for="s-ip-handle">InstaPay handle (optional)</label>' +
        '<input class="input" id="s-ip-handle" placeholder="e.g., @antiquekhan" value="' + AK.esc(valueOf('instapay_handle')) + '" /></div>' +
        '<div class="field"><label class="label" for="s-ip-name">Account holder name (optional)</label>' +
        '<input class="input" id="s-ip-name" placeholder="Name shown to customers" value="' + AK.esc(valueOf('instapay_name')) + '" /></div>' +
        '</div>' +
        '<button type="button" class="btn btn--primary btn--h11" id="s-save"><span class="spin-btn">' + AK.icon('check') + 'Save Settings</span></button>' +
        '<p class="hint tx-center" style="margin-top:0.75rem;">Settings are stored in Supabase and applied on every device.</p>' +
        '</div>' +
        '<div class="settings-info">' +
        '<p class="settings-h">Current status</p>' +
        '<ul class="trust-list" style="margin-top:0.5rem;">' +
        '<li>' + AK.icon(s.deliveryFee !== null ? 'check' : 'circle-alert', 'ic--16 ic--accent') + '<span>Delivery fee: ' + (s.deliveryFee !== null ? AK.fmtEGP(s.deliveryFee) : 'not configured — customers see “' + AK.esc(s.deliveryNote) + '”') + '</span></li>' +
        '<li>' + AK.icon(s.instapayConfigured ? 'check' : 'circle-alert', 'ic--16 ic--accent') + '<span>InstaPay: ' + (s.instapayConfigured ? 'configured' : 'not configured — customers are told the details will be shared on WhatsApp') + '</span></li>' +
        '</ul></div>';

      document.getElementById('s-save').addEventListener('click', function () {
        var btn = document.getElementById('s-save');
        var feeRaw = document.getElementById('s-fee').value.trim();
        if (feeRaw && (!isFinite(Number(feeRaw)) || Number(feeRaw) < 0)) {
          AK.toast.error('Delivery fee must be a positive number (or empty)');
          return;
        }
        var rows = [
          { key: 'delivery_fee', value: feeRaw },
          { key: 'delivery_note', value: document.getElementById('s-note').value.trim() },
          { key: 'instapay_number', value: document.getElementById('s-ip-number').value.trim() },
          { key: 'instapay_handle', value: document.getElementById('s-ip-handle').value.trim() },
          { key: 'instapay_name', value: document.getElementById('s-ip-name').value.trim() },
        ];
        btn.disabled = true;
        btn.innerHTML = '<span class="spin-btn">' + spinnerSmall() + 'Saving…</span>';
        AK.db.from('settings').upsert(rows, { onConflict: 'key' }).then(function (res) {
          btn.disabled = false;
          btn.innerHTML = '<span class="spin-btn">' + AK.icon('check') + 'Save Settings</span>';
          if (res.error) AK.toast.error(errText(res.error));
          else {
            AK.toast.success('Settings saved');
            renderSettingsTab(host);
          }
        });
      });
    });
  }

  /* ================================================================== GATE */
  function render() {
    if (state.view === 'dashboard') renderDashboard();
    /* login/loading handled separately */
  }

  function boot() {
    if (!AK.isConfigured()) {
      view.innerHTML = '<div style="min-height:60vh;display:flex;align-items:center;justify-content:center;padding:1rem;">' +
        '<div class="config-banner" style="margin:0;max-width:28rem;">Supabase is not connected yet. Open <code>config.js</code> and paste your anon key, then reload. See README.md.</div></div>';
      return;
    }
    AK.getSession().then(function (session) {
      if (session) {
        state.view = 'dashboard';
        loadAll();
      } else {
        state.view = 'login';
        renderLogin();
      }
    });
  }

  boot();
})();
