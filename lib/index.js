import DinoGame from './game/DinoGame.js'

const game = new DinoGame(900, 150)
const isTouchDevice =
  'ontouchstart' in window ||
  navigator.maxTouchPoints > 0 ||
  navigator.msMaxTouchPoints > 0

if (isTouchDevice) {
  const buttonUp = document.createElement('button')
  buttonUp.classList.add('my-button')
  const buttonDown = document.createElement('button')
  buttonDown.classList.add('my-button')

  buttonUp.style.width = '50%'
  buttonUp.style.height = '100vh'
  buttonUp.style.background = 'transparent'
  buttonUp.style.border = 'none'
  buttonUp.style.zIndex = '999'
  // buttonUp.innerHTML = `<i class="fas fa-arrow-up"></i>`

  buttonDown.style.width = '50%'
  buttonDown.style.height = '100vh'
  buttonDown.style.background = 'transparent'
  buttonDown.style.border = 'none'
  buttonDown.style.zIndex = '999'

  // buttonDown.innerHTML = `<i class="fas fa-arrow-down"></i>`

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
