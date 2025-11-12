let rfpRecords = [];
let weights = { C: 0.4, R: 0.25, B: 0.25, O: 0.1, L: 0.1 };
let thresholds = { migrateNow: 4.5, migrateSoon: 3.5, migrateLater: 2.5 };
let charts = { donut: null, scatter: null, bar: null };
let uploadedData = null;

const MAPPINGS = {
  compliance: {
    "FedRAMP Required": 5,
    "CMS ARS Required": 5,
    "NIST 800-53 Required": 4,
    "StateRAMP": 4,
    "IL4/IL5": 3,
    "Compliance preferred": 3,
    "Best practices expected": 2,
    "None specified": 1
  },
  readiness: {
    "Complete": 5,
    "In Progress (>75%)": 4,
    "In Progress (50-75%)": 3,
    "In Progress (<50%)": 2,
    "None": 1,
    "Expired": 1
  }
};

function clamp(n, min, max) { return Math.max(min, Math.min(max, n)); }
function nowISO() { return new Date().toISOString().replace("T"," ").slice(0,19); }

function computeMRS(c, r, b, o, l) {
  const score = weights.C*c + weights.R*r + weights.B*b + weights.O*o + weights.L*l;
  return Math.round(score*100)/100;
}

function classify(mrs) {
  if (mrs >= thresholds.migrateNow) return "Migrate Now";
  if (mrs >= thresholds.migrateSoon) return "Migrate Soon";
  if (mrs >= thresholds.migrateLater) return "Migrate Later";
  return "Hold";
}

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".tab-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      const target = btn.dataset.tab;
      document.querySelectorAll(".tab-content").forEach(c => c.classList.remove("active"));
      document.getElementById(target).classList.add("active");
    });
  });

  document.getElementById("rfpForm").addEventListener("submit", e => {
    e.preventDefault();
    const name = document.getElementById("oppName").value.trim() || "Untitled";
    const agency = document.getElementById("agency").value.trim() || "";

    const c = MAPPINGS.compliance[document.getElementById("complianceReq").value] || 1;
    const r = MAPPINGS.readiness[document.getElementById("readiness").value] || 1;
    const b = clamp(parseFloat(document.getElementById("bizValue").value) || 3, 1, 5);
    const o = clamp(parseFloat(document.getElementById("opsFriction").value) || 3, 1, 5);
    const l = clamp(parseFloat(document.getElementById("legalFlex").value) || 3, 1, 5);

    const mrs = computeMRS(c, r, b, o, l);
    const cls = classify(mrs);

    rfpRecords.push({ name, agency, c, r, b, o, l, mrs, cls, ts: nowISO() });
    updateDashboard();
    e.target.reset();
  });

  document.getElementById("previewBtn").addEventListener("click", previewUpload);
  document.getElementById("confirmUploadBtn").addEventListener("click", confirmUpload);

  document.getElementById("applySettingsBtn").addEventListener("click", () => {
    weights = {
      C: parseFloat(document.getElementById("wC").value) || weights.C,
      R: parseFloat(document.getElementById("wR").value) || weights.R,
      B: parseFloat(document.getElementById("wB").value) || weights.B,
      O: parseFloat(document.getElementById("wO").value) || weights.O,
      L: parseFloat(document.getElementById("wL").value) || weights.L
    };
    thresholds = {
      migrateNow: parseFloat(document.getElementById("tNow").value) || thresholds.migrateNow,
      migrateSoon: parseFloat(document.getElementById("tSoon").value) || thresholds.migrateSoon,
      migrateLater: parseFloat(document.getElementById("tLater").value) || thresholds.migrateLater
    };
    updateDashboard();
  });

  document.getElementById("helpBtn").addEventListener("click", () => {
    alert("MRS Help: Add records manually or upload CSV. Adjust weights/thresholds in Settings.");
  });
  document.getElementById("runTestsBtn").addEventListener("click", seedDemoData);

  updateDashboard();
});

