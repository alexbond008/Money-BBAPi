import { api } from './api.js';
import { card, fmt, genSeries, exportCsv, filterTable } from './util.js';

const routes = {};
export const register = (path, render) => routes[path] = render;
export function resolve(path){ return routes[path] || routes['/404']; }

register('/', () => `
  <div class="row g-4">
    <div class="col-sm-6 col-xl-3">${card('Total Balance', `<h3 class="mb-1">€ 17,363.89</h3><small class="text-muted">Across 2 accounts</small>`, '<span class="badge bg-label-success">+2.1% MoM</span>')}</div>
    <div class="col-sm-6 col-xl-3">${card('Invested', `<h3 class="mb-1">$ 12,543.77</h3><small class="text-muted">Brokerage</small>`)}</div>
    <div class="col-sm-6 col-xl-3">${card('Cash', `<h3 class="mb-1">€ 4,820.12</h3><small class="text-muted">Bank</small>`)}</div>
    <div class="col-sm-6 col-xl-3">${card('PnL (30d)', `<h3 class="mb-1">+€ 382.10</h3><small class="text-success">+2.24%</small>`)}</div>
  </div>
  <div class="row g-4 mt-1">
    <div class="col-xl-8">
      ${card('Performance', `<div id="chartPerf"></div>`, '<button class="btn btn-sm btn-outline-secondary" data-action="refresh-perf"><i class="bx bx-refresh"></i></button>')}
    </div>
    <div class="col-xl-4">
      ${card('Recent Transactions', `<div id="recentTx"></div>`, '<a class="btn btn-sm btn-primary" href="#/transactions">View all</a>')}
    </div>
  </div>
`);

register('/transactions', () => `
  <div class="d-flex justify-content-between align-items-center mb-3">
    <h4 class="mb-0">Transactions</h4>
    <div class="d-flex gap-2">
      <input id="txSearch" class="form-control form-control-sm" placeholder="Filter…" style="max-width:240px">
      <button class="btn btn-sm btn-outline-secondary" data-action="export-transactions"><i class='bx bx-download me-1'></i>Export</button>
      <button class="btn btn-primary" data-bs-toggle="offcanvas" data-bs-target="#offcanvasTx"><i class='bx bx-plus me-1'></i>Add</button>
    </div>
  </div>
  <div class="card">
    <div class="table-responsive">
      <table class="table table-striped" id="txTable">
        <thead class="table-light"><tr><th>Date</th><th>Account</th><th>Category</th><th class="text-end">Amount</th><th>Note</th></tr></thead>
        <tbody></tbody>
      </table>
    </div>
  </div>
`);

register('/portfolios', () => `
  <div class="d-flex justify-content-between align-items-center mb-3">
    <h4 class="mb-0">Portfolios</h4>
    <button class="btn btn-sm btn-outline-secondary" data-action="refresh-perf"><i class='bx bx-line-chart'></i></button>
  </div>
  <div class="row g-4" id="portRows"></div>
`);

register('/holdings', () => `
  <div class="d-flex justify-content-between align-items-center mb-3">
    <h4 class="mb-0">Holdings</h4>
    <div><button class="btn btn-sm btn-outline-secondary" disabled>Import</button></div>
  </div>
  <div class="card p-4 text-muted">Hook up to /api/portfolio endpoint</div>
`);

register('/orders', () => `<div class="card p-4">Order ticket UI stub — integrate with /api/orders later.</div>`);
register('/reports', () => `<div class="card p-4">Reports hub stub.</div>`);
register('/settings', () => `<div class="card p-4">Settings stub.</div>`);
register('/404', () => `<div class="text-center py-5"><h1 class="display-6">404</h1><p class="text-muted">Page not found</p></div>`);

// Lifecycle handlers
export async function onViewRendered(path){
  if(path === '/'){ renderPerf(); renderRecentTx(); }
  if(path === '/transactions'){ renderTxTable(); }
  if(path === '/portfolios'){ renderPortfolios(); }
}

async function renderTxTable(){
  const rows = await api.listTransactions();
  const tbody = $('#txTable tbody');
  tbody.innerHTML = rows.map(t => `
    <tr>
      <td>${t.date}</td>
      <td>${t.account}</td>
      <td>${t.category}</td>
      <td class="text-end ${t.amount<0? 'text-danger':'text-success'}">${fmt(t.amount)}</td>
      <td>${t.note||''}</td>
    </tr>`).join('');
  $('#txSearch').addEventListener('input', e => filterTable('txTable', e.target.value));
  document.querySelector('[data-action="export-transactions"]')
    ?.addEventListener('click', ()=> exportCsv('txTable'));
}

async function renderPortfolios(){
  const data = await api.listPortfolios();
  const el = $('#portRows');
  el.innerHTML = data.map(p => `
    <div class="col-md-6">
      <div class="card h-100">
        <div class="card-header d-flex justify-content-between align-items-center">
          <h5 class="m-0">${p.name}</h5>
          <span class="badge ${p.pnl>=0? 'bg-label-success':'bg-label-danger'}">${p.pnl}%</span>
        </div>
        <div class="card-body">
          <div class="fs-4 fw-bold mb-2">${fmt(p.value)}</div>
          <div id="chart-${p.id}" style="min-height:160px"></div>
        </div>
      </div>
    </div>`).join('');
  data.forEach(p => {
    new ApexCharts(document.querySelector(`#chart-${p.id}`), {
      chart:{ type:'area', height:160, sparkline:{enabled:true}},
      series:[{ data: genSeries() }],
      stroke:{ curve:'smooth', width:2 },
      tooltip:{ enabled:false },
      fill:{ opacity:.25 }
    }).render();
  });
}

function renderPerf(){
  const s = [10,12,11,13,12,15,16,15,18,19,21,22].map((v,i)=>({x:i,y:v}));
  new ApexCharts(document.querySelector('#chartPerf'), {
    chart:{ type:'line', height:300, toolbar:{ show:false }},
    series:[{ name:'NAV', data:s }],
    xaxis:{ labels:{ show:false }},
    yaxis:{ labels:{ formatter:v=>'€'+v }},
    stroke:{ curve:'smooth', width:3 },
    grid:{ borderColor:'rgba(0,0,0,.06)' }
  }).render();
  document.querySelectorAll('[data-action="refresh-perf"]').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      $('#chartPerf').innerHTML='';
      renderPerf();
    });
  });
}

async function renderRecentTx(){
  const rows = (await api.listTransactions()).slice(0,6);
  const wrap = $('#recentTx');
  if(!wrap) return;
  wrap.innerHTML = rows.map(t => `
    <div class="d-flex justify-content-between border-bottom py-2">
      <div><span class="fw-medium">${t.date}</span> — ${t.account}</div>
      <div class="text-end ${t.amount<0? 'text-danger':'text-success'}">${fmt(t.amount)}</div>
    </div>`).join('');
}