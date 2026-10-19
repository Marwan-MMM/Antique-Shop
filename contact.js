/* ============================================================================
   Antique Khan — contact.js (contact.html)
   Official business contact details + the official About introduction.
============================================================================ */
(function () {
  'use strict';

  var B = window.AK_CONFIG.BRAND;
  var root = document.getElementById('contact-root');
  AK.mountChrome(null);

  root.innerHTML =
    '<div class="container" style="padding-top:2.5rem;padding-bottom:3.5rem;">' +
    '<div class="section-head"><div><p class="eyebrow">Get in Touch</p><h2 class="section-head__title">Contact Antique Khan</h2></div></div>' +
    '<p class="count-line" style="margin-top:-0.75rem;max-width:36rem;">Questions about a piece, an order or delivery? We would love to hear from you.</p>' +
    '<div class="contact-card" style="margin-top:1.5rem;">' +
    '<div>' +
    '<ul class="contact-list" style="margin-top:0;">' +
    '<li>' + AK.icon('map-pin', 'ic--16 ic--accent') + '<span style="color:color-mix(in srgb, var(--foreground) 90%, transparent);">' + AK.esc(B.address) + '</span></li>' +
    '<li>' + AK.icon('phone', 'ic--16 ic--accent') + '<a href="tel:' + AK.esc(B.phoneHref) + '">' + AK.esc(B.phoneDisplay) + '</a></li>' +
    '<li>' + AK.icon('message-circle', 'ic--16 ic--accent') + '<a target="_blank" rel="noopener noreferrer" href="' + AK.waLink('Hello Antique Khan!') + '">WhatsApp: wa.me/201200057054</a></li>' +
    '<li>' + AK.icon('mail', 'ic--16 ic--accent') + '<a href="mailto:' + AK.esc(B.email) + '" style="overflow-wrap:break-word;">' + AK.esc(B.email) + '</a></li>' +
    '<li>' + AK.icon('instagram', 'ic--16 ic--accent') + '<a target="_blank" rel="noopener noreferrer" href="' + AK.esc(B.instagram) + '" style="overflow-wrap:break-word;">instagram.com/Antiquekhan.EG</a></li>' +
    '<li>' + AK.icon('facebook', 'ic--16 ic--accent') + '<a target="_blank" rel="noopener noreferrer" href="' + AK.esc(B.facebook) + '" style="overflow-wrap:break-word;">facebook.com/AntiqueKhan.Egypt</a></li>' +
    (B.hours ? '<li>' + AK.icon('clock', 'ic--16 ic--accent') + '<span style="color:color-mix(in srgb, var(--foreground) 90%, transparent);">' + AK.esc(B.hours) + '</span></li>' : '') +
    '</ul>' +
    '</div>' +
    '<div class="contact-wa">' +
    '<p class="contact-wa__t">Questions about a piece?</p>' +
    '<p class="contact-wa__s">Message us on WhatsApp — we reply quickly.</p>' +
    '<a class="btn-wa" target="_blank" rel="noreferrer" href="' + AK.waLink('Hello Antique Khan! I have a question about a piece.') + '">' + AK.icon('message-circle') + 'Chat on WhatsApp</a>' +
    '<a class="btn btn--outline btn--h12 btn--block btn--15" href="tel:' + AK.esc(B.phoneHref) + '">Call us</a>' +
    '<a class="btn btn--outline btn--h12 btn--block btn--15" href="mailto:' + AK.esc(B.email) + '">' + AK.icon('mail') + 'Email us</a>' +
    '<a class="btn btn--outline btn--h12 btn--block btn--15" target="_blank" rel="noopener noreferrer" href="' + AK.esc(B.instagram) + '">' + AK.icon('instagram') + 'Follow on Instagram</a>' +
    '<a class="btn btn--outline btn--h12 btn--block btn--15" target="_blank" rel="noopener noreferrer" href="' + AK.esc(B.facebook) + '">' + AK.icon('facebook') + 'Find us on Facebook</a>' +
    '</div>' +
    '</div>' +
    '<div class="about-block" style="margin-top:2.5rem;">' +
    '<div class="section-head"><div><p class="eyebrow">Our Story</p><h2 class="section-head__title">About Antique Khan</h2></div></div>' +
    '<p class="about-text">' + AK.esc(B.about) + '</p>' +
    '<p class="about-text about-text--muted">' + AK.esc(B.sloganLines.join(' · ')) + ' — ' + AK.esc(B.sloganNote) + '</p>' +
    '</div>' +
    '</div>';
})();
