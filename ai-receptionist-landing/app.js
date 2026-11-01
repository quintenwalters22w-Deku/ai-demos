(()=>{
const t=document.querySelector('.toggle'),m=document.getElementById('menu');
t.addEventListener('click',()=>{const o=m.classList.toggle('open');t.setAttribute('aria-expanded',o);t.setAttribute('aria-label',o?'Close menu':'Open menu')});
m.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{m.classList.remove('open');t.setAttribute('aria-expanded','false')}));

// example call
const lines=[
 [0,'ai',"Thanks for calling Copper Creek Plumbing, this is the virtual assistant. How can I help tonight?"],
 [1,'caller',"Hi, my water heater is leaking all over the garage floor."],
 [1,'ai',"Sorry to hear that. Is water still coming out, and do you know where your main shut-off is?"],
 [2,'caller',"I just shut the main off. It stopped."],
 [2,'ai',"Good call, that keeps damage down. What's the address, and is it a gas or electric heater?"],
 [2,'caller',"East side, near Broadway and Pantano. It's gas, about twelve years old."],
 [3,'ai',"Got it. I've marked this urgent. I can get a tech out between 7 and 8 tomorrow morning. Does that work?"],
 [3,'caller',"Yes, perfect. I'm Marcus."],
 [4,'ai',"You're booked, Marcus. You'll get a text confirmation now, and the owner has your details. Leave the gas off at the heater until we arrive."]
];
const tr=document.getElementById('transcript'),sms=document.getElementById('sms'),play=document.getElementById('play'),clock=document.getElementById('clock'),steps=[...document.querySelectorAll('.steps span')];
let timers=[],tick;
function reset(){timers.forEach(clearTimeout);timers=[];clearInterval(tick);tr.innerHTML='<li class="empty">Press play to watch an example call.</li>';sms.hidden=true;steps.forEach(s=>s.classList.remove('on'));clock.textContent='0:00'}
function run(){reset();tr.innerHTML='';let sec=0;tick=setInterval(()=>{sec+=4;clock.textContent=Math.floor(sec/60)+':'+String(sec%60).padStart(2,'0')},700);
 const fast=matchMedia('(prefers-reduced-motion:reduce)').matches,gap=fast?60:1500;
 lines.forEach(([st,who,txt],i)=>timers.push(setTimeout(()=>{const li=document.createElement('li');li.className=who;li.innerHTML='<small>'+(who==='ai'?'AI receptionist':'Caller')+'</small>';li.append(txt);tr.append(li);steps.forEach((s,j)=>s.classList.toggle('on',j<=st))},i*gap)));
 timers.push(setTimeout(()=>{sms.hidden=false;clearInterval(tick);clock.textContent='1:52';play.textContent='↻ Replay example';play.setAttribute('aria-pressed','false')},lines.length*gap));
 play.setAttribute('aria-pressed','true');play.textContent='Playing…'}
play.addEventListener('click',run);reset();

// calculator
const $=id=>document.getElementById(id),fmt=n=>'$'+Math.round(n).toLocaleString('en-US');
function calc(){const c=+$('calls').value,j=+$('job').value,p=+$('close').value;
 $('callsOut').textContent=c;$('jobOut').textContent=fmt(j);$('closeOut').textContent=p+'%';
 $('monthly').textContent=fmt(c*4.33*j*p/100);
 $('breakeven').textContent='One saved '+fmt(j)+' job covers about '+(j/99).toFixed(1)+' months of the $99/mo retainer.'}
['calls','job','close'].forEach(id=>$(id).addEventListener('input',calc));calc();

// form
const f=$('form');
f.addEventListener('submit',e=>{e.preventDefault();let ok=true;
 [['name',v=>v.trim().length>1],['biz',v=>v.trim().length>1],['phone',v=>v.replace(/\D/g,'').length===10],['trade',v=>!!v]].forEach(([id,fn])=>{const el=$(id),bad=!fn(el.value);el.closest('.field').classList.toggle('invalid',bad);el.setAttribute('aria-invalid',bad);if(bad&&ok){el.focus();ok=false}});
 $('notice').textContent=ok?'Thanks, '+$('name').value.trim().split(' ')[0]+'! (Demo only: nothing was sent.)':''});
})();
