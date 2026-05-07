// assets/js/guanxi.js
let contacts = [];

function loadContacts() {
  // In real version you could save to localStorage
  const saved = localStorage.getItem('guanxiContacts');
  if (saved) contacts = JSON.parse(saved);
  renderNetwork();
}

function saveContacts() {
  localStorage.setItem('guanxiContacts', JSON.stringify(contacts));
}

function addContact() {
  const name = document.getElementById('nameInput').value.trim();
  const strength = parseInt(document.getElementById('strengthInput').value);
  const notes = document.getElementById('notesInput').value.trim();

  if (!name) {
    alert("Please enter a name");
    return;
  }

  contacts.push({
    id: Date.now(),
    name: name,
    strength: strength,
    notes: notes || "New connection"
  });

  saveContacts();
  renderNetwork();

  // Clear form
  document.getElementById('nameInput').value = '';
  document.getElementById('notesInput').value = '';
}

function renderNetwork() {
  const grid = document.getElementById('networkGrid');
  grid.innerHTML = '';

  document.getElementById('contactCount').textContent = `${contacts.length} contacts`;

  if (contacts.length === 0) {
    grid.innerHTML = `
      <div class="col-span-full flex flex-col items-center justify-center py-16 text-zinc-400">
        <div class="text-6xl mb-6">🕸️</div>
        <p class="text-xl">Your network is empty</p>
        <p class="text-sm mt-2">Add your first contact above to start building Guanxi</p>
      </div>`;
    return;
  }

  contacts.forEach(contact => {
    const card = document.createElement('div');
    card.className = `bg-black border border-zinc-700 hover:border-amber-400 rounded-3xl p-6 transition-all`;
    card.innerHTML = `
      <div class="flex justify-between">
        <div class="font-semibold text-lg">${contact.name}</div>
        <div class="flex items-center gap-1 text-amber-400">
          ${'★'.repeat(contact.strength)}
          <span class="text-xs text-zinc-400">(${contact.strength}/10)</span>
        </div>
      </div>
      <p class="text-sm text-zinc-400 mt-3 line-clamp-2">${contact.notes}</p>
      <div class="mt-6 h-2 bg-zinc-800 rounded-full overflow-hidden">
        <div class="h-full bg-gradient-to-r from-amber-400 to-orange-500" 
             style="width: ${contact.strength * 10}%"></div>
      </div>
    `;
    grid.appendChild(card);
  });
}

// Initialize
window.onload = loadContacts;
