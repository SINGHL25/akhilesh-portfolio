/* ============================================================
   Recruiter chatbot widget
   - Works with ZERO backend: retrieves over an embedded CV knowledge
     base and answers common recruiter questions.
   - Auto-upgrades: if window.RECRUITER_API_URL is set (see config.js),
     it POSTs the question to the FastAPI + LangChain RAG backend and
     renders that answer instead.
   ============================================================ */
(function () {
  'use strict';

  /* ---- knowledge base: short, retrievable chunks from Akhi's CV ---- */
  var KB = [
    { tags: 'current role kapsch tolling its maintenance assurance transurban', text:
      "Akhi is currently a Maintenance Specialist (ITS & Tolling) at Kapsch TrafficCom Australia (Jan 2024–present). He delivers maintenance assurance for Transurban tolling infrastructure across the West Gate Tunnel (Melbourne), the Gateway and Logan Motorways (SE Queensland) and networks in New Zealand — sustaining 24/7 availability of revenue-critical systems across 9+ tolling points." },
    { tags: 'its experience tolling mlff free flow anpr gnss dsrc back office', text:
      "His ITS and tolling experience covers multi-lane free-flow (MLFF) tolling, GNSS tolling, DSRC, roadside units, ANPR/image processing, C-ITS (V2X), and both back office and commercial back office transaction processing — trip building, invoicing and reconciliation against commercial and deed obligations." },
    { tags: 'assurance rca root cause maximo splunk condition monitoring reliability', text:
      "On the assurance side he runs daily health checks and proactive condition monitoring, and leads root cause analysis on equipment and system anomalies using IBM Maximo, Splunk, EVA and Glide — driving corrective actions that keep asset risk within tolerable levels and restore service within SLA." },
    { tags: 'data analytics python power bi passage records log analyser automation', text:
      "He built Power BI dashboards and Python analytics over billions of passage and vehicle-classification records, giving asset strategy teams performance insight that did not exist before and cutting manual log-analysis effort by around 30%. His tolling log analyser automates parsing and anomaly detection, surfacing patterns (like a classification sensor drifting for days) that manual review structurally could not find." },
    { tags: 'ai ml projects roadaid docsage computer vision langchain rag llm', text:
      "Outside the day job he builds AI/ML tools for problems he meets at work. RoadAid AI uses computer vision (OpenCV/CNN) on existing camera infrastructure to detect road incidents — accidents, debris, breakdowns — in seconds rather than minutes. DocSage AI is a LangChain assistant that reads SOPs and O&M manuals and answers technical questions against them. Portfolio: github.com/SINGHL25" },
    { tags: 'tritium ev charging quality 80 percent complaints support', text:
      "Before Kapsch he was at Tritium: as Technical Support Engineer (EV Charging) he gave global L2/L3 support for 50–175 kW DC fast chargers using Wireshark and Grafana, and as Quality Inspector he owned the CS3 quality work package, achieving an 80% reduction in field complaints through layered process audits, failure-mode investigation and corrective action." },
    { tags: 'electrical hv lv substation 33 11 kv transformer india emaar sahara', text:
      "His electrical engineering depth comes from India: Senior Electrical Engineer at EMAAR MGF and Executive Electrical Engineer at Sahara Prime City, operating and maintaining 33/11 kV substations and HV/LV distribution, plus HVAC and fire systems on high-rise and township projects, with engineering sign-off and handover documentation." },
    { tags: 'why hire strengths differentiator value', text:
      "Why hire him: he sits between the technology and the road. He pairs 14+ years of hands-on ITS, tolling and electrical delivery with a self-built AI/ML and data layer — few maintenance engineers can both run a live tolling estate and build the Python/ML tooling that finds silent faults in the passage data. Proven results: 80% fewer field complaints at Tritium and ~30% less manual fault analysis via automation." },
    { tags: 'tech stack skills tools technologies python cloud docker', text:
      "Technical stack: Python (Pandas, NumPy, Scikit-learn, OpenCV), machine learning and deep learning (TensorFlow, CNN), LangChain/RAG, Power BI, SQL, Splunk, Grafana, IBM Maximo (CMMS), Docker, Kubernetes, Azure and AWS. Domain: MLFF, GNSS, ANPR, DSRC, C-ITS, back office, RCA, preventive/predictive maintenance, SFAIRP, HV/LV and 33/11 kV." },
    { tags: 'education mba iim degree btech electrical certifications lean six sigma', text:
      "Education: Executive MBA (Finance) from IIM Calcutta (2015) and a B.Tech in Electrical Engineering from UPTU (2012). Certifications include Lean Six Sigma Green Belt, plus machine learning, deep learning and Azure/AWS cloud fundamentals." },
    { tags: 'location visa work rights relocation availability brisbane', text:
      "Akhi is based in Brisbane, QLD, holds full Australian work rights (Subclass 482 visa valid to February 2028) and is open to relocation across Australia. He is open to senior maintenance, reliability and ITS engineering roles." },
    { tags: 'contact email linkedin github reach', text:
      "You can reach him at akhi.singh1989@gmail.com, on LinkedIn (linkedin.com/in/akhilesh-kumar-singh-23115836) or GitHub (github.com/SINGHL25)." }
  ];

  var STOP = {the:1,a:1,an:1,is:1,are:1,of:1,to:1,and:1,in:1,on:1,for:1,with:1,his:1,he:1,what:1,tell:1,me:1,about:1,does:1,do:1,has:1,have:1,you:1,your:1,i:1,can:1,could:1,would:1,how:1,why:1,who:1,'s':1};
  function tokens(s){return (s.toLowerCase().match(/[a-z0-9]+/g)||[]).filter(function(t){return !STOP[t];});}

  function retrieve(q){
    var qt = tokens(q); if(!qt.length) return null;
    var best=null, bestScore=0;
    KB.forEach(function(chunk){
      var hay = (chunk.tags+' '+chunk.text).toLowerCase();
      var score=0;
      qt.forEach(function(t){ if(hay.indexOf(t)>=0) score += chunk.tags.indexOf(t)>=0 ? 2 : 1; });
      if(score>bestScore){bestScore=score;best=chunk;}
    });
    return bestScore>=1 ? best.text : null;
  }

  var FALLBACK = "I can answer questions about Akhi's ITS and tolling experience, his AI/ML projects (RoadAid AI, DocSage AI), his data and assurance work, tech stack, work rights, or how to reach him. Try one of the suggestions, or ask in your own words. For anything specific, email akhi.singh1989@gmail.com.";

  function answerLocal(q){
    var r = retrieve(q);
    return r || FALLBACK;
  }

  /* ---- optional backend (FastAPI + LangChain RAG) ---- */
  function answerRemote(q){
    return fetch(window.RECRUITER_API_URL, {
      method:'POST', headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ question: q })
    }).then(function(r){ if(!r.ok) throw new Error('backend'); return r.json(); })
      .then(function(d){ return d.answer || FALLBACK; });
  }

  var QUICK = [
    "Tell me about his ITS experience",
    "What projects has he built?",
    "Why should we hire him?",
    "What's his tech stack?",
    "Work rights & location?"
  ];

  /* ---- UI ---- */
  var mount = document.createElement('div');
  mount.innerHTML =
    '<button class="cb-fab" id="cbFab" aria-label="Ask about Akhi">'
    + '<span class="cb-fab__dot"></span>Ask about Akhi</button>'
    + '<div class="cb-panel" id="cbPanel" role="dialog" aria-label="Recruiter assistant" hidden>'
    +   '<div class="cb-head"><span class="cb-head__title">Recruiter assistant</span>'
    +     '<span class="cb-head__sub">Answers from Akhi\'s CV</span>'
    +     '<button class="cb-x" id="cbClose" aria-label="Close">×</button></div>'
    +   '<div class="cb-log" id="cbLog"></div>'
    +   '<div class="cb-chips" id="cbChips"></div>'
    +   '<form class="cb-input" id="cbForm"><input id="cbText" autocomplete="off" '
    +     'placeholder="Ask about his experience…" /><button type="submit" aria-label="Send">→</button></form>'
    + '</div>';
  document.body.appendChild(mount);

  var panel=document.getElementById('cbPanel'), log=document.getElementById('cbLog'),
      chips=document.getElementById('cbChips'), form=document.getElementById('cbForm'),
      text=document.getElementById('cbText');

  function bubble(who, msg){
    var el=document.createElement('div');
    el.className='cb-msg cb-msg--'+who;
    el.textContent=msg;
    log.appendChild(el); log.scrollTop=log.scrollHeight;
    return el;
  }
  function typing(){ var e=bubble('bot','…'); e.classList.add('cb-typing'); return e; }

  function ask(q){
    bubble('user', q);
    var t=typing();
    var render=function(ans){ t.classList.remove('cb-typing'); t.textContent=ans; log.scrollTop=log.scrollHeight; };
    if(window.RECRUITER_API_URL){
      answerRemote(q).then(render).catch(function(){ render(answerLocal(q)); });
    } else {
      setTimeout(function(){ render(answerLocal(q)); }, 350);
    }
  }

  QUICK.forEach(function(q){
    var c=document.createElement('button'); c.className='cb-chip'; c.textContent=q;
    c.addEventListener('click', function(){ ask(q); });
    chips.appendChild(c);
  });

  var opened=false;
  function open(){ panel.hidden=false; document.getElementById('cbFab').style.display='none';
    if(!opened){opened=true; bubble('bot',"Hi — I'm a small assistant that answers questions about Akhilesh from his CV. What would you like to know?");}
    setTimeout(function(){text.focus();},50); }
  function close(){ panel.hidden=true; document.getElementById('cbFab').style.display=''; }

  document.getElementById('cbFab').addEventListener('click', open);
  document.getElementById('cbClose').addEventListener('click', close);
  form.addEventListener('submit', function(e){ e.preventDefault(); var q=text.value.trim(); if(!q)return; text.value=''; ask(q); });
})();
