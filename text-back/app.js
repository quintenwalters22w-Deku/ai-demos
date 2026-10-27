const $=s=>document.querySelector(s);
const t=$('.toggle'),menu=$('#menu');
t.addEventListener('click',()=>{const o=menu.classList.toggle('open');t.setAttribute('aria-expanded',o)});
menu.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{menu.classList.remove('open');t.setAttribute('aria-expanded',false)}));
// Example conversation
const script=[["sys","<b>Missed call</b> · (520) 555-0142 · 2:14 PM"],["out","Hi, this is Desert Line Plumbing. Sorry we missed you, we're on a job right now. What can we help with?"],["in","Water heater is leaking in the garage"],["out","Got it, thanks! Is it a slow drip or steady leak? And what's the address? We'll call you back within the hour."],["in","Steady. 2210 E Grant Rd"],["sys","Lead sent to the owner's phone ✓"]];
const th=$('#thread');let timers=[];
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
function play(){timers.forEach(clearTimeout);timers=[];th.innerHTML='';let d=300;
 script.forEach(([k,txt])=>{
  if(k==='out'&&!reduce){timers.push(setTimeout(()=>{const ty=document.createElement('div');ty.className='typing';ty.innerHTML='<i></i><i></i><i></i>';th.appendChild(ty)},d));d+=900}
  timers.push(setTimeout(()=>{const ty=th.querySelector('.typing');if(ty)ty.remove();const m=document.createElement('div');m.className='msg '+k;m.innerHTML=txt;th.appendChild(m)},d));d+=reduce?0:1100});}
$('#replay').addEventListener('click',play);play();
// Calculator
const f=n=>'$'+Math.round(n).toLocaleString('en-US');
function calc(){const c=+$('#calls').value,j=+$('#job').value,p=+$('#close').value/100;
 $('#o-calls').textContent=c;$('#o-job').textContent=f(j);$('#o-close').textContent=Math.round(p*100)+'%';
 const lost=c*4.3*j*p;$('#lost').textContent=f(lost);$('#saved').textContent=f(lost/4)+' / month';}
['calls','job','close'].forEach(id=>$('#'+id).addEventListener('input',calc));calc();
// Form
$('#form').addEventListener('submit',e=>{e.preventDefault();let ok=true;
 const chk=(id,v)=>{const fl=$('#'+id).closest('.field');fl.classList.toggle('invalid',!v);if(!v)ok=false};
 chk('name',$('#name').value.trim().length>1);chk('biz',$('#biz').value.trim().length>1);
 chk('phone',$('#phone').value.replace(/\D/g,'').length>=10);chk('trade',$('#trade').value!=='');
 const n=$('#notice');
 if(ok){n.textContent='Thanks, '+$('#name').value.trim().split(' ')[0]+'! (Demo only: nothing was sent.) On the live page, Quinten would reach out to book your call.';e.target.reset()}
 else{n.textContent='';e.target.querySelector('.invalid input,.invalid select').focus()}});
