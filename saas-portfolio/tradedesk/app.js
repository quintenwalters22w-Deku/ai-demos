const TECHS=['Marcus R.','Dana P.','Luis M.','Kim T.'];
const custOpts=db=>db.customers.map(c=>c.name);
const jobsDef={key:'jobs',singular:'Job',plural:'jobs',fields:[
 {k:'title',label:'Job',req:true,full:true},{k:'customer',label:'Customer',type:'select',options:custOpts},{k:'tech',label:'Technician',type:'select',options:TECHS},
 {k:'date',label:'Date',type:'date',req:true},{k:'time',label:'Start time',type:'time',def:'09:00'},
 {k:'status',label:'Status',type:'select',options:['Scheduled','In progress','Completed','Cancelled'],badge:true},{k:'value',label:'Job value',type:'money'},{k:'notes',label:'Notes',type:'textarea'}],
 columns:['title','customer','tech','date','time','value','status'],filters:['status','tech'],sort:(a,b)=>(a.date+a.time).localeCompare(b.date+b.time)};
const custDef={key:'customers',singular:'Customer',plural:'customers',fields:[
 {k:'name',label:'Name',req:true},{k:'phone',label:'Phone'},{k:'email',label:'Email',type:'email'},{k:'type',label:'Type',type:'select',options:['Residential','Commercial']},{k:'address',label:'Address',full:true},{k:'notes',label:'Notes',type:'textarea'}],
 columns:['name','phone','email','address','type',{label:'Jobs',render:(r,A)=>A.db.jobs.filter(j=>j.customer===r.name).length},{label:'Billed',render:(r,A)=>U.money(U.sum(A.db.invoices.filter(i=>i.customer===r.name&&i.kind==='Invoice'),i=>i.amount))}],
 filters:['type'],sort:(a,b)=>a.name.localeCompare(b.name)};
const invDef={key:'invoices',singular:'Document',plural:'quotes & invoices',fields:[
 {k:'number',label:'Number',req:true},{k:'kind',label:'Type',type:'select',options:['Quote','Invoice']},{k:'customer',label:'Customer',type:'select',options:custOpts},{k:'date',label:'Date',type:'date'},
 {k:'desc',label:'Description',full:true},{k:'amount',label:'Amount',type:'money'},{k:'status',label:'Status',type:'select',options:['Draft','Sent','Accepted','Declined','Paid','Overdue'],badge:true}],
 columns:['number','kind','customer','desc','date','amount','status'],filters:['kind','status'],sort:(a,b)=>b.date.localeCompare(a.date),
 preset:A=>({number:'INV-'+(1100+A.db.invoices.length),date:U.day(),kind:'Invoice',status:'Draft'}),
 actions:[{label:'Send',show:r=>r.status==='Draft',run:(r,A)=>{r.status='Sent';A.toast(r.kind+' marked as sent (simulated)')}},
  {label:'Mark paid',show:r=>r.kind==='Invoice'&&/Sent|Overdue/.test(r.status),run:(r,A)=>{r.status='Paid';A.toast('Invoice marked paid')}},
  {label:'Convert to invoice',show:r=>r.kind==='Quote'&&r.status==='Accepted',run:(r,A)=>{A.db.invoices.unshift({...r,id:U.id(),kind:'Invoice',number:r.number.replace('Q-','INV-'),status:'Draft',date:U.day()});A.toast('Draft invoice created')}}]};
