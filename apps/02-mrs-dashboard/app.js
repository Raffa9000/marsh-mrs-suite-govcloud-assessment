let rfpRecords = [];
let weights = { C: 0.4, R: 0.25, B: 0.25, O: 0.1, L: 0.1 };
let thresholds = { migrateNow: 4.5, migrateSoon: 3.5, migrateLater: 2.5 };
let charts = { donut: null, scatter: null, bar: null };
let uploadedData = null;

const COLOR = { BLUE:"#005EB8", TEAL:"#00A3A1", NAVY:"#003B70", PURP:"#7A52CC", AMBR:"#F5A300", RED:"#C0152F" };

const MAPPINGS = {
  compliance: { "FedRAMP Required":5,"CMS ARS Required":5,"NIST 800-53 Required":4,"StateRAMP":4,"IL4/IL5":3,"Compliance preferred":3,"Best practices expected":2,"None specified":1 },
  readiness:  { "Complete":5,"In Progress (>75%)":4,"In Progress (50-75%)":3,"In Progress (<50%)":2,"None":1,"Expired":1 }
};

const clamp=(n,min,max)=>Math.max(min,Math.min(max,n));
const nowISO=()=>new Date().toISOString().replace("T"," ").slice(0,19);
const computeMRS=(c,r,b,o,l)=>Math.round((weights.C*c+weights.R*r+weights.B*b+weights.O*o+weights.L*l)*100)/100;
function classify(m){ if(m>=thresholds.migrateNow) return "Migrate Now"; if(m>=thresholds.migrateSoon) return "Migrate Soon"; if(m>=thresholds.migrateLater) return "Migrate Later"; return "Hold"; }

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".tab").forEach(btn=>{
    btn.addEventListener("click",()=>{
      document.querySelectorAll(".tab").forEach(b=>b.classList.remove("active"));
      btn.classList.add("active");
      document.querySelectorAll(".tabpane").forEach(p=>p.classList.remove("active"));
      const id = btn.dataset.tab==="single" ? "tab-single" : btn.dataset.tab==="batch" ? "tab-batch" : "tab-settings";
      document.getElementById(id).classList.add("active");
    });
  });

  document.getElementById("rfpForm").addEventListener("submit",(e)=>{
    e.preventDefault();
    const name=document.getElementById("oppName").value.trim()||"Untitled";
    const agency=document.getElementById("agency").value.trim()||"";
    const c=MAPPINGS.compliance[document.getElementById("complianceReq").value]||1;
    const r=MAPPINGS.readiness[document.getElementById("readiness").value]||1;
    const b=clamp(+document.getElementById("bizValue").value||3,1,5);
    const o=clamp(+document.getElementById("opsFriction").value||3,1,5);
    const l=clamp(+document.getElementById("legalFlex").value||3,1,5);
    const mrs=computeMRS(c,r,b,o,l), cls=classify(mrs);
    rfpRecords.push({ name, agency, c, r, b, o, l, mrs, cls, ts: nowISO() });
    e.target.reset(); updateDashboard();
  });

  document.getElementById("applySettingsBtn").addEventListener("click",()=>{
    weights={ C:parseFloat(document.getElementById("wC").value)||weights.C,
              R:parseFloat(document.getElementById("wR").value)||weights.R,
              B:parseFloat(document.getElementById("wB").value)||weights.B,
              O:parseFloat(document.getElementById("wO").value)||weights.O,
              L:parseFloat(document.getElementById("wL").value)||weights.L };
    thresholds={ migrateNow:parseFloat(document.getElementById("tNow").value)||thresholds.migrateNow,
                 migrateSoon:parseFloat(document.getElementById("tSoon").value)||thresholds.migrateSoon,
                 migrateLater:parseFloat(document.getElementById("tLater").value)||thresholds.migrateLater };
    updateDashboard();
  });

  document.getElementById("previewBtn").addEventListener("click", previewUpload);
  document.getElementById("confirmUploadBtn").addEventListener("click", confirmUpload);

  document.getElementById("helpBtn").addEventListener("click",()=>alert("Add RFPs or import CSV. Adjust weights/thresholds to tune the MRS."));
  document.getElementById("runTestsBtn").addEventListener("click", seedDemoData);

  updateDashboard();
});

function previewUpload(){
  const file=document.getElementById("fileUpload").files?.[0];
  if(!file){ alert("Choose a CSV first."); return; }
  const reader=new FileReader();
  reader.onload=e=>{
    const rows=e.target.result.split(/\r?\n/).filter(Boolean).map(l=>l.split(","));
    const headers=rows[0];
    const data=rows.slice(1).filter(r=>r.length===headers.length).map(cols=>Object.fromEntries(headers.map((h,i)=>[h.trim(),(cols[i]??'').trim()])));
    uploadedData=data;

    const table=document.getElementById("previewTable");
    table.innerHTML="";
    const thead=document.createElement("thead"); const trh=document.createElement("tr");
    headers.forEach(h=>{const th=document.createElement("th"); th.textContent=h; trh.appendChild(th);}); thead.appendChild(trh); table.appendChild(thead);
    const tbody=document.createElement("tbody");
    uploadedData.slice(0,10).forEach(row=>{ const tr=document.createElement("tr"); headers.forEach(h=>{const td=document.createElement("td"); td.textContent=row[h]||''; tr.appendChild(td);}); tbody.appendChild(tr);});
    table.appendChild(tbody);
    document.getElementById("uploadPreview").style.display="block";
  };
  reader.readAsText(file);
}

