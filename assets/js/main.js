const ICONS = {
  food:'<path d="M5 18h26M8 18c0 7 4.5 11 10 11s10-4 10-11M13 6v7M18 4v9M23 6v7"/>',
  build:'<path d="M4 32h28M8 32V16h9v16M17 32V6h11v26M21 12h3M21 18h3M21 24h3M11 21h3"/>',
  coffee:'<path d="M6 13h19v9a8 8 0 0 1-8 8h-3a8 8 0 0 1-8-8zM25 16h3a3 3 0 0 1 0 6h-3M12 4v5M18 4v5"/>',
  laundry:'<path d="M7 4h22v28H7zM7 11h22M11 7.5h3"/><circle cx="18" cy="21" r="6.5"/>',
  energy:'<path d="M20 3 9 20h9l-2 13 11-17h-9z"/>',
  trade:'<path d="M18 3 32 11v14l-14 8-14-8V11zM4 11l14 8 14-8M18 19v14M11 7l14 8"/>'
};
const SECTORS = [
  {id:'food', en:{s:'Food industry', c:'Lusail Foods', t:'Production, packaging and distribution of food products for retailers, hotels and caterers across Qatar.', l:['Food manufacturing','Cold-chain distribution','Supply to hotels and caterers'], f:'300+', fl:'retail and hospitality outlets supplied'},
    ar:{s:'الصناعات الغذائية', c:'لوسيل للأغذية', t:'إنتاج وتعبئة وتوزيع المنتجات الغذائية لمنافذ البيع والفنادق وشركات التموين في أنحاء قطر.', l:['تصنيع الأغذية','التوزيع المبرّد','التوريد للفنادق والتموين'], f:'+300', fl:'منفذ بيع وضيافة نورّد له'}},
  {id:'build', en:{s:'Construction', c:'Lusail Contracting', t:'Residential, commercial and infrastructure projects, from design coordination through to handover.', l:['General contracting','Fit-out and MEP works','Project management'], f:'45', fl:'projects delivered since 2012'},
    ar:{s:'المقاولات والإنشاءات', c:'لوسيل للمقاولات', t:'مشاريع سكنية وتجارية وبنية تحتية، من تنسيق التصاميم وحتى التسليم.', l:['المقاولات العامة','التشطيبات والأعمال الكهروميكانيكية','إدارة المشاريع'], f:'45', fl:'مشروعاً منجزاً منذ 2012'}},
  {id:'coffee', en:{s:'Coffee shops', c:'Lusail Coffee House', t:'A specialty coffee chain across Doha and Lusail, roasting its own beans and training its own baristas.', l:['Specialty coffee branches','In-house roastery','Office and event catering'], f:'13', fl:'branches in Doha and Lusail'},
    ar:{s:'المقاهي', c:'مقهى لوسيل', t:'سلسلة مقاهٍ مختصة في الدوحة ولوسيل، تحمّص البن بنفسها وتدرّب فريقها من الباريستا.', l:['فروع القهوة المختصة','محمصة خاصة','ضيافة المكاتب والفعاليات'], f:'13', fl:'فرعاً في الدوحة ولوسيل'}},
  {id:'laundry', en:{s:'Laundry services', c:'Lusail Laundry', t:'Laundry and linen care for homes, hotels and hospitals, with scheduled pickup and delivery.', l:['Home pickup and delivery','Hotel and hospital linen','Dry cleaning and pressing'], f:'8 t', fl:'of linen processed every day'},
    ar:{s:'خدمات المغاسل', c:'مغاسل لوسيل', t:'غسيل والعناية بالمفروشات للمنازل والفنادق والمستشفيات، مع خدمة الاستلام والتوصيل.', l:['الاستلام والتوصيل للمنازل','مفروشات الفنادق والمستشفيات','التنظيف الجاف والكيّ'], f:'8 طن', fl:'من المفروشات يومياً'}},
  {id:'energy', en:{s:'Energy', c:'Lusail Energy', t:'Solar installations, power solutions and support services for the oil and gas industry.', l:['Solar and power systems','Oil and gas services','Energy efficiency audits'], f:'22 MW', fl:'of solar capacity installed'},
    ar:{s:'الطاقة', c:'لوسيل للطاقة', t:'تركيب أنظمة الطاقة الشمسية وحلول الطاقة وخدمات الدعم لقطاع النفط والغاز.', l:['أنظمة الطاقة الشمسية','خدمات النفط والغاز','تدقيق كفاءة الطاقة'], f:'22 ميغاواط', fl:'من الطاقة الشمسية المركّبة'}},
  {id:'trade', en:{s:'Commercial & trading', c:'Lusail Trading', t:'Import, wholesale and distribution of goods, and the sourcing arm that buys for the whole group.', l:['Import and wholesale','Regional distribution','Group procurement'], f:'14', fl:'countries we import from'},
    ar:{s:'التجارة', c:'لوسيل للتجارة', t:'استيراد السلع وبيعها بالجملة وتوزيعها، والذراع التي تتولى المشتريات لكامل المجموعة.', l:['الاستيراد والبيع بالجملة','التوزيع الإقليمي','مشتريات المجموعة'], f:'14', fl:'دولة نستورد منها'}}
];
let lang='en', active=0, openRow=-1;
const T = (en,ar)=> lang==='ar'?ar:en;
const $ = s=>document.querySelector(s);

