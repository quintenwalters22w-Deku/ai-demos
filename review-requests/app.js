(()=>{
const $=s=>document.querySelector(s),sleep=ms=>new Promise(r=>setTimeout(r,ms));
const esc=s=>s.replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
// nav
const mb=$('.menu-btn'),menu=$('#menu');
mb.addEventListener('click',()=>{const o=menu.classList.toggle('open');mb.setAttribute('aria-expanded',o)});
menu.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{menu.classList.remove('open');mb.setAttribute('aria-expanded',false)}));
function add(th,cls,html){const d=document.createElement('div');d.className='msg '+cls;d.innerHTML=html;th.appendChild(d);th.scrollTop=th.scrollHeight;return d}
async function typing(th,ms){const t=document.createElement('div');t.className='typing';t.innerHTML='<i></i><i></i><i></i>';th.appendChild(t);await sleep(ms);t.remove()}
// hero loop
const ht=$('#heroThread');let count=11,score=4.6;
async function hero(){
  while(true){
    ht.innerHTML='';$('#heroBump').classList.remove('show');
    add(ht,'meta','Job done · Solar panel cleaning · 2:40 PM');await sleep(900);
    await typing(ht,900);add(ht,'out','Hi Dana, thanks for having us out today! How did we do, 1 to 5? - Luis, Saguaro Sky Solar');await sleep(1500);
    add(ht,'in','5! Panels look brand new');await sleep(900);
    await typing(ht,800);add(ht,'out','Thank you! Would you mind sharing that? It really helps a small shop like ours.');
    add(ht,'link','⭐ Leave a review (1 tap)');await sleep(1600);
    add(ht,'meta','Dana left a 5-star review');count++;score=Math.min(4.9,+(score+.02).toFixed(2));
    $('#heroCount').textContent=count;$('#heroScore').textContent=score.toFixed(1);$('#heroBump').classList.add('show');
    await sleep(3600);
  }
}
hero();
// simulator
const jobs=[
 {biz:'Rincon Ridge HVAC',cust:'Marcus T.',job:'AC tune-up',tech:'Jen'},
 {biz:'Tanque Verde Plumbing',cust:'Alicia P.',job:'Water heater swap',tech:'Rob'},
 {biz:'Sabino Clean Co.',cust:'Greg H.',job:'Move-out deep clean',tech:'Tasha'},
 {biz:'Gates Pass Landscaping',cust:'Priya S.',job:'Drip system repair',tech:'Manny'}];
