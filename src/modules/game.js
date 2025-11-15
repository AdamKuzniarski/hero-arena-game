import { Hero } from "./core/model.js";
import { load, save } from "./core/storage.js";
import { makeEnemy } from "./core/combat.js";
import { render } from "./ui/render.js";
import { bindEvents } from "./ui/events.js";

export function initGame(app) {
  const saved = load("arena:v4", null);
  const hero = saved
    ? Object.assign(new Hero("Aya", 30, 3), saved)
    : new Hero("Aya", 30, 3);
  const state = { level: 1, hero, enemy: makeEnemy(1), log: [] };

  render(app, state);
  bindEvents(app, state);
  save("arena:v4", state.hero);
}
