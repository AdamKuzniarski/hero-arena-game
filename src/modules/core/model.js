export class Item {
  constructor(name) {
    this.name = name
  }
}
export class Weapon extends Item {
  constructor(name, dmg = 0, crit = 0.05) {
    super(name)
    this.dmg = dmg
    this.crit = crit
  }
}

export class Shield extends Item {
  constructor(name, hp = 6) {
    super(name)
    this.maxHp = hp
    this.hp = hp
  }

  get broken() {
    return this.hp <= 0
  }
}

export class Potion extends Item {
  constructor(name, heal = 10) {
    super(name)
    this.heal = heal // Amount of HP this potion heals
  }
  use(t) {
    const before = t.hp
    t.hp = Math.min(t.maxHp, t.hp + this.heal)
    return t.hp - before
  }
}

export class Entity {
  constructor(name, maxHp, baseDmg) {
    this.name = name
    this.maxHp = maxHp
    this.baseDmg = baseDmg
    this.hp = maxHp
    this.effects = []
  }
  get alive() {
    return this.hp > 0
  }
}

export class Hero extends Entity {
  constructor(name, maxHp, baseDmg) {
    super(name, maxHp, baseDmg)
    this.inventory = [
      new Weapon('Holzschwert', 1, 0.05),
      new Potion('Kleiner Trank', 12),
      new Shield('Holzschild', 6),
    ]
    this.equipped = this.inventory.find((x) => x instanceof Weapon) ?? null
    this.shield = this.inventory.find((x) => x instanceof Shield) ?? null
    this.score = 0
    this.achievements = {}

    this.level = 1
    this.xp = 0
  }

  get nextLevelXp() {
    return this.level * 10
  }

  gainXp(amount) {
    this.xp += amount
    let leveledUp = false

    while (this.xp >= this.nextLevelXp) {
      this.xp -= this.nextLevelXp
      this.level++
      this.maxHp += 5
      this.baseDmg += 1
      this.hp = this.maxHp
      leveledUp = true
    }
    return leveledUp
  }
}

export class Enemy extends Entity {
  constructor(name, maxHp, baseDmg, tier = 1, behavior = 'normal') {
    super(name, maxHp, baseDmg)
    this.tier = tier
    this.behavior = behavior // normall | "aggressiv"
  }
}
