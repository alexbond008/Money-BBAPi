// Utility + UI helpers
window.$ = (sel, root=document) => root.querySelector(sel);
window.$$ = (sel, root=document) => Array.from(root.querySelectorAll(sel));

export const fmt = (amount, ccy='EUR') => {
  try { return new Intl.NumberFormat(undefined,{style:'currency',currency:ccy}).format(amount); }
  catch { return (amount<0?'-':'') + ccy + Math.abs(amount).toFixed(2); }
};

export function filterTable(tableId, q){
  $$('#'+tableId+' tbody tr').forEach(r=>{
    r.style.display = r.innerText.toLowerCase().includes(q.toLowerCase()) ? '' : 'none';
  });
}

export function exportCsv(tableId){
  const rows = [['Date','Account','Category','Amount','Note'],
    ...$$('#'+tableId+' tbody tr').map(tr => Array.from(tr.children).map(td=>td.innerText))
  ];
  const csv = rows.map(r => r.map(v => `"${v.replaceAll('"','""')}"`).join(',')).join('\n');
  const blob = new Blob([csv], {type:'text/csv'});
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'transactions.csv';
  a.click();
}

export function genSeries(){
  let v=100; const data=[];
  for(let i=0;i<24;i++){ v += (Math.random()-.4)*4; data.push(Math.round(v)); }
  return data;
}

export function card(title, body, extra=""){
  return `<div class="card h-100">
  <div class="card-header d-flex justify-content-between align-items-center">
    <h5 class="card-title m-0">${title}</h5>${extra}
  </div>
  <div class="card-body">${body}</div>
</div>`;
}