/* Structure: one continuous line folded into six bars */
function buildBars(){
  const g=$('#bars'), W=264, H=26, gap=(W-H)/5, x0=-W/2, y0=-W/2; let html='';
  for(let i=0;i<6;i++){
    const y=y0+i*gap, d=i*.3;
    html+=`<rect class="bar ${i%2?'r':'l'}" data-i="${i}" x="${x0}" y="${y}" width="${W}" height="${H}" style="animation-delay:${d}s"/>`;
    if(i<5){ const x = i%2? x0 : x0+W-H;
      html+=`<rect class="joint" x="${x}" y="${y}" width="${H}" height="${gap+H}" style="animation-delay:${d+.28}s"/>`; }
  }
  g.innerHTML=html;
  g.querySelectorAll('.bar').forEach(b=>b.addEventListener('click',()=>select(+b.dataset.i)));
  $('#structure').classList.add('draw');
}
function renderStrip(){
  $('#strip').innerHTML = SECTORS.map((s,i)=>`<li><button type="button" aria-pressed="${i===active}" data-i="${i}"><svg viewBox="0 0 36 36" aria-hidden="true">${ICONS[s.id]}</svg><span>${s[lang].s}</span></button></li>`).join('');
  $('#strip').querySelectorAll('button').forEach(b=>{
    b.addEventListener('click',()=>select(+b.dataset.i));
    b.addEventListener('mouseenter',()=>select(+b.dataset.i));
  });
}
function select(i){
  active=i;
  document.querySelectorAll('#bars .bar').forEach(b=>b.classList.toggle('on',+b.dataset.i===i));
  document.querySelectorAll('#strip button').forEach(b=>b.setAttribute('aria-pressed', +b.dataset.i===i));
  const s=SECTORS[i][lang];
  $('#capCo').textContent=s.c; $('#capTx').textContent=s.t;
  $('#capLink').textContent=T('See the company','تعرّف على الشركة');
}
$('#capLink').addEventListener('click',()=>toggleRow(active,true));