const leadDef={key:'leads',singular:'Lead',plural:'leads',fields:[
 {k:'caller',label:'Caller',req:true},{k:'phone',label:'Phone'},{k:'date',label:'Date',type:'date'},{k:'time',label:'Time',type:'time'},
 {k:'service',label:'Service needed',type:'select',options:['Plumbing','HVAC','Electrical','Roofing','General repair']},{k:'status',label:'Status',type:'select',options:['New','Called back','Booked','Lost'],badge:true},{k:'note',label:'Auto-text reply / notes',type:'textarea'}],
 columns:[{label:'Caller',render:r=>`${U.esc(r.caller)}<div class="muted small" style="font-weight:400">${U.esc(r.phone)}</div>`},{label:'Missed at',render:r=>U.fdate(r.date)+' · '+U.ftime(r.time)},'service',{label:'Notes',render:r=>`<span class="muted small">${U.esc(r.note)}</span>`},'status'],
 filters:['status','service'],sort:(a,b)=>(b.date+b.time).localeCompare(a.date+a.time),preset:()=>({date:U.day(),time:'10:00',status:'New'}),
 actions:[{label:'Call back',show:r=>r.status==='New',run:(r,A)=>{r.status='Called back';A.toast('Marked as called back')}},
  {label:'Book job',show:r=>r.status!=='Booked'&&r.status!=='Lost',run:(r,A)=>{r.status='Booked';if(!A.db.customers.some(c=>c.name===r.caller))A.db.customers.push({id:U.id(),name:r.caller,phone:r.phone,email:'',type:'Residential',address:'',notes:'Created from missed-call lead'});A.db.jobs.push({id:U.id(),title:r.service+' visit',customer:r.caller,tech:TECHS[0],date:U.day(1),time:'09:00',status:'Scheduled',value:0,notes:r.note});A.toast('Job booked for tomorrow 9:00 AM')}}]};

