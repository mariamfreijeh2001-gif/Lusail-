/* ==========================================================================
   Lusail Corp — site behaviour.

   Every interaction here has a resting state that works without it: the
   panels are open in the markup where it matters, the map is a picture, the
   figures are already written out. This layer only makes them move.
   ========================================================================== */

(function () {
  'use strict';

  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var still = matchMedia('(prefers-reduced-motion: reduce)');

  /* Nothing is hidden for the sake of an animation until this line proves
     the script is running and can put it back. */
  document.documentElement.classList.add('js');

  /* ---------- the bar ------------------------------------------------------
     Over the home photograph it starts transparent; a few pixels of scroll
     fills it in so the links stay legible against whatever is behind them. */

  var head = $('.site-head');
  if (head) {
    var onHeadScroll = function () { head.classList.toggle('scrolled', window.scrollY > 8); };
    addEventListener('scroll', onHeadScroll, { passive: true });
    onHeadScroll();
  }

  /* ---------- the sectors panel -------------------------------------------
     Opens on hover with a pointer, on click or Enter without one, and closes
     on Escape or on a click outside. */

  var navwrap = $('#navwrap'), secBtn = $('#secBtn');
  if (navwrap && secBtn) {
    var shut;
    var setSec = function (open) {
      clearTimeout(shut);
      navwrap.classList.toggle('open', open);
      secBtn.setAttribute('aria-expanded', String(open));
    };
    /* The panel hangs below the bar, so the pointer has to cross a strip of
       header to reach it. Closing on the first mouseleave would shut the menu
       on the way down, so leaving starts a short grace period instead and
       coming back cancels it. */
    var leave = function () {
      clearTimeout(shut);
      shut = setTimeout(function () { setSec(false); }, 260);
    };

    secBtn.addEventListener('click', function (e) {
      e.preventDefault();
      setSec(secBtn.getAttribute('aria-expanded') !== 'true');
    });
    if (matchMedia('(hover: hover)').matches) {
      navwrap.addEventListener('mouseenter', function () { setSec(true); });
      navwrap.addEventListener('mouseleave', leave);
      /* the strip of bar between the button and the panel counts as being on
         the way there, not as having left */
      if (head) {
        head.addEventListener('mouseleave', leave);
        head.addEventListener('mouseenter', function () { clearTimeout(shut); });
      }
    }
    navwrap.addEventListener('focusout', function (e) {
      if (!navwrap.contains(e.relatedTarget)) setSec(false);
    });
    document.addEventListener('click', function (e) {
      if (!navwrap.contains(e.target)) setSec(false);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && navwrap.classList.contains('open')) { setSec(false); secBtn.focus(); }
    });
  }

  /* ---------- the small-screen menu ---------------------------------------- */

  var burger = $('#burger'), menu = $('#menu');
  if (burger && menu) {
    var behind = [$('#main'), $('.site-foot')];
    var setMenu = function (open) {
      menu.classList.toggle('open', open);
      burger.setAttribute('aria-expanded', String(open));
      document.documentElement.style.overflow = open ? 'hidden' : '';
      /* The page behind a full-screen menu is off the screen and invisible,
         and tabbing past the last link used to walk straight into it. */
      behind.forEach(function (el) { if (el) el.inert = open; });
      /* Focus stays on the button that opened it. That button is the one that
         closes it again, it is inside the cycle below, and Escape returns
         here anyway — so the first Tab goes into the menu and nothing has to
         be moved about while the panel is still fading in. */
    };
    /* `inert` does the work where it is supported; this keeps the cycle
       closed where it is not, and keeps the burger in it either way, since
       it is the control that closes the thing. */
    var trap = function (e) {
      if (e.key !== 'Tab' || !menu.classList.contains('open')) return;
      var stops = [burger].concat($$('a[href],button:not([disabled])', menu))
        .filter(function (el) { return el.offsetWidth || el.offsetHeight; });
      if (stops.length < 2) return;
      var first = stops[0], last = stops[stops.length - 1];
      if (e.shiftKey && document.activeElement === first) { last.focus(); e.preventDefault(); }
      else if (!e.shiftKey && document.activeElement === last) { first.focus(); e.preventDefault(); }
    };
    document.addEventListener('keydown', trap);
    burger.addEventListener('click', function () {
      setMenu(burger.getAttribute('aria-expanded') !== 'true');
    });
    menu.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && menu.classList.contains('open')) { setMenu(false); burger.focus(); }
    });
    addEventListener('resize', function () {
      if (innerWidth > 1080 && menu.classList.contains('open')) setMenu(false);
    });
  }

  /* ---------- what makes it a group ----------------------------------------
     The reasoning opens on hover in CSS. This adds the same on a tap, and
     keeps aria-expanded honest for anyone listening. */

  $$('.bcard-btn').forEach(function (btn) {
    var card = btn.closest('.bcard');
    var set = function (on) {
      card.classList.toggle('on', on);
      btn.setAttribute('aria-expanded', String(on));
    };
    btn.addEventListener('click', function () { set(!card.classList.contains('on')); });
    /* Escape puts it away again without reaching for the pointer. */
    card.addEventListener('keydown', function (e) {
      if ((e.key === 'Escape' || e.key === 'Esc') && card.classList.contains('on')) {
        set(false); btn.focus(); e.stopPropagation();
      }
    });
  });

  /* ---------- the values ---------------------------------------------------
     One open at a time. The first is open in the markup, so the column has a
     shape before this runs and keeps one if it never does. */



  /* ---------- the four figures ---------------------------------------------
     They are written into the HTML, so they are right before this runs and
     right if it never does. This only counts them up the first time they
     come into view. */

  var stats = $('#stats');
  if (stats && !still.matches && 'IntersectionObserver' in window) {
    var run = function () {
      $$('dd', stats).forEach(function (el) {
        var raw = el.dataset.to || el.textContent;
        var m = raw.match(/^(\d+)(.*)$/);
        if (!m) return;
        var end = +m[1], suffix = m[2], t0 = 0;
        var step = function (ts) {
          if (!t0) t0 = ts;
          var p = Math.min(1, (ts - t0) / 900);
          var eased = 1 - Math.pow(1 - p, 3);
          el.textContent = Math.round(end * eased) + suffix;
          if (p < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      });
    };
    var so = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { run(); so.disconnect(); } });
    }, { threshold: .4 });
    so.observe(stats);
  }

  /* ---------- arrival -------------------------------------------------------
     Each band lifts in once. Without an observer, or with reduced motion,
     everything is simply already there. */

  var rise = $$('.rise');
  if (rise.length) {
    if (still.matches || !('IntersectionObserver' in window)) {
      rise.forEach(function (el) { el.classList.add('in'); });
    } else {
      var ro = new IntersectionObserver(function (es) {
        es.forEach(function (e) {
          /* Arriving by anchor, or jumping down the page, leaves bands above
             the viewport that never intersect. Anything already passed is
             simply there. */
          if (!e.isIntersecting && e.boundingClientRect.top > 0) return;
          e.target.classList.add('in');
          ro.unobserve(e.target);
        });
      }, { rootMargin: '0px 0px -8% 0px', threshold: .12 });
      rise.forEach(function (el) { ro.observe(el); });
    }
  }

  /* ---------- contact form -----------------------------------------------
     Posts to the serverless function in api/contact.js, which relays through
     Resend. If it is unreachable, or CONTACT_ENDPOINT is emptied, the form
     falls back to the visitor's mail client, so an enquiry is never lost. */

  /* The form posts JSON to the serverless function in api/contact.js, which
     relays through Resend. Until the key is set there the request fails and
     the form says so — it never claims to have sent anything it has not. */
  var CONTACT_ENDPOINT = '/api/contact';

  var form = $('#form');
  if (form) {
    var status = $('#status');
    var say = function (msg, isError) {
      status.className = isError ? 'status err' : 'status';
      status.textContent = msg;
    };
    var areaSel = form.querySelector('select[name="area"]');
    var MAIL = form.getAttribute('data-mail') || 'us';

    /* A company page links here as /contact/?company=<slug>; start the
       dropdown on that company so the enquiry is routed to it. */
    try {
      var pre = new URLSearchParams(location.search).get('company');
      if (pre && areaSel && [].some.call(areaSel.options, function (o) { return o.value === pre; })) {
        areaSel.value = pre;
      }
    } catch (e) {}

    /* What is wrong is said beside the field it is wrong about, and names
       only that field. The status line repeats it for a screen reader, but
       the eye needs it where the focus is about to land. */
    var WHY = {
      fName: 'Tell us your name.',
      fMsg: 'Write a line about what you need, so we can send it to the right company.'
    };
    var fault = function (el) {
      if (el.type !== 'email') return WHY[el.id] || 'This one is needed.';
      return el.value.trim()
        ? 'That does not look like an email address. Try name@company.qa.'
        : 'Enter your email address, so we have somewhere to reply to.';
    };
    var required = $$('[required]', form);
    var clearFault = function (el) {
      el.removeAttribute('aria-invalid');
      var slot = document.getElementById(el.id + '-err');
      if (slot) slot.textContent = '';
    };
    required.forEach(function (el) {
      el.addEventListener('input', function () { clearFault(el); });
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      required.forEach(clearFault);

      var missing = required.filter(function (x) {
        return !x.value.trim() || (x.type === 'email' && !/^\S+@\S+\.\S+$/.test(x.value));
      })[0];

      if (missing) {
        var why = fault(missing);
        missing.setAttribute('aria-invalid', 'true');
        var slot = document.getElementById(missing.id + '-err');
        if (slot) slot.textContent = why;
        say(why, true);
        missing.focus();
        return;
      }

      var btn = form.querySelector('button[type="submit"]');
      btn.disabled = true;
      say('Sending…');

      var body = {};
      new FormData(form).forEach(function (v, k) { body[k] = v; });

      fetch(CONTACT_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(body)
      }).then(function (res) {
        if (!res.ok) throw new Error(res.status);
        say('Message sent. We reply within two working days.');
        form.reset();
      }).catch(function () {
        /* The form is not cleared, so nothing they typed is lost and Send
           can simply be pressed again. The address is on this page already,
           under Channels, for anyone who would rather not wait. */
        say('That did not send. Try again, or email us at ' + MAIL + '.', true);
      }).then(function () {
        btn.disabled = false;
      });
    });
  }
  /* ---- the sectors index tracks the reading -----------------------------
     The index at the left of /sectors/ marks whichever sector is on screen.
     The mark is driven from scroll position rather than from clicks, so it
     is right however you arrived — a link from elsewhere, the back button,
     or simply scrolling. Without script every entry stays a plain jump link
     and the first keeps the mark the HTML gave it, which is still true.

     The sector whose top has most recently passed the line is the one you
     are reading, and it keeps the mark until the next one arrives — however
     long it takes to read. Before any has passed, the first sector holds it.
     The line sits below whatever is pinned at the top of the window, which
     is the bar on a wide screen and the bar plus the index on a narrow one,
     where the index lies on its side as a strip. Measuring it rather than
     assuming it keeps the mark honest at both shapes. */
  var rail = document.querySelector('.secrail');
  var idx = document.querySelector('.secidx');
  if (rail) {
    var entries = [];
    [].forEach.call(rail.querySelectorAll('a[href^="#"]'), function (a) {
      var sec = document.getElementById(a.getAttribute('href').slice(1));
      if (sec) entries.push({ a: a, sec: sec });
    });
    var strip = rail.querySelector('ol');

    var bar = parseInt(getComputedStyle(document.documentElement)
      .getPropertyValue('--head-h'), 10) || 104;
    var sideways = false, line = bar + 40;
    var remeasure = function () {
      sideways = getComputedStyle(strip).display === 'flex';
      line = bar + (sideways ? rail.offsetHeight : 0) + 40;
    };

    /* On a narrow screen the marked sector can be off the end of the strip.
       Nudge the strip itself — never the page, which is already where the
       reader put it. */
    var reveal = function (a) {
      if (!sideways || strip.scrollWidth <= strip.clientWidth) return;
      var l = a.offsetLeft, r = l + a.offsetWidth;
      if (l < strip.scrollLeft) strip.scrollLeft = l;
      else if (r > strip.scrollLeft + strip.clientWidth) strip.scrollLeft = r - strip.clientWidth;
    };

    var marked = null;
    var pick = function () {
      var best = entries[0], top = -Infinity;
      entries.forEach(function (e) {
        var y = e.sec.getBoundingClientRect().top - line;
        if (y <= 0 && y > top) { top = y; best = e; }
      });
      if (best === marked) return;
      marked = best;
      entries.forEach(function (e) {
        if (e === best) e.a.setAttribute('aria-current', 'location');
        else e.a.removeAttribute('aria-current');
      });
      /* The ground belongs to the whole index rather than to each block, so
         moving between sectors washes the colour across instead of cutting to
         it. Without this the page keeps the first tone, which is a real page. */
      if (idx && best.sec.dataset.tone) idx.setAttribute('data-tone', best.sec.dataset.tone);
      reveal(best.a);
    };

    if (entries.length) {
      var tick = false;
      var onScroll = function () {
        if (tick) return;
        tick = true;
        requestAnimationFrame(function () { pick(); tick = false; });
      };
      addEventListener('scroll', onScroll, { passive: true });
      addEventListener('resize', function () { remeasure(); marked = null; onScroll(); });
      remeasure();
      pick();
    }
  }
})();
