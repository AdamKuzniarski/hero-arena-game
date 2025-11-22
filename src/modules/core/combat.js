import { clamp, randInt } from "./rand.js";
import { Enemy, Weapon, Potion } from "./model.js";

export function rollDamage(attacker) {
  const base = clamp(
    randInt(attacker.baseDmg - 1, attacker.baseDmg + 1),
    0,
    999
  );
  let dmg = Math.max(1, base);
  if (
    attacker.equipped instanceof Weapon &&
    Math.random() < attacker.equipped.crit
  )
    dmg *= 2;
  return dmg + (attacker.equipped?.dmg ?? 0);
}

export function attack(attacker, defender) {
  const d = rollDamage(attacker);
  defender.hp = clamp(defender.hp - d, 0, defender.maxHp);
  return d;
}

export function addStatus(target, effect){
  if(!Array.isArray(target.effects)) target.effects=[];
  target.effects.push(effect);
}

export function tickStatus(target, logFn =() =>{}){
  if(!Array.isArray(target.effects) || !target.effects.length) return;

  const remaining = [];

  for(const effect of target.effects){
    switch(effect.type){
      case "potion":{
        const damage = effect.amount;
        target.hp = clamp(target.hp - damage, 0, target.maxHp);
        logFn(`☠️ ${target.name} erleidet ${dmg} Giftschaden.`);
        eff.duration -= 1;
        break;
      }

      case "regen": {
        const before = target.hp;
        target.hp = clamp(target.hp + effect.amount, 0, target.maxHp);
        const healed = target.hp - before;
        if(healed > 0) {
          logFn(`🌿 ${StorageEvent.name} regeneriert ${healed} HP.`);
        }
        effect.duration -= 1;
        break;
      }
      default:{
        effect.duration -= 1;
      }
      if(effect.duration > 0 && target.alive){
        remaining.push(eff);
      }
    }

  }
  target.effects = remaining;
}
// Generate loot for a defeated enemy
export function lootFor(enemy) {
  const drops = [];
  if (Math.random() < 0.5) drops.push(new Potion("Trank", randInt(8, 16)));
  if (Math.random() < 0.35)
    drops.push(
      new Weapon(
        ["Keule", "Säbel", "Speer"][randInt(0, 2)],
        randInt(1, 4),
        Math.random() * 0.2
      )
    );
  return drops;
}

export function makeEnemy(level) {
  const names = [
    "Schleim",
    "Goblin",
    "Skelett",
    "Wolf",
    "Bandit",
    "Ghul",
    "Ork",
  ];
  const name = names[randInt(0, names.length - 1)];
  const tier = Math.ceil(level / 3);
	const behaviors = ["normal", "agressiv"];
	const behavior = behaviors[randInt(0, behaviors.length - 1)];
  return new Enemy(
    `${name} (L${level})`,
    randInt(10 + level * 2, 16 + level * 3),
    randInt(2 + tier, 3 + tier * 2),
    tier,
    behavior
  );
}