function confirmUpload(){
  if(!uploadedData?.length){ alert("No data to import"); return; }
  const n=uploadedData.length;
  uploadedData.forEach(row=>{
    const name=(row.name||row.Name||row.Opportunity||"Untitled").trim();
    const agency=(row.agency||row.Agency||"").trim();
    const c=MAPPINGS.compliance[row.compliance||row.Compliance||"None specified"]||1;
    const r=MAPPINGS.readiness[row.readiness||row.Readiness||"None"]||1;
    const b=clamp(parseFloat(row.b||row.Business||3),1,5);
    const o=clamp(parseFloat(row.o||row.Operational||3),1,5);
    const l=clamp(parseFloat(row.l||row.Legal||3),1,5);
    const mrs=computeMRS(c,r,b,o,l), cls=classify(mrs);
    rfpRecords.push({ name, agency, c, r, b, o, l, mrs, cls, ts: nowISO() });
  });
  uploadedData=null; document.getElementById("uploadPreview").style.display="none";
  document.getElementById("fileUpload").value="";
  updateDashboard(); alert(`Imported ${n} records`);
}

function seedDemoData(){
  const seed=[{name:"CMS Module A",agency:"CMS",c:5,r:4,b:5,o:3,l:4},
              {name:"StateRAMP Bid",agency:"AZ",c:4,r:3,b:4,o:2,l:3},
              {name:"Medicaid Portal",agency:"PA",c:4,r:5,b:5,o:3,l:3},
              {name:"Eligibility Modernization",agency:"NV",c:3,r:3,b:4,o:3,l:4}];
  rfpRecords=seed.map(s=>{const m=computeMRS(s.c,s.r,s.b,s.o,s.l);return {...s,mrs:m,cls:classify(m),ts:nowISO()};});
  updateDashboard();
}

function updateDashboard(){
  const total=rfpRecords.length;
  document.getElementById("kpiTotal").textContent=total;
  document.getElementById("kpiUpdated").textContent=total?`Updated ${nowISO()}`:"";
  const avg=total?(rfpRecords.reduce((t,r)=>t+r.mrs,0)/total):0;
  document.getElementById("kpiAvgMRS").textContent=(Math.round(avg*10)/10).toFixed(1);
  document.getElementById("kpiNow").textContent=rfpRecords.filter(r=>r.cls==="Migrate Now").length;

  const cls={"Migrate Now":0,"Migrate Soon":0,"Migrate Later":0,"Hold":0};
  rfpRecords.forEach(r=>cls[r.cls]++);
  renderTable(); renderDonut(cls); renderScatter(); renderBar();
}

function renderTable(){
  const table=document.getElementById("rfpTable"); table.innerHTML="";
  const headers=["Name","Agency","C","R","B","O","L","MRS","Class","Timestamp"];
  const thead=document.createElement("thead"); const trh=document.createElement("tr");
  headers.forEach(h=>{const th=document.createElement("th"); th.textContent=h; trh.appendChild(th)}); thead.appendChild(trh); table.appendChild(thead);
  const tbody=document.createElement("tbody");
  rfpRecords.forEach(r=>{ const tr=document.createElement("tr"); [r.name,r.agency,r.c,r.r,r.b,r.o,r.l,r.mrs,r.cls,r.ts].forEach(v=>{const td=document.createElement("td"); td.textContent=v; tr.appendChild(td)}); tbody.appendChild(tr);});
  table.appendChild(tbody);
}

function renderDonut(counts){
  const ctx=document.getElementById("donutChart").getContext("2d");
  if(charts.donut) charts.donut.destroy();
  charts.donut=new Chart(ctx,{ type:"doughnut",
    data:{ labels:Object.keys(counts), datasets:[{ data:Object.values(counts), backgroundColor:[COLOR.BLUE,COLOR.TEAL,COLOR.PURP,COLOR.RED] }] },
    options:{ plugins:{legend:{position:"bottom"}}, cutout:"62%"}});
}

function renderScatter(){
  const ctx=document.getElementById("scatterChart").getContext("2d");
  if(charts.scatter) charts.scatter.destroy();
  const ds=[{label:"Migrate Now",color:COLOR.BLUE,data:[]},{label:"Migrate Soon",color:COLOR.TEAL,data:[]},{label:"Migrate Later",color:COLOR.PURP,data:[]},{label:"Hold",color:COLOR.RED,data:[]}];
  rfpRecords.forEach(r=>{const p={x:r.b,y:r.mrs};const i=r.cls==="Migrate Now"?0:r.cls==="Migrate Soon"?1:r.cls==="Migrate Later"?2:3;ds[i].data.push(p)});
  charts.scatter=new Chart(ctx,{type:"scatter",data:{datasets:ds.map(s=>({label:s.label,data:s.data,backgroundColor:s.color,borderColor:s.color}))},
    options:{scales:{x:{title:{display:true,text:"Business Value (B)"},min:1,max:5,ticks:{stepSize:1}},y:{title:{display:true,text:"MRS (weighted)"},min:0,max:5,ticks:{stepSize:.5}}},plugins:{legend:{position:"bottom"}}});
}

function renderBar(){
  const ctx=document.getElementById("barChart").getContext("2d");
  if(charts.bar) charts.bar.destroy();
  const n=rfpRecords.length||1; const avg=k=>rfpRecords.reduce((t,r)=>t+r[k],0)/n;
  charts.bar=new Chart(ctx,{type:"bar",
    data:{labels:["C","R","B","O","L"],datasets:[{label:"Average",data:[avg("c"),avg("r"),avg("b"),avg("o"),avg("l")],backgroundColor:[COLOR.BLUE,COLOR.TEAL,COLOR.PURP,COLOR.AMBR,COLOR.NAVY]}]},
    options:{plugins:{legend:{display:false}},scales:{y:{min:0,max:5,ticks:{stepSize:1}}}});
}
