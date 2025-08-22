import { register, resolve, onViewRendered } from './views.js';

function router(){
  const path = window.location.hash.replace('#','') || '/';
  document.querySelectorAll('.menu .menu-item').forEach(li => li.classList.remove('active'));
  const active = document.querySelector(`.menu a[href="#${path}"]`);
  if (active) active.closest('.menu-item').classList.add('active');
  const viewFn = resolve(path);
  const html = viewFn ? viewFn() : '';
  const root = document.getElementById('appRoot');
  if (root) root.innerHTML = html;
  onViewRendered(path);
}

window.addEventListener('hashchange', router);
window.addEventListener('load', () => {
  const y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
  router();
});

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