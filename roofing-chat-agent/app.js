(()=>{
const $=s=>document.querySelector(s);
const log=$('#log'),chips=$('#chips'),form=$('#composer'),input=$('#msg');
const toggle=$('.toggle'),menu=$('#menu');
toggle.addEventListener('click',()=>{const o=menu.classList.toggle('open');toggle.setAttribute('aria-expanded',o)});
menu.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{menu.classList.remove('open');toggle.setAttribute('aria-expanded',false)}));

// Example price ranges per square (100 sq ft), fictional demo numbers
const RATES={'Tile':[1150,1500],'Shingle':[520,720],'Flat / foam':[480,680],'Metal':[900,1250]};
const SIZES={'Under 1,500 sq ft':13,'1,500–2,500 sq ft':20,'Over 2,500 sq ft':30,'Not sure':20};
let st,score;
function money(n){return '$'+(Math.round(n/50)*50).toLocaleString()}

function setField(id,val,pts){const el=$(id);el.textContent=val;el.classList.remove('new');void el.offsetWidth;el.classList.add('new');
  if(pts){score=Math.min(100,score+pts);$('#score').textContent=score;$('#bar').style.width=score+'%'}
  const c=$('#card');c.classList.add('flash');setTimeout(()=>c.classList.remove('flash'),500)}
function status(t,cls){const s=$('#status');s.textContent=t;s.className='tag '+(cls||'')}

function add(text,who){const d=document.createElement('div');d.className='msg '+who;d.textContent=text;log.appendChild(d);log.scrollTop=log.scrollHeight;return d}
function bot(text,opts,delay){
  chips.innerHTML='';const t=add('Assistant is typing…','bot typing');
  setTimeout(()=>{t.remove();add(text,'bot');showChips(opts||[])},delay??700);
}
function showChips(opts){chips.innerHTML='';opts.forEach(o=>{const b=document.createElement('button');b.type='button';b.textContent=o;b.onclick=()=>handle(o);chips.appendChild(b)})}

function start(){
  log.innerHTML='';st={step:'need'};score=0;$('#score').textContent=0;$('#bar').style.width='0';
  ['#f-need','#f-type','#f-size','#f-urg','#f-est','#f-name','#f-book'].forEach(i=>$(i).textContent='—');
  status('Waiting for a visitor…');
  bot("Hi! I'm the Catalina Peak assistant. What's going on with your roof?",['I have a leak','Monsoon / storm damage','I need a new roof','Do you do free inspections?'],400);
}

function classifyNeed(t){t=t.toLowerCase();
  if(/leak|drip|water|ceiling|stain/.test(t))return'Leak repair';
  if(/storm|monsoon|wind|hail|damage|insurance/.test(t))return'Storm damage';
  if(/new|replace|replacement|old|whole/.test(t))return'Full replacement';
  if(/inspect|free|check|look/.test(t))return'Inspection';
  if(/price|cost|how much|quote|estimate/.test(t))return'Quote';
  return null}

