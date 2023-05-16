import sprites from '../sprites.js'
import Actor from './Actor.js'

export default class Bird extends Actor {
  static maxBirdHeight =
    Math.max(sprites.helicopter1.h, sprites.helicopter2.h) / 2

  // pixels that are added/removed to `x` when switching between wings up and wings down
  static wingSpriteXShift = 8

  constructor(imageData) {
    super(imageData)
    this.wingFrames = 0
    this.helicopterPosition = '1'
    this.sprite = `helicopter${this.helicopterPosition}`
    // these are dynamically set by the game
    this.x = null
    this.y = null
    this.speed = null
    this.wingsRate = null
  }

  nextFrame() {
    this.x -= this.speed
    this.determineSprite()
  }

  determineSprite() {
    const oldDir = this.helicopterPosition

    if (this.wingFrames >= this.wingsRate) {
      this.helicopterPosition = this.helicopterPosition === '1' ? '2' : '1'
      this.wingFrames = 0
    }

    this.sprite = `helicopter${this.helicopterPosition}`
    this.wingFrames++

    // if we're switching sprites, x needs to be
    // updated for the length difference
    if (this.helicopterPosition !== oldDir) {
      if (this.helicopterPosition === '2') {
        this.x -= Bird.wingSpriteXShift
      } else {
        this.x += Bird.wingSpriteXShift
      }

    }
  }
}
