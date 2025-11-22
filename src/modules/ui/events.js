import { attack, lootFor, makeEnemy, tickStatus, addStatus } from '../core/combat.js'
import { save } from '../core/storage.js'
import { render } from './render.js'

export function bindEvents(app, state) {
  const pushLog = (message) => {
    const time = new Date().toLocaleTimeString()

    console.log('LOG STATE:', state.log)

    if (!Array.isArray(state.log)) {
      state.log = []
    }
    state.log.unshift(`[${time}] ${message}`)
  }

  // Ein Delegations-Listener
  app.addEventListener('click', (event) => {
    const btn = event.target.closest('button')
    if (!btn || !app.contains(btn)) return

    switch (btn.id) {
      case 'btnAttack': {
        console.log('button Attack gedrückt')
        if (!state.hero.alive || !state.enemy.alive) return

        const dealt = attack(state.hero, state.enemy)
        pushLog(`⚔️ ${state.hero.name} trifft für ${dealt}.`)

        if (!state.enemy.alive) {
          state.hero.score++

          const xpGained = state.enemy.tier * 3
          const leveledUp = state.hero.gainXp(xpGained)

          const drops = lootFor(state.enemy)
          drops.forEach((drop) => state.hero.inventory.push(drop))

          pushLog(
            `💥 ${state.enemy.name} besiegt. +${xpGained} XP. Loot: ${
              drops.map((x) => x.name).join(', ') || 'nix'
            }`,
          )
          if (leveledUp) {
            pushLog(
              `✨ Level Up! ${state.hero.name} ist jetzt ${state.hero.level} (HP: ${state.hero.maxHp}, DMG: ${state.hero.baseDmg}).`,
            )
          }
        } else {
          let taken = attack(state.enemy, state.hero)
          pushLog(`🩸 ${state.enemy.name} kontert für ${taken}.`)

          if (state.enemy.includes('Ghul') && state.hero.alive && Math.random() < 0.4) {
            addStatus(state.hero, {
              type: 'poison',
              amount: 2, //Giftschaden pro Runde
              duration: 3, //Runden
            })
            pushLog(`☠️ ${state.hero.name} wurde vergiftet!`)
          }

          if (state.enemy.behavior === 'aggresiv' && state.hero.alive && Math.random() < 0.25) {
            const extra = attack(state.enemy, state.hero)
            taken += extra
            pushLog(
              `😈 ${state.enemy.name} rastet aus und greift ein zweites Mal an für ${extra} Schaden!`,
            )
          }

          if (!state.hero.alive) pushLog(`💀 ${state.hero.name} wurde besiegt.`)
        }

        tickStatus(state.hero, pushLog)
        tickStatus(state.enemy, pushLog)

        render(app, state)
        save('arena:v4', state.hero)
        break
      }

      case 'btnPotion': {
        const potion = state.hero.inventory.find((item) => item.name.includes('Trank'))
        if (!potion) {
          pushLog('Kein Trank.')
          return
        }

        if (potion.name.includes('Regen')) {
          addStatus(state.hero, {
            type: 'regen',
            amount: 3,
            duration: 3,
          })
          pushLog(`🌿 ${state.hero.name} spürt eine heilende Aura.`)
        } else {
          const healed = potion.use(state.hero)
          pushLog(`🧪 Heilung: +${healed} HP.`)
        }

        const healed = potion.use(state.hero)
        pushLog(`🧪 Heilung: +${healed} HP.`)

        const idx = state.hero.inventory.indexOf(potion)
        if (idx > -1) state.hero.inventory.splice(idx, 1) // Verbrauchsitem

        render(app, state)
        save('arena:v4', state.hero)
        break
      }

      case 'btnEquip': {
        const weapons = state.hero.inventory.filter((item) => item.dmg != null)
        if (!weapons.length) {
          pushLog('Keine Waffen.')
          return
        }

        const index = weapons.indexOf(state.hero.equipped)
        state.hero.equipped = weapons[(index + 1) % weapons.length]
        pushLog(`🗡️ Ausgerüstet: ${state.hero.equipped.name}`)

        render(app, state)
        save('arena:v4', state.hero)
        break
      }

      case 'btnNext': {
        if (state.enemy.alive) {
          pushLog('Erst den aktuellen Gegner besiegen.')
          return
        }
        state.level++
        state.enemy = makeEnemy(state.level)
        pushLog(`➡️ Neuer Gegner: ${state.enemy.name}`)
        render(app, state)
        break
      }

      case 'btnReset': {
        localStorage.removeItem('arena:v4')
        location.reload()
        break
      }
    }
  })
}
