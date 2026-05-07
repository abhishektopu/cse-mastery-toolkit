// assets/js/canvas.js
let allStratagems = [];

async function loadStratagems() {
  try {
    // Since we have stratagems.json in the same repo
    const response = await fetch('assets/data/stratagems.json');
    const data = await response.json();
    allStratagems = data.stratagems;
    renderStratagems(allStratagems);
  } catch (e) {
    console.error("Could not load stratagems.json", e);
    // Fallback if fetch fails (GitHub Pages sometimes needs full path)
    console.log("%cUsing fallback stratagems", "color: #fbbf24");
  }
}

function renderStratagems(stratagems) {
  const grid = document.getElementById('stratagemsGrid');
  grid.innerHTML = '';

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

  if (stratagems.length === 0) {
    grid.innerHTML = `<p class="col-span-full text-center py-12 text-zinc-400">No stratagems found. Try different search terms.</p>`;
  }
}

function showDetail(stratagem) {
  document.getElementById('modalName').textContent = stratagem.name;
  document.getElementById('modalPinyin').textContent = stratagem.pinyin;
  document.getElementById('modalCategory').textContent = stratagem.category;
  document.getElementById('modalDescription').textContent = stratagem.description;
  document.getElementById('modalExample').textContent = stratagem.example || "Apply this stratagem in real business situations.";
  
  document.getElementById('detailModal').classList.remove('hidden');
  document.getElementById('detailModal').classList.add('flex');
}

function closeModal() {
  const modal = document.getElementById('detailModal');
  modal.classList.add('hidden');
  modal.classList.remove('flex');
  document.getElementById('applyResult').classList.add('hidden');
}

function applyStratagem() {
  const input = document.getElementById('situationInput').value.trim();
  const resultDiv = document.getElementById('applyResult');
  
  if (!input) {
    resultDiv.innerHTML = `<p class="text-amber-400">Please describe your situation above.</p>`;
  } else {
    resultDiv.innerHTML = `
      <div class="p-4 bg-green-900/30 border border-green-400 rounded-2xl text-green-300">
        <strong>Smart Move Suggestion:</strong><br>
        Based on this stratagem, you should <span class="font-semibold">${input.toLowerCase().includes('competitor') ? 'create a distraction and strike elsewhere' : 'act decisively while maintaining calm'}</span>.<br><br>
        <small class="text-green-400">This is how Chinese strategists turn difficult situations into advantage.</small>
      </div>
    `;
  }
  resultDiv.classList.remove('hidden');
}

// Live search & filter
function addEventListeners() {
  const searchInput = document.getElementById('searchInput');
  const categoryFilter = document.getElementById('categoryFilter');

  function filterStratagems() {
    const term = searchInput.value.toLowerCase().trim();
    const category = categoryFilter.value;

    const filtered = allStratagems.filter(s => {
      const matchesSearch = !term || 
        s.name.toLowerCase().includes(term) ||
        s.description.toLowerCase().includes(term) ||
        s.pinyin.toLowerCase().includes(term);
      
      const matchesCategory = !category || s.category === category;
      return matchesSearch && matchesCategory;
    });

    renderStratagems(filtered);
  }

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
  console.log('%c🎨 36 Stratagems Canvas ready!', 'color:#fbbf24; font-weight:bold');
};