App.init({key:'tradedesk-demo-v1',name:'TradeDesk',
seed(){const C=[['Avery Sample Homes','Commercial','12 Example Ave'],['Jordan Testwell','Residential','48 Placeholder Ln'],['Riley Demo','Residential','301 Sample St'],['Northside Mock Dental','Commercial','9 Fictional Plaza'],['Casey Notreal','Residential','77 Demo Ct'],['Morgan Fakely','Residential','15 Test Rd'],['Pine Street Sample Cafe','Commercial','220 Pine St (sample)'],['Taylor Example','Residential','5 Imaginary Way']];
 const customers=C.map((c,i)=>({id:'c'+i,name:c[0],type:c[1],address:c[2],phone:'(555) 010-'+String(1000+i*37).slice(-4),email:c[0].split(' ')[0].toLowerCase()+'@example.com',notes:''}));
 const J=[['Water heater replacement',-6,'08:00','Completed',1850],['AC tune-up',-5,'10:30','Completed',189],['Panel inspection',-4,'13:00','Completed',240],['Leaking faucet repair',-3,'09:00','Completed',165],['Duct cleaning',-2,'11:00','Completed',420],['Roof leak inspection',-1,'14:00','Completed',310],['Thermostat install',-1,'08:30','Completed',275],['Drain clearing',0,'09:00','In progress',225],['Outlet rewiring',0,'13:30','Scheduled',380],['Furnace estimate',1,'10:00','Scheduled',0],['Sump pump install',2,'08:00','Scheduled',960],['Gutter repair',3,'12:00','Scheduled',340],['Ceiling fan install',4,'15:00','Scheduled',210],['Mini-split install',6,'08:00','Scheduled',3400],['Backflow test',8,'11:00','Scheduled',150],['Toilet replacement',-2,'15:00','Cancelled',0]];
 const jobs=J.map((j,i)=>({id:'j'+i,title:j[0],customer:C[i%8][0],tech:TECHS[i%4],date:U.day(j[1]),time:j[2],status:j[3],value:j[4],notes:''}));
 const I=[['Q-1041','Quote',0,'Mini-split install, 2 zones',3400,'Accepted',-3],['Q-1042','Quote',3,'Annual HVAC service plan',890,'Sent',-2],['Q-1043','Quote',5,'Bathroom re-pipe',2650,'Draft',0],['INV-1090','Invoice',1,'Water heater replacement',1850,'Paid',-6],['INV-1091','Invoice',2,'AC tune-up',189,'Paid',-5],['INV-1092','Invoice',3,'Panel inspection',240,'Sent',-4],['INV-1093','Invoice',4,'Leaking faucet repair',165,'Overdue',-20],['INV-1094','Invoice',6,'Duct cleaning',420,'Sent',-2],['INV-1095','Invoice',7,'Roof leak inspection',310,'Overdue',-35],['Q-1044','Quote',6,'Commercial grease trap service',1200,'Declined',-9]];
 const invoices=I.map((x,i)=>({id:'i'+i,number:x[0],kind:x[1],customer:C[x[2]][0],desc:x[3],amount:x[4],status:x[5],date:U.day(x[6])}));
 const L=[['Sam Placeholder','HVAC','New',0,'08:12','Auto-text sent: "Sorry we missed you! Reply with what you need and a good time to call."'],['Drew Sampleton','Plumbing','New',0,'07:45','Replied by text: water under kitchen sink.'],['Unknown caller','General repair','New',-1,'18:20','No reply to auto-text yet.'],['Jamie Mockford','Electrical','Called back',-1,'12:05','Wants quote for EV charger.'],['Quinn Fictional','Roofing','Booked',-2,'16:40','Booked inspection.'],['Alex Testcase','Plumbing','Lost',-4,'09:30','Went with another provider.']];
 const leads=L.map((l,i)=>({id:'l'+i,caller:l[0],phone:'(555) 014-'+String(2000+i*111).slice(-4),service:l[1],status:l[2],date:U.day(l[3]),time:l[4],note:l[5]}));
 return {customers,jobs,invoices,leads}},
screens:[
{id:'dashboard',label:'Dashboard',icon:'grid',render(v,A){const db=A.db;
 const wk=db.jobs.filter(j=>U.diff(j.date)>=0&&U.diff(j.date)<7&&j.status!=='Cancelled');
 const openQ=db.invoices.filter(i=>i.kind==='Quote'&&/Draft|Sent/.test(i.status));
 const unpaid=db.invoices.filter(i=>i.kind==='Invoice'&&/Sent|Overdue/.test(i.status));
 const overdue=unpaid.filter(i=>i.status==='Overdue');const newL=db.leads.filter(l=>l.status==='New');
 const days=[...Array(7)].map((_,i)=>U.day(i-6));
 const data=days.map(d=>({label:U.wd(d),value:U.sum(db.jobs.filter(j=>j.date===d&&j.status==='Completed'),j=>j.value)}));
 const up=db.jobs.filter(j=>U.diff(j.date)>=0&&j.status!=='Cancelled'&&j.status!=='Completed').sort(jobsDef.sort).slice(0,6);
 v.innerHTML=A.kpis([{label:'Jobs next 7 days',value:wk.length,sub:U.money(U.sum(wk,j=>j.value))+' scheduled value'},{label:'Open quotes',value:U.money(U.sum(openQ,q=>q.amount)),sub:openQ.length+' awaiting a decision'},{label:'Unpaid invoices',value:U.money(U.sum(unpaid,q=>q.amount)),sub:overdue.length+' overdue',alert:overdue.length>0},{label:'New missed-call leads',value:newL.length,sub:'Need a callback',alert:newL.length>0}])+
 `<div class="grid g-2-1"><div class="card"><h3>Completed job revenue · last 7 days <span class="muted small">${U.money(U.sum(data,d=>d.value))} total</span></h3>${A.bar(data,{fmt:v=>U.money(v)})}</div>
 <div class="card"><h3>Missed-call inbox <a class="btn sm" href="#leads">Open</a></h3><div class="list">${newL.length?newL.slice(0,4).map(l=>`<div class="li">${U.icon('phone')}<div class="m"><div class="t">${U.esc(l.caller)}</div><div class="sub">${l.service} · ${U.fdate(l.date)} ${U.ftime(l.time)}</div></div>${U.badge(l.status)}</div>`).join(''):'<p class="muted">All caught up.</p>'}</div></div></div>
 <div class="card table-card"><div style="padding:16px 18px 0"><h3>Upcoming jobs <a class="btn sm" href="#schedule">View schedule</a></h3></div><table class="tbl"><thead><tr><th>Job</th><th>Customer</th><th>Tech</th><th>When</th><th>Value</th><th>Status</th></tr></thead><tbody>${up.map(j=>`<tr><td data-label="Job">${U.esc(j.title)}</td><td data-label="Customer">${U.esc(j.customer)}</td><td data-label="Tech">${j.tech}</td><td data-label="When">${U.wd(j.date)} ${U.fdate(j.date)} · ${U.ftime(j.time)}</td><td data-label="Value">${U.money(j.value)}</td><td data-label="Status">${U.badge(j.status)}</td></tr>`).join('')}</tbody></table></div>`}},
{id:'schedule',label:'Schedule',icon:'cal',render(v,A){A.st.wk=A.st.wk||0;A.st.tech=A.st.tech||'';
 const s=new Date();s.setDate(s.getDate()-((s.getDay()+6)%7)+A.st.wk*7);const days=[...Array(7)].map((_,i)=>{const d=new Date(s);d.setDate(d.getDate()+i);return U.iso(d)});
 const tone={Completed:'green','In progress':'amber',Cancelled:'red',Scheduled:''};
 v.innerHTML=`<div class="toolbar"><button class="btn" data-w="-1">‹ Prev</button><button class="btn" data-w="0">This week</button><button class="btn" data-w="1">Next ›</button><b style="margin-left:6px">${U.fdate(days[0])} – ${U.fdate(days[6])}</b><span class="sp"></span><select id="tf"><option value="">All technicians</option>${TECHS.map(t=>`<option ${t===A.st.tech?'selected':''}>${t}</option>`).join('')}</select><button class="btn primary" id="addj">+ New job</button></div>
 <div class="cal">${days.map(d=>{const js=A.db.jobs.filter(j=>j.date===d&&(!A.st.tech||j.tech===A.st.tech)).sort(jobsDef.sort);return `<div class="cal-day ${d===U.day()?'today':''}" data-d="${d}" title="Click empty space to add a job"><h4><span>${U.wd(d)}</span><span>${U.fdate(d)}</span></h4>${js.map(j=>`<div class="ev ${tone[j.status]}" data-id="${j.id}"><b>${U.esc(j.title)}</b>${U.ftime(j.time)} · ${j.tech}</div>`).join('')}</div>`}).join('')}</div>
 <p class="muted small">Click a job to edit it, or click an empty part of a day to schedule a new one.</p>`;
 v.querySelectorAll('[data-w]').forEach(b=>b.onclick=()=>{const w=+b.dataset.w;A.st.wk=w?A.st.wk+w:0;A.route()});
 v.querySelector('#tf').onchange=e=>{A.st.tech=e.target.value;A.route()};v.querySelector('#addj').onclick=()=>A.edit(jobsDef,null,{date:U.day(),status:'Scheduled'});
 v.querySelector('.cal').onclick=e=>{const ev=e.target.closest('.ev');if(ev)return A.edit(jobsDef,A.db.jobs.find(j=>j.id===ev.dataset.id));const d=e.target.closest('.cal-day');if(d)A.edit(jobsDef,null,{date:d.dataset.d,status:'Scheduled',tech:A.st.tech||TECHS[0]})}}},
{id:'jobs',label:'Jobs',icon:'wrench',render(v,A){A.crud(v,jobsDef)}},
{id:'customers',label:'Customers',icon:'users',render(v,A){A.crud(v,custDef)}},
{id:'invoices',label:'Quotes & Invoices',icon:'file',render(v,A){const d=A.db.invoices,g=s=>U.money(U.sum(d.filter(s),x=>x.amount));
 v.innerHTML=A.kpis([{label:'Quotes pending',value:g(x=>x.kind==='Quote'&&/Draft|Sent/.test(x.status))},{label:'Quotes accepted',value:g(x=>x.kind==='Quote'&&x.status==='Accepted')},{label:'Awaiting payment',value:g(x=>x.kind==='Invoice'&&x.status==='Sent')},{label:'Overdue',value:g(x=>x.status==='Overdue'),alert:true}])+'<div id="c"></div>';A.crud(v.querySelector('#c'),invDef)}},
{id:'leads',label:'Missed-call Leads',icon:'inbox',title:'Missed-call lead inbox',render(v,A){v.innerHTML=`<div class="info">When a call goes unanswered, the caller gets an automatic text-back and lands here so nobody slips through. <b>Calls and texts are simulated in this demo.</b></div><div id="c"></div>`;A.crud(v.querySelector('#c'),leadDef)}}
]});
