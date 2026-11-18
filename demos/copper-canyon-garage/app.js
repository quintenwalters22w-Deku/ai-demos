(()=>{
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
// mobile nav
const t=$('.toggle'),m=$('#menu');
if(t){t.addEventListener('click',()=>{const o=t.getAttribute('aria-expanded')!=='true';t.setAttribute('aria-expanded',o);t.setAttribute('aria-label',o?'Close menu':'Open menu');m.classList.toggle('open',o)});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&m.classList.contains('open')){t.click();t.focus()}})}
// hero door
const door=$('#heroDoor');if(door&&!reduce)door.classList.add('go');
// example text thread
const th=$('#thread');
if(th){const msgs=[['sys','Missed call · 8:52 PM'],['out',"Hi, this is Copper Canyon Garage Doors. Sorry we missed you! What's going on with your door?"],['in','Spring snapped and my car is stuck inside 😩'],['out',"Ugh, sorry! Please don't try to lift it by hand. We have an emergency tech tonight, or first slot tomorrow is 7–9am. Which works?"],['in','Tomorrow 7–9 works'],['out',"You're booked for 7–9am ✅ We'll text when the tech is 20 min out."]];
let i=0;const step=()=>{if(i>=msgs.length){setTimeout(()=>{th.innerHTML='';i=0;step()},4000);return}const[c,txt]=msgs[i++];const b=document.createElement('div');b.className='bub '+c;b.textContent=txt;th.appendChild(b);setTimeout(step,reduce?0:1500)};
if(reduce){msgs.forEach(([c,x])=>{const b=document.createElement('div');b.className='bub '+c;b.textContent=x;th.appendChild(b)})}else{
const io=new IntersectionObserver(es=>{if(es[0].isIntersecting){io.disconnect();step()}},{threshold:.3});io.observe(th)}}
// counters
const cs=$$('[data-count]');if(cs.length){const io=new IntersectionObserver(es=>es.forEach(e=>{if(!e.isIntersecting)return;io.unobserve(e.target);const el=e.target,n=+el.dataset.count;if(reduce){el.textContent=n.toLocaleString();return}let s=null;const f=ts=>{s??=ts;const p=Math.min(1,(ts-s)/1200);el.textContent=Math.round(n*(1-Math.pow(1-p,3))).toLocaleString();if(p<1)requestAnimationFrame(f)};requestAnimationFrame(f)}),{threshold:.4});cs.forEach(c=>io.observe(c))}
// estimator
const form=$('#estForm');
if(form){
const JOBS={spring:{t:'Spring replacement',s:[189,269],d:[289,399],job:'Spring replacement'},opener:{t:'Opener repair',s:[129,229],d:[129,229],job:'Opener repair or install'},reverse:{t:'Sensor & close-force fix',s:[89,159],d:[89,159],job:"Door won't close / reverses"},track:{t:'Off-track reset & cables',s:[149,289],d:[199,369],job:'Off track or cables'},noise:{t:'Tune-up & roller service',s:[99,179],d:[129,219],job:'Noisy door / tune-up'},new:{t:'New insulated door, installed',s:[1450,2400],d:[2150,3900],job:'New garage door'}};
const ADD={rollers:95,backup:110,keypad:65};
const calc=()=>{const fd=new FormData(form),issue=fd.get('issue'),size=fd.get('size'),age=fd.get('age'),when=fd.get('when'),adds=fd.getAll('add');const J=JOBS[issue];let[lo,hi]=size==='double'?J.d:J.s;
let ageF=age==='old'&&issue!=='new'?1.15:1;lo*=ageF;hi*=ageF;let base=[lo,hi];
const urg=issue==='new'?0:when==='emergency'?95:when==='today'?0:-15;lo+=urg;hi+=urg;
let addSum=adds.filter(a=>ADD[a]).reduce((s,a)=>s+ADD[a],0);lo+=addSum;hi+=addSum;
if(adds.includes('plan')&&issue!=='new'){lo=lo*.85+108;hi=hi*.85+108}
const r=n=>'$'+(Math.round(n/5)*5).toLocaleString();
$('#resTitle').textContent=J.t;const ro=$('#rangeOut');ro.textContent=r(lo)+' – '+r(hi);ro.classList.remove('bump');void ro.offsetWidth;ro.classList.add('bump');
$('#baseOut').textContent=r(base[0])+' – '+r(base[1])+(ageF>1?' (older door)':'');
$('#whenOut').textContent=issue==='new'?'Install in 5–10 days':urg>0?'+$95 after-hours':urg<0?'−$15 flexible':'Standard';
$('#addOut').textContent=(addSum?'+$'+addSum:'None')+(adds.includes('plan')&&issue!=='new'?' · plan −15% (+$108/yr)':'');
$('#etaOut').textContent=issue==='new'?'Free measure visit':when==='emergency'?'Within ~2 hours':when==='today'?'Today or tomorrow':'Pick any day';
let rec='';
if(issue==='spring')rec=size==='double'||age==='old'?'💡 Recommend replacing both springs with high-cycle springs so the door stays balanced.':'💡 Springs wear in pairs. Ask about replacing both for about $80 more.';
else if(issue==='opener')rec=age==='old'?'💡 Openers 15+ years old often cost more to fix than replace. A new belt drive starts around $495 (example).':'💡 Often a logic board, gear or remote issue. Most are fixed on the first visit.';
else if(issue==='reverse')rec='💡 Try wiping both sensor lenses first. If both lights are solid and it still reverses, book a visit.';
else if(issue==='track')rec='⚠️ Keep the door closed and the opener unplugged until a tech secures it.';
else if(issue==='noise')rec=adds.includes('rollers')?'💡 Nylon rollers plus a tune-up usually make the biggest difference.':'💡 Add quiet nylon rollers for the biggest noise drop.';
else rec=size==='double'?'💡 Insulated double doors can noticeably cool an attached garage in summer.':'💡 We bring style samples to the free measure visit.';
$('#rec').textContent=rec;$('#safety').hidden=!(issue==='spring'||issue==='track');
$('#mbPrice').textContent=r(lo)+'–'+r(hi);
const msg=`Estimator: ${J.t}, ${size} door, ${age==='old'?'15+':age==='new'?'under 5':'5–15'} yrs, ${when}. Example range ${r(lo)}–${r(hi)}.`;
$('#bookBtn').href='contact.html?job='+encodeURIComponent(J.job)+'&msg='+encodeURIComponent(msg)};
form.addEventListener('change',calc);calc();
const bar=$('#mobileBar'),res=$('#result');const upd=()=>{const r=res.getBoundingClientRect(),vis=r.top<innerHeight&&r.bottom>0,show=!vis&&scrollY>200&&innerWidth<=860;bar.classList.toggle('show',show);bar.setAttribute('aria-hidden',!show)};addEventListener('scroll',upd,{passive:true});addEventListener('resize',upd);upd()}
// contact form
const bf=$('#bookForm');
if(bf){const q=new URLSearchParams(location.search);if(q.get('job'))$('#job').value=q.get('job');if(q.get('msg'))$('#msg').value=q.get('msg');
const rules={name:v=>v.trim().length>1,phone:v=>v.replace(/\D/g,'').length===10,email:v=>/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v),zip:v=>/^85\d{3}$/.test(v),job:v=>!!v};
const check=id=>{const el=$('#'+id),ok=rules[id](el.value);el.closest('.field').classList.toggle('invalid',!ok);el.setAttribute('aria-invalid',!ok);return ok};
Object.keys(rules).forEach(id=>$('#'+id).addEventListener('blur',()=>{if($('#'+id).value)check(id)}));
bf.addEventListener('submit',e=>{e.preventDefault();const bad=Object.keys(rules).filter(id=>!check(id));if(bad.length){$('#'+bad[0]).focus();$('#formSuccess').hidden=true;return}
const s=$('#formSuccess');s.textContent=`Thanks, ${$('#name').value.trim().split(' ')[0]}! (Demo) In real life you'd get a text at ${$('#phone').value} confirming a ${new FormData(bf).get('win').toLowerCase()} window for: ${$('#job').value}.`;s.hidden=false;s.focus()})}
})();
