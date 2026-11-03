(function(){
document.querySelectorAll('[data-year]').forEach(e=>e.textContent=new Date().getFullYear());
const t=document.querySelector('.toggle'),m=document.getElementById('menu');
if(t&&m){t.addEventListener('click',()=>{const o=m.classList.toggle('open');t.setAttribute('aria-expanded',String(o));t.setAttribute('aria-label',o?'Close menu':'Open menu');});
 document.addEventListener('keydown',e=>{if(e.key==='Escape'&&m.classList.contains('open')){t.click();t.focus();}});}
// plan builder
const f=document.getElementById('builder');
if(f){const $=id=>document.getElementById(id),fmt=n=>'$'+Math.round(n).toLocaleString('en-US');
 const once={blacklight:129,seal:249,bees:195,weeds:59};
 const calc=()=>{
  let score=0;['q1','q2','q3','q4','q5'].forEach(q=>{const c=f.querySelector(`input[name=${q}]:checked`);score+=c?+c.value:0});
  const lv=score<=1?['Low risk','Few signs. A standard quarterly perimeter plan should keep things in check.']:score<=3?['Moderate risk','Several common risk factors. Add the scorpion program and seal door gaps.']:['High risk','Classic bark scorpion conditions. We suggest the scorpion program, a blacklight sweep and sealing.'];
  $('riskBar').style.left=(score/5*100)+'%';$('riskLabel').textContent=lv[0]+' ('+score+'/5)';$('riskText').textContent=lv[1];
  const sq=+$('sqft').value;$('sqftOut').textContent=sq.toLocaleString('en-US');
  const pests=[...f.querySelectorAll('input[name=pest]:checked')].map(i=>i.value);
  const freq=f.querySelector('input[name=freq]:checked').value;
  let base=119+Math.max(0,Math.ceil((sq-2000)/500))*12;
  if(pests.includes('scorpion'))base+=25;if(pests.includes('rodent'))base+=20;
  const fx={quarterly:[4,1],bimonthly:[6,.9],monthly:[12,.75]}[freq];
  const per=base*fx[1],visits=fx[0];
  const initial=per+30+(pests.includes('scorpion')?20:0);
  const ad=[...f.querySelectorAll('input[name=addon]:checked')].reduce((s,i)=>s+once[i.value],0);
  const year=initial+per*(visits-1)+ad;
  $('perVisit').textContent=fmt(per);$('visits').textContent=visits;$('initial').textContent=fmt(initial);$('once').textContent=fmt(ad);$('year').textContent=fmt(year);$('mbPrice').textContent=fmt(per);
  const fq={quarterly:'quarterly',bimonthly:'every-2-month',monthly:'monthly'}[freq];
  const bl=f.querySelector('input[value=blacklight]').checked;
  let r;
  if(score>=4&&!pests.includes('scorpion'))r='Your answers point to high scorpion risk. Consider adding the bark scorpion program.';
  else if(score>=4&&!bl)r='High risk: add a one-time blacklight sweep to find hiding spots fast.';
  else if(score>=4)r='Strong setup for a high-risk home: '+fq+' visits, scorpion program and a blacklight sweep.';
  else if(pests.includes('termite'))r='Your free termite inspection will be booked with the first visit.';
  else r=score>=2?'Good fit: '+fq+' perimeter visits plus the scorpion program.':'Good fit: the standard '+fq+' perimeter plan.';
  $('rec').textContent='Recommendation: '+r;
  $('bookBtn').href='contact.html?plan='+encodeURIComponent(freq+' · '+fmt(per)+'/visit');
 };
 f.addEventListener('input',calc);f.addEventListener('change',calc);f.addEventListener('submit',e=>e.preventDefault());calc();
 const mb=$('mobileBar');if('IntersectionObserver' in window){new IntersectionObserver(es=>es.forEach(e=>mb.classList.toggle('hide',e.isIntersecting))).observe(document.querySelector('.summary'));}}
// contact form
const q=document.getElementById('quoteForm');
if(q){const ok=document.getElementById('formSuccess');
 const plan=new URLSearchParams(location.search).get('plan');if(plan){const msg=document.getElementById('msg');msg.value='Interested in the example plan: '+plan+'. ';document.getElementById('pest').value='Perimeter plan';}
 const rules={name:v=>v.trim().length>1,phone:v=>v.replace(/\D/g,'').replace(/^1/,'').length===10,email:v=>!v||/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),zip:v=>/^85\d{3}$/.test(v.trim()),pest:v=>!!v};
 const check=id=>{const el=document.getElementById(id),good=rules[id](el.value);el.closest('.field').classList.toggle('invalid',!good);el.setAttribute('aria-invalid',String(!good));return good};
 Object.keys(rules).forEach(id=>document.getElementById(id).addEventListener(id==='pest'?'change':'input',()=>{if(document.getElementById(id).closest('.field').classList.contains('invalid'))check(id)}));
 q.addEventListener('submit',e=>{e.preventDefault();const bad=Object.keys(rules).filter(id=>!check(id));
  if(bad.length){ok.hidden=true;document.getElementById(bad[0]).focus();return;}
  const n=document.getElementById('name').value.trim().split(' ')[0];
  ok.innerHTML='<b>Thanks, '+n.replace(/[<>&"]/g,'')+'! Request received (demo).</b><br>On a live site you would get a text back within minutes to confirm a time. Nothing was sent: this is a portfolio demo.';
  ok.hidden=false;ok.focus();q.querySelectorAll('input:not([type=radio]),select,textarea').forEach(i=>i.value='');});}
})();
