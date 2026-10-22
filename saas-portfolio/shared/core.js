(function(){
const ICONS={
grid:'<rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>',
cal:'<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',
users:'<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>',
file:'<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M8 13h8M8 17h8"/>',
inbox:'<path d="M22 12h-6l-2 3h-4l-2-3H2"/><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/>',
star:'<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>',
send:'<path d="M22 2 11 13M22 2l-7 20-4-9-9-4 20-7z"/>',
trophy:'<path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0V4zM17 5h3v2a3 3 0 0 1-3 3M7 5H4v2a3 3 0 0 0 3 3"/>',
bell:'<path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0"/>',
link:'<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>',
truck:'<path d="M1 3h15v13H1zM16 8h4l3 3v5h-7z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>',
wrench:'<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>',
fuel:'<path d="M3 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18M3 22h12M6 8h6M15 10h2a2 2 0 0 1 2 2v5a2 2 0 0 0 4 0V9l-3-3"/>',
chart:'<path d="M18 20V10M12 20V4M6 20v-6"/>',
phone:'<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/>',
msg:'<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>',
clock:'<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
check:'<path d="M20 6 9 17l-5-5"/>',
out:'<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/>',
reset:'<path d="M1 4v6h6M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/>',
alert:'<path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0zM12 9v4M12 17h.01"/>',
dollar:'<path d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>',
scissors:'<circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M20 4 8.12 15.88M14.47 14.48 20 20M8.12 8.12 12 12"/>',
spark:'<path d="M12 3l1.9 5.8L20 11l-6.1 2.2L12 19l-1.9-5.8L4 11l6.1-2.2z"/>'
};
const pad=n=>String(n).padStart(2,'0');
const U=window.U={
 esc:s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])),
 iso:d=>d.getFullYear()+'-'+pad(d.getMonth()+1)+'-'+pad(d.getDate()),
 day:(o=0)=>{const d=new Date();d.setDate(d.getDate()+o);return U.iso(d)},
 parse:s=>{const[y,m,d]=String(s).split('-').map(Number);return new Date(y,(m||1)-1,d||1)},
 diff:s=>Math.round((U.parse(s)-U.parse(U.day()))/864e5),
 money:(n,dec)=>'$'+Number(n||0).toLocaleString('en-US',{minimumFractionDigits:dec?2:0,maximumFractionDigits:dec?2:0}),
 fdate:s=>s?U.parse(s).toLocaleDateString('en-US',{month:'short',day:'numeric'}):'',
 wd:s=>U.parse(s).toLocaleDateString('en-US',{weekday:'short'}),
 ftime:t=>{if(!t)return'';let[h,m]=t.split(':').map(Number);const ap=h>=12?'PM':'AM';h=h%12||12;return h+':'+pad(m)+' '+ap},
 id:()=>Math.random().toString(36).slice(2,9),
 icon:n=>`<svg class="ico" viewBox="0 0 24 24" aria-hidden="true">${ICONS[n]||''}</svg>`,
 tone:v=>{v=String(v).toLowerCase();if(/overdue|missed|^new$|no-show|lost|in shop|needs reply|cancel/.test(v))return'red';if(/paid|complete|done|active|accepted|confirmed|replied|called back|booked|^on$|^yes$/.test(v))return'green';if(/scheduled|sent|progress|paused|pending|due soon/.test(v))return'amber';return''},
 badge:v=>`<span class="b ${U.tone(v)}">${U.esc(v)}</span>`,
 stars:n=>`<span class="stars" title="${n} of 5">${'★'.repeat(n)}${'☆'.repeat(5-n)}</span>`,
 rng:seed=>()=>((seed=(seed*16807)%2147483647)/2147483647),
 sum:(a,f)=>a.reduce((s,x)=>s+(+f(x)||0),0)
};
const niceMax=m=>{if(m<=0)return 1;const e=10**Math.floor(Math.log10(m));const s=e/2;return Math.ceil(m/s)*s};
const App=window.App={
 st:{},
 init(cfg){this.cfg=cfg;this.load();document.title=cfg.name+' · Demo app';
  if(!sessionStorage.getItem(cfg.key+'-auth'))return this.login();this.start()},
 start(){this.shell();addEventListener('hashchange',()=>this.route());this.route()},
 load(){const raw=localStorage.getItem(this.cfg.key);try{this.db=raw?JSON.parse(raw):null}catch(e){this.db=null}if(!this.db){this.db=this.cfg.seed();this.save()}},
 save(){localStorage.setItem(this.cfg.key,JSON.stringify(this.db))},
 logo(){return `<a class="logo" href="index.html"><i>${this.cfg.name[0]}</i><span>${this.cfg.name}</span></a>`},
 login(){document.body.innerHTML=`<div class="login-wrap"><form class="card login">${this.logo()}<span class="demo-badge">Demo / sample data</span><h1>Sign in to ${this.cfg.name}</h1><p class="muted small" style="margin:0">This is a demo login. No account is created and nothing is checked — any values work.</p><label>Email<input type="email" value="demo@example.com" required></label><label>Password<input type="password" value="demo-password" required></label><button class="btn primary lg">Sign in to demo</button><a class="muted small" href="index.html" style="text-align:center">← Back to product page</a></form></div>`;
  document.querySelector('form').onsubmit=e=>{e.preventDefault();sessionStorage.setItem(this.cfg.key+'-auth','1');this.start()}},
 shell(){const c=this.cfg;document.body.innerHTML=`<div class="app"><aside class="side">${this.logo()}<nav class="nav">${c.screens.map(s=>`<a href="#${s.id}" data-id="${s.id}" title="${s.label}">${U.icon(s.icon)}<span>${s.label}</span></a>`).join('')}</nav><div class="side-foot"><span class="demo-badge">Demo / sample data</span><button class="btn" id="reset" title="Reset sample data">${U.icon('reset')}<span>Reset sample data</span></button><button class="btn" id="logout" title="Log out">${U.icon('out')}<span>Log out</span></button></div></aside><main><header class="topbar"><h1 id="title"></h1><span class="sp"></span><span id="tact"></span><span class="demo-badge">Demo / sample data</span></header><div class="view" id="view"></div></main></div><div id="toast"></div>`;
  document.getElementById('reset').onclick=()=>{if(confirm('Reset all demo data to the original sample set?')){localStorage.removeItem(c.key);this.load();this.st={};this.route();this.toast('Sample data restored')}};
  document.getElementById('logout').onclick=()=>{sessionStorage.removeItem(c.key+'-auth');location.href='index.html'}},
 route(){const sc=this.cfg.screens;const id=location.hash.slice(1);const s=sc.find(x=>x.id===id)||sc[0];
  document.querySelectorAll('.nav a').forEach(a=>a.classList.toggle('on',a.dataset.id===s.id));
  document.getElementById('title').textContent=s.title||s.label;document.getElementById('tact').innerHTML='';
  const v=document.getElementById('view');v.innerHTML='';v.onclick=null;scrollTo(0,0);s.render(v,this)},
 toast(m){const t=document.getElementById('toast');t.textContent=m;t.classList.add('show');clearTimeout(this._t);this._t=setTimeout(()=>t.classList.remove('show'),2200)},
 kpis(a){return `<div class="kpis">${a.map(k=>`<div class="kpi ${k.alert?'alert':''}"><div class="l">${k.label}</div><div class="v">${k.value}</div>${k.sub?`<div class="s">${k.sub}</div>`:''}</div>`).join('')}</div>`},
 modal(title,body,onSubmit,label='Save'){const r=document.createElement('div');r.className='modal-bg';
  r.innerHTML=`<form class="modal"><h2>${U.esc(title)}</h2>${body}<div class="modal-foot"><button type="button" class="btn" data-x>Cancel</button>${onSubmit?`<button class="btn primary">${label}</button>`:''}</div></form>`;
  document.body.appendChild(r);const f=r.querySelector('form');
  r.addEventListener('click',e=>{if(e.target===r||e.target.hasAttribute('data-x'))r.remove()});
  f.onsubmit=e=>{e.preventDefault();if(onSubmit&&onSubmit(f)!==false)r.remove()};
  const i=f.querySelector('input,select,textarea');i&&i.focus();return r},
 opts(f){return typeof f.options==='function'?f.options(this.db):f.options},
 fieldsHtml(fields,rec){return fields.map(f=>{const v=rec[f.k]??f.def??'';const full=(f.type==='textarea'||f.full)?'full':'';const req=f.req?'required':'';let inp;
  if(f.type==='checkbox')return `<label class="chk full"><input type="checkbox" name="${f.k}" ${v?'checked':''}> ${f.label}</label>`;
  if(f.type==='select')inp=`<select name="${f.k}">${this.opts(f).map(o=>`<option ${String(o)===String(v)?'selected':''}>${U.esc(o)}</option>`).join('')}</select>`;
  else if(f.type==='textarea')inp=`<textarea name="${f.k}" rows="3">${U.esc(v)}</textarea>`;
  else{const t=f.type==='money'||f.type==='number'?'number':(f.type||'text');inp=`<input name="${f.k}" type="${t}" ${t==='number'?`step="${f.type==='money'?'0.01':'any'}" min="0"`:''} value="${U.esc(v)}" ${req}>`}
  return `<label class="${full}">${f.label}${inp}</label>`}).join('')},
 collect(form,fields){const o={};fields.forEach(f=>{const el=form.elements[f.k];if(!el)return;o[f.k]=f.type==='checkbox'?el.checked:(f.type==='number'||f.type==='money')?(parseFloat(el.value)||0):el.value.trim()});return o},
 edit(def,rec,preset={}){const isNew=!rec;const base=rec||preset;
  this.modal((isNew?'Add ':'Edit ')+def.singular.toLowerCase(),`<div class="form">${this.fieldsHtml(def.fields,base)}</div>`,form=>{const d=this.collect(form,def.fields);
   if(isNew){d.id=U.id();Object.keys(preset).forEach(k=>{if(!(k in d))d[k]=preset[k]});this.db[def.key].unshift(d)}else Object.assign(rec,d);
   def.onSave&&def.onSave(isNew?d:rec,isNew,this);this.save();this.toast(def.singular+(isNew?' added':' saved'));this.route()})},
 del(def,rec){if(!confirm(`Delete this ${def.singular.toLowerCase()}?`))return;this.db[def.key]=this.db[def.key].filter(x=>x.id!==rec.id);this.save();this.toast(def.singular+' deleted');this.route()},
 cell(def,c,r){if(typeof c==='object')return c.render(r,this);const f=def.fields.find(x=>x.k===c)||{};const v=r[c];
  if(f.badge)return U.badge(v);if(f.type==='money')return U.money(v,f.dec);if(f.type==='date')return U.fdate(v);if(f.type==='time')return U.ftime(v);if(f.type==='checkbox')return v?'Yes':'No';return U.esc(v)},
 colLabel(def,c){return typeof c==='object'?c.label:(def.fields.find(x=>x.k===c)||{label:c}).label},
 crud(el,def){const st=this.st[def.key]||(this.st[def.key]={q:'',f:{}});
  el.innerHTML=`<div class="toolbar" style="margin-bottom:14px"><input type="search" placeholder="Search ${def.plural||def.key}…" value="${U.esc(st.q)}" style="width:240px">${(def.filters||[]).map(k=>{const f=def.fields.find(x=>x.k===k);return `<select data-f="${k}"><option value="">All ${f.label.toLowerCase()}</option>${this.opts(f).map(o=>`<option ${st.f[k]===String(o)?'selected':''}>${U.esc(o)}</option>`).join('')}</select>`}).join('')}<span class="sp"></span><span class="muted small" data-count></span><button class="btn primary" data-add>+ Add ${def.singular.toLowerCase()}</button></div>
  <div class="card table-card"><table class="tbl"><thead><tr>${def.columns.map(c=>`<th>${this.colLabel(def,c)}</th>`).join('')}<th></th></tr></thead><tbody></tbody></table><div class="empty" hidden>No records match these filters.</div></div>`;
  const tb=el.querySelector('tbody');
  const draw=()=>{let rows=this.db[def.key].slice();const q=st.q.toLowerCase();
   if(q)rows=rows.filter(r=>Object.values(r).join(' ').toLowerCase().includes(q));
   Object.entries(st.f).forEach(([k,v])=>{if(v)rows=rows.filter(r=>String(r[k])===v)});
   if(def.sort)rows.sort(def.sort);
   tb.innerHTML=rows.map(r=>`<tr>${def.columns.map(c=>`<td data-label="${U.esc(this.colLabel(def,c))}">${this.cell(def,c,r)}</td>`).join('')}<td class="acts">${(def.actions||[]).map((a,i)=>!a.show||a.show(r)?`<button class="btn sm" data-a="${i}" data-id="${r.id}">${a.label}</button> `:'').join('')}<button class="btn sm" data-a="edit" data-id="${r.id}">Edit</button> <button class="btn sm danger" data-a="del" data-id="${r.id}">Delete</button></td></tr>`).join('');
   el.querySelector('.empty').hidden=rows.length>0;el.querySelector('[data-count]').textContent=rows.length+' of '+this.db[def.key].length};
  el.querySelector('input[type=search]').oninput=e=>{st.q=e.target.value;draw()};
  el.querySelectorAll('select[data-f]').forEach(s=>s.onchange=()=>{st.f[s.dataset.f]=s.value;draw()});
  el.querySelector('[data-add]').onclick=()=>this.edit(def,null,def.preset?def.preset(this):{});
  tb.onclick=e=>{const b=e.target.closest('button[data-a]');if(!b)return;const r=this.db[def.key].find(x=>x.id===b.dataset.id);const a=b.dataset.a;
   if(a==='edit')this.edit(def,r);else if(a==='del')this.del(def,r);else{def.actions[a].run(r,this);this.save();this.route()}};
  draw()},
 bar(data,o={}){const W=600,H=o.h||240,p={l:52,r:8,t:12,b:28},fmt=o.fmt||(v=>Math.round(v));const colors=o.colors||['#E10600','#0B0B0B'];
  const vals=data.map(d=>[].concat(d.value));const max=niceMax(Math.max(0,...vals.map(v=>v.reduce((a,b)=>a+b,0))));
  const ih=H-p.t-p.b,cw=(W-p.l-p.r)/data.length,bw=Math.min(44,cw*.62);let s='';
  for(let i=0;i<=4;i++){const y=p.t+ih*i/4;s+=`<line class="gl" x1="${p.l}" x2="${W-p.r}" y1="${y}" y2="${y}"/><text class="ax" x="${p.l-8}" y="${y+4}" text-anchor="end">${fmt(max*(1-i/4))}</text>`}
  data.forEach((d,i)=>{const x=p.l+cw*i+(cw-bw)/2;let base=H-p.b;vals[i].forEach((v,j)=>{const bh=ih*v/max;base-=bh;if(bh>0)s+=`<rect x="${x}" y="${base}" width="${bw}" height="${bh}" rx="3" fill="${colors[j%colors.length]}"><title>${U.esc(d.label)}: ${fmt(v)}</title></rect>`});
   s+=`<text class="ax" x="${x+bw/2}" y="${H-9}" text-anchor="middle">${U.esc(d.label)}</text>`});
  return `<svg class="chart" viewBox="0 0 ${W} ${H}" role="img">${s}</svg>`},
 line(data,o={}){const W=600,H=o.h||240,p={l:52,r:14,t:14,b:28},fmt=o.fmt||(v=>Math.round(v));const min=o.min??0;
  const max=o.max??niceMax(Math.max(...data.map(d=>d.value)));const ih=H-p.t-p.b,iw=W-p.l-p.r;let s='';
  for(let i=0;i<=4;i++){const y=p.t+ih*i/4;s+=`<line class="gl" x1="${p.l}" x2="${W-p.r}" y1="${y}" y2="${y}"/><text class="ax" x="${p.l-8}" y="${y+4}" text-anchor="end">${fmt(max-(max-min)*i/4)}</text>`}
  const pts=data.map((d,i)=>[p.l+(data.length>1?iw*i/(data.length-1):iw/2),p.t+ih*(1-(d.value-min)/((max-min)||1))]);
  s+=`<path d="M${pts[0][0]},${H-p.b} L${pts.map(q=>q.join(',')).join(' L')} L${pts[pts.length-1][0]},${H-p.b}Z" fill="rgba(225,6,0,.08)"/><polyline points="${pts.map(q=>q.join(',')).join(' ')}" fill="none" stroke="#E10600" stroke-width="2.5" stroke-linejoin="round"/>`;
  const every=Math.ceil(data.length/8);
  pts.forEach((q,i)=>{s+=`<circle cx="${q[0]}" cy="${q[1]}" r="3.5" fill="#fff" stroke="#E10600" stroke-width="2"><title>${U.esc(data[i].label)}: ${fmt(data[i].value)}</title></circle>`;if(i%every===0||i===data.length-1)s+=`<text class="ax" x="${q[0]}" y="${H-9}" text-anchor="middle">${U.esc(data[i].label)}</text>`});
  return `<svg class="chart" viewBox="0 0 ${W} ${H}" role="img">${s}</svg>`},
 hbars(rows,fmt=v=>v){const m=Math.max(1,...rows.map(r=>r.value));return rows.map(r=>`<div class="hbar"><span class="n" title="${U.esc(r.label)}">${U.esc(r.label)}</span><span class="tr"><i style="width:${r.value/m*100}%"></i></span><span class="val">${fmt(r.value)}</span></div>`).join('')},
 legend(items){return `<div class="legend">${items.map(([l,c])=>`<span style="--c:${c}">${l}</span>`).join('')}</div>`}
};
})();
