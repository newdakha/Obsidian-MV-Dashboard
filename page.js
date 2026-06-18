
```dataviewjs
const USERNAME = "nuxoraa";
const VAULT_FILES = app.vault.getFiles().map(f=>f.path);
const CARDS = [
  { title: "Todo",        tasks: ["Настроить Obsidian","Установить плагины","Сделать CSS тему"] },
  { title: "Notes",       tasks: ["Записать идеи","Обновить дневник","Законспектировать урок"] },
  { title: "Projects",    tasks: ["Raspberry Pi LCD","ESP8266 notes app","Telegram бот"] },
  { title: "Done",        tasks: ["Установить .NET 9","Настроить Node.js"] },
  { title: "In Progress", tasks: ["Obsidian тема","GitHub контрибуты","Alpine Linux"] },
];
const P={page:"#1e1e1e",card:"#262626",border:"#333",stripe:"#404040",text:"#888",textDim:"#444",textMid:"#666",accent:"#999",inp:"#1a1a1a",c0:"#1e1e1e",c1:"#2e2e2e",c2:"#404040",c3:"#555",c4:"#707070"};
const MONTHS=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const MONTHS_FULL=["January","February","March","April","May","June","July","August","September","October","November","December"];
const DAYS_SHORT=["MON","TUE","WED","THU","FRI","SAT","SUN"];
const WEEK_RU=["Вс","Пн","Вт","Ср","Чт","Пт","Сб"];
const WMO_DESC={0:"Ясно",1:"Преимущественно ясно",2:"Переменная облачность",3:"Пасмурно",45:"Туман",48:"Изморозь",51:"Лёгкая морось",53:"Морось",55:"Сильная морось",61:"Небольшой дождь",63:"Дождь",65:"Сильный дождь",71:"Небольшой снег",73:"Снег",75:"Сильный снег",77:"Снежные зёрна",80:"Ливень",81:"Сильный ливень",82:"Шквальный ливень",85:"Снежный ливень",86:"Сильный снежный ливень",95:"Гроза",96:"Гроза с градом",99:"Гроза с крупным градом"};
const WMO_ICON=n=>{
  if(n===0)return"○";
  if(n<=2)return"◑";
  if(n===3)return"●";
  if(n<=48)return"≋";
  if(n<=55)return"·̈·";
  if(n<=65)return"⌇";
  if(n<=77)return"∗";
  if(n<=82)return"⌇⌇";
  if(n<=86)return"∗∗";
  return"↯";
};

const SK="mv11";
let saved={};
try{saved=JSON.parse(localStorage.getItem(SK)||"{}");}catch(e){}
const persist=()=>{try{localStorage.setItem(SK,JSON.stringify(saved));}catch(e){}};
if(!saved.notes)saved.notes={};
if(!saved.cards)saved.cards={};
if(!saved.pads)saved.pads={"pad_0":{title:"Note 1",text:""}};
if(!saved.padOrder)saved.padOrder=["pad_0"];
if(!saved.activePad)saved.activePad="pad_0";

this.container.style.cssText="width:100%;max-width:none;";
if(this.container.parentElement)this.container.parentElement.style.maxWidth="none";

const style=document.createElement("style");
style.textContent=`
  .mv{background:${P.page};width:100%;box-sizing:border-box;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;}

  .mv-ban{width:100%;height:160px;border-radius:8px;margin-bottom:10px;border:1px solid ${P.border};position:relative;overflow:hidden;background:#202020;}
  .mv-ban-grid{position:absolute;inset:0;background-image:linear-gradient(${P.border}55 1px,transparent 1px),linear-gradient(90deg,${P.border}55 1px,transparent 1px);background-size:32px 32px;}
  .mv-ban-fade{position:absolute;inset:0;background:radial-gradient(ellipse 80% 100% at 50% 50%,transparent 30%,#202020 100%);}
  .mv-gc{position:absolute;inset:0;width:100%;height:100%;}
  .mv-ban-bars{position:absolute;bottom:20px;left:24px;display:flex;flex-direction:column;gap:7px;z-index:2;}
  .mv-ban-bar{height:3px;border-radius:2px;background:${P.stripe};}

  .mv-mid{display:grid;grid-template-columns:1fr 280px;gap:10px;margin-bottom:10px;}
  .mv-left-col{display:flex;flex-direction:column;gap:8px;}
  .mv-right-col{display:flex;flex-direction:column;gap:8px;}

  .mv-heat{border-radius:8px;background:${P.card};border:1px solid ${P.border};padding:14px 18px;overflow:hidden;}
  .mv-mrow{display:flex;gap:3px;margin-bottom:4px;}
  .mv-mlbl{font-size:9px;color:${P.textDim};white-space:nowrap;overflow:visible;font-family:monospace;}
  .mv-hg{display:flex;gap:3px;}
  .mv-hc{display:flex;flex-direction:column;gap:3px;}
  .mv-hcell{border-radius:2px;cursor:default;}
  .mv-hcell:hover{outline:1px solid ${P.accent}55;}

  .mv-search-wrap{position:relative;}
  .mv-search-box{display:flex;align-items:center;background:${P.inp};border:1px solid ${P.border};border-radius:6px;padding:0 12px;gap:8px;transition:border-color 0.15s;}
  .mv-search-box:focus-within{border-color:${P.stripe};}
  .mv-search-icon{color:${P.textDim};font-size:11px;}
  .mv-search-inp{flex:1;background:transparent;border:none;padding:8px 0;font-size:11px;font-family:inherit;color:${P.accent};outline:none;}
  .mv-search-inp::placeholder{color:${P.textDim};}
  .mv-search-clear{background:none;border:none;color:${P.textDim};cursor:pointer;font-size:10px;padding:0;}
  .mv-search-clear:hover{color:${P.accent};}
  .mv-results{position:absolute;top:calc(100% + 4px);left:0;right:0;background:#242424;border:1px solid ${P.border};border-radius:6px;z-index:1000;max-height:200px;overflow-y:auto;box-shadow:0 8px 24px rgba(0,0,0,0.5);}
  .mv-result-item{padding:7px 12px;font-size:11px;color:${P.textMid};cursor:pointer;display:flex;align-items:center;gap:8px;transition:background 0.1s;}
  .mv-result-item:hover{background:${P.border};color:#ccc;}
  .mv-result-item b{color:${P.accent};font-weight:600;}
  .mv-no-results{padding:10px 12px;font-size:11px;color:${P.textDim};text-align:center;}

  /* WEATHER */
  .mv-weather{border-radius:8px;background:${P.card};border:1px solid ${P.border};padding:14px 18px;flex:1;display:flex;flex-direction:column;}
  .mv-w-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;}
  .mv-w-city{font-size:12px;font-weight:600;color:#bbb;display:flex;align-items:center;gap:6px;}
  .mv-w-city-dot{width:5px;height:5px;border-radius:50%;background:${P.stripe};}
  .mv-w-updated{font-size:9px;color:${P.textDim};}
  .mv-w-outer{display:grid;grid-template-columns:1fr 0fr;gap:0;transition:grid-template-columns 0.4s ease;flex:1;}
  .mv-w-days{display:grid;grid-template-columns:repeat(7,1fr);gap:4px;align-content:start;}
  .mv-w-day{background:${P.inp};border:1px solid ${P.border};border-radius:6px;padding:10px 4px;text-align:center;cursor:pointer;transition:all 0.15s;display:flex;flex-direction:column;align-items:center;gap:5px;}
  .mv-w-day:hover{border-color:${P.stripe};background:#222;}
  .mv-w-day.active{border-color:${P.stripe};background:#1f1f1f;}
  .mv-w-day-name{font-size:9px;color:${P.textDim};font-weight:600;letter-spacing:0.04em;}
  .mv-w-day-icon{font-size:15px;line-height:1;color:#777;font-family:monospace;letter-spacing:-1px;font-style:normal;}
  .mv-w-day-max{font-size:12px;color:#ccc;font-weight:600;}
  .mv-w-day-min{font-size:9px;color:${P.textMid};}
  .mv-w-day-bar{width:80%;height:2px;border-radius:2px;background:${P.border};overflow:hidden;}
  .mv-w-day-bar-fill{height:100%;border-radius:2px;background:${P.stripe};}
  .mv-w-day-precip{font-size:8px;color:${P.textDim};}

  /* detail panel */
  .mv-w-detail{overflow:hidden;opacity:0;transition:opacity 0.35s ease;padding-left:0;box-sizing:border-box;}
  .mv-w-detail.open{opacity:1;padding-left:10px;}
  .mv-w-detail-inner{background:${P.inp};border:1px solid ${P.border};border-radius:8px;padding:14px;min-width:210px;height:100%;box-sizing:border-box;display:flex;flex-direction:column;gap:10px;}
  .mv-w-dtop{display:flex;align-items:center;gap:10px;}
  .mv-w-dicon{font-size:28px;color:#666;font-family:monospace;font-style:normal;}
  .mv-w-dtemp{font-size:26px;font-weight:700;color:#eee;line-height:1;}
  .mv-w-ddesc{font-size:10px;color:${P.textMid};margin-top:2px;}
  .mv-w-ddate{font-size:9px;color:${P.textDim};margin-top:1px;text-transform:uppercase;letter-spacing:0.05em;}
  .mv-w-stats{display:grid;grid-template-columns:1fr 1fr;gap:5px;}
  .mv-w-stat{background:#1a1a1a;border-radius:5px;padding:7px 9px;}
  .mv-w-stat-lbl{font-size:8px;color:${P.textDim};text-transform:uppercase;letter-spacing:0.04em;margin-bottom:2px;}
  .mv-w-stat-val{font-size:12px;color:#bbb;font-weight:600;}
  .mv-w-stat-sub{font-size:8px;color:${P.textDim};margin-top:1px;}
  .mv-w-hourly{display:flex;gap:4px;overflow-x:auto;padding-bottom:2px;}
  .mv-w-hour{flex-shrink:0;background:#1a1a1a;border-radius:4px;padding:5px 6px;text-align:center;min-width:36px;}
  .mv-w-hour-time{font-size:8px;color:${P.textDim};margin-bottom:2px;}
  .mv-w-hour-icon{font-size:11px;color:#666;font-family:monospace;margin-bottom:2px;}
  .mv-w-hour-temp{font-size:10px;color:#aaa;font-weight:600;}
  .mv-w-loading{color:${P.textDim};font-size:11px;text-align:center;padding:20px 0;}

  /* CALENDAR */
  .mv-cal{background:${P.card};border:1px solid ${P.border};border-radius:8px;padding:14px 16px;box-sizing:border-box;}
  .mv-cal-head{display:flex;align-items:center;justify-content:space-between;margin-bottom:10px;}
  .mv-cal-title{font-size:13px;font-weight:600;color:#ccc;}
  .mv-cal-nav{display:flex;align-items:center;gap:4px;}
  .mv-cal-navbtn{background:none;border:none;color:${P.textMid};cursor:pointer;font-size:14px;padding:0 5px;line-height:1;transition:color 0.1s;}
  .mv-cal-navbtn:hover{color:#ccc;}
  .mv-cal-today{background:none;border:1px solid ${P.border};color:${P.textMid};cursor:pointer;font-size:9px;font-family:inherit;padding:2px 7px;border-radius:4px;}
  .mv-cal-today:hover{color:#ccc;border-color:${P.stripe};}
  .mv-cal-days{display:grid;grid-template-columns:repeat(7,1fr);margin-bottom:4px;}
  .mv-cal-daylbl{font-size:8px;color:${P.textDim};text-align:center;padding:2px 0;font-weight:600;letter-spacing:0.03em;}
  .mv-cal-grid{display:grid;grid-template-columns:repeat(7,1fr);gap:2px;}
  .mv-cal-cell{font-size:10px;text-align:center;padding:5px 2px;border-radius:4px;cursor:pointer;color:${P.textMid};min-height:26px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px;transition:background 0.1s;}
  .mv-cal-cell:hover{background:${P.border};}
  .mv-cal-cell.today{background:${P.stripe};color:#eee;font-weight:700;}
  .mv-cal-cell.other{color:${P.textDim};cursor:default;}
  .mv-cal-cell.other:hover{background:transparent;}
  .mv-cal-cell.has-note::after{content:"";width:3px;height:3px;border-radius:50%;background:${P.accent};display:block;}
  .mv-cal-cell.selected{outline:1px solid ${P.accent}77;}
  .mv-cal-popup{position:fixed;background:#242424;border:1px solid ${P.stripe};border-radius:8px;padding:14px;z-index:10000;width:240px;box-shadow:0 8px 32px rgba(0,0,0,0.6);}
  .mv-cal-popup-date{font-size:11px;color:${P.accent};margin-bottom:8px;font-weight:600;}
  .mv-cal-popup-ta{width:100%;background:${P.inp};border:1px solid ${P.border};border-radius:5px;padding:8px;font-size:11px;font-family:inherit;color:#bbb;outline:none;resize:none;box-sizing:border-box;min-height:80px;}
  .mv-cal-popup-ta:focus{border-color:${P.stripe};}
  .mv-cal-popup-row{display:flex;gap:6px;margin-top:8px;}
  .mv-cal-popup-save{flex:1;background:${P.stripe};border:none;border-radius:5px;color:#ccc;font-size:11px;font-family:inherit;padding:6px;cursor:pointer;}
  .mv-cal-popup-save:hover{background:#505050;}
  .mv-cal-popup-del{background:none;border:1px solid ${P.border};border-radius:5px;color:${P.textDim};font-size:11px;font-family:inherit;padding:6px 10px;cursor:pointer;}
  .mv-cal-popup-del:hover{color:#cc5555;}
  .mv-cal-popup-close{background:none;border:none;color:${P.textDim};font-size:12px;cursor:pointer;padding:0;float:right;}
  .mv-recent-sep{height:1px;background:${P.border};margin:10px 0 8px;}
  .mv-recent-title{font-size:9px;color:${P.textDim};text-transform:uppercase;letter-spacing:0.06em;margin-bottom:6px;font-weight:600;}
  .mv-recent-item{display:flex;align-items:center;gap:7px;padding:4px 6px;border-radius:4px;cursor:pointer;transition:background 0.1s;margin:0 -6px;}
  .mv-recent-item:hover{background:${P.border};}
  .mv-recent-dot{width:4px;height:4px;border-radius:1px;background:${P.stripe};flex-shrink:0;}
  .mv-recent-name{font-size:11px;color:${P.textMid};flex:1;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
  .mv-recent-folder{font-size:9px;color:${P.textDim};flex-shrink:0;}

  /* NOTEPAD */
  .mv-pad{background:${P.card};border:1px solid ${P.border};border-radius:8px;display:flex;flex-direction:column;overflow:hidden;flex:1;min-height:160px;}
  .mv-pad-tabs{display:flex;align-items:center;border-bottom:1px solid ${P.border};overflow-x:auto;}
  .mv-pad-tab{flex-shrink:0;padding:7px 10px;font-size:10px;cursor:pointer;color:${P.textDim};border-bottom:2px solid transparent;transition:all 0.1s;white-space:nowrap;}
  .mv-pad-tab.active{color:#ccc;border-bottom-color:${P.stripe};}
  .mv-pad-tab:hover{color:${P.accent};}
  .mv-pad-tab-add{background:none;border:none;color:${P.textDim};font-size:15px;padding:0 8px;cursor:pointer;flex-shrink:0;line-height:1;transition:color 0.1s;}
  .mv-pad-tab-add:hover{color:#ccc;}
  .mv-pad-tab-close{background:none;border:none;color:${P.textDim};font-size:10px;padding:0 6px;cursor:pointer;margin-left:auto;flex-shrink:0;transition:color 0.1s;}
  .mv-pad-tab-close:hover{color:#cc5555;}
  .mv-pad-ta{flex:1;background:transparent;border:none;outline:none;resize:none;padding:12px 14px;font-size:11px;font-family:inherit;color:#aaa;line-height:1.7;}
  .mv-pad-ta::placeholder{color:${P.textDim};}
  .mv-pad-footer{padding:4px 14px;font-size:9px;color:${P.textDim};border-top:1px solid ${P.border};text-align:right;flex-shrink:0;}

  /* CARDS */
  .mv-top{display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;}
  .mv-bot{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:10px;}
  .mv-card{background:${P.card};border:1px solid ${P.border};border-radius:8px;overflow:hidden;display:flex;transition:border-color 0.15s;}
  .mv-card:hover{border-color:${P.stripe};}
  .mv-cleft{width:2px;flex-shrink:0;background:${P.stripe};}
  .mv-body{flex:1;padding:16px 18px;min-width:0;}
  .mv-head{display:flex;align-items:center;gap:8px;margin-bottom:12px;}
  .mv-h-dot{width:7px;height:7px;border-radius:2px;background:${P.stripe};flex-shrink:0;}
  .mv-h-b1{height:3px;border-radius:2px;background:${P.stripe};flex:3;}
  .mv-h-b2{height:3px;border-radius:2px;background:${P.textDim};flex:1;max-width:50px;}
  .mv-h-arr{width:7px;height:7px;border-right:1px solid ${P.textMid};border-bottom:1px solid ${P.textMid};transform:rotate(45deg) translateY(-3px);flex-shrink:0;}
  .mv-sep{height:1px;background:${P.border};margin:0 0 12px;}
  .mv-item{display:flex;align-items:center;gap:8px;margin-bottom:9px;}
  .mv-item:last-of-type{margin-bottom:0;}
  .mv-box{width:14px;height:14px;border:1px solid ${P.stripe};border-radius:3px;flex-shrink:0;cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:9px;color:transparent;transition:all 0.12s;}
  .mv-box:hover{border-color:${P.accent};}
  .mv-box.on{color:${P.accent};border-color:${P.accent};background:${P.accent}11;}
  .mv-bars{flex:1;display:flex;flex-direction:column;gap:4px;min-width:0;cursor:default;}
  .mv-b1{height:3px;border-radius:2px;background:${P.stripe};transition:opacity 0.12s;}
  .mv-b2{height:2px;border-radius:2px;background:${P.border};transition:opacity 0.12s;}
  .mv-b1.on,.mv-b2.on{opacity:0.2;}
  .mv-ico{width:20px;height:20px;border-radius:50%;background:transparent;border:1px solid ${P.border};color:${P.textDim};font-size:11px;cursor:pointer;display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:all 0.12s;line-height:1;padding:0;}
  .mv-ico:hover{border-color:${P.stripe};color:${P.accent};}
  .mv-ico.del:hover{border-color:#cc555533;color:#cc5555;background:#cc555108;}
  .mv-add{display:flex;gap:8px;margin-top:12px;align-items:center;}
  .mv-add-wrap{flex:1;position:relative;display:flex;align-items:center;}
  .mv-add-real{flex:1;background:transparent;border:none;border-bottom:1px solid ${P.border};padding:4px 0;font-size:11px;font-family:inherit;color:${P.accent};outline:none;transition:border-color 0.12s;width:100%;}
  .mv-add-real:focus{border-color:${P.stripe};}
  .mv-add-ph{position:absolute;left:0;top:50%;transform:translateY(-50%);pointer-events:none;display:flex;align-items:center;gap:6px;transition:opacity 0.1s;}
  .mv-add-ph-b1{width:55px;height:3px;border-radius:2px;background:${P.border};}
  .mv-add-ph-b2{width:35px;height:2px;border-radius:2px;background:${P.border};opacity:0.6;}
  .mv-tip{display:none;position:fixed;background:#2a2a2a;border:1px solid ${P.border};color:${P.accent};padding:5px 10px;border-radius:5px;font-size:11px;font-family:monospace;pointer-events:none;z-index:9999;white-space:nowrap;box-shadow:0 4px 12px rgba(0,0,0,0.4);}
`;
document.head.appendChild(style);

const tip=document.createElement("div");tip.className="mv-tip";document.body.appendChild(tip);
const wrap=document.createElement("div");wrap.className="mv";

// BANNER
const ban=document.createElement("div");ban.className="mv-ban";
ban.appendChild(Object.assign(document.createElement("div"),{className:"mv-ban-grid"}));
const canvas=document.createElement("canvas");canvas.className="mv-gc";ban.appendChild(canvas);
ban.appendChild(Object.assign(document.createElement("div"),{className:"mv-ban-fade"}));
const banBars=document.createElement("div");banBars.className="mv-ban-bars";
[[200,0.9],[140,0.6],[170,0.75]].forEach(([w,o])=>{const b=document.createElement("div");b.className="mv-ban-bar";b.style.width=w+"px";b.style.opacity=o;banBars.appendChild(b);});
ban.appendChild(banBars);wrap.appendChild(ban);
setTimeout(()=>{
  const W=ban.clientWidth||900,H=160;canvas.width=W;canvas.height=H;
  const ctx=canvas.getContext("2d"),N=26;
  const nodes=Array.from({length:N},()=>({x:Math.random()*W,y:Math.random()*H,vx:(Math.random()-0.5)*0.4,vy:(Math.random()-0.5)*0.4,r:Math.random()*2+1.5}));
  const edges=[];for(let i=0;i<N;i++)for(let j=i+1;j<N;j++)if(Math.random()<0.13)edges.push([i,j]);
  const draw=()=>{ctx.clearRect(0,0,W,H);nodes.forEach(n=>{n.x+=n.vx;n.y+=n.vy;if(n.x<0||n.x>W)n.vx*=-1;if(n.y<0||n.y>H)n.vy*=-1;});edges.forEach(([a,b])=>{const na=nodes[a],nb=nodes[b],d=Math.hypot(na.x-nb.x,na.y-nb.y);if(d<160){ctx.beginPath();ctx.moveTo(na.x,na.y);ctx.lineTo(nb.x,nb.y);ctx.strokeStyle=`rgba(100,100,100,${0.18*(1-d/160)})`;ctx.lineWidth=1;ctx.stroke();}});nodes.forEach(n=>{ctx.beginPath();ctx.arc(n.x,n.y,n.r,0,Math.PI*2);ctx.fillStyle="rgba(120,120,120,0.5)";ctx.fill();});requestAnimationFrame(draw);};draw();
},50);

// MID
const mid=document.createElement("div");mid.className="mv-mid";
const leftCol=document.createElement("div");leftCol.className="mv-left-col";
const rightCol=document.createElement("div");rightCol.className="mv-right-col";

// HEAT
const heat=document.createElement("div");heat.className="mv-heat";
const gc=n=>n===0?P.c0:n<=3?P.c1:n<=6?P.c2:n<=9?P.c3:P.c4;
try{
  const r=await fetch(`https://github-contributions-api.jogruber.de/v4/${USERNAME}?y=2026`);
  const d=await r.json();
  const weeks=[];let wk=new Array(7).fill(null);
  d.contributions.forEach(day=>{const dow=new Date(day.date).getDay();wk[dow]=day;if(dow===6){weeks.push(wk);wk=new Array(7).fill(null);}});
  if(wk.some(x=>x))weeks.push(wk);
  const heatW=(this.container.clientWidth||900)-300;
  const sz=Math.min(Math.max(Math.floor((heatW-3*(weeks.length-1))/weeks.length),4),13);
  const mrow=document.createElement("div");mrow.className="mv-mrow";
  let lm=-1;weeks.forEach(w=>{const f=w.find(x=>x);const l=document.createElement("div");l.className="mv-mlbl";l.style.width=sz+"px";if(f){const m=new Date(f.date).getMonth();l.textContent=m!==lm?MONTHS[m]:"";if(m!==lm)lm=m;}mrow.appendChild(l);});
  heat.appendChild(mrow);
  const hg=document.createElement("div");hg.className="mv-hg";
  weeks.forEach(w=>{const col=document.createElement("div");col.className="mv-hc";for(let i=0;i<7;i++){const cell=document.createElement("div");cell.className="mv-hcell";cell.style.cssText=`width:${sz}px;height:${sz}px;background:${w[i]?gc(w[i].count):"transparent"};`;if(w[i]){const day=w[i];const fmt=new Date(day.date).toLocaleDateString("en-US",{weekday:"short",month:"short",day:"numeric"});cell.addEventListener("mousemove",e=>{tip.style.display="block";tip.style.left=(e.clientX+14)+"px";tip.style.top=(e.clientY-34)+"px";tip.textContent=`${day.count} contributions · ${fmt}`;});cell.addEventListener("mouseleave",()=>tip.style.display="none");}col.appendChild(cell);}hg.appendChild(col);});
  heat.appendChild(hg);
}catch(e){heat.style.color=P.textDim;heat.textContent="—";}
leftCol.appendChild(heat);

// SEARCH
const sw=document.createElement("div");sw.className="mv-search-wrap";
const sb=document.createElement("div");sb.className="mv-search-box";
const si=Object.assign(document.createElement("span"),{className:"mv-search-icon",textContent:"⌕"});
const sinp=Object.assign(document.createElement("input"),{className:"mv-search-inp",placeholder:"Поиск файлов...",type:"text"});
const sc=Object.assign(document.createElement("button"),{className:"mv-search-clear",textContent:"✕"});sc.style.display="none";
sb.appendChild(si);sb.appendChild(sinp);sb.appendChild(sc);sw.appendChild(sb);
const sr=document.createElement("div");sr.className="mv-results";sr.style.display="none";sw.appendChild(sr);
const hlText=(str,q)=>{const i=str.toLowerCase().indexOf(q.toLowerCase());if(i<0)return document.createTextNode(str);const sp=document.createElement("span");sp.appendChild(document.createTextNode(str.slice(0,i)));const b=document.createElement("b");b.textContent=str.slice(i,i+q.length);sp.appendChild(b);sp.appendChild(document.createTextNode(str.slice(i+q.length)));return sp;};
sinp.addEventListener("input",()=>{const q=sinp.value.trim();sc.style.display=q?"block":"none";if(!q){sr.style.display="none";return;}const ms=VAULT_FILES.filter(f=>f.toLowerCase().includes(q.toLowerCase())).slice(0,12);sr.innerHTML="";if(!ms.length){const n=document.createElement("div");n.className="mv-no-results";n.textContent="Файлы не найдены";sr.appendChild(n);}else ms.forEach(path=>{const name=path.split("/").pop().replace(/\.md$/,"");const item=document.createElement("div");item.className="mv-result-item";const ic=Object.assign(document.createElement("span"),{style:"font-size:9px;color:#444;flex-shrink:0;",textContent:"◈"});const lbl=document.createElement("span");lbl.appendChild(hlText(name,q));item.appendChild(ic);item.appendChild(lbl);item.addEventListener("click",()=>{app.workspace.openLinkText(path,"",false);sr.style.display="none";sinp.value="";sc.style.display="none";});sr.appendChild(item);});sr.style.display="block";});
sc.addEventListener("click",()=>{sinp.value="";sr.style.display="none";sc.style.display="none";sinp.focus();});
document.addEventListener("click",e=>{if(!sw.contains(e.target))sr.style.display="none";});
leftCol.appendChild(sw);

// WEATHER
const weatherEl=document.createElement("div");weatherEl.className="mv-weather";
weatherEl.innerHTML=`<div class="mv-w-loading">Загрузка погоды...</div>`;
leftCol.appendChild(weatherEl);

try{
  const wRes=await fetch("https://api.open-meteo.com/v1/forecast?latitude=43.2567&longitude=76.9286&daily=weathercode,temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max,windspeed_10m_max,uv_index_max,sunrise,sunset&hourly=temperature_2m,weathercode,precipitation_probability,relativehumidity_2m&timezone=Asia%2FAlmaty&forecast_days=7");
  const wd=await wRes.json();
  weatherEl.innerHTML="";

  const wHead=document.createElement("div");wHead.className="mv-w-header";
  const wCity=document.createElement("div");wCity.className="mv-w-city";
  wCity.appendChild(Object.assign(document.createElement("div"),{className:"mv-w-city-dot"}));
  wCity.appendChild(document.createTextNode("Алматы"));
  wHead.appendChild(wCity);
  wHead.appendChild(Object.assign(document.createElement("div"),{className:"mv-w-updated",textContent:`Обновлено ${new Date().toLocaleTimeString("ru-RU",{hour:"2-digit",minute:"2-digit"})}`}));
  weatherEl.appendChild(wHead);

  const wOuter=document.createElement("div");wOuter.className="mv-w-outer";
  const wDays=document.createElement("div");wDays.className="mv-w-days";

  const wDetail=document.createElement("div");wDetail.className="mv-w-detail";
  const wDetailInner=document.createElement("div");wDetailInner.className="mv-w-detail-inner";
  wDetail.appendChild(wDetailInner);

  const tmin=Math.min(...wd.daily.temperature_2m_min);
  const tmax=Math.max(...wd.daily.temperature_2m_max);
  let activeDay=null;

  const openDetail=(i)=>{
    const code=wd.daily.weathercode[i];
    const max=wd.daily.temperature_2m_max[i];
    const min=wd.daily.temperature_2m_min[i];
    const date=new Date(wd.daily.time[i]);
    const label=i===0?"Сегодня":date.toLocaleDateString("ru-RU",{weekday:"long",day:"numeric",month:"short"});
    wDetailInner.innerHTML="";

    const dtop=document.createElement("div");dtop.className="mv-w-dtop";
    const dico=Object.assign(document.createElement("div"),{className:"mv-w-dicon",textContent:WMO_ICON(code)});
    const dinfo=document.createElement("div");
    dinfo.appendChild(Object.assign(document.createElement("div"),{className:"mv-w-dtemp",textContent:`${Math.round(max)}°`}));
    dinfo.appendChild(Object.assign(document.createElement("div"),{className:"mv-w-ddesc",textContent:WMO_DESC[code]||"—"}));
    dinfo.appendChild(Object.assign(document.createElement("div"),{className:"mv-w-ddate",textContent:label}));
    dtop.appendChild(dico);dtop.appendChild(dinfo);
    wDetailInner.appendChild(dtop);

    const stats=document.createElement("div");stats.className="mv-w-stats";
    [["🌡","Мин",`${Math.round(min)}°`,null],["💧","Осадки",`${wd.daily.precipitation_sum[i]}мм`,`${wd.daily.precipitation_probability_max[i]}%`],["💨","Ветер",`${Math.round(wd.daily.windspeed_10m_max[i])}км/ч`,null],["☀","УФ",`${wd.daily.uv_index_max[i]}`,null]].forEach(([ic,lbl,val,sub])=>{
      const s=document.createElement("div");s.className="mv-w-stat";
      s.appendChild(Object.assign(document.createElement("div"),{className:"mv-w-stat-lbl",textContent:`${ic} ${lbl}`}));
      s.appendChild(Object.assign(document.createElement("div"),{className:"mv-w-stat-val",textContent:val}));
      if(sub)s.appendChild(Object.assign(document.createElement("div"),{className:"mv-w-stat-sub",textContent:sub}));
      stats.appendChild(s);
    });
    wDetailInner.appendChild(stats);

    const hourlyRow=document.createElement("div");hourlyRow.className="mv-w-hourly";
    for(let h=0;h<24;h+=3){
      const idx=i*24+h;
      const hc=document.createElement("div");hc.className="mv-w-hour";
      hc.appendChild(Object.assign(document.createElement("div"),{className:"mv-w-hour-time",textContent:`${String(h).padStart(2,"0")}:00`}));
      hc.appendChild(Object.assign(document.createElement("div"),{className:"mv-w-hour-icon",textContent:WMO_ICON(wd.hourly.weathercode[idx]||0)}));
      hc.appendChild(Object.assign(document.createElement("div"),{className:"mv-w-hour-temp",textContent:`${Math.round(wd.hourly.temperature_2m[idx]||0)}°`}));
      hourlyRow.appendChild(hc);
    }
    wDetailInner.appendChild(hourlyRow);

    wOuter.style.gridTemplateColumns="1fr 220px";
    wDetail.classList.add("open");
  };

  wd.daily.time.forEach((dateStr,i)=>{
    const code=wd.daily.weathercode[i];
    const max=wd.daily.temperature_2m_max[i];
    const min=wd.daily.temperature_2m_min[i];
    const date=new Date(dateStr);
    const dayName=i===0?"Сег":WEEK_RU[date.getDay()];
    const precip=wd.daily.precipitation_probability_max[i];

    const card=document.createElement("div");card.className="mv-w-day"+(i===0?" active":"");
    card.appendChild(Object.assign(document.createElement("div"),{className:"mv-w-day-name",textContent:dayName}));
    const ico=Object.assign(document.createElement("div"),{className:"mv-w-day-icon",textContent:WMO_ICON(code)});
    card.appendChild(ico);
    card.appendChild(Object.assign(document.createElement("div"),{className:"mv-w-day-max",textContent:`${Math.round(max)}°`}));
    card.appendChild(Object.assign(document.createElement("div"),{className:"mv-w-day-min",textContent:`${Math.round(min)}°`}));
    if(precip>20){card.appendChild(Object.assign(document.createElement("div"),{className:"mv-w-day-precip",textContent:`${precip}%`}));}
    const bar=document.createElement("div");bar.className="mv-w-day-bar";
    const fill=document.createElement("div");fill.className="mv-w-day-bar-fill";
    fill.style.width=tmax===tmin?"50%":Math.round(((max-tmin)/(tmax-tmin))*100)+"%";
    bar.appendChild(fill);card.appendChild(bar);

    card.addEventListener("click",()=>{
      if(activeDay===i){
        activeDay=null;
        wOuter.style.gridTemplateColumns="1fr 0fr";
        wDetail.classList.remove("open");
        wDays.querySelectorAll(".mv-w-day").forEach(c=>c.classList.remove("active"));
      } else {
        activeDay=i;
        wDays.querySelectorAll(".mv-w-day").forEach(c=>c.classList.remove("active"));
        card.classList.add("active");
        openDetail(i);
      }
    });
    wDays.appendChild(card);
  });

  // auto-open today
  openDetail(0);activeDay=0;

  wOuter.appendChild(wDays);wOuter.appendChild(wDetail);
  weatherEl.appendChild(wOuter);
}catch(e){weatherEl.innerHTML=`<div class="mv-w-loading">Ошибка загрузки</div>`;}

mid.appendChild(leftCol);

// RIGHT: CALENDAR + RECENT + NOTEPAD
const calEl=document.createElement("div");calEl.className="mv-cal";
const now=new Date();let calYear=now.getFullYear(),calMonth=now.getMonth(),selectedKey=null;
const calPopup=document.createElement("div");calPopup.className="mv-cal-popup";calPopup.style.display="none";document.body.appendChild(calPopup);
const closeCalPopup=()=>{calPopup.style.display="none";selectedKey=null;renderCal();};
document.addEventListener("click",e=>{if(calPopup.style.display!=="none"&&!calPopup.contains(e.target))closeCalPopup();},{capture:true});
const openCalPopup=(dk,label,rect)=>{
  selectedKey=dk;calPopup.innerHTML="";
  const hd=document.createElement("div");hd.style.cssText="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;";
  hd.appendChild(Object.assign(document.createElement("div"),{className:"mv-cal-popup-date",textContent:label}));
  const cl=Object.assign(document.createElement("button"),{className:"mv-cal-popup-close",textContent:"✕"});cl.addEventListener("click",closeCalPopup);hd.appendChild(cl);calPopup.appendChild(hd);
  const ta=document.createElement("textarea");ta.className="mv-cal-popup-ta";ta.placeholder="Заметка...";ta.value=saved.notes[dk]||"";calPopup.appendChild(ta);
  const row=document.createElement("div");row.className="mv-cal-popup-row";
  const sv=Object.assign(document.createElement("button"),{className:"mv-cal-popup-save",textContent:"Сохранить"});sv.addEventListener("click",()=>{const v=ta.value.trim();if(v)saved.notes[dk]=v;else delete saved.notes[dk];persist();closeCalPopup();});
  const dl=Object.assign(document.createElement("button"),{className:"mv-cal-popup-del",textContent:"Удалить"});dl.addEventListener("click",()=>{delete saved.notes[dk];persist();closeCalPopup();});
  row.appendChild(sv);row.appendChild(dl);calPopup.appendChild(row);
  calPopup.style.cssText=`display:block;left:${Math.min(rect.left,window.innerWidth-260)}px;top:${rect.bottom+6+window.scrollY}px;`;
  setTimeout(()=>ta.focus(),50);
};
const renderCal=()=>{
  calEl.innerHTML="";
  const head=document.createElement("div");head.className="mv-cal-head";
  head.appendChild(Object.assign(document.createElement("div"),{className:"mv-cal-title",textContent:`${MONTHS_FULL[calMonth]} ${calYear}`}));
  const nav=document.createElement("div");nav.className="mv-cal-nav";
  const prev=Object.assign(document.createElement("button"),{className:"mv-cal-navbtn",textContent:"‹"});prev.addEventListener("click",e=>{e.stopPropagation();calMonth--;if(calMonth<0){calMonth=11;calYear--;}renderCal();});
  const tb=Object.assign(document.createElement("button"),{className:"mv-cal-today",textContent:"Today"});tb.addEventListener("click",e=>{e.stopPropagation();calYear=now.getFullYear();calMonth=now.getMonth();renderCal();});
  const next=Object.assign(document.createElement("button"),{className:"mv-cal-navbtn",textContent:"›"});next.addEventListener("click",e=>{e.stopPropagation();calMonth++;if(calMonth>11){calMonth=0;calYear++;}renderCal();});
  nav.appendChild(prev);nav.appendChild(tb);nav.appendChild(next);head.appendChild(nav);calEl.appendChild(head);
  const dr=document.createElement("div");dr.className="mv-cal-days";DAYS_SHORT.forEach(d=>dr.appendChild(Object.assign(document.createElement("div"),{className:"mv-cal-daylbl",textContent:d})));calEl.appendChild(dr);
  const grid=document.createElement("div");grid.className="mv-cal-grid";
  const startDow=(new Date(calYear,calMonth,1).getDay()+6)%7;
  const dim=new Date(calYear,calMonth+1,0).getDate();
  const dip=new Date(calYear,calMonth,0).getDate();
  for(let i=startDow-1;i>=0;i--)grid.appendChild(Object.assign(document.createElement("div"),{className:"mv-cal-cell other",textContent:dip-i}));
  for(let d=1;d<=dim;d++){
    const isT=d===now.getDate()&&calMonth===now.getMonth()&&calYear===now.getFullYear();
    const dk=`${calYear}-${String(calMonth+1).padStart(2,"0")}-${String(d).padStart(2,"0")}`;
    const c=document.createElement("div");c.className="mv-cal-cell cur"+(isT?" today":"")+(saved.notes[dk]?" has-note":"")+(dk===selectedKey?" selected":"");c.textContent=d;
    c.addEventListener("click",e=>{e.stopPropagation();openCalPopup(dk,`${d} ${MONTHS_FULL[calMonth]} ${calYear}`,c.getBoundingClientRect());renderCal();});
    grid.appendChild(c);
  }
  const rem=(startDow+dim)%7;if(rem)for(let d=1;d<=7-rem;d++)grid.appendChild(Object.assign(document.createElement("div"),{className:"mv-cal-cell other",textContent:d}));
  calEl.appendChild(grid);

  const recentFiles=app.workspace.getLastOpenFiles().slice(0,5);
  if(recentFiles.length){
    calEl.appendChild(Object.assign(document.createElement("div"),{className:"mv-recent-sep"}));
    calEl.appendChild(Object.assign(document.createElement("div"),{className:"mv-recent-title",textContent:"Недавние файлы"}));
    recentFiles.forEach(path=>{
      const name=path.split("/").pop().replace(/\.md$/,"");
      const folder=path.includes("/")?path.replace(/\/[^/]+$/,""):"";
      const item=document.createElement("div");item.className="mv-recent-item";
      item.appendChild(Object.assign(document.createElement("div"),{className:"mv-recent-dot"}));
      item.appendChild(Object.assign(document.createElement("div"),{className:"mv-recent-name",textContent:name}));
      if(folder)item.appendChild(Object.assign(document.createElement("div"),{className:"mv-recent-folder",textContent:folder}));
      item.addEventListener("click",()=>app.workspace.openLinkText(path,"",false));
      calEl.appendChild(item);
    });
  }
};
renderCal();
rightCol.appendChild(calEl);

// NOTEPAD
const padEl=document.createElement("div");padEl.className="mv-pad";
const renderPad=()=>{
  padEl.innerHTML="";
  const tabRow=document.createElement("div");tabRow.className="mv-pad-tabs";
  saved.padOrder.forEach(id=>{
    const pad=saved.pads[id];const isActive=id===saved.activePad;
    const tab=Object.assign(document.createElement("div"),{className:"mv-pad-tab"+(isActive?" active":""),textContent:pad.title});
    tab.addEventListener("click",()=>{saved.activePad=id;persist();renderPad();});
    tab.addEventListener("dblclick",e=>{e.stopPropagation();const inp=document.createElement("input");inp.value=pad.title;inp.style.cssText="background:transparent;border:none;outline:none;color:#ccc;font-size:10px;width:60px;font-family:inherit;";tab.textContent="";tab.appendChild(inp);inp.focus();inp.select();const done=()=>{pad.title=inp.value.trim()||pad.title;persist();renderPad();};inp.addEventListener("blur",done);inp.addEventListener("keydown",e=>{if(e.key==="Enter")done();e.stopPropagation();});});
    tabRow.appendChild(tab);
  });
  if(saved.padOrder.length>1){const ctb=Object.assign(document.createElement("button"),{className:"mv-pad-tab-close",textContent:"×"});ctb.addEventListener("click",()=>{const idx=saved.padOrder.indexOf(saved.activePad);delete saved.pads[saved.activePad];saved.padOrder.splice(idx,1);saved.activePad=saved.padOrder[Math.max(0,idx-1)];persist();renderPad();});tabRow.appendChild(ctb);}
  const atb=Object.assign(document.createElement("button"),{className:"mv-pad-tab-add",textContent:"+"});
  atb.addEventListener("click",()=>{const id="pad_"+Date.now();saved.pads[id]={title:`Note ${saved.padOrder.length+1}`,text:""};saved.padOrder.push(id);saved.activePad=id;persist();renderPad();});
  tabRow.appendChild(atb);padEl.appendChild(tabRow);
  const ta=document.createElement("textarea");ta.className="mv-pad-ta";ta.placeholder="Начни писать...";ta.value=saved.pads[saved.activePad]?.text||"";
  const cc=Object.assign(document.createElement("div"),{className:"mv-pad-footer",textContent:`${ta.value.length} симв`});
  ta.addEventListener("input",()=>{if(saved.pads[saved.activePad])saved.pads[saved.activePad].text=ta.value;cc.textContent=`${ta.value.length} симв`;persist();});
  padEl.appendChild(ta);padEl.appendChild(cc);
};
renderPad();
rightCol.appendChild(padEl);
mid.appendChild(rightCol);
wrap.appendChild(mid);

// CARDS
const top=document.createElement("div");top.className="mv-top";
const bot=document.createElement("div");bot.className="mv-bot";
CARDS.forEach((card,ci)=>{
  const key=`mv11_${ci}`;
  if(!saved.cards[key])saved.cards[key]={tasks:[...card.tasks],checked:{}};
  const el=document.createElement("div");el.className="mv-card";
  el.appendChild(Object.assign(document.createElement("div"),{className:"mv-cleft"}));
  const body=document.createElement("div");body.className="mv-body";
  const head=document.createElement("div");head.className="mv-head";
  ["mv-h-dot","mv-h-b1","mv-h-b2","mv-h-arr"].forEach(cls=>head.appendChild(Object.assign(document.createElement("div"),{className:cls})));
  body.appendChild(head);body.appendChild(Object.assign(document.createElement("div"),{className:"mv-sep"}));
  const list=document.createElement("div");
  const render=()=>{
    list.innerHTML="";
    saved.cards[key].tasks.forEach((t,ti)=>{
      const chk=!!saved.cards[key].checked[ti];
      const item=document.createElement("div");item.className="mv-item";
      const box=Object.assign(document.createElement("div"),{className:"mv-box"+(chk?" on":""),textContent:"✓"});box.title=t;
      box.addEventListener("click",()=>{saved.cards[key].checked[ti]=!saved.cards[key].checked[ti];persist();render();});
      const bars=document.createElement("div");bars.className="mv-bars";bars.title=t;
      const w1=50+Math.abs((t.charCodeAt(0)||5)*7%55),w2=30+Math.abs((t.charCodeAt(2)||3)*5%40);
      const tb1=Object.assign(document.createElement("div"),{className:"mv-b1"+(chk?" on":"")});tb1.style.width=w1+"px";
      const tb2=Object.assign(document.createElement("div"),{className:"mv-b2"+(chk?" on":"")});tb2.style.width=w2+"px";
      bars.appendChild(tb1);bars.appendChild(tb2);
      const del=Object.assign(document.createElement("button"),{className:"mv-ico del",textContent:"×"});
      del.addEventListener("click",()=>{saved.cards[key].tasks.splice(ti,1);const nc={};Object.keys(saved.cards[key].checked).forEach(k=>{const n=parseInt(k);if(n<ti)nc[n]=saved.cards[key].checked[n];else if(n>ti)nc[n-1]=saved.cards[key].checked[n];});saved.cards[key].checked=nc;persist();render();});
      item.appendChild(box);item.appendChild(bars);item.appendChild(del);list.appendChild(item);
    });
  };
  render();body.appendChild(list);
  const addRow=document.createElement("div");addRow.className="mv-add";
  const addWrap=document.createElement("div");addWrap.className="mv-add-wrap";
  const realInp=Object.assign(document.createElement("input"),{className:"mv-add-real",placeholder:" "});
  const ph=document.createElement("div");ph.className="mv-add-ph";
  ph.appendChild(Object.assign(document.createElement("div"),{className:"mv-add-ph-b1"}));
  ph.appendChild(Object.assign(document.createElement("div"),{className:"mv-add-ph-b2"}));
  realInp.addEventListener("focus",()=>ph.style.opacity="0");
  realInp.addEventListener("blur",()=>{if(!realInp.value)ph.style.opacity="1";});
  addWrap.appendChild(realInp);addWrap.appendChild(ph);
  const addBtn=Object.assign(document.createElement("button"),{className:"mv-ico",textContent:"+"});
  const addFn=()=>{const v=realInp.value.trim();if(!v)return;saved.cards[key].tasks.push(v);persist();render();realInp.value="";ph.style.opacity="1";};
  addBtn.addEventListener("click",addFn);realInp.addEventListener("keydown",e=>{if(e.key==="Enter")addFn();});
  addRow.appendChild(addWrap);addRow.appendChild(addBtn);body.appendChild(addRow);
  el.appendChild(body);
  if(ci<3)top.appendChild(el);else bot.appendChild(el);
});
wrap.appendChild(top);wrap.appendChild(bot);
this.container.appendChild(wrap);
```
