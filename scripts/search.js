// 简单防抖
function debounce(fn, wait=200){
  let t;
  return (...args)=>{ clearTimeout(t); t = setTimeout(()=>fn(...args), wait); };
}

const resultsEl = document.getElementById('results');
const input = document.getElementById('q');
let items = [];

function renderList(list){
  if(!list.length){
    resultsEl.innerHTML = '<div>未找到匹配结果。</div>';
    return;
  }
  resultsEl.innerHTML = list.map(it=>`
    <div class="card">
      <img src="${it.image}" alt="${escapeHtml(it.title)}" />
      <div class="meta">
        <h3>${escapeHtml(it.title)} — ¥${numberWithCommas(it.price)}</h3>
        <p>${escapeHtml(it.address)} · ${it.bedrooms} 卧 · ${it.bathrooms} 卫</p>
        <p>${escapeHtml(it.description)}</p>
      </div>
    </div>
  `).join('');
}

function numberWithCommas(x){ return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
function escapeHtml(s){ return String(s).replace(/[&<>"']/g, c=>({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' })[c]); }

function doSearch(q){
  q = q.trim().toLowerCase();
  if(!q){
    renderList(items); // show all
    return;
  }
  const tokens = q.split(/\s+/);
  const filtered = items.filter(it=>{
    const hay = (it.title + ' ' + it.address + ' ' + it.description + ' ' + (it.bedrooms||'')).toLowerCase();
    return tokens.every(t => hay.includes(t));
  });
  renderList(filtered);
}

fetch('data/properties.json')
  .then(r=>r.json())
  .then(data=>{
    items = data || [];
    renderList(items);
  })
  .catch(err=>{
    resultsEl.innerHTML = '<div>加载数据失败，请检查 data/properties.json 是否存在。</div>';
    console.error(err);
  });

input.addEventListener('input', debounce(e=>doSearch(e.target.value), 200));