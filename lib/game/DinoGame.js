import Bird from '../actors/Bird.js'
import Cactus from '../actors/Cactus.js'
import Cloud from '../actors/Cloud.js'
import Dino from '../actors/Dino.js'
import Coin from '../actors/Coin.js'
import sprites from '../sprites.js'
import { playSound, playOST, stopOST } from '../sounds.js'
import {
  loadFont,
  loadImage,
  getImageData,
  randBoolean,
  randInteger,
  renderScores,
} from '../utils.js'
import GameRunner from './GameRunner.js'

export default class DinoGame extends GameRunner {
  constructor(width, height) {
    super()

    this.isMuted = false

    this.width = null
    this.height = null
    this.canvas = this.createCanvas(width, height)
    this.canvasCtx = this.canvas.getContext('2d')
    this.spriteImage = null
    this.spriteImageData = null
    this.backgroundImage = null

    /*
     * units
     * fpa: frames per action
     * ppf: pixels per frame
     * px: pixels
     */
    this.defaultSettings = {
      bgSpeed: 8, // ppf
      birdSpeed: 9, // ppf
      birdSpawnRate: 240, // fpa
      birdWingsRate: 10, // fpa
      cactiSpawnRate: 50, // fpa
      cloudSpawnRate: 200, // fpa
      cloudSpeed: 2, // ppf
      dinoGravity: 0.5, // ppf
      dinoGroundOffset: 4, // px
      dinoLegsRate: 8, // fpa
      dinoLift: 10, // ppf
      scoreBlinkRate: 20, // fpa
      scoreIncreaseRate: 6, // fpa
      coinSpeed: 5, // ppf
      coinSpawnRate: 200, // fpa
      coinMoveRate: 10, // fpa
    }

    this.state = {
      settings: { ...this.defaultSettings },
      player: undefined,
      birds: [],
      coins: [],
      cacti: [],
      clouds: [],
      dino: null,
      gameOver: false,
      groundX: 0,
      groundY: 0,
      backgroundX: 0,
      isRunning: false,
      level: 0,
      score: {
        blinkFrames: 0,
        blinks: 0,
        isBlinking: false,
        value: 0,
        coins: 0,
      },
      muted: this.isMuted,
    }
  }

  // ref for canvas pixel density:
  // https://developer.mozilla.org/en-US/docs/Web/API/Window/devicePixelRatio#correcting_resolution_in_a_%3Ccanvas%3E
  createCanvas(width, height) {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const scale = window.devicePixelRatio

    this.width = width
    this.height = height
    canvas.style.width = width + 'px'
    canvas.style.height = height + 'px'
    canvas.width = Math.floor(width * scale)
    canvas.height = Math.floor(height * scale)
    ctx.scale(scale, scale)

    document.body.appendChild(canvas)
    return canvas
  }

  async preload() {
    const { settings } = this.state
    const [spriteImage, backgroundImage] = await Promise.all([
      loadImage('./assets/sprite2.png'),
      loadImage('./assets/back.png'),
      loadFont('./assets/PressStart2P-Regular.ttf', 'PressStart2P'),
    ])
    this.spriteImage = spriteImage
    this.spriteImageData = getImageData(spriteImage)
    this.backgroundImage = backgroundImage
    const dino = new Dino(this.spriteImageData)

    dino.legsRate = settings.dinoLegsRate
    dino.lift = settings.dinoLift
    dino.gravity = settings.dinoGravity
    dino.x = 25
    dino.baseY = this.height - settings.dinoGroundOffset
    this.state.dino = dino
  }

  onFrame() {
    const { state } = this

    this.drawFPS()
    this.drawGround()
    this.drawClouds()
    this.drawDino()
    this.drawScore()
    this.drawCoinsScore()

    if (state.isRunning) {
      this.drawCacti()
      this.drawCoins()

      if (state.level > 3) {
        this.drawBirds()
      }

      if (state.dino.hits([state.coins[0]])) {
        if (!this.isMuted) playSound('level-up')
        state.score.coins += 1
        state.coins.shift()
      }

      if (state.dino.hits([state.cacti[0], state.birds[0]])) {
        if (!this.isMuted) playSound('game-over')
        state.gameOver = true
      }

      if (state.gameOver) {
        this.endGame()
      } else {
        this.updateScore()
      }
    }
  }

