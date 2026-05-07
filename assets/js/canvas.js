// assets/js/canvas.js - FIXED & IMPROVED (Personalized Move now works)
let allStratagems = [];

async function loadStratagems() {
  try {
    const response = await fetch('assets/data/stratagems.json');
    const data = await response.json();
    allStratagems = data.stratagems;
    renderStratagems(allStratagems);
  } catch (e) {
    console.error("Could not load stratagems", e);
  }
}

function renderStratagems(stratagems) {
  const grid = document.getElementById('stratagemsGrid');
  grid.innerHTML = '';

  if (stratagems.length === 0) {
    grid.innerHTML = `<p class="col-span-full text-center py-12 text-zinc-400">No stratagems found.<br>Try "negotiation", "competitor", "crisis", etc.</p>`;
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
  
  // Clear previous result
  document.getElementById('applyResult').classList.add('hidden');
  document.getElementById('situationInput').value = '';
}

function closeModal() {
  const modal = document.getElementById('detailModal');
  modal.classList.add('hidden');
  modal.classList.remove('flex');
}

// FIXED & IMPROVED Personalized Move
function applyStratagem() {
  const input = document.getElementById('situationInput').value.trim();
  const resultDiv = document.getElementById('applyResult');
  
  if (!input) {
    resultDiv.innerHTML = `<p class="text-amber-400 p-4">Please type your situation first.</p>`;
    resultDiv.classList.remove('hidden');
    return;
  }

  // Better dynamic response
  let suggestion = "Use this stratagem to gain positional advantage while staying calm and strategic.";
  
  const lowerInput = input.toLowerCase();
  if (lowerInput.includes("competitor") || lowerInput.includes("price") || lowerInput.includes("sales")) {
    suggestion = "Create a distraction in one area while striking in another (or use a third party to pressure them).";
  } else if (lowerInput.includes("crisis") || lowerInput.includes("problem") || lowerInput.includes("losing")) {
    suggestion = "Act while the opponent is distracted — this is the perfect moment to 'Loot a Burning House'.";
  } else if (lowerInput.includes("partner") || lowerInput.includes("network") || lowerInput.includes("relationship")) {
    suggestion = "Focus on building long-term Guanxi. Offer small value now to gain big advantage later.";
  }

  resultDiv.innerHTML = `
    <div class="p-5 bg-green-900/30 border border-green-400 rounded-2xl text-green-200">
      <strong>✅ Personalized Move Suggestion:</strong><br><br>
      ${suggestion}<br><br>
      <small class="text-green-400">This is how Chinese strategists turn difficult situations into long-term advantage.</small>
    </div>
  `;
  resultDiv.classList.remove('hidden');
}

// Search & filter
function filterStratagems() {
  const term = document.getElementById('searchInput').value.toLowerCase().trim();
  const category = document.getElementById('categoryFilter').value;

  const filtered = allStratagems.filter(s => {
    const searchText = `${s.name} ${s.pinyin} ${s.description} ${s.example || ''}`.toLowerCase();
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
  console.log('%c🎨 36 Stratagems Canvas — Fully Fixed!', 'color:#fbbf24; font-weight:bold');
};
