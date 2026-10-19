/* ============================================================================
   Antique Khan — shop.js (shop.html)
   Filters/sort live in the URL (?cat=&min=&max=&sort=&q=) exactly like the
   original hash-query approach, updated with pushState (no reload).
============================================================================ */
(function () {
  'use strict';

  var C = window.AK_CONFIG;
  var root = document.getElementById('shop-root');

  AK.mountChrome('shop');

  root.innerHTML =
    '<div class="container" style="padding-top:1.5rem;padding-bottom:2.5rem;">' +
    '<div class="section-head"><div><p class="eyebrow">The Collection</p><h2 class="section-head__title">Shop Antiques</h2></div></div>' +
    '<p class="count-line" aria-live="polite" id="count-line"></p>' +
    '<div class="controls-row">' +
    '<button type="button" class="btn btn--outline btn--h10" id="filter-btn">' + AK.icon('sliders-horizontal') + 'Filters<span class="filter-count" id="filter-count" hidden></span></button>' +
    '<select class="select" id="sort-select" aria-label="Sort products"></select>' +
    '<p class="controls-row__hint" id="hint"></p>' +
    '</div>' +
    '<div class="active-filters" id="active-filters"></div>' +
    '<div style="margin-top:1.5rem;" id="results"></div>' +
    '</div>' +
    '<div style="margin-top:3rem;" id="pastgems-host"><div class="container"><div id="pastgems"></div></div></div>';

  var els = {
    countLine: document.getElementById('count-line'),
    filterBtn: document.getElementById('filter-btn'),
    filterCount: document.getElementById('filter-count'),
    sort: document.getElementById('sort-select'),
    hint: document.getElementById('hint'),
    chips: document.getElementById('active-filters'),
    results: document.getElementById('results'),
    pastgems: document.getElementById('pastgems'),
    pastgemsHost: document.getElementById('pastgems-host'),
  };

  /* sort select */
  els.sort.innerHTML = C.SORT_OPTIONS.map(function (o) {
    return '<option value="' + o.value + '">' + AK.esc(o.label) + '</option>';
  }).join('');

  function getParams() {
    var sp = new URLSearchParams(window.location.search);
    return {
      cat: sp.get('cat') || '',
      min: sp.get('min') || '',
      max: sp.get('max') || '',
      sort: sp.get('sort') || 'newest',
      q: sp.get('q') || '',
    };
  }

  function buildQuery(p, keep) {
    var sp = new URLSearchParams();
    var src = keep || p;
    if (src.cat) sp.set('cat', src.cat);
    if (src.min) sp.set('min', src.min);
    if (src.max) sp.set('max', src.max);
    if (src.sort && src.sort !== 'newest') sp.set('sort', src.sort);
    if (src.q) sp.set('q', src.q);
    var s = sp.toString();
    return s ? '?' + s : '';
  }

  function pushParams(next) {
    var url = 'shop.html' + buildQuery(next);
    history.pushState({}, '', url);
    render();
  }

  els.sort.value = getParams().sort;
  els.sort.addEventListener('change', function () {
    var p = getParams();
    p.sort = els.sort.value;
    pushParams(p);
  });
  window.addEventListener('popstate', function () {
    els.sort.value = getParams().sort;
    render();
  });

  /* filter sheet ------------------------------------------------------------ */
  els.filterBtn.addEventListener('click', function () {
    var p = getParams();
    AK.openSheet({
      side: 'bottom',
      title: 'Filters',
      description: 'Refine the collection',
      build: function (body, close) {
        body.innerHTML =
          '<div class="filter-body">' +
          '<fieldset class="filter-set"><span class="filter-legend">Category</span>' +
          '<div style="display:flex;flex-direction:column;gap:0.5rem;" role="radiogroup" aria-label="Category">' +
          radioRow('cat-all', '', 'All categories', p.cat) +
          C.CATEGORIES.map(function (c, ci) { return radioRow('cat-' + ci, c, c, p.cat); }).join('') +
          '</div></fieldset>' +
          '<fieldset class="filter-set"><span class="filter-legend">Price (EGP)</span>' +
          '<div class="price-row">' +
          '<div><span class="hint">Min</span><input class="input" id="price-min" type="number" inputmode="numeric" min="0" placeholder="0" value="' + AK.esc(p.min) + '" /></div>' +
          '<span class="price-row__dash" aria-hidden="true">–</span>' +
          '<div><span class="hint">Max</span><input class="input" id="price-max" type="number" inputmode="numeric" min="0" placeholder="9,999+" value="' + AK.esc(p.max) + '" /></div>' +
          '</div><p class="hint" style="margin-top:0.5rem;">Leave empty for no limit</p></fieldset>' +
          '</div>' +
          '<div class="filter-foot">' +
          '<button type="button" class="btn btn--outline" id="fl-reset">Reset</button>' +
          '<button type="button" class="btn btn--primary" id="fl-apply">Show Results</button>' +
          '</div>';

        function radioRow(id, value, label, current) {
          return (
            '<label class="radio-row" for="' + id + '">' +
            '<input type="radio" class="radio-dot" id="' + id + '" name="fcat" value="' + AK.esc(value) + '"' + (current === value ? ' checked' : '') + ' />' +
            '<span>' + AK.esc(label) + '</span></label>'
          );
        }

        body.querySelector('#fl-reset').addEventListener('click', function () {
          var all = body.querySelector('#cat-all');
          if (all) all.checked = true;
          body.querySelector('#price-min').value = '';
          body.querySelector('#price-max').value = '';
        });
        body.querySelector('#fl-apply').addEventListener('click', function () {
          var catEl = body.querySelector('input[name="fcat"]:checked');
          var next = {
            cat: catEl ? catEl.value : '',
            min: body.querySelector('#price-min').value.trim(),
            max: body.querySelector('#price-max').value.trim(),
            sort: p.sort,
            q: p.q,
          };
          close();
          pushParams(next);
        });
      },
    });
  });

  /* active filter chips ------------------------------------------------------ */
  function clearOne(key) {
    var p = getParams();
    if (key === 'cat') p.cat = '';
    if (key === 'min') p.min = '';
    if (key === 'max') p.max = '';
    pushParams(p);
  }

  function renderChips(p) {
    var n = [p.cat, p.min, p.max].filter(Boolean).length;
    els.filterCount.textContent = n;
    els.filterCount.hidden = n === 0;
    if (!n) { els.chips.innerHTML = ''; return; }
    var html = '';
    if (p.cat) html += chip('Category: ' + p.cat, 'cat', 'Clear category filter');
    if (p.min) html += chip('Min: EGP ' + p.min, 'min', 'Clear minimum price filter');
    if (p.max) html += chip('Max: EGP ' + p.max, 'max', 'Clear maximum price filter');
    els.chips.innerHTML = html;
    els.chips.querySelectorAll('[data-clear]').forEach(function (b) {
      b.addEventListener('click', function () { clearOne(b.getAttribute('data-clear')); });
    });
    function chip(label, key, aria) {
      return (
        '<span class="afchip">' + AK.esc(label) +
        '<button type="button" data-clear="' + key + '" aria-label="' + aria + '">' + AK.icon('x') + '</button></span>'
      );
    }
  }

  /* results ------------------------------------------------------------------ */
  var seq = 0;

  function render() {
    var p = getParams();
    els.sort.value = p.sort;
    renderChips(p);
    var my = ++seq;
    els.results.innerHTML = AK.gridSkeleton('grid-skel--md3 grid-skel--md4', 8);
    els.countLine.innerHTML = '<span class="skel" style="display:inline-block;height:1rem;width:9rem;"></span>';

    AK.fetchProducts({
      status: 'active',
      category: p.cat || undefined,
      sort: p.sort,
      q: p.q || undefined,
      minPrice: p.min,
      maxPrice: p.max,
    }).then(function (res) {
      if (my !== seq) return; // superseded by a newer request
      if (res.error) {
        els.countLine.textContent = 'Could not load pieces';
        els.results.innerHTML = AK.emptyState('circle-alert', 'Something went wrong', "We couldn't load the collection. Please try again.",
          '<div style="display:flex;justify-content:center;"><button type="button" class="btn btn--outline btn--h11" data-retry="1">Retry</button></div>');
        return;
      }
      var products = res.products;
      els.countLine.textContent = products.length + ' piece' + (products.length === 1 ? '' : 's') + ' available';
      els.hint.textContent = products.length + ' result' + (products.length === 1 ? '' : 's');
      if (products.length === 0) {
        els.results.innerHTML = AK.emptyState('search-x', 'No antiques match', 'Try adjusting your filters.',
          '<div style="display:flex;justify-content:center;"><button type="button" class="btn btn--primary btn--h11" data-clearall="1">Clear filters</button></div>');
        return;
      }
      els.results.innerHTML =
        '<div class="grid-products grid-products--md3 grid-products--lg4">' +
        products.map(function (pr, i) { return AK.productCard(pr, i < 4); }).join('') +
        '</div>';
    });
  }

  root.addEventListener('click', function (e) {
    if (e.target.closest('[data-retry]')) render();
    if (e.target.closest('[data-clearall]')) {
      var p = getParams();
      pushParams({ cat: '', min: '', max: '', sort: p.sort, q: p.q });
    }
  });

  /* past gems ------------------------------------------------------------------ */
  function loadPastGems() {
    AK.fetchProducts({ status: 'sold', sort: 'newest' }).then(function (res) {
      if (res.error || res.products.length === 0) {
        els.pastgemsHost.style.display = 'none'; // hidden while empty (as the original)
        return;
      }
      var items = res.products;
      var stack = items.slice(0, 5).map(function (p) {
        var url = AK.mainImage(p);
        return url
          ? '<img src="' + AK.esc(url) + '" alt="' + AK.esc(p.title) + '" loading="lazy" decoding="async" draggable="false" onerror="AK.imgFail(this)" />'
          : '';
      }).join('');
      if (items.length > 5) stack += '<span class="pastgems__more">+' + (items.length - 5) + '</span>';

      els.pastgems.innerHTML =
        '<div class="pastgems">' +
        '<button type="button" class="pastgems__head" aria-expanded="false" id="pg-head">' +
        '<span><span class="pastgems__eyebrow">The Archive</span>' +
        '<span class="pastgems__title">Past Gems of Antique Khan</span>' +
        '<span class="pastgems__sub">' + items.length + ' treasure' + (items.length === 1 ? '' : 's') + ' that found new homes</span></span>' +
        AK.icon('chevron-down', 'pastgems__chev') +
        '</button>' +
        '<div id="pg-body"><div class="pastgems__stack">' + stack + '</div></div>' +
        '</div>';

      var open = false;
      document.getElementById('pg-head').addEventListener('click', function () {
        open = !open;
        this.setAttribute('aria-expanded', String(open));
        document.getElementById('pg-body').innerHTML = open
          ? '<div style="margin-top:1rem;"><p class="pastgems__note">Every piece is one of a kind — when it sells, it joins our archive. Similar pieces can be sourced on request.</p>' +
            '<div class="grid-products grid-products--md3">' + items.map(function (p) { return AK.productCard(p); }).join('') + '</div></div>'
          : '<div class="pastgems__stack">' + stack + '</div>';
      });
    });
  }

  render();
  if (AK.isConfigured()) loadPastGems();
  else els.pastgemsHost.style.display = 'none';
})();
