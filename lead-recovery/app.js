const $=s=>document.querySelector(s);
// mobile menu
const mb=$('.menu-btn'),menu=$('#menu');
mb.addEventListener('click',()=>{const o=menu.classList.toggle('open');mb.setAttribute('aria-expanded',o)});
menu.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{menu.classList.remove('open');mb.setAttribute('aria-expanded','false')}));

// hero conversation loop
const heroMsgs=[
 ['meta','Estimate sent 41 days ago'],
 ['out',"Hi Maria, it's Desert Bloom Electric. Just checking in on that panel upgrade quote from last month. Still on your list?"],
 ['meta','2 days later'],
 ['in',"Yes! Sorry, life got busy. Can you still do the same price?"],
 ['out',"Absolutely. Here are a few open times this week: Tue 1 PM, Thu 9 AM, Fri 11 AM. Which works?"],
 ['in',"Thu 9 works 👍"],
 ['out',"You're booked for Thursday at 9. See you then!"]];
const thread=$('#heroThread'),pop=$('#ownerPop');
function runHero(){thread.innerHTML='';pop.hidden=true;let i=0;
 const step=()=>{if(i<heroMsgs.length){const[c,t]=heroMsgs[i++];const d=document.createElement('div');d.className='msg '+c;d.textContent=t;thread.appendChild(d);setTimeout(step,1100)}
  else{pop.hidden=false;setTimeout(runHero,4500)}};step()}
runHero();

// campaign demo
const tones={
 friendly:n=>`Hi ${n}, it's Desert Bloom Electric. Just checking in on the estimate we sent. Still on your list? Happy to answer any questions. Reply STOP to opt out.`,
 seasonal:n=>`Hi ${n}, Desert Bloom Electric here. Monsoon season is a good time to get electrical work done before the storms. Want to pick a date for your estimate? Reply STOP to opt out.`,
 direct:n=>`Hi ${n}, Desert Bloom Electric. Ready to schedule the job we quoted? Reply YES for open times. Reply STOP to opt out.`};
const leads=[
 {n:'Maria R.',job:'Panel upgrade',v:2400,out:'booked',day:3,note:'Booked Thu 9 AM'},
 {n:'Dan K.',job:'EV charger install',v:1350,out:'booked',day:6,note:'Booked Mon 2 PM'},
 {n:'Priya S.',job:'Ceiling fans (4)',v:620,out:'replied',day:4,note:'Asked about price, owner calling'},
 {n:'Tom B.',job:'Outdoor lighting',v:1800,out:'later',day:5,note:'"Not now", reminder set for Feb'},
 {n:'Lena M.',job:'Kitchen rewire',v:3900,out:'booked',day:10,note:'Booked after 2nd text'},
 {n:'Greg H.',job:'Outlet repair',v:280,out:'stop',day:2,note:'Replied STOP, removed'},
 {n:'Ana V.',job:'Generator hookup',v:2100,out:'later',day:14,note:'No reply after 3 texts'},
 {n:'Chris P.',job:'Smart switches',v:540,out:'replied',day:12,note:'Wants a quote update'}];
const tone=()=>document.querySelector('input[name=tone]:checked').value;
const prev=()=>$('#preview').textContent=tones[tone()]('Maria');
document.querySelectorAll('input[name=tone]').forEach(r=>r.addEventListener('change',prev));prev();
let timer=null;
const col=c=>document.querySelector(`.col[data-col=${c}] .cards`);
function card(l,status){const d=document.createElement('div');d.className='lc';d.innerHTML=`<b>${l.n}</b><span>${l.job} · $${l.v.toLocaleString()} (example)</span>${status?`<i>${status}</i>`:''}`;return d}
function counts(){['waiting','replied','booked','later','stop'].forEach(c=>$('#c-'+c).textContent=col(c).children.length)}
function reset(){clearInterval(timer);timer=null;['waiting','replied','booked','later','stop'].forEach(c=>col(c).innerHTML='');
 leads.forEach(l=>{l.el=card(l,'1st text sent');col('waiting').appendChild(l.el)});
 $('#dayFill').style.width='0';$('#dayLabel').textContent='Day 0 of 14';$('#summary').hidden=true;$('#play').disabled=false;counts()}
function play(){reset();$('#play').disabled=true;let day=0;
 timer=setInterval(()=>{day++;$('#dayFill').style.width=(day/14*100)+'%';$('#dayLabel').textContent=`Day ${day} of 14`;
  if(day===5||day===10)leads.filter(l=>l.el.parentElement===col('waiting')).forEach(l=>{l.el.querySelector('i').textContent=day===5?'2nd text sent':'3rd text sent'});
  leads.filter(l=>l.day===day).forEach(l=>{l.el.remove();l.el=card(l,l.note);col(l.out).appendChild(l.el)});
  counts();
  if(day>=14){clearInterval(timer);timer=null;const b=leads.filter(l=>l.out==='booked');
   $('#sumBooked').textContent=b.length;$('#sumValue').textContent='$'+b.reduce((s,l)=>s+l.v,0).toLocaleString();$('#summary').hidden=false;$('#play').disabled=false}
 },matchMedia('(prefers-reduced-motion:reduce)').matches?300:2000)}
$('#play').addEventListener('click',play);$('#reset').addEventListener('click',reset);reset();

// calculator
const fmt=n=>'$'+Math.round(n).toLocaleString();
function calc(){const q=+$('#q').value,v=+$('#v').value,r=+$('#r').value/100;
 $('#qo').textContent=q;$('#vo').textContent=fmt(v);$('#ro').textContent=Math.round(r*100)+'%';
 const jobs=q*r,rev=jobs*v;$('#jobs').textContent=jobs.toFixed(1);$('#rev').textContent=fmt(rev);$('#yr').textContent=fmt(rev*12);
 const months=rev>99?Math.ceil(1000/(rev-99)):null;
 $('#breakeven').textContent=months?`At these example numbers, a $1,000 setup plus $99/mo would pay for itself in about ${months} month${months>1?'s':''}.`:'At these numbers, the recovered work would not cover the monthly fee yet.'}
['q','v','r'].forEach(id=>$('#'+id).addEventListener('input',calc));calc();

// faq
document.querySelectorAll('.faq button').forEach(b=>b.addEventListener('click',()=>{const o=b.getAttribute('aria-expanded')==='true';b.setAttribute('aria-expanded',!o);document.getElementById(b.getAttribute('aria-controls')).hidden=o}));

// form
$('#form').addEventListener('submit',e=>{e.preventDefault();let ok=true;
 e.target.querySelectorAll('[required]').forEach(i=>{const bad=!i.value.trim()||(i.type==='tel'&&i.value.replace(/\D/g,'').length<10);i.setAttribute('aria-invalid',bad);if(bad)ok=false});
 $('#formMsg').textContent=ok?"Thanks! On a real page, I'd text you within one business day to set up your demo.":'Please fill in your name, business and a 10-digit phone number.';
 $('#formMsg').style.color=ok?'#0a7a2f':'#e10600';if(ok)e.target.reset()});
