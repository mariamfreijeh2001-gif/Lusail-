/* ==========================================================================
   Lusail Corp — site behaviour.
   Language, header, mega menu, company filter, contact form.
   ========================================================================== */

(function () {
  'use strict';

  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  /* ---------- language ---------------------------------------------------
     Every translatable node carries English as its content and Arabic in
     data-ar. The first switch stores the English so it can come back. */

  var lang = document.documentElement.lang === 'ar' ? 'ar' : 'en';
  var T = function (en, ar) { return lang === 'ar' ? ar : en; };

  function setLang(l) {
    lang = l;
    document.documentElement.lang = l;
    document.documentElement.dir = l === 'ar' ? 'rtl' : 'ltr';

    $$('[data-ar]').forEach(function (el) {
      if (el.dataset.en === undefined) el.dataset.en = el.textContent;
      el.textContent = l === 'ar' ? el.dataset.ar : el.dataset.en;
    });

    var btn = $('#langBtn');
    if (btn) {
      btn.textContent = l === 'ar' ? 'English' : 'عربي';
      btn.setAttribute('aria-label', l === 'ar' ? 'Switch to English' : 'التبديل إلى العربية');
    }
    if (typeof refreshCount === 'function') refreshCount();
    try { localStorage.setItem('lc-lang', l); } catch (e) {}
  }

  var langBtn = $('#langBtn');
  if (langBtn) langBtn.addEventListener('click', function () { setLang(lang === 'en' ? 'ar' : 'en'); });

  /* ---------- header ----------------------------------------------------- */

  var head = $('.site-head');
  if (head) {
    var onScroll = function () { head.classList.toggle('scrolled', window.scrollY > 8); };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  var menuBtn = $('#menuBtn'), nav = $('#nav');
  if (menuBtn && nav) {
    menuBtn.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      menuBtn.setAttribute('aria-expanded', String(open));
    });
    nav.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') {
        nav.classList.remove('open');
        menuBtn.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ---------- mega menu ---------------------------------------------------
     Opens on hover and on keyboard focus; closes on leave, Escape, or focus
     moving out. Never opens on touch, where the link should just navigate. */

  var mega = $('#mega'), megaLink = $('[data-mega]');
  if (mega && megaLink && window.matchMedia('(hover: hover)').matches) {
    var closeTimer;
    var openMega = function () {
      clearTimeout(closeTimer);
      mega.hidden = false;
      megaLink.setAttribute('aria-expanded', 'true');
    };
    var closeMega = function (now) {
      clearTimeout(closeTimer);
      closeTimer = setTimeout(function () {
        mega.hidden = true;
        megaLink.setAttribute('aria-expanded', 'false');
      }, now ? 0 : 140);
    };

    megaLink.addEventListener('mouseenter', openMega);
    megaLink.addEventListener('focus', openMega);
    megaLink.addEventListener('mouseleave', function () { closeMega(); });
    mega.addEventListener('mouseenter', openMega);
    mega.addEventListener('mouseleave', function () { closeMega(); });
    mega.addEventListener('focusin', openMega);

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !mega.hidden) { closeMega(true); megaLink.focus(); }
    });
    document.addEventListener('focusin', function (e) {
      if (!mega.hidden && !mega.contains(e.target) && e.target !== megaLink) closeMega(true);
    });
  }

  /* ---------- sector marquee ----------------------------------------------
     The cards move on their own. WCAG 2.2.2 asks for a way to stop motion
     that runs longer than five seconds, so besides pausing on hover and on
     keyboard focus (both CSS), this is a real control. Under
     prefers-reduced-motion the track never animates and the button is
     hidden, so there is nothing to stop. */

  var mq = $('#mq'), mqBtn = $('#mqBtn');
  if (mq && mqBtn) {
    var label = mqBtn.querySelector('span:last-child');
    mqBtn.addEventListener('click', function () {
      var paused = mq.dataset.paused !== 'true';
      mq.dataset.paused = String(paused);
      mqBtn.setAttribute('aria-pressed', String(paused));
      var en = paused ? 'Play' : 'Pause';
      var ar = paused ? 'تشغيل' : 'إيقاف';
      label.dataset.en = en;
      label.dataset.ar = ar;
      label.textContent = T(en, ar);
    });
  }

  /* ---------- company filter ---------------------------------------------
     One list of every company, sliced by sector without a page reload. */

  var grid = $('#coGrid'), countEl = $('#count'), emptyEl = $('#empty');
  var refreshCount;

  if (grid) {
    var chips = $$('.chip');
    var cards = $$('a[data-sector]', grid);
    var active = 'all';

    refreshCount = function () {
      var shown = cards.filter(function (c) { return !c.hidden; }).length;
      var label = chips.filter(function (c) { return c.dataset.filter === active; })[0];
      var secEn = '', secAr = '';
      if (label && active !== 'all') {
        var sp = label.querySelector('span');
        secEn = ' in ' + (sp.dataset.en || sp.textContent);
        secAr = ' في ' + (sp.dataset.ar || sp.textContent);
      }
      var en = active === 'all'
        ? 'Showing all ' + shown + ' companies'
        : 'Showing ' + shown + (shown === 1 ? ' company' : ' companies') + secEn;
      var ar = active === 'all'
        ? 'عرض جميع الشركات (' + shown + ')'
        : 'عرض ' + shown + (shown === 1 ? ' شركة' : ' شركات') + secAr;
      countEl.dataset.en = en;
      countEl.dataset.ar = ar;
      countEl.textContent = T(en, ar);
    };

    var filter = function (slug) {
      active = slug;
      cards.forEach(function (c) {
        c.hidden = !(slug === 'all' || c.dataset.sector === slug);
      });
      chips.forEach(function (c) {
        c.setAttribute('aria-pressed', String(c.dataset.filter === slug));
      });
      var shown = cards.filter(function (c) { return !c.hidden; }).length;
      if (emptyEl) emptyEl.hidden = shown > 0;
      refreshCount();

      // Keep the URL shareable: /companies/?sector=food
      try {
        var u = new URL(location.href);
        if (slug === 'all') u.searchParams.delete('sector');
        else u.searchParams.set('sector', slug);
        history.replaceState(null, '', u);
      } catch (e) {}
    };

    chips.forEach(function (c) {
      c.addEventListener('click', function () { filter(c.dataset.filter); });
    });

    // Honour ?sector= on load, so a filtered view can be linked to.
    var initial = 'all';
    try {
      var s = new URLSearchParams(location.search).get('sector');
      if (s && chips.some(function (c) { return c.dataset.filter === s; })) initial = s;
    } catch (e) {}
    if (initial !== 'all') filter(initial);
  }

  /* ---------- contact form -----------------------------------------------
     Set CONTACT_ENDPOINT to a URL that accepts a JSON POST to make this live.
     While it is empty the form validates and confirms but sends nothing. */

  var CONTACT_ENDPOINT = '';

  var form = $('#form');
  if (form) {
    var status = $('#status');
    var say = function (msg, isError) {
      status.className = isError ? 'status err' : 'status';
      status.textContent = msg;
    };

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var missing = $$('[required]', form).filter(function (x) {
        return !x.value.trim() || (x.type === 'email' && !/^\S+@\S+\.\S+$/.test(x.value));
      })[0];

      if (missing) {
        say(missing.type === 'email'
          ? T('Enter a valid email address, like name@company.qa.', 'أدخل بريداً إلكترونياً صحيحاً، مثل name@company.qa.')
          : T('Fill in your name, email and message to send.', 'أكمل الاسم والبريد الإلكتروني والرسالة للإرسال.'), true);
        missing.focus();
        return;
      }

      var sent = T('Message sent. We reply within two working days.', 'تم إرسال الرسالة. نرد خلال يومي عمل.');
      if (!CONTACT_ENDPOINT) { say(sent); form.reset(); return; }

      var btn = form.querySelector('button[type="submit"]');
      btn.disabled = true;
      say(T('Sending…', 'جارٍ الإرسال…'));

      var body = {};
      new FormData(form).forEach(function (v, k) { body[k] = v; });
      body.lang = lang;

      fetch(CONTACT_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(body)
      }).then(function (res) {
        if (!res.ok) throw new Error(res.status);
        say(sent); form.reset();
      }).catch(function () {
        say(T('We could not send that. Please email info@lusailcorp.qa instead.',
              'تعذّر الإرسال. يرجى مراسلتنا على info@lusailcorp.qa.'), true);
      }).then(function () {
        btn.disabled = false;
      });
    });
  }

  /* ---------- boot -------------------------------------------------------- */

  var saved = 'en';
  try {
    var q = new URLSearchParams(location.search).get('lang');
    saved = (q === 'ar' || q === 'en') ? q : (localStorage.getItem('lc-lang') || 'en');
  } catch (e) {}
  if (saved === 'ar') setLang('ar');
})();
