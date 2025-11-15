export function render(app, state) {
  const { hero, enemy, log = [] } = state;

console.log("RENDER LOG:", log)

  app.innerHTML = `
<header class="mb-6">
  <h1 class="text-2xl font-display font-bold tracking-tight text-slate-100">Monster-Arena</h1>
</header>

<section class="grid gap-4 md:grid-cols-2">
  <!-- HERO -->
  <div class="card p-4 text-slate-900">
    <h2 class="font-semibold">${hero.name}</h2>
    <progress value="${hero.hp}" max="${hero.maxHp}" class="my-2"></progress>
    <p class="text-sm/6">
      ${hero.hp} / ${hero.maxHp} HP • Schaden: ${hero.baseDmg}
    </p>
    <p class="mt-2">
      <span class="badge bg-slate-100 text-slate-900">
        Waffe: ${hero.equipped?.name ?? "keine"}
      </span>
    </p>
    <p class="mt-1 text-sm">
      Score: <span class="font-semibold">${hero.score}</span>
    </p>
  </div>

  <!-- ENEMY -->
  <div class="card p-4 text-slate-900">
    <h2 class="font-semibold">${enemy.name}</h2>
    <progress value="${enemy.hp}" max="${enemy.maxHp}" class="my-2"></progress>
    <p class="text-sm/6">
      ${enemy.hp} / ${enemy.maxHp} HP • Schaden: ${enemy.baseDmg}
    </p>
  </div>
</section>

<!-- ACTIONS -->
<section class="card p-4 mt-4 flex flex-wrap gap-2">
  <button id="btnAttack" class="btn btn-primary" type="button">Angreifen</button>
  <button id="btnPotion" class="btn btn-ghost text-slate-900 ring-1 ring-slate-300" type="button">Trank</button>
  <button id="btnEquip"  class="btn btn-ghost text-slate-900 ring-1 ring-slate-300" type="button">Waffe</button>
  <button id="btnNext"   class="btn btn-ghost text-slate-900 ring-1 ring-slate-300" type="button">Nächster Gegner</button>
  <button id="btnReset"  class="btn btn-ghost text-slate-900 ring-1 ring-slate-300" type="button">Neues Spiel</button>
</section>

<!-- INVENTORY + LOG -->
<section class="grid gap-4 md:grid-cols-2 mt-4">
  <div class="card p-4 text-slate-900">
    <h3 class="font-semibold">Inventar</h3>
    <ul id="inv" class="mt-2 space-y-1 text-sm"></ul>
  </div>
  <div class="card p-4 text-slate-900">
    <h3 class="font-semibold">Log</h3>
    <pre id="log" class="mt-2 max-h-60 overflow-auto text-xs text-slate-900"></pre>
  </div>
</section>
`;

  const invElement = app.querySelector("#inv");
  if (invElement) {
    invElement.innerHTML = hero.inventory
      .map((item, index) => `<li>#${index + 1} ${item.name}</li>`)
      .join("");
    }
    
    const logElement = app.querySelector("#log");
    if (logElement) {
      logElement.textContent = log.join("\n");
      console.log("DOM LOG TEXT:", logElement.textContent)
  }
}