  onInput(type) {
    const { state } = this

    switch (type) {
      case 'jump': {
        if (state.isRunning) {
          if (state.dino.jump()) {
            if (!this.isMuted) playSound('jump')
          }
        } else {
          this.resetGame(true)
          state.dino.jump()
          if (!this.isMuted) playSound('jump')
        }
        break
      }

      case 'duck': {
        if (state.isRunning) {
          state.dino.duck(true)
        }
        break
      }

      case 'stop-duck': {
        if (state.isRunning) {
          state.dino.duck(false)
        }
        break
      }
    }
  }

  mute() {
    this.isMuted = true
    stopOST()
  }

  unmute() {
    this.isMuted = false
    playOST()
  }

  resetGame(starting = false) {
    this.state.dino.reset()
    Object.assign(this.state, {
      settings: { ...this.defaultSettings },
      birds: [],
      cacti: [],
      coins: [],
      gameOver: false,
      isRunning: starting ? true : false,
      level: 0,
      score: {
        blinkFrames: 0,
        blinks: 0,
        isBlinking: false,
        value: 0,
        coins: 0,
      },
      muted: this.isMuted,
    })
    const elements = document.getElementsByClassName('modal')
    while (elements.length > 0) {
      elements[0].parentNode.removeChild(elements[0])
    }

    this.start(false, this.isMuted)
  }

  endGame() {
    this.state.isRunning = false
    this.drawScore()
    this.drawCoinsScore()
    renderScores(this)
    this.stop()
  }

  increaseDifficulty() {
    const { birds, cacti, clouds, dino, settings } = this.state
    const { bgSpeed, cactiSpawnRate, dinoLegsRate } = settings
    const { level } = this.state

    if (level > 4 && level < 8) {
      settings.bgSpeed++
      settings.birdSpeed = settings.bgSpeed
    } else if (level > 7) {
      settings.bgSpeed = Math.ceil(bgSpeed * 1.1)
      settings.birdSpeed = Math.ceil(settings.bgSpeed * 1.1)
      settings.cactiSpawnRate = Math.floor(cactiSpawnRate * 0.98)

      if (level > 7 && level % 2 === 0 && dinoLegsRate > 3) {
        settings.dinoLegsRate--
      }
    }

    for (const bird of birds) {
      bird.speed = settings.birdSpeed
    }

    for (const cactus of cacti) {
      cactus.speed = settings.bgSpeed
    }

    for (const cloud of clouds) {
      cloud.speed = settings.bgSpeed
    }

    dino.legsRate = settings.dinoLegsRate
  }

  updateScore() {
    const { state } = this

    if (this.frameCount % state.settings.scoreIncreaseRate === 0) {
      const oldLevel = state.level

      state.score.value++
      state.level = Math.floor(state.score.value / 100)

      if (state.level !== oldLevel) {
        if (!this.isMuted) playSound('level-up')
        this.increaseDifficulty()
        state.score.isBlinking = true
      }
    }
  }

  drawFPS() {
    this.paintText('fps: ' + Math.round(this.frameRate), 0, 0, {
      font: 'PressStart2P',
      size: '12px',
      baseline: 'top',
      align: 'left',
      color: '#535353',
    })
  }

  drawGround() {
    const { state } = this
    const { bgSpeed } = state.settings

    this.paintSprite('background', state.groundX, state.groundY, true)
    state.groundX -= bgSpeed

    // append second image until first is fully translated
    if (state.groundX <= -900) {
      state.groundX = 0
    }
  }

  drawClouds() {
    const { clouds, settings } = this.state

    this.progressInstances(clouds)
    if (this.frameCount % settings.cloudSpawnRate === 0) {
      const newCloud = new Cloud()
      newCloud.speed = settings.bgSpeed
      newCloud.x = this.width
      newCloud.y = randInteger(20, 80)
      clouds.push(newCloud)
    }
    this.paintInstances(clouds)
  }

  drawDino() {
    const { dino } = this.state

    dino.nextFrame()
    this.paintSprite(dino.sprite, dino.x, dino.y)
  }

  drawCacti() {
    const { state } = this
    const { cacti, settings } = state

    this.progressInstances(cacti)
    if (this.frameCount % settings.cactiSpawnRate === 0) {
      // randomly either do or don't add cactus
      if (!state.birds.length && randBoolean()) {
        const newCacti = new Cactus(this.spriteImageData)
        newCacti.speed = settings.bgSpeed
        newCacti.x = this.width
        newCacti.y = this.height - newCacti.height - 7
        cacti.push(newCacti)
      }
    }
    this.paintInstances(cacti)
  }