function handle(text){
  text=text.trim();if(!text)return;add(text,'me');input.value='';const low=text.toLowerCase();
  // global FAQ answers
  if(/hours|open/.test(low)&&st.step!=='name'){bot("Our office is open Mon–Sat, 7 am–5 pm, and I'm here 24/7. Want to keep going with your roof question?",chips.dataset.last?JSON.parse(chips.dataset.last):[]);return}
  if(/area|where|serve|marana|oro valley|vail/.test(low)&&st.step!=='name'){bot("We cover Tucson, Oro Valley, Marana, Vail and Sahuarita (example service area). Shall we continue?",chips.dataset.last?JSON.parse(chips.dataset.last):[]);return}
  switch(st.step){
  case'need':{
    const n=classifyNeed(text);
    if(!n){ask("I can help with leaks, storm damage, replacements and inspections. Which is closest?",['I have a leak','Monsoon / storm damage','I need a new roof','Do you do free inspections?']);return}
    st.need=n;setField('#f-need',n,20);status('Visitor chatting now…','hot');
    let pre={'Leak repair':"Sorry about the leak, that's stressful. Let's get someone out fast.",'Storm damage':"Monsoon season is rough on Tucson roofs. We can document the damage for your insurance claim.",'Full replacement':"Great, a replacement is a big decision and we'll make it easy.",'Inspection':"Yes, inspections are free (example offer) and take about 45 minutes.",'Quote':"Happy to give you a ballpark."}[n];
    st.step='type';ask(pre+"\n\nWhat kind of roof do you have?",Object.keys(RATES).concat('Not sure'));break}
  case'type':{
    let t=Object.keys(RATES).find(k=>low.includes(k.split(' ')[0].toLowerCase()))||(/foam|flat/.test(low)?'Flat / foam':null)||(/sure|know/.test(low)?'Not sure':null);
    if(!t){ask("No problem. Is it tile, shingle, flat/foam or metal?",Object.keys(RATES).concat('Not sure'));return}
    st.type=t;setField('#f-type',t,15);st.step='size';
    ask("Got it. About how big is the home?",Object.keys(SIZES));break}
  case'size':{
    let s=Object.keys(SIZES).find(k=>k.toLowerCase()===low)||(/under|small|1[0-4]00/.test(low)?'Under 1,500 sq ft':/over|big|large|3000|2[6-9]00/.test(low)?'Over 2,500 sq ft':/sure|know/.test(low)?'Not sure':/\d/.test(low)?'1,500–2,500 sq ft':null);
    if(!s){ask("Roughly is fine. Pick the closest:",Object.keys(SIZES));return}
    st.size=s;setField('#f-size',s,15);st.step='urg';
    ask("How urgent is it?",['Active leak right now','This week','Within a month','Just planning']);break}
  case'urg':{
    st.urg=/now|active|asap|emergency|today/.test(low)?'Emergency':/week/.test(low)?'This week':/month/.test(low)?'Within a month':'Planning';
    setField('#f-urg',st.urg,st.urg==='Emergency'?25:st.urg==='This week'?20:10);
    if(st.urg==='Emergency')status('URGENT: active leak','hot');
    const est=estimate();setField('#f-est',est,5);
    let msg=st.need==='Full replacement'||st.need==='Quote'?`For a ${st.type.toLowerCase()} roof that size, replacements usually run ${est} (example range). Final price comes after a free inspection.`:`Repairs like this usually run ${est} (example range), depending on what we find. Final price comes after the inspection.`;
    if(st.urg==='Emergency')msg="I've flagged this as urgent and alerted the owner. If water is coming in, put a bucket under it and move valuables away.\n\n"+msg;
    st.step='name';bot(msg+"\n\nWhat's your first name so we can book you?",[],900);break}
  case'name':{
    const nm=text.replace(/^(my name is|i'm|im|it's|this is)\s+/i,'').split(/\s+/)[0].replace(/[^a-z'\-]/gi,'');
    if(!nm){ask("Just your first name is fine.",[]);return}
    st.name=nm.charAt(0).toUpperCase()+nm.slice(1);setField('#f-name',st.name,10);st.step='book';
    const slots=st.urg==='Emergency'?['Tomorrow 7:30 AM','Tomorrow 9:00 AM','Call me tonight']:['Thu 8:00 AM','Thu 1:30 PM','Fri 10:00 AM','Sat 9:00 AM'];
    ask(`Thanks, ${st.name}! Here are the next open inspection times:`,slots);break}
  case'book':{
    st.book=text;setField('#f-book',text,10);st.step='done';status('Booked · lead texted to owner','done');
    $('#clock').textContent='9:44 PM';
    bot(`You're all set, ${st.name}. ${/call/i.test(text)?'The owner will call you within 15 minutes.':'We have you down for '+text+'.'} You'll get a text confirmation and a reminder the day before.\n\nAnything else I can help with?`,['What areas do you serve?','Restart demo']);break}
  default:
    if(/restart/.test(low)){start();return}
    bot("Happy to help. Our team will follow up with anything else when they confirm your visit.",['Restart demo']);
  }
}
function ask(t,o){chips.dataset.last=JSON.stringify(o);bot(t,o)}
function estimate(){
  if(st.type==='Not sure'){return st.need==='Full replacement'||st.need==='Quote'?'$10,000–$30,000':'$350–$1,500'}
  if(st.need==='Full replacement'||st.need==='Quote'){const [a,b]=RATES[st.type];const sq=SIZES[st.size];return money(a*sq)+'–'+money(b*sq)}
  return st.need==='Storm damage'?'$450–$2,500':'$350–$1,500'}

chips.addEventListener('click',e=>{if(e.target.textContent==='Restart demo'){e.stopPropagation();start()}},true);
form.addEventListener('submit',e=>{e.preventDefault();if(/^restart/i.test(input.value.trim())){input.value='';start();return}handle(input.value)});
$('#reset').addEventListener('click',start);
start();
})();