function previewUpload() {
  const input = document.getElementById("fileUpload");
  const file = input.files && input.files[0];
  if (!file) { alert("Select a CSV first"); return; }
  const reader = new FileReader();
  reader.onload = e => {
    const text = e.target.result;
    const lines = text.split(/\r?\n/).filter(Boolean);
    const rows = lines.map(l => l.split(","));
    const headers = rows[0];
    const dataRows = rows.slice(1).filter(r => r.length === headers.length);

    uploadedData = dataRows.map(cols => Object.fromEntries(headers.map((h, i) => [h.trim(), (cols[i] ?? '').trim()])));

    const table = document.getElementById("previewTable");
    table.innerHTML = "";
    const thead = document.createElement("thead");
    const trh = document.createElement("tr");
    headers.forEach(h => { const th = document.createElement("th"); th.textContent = h; trh.appendChild(th); });
    thead.appendChild(trh); table.appendChild(thead);
    const tbody = document.createElement("tbody");
    uploadedData.slice(0, 10).forEach(row => {
      const tr = document.createElement("tr");
      headers.forEach(h => { const td = document.createElement("td"); td.textContent = row[h] || ""; tr.appendChild(td); });
      tbody.appendChild(tr);
    });
    table.appendChild(tbody);
    document.getElementById("uploadPreview").style.display = "block";
  };
  reader.readAsText(file);
}

function confirmUpload() {
  if (!uploadedData || uploadedData.length === 0) { alert("No data to import"); return; }
  const importCount = uploadedData.length;

  uploadedData.forEach(row => {
    const name = (row.name || row.Name || row.Opportunity || "Untitled").trim();
    const agency = (row.agency || row.Agency || "").trim();

    const cRaw = row.compliance || row.Compliance || "None specified";
    const rRaw = row.readiness || row.Readiness || "None";
    const c = MAPPINGS.compliance[cRaw] || 1;
    const r = MAPPINGS.readiness[rRaw] || 1;
    const b = clamp(parseFloat(row.b || row.Business || 3), 1, 5);
    const o = clamp(parseFloat(row.o || row.Operational || 3), 1, 5);
    const l = clamp(parseFloat(row.l || row.Legal || 3), 1, 5);

    const mrs = computeMRS(c, r, b, o, l);
    const cls = classify(mrs);
    rfpRecords.push({ name, agency, c, r, b, o, l, mrs, cls, ts: nowISO() });
  });

  updateDashboard();
  uploadedData = null;
  document.getElementById("uploadPreview").style.display = "none";
  document.getElementById("fileUpload").value = "";
  alert(`Successfully imported ${importCount} records`);
}

function seedDemoData() {
  const seed = [
    { name: "CMS Module A", agency: "CMS", c:5, r:4, b:5, o:3, l:4 },
    { name: "StateRAMP Bid", agency: "AZ", c:4, r:3, b:4, o:2, l:3 },
    { name: "Medicaid Portal", agency: "PA", c:4, r:5, b:5, o:3, l:3 },
    { name: "Eligibility Modernization", agency: "NV", c:3, r:3, b:4, o:3, l:4 }
  ];
  rfpRecords = seed.map(x => {
    const s = computeMRS(x.c,x.r,x.b,x.o,x.l);
    return { ...x, mrs: s, cls: classify(s), ts: nowISO() };
  });
  updateDashboard();
}

function updateDashboard() {
  document.getElementById("kpiTotal").textContent = rfpRecords.length;
  document.getElementById("kpiUpdated").textContent = rfpRecords.length ? `Updated ${nowISO()}` : "";

  const avg = rfpRecords.length ? (rfpRecords.reduce((s,r)=>s+r.mrs,0)/rfpRecords.length) : 0;
  document.getElementById("kpiAvgMRS").textContent = (Math.round(avg*10)/10).toFixed(1);

  const clsCounts = { "Migrate Now":0,"Migrate Soon":0,"Migrate Later":0,"Hold":0 };
  rfpRecords.forEach(r => clsCounts[r.cls]++);

  renderTable();
  renderDonut(clsCounts);
  renderScatter();
  renderBar();
}

