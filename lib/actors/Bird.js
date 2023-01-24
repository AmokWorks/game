import sprites from '../sprites.js'
import Actor from './Actor.js'

export default class Bird extends Actor {
  static maxBirdHeight = Math.max(sprites.birdUp.h, sprites.birdDown.h) / 2

  // pixels that are added/removed to `x` when switching between wings up and wings down
  static wingSpriteXShift = 6

  constructor(imageData) {
    super(imageData)
    this.wingFrames = 0
    this.wingDirection = 'Up'
    this.sprite = `bird${this.wingDirection}`
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
    const oldDir = this.wingDirection

    if (this.wingFrames >= this.wingsRate) {
      this.wingDirection = this.wingDirection === 'Up' ? 'Down' : 'Up'
      this.wingFrames = 0
    }

    this.sprite = `bird${this.wingDirection}`
    this.wingFrames++

    // if we're switching sprites, y needs to be
    // updated for the height difference
    if (this.wingDirection !== oldDir) {
      let adjustment = Bird.wingSpriteXShift
      if (this.wingDirection === 'Down') {
        adjustment *= -1
      }

      this.x += adjustment
    }
  }
}
