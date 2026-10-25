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
     Transparent over the top of the page; a few pixels of scroll fill it in,
     the way TIBECO's does, so the words stay legible over any photograph. */

  var head = $('.site-head');
  if (head) {
    var onHeadScroll = function () { head.classList.toggle('scrolled', window.scrollY > 50); };
    addEventListener('scroll', onHeadScroll, { passive: true });
    onHeadScroll();
  }

  /* ---------- the drawers ---------------------------------------------------
     "Sectors" slides in from the left, "Corporate" from the right, over a
     dimmed page. Escape, the close button, the scrim or a link closes them,
     and focus returns to the control that opened them. The two controls are
     links to /sectors/ and /about/, so without script they still go
     somewhere. */

  var scrim = $('#scrim');
  var drawers = [['#drawerSecBtn', '#drawerSec'], ['#drawerCorpBtn', '#drawerCorp']]
    .map(function (p) { return { btn: $(p[0]), box: $(p[1]) }; })
    .filter(function (d) { return d.btn && d.box; });
  if (scrim && drawers.length) {
    var behind = [$('#main'), $('.site-foot'), $('#qf')];
    var openD = null;
    var setDrawer = function (d, open) {
      drawers.forEach(function (x) {
        var on = open && x === d;
        x.box.classList.toggle('open', on);
        x.box.setAttribute('aria-hidden', String(!on));
        x.btn.setAttribute('aria-expanded', String(on));
      });
      scrim.classList.toggle('open', open);
      document.documentElement.style.overflow = open ? 'hidden' : '';
      behind.forEach(function (el) { if (el) el.inert = open; });
      openD = open ? d : null;
      if (open) {
        var first = d.box.querySelector('a,button');
        if (first) first.focus();
      }
    };
    drawers.forEach(function (d) {
      d.box.setAttribute('aria-hidden', 'true');
      d.btn.addEventListener('click', function (e) { e.preventDefault(); setDrawer(d, openD !== d); });
      d.box.addEventListener('click', function (e) {
        if (e.target.closest('[data-close]')) { setDrawer(d, false); d.btn.focus(); }
        else if (e.target.closest('a')) setDrawer(d, false);
      });
      /* the cycle stays inside the open drawer */
      d.box.addEventListener('keydown', function (e) {
        if (e.key !== 'Tab') return;
        var stops = $$('a[href],button:not([disabled])', d.box).filter(function (el) { return el.offsetWidth || el.offsetHeight; });
        if (stops.length < 2) return;
        var first = stops[0], last = stops[stops.length - 1];
        if (e.shiftKey && document.activeElement === first) { last.focus(); e.preventDefault(); }
        else if (!e.shiftKey && document.activeElement === last) { first.focus(); e.preventDefault(); }
      });
    });
    scrim.addEventListener('click', function () { if (openD) setDrawer(openD, false); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && openD) { var b = openD.btn; setDrawer(openD, false); b.focus(); }
    });
  }

  /* ---------- the opening slideshow -----------------------------------------
     Six photographs behind the Group's name, one every five seconds; the
     dots say which, and pick one. Under reduced motion the first simply
     stays. */

  var hero = $('#hero');
  if (hero) {
    var slides = $$('.hero-slide', hero), dots = $$('.hero-dot', hero);
    var cur = 0, timer;
    var show = function (i) {
      cur = (i + slides.length) % slides.length;
      slides.forEach(function (el, k) { el.classList.toggle('on', k === cur); });
      dots.forEach(function (el, k) { el.classList.toggle('on', k === cur); el.setAttribute('aria-pressed', String(k === cur)); });
    };
    var start = function () {
      if (still.matches || slides.length < 2) return;
      clearInterval(timer);
      timer = setInterval(function () { show(cur + 1); }, 5000);
    };
    dots.forEach(function (d, k) { d.addEventListener('click', function () { show(k); start(); }); });
    document.addEventListener('visibilitychange', function () { if (document.hidden) clearInterval(timer); else start(); });
    show(0);
    start();
  }

  /* ---------- the sticky tabs on a sector page ----------------------------
     The tab of the section on screen is filled in gold. Driven from scroll
     position, so it is right however you arrived. */

  var stabs = $('#stabs');
  if (stabs) {
    var tabs = $$('a[href^="#"]', stabs).map(function (a) {
      return { a: a, sec: document.getElementById(a.getAttribute('href').slice(1)) };
    }).filter(function (t) { return t.sec; });
    var line = function () { return (head ? head.offsetHeight : 0) + stabs.offsetHeight + 24; };
    var markedTab = null;
    var pickTab = function () {
      var best = tabs[0], top = -Infinity, l = line();
      tabs.forEach(function (t) {
        var y = t.sec.getBoundingClientRect().top - l;
        if (y <= 0 && y > top) { top = y; best = t; }
      });
      if (best === markedTab) return;
      markedTab = best;
      tabs.forEach(function (t) { t.a.classList.toggle('on', t === best); });
    };
    if (tabs.length) {
      var tTick = false;
      addEventListener('scroll', function () {
        if (tTick) return;
        tTick = true;
        requestAnimationFrame(function () { pickTab(); tTick = false; });
      }, { passive: true });
      pickTab();
    }
  }

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

  /* ---------- forms -------------------------------------------------------
     Every form with data-form — the contact form, the partnership
     application and the small corner form — posts JSON to the serverless
     function in api/contact.js, which relays through Resend. Until the key is
     set there the request fails and the form says so — it never claims to
     have sent anything it has not — and offers the same words to the
     visitor's own mail program instead. */
  var CONTACT_ENDPOINT = '/api/contact';

  /* Spam, from this side. Every submission says how long the page had been
     open, which the function uses to drop anything "typed" in under a few
     seconds, and carries a Cloudflare Turnstile token where the site has a
     key: the widget is rendered into each form only once its script has
     arrived, is invisible unless a visitor looks like a bot, and is reset
     after every attempt because a token is good once. */
  var LOADED_AT = Date.now();
  var turnstileReady = function (fn) {
    if (window.turnstile) return fn();
    var n = 0, t = setInterval(function () { if (window.turnstile || ++n > 100) { clearInterval(t); if (window.turnstile) fn(); } }, 100);
  };
  $$('.turnstile').forEach(function (slot) {
    turnstileReady(function () {
      slot.setAttribute('data-widget', turnstile.render(slot, {
        sitekey: slot.getAttribute('data-sitekey'), size: 'flexible', appearance: 'interaction-only',
        theme: 'light', 'refresh-expired': 'auto'
      }));
    });
  });

  var setupForm = function (form) {
    var status = form.querySelector('.status');
    var say = function (msg, isError) {
      status.className = isError ? 'status err' : 'status';
      status.textContent = msg;
    };
    var MAIL = form.getAttribute('data-mail') || 'us';
    var kind = form.getAttribute('data-form');
    var areaSel = form.querySelector('select[name="area"]');

    /* A link can preselect: /contact/?company=<slug> (or ?area=) picks the
       desk; /supplier-portal/register/?company=<slug> ticks the categories that company
       buys in. A page can also hand the form a first draft (data-prefill):
       the desk an invitation request is for, the reference in its message. */
    try {
      var q = new URLSearchParams(location.search);
      /* an event's action arrives carrying its reference */
      var ref = (q.get('ref') || '').replace(/[^A-Za-z0-9-]/g, '').toUpperCase().slice(0, 40);
      var refInput = form.querySelector('input[name="reference"]');
      if (ref && refInput) {
        refInput.value = ref;
        var refSay = document.getElementById('regRef');
        if (refSay) { refSay.querySelector('[data-ref]').textContent = ref; refSay.hidden = false; }
      }
      var pre = q.get('company') || q.get('area');
      if (pre && areaSel && [].some.call(areaSel.options, function (o) { return o.value === pre; })) areaSel.value = pre;
      var co = (q.get('company') || '').replace(/[^a-z0-9-]/g, '');
      if (co) $$('input[type="checkbox"][data-buyers]', form).forEach(function (b) {
        if ((' ' + b.getAttribute('data-buyers') + ' ').indexOf(' ' + co + ' ') !== -1) b.checked = true;
      });
      var fill = form.getAttribute('data-prefill');
      if (fill) {
        fill = JSON.parse(fill);
        Object.keys(fill).forEach(function (k) {
          var el = form.querySelector('[name="' + k + '"]');
          if (!el) return;
          if (el.tagName === 'SELECT') { if ([].some.call(el.options, function (o) { return o.value === fill[k]; })) el.value = fill[k]; }
          else if (!el.value) el.value = fill[k];
        });
      }
    } catch (e) {}

    /* The documents. Each row is optional; a chosen file has to be a PDF or
       an image within what one email can carry — 2 MB a file, 3 MB in all —
       and the row says so itself when one is not. */
    var DOC_ONE = 2 * 1024 * 1024, DOC_ALL = 3 * 1024 * 1024;
    var DOC_TYPES = /\.(pdf|jpe?g|png|webp)$/i;
    var docInputs = $$('[data-doc-input]', form);
    var docsTotal = function () {
      return docInputs.reduce(function (n, i) { return n + (i.files[0] ? i.files[0].size : 0); }, 0);
    };
    var docRow = function (input) {
      var row = input.closest('[data-doc]');
      return { row: row, name: row.querySelector('[data-doc-name]'), x: row.querySelector('[data-doc-clear]'), err: row.querySelector('[data-doc-err]') };
    };
    var mb = function (n) { return (n / 1048576).toFixed(n < 1048576 ? 2 : 1) + ' MB'; };
    var resetDoc = function (input) {
      var r = docRow(input);
      input.value = '';
      r.name.textContent = 'Optional';
      r.row.classList.remove('has-file');
      r.x.hidden = true;
      r.err.textContent = '';
    };
    docInputs.forEach(function (input) {
      var r = docRow(input);
      input.addEventListener('change', function () {
        var f = input.files[0];
        r.err.textContent = '';
        if (!f) { resetDoc(input); return; }
        if (!DOC_TYPES.test(f.name)) { input.value = ''; r.err.textContent = 'PDF or image only — send anything else by email.'; return; }
        if (f.size > DOC_ONE) { input.value = ''; r.err.textContent = 'That file is ' + mb(f.size) + '; up to 2 MB here. Email larger files.'; return; }
        if (docsTotal() > DOC_ALL) { input.value = ''; r.err.textContent = 'Together the files pass 3 MB. Attach the essentials and email the rest.'; return; }
        r.name.textContent = f.name + ' · ' + mb(f.size);
        r.row.classList.add('has-file');
        r.x.hidden = false;
        if (typeof refreshProg === 'function') refreshProg();
      });
      r.x.addEventListener('click', function () { resetDoc(input); if (typeof refreshProg === 'function') refreshProg(); });
    });
    var resetDocs = function () { docInputs.forEach(resetDoc); };
    /* read what was chosen, as base64 the function can hand to the email */
    var readDocs = function () {
      var picked = docInputs.filter(function (i) { return i.files[0]; });
      if (!picked.length) return Promise.resolve([]);
      if (docsTotal() > DOC_ALL) return Promise.resolve(null);
      return Promise.all(picked.map(function (i) {
        return new Promise(function (res, rej) {
          var f = i.files[0], rd = new FileReader();
          rd.onload = function () { res({ field: i.name, filename: f.name, type: f.type || 'application/octet-stream', content: String(rd.result).split(',')[1] || '' }); };
          rd.onerror = function () { rej(new Error(f.name)); };
          rd.readAsDataURL(f);
        });
      })).catch(function () { return null; });
    };

    /* The draft. What is typed stays in this browser, so the form can be
       finished later — files stay out of it, they are too big to keep. */
    var DRAFT_KEY = 'lusail-draft-' + kind;
    var draftable = kind === 'supplier' && 'localStorage' in window;
    var saveDraft = function () {
      if (!draftable) return;
      try {
        var d = {};
        $$('input[name],select[name],textarea[name]', form).forEach(function (el) {
          if (el.type === 'file' || el.type === 'hidden' || el.name === 'website') return;
          if (el.type === 'checkbox') { if (el.checked) (d[el.name] = d[el.name] || []).push(el.value); }
          else if (el.value) d[el.name] = el.value;
        });
        localStorage.setItem(DRAFT_KEY, JSON.stringify(d));
      } catch (e) {}
    };
    var clearDraft = function () { try { localStorage.removeItem(DRAFT_KEY); } catch (e) {} };
    if (draftable) {
      try {
        var saved = JSON.parse(localStorage.getItem(DRAFT_KEY) || '{}');
        Object.keys(saved).forEach(function (k) {
          var v = saved[k];
          if (Array.isArray(v)) {
            $$('input[type="checkbox"][name="' + k + '"]', form).forEach(function (b) { if (v.indexOf(b.value) !== -1) b.checked = true; });
          } else {
            var el = form.querySelector('[name="' + k + '"]');
            if (el && !el.value && el.type !== 'file') el.value = v;
          }
        });
      } catch (e) {}
      var saveSoon;
      form.addEventListener('input', function () { clearTimeout(saveSoon); saveSoon = setTimeout(saveDraft, 400); });
      form.addEventListener('change', saveDraft);
    }

    /* The progress rail beside the register form, when the page has one:
       each step answers for its own fields, the way TIBECO's does. */
    var prog = document.getElementById('regProg');
    var refreshProg;
    if (prog && form.getAttribute('data-form') === 'supplier') {
      var stepEls = $$('li', prog);
      /* fields belong to the step heading above them, in document order */
      var groups = [];
      $$('.fstep, input[name], select[name], textarea[name], fieldset[data-group]', form).forEach(function (el) {
        if (el.classList && el.classList.contains('fstep')) { groups.push([]); return; }
        if (!groups.length) return;
        if (el.type === 'hidden' || el.name === 'website') return;
        if (el.closest('fieldset[data-group]') && el.tagName !== 'FIELDSET') return;
        groups[groups.length - 1].push(el);
      });
      refreshProg = function () {
        groups.forEach(function (fields, i) {
          var li = stepEls[i];
          if (!li) return;
          var state = li.querySelector('[data-state]');
          var filled = 0, required = 0, reqDone = 0, started = false, text = '';
          var cats = null, files = 0, agrees = [], agreesOn = 0;
          fields.forEach(function (el) {
            if (el.tagName === 'FIELDSET') { cats = el; return; }
            if (el.type === 'file') { if (el.files[0]) files++; return; }
            if (el.type === 'checkbox' && el.closest('.agree')) { agrees.push(el); if (el.checked) agreesOn++; return; }
            var has = el.type === 'checkbox' ? el.checked : !!String(el.value).trim();
            if (has) { filled++; started = true; }
            if (el.required) { required++; if (has) reqDone++; }
          });
          if (cats) {
            var boxes = $$('input[name]', cats), on = boxes.filter(function (b) { return b.checked; }).length;
            text = on ? on + ' of ' + boxes.length + ' selected' : '';
            started = started || on > 0;
            required++; if (on) reqDone++;
          }
          if (fields.some(function (el) { return el.type === 'file'; })) {
            text = files ? files + ' attached' : 'Optional';
            started = files > 0;
          } else if (agrees.length) {
            text = agreesOn ? agreesOn + ' of ' + agrees.length + ' ticked' : '';
            started = started || agreesOn > 0;
            required += agrees.length; reqDone += agreesOn;
          }
          var done = required > 0 && reqDone >= required;
          li.classList.toggle('is-done', done);
          li.classList.toggle('is-going', !done && started);
          state.textContent = done ? (text || 'Complete') : started ? (text || 'In progress') : (text || 'Not started');
        });
      };
      form.addEventListener('input', refreshProg);
      form.addEventListener('change', refreshProg);
      refreshProg();
    }

    /* "All sectors" ticks every sector; unticking any one clears it. */
    $$('[data-all]', form).forEach(function (all) {
      var boxes = $$('input[name="' + all.getAttribute('data-all') + '"]', form);
      var sync = function () { all.checked = boxes.every(function (b) { return b.checked; }); };
      all.addEventListener('change', function () { boxes.forEach(function (b) { b.checked = all.checked; }); clearFault(all.closest('fieldset')); });
      boxes.forEach(function (b) { b.addEventListener('change', function () { sync(); clearFault(b.closest('fieldset')); }); });
      sync();
    });

    /* What is wrong is said beside the field it is wrong about. */
    var WHY = {
      fName: 'Tell us your name.',
      fMsg: 'Write a line about what you need, so we can send it to the right company.'
    };
    var fault = function (el) {
      if (el.type === 'email') {
        return el.value.trim()
          ? 'That does not look like an email address. Try name@company.qa.'
          : 'Enter your email address, so we have somewhere to reply to.';
      }
      return el.getAttribute('data-why') || WHY[el.id] || 'This one is needed.';
    };
    var required = $$('[required]', form).concat($$('fieldset[data-required]', form));
    var isEmpty = function (el) {
      if (el.tagName === 'FIELDSET') return !el.querySelector('input[type="checkbox"][name]:checked');
      if (el.type === 'checkbox') return !el.checked;   // a declaration that must be ticked
      if (!el.value.trim()) return true;
      return el.type === 'email' && !/^\S+@\S+\.\S+$/.test(el.value);
    };
    var clearFault = function (el) {
      if (!el) return;
      el.removeAttribute('aria-invalid');
      var slot = document.getElementById(el.id + '-err');
      if (slot) slot.textContent = '';
    };
    required.forEach(function (el) {
      if (el.tagName !== 'FIELDSET') el.addEventListener(el.type === 'checkbox' ? 'change' : 'input', function () { clearFault(el); });
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      required.forEach(clearFault);
      var missing = required.filter(isEmpty)[0];
      if (missing) {
        var why = fault(missing);
        missing.setAttribute('aria-invalid', 'true');
        var slot = document.getElementById(missing.id + '-err');
        if (slot) slot.textContent = why;
        say(why, true);
        (missing.tagName === 'FIELDSET' ? missing.querySelector('input') : missing).focus();
        return;
      }

      var btn = form.querySelector('button[type="submit"]');
      btn.disabled = true;
      say('Sending…');

      /* Checkbox groups travel as arrays; everything else as one value. */
      var body = { form: kind, t: Date.now() - LOADED_AT };
      var fd = new FormData(form);
      fd.forEach(function (v, k) {
        if (v instanceof File) return;             // documents travel separately, read below
        var box = form.querySelector('input[type="checkbox"][name="' + k + '"]');
        if (box && box.closest('fieldset')) body[k] = fd.getAll(k);   // a group travels as a list
        else body[k] = v;
      });
      var slot = form.querySelector('.turnstile');
      var afterTry = function () {
        if (slot && window.turnstile && slot.getAttribute('data-widget') !== null) {
          try { turnstile.reset(slot.getAttribute('data-widget')); } catch (e) {}
        }
      };

      readDocs().then(function (atts) {
      if (atts === null) { say('A document could not be read — check the messages beside the files.', true); btn.disabled = false; afterTry(); return; }
      if (atts.length) body.attachments = atts;
      fetch(CONTACT_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(body)
      }).then(function (res) {
        if (res.status === 400) {
          /* the function says what it will not accept — a bad address, a
             failed human check, too many links — so repeat that rather
             than offering the mail program for something it would refuse too */
          return res.json().then(function (j) {
            var e = new Error('refused'); e.said = j && j.error; throw e;
          });
        }
        if (!res.ok) throw new Error(res.status);
        say(form.getAttribute('data-ok') || 'Message sent.');
        form.reset();
        var done = form.querySelector('.fdone');
        if (done) { form.classList.add('is-sent'); done.hidden = false; done.focus(); }
        $$('[data-all]', form).forEach(function (a) { a.checked = false; });
        resetDocs(); clearDraft();
        if (typeof refreshProg === 'function') refreshProg();
      }).catch(function (err) {
        if (err && err.said) { say(err.said + ' Check it and send again.', true); return; }
        /* Nothing typed is lost: the message stays in the form, and the same
           words are offered to the visitor's own mail program, prefilled. */
        var lines = [];
        $$('input[name],select[name],textarea[name]', form).forEach(function (el) {
          if (el.name === 'website' || el.type === 'checkbox') return;
          var label = form.querySelector('label[for="' + el.id + '"]');
          var v = el.tagName === 'SELECT' ? (el.selectedIndex > 0 || !el.required ? el.options[el.selectedIndex].text : '') : el.value;
          if (v) lines.push((label ? label.textContent.replace('*', '').trim() : el.name) + ': ' + v);
        });
        $$('fieldset[data-group]', form).forEach(function (g) {
          var picked = $$('input[name]:checked', g).map(function (b) { return b.nextElementSibling.textContent; });
          if (picked.length) lines.push(g.querySelector('legend').textContent.replace('*', '').trim() + ': ' + picked.join(', '));
        });
        $$('.agree input:checked', form).forEach(function (b) {
          lines.push('Confirmed: ' + b.nextElementSibling.textContent.replace('*', '').trim());
        });
        var ref = form.querySelector('input[name="reference"]');
        var subject = ({ supplier: 'Supplier registration', quote: 'Quotation', callback: 'Callback request' }[kind] || 'Website enquiry')
          + (ref && ref.value ? ' — ' + ref.value : '');
        var href = 'mailto:' + MAIL + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(lines.join('\n'));
        say('That did not send. Try again, or ', true);
        var a = document.createElement('a');
        a.href = href; a.textContent = 'email it to ' + MAIL;
        status.appendChild(a);
        status.appendChild(document.createTextNode('.'));
      }).then(function () {
        btn.disabled = false;
        afterTry();
      });
      });
    });
  };
  $$('form[data-form]').forEach(setupForm);
  /* "Send another" brings the empty form back. */
  $$('.fdone-again').forEach(function (b) {
    b.addEventListener('click', function () {
      var form = b.closest('form'), done = form.querySelector('.fdone');
      form.classList.remove('is-sent'); done.hidden = true;
      var st = form.querySelector('.status'); if (st) st.textContent = '';
      var first = form.querySelector('input:not([tabindex="-1"]):not([type="checkbox"])'); if (first) first.focus();
    });
  });

  /* ---------- the supplier portal -------------------------------------------
     The pages are built with each event's closing time written as data. Here
     that becomes "in 9 days", "closing soon" inside 72 hours, and — because a
     static page can outlive the event — the row goes once the hour passes
     and the quotation form on its page gives way to a note. Without script
     the dates are still printed, and the build already dropped anything
     closed at the time it ran. */
  var DAY = 864e5;
  var leftText = function (ms) {
    if (ms < 36e5) return 'closes within the hour';
    if (ms < DAY) return 'in ' + Math.max(1, Math.round(ms / 36e5)) + ' hours';
    var d = Math.round(ms / DAY);
    return 'in ' + d + (d === 1 ? ' day' : ' days');
  };
  var tickEvents = function () {
    var now = Date.now(), open = 0;
    $$('[data-closes]').forEach(function (el) {
      var left = new Date(el.getAttribute('data-closes')).getTime() - now;
      var badges = $$('[data-badge]', el), inEl = el.querySelector('[data-in]');
      var invite = el.getAttribute('data-invite') === '1';
      var setBadge = function (text, cls) { badges.forEach(function (b) { b.textContent = text; b.className = 'badge ' + cls; }); };
      if (left <= 0) {
        /* a row for a closed event simply leaves the list; its register link
           would still work, but there is nothing left to bid on */
        el.hidden = true;
        return;
      }
      if (el.classList.contains('opp')) open++;
      if (inEl) inEl.textContent = leftText(left);
      if (badges.length && !invite) {
        var soon = left < 72 * 36e5;
        setBadge(soon ? 'Closing soon' : 'Open', soon ? 'badge-soon' : 'badge-open');
      }
    });
    var none = $('#oppNone');
    if (none && $('#opps')) none.hidden = open > 0;
  };
  if ($('[data-closes]')) { tickEvents(); setInterval(tickEvents, 60e3); }

  /* The category filter above the list: only shown with script, since it
     does nothing without it. */
  var filter = $('#oppFilter');
  if (filter && $('#opps')) {
    filter.hidden = false;
    /* pills on a wide screen, a select on a phone; both drive the same list */
    var pills = $$('.opp-pill', filter), sel = $('#oppSelect');
    var pick = function (want) {
      pills.forEach(function (x) { x.classList.toggle('on', x.getAttribute('data-cat') === want); });
      if (sel && sel.value !== want) sel.value = want;
      $$('.opp', $('#opps')).forEach(function (row) {
        if (new Date(row.getAttribute('data-closes')).getTime() <= Date.now()) return;
        row.hidden = !!(want && row.getAttribute('data-cat') !== want);
      });
    };
    pills.forEach(function (p) { p.addEventListener('click', function () { pick(p.getAttribute('data-cat')); }); });
    if (sel) sel.addEventListener('change', function () { pick(sel.value); });
    /* a category card's "n open" arrives here already filtered */
    var qcat = (new URLSearchParams(location.search).get('cat') || '').replace(/[^a-z0-9-]/g, '');
    if (qcat && pills.some(function (x) { return x.getAttribute('data-cat') === qcat; })) pick(qcat);
  }

  /* ---------- the corner form, and the way back up ---------------------------
     A button in the corner of every page opens a small panel. Escape, the
     close button or a click outside it closes it, and focus goes back to the
     button. Above it, once the page has moved, a button back to the top. */
  var qf = $('#qf');
  if (qf) {
    var qBtn = $('#qfBtn'), qPanel = $('#qfPanel');
    var setQ = function (open) {
      qPanel.hidden = !open;
      qBtn.setAttribute('aria-expanded', String(open));
      qf.classList.toggle('open', open);
      if (open) { var first = qPanel.querySelector('input:not([tabindex="-1"])'); if (first) first.focus(); }
    };
    qBtn.addEventListener('click', function () { setQ(qPanel.hidden); });
    qPanel.querySelector('.qf-close').addEventListener('click', function () { setQ(false); qBtn.focus(); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !qPanel.hidden) { setQ(false); qBtn.focus(); }
    });
    document.addEventListener('click', function (e) {
      if (!qPanel.hidden && !qf.contains(e.target)) setQ(false);
    });
    /* The button steps aside while a page's own form is on screen, so two
       forms never compete for the same visitor. */
    if ('IntersectionObserver' in window) {
      var own = $$('form[data-form]:not(.qf-form)');
      if (own.length) {
        var seen = new Set();
        var io = new IntersectionObserver(function (es) {
          es.forEach(function (x) { if (x.isIntersecting) seen.add(x.target); else seen.delete(x.target); });
          qf.classList.toggle('qf-away', seen.size > 0 && qPanel.hidden);
        });
        own.forEach(function (f) { io.observe(f); });
      }
    }

    var top = document.createElement('button');
    top.type = 'button'; top.className = 'totop'; top.setAttribute('aria-label', 'Back to top');
    top.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M12 19V5M5 12l7-7 7 7"/></svg>';
    top.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: still.matches ? 'auto' : 'smooth' }); });
    qf.insertBefore(top, qf.firstChild);
    var onTop = function () { top.classList.toggle('on', window.scrollY > 400); };
    addEventListener('scroll', onTop, { passive: true });
    onTop();
  }

  /* ---------- the globe --------------------------------------------------- */

  /* Where the Group sources from, as the Earth: land as points on a sphere,
     turned slowly, with a gold arc lifting off every source country and
     landing in Doha. Drag turns it; pointing at a region in the register
     beside it lights that region's arcs. The page carries only the places;
     the land arrives as one cached file of points, fetched when the globe
     scrolls into view. */
  var globe = $('#globe');
  if (globe && window.fetch && window.requestAnimationFrame) {
    var cv = globe.querySelector('canvas'), g = cv.getContext('2d');
    var HUB = JSON.parse(globe.getAttribute('data-hub'));
    var PLACES = JSON.parse(globe.getAttribute('data-places'));
    var rad = Math.PI / 180, PI = Math.PI, N = 56;
    var anim = !still.matches;

    var vec = function (lon, lat) {
      var cl = Math.cos(lat * rad);
      return [cl * Math.cos(lon * rad), Math.sin(lat * rad), cl * Math.sin(lon * rad)];
    };
    var hubV = vec(HUB[0], HUB[1]);

    /* Each arc: a run of unit vectors from the country to Doha along the
       great circle, lifted off the surface most in the middle, and more the
       further it has to travel. */
    var arcs = PLACES.map(function (pl, i) {
      var a = vec(pl[2], pl[3]), b = hubV;
      var dot = Math.max(-1, Math.min(1, a[0] * b[0] + a[1] * b[1] + a[2] * b[2]));
      var om = Math.acos(dot), so = Math.sin(om) || 1e-6;
      var L = 0.06 + 0.22 * (om / PI);
      var pts = [];
      for (var k = 0; k <= N; k++) {
        var t = k / N, wa = Math.sin((1 - t) * om) / so, wb = Math.sin(t * om) / so;
        var lift = 1 + L * Math.sin(t * PI);
        pts.push((a[0] * wa + b[0] * wb) * lift, (a[1] * wa + b[1] * wb) * lift, (a[2] * wa + b[2] * wb) * lift);
      }
      return { region: pl[1], v: a, pts: pts, phase: (i * 0.37) % 1 };
    });

    var land = null;
    var loadLand = function () {
      if (land !== null) return;
      land = false;
      fetch('/assets/img/globe.json').then(function (r) { return r.json(); }).then(function (ll) {
        var out = new Float32Array(ll.length / 2 * 3);
        for (var i = 0, j = 0; i < ll.length; i += 2, j += 3) {
          var v = vec(ll[i], ll[i + 1]); out[j] = v[0]; out[j + 1] = v[1]; out[j + 2] = v[2];
        }
        land = out;
      }).catch(function () { land = false; });
    };

    var W = 0, R = 0;
    var size = function () {
      var w = cv.clientWidth; if (!w) return;
      var dpr = Math.min(2, window.devicePixelRatio || 1);
      W = w; R = w * 0.46;
      cv.width = Math.round(w * dpr); cv.height = Math.round(w * dpr);
      g.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    /* The view: Doha faces out and the globe sways seventy degrees either
       side of it, so the Americas and Australia each come round in turn.
       Dragging adds to that; with reduced motion the globe holds still. */
    var swing = anim ? 70 * rad : 0, offset = 0, tilt = 18 * rad;
    var dragging = false, lastX = 0, lastY = 0;
    cv.addEventListener('pointerdown', function (e) {
      dragging = true; lastX = e.clientX; lastY = e.clientY;
      if (cv.setPointerCapture) cv.setPointerCapture(e.pointerId);
    });
    cv.addEventListener('pointermove', function (e) {
      if (!dragging) return;
      offset -= (e.clientX - lastX) / R;
      tilt = Math.max(-60 * rad, Math.min(60 * rad, tilt + (e.clientY - lastY) / R));
      lastX = e.clientX; lastY = e.clientY;
    });
    var up = function () { dragging = false; };
    cv.addEventListener('pointerup', up);
    cv.addEventListener('pointercancel', up);

    var lit = null, running = false, t0 = null;
    var frame = function (now) {
      if (!running) return;
      if (cv.clientWidth !== W) size();
      if (t0 === null) t0 = now;
      var t = (now - t0) / 1000;
      var lam = HUB[0] * rad + swing * Math.sin(t * 0.25) + offset;
      var sa = Math.sin(lam), ca = Math.cos(lam), sb = Math.sin(tilt), cb = Math.cos(tilt);
      var cx = W / 2, cy = W / 2;
      /* a point on (or above) the sphere -> [x, y, depth], radius 1 */
      var P = function (x, y, z) {
        var x1 = x * ca + z * sa, z1 = z * ca - x * sa;
        return [z1, y * cb - x1 * sb, y * sb + x1 * cb];
      };
      var vis = function (q) { return q[2] > 0 || q[0] * q[0] + q[1] * q[1] > 1; };

      g.clearRect(0, 0, W, W);

      /* the halo, then the sphere */
      var halo = g.createRadialGradient(cx, cy, R, cx, cy, R * 1.14);
      halo.addColorStop(0, 'rgba(211,167,80,.2)'); halo.addColorStop(1, 'rgba(211,167,80,0)');
      g.beginPath(); g.arc(cx, cy, R * 1.14, 0, 2 * PI); g.fillStyle = halo; g.fill();
      var grad = g.createRadialGradient(cx - R * 0.35, cy - R * 0.35, R * 0.1, cx, cy, R);
      grad.addColorStop(0, '#1a2e60'); grad.addColorStop(1, '#0a1838');
      g.beginPath(); g.arc(cx, cy, R, 0, 2 * PI); g.fillStyle = grad; g.fill();

      /* the land: brighter where it faces us, dim toward the edge */
      if (land) {
        var sz = Math.max(1.4, W / 330), hs = sz / 2, dim = [];
        g.fillStyle = 'rgba(208,206,204,.62)'; g.beginPath();
        for (var i = 0; i < land.length; i += 3) {
          var q = P(land[i], land[i + 1], land[i + 2]);
          if (q[2] <= 0) continue;
          var X = cx + q[0] * R, Y = cy - q[1] * R;
          if (q[2] < 0.25) dim.push(X, Y); else g.rect(X - hs, Y - hs, sz, sz);
        }
        g.fill();
        g.fillStyle = 'rgba(208,206,204,.2)'; g.beginPath();
        for (i = 0; i < dim.length; i += 2) g.rect(dim[i] - hs, dim[i + 1] - hs, sz, sz);
        g.fill();
      }

      /* the arcs, a pulse travelling along each toward Doha, and the country */
      g.lineCap = 'round'; g.lineJoin = 'round';
      arcs.forEach(function (a) {
        var on = !lit || lit === a.region;
        g.strokeStyle = on ? 'rgba(211,167,80,' + (lit ? .95 : .6) + ')' : 'rgba(211,167,80,.08)';
        g.lineWidth = lit && on ? 1.8 : 1.1;
        g.beginPath();
        var pen = false;
        for (var k = 0; k < a.pts.length; k += 3) {
          var q = P(a.pts[k], a.pts[k + 1], a.pts[k + 2]);
          if (!vis(q)) { pen = false; continue; }
          var X = cx + q[0] * R, Y = cy - q[1] * R;
          if (pen) g.lineTo(X, Y); else g.moveTo(X, Y);
          pen = true;
        }
        g.stroke();
        if (on && anim) {
          var u = (t * 0.22 + a.phase) % 1, idx = Math.round(u * N) * 3;
          var qp = P(a.pts[idx], a.pts[idx + 1], a.pts[idx + 2]);
          if (vis(qp)) {
            g.beginPath(); g.arc(cx + qp[0] * R, cy - qp[1] * R, 2.2, 0, 2 * PI);
            g.fillStyle = '#f3dba3'; g.fill();
          }
        }
        var c = P(a.v[0], a.v[1], a.v[2]);
        if (c[2] > 0) {
          var X2 = cx + c[0] * R, Y2 = cy - c[1] * R;
          g.beginPath(); g.arc(X2, Y2, 7, 0, 2 * PI);
          g.fillStyle = on ? 'rgba(211,167,80,.25)' : 'rgba(211,167,80,.06)'; g.fill();
          g.beginPath(); g.arc(X2, Y2, 3.2, 0, 2 * PI);
          g.fillStyle = on ? '#D3A750' : 'rgba(211,167,80,.3)'; g.fill();
        }
      });

      /* Doha: a navy disc ringed in gold, named */
      var hq = P(hubV[0], hubV[1], hubV[2]);
      if (hq[2] > 0) {
        var HX = cx + hq[0] * R, HY = cy - hq[1] * R;
        if (anim) {
          var pulse = (t % 2.6) / 2.6;
          g.beginPath(); g.arc(HX, HY, 6 + pulse * 18, 0, 2 * PI);
          g.strokeStyle = 'rgba(211,167,80,' + (1 - pulse) * .8 + ')'; g.lineWidth = 1.5; g.stroke();
        }
        g.beginPath(); g.arc(HX, HY, 6, 0, 2 * PI);
        g.fillStyle = '#0B1A3A'; g.fill(); g.strokeStyle = '#D3A750'; g.lineWidth = 2.5; g.stroke();
        g.font = '600 11px Archivo, sans-serif';
        var label = 'D O H A', tw = g.measureText(label).width + 18, LX = HX - tw / 2, LY = HY - 38;
        g.fillStyle = '#0B1A3A'; g.fillRect(LX, LY, tw, 24);
        g.strokeStyle = '#D3A750'; g.lineWidth = 1; g.strokeRect(LX + .5, LY + .5, tw - 1, 23);
        g.fillStyle = '#fff'; g.textBaseline = 'middle'; g.textAlign = 'center'; g.fillText(label, HX, LY + 12);
      }
      requestAnimationFrame(frame);
    };

    /* draw only while the globe is on screen */
    var start = function () { loadLand(); if (!running) { running = true; size(); requestAnimationFrame(frame); } };
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (es) {
        es.forEach(function (e) { if (e.isIntersecting) start(); else running = false; });
      }, { rootMargin: '200px' }).observe(globe);
    } else start();

    /* pointing at a region in the register lights its arcs */
    var reg = $('#markets');
    if (reg) {
      var rows = $$('[data-region]', reg);
      rows.forEach(function (el) {
        var name = el.getAttribute('data-region');
        el.addEventListener('pointerenter', function () {
          lit = name;
          rows.forEach(function (x) { x.classList.toggle('on', x === el); });
        });
        el.addEventListener('pointerleave', function () { lit = null; el.classList.remove('on'); });
      });
    }
  }
})();