const times=[{l:'1 hour after',s:'Fresh in their mind',t:'3:45 PM'},{l:'Same evening',s:'After dinner, 6:30 PM',t:'6:30 PM'},{l:'Next morning',s:'With coffee, 9 AM',t:'9:00 AM'}];
let ji=0,ti=0,busy=false;
function chips(el,arr,label,sub,get,set){
  el.innerHTML=arr.map((x,i)=>`<button class="chip" role="radio" aria-checked="${i===get()}" data-i="${i}">${esc(label(x))}<small>${esc(sub(x))}</small></button>`).join('');
  el.addEventListener('click',e=>{const b=e.target.closest('.chip');if(!b||busy)return;set(+b.dataset.i);el.querySelectorAll('.chip').forEach(c=>c.setAttribute('aria-checked',c===b))});
}
chips($('#jobChips'),jobs,x=>x.job,x=>x.biz+' · '+x.cust,()=>ji,v=>ji=v);
chips($('#timeChips'),times,x=>x.l,x=>x.s,()=>ti,v=>ti=v);
const st=$('#simThread'),ol=$('#ownerLog'),rr=$('#rateRow'),rb=$('#rateBtns');
rb.innerHTML=[1,2,3,4,5].map(n=>`<button data-n="${n}" aria-label="Reply ${n} out of 5">${n}</button>`).join('');
function owner(cls,title,body){if(ol.querySelector('.muted'))ol.innerHTML='';const li=document.createElement('li');li.className=cls;li.innerHTML=`<b>${esc(title)}</b>${esc(body)}`;ol.prepend(li)}
$('#sendBtn').addEventListener('click',async()=>{
  if(busy)return;busy=true;$('#sendBtn').disabled=true;
  const j=jobs[ji],t=times[ti];$('#simBiz').textContent=j.biz;st.innerHTML='';rr.hidden=true;
  add(st,'meta',`${j.job} marked done · text queued for ${t.t}`);await sleep(800);
  add(st,'meta',`${t.t}`);await typing(st,900);
  add(st,'out',`Hi ${j.cust.split(' ')[0]}, it's ${j.tech} from ${esc(j.biz)}. Thanks for trusting us with your ${j.job.toLowerCase()} today! Quick question: how did we do, 1 to 5?`);
  add(st,'meta','Reply STOP to opt out');
  rr.hidden=false;rb.querySelector('button').focus({preventScroll:true});
});
rb.addEventListener('click',async e=>{
  const b=e.target.closest('button');if(!b)return;const n=+b.dataset.n,j=jobs[ji];rr.hidden=true;
  add(st,'in',String(n));await typing(st,900);
  if(n>=4){
    add(st,'out',`That made our day, thank you! If you have 30 seconds, would you mind sharing that? It helps neighbors find us.`);
    add(st,'link','⭐ Leave a review for '+esc(j.biz));await sleep(700);
    owner('good',`${n}/5 from ${j.cust}`,` ${j.job} · review link sent (example)`);
  }else{
    add(st,'out',`I'm really sorry it wasn't a great experience. The owner will call you today to make it right. Is now a good number?`);await sleep(700);
    owner('alert',`⚠ ${n}/5 from ${j.cust}: call today`,` ${j.job} · tech ${j.tech} · no review link sent, customer can still post anytime (example)`);
  }
  busy=false;$('#sendBtn').disabled=false;$('#sendBtn').textContent='Run another job';
});
// calculator
const jobsI=$('#jobs'),nowI=$('#now'),leaveI=$('#leave'),bars=$('#bars');
function calc(){
  const J=+jobsI.value,N=+nowI.value,L=+leaveI.value/100,reply=.7; // assume ~70% read and reply
  const per=J*reply*L,yr=Math.round(per*12);
  $('#jobsO').textContent=J;$('#nowO').textContent=N;$('#leaveO').textContent=Math.round(L*100)+'%';
  $('#newRev').textContent=yr;$('#tot').textContent=N+yr;$('#perWk').textContent=(per*12/52).toFixed(1);
  $('#mult').textContent=N?((N+yr)/N).toFixed(1).replace(/\.0$/,'')+'x':'∞';
  const max=N+yr||1;bars.innerHTML='';
  for(let m=0;m<=12;m++){const i=document.createElement('i');const v=N+per*m;i.style.height=Math.max(2,v/max*100)+'%';if(m)i.className='new';bars.appendChild(i)}
  $('#calcNote').textContent=`Example estimate: assumes about 70% of customers reply to the check-in and ${Math.round(L*100)}% of those leave a review. Real results vary by trade and customer.`;
}
[jobsI,nowI,leaveI].forEach(i=>i.addEventListener('input',calc));calc();
// form
$('#form').addEventListener('submit',e=>{
  e.preventDefault();let ok=true;
  [['#fn',v=>v.trim().length>1,'Please add your name'],['#fb',v=>v.trim().length>1,'Please add your business name'],['#fp',v=>v.replace(/\D/g,'').length>=10,'Please add a 10-digit phone number']].forEach(([s,t,m])=>{
    const el=$(s),good=t(el.value);el.setAttribute('aria-invalid',!good);el.nextElementSibling.textContent=good?'':m;if(!good&&ok){el.focus();ok=false}});
  $('#ok').hidden=!ok;
});
})();
