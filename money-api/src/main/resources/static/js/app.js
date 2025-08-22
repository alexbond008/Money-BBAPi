// Simple router bootstrap (updated to match slimmed views.js)
import { resolve, onViewRendered } from './views.js';

function router(){
  const path = window.location.hash.replace('#','') || '/transactions';
  const viewFn = resolve(path);
  const root = document.getElementById('appRoot');
  if(root) root.innerHTML = viewFn ? viewFn() : '';
  onViewRendered(path);
}

window.addEventListener('hashchange', router);
window.addEventListener('load', router);

// Offcanvas form submit (placeholder)
document.addEventListener('submit', (e)=>{
  if(e.target.id === 'txForm'){
    e.preventDefault();
    const payload = Object.fromEntries(new FormData(e.target).entries());
    console.log('POST /transactions (stub)', payload);
    const ok = document.getElementById('txSuccess');
    ok?.classList.remove('d-none');
    setTimeout(()=> ok?.classList.add('d-none'), 2500);
  }
});