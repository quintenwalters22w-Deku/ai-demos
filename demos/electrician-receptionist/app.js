(() => {
  const $ = s => document.querySelector(s), $$ = s => [...document.querySelectorAll(s)];
  const st = { hours: 'day', busy: false, run: 0, sec: 0, timer: null, clock: { day: [9, 12], night: [21, 38] }, k: { ans: 0, book: 0, emer: 0, screen: 0 } };
  const night = () => st.hours === 'night';
  const GREET = 'Thanks for calling Sentinel Peak Electric, this is the virtual receptionist. How can I help?';

  // Each scenario is a small graph of nodes; each node is a list of steps.
  // Steps may be functions so business-hours vs after-hours can branch.
  const S = {
    panel: { title: 'Sparking panel', nodes: {
      start: [
        { ai: GREET },
        { c: "Hi, it's Dana. My breaker panel is buzzing and I saw a spark come out of it." },
        { note: { caller: 'Dana (example)', intent: 'Panel buzzing / spark', urgency: 'Checking…' } },
        { ai: 'That can be serious, so let me ask one safety question first. Do you smell burning, see smoke, or feel heat coming from the panel?' },
        { choose: [
          { t: 'Yes, it smells like burning', go: 'danger' },
          { t: 'No, just buzzing', go: 'buzz' } ] } ],
      danger: [
        { c: 'Yes, there\'s kind of a burning smell.' },
        { note: { urgency: '!EMERGENCY' } },
        { alert: '⚠️ Emergency keywords detected: spark + burning smell' },
        { ai: 'Okay. If you see smoke or flames, leave the house and call 911 right away. If it is safe to reach, switch off the main breaker, and keep everyone away from the panel.' },
        { ai: 'What is the address so I can send it to our on-call electrician?' },
        { c: '4120 East Fort Lowell Road.' },
        { note: { address: '4120 E Fort Lowell Rd', area: '+In area (85716)' } },
        s => night()
          ? { ai: "Thank you. I've paged our on-call electrician with your address and what you're seeing. Expect a call back within about 15 minutes. Is this the best number to reach you?" }
          : { ai: "Thank you. I'm sending this to our dispatcher as an emergency right now, and an electrician will call you back within a few minutes. Is this the best number?" },
        { c: 'Yes, this number is good.' },
        { end: { outcome: 'On-call paged', pill: 'emer', kind: 'emer',
          sms: '⚠️ EMERGENCY · Dana (520) 555-0148 · Panel spark + burning smell · 4120 E Fort Lowell Rd · Told: kill main, leave if smoke, 911 if fire. Promised callback ≈15 min.' } } ],
      buzz: [
        { c: "No smell or smoke, it's just buzzing and I saw one spark." },
        { note: { urgency: 'High (same day)' } },
        { ai: "Good. Please don't reset or flip any breakers for now and keep things clear of the panel. What's the address?" },
        { c: '4120 East Fort Lowell Road.' },
        { note: { address: '4120 E Fort Lowell Rd', area: '+In area (85716)' } },
        s => night()
          ? { ai: "I've flagged this for our on-call electrician. I can also hold the first slot tomorrow at 7:30 AM so you're covered either way. Want that?" }
          : { ai: "We have an electrician free this afternoon between 1 and 3 PM. Want me to put you in that window?" },
        { choose: [ { t: 'Yes, book it', go: 'buzzBook' }, { t: 'Just have someone call me', go: 'buzzCall' } ] } ],
      buzzBook: [
        { c: 'Yes please, book it.' },
        s => ({ ai: `Done. You're booked for ${night() ? 'tomorrow at 7:30 AM' : 'today, 1 to 3 PM'}. You'll get a text confirmation, and if anything changes, like smoke or a smell, call back and say "emergency."` }),
        s => ({ end: { outcome: night() ? 'Booked 7:30 AM + on-call flagged' : 'Booked today 1–3 PM', pill: 'book', kind: 'book',
          sms: `🔧 BOOKED · Dana (520) 555-0148 · Panel buzzing, 1 spark, no smell/smoke · 4120 E Fort Lowell Rd · ${night() ? 'Tomorrow 7:30 AM (on-call also flagged)' : 'Today 1–3 PM'}. Told not to reset breakers.` } }) ],
      buzzCall: [
        { c: 'Can someone just call me first?' },
        { ai: "Absolutely. I'll have an electrician call you shortly. If you notice smoke, heat or a burning smell before then, call back and say \"emergency.\"" },
        { end: { outcome: 'Callback requested', pill: 'info', kind: 'info',
          sms: '📞 CALL BACK · Dana (520) 555-0148 · Panel buzzing, 1 spark, no smell/smoke · 4120 E Fort Lowell Rd · Wants a call before booking.' } } ] } },

    ev: { title: 'EV charger quote', nodes: {
      start: [
        { ai: GREET },
        { c: "Hey, I'm Marcus. I just got an electric car and need a charger put in my garage." },
        { note: { caller: 'Marcus (example)', intent: 'EV charger install', urgency: 'Normal' } },
        { ai: 'Congrats on the new car! A couple of quick questions so the electrician comes prepared. Do you already have the charger, or do you need us to supply one?' },
        { choose: [ { t: 'I already bought one', go: 'have' }, { t: 'I need one supplied', go: 'need' } ] } ],
      have: [ { c: 'I already have the wall charger in a box.' }, { note: { intent: 'EV charger install (customer unit)' } }, { go: 'panel' } ],
      need: [ { c: "I don't have one yet, can you supply it?" }, { note: { intent: 'EV charger supply + install' } }, { go: 'panel' } ],
      panel: [
        { ai: 'Got it. How far is your electrical panel from where you park, roughly?' },
        { choose: [ { t: 'Same garage wall', go: 'near' }, { t: 'Other side of the house', go: 'far' } ] } ],
      near: [ { c: "It's right there on the garage wall." }, { note: { urgency: 'Normal · simple run' } }, { ai: 'That usually keeps things simpler. As an example ballpark, installs like that often land around $650 to $1,100. The on-site visit confirms your panel can handle it and gives you an exact price.' }, { go: 'addr' } ],
      far: [ { c: "It's on the far side of the house, maybe 60 feet." }, { note: { urgency: 'Normal · long run, check panel' } }, { ai: 'Thanks. Longer runs cost more and sometimes need a panel upgrade. As an example ballpark, $1,200 to $2,400. The on-site visit gives you the exact number.' }, { go: 'addr' } ],
      addr: [
        { ai: "What's the address for the visit?" },
        { c: '9810 North Shannon Road in Oro Valley.' },
        { note: { address: '9810 N Shannon Rd', area: '+In area (85742)' } },
        { ai: 'Perfect, that is in our area. I have Tuesday at 10 AM or Thursday at 3 PM for a free on-site estimate. Which works?' },
        { choose: [ { t: 'Tuesday 10 AM', go: 'tue' }, { t: 'Thursday 3 PM', go: 'thu' } ] } ],
      tue: [ { c: 'Tuesday at 10 works.' }, { set: 'Tue 10 AM' }, { go: 'done' } ],
      thu: [ { c: 'Thursday at 3, please.' }, { set: 'Thu 3 PM' }, { go: 'done' } ],
      done: [
        s => ({ ai: `You're all set for ${s.slot}. I'll text you a confirmation and a photo checklist (panel label and parking spot) so the electrician can quote faster.` }),
        s => ({ end: { outcome: `Estimate booked ${s.slot}`, pill: 'book', kind: 'book',
          sms: `⚡ NEW EV LEAD · Marcus (520) 555-0192 · ${s.notes.intent} · ${s.notes.urgency} · 9810 N Shannon Rd, Oro Valley · Estimate ${s.slot}. Photo checklist sent.` } }) ] } },

    outlet: { title: 'Dead outlets', nodes: {
      start: [
        { ai: GREET },
        { c: "Hi, it's Priya. Half the outlets in my kitchen just stopped working." },
        { note: { caller: 'Priya (example)', intent: 'Kitchen outlets dead', urgency: 'Low–normal' } },
        { ai: "Sorry about that. Before booking a visit, one quick check that fixes this a lot: is there an outlet with TEST and RESET buttons nearby, maybe by the sink? Try pressing RESET firmly." },
        { sys: '…caller checks…' },
        { choose: [ { t: 'That fixed it!', go: 'fixed' }, { t: 'Still dead', go: 'dead' } ] } ],
      fixed: [
        { c: 'Oh wow, I pressed it and they all came back on!' },
        { note: { outcome: '+Solved on the call' } },
        { ai: "Great! If it keeps tripping, that can mean a worn outlet or a moisture problem, so give us a call and we'll take a look. Have a good day, Priya." },
        { end: { outcome: 'Solved on call (GFCI reset)', pill: 'info', kind: 'info',
          sms: 'ℹ️ FYI · Priya (520) 555-0117 · Kitchen outlets dead, fixed by GFCI reset on the call. No visit needed. Told to call if it keeps tripping.' } } ],
      dead: [
        { c: "I pressed it but nothing's working still." },
        { note: { urgency: 'Normal (no heat/smell)' } },
        { ai: "Thanks for trying. Any warm outlets, burning smell, or flickering lights?" },
        { c: 'No, nothing like that.' },
        { ai: "Okay, that's not an emergency. What's the address?" },
        { c: '2235 South Kolb Road.' },
        { note: { address: '2235 S Kolb Rd', area: '+In area (85710)' } },
        s => ({ ai: night() ? "Our first opening is tomorrow between 8 and 10 AM. I've put you down for that and you'll get a text confirmation." : 'I can get someone there tomorrow between 8 and 10 AM. I have booked that for you and you will get a text confirmation.' }),
        { end: { outcome: 'Booked tomorrow 8–10 AM', pill: 'book', kind: 'book',
          sms: '🔧 BOOKED · Priya (520) 555-0117 · Kitchen outlets dead, GFCI reset tried, no heat/smell · 2235 S Kolb Rd · Tomorrow 8–10 AM.' } } ] } },

    screen: { title: 'Sales / out of area', nodes: {
      start: [
        { ai: GREET },
        { choose: [ { t: 'Robocall about "your business listing"', go: 'robo' }, { t: 'Homeowner in Phoenix', go: 'far' } ] } ],
      robo: [
        { c: "This is your final notice about your business's online listing. Press one to speak to an agent." },
        { note: { caller: 'Unknown (example)', intent: 'Sales / robocall', urgency: '—' } },
        { ai: "Thanks, we're not interested. Please remove this number from your list." },
        { sys: 'Call ended by receptionist · no owner alert' },
        { end: { outcome: 'Screened: sales call', pill: 'screen', kind: 'screen', sms: null } } ],
      far: [
        { c: "Hi, I'm Lee. I need a ceiling fan installed at my place in Phoenix." },
        { note: { caller: 'Lee (example)', intent: 'Ceiling fan install' } },
        { ai: "Happy to help where we can. What's the ZIP code?" },
        { c: "It's 85004." },
        { note: { address: 'ZIP 85004', area: '!Outside area' } },
        { ai: "Thanks, Lee. Unfortunately that's outside our Tucson service area, so we're not the right fit, and I'd rather tell you now than waste your time. A local electrician near you will be able to get there sooner." },
        { end: { outcome: 'Out of area, politely declined', pill: 'screen', kind: 'screen', sms: null } } ] } }
  };

  const tx = $('#transcript'), ch = $('#choices');
  const wait = ms => new Promise(r => setTimeout(r, $('#fast').checked ? ms / 4 : ms));
  const add = (cls, html) => { const li = document.createElement('li'); li.className = cls; li.innerHTML = html; tx.appendChild(li); tx.scrollTop = tx.scrollHeight; return li; };
  const who = { ai: 'Receptionist', caller: 'Caller' };

  function setNote(k, v) {
    const dd = document.querySelector(`#notes dd[data-k="${k}"]`); if (!dd) return;
    dd.classList.remove('hi', 'ok');
    if (v[0] === '!') { dd.classList.add('hi'); v = v.slice(1); } else if (v[0] === '+') { dd.classList.add('ok'); v = v.slice(1); }
    dd.textContent = v; st.notes[k] = v; dd.classList.remove('flash'); void dd.offsetWidth; dd.classList.add('flash');
  }
  function lock(on) {
    st.busy = on;
    $$('.scn').forEach(b => b.disabled = on); $$('.seg button').forEach(b => b.disabled = on);
  }
  function clock() {
    const [h, m] = st.clock[st.hours]; const d = new Date(2026, 0, 1, h, m + st.k.ans * 7);
    return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  }

  async function runNode(scn, name, id) {
    for (const raw of scn.nodes[name]) {
      if (id !== st.run) return;
      const s = typeof raw === 'function' ? raw(st) : raw;
      if (s.ai) { const t = add('ai', '<span class="typing" aria-label="Receptionist is speaking"><i></i><i></i><i></i></span>'); await wait(650 + Math.min(s.ai.length * 14, 1500)); t.innerHTML = `<span class="who">${who.ai}</span>${s.ai}`; tx.scrollTop = tx.scrollHeight; await wait(350); }
      else if (s.c) { await wait(250); add('caller', `<span class="who">${who.caller}</span>${s.c}`); await wait(600); }
      else if (s.sys) { add('sys', s.sys); await wait(700); }
      else if (s.alert) { add('alert', s.alert); $('#dot').className = 'dot emer'; await wait(600); }
      else if (s.note) { Object.entries(s.note).forEach(([k, v]) => setNote(k, v)); await wait(200); }
      else if (s.set) { st.slot = s.set; }
      else if (s.go) { return runNode(scn, s.go, id); }
      else if (s.choose) { return choose(scn, s.choose, id); }
      else if (s.end) { return end(scn, s.end); }
    }
  }
  function choose(scn, opts, id) {
    ch.innerHTML = '<p>What does the caller say?</p>';
    opts.forEach((o, i) => { const b = document.createElement('button'); b.className = 'choice'; b.type = 'button'; b.textContent = o.t;
      b.onclick = () => { ch.innerHTML = ''; runNode(scn, o.go, id); }; ch.appendChild(b); if (i === 0) setTimeout(() => b.focus({ preventScroll: true }), 30); });
  }
  function end(scn, e) {
    clearInterval(st.timer); $('#dot').className = 'dot'; $('#callTitle').textContent = `Call ended · ${scn.title}`;
    setNote('outcome', (e.kind === 'emer' ? '!' : e.kind === 'screen' ? '' : '+') + e.outcome);
    add('sys', `Call ended · ${fmt(st.sec)} · ${e.sms ? 'summary texted to owner' : 'no owner alert needed'}`);
    const time = clock();
    st.k.ans++; if (e.kind === 'book') st.k.book++; if (e.kind === 'emer') st.k.emer++; if (e.kind === 'screen') st.k.screen++;
    $('#kAns').textContent = st.k.ans; $('#kBook').textContent = st.k.book; $('#kEmer').textContent = st.k.emer; $('#kScreen').textContent = st.k.screen;
    const body = $('#logBody'); body.querySelector('.empty')?.remove();
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${time}</td><td>${st.notes.caller || '—'}</td><td>${st.notes.intent || '—'}</td><td><span class="pill ${e.pill}">${e.outcome}</span></td>`;
    body.prepend(tr);
    if (e.sms) {
      const box = $('#ownerSms'); box.querySelector('.op-empty')?.remove();
      const m = document.createElement('div'); m.className = 'sms' + (e.kind === 'emer' ? ' emer' : ''); m.innerHTML = `<b>Receptionist · ${time}</b>${e.sms}`; box.prepend(m);
    }
    ch.innerHTML = '<p>Try another caller, or switch the time of call and run the same one again.</p>';
    lock(false);
  }
  const fmt = s => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

  function start(key) {
    if (st.busy) return;
    const scn = S[key]; st.run++; st.notes = {}; st.slot = null; st.sec = 0;
    $$('.scn').forEach(b => b.setAttribute('aria-checked', b.dataset.s === key));
    $$('#notes dd').forEach(d => { d.textContent = '—'; d.className = ''; });
    tx.innerHTML = ''; ch.innerHTML = ''; lock(true);
    $('#dot').className = 'dot live'; $('#callTitle').textContent = `Live · ${scn.title}${night() ? ' · after hours' : ''}`; $('#timer').textContent = '00:00';
    clearInterval(st.timer); st.timer = setInterval(() => { st.sec++; $('#timer').textContent = fmt(st.sec); }, 1000);
    add('sys', `Incoming call · ${clock()} · answered on first ring`);
    runNode(scn, 'start', st.run);
  }
  $$('.scn').forEach(b => b.addEventListener('click', () => start(b.dataset.s)));
  $$('.seg button').forEach(b => b.addEventListener('click', () => { if (st.busy) return; st.hours = b.dataset.h; $$('.seg button').forEach(x => x.setAttribute('aria-checked', x === b)); }));
  // arrow-key support for the radio groups
  [['.scenarios', '.scn'], ['.seg', 'button']].forEach(([g, i]) => $(g).addEventListener('keydown', e => {
    if (!['ArrowRight', 'ArrowLeft', 'ArrowDown', 'ArrowUp'].includes(e.key)) return;
    const items = [...$(g).querySelectorAll(i)], n = items.indexOf(document.activeElement); if (n < 0) return;
    e.preventDefault(); items[(n + (e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1 : items.length - 1)) % items.length].focus();
  }));

  // missed-call calculator (example estimates)
  const money = n => '$' + Math.round(n).toLocaleString('en-US');
  function calc() {
    const miss = +$('#miss').value, rate = +$('#rate').value / 100, job = +$('#job').value;
    $('#oMiss').textContent = miss; $('#oRate').textContent = Math.round(rate * 100) + '%'; $('#oJob').textContent = money(job);
    const jobs = miss * rate * 4.33, rev = jobs * job, weekly = rev / 4.33;
    $('#rJobs').textContent = Math.round(jobs); $('#rRev').textContent = money(rev);
    const wks = weekly > 0 ? Math.ceil(1000 / weekly) : 0;
    $('#rBreak').textContent = wks <= 1 ? '1 week' : wks > 52 ? 'over a year' : `${wks} weeks`;
  }
  ['#miss', '#rate', '#job'].forEach(s => $(s).addEventListener('input', calc)); calc();
})();