  drawCoins() {
    const { coins, settings } = this.state

    this.progressInstances(coins)
    if (this.frameCount % settings.coinSpawnRate === 0) {
      // randomly either do or don't add bird
      if (randBoolean()) {
        const newCoin = new Coin(this.spriteImageData)
        newCoin.speed = settings.coinSpeed
        newCoin.coinMoveRate = settings.coinMoveRate
        newCoin.x = this.width
        // ensure birds are always at least 5px higher than a ducking dino
        newCoin.y =
          this.height -
          100 -
          sprites.dinoDuckLeftLeg.h / 2 -
          settings.dinoGroundOffset
        coins.push(newCoin)
      }
    }
    this.paintInstances(coins)
  }
  drawBirds() {
    const { birds, settings } = this.state

    this.progressInstances(birds)
    if (this.frameCount % settings.birdSpawnRate === 0) {
      // randomly either do or don't add bird
      if (randBoolean()) {
        const newBird = new Bird(this.spriteImageData)
        newBird.speed = settings.birdSpeed
        newBird.wingsRate = settings.birdWingsRate
        newBird.x = this.width
        // ensure birds are always at least 5px higher than a ducking dino
        newBird.y =
          this.height -
          Bird.maxBirdHeight -
          sprites.dinoDuckLeftLeg.h / 2 -
          settings.dinoGroundOffset -
          10
        birds.push(newBird)
      }
    }
    this.paintInstances(birds)
  }

  drawCoinsScore() {
    const { canvasCtx, state } = this
    const { score } = state
    const fontSize = 12
    let drawValue = score.coins

    // draw the background behind it in case this is called
    // at a time where the background isn't re-drawn (i.e. in `endGame`)
    canvasCtx.fillStyle = 'transparent'
    canvasCtx.fillRect(fontSize * 5, 0, fontSize * 5, fontSize)

    this.paintText(('coins: ' + drawValue).padStart(3, '0'), 0, 0, {
      font: 'PressStart2P',
      size: `${fontSize}px`,
      align: 'left',
      baseline: 'top',
      color: '#535353',
    })
  }

  drawScore() {
    const { canvasCtx, state } = this
    const { isRunning, score, settings } = state
    const fontSize = 12
    let shouldDraw = true
    let drawValue = score.value

    if (isRunning && score.isBlinking) {
      score.blinkFrames++

      if (score.blinkFrames % settings.scoreBlinkRate === 0) {
        score.blinks++
      }

      if (score.blinks > 7) {
        score.blinkFrames = 0
        score.blinks = 0
        score.isBlinking = false
      } else {
        if (score.blinks % 2 === 0) {
          drawValue = Math.floor(drawValue / 100) * 100
        } else {
          shouldDraw = false
        }
      }
    }

    if (shouldDraw) {
      // draw the background behind it in case this is called
      // at a time where the background isn't re-drawn (i.e. in `endGame`)
      canvasCtx.fillStyle = '#fff'
      canvasCtx.fillRect(0, 0, 900, 15)
      canvasCtx.fillStyle = 'transparent'
      canvasCtx.fillRect(this.width - fontSize * 5, 0, fontSize * 5, fontSize)

      this.paintText((drawValue + '').padStart(5, '0'), this.width, 0, {
        font: 'PressStart2P',
        size: `${fontSize}px`,
        align: 'right',
        baseline: 'top',
        color: '#535353',
      })
    }
  }

  /**
   * For each instance in the provided array, calculate the next
   * frame and remove any that are no longer visible
   * @param {Actor[]} instances
   */
  progressInstances(instances) {
    for (let i = instances.length - 1; i >= 0; i--) {
      const instance = instances[i]

      instance.nextFrame()
      if (instance.rightX <= 0) {
        // remove if off screen
        instances.splice(i, 1)
      }
    }
  }

  /**
   * @param {Actor[]} instances
   */
  paintInstances(instances) {
    for (const instance of instances) {
      this.paintSprite(instance.sprite, instance.x, instance.y)
    }
  }

  paintSprite(spriteName, dx, dy, isBackground = false) {
    const { h, w, x, y } = sprites[spriteName]
    this.canvasCtx.drawImage(
      isBackground ? this.backgroundImage : this.spriteImage,
      x,
      y,
      w,
      h,
      dx,
      dy,
      isBackground ? w : w / 2,
      isBackground ? h : h / 2
    )
  }

  paintText(text, x, y, opts) {
    const { font = 'serif', size = '12px' } = opts
    const { canvasCtx } = this

    canvasCtx.font = `${size} ${font}`
    if (opts.align) canvasCtx.textAlign = opts.align
    if (opts.baseline) canvasCtx.textBaseline = opts.baseline
    if (opts.color) canvasCtx.fillStyle = opts.color
    canvasCtx.fillText(text, x, y)
  }
}
