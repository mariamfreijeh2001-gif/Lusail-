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
    var setSec = function (open) {
      navwrap.classList.toggle('open', open);
      secBtn.setAttribute('aria-expanded', String(open));
    };
    secBtn.addEventListener('click', function (e) {
      e.preventDefault();
      setSec(secBtn.getAttribute('aria-expanded') !== 'true');
    });
    if (matchMedia('(hover: hover)').matches) {
      navwrap.addEventListener('mouseenter', function () { setSec(true); });
      navwrap.addEventListener('mouseleave', function () { setSec(false); });
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

  /* ---------- building more than a portfolio -------------------------------
     One panel open at a time. Clicking a closed one moves the opening to it;
     the open one stays open, so the row is never blank. */

  var ladder = $('#ladder');
  if (ladder) {
    var panels = $$('.lad', ladder);
    var openLad = function (i) {
      panels.forEach(function (p, k) { p.setAttribute('aria-expanded', String(k === i)); });
    };
    panels.forEach(function (p, i) {
      p.addEventListener('click', function () { openLad(i); });
      /* on a pointer it follows the cursor, which reads as one continuous
         object rather than four buttons */
      if (matchMedia('(hover: hover)').matches && innerWidth > 860) {
        p.addEventListener('mouseenter', function () { openLad(i); });
      }
      p.addEventListener('keydown', function (e) {
        var n = panels.length, j = null;
        if (e.key === 'ArrowRight') j = (i + 1) % n;
        else if (e.key === 'ArrowLeft') j = (i - 1 + n) % n;
        if (j !== null) { e.preventDefault(); openLad(j); panels[j].focus(); }
      });
    });
  }

  /* ---------- the values ---------------------------------------------------
     One open at a time. The first is open in the markup, so the column has a
     shape before this runs and keeps one if it never does. */

  var valacc = $('#valacc');
  if (valacc) {
    var vals = $$('.val', valacc);
    vals.forEach(function (item) {
      var btn = $('.val-btn', item);
      btn.addEventListener('click', function () {
        var open = !item.classList.contains('open');
        vals.forEach(function (o) {
          o.classList.remove('open');
          $('.val-btn', o).setAttribute('aria-expanded', 'false');
        });
        item.classList.toggle('open', open);
        btn.setAttribute('aria-expanded', String(open));
      });
    });
  }

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
})();
