import DinoGame from './game/DinoGame.js'
import { renderControls } from './utils.js'

const game = new DinoGame(800, 150)
const isTouchDevice =
  'ontouchstart' in window ||
  navigator.maxTouchPoints > 0 ||
  navigator.msMaxTouchPoints > 0

if (isTouchDevice) {
  const buttonUp = document.createElement('button')
  const buttonDown = document.createElement('button')

  buttonUp.style.width = '200px'
  buttonUp.style.height = '80px'
  buttonUp.style.background = '#c3c3c3'
  buttonUp.innerHTML = `<i class="fas fa-arrow-up"></i>`

  buttonDown.style.width = '200px'
  buttonDown.style.height = '80px'
  buttonDown.style.background = '#c3c3c3'
  buttonDown.innerHTML = `<i class="fas fa-arrow-down"></i>`

  buttonUp.addEventListener('touchstart', ({ touches }) => {
    game.onInput('jump')
  })

  buttonDown.addEventListener('touchstart', ({ touches }) => {
    game.onInput('duck')
  })
  buttonDown.addEventListener('touchend', ({ touches }) => {
    game.onInput('stop-duck')
  })

  const wrapper = document.getElementById('wrapper')
  wrapper.appendChild(buttonUp)
  wrapper.appendChild(buttonDown)
} else {
  const keycodes = {
    // up, spacebar
    JUMP: { 38: 1, 32: 1 },
    // down
    DUCK: { 40: 1 },
  }

  document.addEventListener('keydown', ({ keyCode }) => {
    if (keycodes.JUMP[keyCode]) {
      game.onInput('jump')
    } else if (keycodes.DUCK[keyCode]) {
      game.onInput('duck')
    }
  })

  document.addEventListener('keyup', ({ keyCode }) => {
    if (keycodes.DUCK[keyCode]) {
      game.onInput('stop-duck')
    }
  })
}

game.start().catch(console.error)
