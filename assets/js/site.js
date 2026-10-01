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
    var onScroll = function () { head.classList.toggle('scrolled', window.scrollY > 8); };
    addEventListener('scroll', onScroll, { passive: true });
    onScroll();
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
    var setMenu = function (open) {
      menu.classList.toggle('open', open);
      burger.setAttribute('aria-expanded', String(open));
      document.documentElement.style.overflow = open ? 'hidden' : '';
    };
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

  $$('.bcard').forEach(function (card) {
    if (card.classList.contains('bcard-photo')) return;    // its text is always out
    card.addEventListener('click', function () {
      var on = !card.classList.contains('on');
      card.classList.toggle('on', on);
      card.setAttribute('aria-expanded', String(on));
    });
  });

  /* ---------- the values ---------------------------------------------------
     One open at a time. The first is open in the markup, so the column has a
     shape before this runs and keeps one if it never does. */

  /* ---------- the product rail ---------------------------------------------
     The rail scrolls on its own; these two buttons move it a card at a time
     and grey themselves out at each end. */

  $$('.railbtn').forEach(function (btn) {
    var rail = document.getElementById(btn.dataset.rail);
    if (!rail) return;
    btn.addEventListener('click', function () {
      var card = rail.firstElementChild;
      var step = card ? card.getBoundingClientRect().width + 18 : 320;
      rail.scrollBy({ left: step * +btn.dataset.dir, behavior: 'smooth' });
    });
  });

  $$('.prodrail').forEach(function (rail) {
    var btns = $$('.railbtn[data-rail="' + rail.id + '"]');
    if (!btns.length) return;
    var sync = function () {
      var max = rail.scrollWidth - rail.clientWidth;
      btns.forEach(function (b) {
        b.disabled = +b.dataset.dir < 0 ? rail.scrollLeft < 4 : rail.scrollLeft > max - 4;
      });
    };
    rail.addEventListener('scroll', sync, { passive: true });
    addEventListener('resize', sync);
    sync();
  });

  /* ---------- where we source from -----------------------------------------
     A pin and its row in the register below are the same market, so lighting
     one lights the other. */

  var mapwrap = $('#mapwrap');
  if (mapwrap) {
    var rows = $$('.reg > div');
    var mark = function (region, on) {
      rows.forEach(function (r) {
        if (r.dataset.region === region) r.classList.toggle('on', on);
      });
    };
    $$('.pin', mapwrap).forEach(function (pin) {
      var region = pin.dataset.region;
      pin.addEventListener('mouseenter', function () { mark(region, true); });
      pin.addEventListener('mouseleave', function () { mark(region, false); });
      pin.addEventListener('focus', function () { mark(region, true); });
      pin.addEventListener('blur', function () { mark(region, false); });
      pin.addEventListener('click', function () {
        var on = !pin.classList.contains('on');
        $$('.pin', mapwrap).forEach(function (p) {
          p.classList.remove('on');
          mark(p.dataset.region, false);
        });
        pin.classList.toggle('on', on);
        mark(region, on);
      });
    });
  }

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

  var CONTACT_ENDPOINT = '/api/contact';

  var form = $('#form');
  if (form) {
    var status = $('#status');
    var say = function (msg, isError) {
      status.className = isError ? 'status err' : 'status';
      status.textContent = msg;
    };
    var areaSel = form.querySelector('select[name="area"]');

    /* A company page links here as /contact/?company=<slug>; start the
       dropdown on that company so the enquiry is routed to it. */
    try {
      var pre = new URLSearchParams(location.search).get('company');
      if (pre && areaSel && [].some.call(areaSel.options, function (o) { return o.value === pre; })) {
        areaSel.value = pre;
      }
    } catch (e) {}

    /* Build a mailto the visitor can simply send. */
    var handOff = function () {
      var to = form.getAttribute('data-mailto');
      if (!to) { say('Please email us directly.', true); return; }
      var f = {};
      new FormData(form).forEach(function (v, k) { f[k] = v; });
      // the option's visible label, not its routing code
      if (areaSel && areaSel.selectedIndex > -1) f.area = areaSel.options[areaSel.selectedIndex].textContent;
      var subject = 'Website enquiry' + (f.area ? ' — ' + f.area : '');
      var lines = [
        'Name: ' + (f.name || ''),
        'Company: ' + (f.company || ''),
        'Email: ' + (f.email || ''),
        'Phone: ' + (f.phone || ''),
        'Area of interest: ' + (f.area || ''),
        '', (f.message || '')
      ].join('\n');
      location.href = 'mailto:' + to +
        '?subject=' + encodeURIComponent(subject) +
        '&body=' + encodeURIComponent(lines);
      say('Opening your email app to send this to us.');
    };

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var missing = $$('[required]', form).filter(function (x) {
        return !x.value.trim() || (x.type === 'email' && !/^\S+@\S+\.\S+$/.test(x.value));
      })[0];

      if (missing) {
        say(missing.type === 'email'
          ? 'Enter a valid email address, like name@company.qa.'
          : 'Fill in your name, email and message to send.', true);
        missing.focus();
        return;
      }

      if (!CONTACT_ENDPOINT) { handOff(); return; }

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
        /* Do not make them retype it — open their mail client with the
           message already filled in. */
        say('We could not send that. Opening your email app instead.', true);
        setTimeout(handOff, 900);
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