function renderTable() {
  const table = document.getElementById("rfpTable");
  table.innerHTML = "";
  const headers = ["Name","Agency","C","R","B","O","L","MRS","Class","Timestamp"];
  const thead = document.createElement("thead");
  const trh = document.createElement("tr");
  headers.forEach(h => { const th = document.createElement("th"); th.textContent = h; trh.appendChild(th); });
  thead.appendChild(trh); table.appendChild(thead);

  const tbody = document.createElement("tbody");
  rfpRecords.forEach(r => {
    const tr = document.createElement("tr");
    [r.name,r.agency,r.c,r.r,r.b,r.o,r.l,r.mrs,r.cls,r.ts].forEach(val => {
      const td = document.createElement("td"); td.textContent = val; tr.appendChild(td);
    });
    tbody.appendChild(tr);
  });
  table.appendChild(tbody);
}

/* ===== Charts (MGF colors) ===== */
const C_BLUE = "#005EB8";
const C_TEAL = "#00A3A1";
const C_PURP = "#7A52CC";
const C_NAVY = "#003B70";
const C_AMBR = "#F5A300";
const C_RED  = "#C0152F";

function renderDonut(classifications) {
  const ctx = document.getElementById("donutChart").getContext("2d");
  if (charts.donut) charts.donut.destroy();
  charts.donut = new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: ["Migrate Now","Migrate Soon","Migrate Later","Hold"],
      datasets: [{
        data: [
          classifications["Migrate Now"],
          classifications["Migrate Soon"],
          classifications["Migrate Later"],
          classifications["Hold"]
        ],
        backgroundColor: [C_BLUE, C_TEAL, C_PURP, C_RED]
      }]
    },
    options: {
      plugins: { legend: { position: "bottom" } },
      cutout: "60%"
    }
  });
}

function renderScatter() {
  const ctx = document.getElementById("scatterChart").getContext("2d");
  if (charts.scatter) charts.scatter.destroy();

  const datasets = [
    { label: "Migrate Now",   data: [], backgroundColor: C_BLUE, borderColor: C_BLUE, pointStyle: "circle" },
    { label: "Migrate Soon",  data: [], backgroundColor: C_TEAL, borderColor: C_TEAL, pointStyle: "circle" },
    { label: "Migrate Later", data: [], backgroundColor: C_PURP, borderColor: C_PURP, pointStyle: "circle" },
    { label: "Hold",          data: [], backgroundColor: C_RED,  borderColor: C_RED,  pointStyle: "circle" },
    { label: "Conditional Award", data: [], backgroundColor: C_TEAL, borderColor: C_TEAL, pointStyle: "star" }
  ];

  rfpRecords.forEach(r => {
    const point = { x: r.b, y: r.mrs };
    const idx = r.cls === "Migrate Now" ? 0 : r.cls === "Migrate Soon" ? 1 : r.cls === "Migrate Later" ? 2 : 3;
    datasets[idx].data.push(point);
  });

  charts.scatter = new Chart(ctx, {
    type: "scatter",
    data: { datasets },
    options: {
      scales: {
        x: { title: { display: true, text: "Business Value (B)"} , min:1, max:5, ticks:{ stepSize:1 }},
        y: { title: { display: true, text: "MRS (weighted)" }, min:0, max:5, ticks:{ stepSize:0.5 } }
      },
      plugins: { legend: { position: "bottom" } }
    }
  });
}

function renderBar() {
  const ctx = document.getElementById("barChart").getContext("2d");
  if (charts.bar) charts.bar.destroy();

  const count = rfpRecords.length || 1;
  const sumC = rfpRecords.reduce((s,r)=>s+r.c,0);
  const sumR = rfpRecords.reduce((s,r)=>s+r.r,0);
  const sumB = rfpRecords.reduce((s,r)=>s+r.b,0);
  const sumO = rfpRecords.reduce((s,r)=>s+r.o,0);
  const sumL = rfpRecords.reduce((s,r)=>s+r.l,0);

  charts.bar = new Chart(ctx, {
    type: "bar",
    data: {
      labels: ["Compliance (C)","Readiness (R)","Business Value (B)","Operational Friction (O)","Legal Flexibility (L)"],
      datasets: [{
        label: "Average Score",
        data: [sumC/count, sumR/count, sumB/count, sumO/count, sumL/count],
        backgroundColor: [C_BLUE, C_TEAL, C_PURP, C_AMBR, C_NAVY]
      }]
    },
    options: {
      plugins: { legend: { display: false } },
      scales: { y: { min:0, max:5, ticks:{ stepSize:1 } } }
    }
  });
}
