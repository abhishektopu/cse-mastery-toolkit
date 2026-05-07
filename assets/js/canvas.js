// assets/js/canvas.js - FIXED & IMPROVED
let allStratagems = [];

async function loadStratagems() {
  try {
    const response = await fetch('assets/data/stratagems.json');
    const data = await response.json();
    allStratagems = data.stratagems;
    renderStratagems(allStratagems);
  } catch (e) {
    console.error("Could not load stratagems.json", e);
    document.getElementById('stratagemsGrid').innerHTML = `
      <p class="col-span-full text-center py-12 text-red-400">Error loading stratagems. Please refresh.</p>`;
  }
}

function renderStratagems(stratagems) {
  const grid = document.getElementById('stratagemsGrid');
  grid.innerHTML = '';

  if (stratagems.length === 0) {
    grid.innerHTML = `<p class="col-span-full text-center py-12 text-zinc-400">No stratagems found.<br>Try different search terms like "competitor", "crisis", "partner", or "negotiation".</p>`;
    return;
  }

  stratagems.forEach(stratagem => {
    const card = document.createElement('div');
    card.className = `group bg-zinc-900 border border-zinc-700 hover:border-amber-400 rounded-3xl p-6 cursor-pointer transition-all hover:-translate-y-1`;
    card.innerHTML = `
      <div class="flex justify-between items-start">
        <span class="text-amber-400 text-xs font-mono">${stratagem.id.toString().padStart(2, '0')}</span>
        <span class="px-3 py-1 text-[10px] font-medium rounded-full bg-zinc-800 text-zinc-400">${stratagem.category}</span>
      </div>
      <h3 class="font-semibold text-xl mt-4 mb-2 group-hover:text-amber-400 transition">${stratagem.name}</h3>
      <p class="text-zinc-400 text-sm italic">${stratagem.pinyin}</p>
      <p class="text-zinc-500 text-sm line-clamp-3 mt-4">${stratagem.description}</p>
    `;
    card.onclick = () => showDetail(stratagem);
    grid.appendChild(card);
  });
}

function showDetail(stratagem) {
  document.getElementById('modalName').textContent = stratagem.name;
  document.getElementById('modalPinyin').textContent = stratagem.pinyin;
  document.getElementById('modalCategory').textContent = stratagem.category;
  document.getElementById('modalDescription').textContent = stratagem.description;
  document.getElementById('modalExample').textContent = stratagem.example || "Apply this stratagem in real business situations.";
  
  const modal = document.getElementById('detailModal');
  modal.classList.remove('hidden');
  modal.classList.add('flex');
}

function closeModal() {
  const modal = document.getElementById('detailModal');
  modal.classList.add('hidden');
  modal.classList.remove('flex');
}

// Improved search — now searches EXAMPLE too + more flexible
function filterStratagems() {
  const term = document.getElementById('searchInput').value.toLowerCase().trim();
  const category = document.getElementById('categoryFilter').value;

  const filtered = allStratagems.filter(s => {
    const searchText = `${s.name} ${s.pinyin} ${s.description} ${s.example || ''} ${s.tags ? s.tags.join(' ') : ''}`.toLowerCase();
    
    const matchesSearch = !term || searchText.includes(term);
    const matchesCategory = !category || s.category === category;
    
    return matchesSearch && matchesCategory;
  });

  renderStratagems(filtered);
}

function addEventListeners() {
  const searchInput = document.getElementById('searchInput');
  const categoryFilter = document.getElementById('categoryFilter');

  searchInput.addEventListener('input', filterStratagems);
  categoryFilter.addEventListener('change', filterStratagems);
}

function resetFilters() {
  document.getElementById('searchInput').value = '';
  document.getElementById('categoryFilter').value = '';
  renderStratagems(allStratagems);
}

// Initialize
window.onload = () => {
  loadStratagems();
  addEventListeners();
  console.log('%c🎨 36 Stratagems Canvas — FIXED & READY!', 'color:#fbbf24; font-weight:bold');
};
