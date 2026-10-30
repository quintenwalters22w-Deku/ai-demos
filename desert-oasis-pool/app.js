document.querySelectorAll('[data-year]').forEach(e=>e.textContent=new Date().getFullYear());
const t=document.querySelector('.toggle'),m=document.getElementById('menu');
if(t){t.addEventListener('click',()=>{const o=m.classList.toggle('open');t.setAttribute('aria-expanded',o);t.setAttribute('aria-label',o?'Close menu':'Open menu');t.textContent=o?'✕':'☰'});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&m.classList.contains('open'))t.click()})}
// plan builder
const pb=document.getElementById('builder');
if(pb){const fmt=n=>'$'+Math.round(n).toLocaleString();
 const calc=()=>{const v=n=>pb.querySelector(`input[name=${n}]:checked`).value;
  const size=v('size'),plan=v('plan'),freq=v('freq');
  const base={basic:119,full:159,premium:209}[plan];
  const sizeAdj={small:-15,standard:0,large:30,xl:60}[size];
  let mo=(base+sizeAdj)*(freq==='twice'?1.75:1);
  const extras=[...pb.querySelectorAll('input[name=extra]:checked')];
  const exMo=extras.reduce((s,e)=>s+Number(e.dataset.mo||0),0);mo+=exMo;
  const oneTime=extras.reduce((s,e)=>s+Number(e.dataset.once||0),0)+(v('state')==='green'?225:v('state')==='cloudy'?95:0);
  document.getElementById('range').innerHTML=`${fmt(mo)}<small>/mo</small>`;
  document.getElementById('once').textContent=oneTime?`+ ${fmt(oneTime)} one-time`:'No one-time charges';
  const L={basic:'Chem Check',full:'Full Service',premium:'Oasis Premium'}[plan];
  document.getElementById('lines').innerHTML=`<li>Plan: <b>${L}</b></li><li>Visits: <b>${freq==='twice'?'Twice weekly':'Weekly'}</b></li><li>Pool size: <b>${pb.querySelector('input[name=size]:checked').parentElement.textContent}</b></li>`+(extras.length?`<li>Add-ons: <b>${extras.map(e=>e.parentElement.textContent).join(', ')}</b></li>`:'');
  let rec='Weekly Full Service keeps most Tucson pools clear through summer.';
  if(v('state')==='green')rec='Green pool? We start with a one-time recovery clean, then switch you to a weekly plan so it stays blue.';
  else if(plan==='basic'&&size!=='small')rec='Larger pools collect more monsoon debris. Full Service adds brushing and skimming so you don\'t have to.';
  else if(freq==='twice')rec='Twice weekly makes sense for heavy tree cover, rentals, or pools with lots of summer swimmers.';
  document.getElementById('rec').textContent=rec;};
 pb.addEventListener('change',calc);calc();}
// contact form
const f=document.getElementById('quoteForm');
if(f){f.addEventListener('submit',e=>{e.preventDefault();let bad=null;
 [['name',v=>v.trim().length>1],['phone',v=>v.replace(/\D/g,'').length>=10],['service',v=>v!=='']].forEach(([id,ok])=>{const el=document.getElementById(id),fd=el.closest('.field');const good=ok(el.value);fd.classList.toggle('invalid',!good);el.setAttribute('aria-invalid',!good);if(!good&&!bad)bad=el});
 const n=document.getElementById('formNotice');
 if(bad){bad.focus();n.classList.remove('show');return}
 n.textContent=`Thanks, ${document.getElementById('name').value.trim().split(' ')[0]}! This is a demo, so nothing was sent. On a live site you'd get a text within a few minutes confirming your ${document.getElementById('service').value.toLowerCase()} request.`;
 n.classList.add('show');f.reset()})}
