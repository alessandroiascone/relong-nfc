
/* ===== ReLong shared WOW JS ===== */
(function(){
  const WA_NUM = "3908119578844";

  // --- Loader inject ---
  const loader = document.createElement('div');
  loader.id = 'rl-loader';
  loader.innerHTML = `<div class="rl-cube"><span class="f f1"></span><span class="f f2"></span><span class="f f3"></span><span class="f f4"></span><span class="f f5"></span><span class="f f6"></span></div><p class="rl-loading-text">Caricamento…</p>`;
  document.addEventListener('DOMContentLoaded', ()=>{
    document.body.appendChild(loader);
    document.documentElement.classList.add('rl-lock'); document.body.classList.add('rl-lock');
  });
  function hideLoader(){
    const ld=document.getElementById('rl-loader'); if(!ld) return;
    ld.classList.add('hidden');
    setTimeout(()=>{ document.documentElement.classList.remove('rl-lock'); document.body.classList.remove('rl-lock'); ld.remove && ld.remove(); }, 500);
  }
  window.addEventListener('load', hideLoader);
  setTimeout(hideLoader, 3000);

  // --- Toast helper ---
  let toastEl;
  function toast(msg, ms=2200){
    toastEl ||= (function(){
      const t = document.createElement('div'); t.className='toast'; document.body.appendChild(t); return t;
    })();
    toastEl.textContent = msg; toastEl.classList.add('show'); setTimeout(()=>toastEl.classList.remove('show'), ms);
  }

  // --- FAB inject (if missing) ---
  document.addEventListener('DOMContentLoaded', () => {
    if(!document.querySelector('.fab-nav')){
      const fab = document.createElement('div');
      fab.className = 'fab-nav';
      fab.innerHTML = `
        <a class="fab-btn" href="https://maps.app.goo.gl/dwpNWoUwFQD4NppU6" target="_blank" rel="noopener" aria-label="Portami allo Store">
          <svg fill="currentColor" viewBox="0 0 24 24"><path d="M12 2a7 7 0 00-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 00-7-7zm0 9.5A2.5 2.5 0 1112 6.5a2.5 2.5 0 010 5z"/></svg>
          <span>Portami allo Store</span>
        </a>
        <a class="fab-btn" href="tel:+39${WA_NUM}" aria-label="Chiama il negozio">
          <svg fill="currentColor" viewBox="0 0 24 24"><path d="M6.62 10.79a15.05 15.05 0 006.59 6.59l2.2-2.2a1 1 0 011.01-.24c1.12.37 2.33.57 3.58.57a1 1 0 011 1V21a1 1 0 01-1 1C10.4 22 2 13.6 2 3a1 1 0 011-1h3.5a1 1 0 011 1c0 1.25.2 2.46.57 3.58a1 1 0 01-.24 1.01l-2.2 2.2z"/></svg>
          <span>Chiamaci</span>
        </a>`;
      document.body.appendChild(fab);
    }
  });

  // --- To top button ---
  document.addEventListener('DOMContentLoaded', ()=>{
    const toTop = document.createElement('div');
    toTop.className='to-top';
    toTop.innerHTML = `<a href="#" aria-label="Torna su">⬆️ Torna su</a>`;
    document.body.appendChild(toTop);
    const onScroll = ()=>{ (window.scrollY > 250) ? toTop.classList.add('show') : toTop.classList.remove('show'); };
    window.addEventListener('scroll', onScroll, {passive:true}); onScroll();
  });

  // --- Micro-vibration on tap (mobile haptics) ---
  const tapSelectors = 'a, button, .btn, .fab-btn, .btn-filter';
  document.addEventListener('touchstart', (e)=>{
    if (e.target.closest(tapSelectors)){
      if (navigator.vibrate) navigator.vibrate(12);
      const el = e.target.closest(tapSelectors);
      try{
        el.style.transition = (el.style.transition || '') + ', transform .08s ease';
        el.style.transform += ' scale(0.985)';
        setTimeout(()=>{ el.style.transform = el.style.transform.replace(' scale(0.985)',''); }, 100);
      }catch(_){}
    }
  }, {passive:true});

  // --- WhatsApp auto-message prefiller ---
  const templates = {
    "SMARTPHONE A RATE": "Ciao Re Long, vorrei informazioni per prendere uno smartphone a rate (Vodafone & Compass). Mi aiuti? 📱",
    "OFFERTE BUSINESS":  "Ciao Re Long, sono un'azienda/Partita IVA. Vorrei info sulle offerte Vodafone Business. Possiamo sentirci? 🧾",
    "ENERGIA CASA":      "Ciao Re Long, ti invio la mia bolletta luce per una verifica risparmio. Mi consigli l’offerta migliore? ⚡",
    "ASSISTENZA PC":     "Ciao Re Long, ho bisogno di assistenza per il mio PC. Posso inviarti foto/video del problema? 🧰",
    "VODAFONE BUSINESS": "Ciao Re Long, vorrei scoprire le offerte Mobili Business per Partite IVA. Grazie! 📲"
  };
  function applyWAMessages(){
    document.querySelectorAll("a[href*='wa.me']").forEach((a)=>{
      try{
        const url = new URL(a.href, location.href);
        if (url.searchParams.has("text")) return; // already has prefill
        const card = a.closest("article.card");
        const badge = card?.querySelector(".badge")?.textContent?.trim() || "";
        const title = card?.querySelector(".title")?.textContent?.trim() || "";
        const msg = templates[badge] || `Ciao Re Long, vorrei informazioni su: ${title || document.title}. Grazie!`;
        url.searchParams.set("text", msg);
        a.href = url.toString();
        a.setAttribute("rel","noopener");
      }catch(_){}
    });
  }
  document.addEventListener('DOMContentLoaded', applyWAMessages);

  // --- Lead capture popup (polite) ---
  (function(){
    const LS_KEY = 'rl_lead_dismissed_until';
    const overlay = document.createElement('div');
    overlay.className = 'lead-overlay';
    overlay.id = 'leadModal';
    overlay.innerHTML = `
      <div class="lead-card" role="dialog" aria-label="Richiesta contatto">
        <button class="lead-close" aria-label="Chiudi">×</button>
        <div class="lead-title">Ti aiutiamo noi? 👋</div>
        <div class="lead-sub">Lascia un contatto: ti rispondiamo su <b>WhatsApp</b> o chiamata entro poco.</div>
        <div class="lead-row">
          <input id="leadName" type="text" placeholder="Nome e Cognome" autocomplete="name">
          <input id="leadPhone" type="tel" placeholder="Telefono (es. 08119578844)" autocomplete="tel">
          <select id="leadTopic">
            <option value="Smartphone a rate">Smartphone a rate</option>
            <option value="Offerte Vodafone Business">Offerte Vodafone Business</option>
            <option value="Energia Casa">Energia Casa</option>
            <option value="Assistenza PC">Assistenza PC</option>
          </select>
        </div>
        <div class="lead-actions">
          <button class="btn-primary" id="leadSend">Invia su WhatsApp</button>
          <button class="btn-ghost" id="leadLater">Più tardi</button>
        </div>
        <p class="lead-legal">Inviando accetti di essere ricontattato per l’argomento selezionato. Nessuno spam.</p>
      </div>`;
    document.addEventListener('DOMContentLoaded', ()=>document.body.appendChild(overlay));

    function showLead(){
      const until = Number(localStorage.getItem(LS_KEY) || 0);
      if (Date.now() < until) return;
      overlay.style.display='flex';
      overlay.setAttribute('aria-hidden','false');
    }
    function hideLead(days=30){
      overlay.style.display='none';
      overlay.setAttribute('aria-hidden','true');
      localStorage.setItem(LS_KEY, String(Date.now() + days*24*60*60*1000));
    }

    setTimeout(showLead, 12000);
    let firedScroll=false;
    window.addEventListener('scroll', () => {
      if (firedScroll) return;
      const scrolled = (window.scrollY + window.innerHeight) / document.documentElement.scrollHeight;
      if (scrolled > 0.6){ firedScroll=true; showLead(); }
    }, {passive:true});
    document.addEventListener('mouseleave', (e) => { if(e.clientY <= 0) showLead(); });

    document.addEventListener('click', (e)=>{
      if (e.target.matches('.lead-close')) hideLead(30);
      if (e.target.matches('#leadLater')) hideLead(3);
      if (e.target === overlay) hideLead(3);
      if (e.target.matches('#leadSend')){
        const name  = (document.getElementById('leadName').value || '').trim();
        const phone = (document.getElementById('leadPhone').value || '').replace(/\D+/g,'');
        const topic = (document.getElementById('leadTopic').value || '').trim();
        if (!name || phone.length < 7){ alert('Inserisci nome e un numero valido.'); return; }
        const msg = `Ciao Re Long, sono ${name}. Il mio numero è ${phone}. Vorrei info su: ${topic}.`;
        const url = `https://wa.me/${WA_NUM}?text=${encodeURIComponent(msg)}`;
        window.open(url, '_blank'); hideLead(30);
      }
    });
  })();

  // --- Anti-404 for internal .html links ---
  document.addEventListener('click', async (e)=>{
    const a = e.target.closest('a'); if(!a) return;
    try{
      const url = new URL(a.href, location.href);
      const isInternal = url.origin === location.origin && /\.html?$/i.test(url.pathname);
      if(isInternal){
        e.preventDefault();
        const res = await fetch(url.href, {method:'HEAD', cache:'no-store'});
        if(res.ok){ location.href = url.href; }
        else { toast('Pagina non trovata. Ti riportiamo alla Home.'); setTimeout(()=>location.href='./', 1000); }
      }
    }catch(_){}
  }, false);

})(); 
