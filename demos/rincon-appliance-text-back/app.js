(() => {
  const $ = s => document.querySelector(s), $$ = s => [...document.querySelectorAll(s)];
  const st = { hours: 'day', run: 0, busy: false, sim: 0, pending: null, k: { miss: 0, text: 0, reply: 0, book: 0, stop: 0, rev: 0 } };
  const night = () => st.hours === 'night';
  const fast = () => $('#fast').checked;
  const money = n => '$' + Math.round(n).toLocaleString('en-US');
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const ABORT = Symbol('abort');

  /* ---------- clock + helpers ---------- */
  const base = () => night() ? [20, 47] : [10, 14];
  function clock(sec) {
    const [h, m] = base(); const d = new Date(2026, 10, 20, h, m, 0); d.setSeconds(d.getSeconds() + sec);
    return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  }
  const off = s => `+${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
  function wait(ms) {
    const run = st.run;
    return new Promise((res, rej) => setTimeout(() => run === st.run ? res() : rej(ABORT), fast() ? ms * 0.12 : ms));
  }
  function scrollIn(el) { el.scrollTop = el.scrollHeight; }
  function clearEmpty(el) { const e = el.querySelector('.empty,.ph-empty,.op-empty'); if (e) e.remove(); }

  function tl(cls, label, detail, dt = 0) {
    st.sim += dt;
    const ol = $('#timeline'); clearEmpty(ol);
    const li = document.createElement('li'); li.className = cls;
    li.innerHTML = `<span class="tl-t">${off(st.sim)} · ${clock(st.sim)}</span><span class="tl-l">${esc(label)}</span>${detail ? `<span class="tl-d">${esc(detail)}</span>` : ''}`;
    ol.appendChild(li); scrollIn(ol); $('#tlClock').textContent = off(st.sim);
  }
  function feed(text) {
    const ol = $('#feed'); clearEmpty(ol);
    const li = document.createElement('li'); li.innerHTML = `<time>${clock(st.sim)}</time><span>${esc(text)}</span>`;
    ol.prepend(li);
  }
  function kpi(key, by = 1) {
    st.k[key] += by;
    const id = { miss: 'kMiss', text: 'kText', reply: 'kReply', book: 'kBook', stop: 'kStop', rev: 'kRev' }[key];
    const el = document.getElementById(id);
    el.textContent = key === 'rev' ? money(st.k.rev) : st.k[key];
    el.classList.remove('bump'); void el.offsetWidth; el.classList.add('bump');
  }
  function bubble(cls, text) {
    const ol = $('#thread'); clearEmpty(ol);
    const li = document.createElement('li'); li.className = cls; li.textContent = text;
    ol.appendChild(li); scrollIn(ol); return li;
  }
  async function biz(text, cls = '') {
    const ol = $('#thread'); clearEmpty(ol);
    const t = document.createElement('li'); t.className = 'typing'; t.setAttribute('aria-label', 'typing');
    t.innerHTML = '<i></i><i></i><i></i>'; ol.appendChild(t); scrollIn(ol);
    try { await wait(Math.min(1600, 600 + text.length * 8)); } finally { t.remove(); }
    bubble('biz ' + cls, text);
    await wait(350);
  }
  async function cus(text) { bubble('cus', text); await wait(500); }
  function owner(text) {
    const box = $('#ownerSms'); clearEmpty(box);
    const d = document.createElement('div'); d.className = 'osms';
    d.innerHTML = `<small>Text-back · ${clock(st.sim)}</small>${esc(text)}`;
    box.prepend(d);
  }
  function ask(opts, { stop = true } = {}) {
    const box = $('#replies'); box.innerHTML = '';
    const all = stop ? [...opts, { t: 'STOP', v: 'STOP', stop: true }] : opts;
    return new Promise((res, rej) => {
      st.pending = rej;
      const hint = document.createElement('p'); hint.className = 'hint'; hint.textContent = 'Pick the customer\'s reply:'; box.appendChild(hint);
      all.forEach((o, i) => {
        const b = document.createElement('button'); b.type = 'button'; b.textContent = o.stop ? 'Reply "STOP" (opt out)' : o.t;
        if (o.stop) b.className = 'stopbtn';
        b.addEventListener('click', () => { box.innerHTML = ''; st.pending = null; res(o); });
        box.appendChild(b);
        if (i === 0) setTimeout(() => b.isConnected && b.focus({ preventScroll: true }), 30);
      });
    });
  }

  /* ---------- scenarios (all example content) ---------- */
  const SC = {
    fridge: {
      name: 'Maria (example)', phone: '(520) 555-0172', appliance: 'Refrigerator', value: 340,
      opener: "Hi, it's Maria. My fridge stopped cooling, everything inside is getting warm",
      brands: ['Samsung', 'Whirlpool', 'LG', 'Not sure'],
      symptoms: [{ t: 'Fridge warm, freezer still cold' }, { t: 'Both warm, not running at all' }, { t: 'Clicks on, then shuts off' }],
      zips: [{ t: '85710', ok: true }, { t: '85718', ok: true }, { t: '85301 (Glendale)', ok: false }],
      tip: () => ({ label: 'Food-spoilage urgency tip sent', text: 'Quick tip while you wait: keep both doors shut. A closed fridge holds food cold about 4 hours and a full freezer about 48. If it has been longer, move milk, meat and meds to a cooler with ice.' }),
      priority: true
    },
    washer: {
      name: 'Derek (example)', phone: '(520) 555-0119', appliance: 'Washer', value: 260,
      opener: "Hey, Derek here. Washer is leaking all over the laundry room floor",
      brands: ['Whirlpool', 'Maytag', 'GE', 'Not sure'],
      symptoms: [{ t: 'Leaks only while filling' }, { t: 'Leaks during the spin cycle' }, { t: 'Leaks from the front door' }],
      zips: [{ t: '85745', ok: true }, { t: '85741', ok: true }, { t: '85602 (Benson)', ok: false }],
      tip: () => ({ label: 'Water-damage tip sent', text: 'Quick tip: turn off the two water valves behind the washer and skip any more loads. Towels down along the baseboard help protect the floor until we get there.' })
    },
    oven: {
      name: 'Priya (example)', phone: '(520) 555-0164', appliance: 'Oven / range', value: 300,
      opener: "Hi! This is Priya. My oven won't heat up, I have people coming Saturday",
      brands: ['GE', 'Frigidaire', 'Bosch', 'Not sure'],
      symptoms: [{ t: 'Electric: bake not heating, broil works' }, { t: 'Gas: igniter glows, no flame' }, { t: 'I smell gas near it', danger: true }],
      zips: [{ t: '85711', ok: true }, { t: '85750', ok: true }, { t: '86001 (Flagstaff)', ok: false }],
      tip: s => s.t.startsWith('Electric')
        ? { label: 'Quick-check tip sent', text: 'Quick check: if the clock is flashing, a power blip may have reset it. Flip the oven breaker off for 1 minute, then back on. If bake still won\'t heat, it\'s likely the bake element, which we carry on the truck.' }
        : { label: 'Quick-check tip sent', text: 'Thanks. A glowing igniter with no flame is usually a weak igniter, a common fix. Please don\'t keep retrying it; leave it off until the tech arrives.' }
    }
  };

  async function opening(c) {
    tl('miss', 'Missed call', `${c.phone} · rang 5 times, no answer${night() ? ' · after hours' : ' · tech on a job'}`);
    kpi('miss'); feed(`Missed call from ${c.phone}`);
    bubble('sys call', `📵 Missed call to Rincon Appliance Rescue · ${clock(st.sim)}`);
    await wait(700);
    tl('text', 'Auto text-back sent', 'Within 5 seconds, from the shop\'s number', 5);
    kpi('text'); feed(`Text-back sent to ${c.phone}`);
    await biz(night()
      ? "Hi, this is Rincon Appliance Rescue. Sorry we missed your call! We're closed for the night (we open at 7 AM), but I can get you on tomorrow's schedule right now. What's going on? Reply STOP to opt out."
      : "Hi, this is Rincon Appliance Rescue. Sorry we missed your call, our tech is on a job. What appliance can we help with? Reply STOP to opt out.");
  }
  async function optOut(c) {
    await cus('STOP');
    tl('stop', 'Customer replied STOP', 'Number added to the do-not-text list', 20);
    kpi('stop'); feed(`${c.phone} opted out (STOP honored)`);
    await biz("You're unsubscribed from Rincon Appliance Rescue texts. No more messages will be sent. You can still call us anytime.");
    tl('stop', 'Opt-out confirmed, automation stopped', 'No further automated texts to this number', 2);
    owner(`🚫 OPTED OUT · ${c.phone} replied STOP. No more automated texts. Call them yourself if you want to follow up.`);
    return 'Opted out';
  }

  async function appliance(key) {
    const c = SC[key];
    await opening(c);
    let o = await ask([{ t: c.opener }]);
    if (o.stop) return optOut(c);
    await cus(c.opener);
    tl('', 'Customer replied', `Appliance: ${c.appliance}`, 38); kpi('reply'); feed(`${c.name.split(' ')[0]} replied: ${c.appliance.toLowerCase()}`);

    await biz(`Sorry to hear that! Let's get it fixed. What brand is the ${c.appliance.split(' ')[0].toLowerCase()}?`);
    o = await ask(c.brands.map(t => ({ t })));
    if (o.stop) return optOut(c);
    const brand = o.t; await cus(brand);
    tl('', 'Brand noted', brand === 'Not sure' ? 'Unknown, tech will check the model tag' : brand, 14);

    await biz(c.appliance === 'Refrigerator' ? "Got it. Which sounds most like what it's doing?" : 'Thanks. Which of these sounds closest?');
    o = await ask(c.symptoms);
    if (o.stop) return optOut(c);
    const sym = o; await cus(sym.t);
    tl(sym.danger ? 'warn' : '', 'Symptom noted', sym.t, 18);

    if (sym.danger) {
      tl('warn', 'Safety keyword detected: gas smell', 'Booking paused, safety steps sent first', 1);
      await biz("Please stop using the oven now. Don't flip switches or light anything. Open windows if it's safe, leave the house, and call the gas company or 911 from outside. We're alerting the owner to call you as soon as you're safe.", 'tip');
      owner(`⚠️ SAFETY · ${c.name} ${c.phone} · ${brand} range · smells gas. Told to leave and call gas co./911. Call them back once they're safe.`);
      tl('text', 'Owner alerted immediately', 'Priority text to owner\'s phone', 2);
      feed(`Safety alert sent to owner for ${c.phone}`);
      return 'Safety escalation';
    }

    await biz(`What ZIP code is the ${c.appliance.split(' ')[0].toLowerCase()} in? Just making sure we cover your area.`);
    o = await ask(c.zips);
    if (o.stop) return optOut(c);
    const zip = o; await cus(zip.t.split(' ')[0]);
    if (!zip.ok) {
      tl('warn', 'Service-area check: outside area', `ZIP ${zip.t}`, 12);
      await biz(`Thanks! ${zip.t.split(' ')[0]} is outside our Tucson service area, so we can't send a tech there, sorry. A local shop near you will get there faster. Good luck with the repair!`);
      owner(`📍 OUT OF AREA · ${c.name} ${c.phone} · ${brand} ${c.appliance.toLowerCase()}, ${sym.t.toLowerCase()} · ZIP ${zip.t.split(' ')[0]}. Politely declined, no action needed.`);
      tl('text', 'Owner summary sent', 'Logged as out of area', 2);
      feed(`${c.phone} outside service area`);
      return 'Out of area';
    }
    tl('good', 'Service-area check passed', `ZIP ${zip.t} is in the Tucson service area`, 12);

    const tip = c.tip(sym);
    if (c.priority) tl('warn', 'Urgency: food at risk', 'Marked priority, earliest slots offered first', 1);
    await biz(tip.text, 'tip');
    tl('', tip.label, '', 3);

    const slots = night()
      ? (c.priority ? ['Tomorrow 7–9 AM (first slot)', 'Tomorrow 9–11 AM', 'Call me in the morning'] : ['Tomorrow 9–11 AM', 'Tomorrow 1–3 PM', 'Call me in the morning'])
      : (c.priority ? ['Today 1–3 PM', 'Today 3–5 PM', 'Call me first'] : ['Today 3–5 PM', 'Tomorrow 8–10 AM', 'Call me first']);
    await biz(`You're all set to book. Our open times${c.priority ? ' (earliest first, since food is at risk)' : ''}:\n• ${slots[0]}\n• ${slots[1]}\nWhich works? Or say if you'd rather we call you.`);
    tl('', 'Open slots offered', `${slots[0]} · ${slots[1]}`, 2);
    o = await ask(slots.map(t => ({ t })));
    if (o.stop) return optOut(c);
    await cus(o.t);
    if (/^Call me/.test(o.t)) {
      tl('', 'Callback requested', night() ? 'First call of the morning' : 'Owner to call back', 25);
      await biz(night() ? "No problem. We'll call you right at 7 AM. Thanks for reaching out!" : "No problem, the owner will call you within the hour. Thanks!");
      owner(`📞 CALL BACK · ${c.name} ${c.phone} · ${brand} ${c.appliance.toLowerCase()}: ${sym.t.toLowerCase()} · ZIP ${zip.t}${c.priority ? ' · FOOD AT RISK' : ''} · wants a call ${night() ? 'at 7 AM' : 'within the hour'}.`);
      tl('text', 'Owner summary sent', '', 2); feed(`${c.phone} asked for a callback`);
      return 'Callback requested';
    }
    tl('good', 'Repair booked', o.t, 25);
    kpi('book'); kpi('rev', c.value); feed(`Booked ${c.name.split(' ')[0]} · ${o.t} · +${money(c.value)} example ticket`);
    await biz(`Booked! ${o.t}. Your tech will text when on the way. Reply here if anything changes.`);
    owner(`🔧 BOOKED · ${c.name} ${c.phone} · ${brand} ${c.appliance.toLowerCase()}: ${sym.t.toLowerCase()} · ZIP ${zip.t}${c.priority ? ' · FOOD AT RISK, tip sent' : ''} · ${o.t}.`);
    tl('text', 'Owner summary sent', 'Name, number, appliance, symptom, ZIP, time', 2);
    return 'Booked';
  }

  async function spam() {
    const c = { name: 'Unknown caller', phone: '(602) 555-0133' };
    await opening(c);
    const o = await ask([
      { t: "Hi! This is Jake with Local Listing Boost, is the owner available? We can get you to #1 on maps…", v: 'sales' },
      { t: "Hi, my dryer won't spin, can you come out today?", v: 'far' }
    ]);
    if (o.stop) return optOut(c);
    await cus(o.t);
    kpi('reply');
    if (o.v === 'sales') {
      tl('warn', 'Sales pitch detected', 'No booking offered, owner not interrupted', 30);
      await biz("Thanks, but we're not interested. This number is for repair customers only. Have a good day!");
      tl('stop', 'Thread closed, added to filter list', 'Future calls from this number skip text-back', 2);
      owner(`🛡️ FILTERED · ${c.phone} · marketing/sales pitch. Declined politely. No action needed (shows in your daily digest only).`);
      feed(`Filtered sales pitch from ${c.phone}`);
      return 'Filtered (sales)';
    }
    tl('', 'Customer replied', 'Appliance: dryer', 30); feed(`${c.phone} replied: dryer`);
    await biz("Sorry about the dryer! What ZIP code is it in? Just making sure we cover your area.");
    const z = await ask([{ t: '85004 (Phoenix)' }, { t: '85281 (Tempe)' }]);
    if (z.stop) return optOut(c);
    const zip = z.t.split(' ')[0]; await cus(zip);
    tl('warn', 'Service-area check: outside area', `ZIP ${z.t}, about 110 miles away`, 12);
    await biz(`Thanks! ${zip} is outside our Tucson service area, so we can't get a tech to you. A shop near you will be much faster. Hope it's an easy fix!`);
    owner(`📍 OUT OF AREA · ${c.phone} · dryer won't spin · ZIP ${zip}. Politely declined, no action needed.`);
    tl('text', 'Owner summary sent', 'Logged as out of area', 2);
    feed(`${c.phone} outside service area`);
    return 'Out of area';
  }

  /* ---------- run control ---------- */
  function lock(on) {
    st.busy = on;
    $$('.scn').forEach(b => b.disabled = on);
    $$('.seg button').forEach(b => b.disabled = on);
    $('#demo').dataset.state = on ? 'running' : 'idle';
  }
  function clearStage() {
    $('#timeline').innerHTML = '<li class="empty">Pick a missed call above to start.</li>';
    $('#thread').innerHTML = '<li class="ph-empty">Texts appear here after a missed call.</li>';
    $('#replies').innerHTML = ''; $('#tlClock').textContent = '+0:00'; st.sim = 0;
  }
  async function start(key) {
    if (st.busy) return;
    st.run++; clearStage(); lock(true);
    $$('.scn').forEach(b => b.setAttribute('aria-checked', String(b.dataset.s === key)));
    $('#phSub').textContent = `${key === 'spam' ? '(602) 555-0133' : SC[key].phone} · simulated`;
    try {
      const out = key === 'spam' ? await spam() : await appliance(key);
      tl('end', `Done: ${out}`, 'Pick another missed call to run it again');
      const r = $('#replies'); r.innerHTML = '<p class="hint">Conversation finished. Pick another missed call above.</p>';
    } catch (e) { if (e !== ABORT) { console.error(e); } return; }
    lock(false);
  }
  function resetAll() {
    st.run++; if (st.pending) { const p = st.pending; st.pending = null; p(ABORT); }
    lock(false); clearStage();
    $$('.scn').forEach(b => b.setAttribute('aria-checked', 'false'));
    Object.keys(st.k).forEach(k => st.k[k] = 0);
    ['kMiss', 'kText', 'kReply', 'kBook', 'kStop'].forEach(id => $('#' + id).textContent = '0'); $('#kRev').textContent = '$0';
    $('#ownerSms').innerHTML = '<p class="op-empty">Summary texts land here when a conversation wraps up.</p>';
    $('#feed').innerHTML = '<li class="empty">No activity yet.</li>';
    $('#phSub').textContent = "Customer's phone · simulated";
  }

  // radiogroup keyboard support (arrow keys move between options)
  function arrows(group) {
    group.addEventListener('keydown', e => {
      if (!['ArrowRight', 'ArrowDown', 'ArrowLeft', 'ArrowUp'].includes(e.key)) return;
      const items = [...group.querySelectorAll('[role="radio"]:not(:disabled)')]; if (!items.length) return;
      const i = items.indexOf(document.activeElement); const d = /Right|Down/.test(e.key) ? 1 : -1;
      items[(i + d + items.length) % items.length].focus(); e.preventDefault();
    });
  }
  $$('[role="radiogroup"]').forEach(arrows);
  $$('.scn').forEach(b => b.addEventListener('click', () => start(b.dataset.s)));
  $$('.seg button').forEach(b => b.addEventListener('click', () => {
    if (st.busy) return; st.hours = b.dataset.h;
    $$('.seg button').forEach(x => x.setAttribute('aria-checked', String(x === b)));
  }));
  $('#reset').addEventListener('click', resetAll);

  /* ---------- calculator ---------- */
  function calc() {
    const miss = +$('#miss').value, rate = +$('#rate').value / 100, job = +$('#job').value;
    $('#oMiss').textContent = miss; $('#oRate').textContent = Math.round(rate * 100) + '%'; $('#oJob').textContent = money(job);
    const jobs = miss * 4.33 * rate, rev = jobs * job, net = rev - 99;
    $('#rJobs').textContent = jobs < 10 ? jobs.toFixed(1) : Math.round(jobs);
    $('#rRev').textContent = money(rev); $('#rNet').textContent = money(net);
    let txt;
    if (net <= 0) txt = 'Not at these numbers';
    else {
      const days = 1000 / (net / 30.4);
      txt = days <= 7 ? 'under 1 week' : days < 56 ? `${Math.ceil(days / 7)} weeks` : `${(days / 30.4).toFixed(1)} months`;
    }
    $('#rBreak').textContent = txt;
  }
  ['miss', 'rate', 'job'].forEach(id => $('#' + id).addEventListener('input', calc)); calc();

  /* ---------- FAQ accordion ---------- */
  $$('#acc button').forEach(b => b.addEventListener('click', () => {
    const open = b.getAttribute('aria-expanded') === 'true';
    b.setAttribute('aria-expanded', String(!open));
    document.getElementById(b.getAttribute('aria-controls')).hidden = open;
  }));
})();
