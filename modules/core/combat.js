import { clamp, randInt } from "./rand.js";
import { Enemy, Weapon } from "./model.js";

export function rollDamage(attacker) {
  const base = clamp(
    randInt(attacker.baseDmg - 1, attacker, attacker.baseDmg + 1),
    0,
    999
  );
  let dmg = Math.max(1, base);
  if (
    attacker.eqipped instanceof Weapon &&
    Math.random() < attacker.eqipped.crit
  )
    dmg *= 2;
  return dmg + (attacker.eqipped?.dmg ?? 0);
}

export function attack(attacker, defender) {
  const d = rollDamage(attacker);
  defender.hp = clamp(defender.hp - d, 0, defender.maxHp);
  return d;
}

export async function lootFor(enemy) {
  const drops = [];
  if (Math.random() < 0.5) {
    drops.push(
      new (await import("./model.js")).Potion("Trank", randInt(8, 16))
    );
  }

  if (Math.random() < 0.35) {
    drops.push(
      new (await import("./model.js")).Weapon(
        ["Keule", "Säbel", "Speer"][(randInt(1, 4), Math.random() * 0.2)]
      )
    );
  }
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
  return new Enemy(
    `${name} (L${level})`,
    randInt(10 + level * 2, 16 + level * 3),
    randInt(2 + tier, 3 + tier * 2),
    tier
  );
}