function renderIndex(){
  $('#index').innerHTML = SECTORS.map((s,i)=>{const d=s[lang]; return `
  <div class="row${i===openRow?' open':''}" id="row-${s.id}">
    <button class="row-btn" type="button" aria-expanded="${i===openRow}" aria-controls="p-${s.id}" data-i="${i}">
      <svg class="ic" viewBox="0 0 36 36" aria-hidden="true">${ICONS[s.id]}</svg>
      <h3>${d.s}</h3><span class="sub">${d.c}</span><span class="plus" aria-hidden="true"></span>
    </button>
    <div class="panel" id="p-${s.id}" role="region" aria-label="${d.c}"><div><div class="panel-in">
      <p class="desc">${d.t}<br><a href="#contact">${T('Contact '+d.c, 'تواصل مع '+d.c)}</a></p>
      <div class="meta"><ul>${d.l.map(x=>`<li><span class="pair"></span>${x}</li>`).join('')}</ul>
      <div class="fig"><b>${d.f}</b><span>${d.fl}</span></div></div>
    </div></div></div>
  </div>`}).join('');
  $('#index').querySelectorAll('.row-btn').forEach(b=>b.addEventListener('click',()=>toggleRow(+b.dataset.i)));
  $('#footCos').innerHTML = SECTORS.map((s,i)=>`<li><a href="#companies" data-i="${i}">${s[lang].c}</a></li>`).join('');
  $('#footCos').querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>toggleRow(+a.dataset.i,true)));
}
function toggleRow(i,force){
  openRow = (force || openRow!==i) ? i : -1;
  document.querySelectorAll('.row').forEach((r,k)=>{
    const on=k===openRow; r.classList.toggle('open',on);
    r.querySelector('.row-btn').setAttribute('aria-expanded',on);
  });
  if(force) setTimeout(()=>document.querySelectorAll('.row')[i].scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'center'}),20);
}

/* Language */
function setLang(l){
  lang=l;
  document.documentElement.lang=l; document.documentElement.dir = l==='ar'?'rtl':'ltr';
  document.querySelectorAll('[data-ar]').forEach(el=>{
    if(el.dataset.en===undefined) el.dataset.en=el.textContent;
    el.textContent = l==='ar'?el.dataset.ar:el.dataset.en;
  });
  $('#langBtn').textContent = l==='ar'?'English':'عربي';
  $('#langBtn').setAttribute('aria-label', l==='ar'?'Switch to English':'التبديل إلى العربية');
  renderStrip(); renderIndex(); select(active);
  try{localStorage.setItem('lc-lang',l)}catch(e){}
}
$('#langBtn').addEventListener('click',()=>setLang(lang==='en'?'ar':'en'));

/* Header */
const head=$('.site-head');

/* Form
   Set CONTACT_ENDPOINT to the URL that should receive the message (any service that
   accepts a JSON POST: a form backend, an API route, a serverless function).
   While it is empty the form validates and confirms, but no data leaves the browser. */
const CONTACT_ENDPOINT = '';

const form = $('#form'), status = $('#status');
function say(msg, isError){ status.className = isError ? 'status err' : 'status'; status.textContent = msg; }

form.addEventListener('submit', async e=>{
  e.preventDefault();
  const missing=[...form.querySelectorAll('[required]')].find(x=>!x.value.trim() || (x.type==='email' && !/^\S+@\S+\.\S+$/.test(x.value)));
  if(missing){
    say(missing.type==='email'
      ? T('Enter a valid email address, like name@company.qa.','أدخل بريداً إلكترونياً صحيحاً، مثل name@company.qa.')
      : T('Fill in your name, email and message to send.','أكمل الاسم والبريد الإلكتروني والرسالة للإرسال.'), true);
    missing.focus(); return;
  }

  const sent = T('Message sent. We reply within two working days.','تم إرسال الرسالة. نرد خلال يومي عمل.');
  if(!CONTACT_ENDPOINT){ say(sent); form.reset(); return; }

  const btn = form.querySelector('button[type="submit"]');
  btn.disabled = true;
  say(T('Sending…','جارٍ الإرسال…'));
  try{
    const body = Object.fromEntries(new FormData(form));
    body.lang = lang;
    const res = await fetch(CONTACT_ENDPOINT, {
      method:'POST', headers:{'Content-Type':'application/json','Accept':'application/json'},
      body: JSON.stringify(body)
    });
    if(!res.ok) throw new Error(res.status);
    say(sent); form.reset();
  }catch(err){
    say(T('We could not send that. Please email info@lusailcorp.qa instead.','تعذّر الإرسال. يرجى مراسلتنا على info@lusailcorp.qa.'), true);
  }finally{
    btn.disabled = false;
  }
});

/* Boot */
buildBars(); renderStrip(); renderIndex(); select(0);
let saved='en';
try{
  const q = new URLSearchParams(location.search).get('lang');
  saved = (q==='ar'||q==='en') ? q : (localStorage.getItem('lc-lang')||'en');
}catch(e){}
if(saved==='ar') setLang('ar');
