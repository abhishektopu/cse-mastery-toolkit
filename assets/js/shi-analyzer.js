// assets/js/shi-analyzer.js - Smarter responses
let allStratagems = [];

async function loadStratagems() {
  try {
    const res = await fetch('assets/data/stratagems.json');
    const data = await res.json();
    allStratagems = data.stratagems;
  } catch (e) {
    console.error("Failed to load stratagems", e);
  }
}

function analyzeShi() {
  const input = document.getElementById('situationInput').value.trim();
  const resultArea = document.getElementById('resultArea');
  const shiResult = document.getElementById('shiResult');
  const recGrid = document.getElementById('recommendedStratagems');

  if (!input) {
    alert("Please describe your situation first.");
    return;
  }

  resultArea.classList.remove('hidden');

  const lower = input.toLowerCase();
  let shiText = "The current Shi is **neutral** — good time to observe and prepare.";
  let recommended = allStratagems.sort(() => 0.5 - Math.random()).slice(0, 4);

  if (lower.includes("competitor") || lower.includes("price") || lower.includes("sales")) {
    shiText = "The current Shi is **favorable for attack** — your competitor has created a crack in their own defense.";
    recommended = allStratagems.filter(s => s.category === "Attack" || s.tags?.includes("opportunity")).slice(0, 4);
  } 
  else if (lower.includes("crisis") || lower.includes("problem") || lower.includes("losing") || lower.includes("difficult")) {
    shiText = "The current Shi is **dangerous but temporary** — perfect time to use defensive stratagems and prepare a counter-attack.";
    recommended = allStratagems.filter(s => s.category === "Defense" || s.category === "Escape").slice(0, 4);
  } 
  else if (lower.includes("partner") || lower.includes("network") || lower.includes("relationship") || lower.includes("guanxi")) {
    shiText = "The current Shi favors **long-term relationship building**. Focus on Guanxi and mutual benefit.";
    recommended = allStratagems.filter(s => s.category === "Alliance" || s.tags?.includes("patience")).slice(0, 4);
  }

  shiResult.innerHTML = `
    <p class="text-xl leading-relaxed">${shiText}</p>
    <div class="mt-8 text-amber-400 text-sm font-medium">Key Chinese Principle:</div>
    <p class="text-zinc-300">"Know the terrain, know the timing — that is Shi."</p>
    <p class="mt-6 text-zinc-400 italic">"${input}"</p>
  `;

  recGrid.innerHTML = recommended.map(strat => `
    <div onclick="window.location.href='canvas.html'" 
         class="bg-black border border-zinc-700 hover:border-amber-400 p-6 rounded-2xl cursor-pointer transition">
      <div class="text-amber-400 text-xs mb-2">${strat.category} • #${strat.id}</div>
      <div class="font-semibold">${strat.name}</div>
      <div class="text-sm text-zinc-400 mt-1">${strat.pinyin}</div>
      <p class="text-xs text-zinc-500 mt-3 line-clamp-2">${strat.description}</p>
    </div>
  `).join('');
}

// Load on start
window.onload = loadStratagems;
