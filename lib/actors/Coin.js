import sprites from '../sprites.js'
import Actor from './Actor.js'

export default class Coin extends Actor {
  static maxCoinHeight =
    Math.max(
      sprites.coin0.h,
      sprites.coin1.h,
      sprites.coin2.h,
      sprites.coin3.h
    ) / 2

  constructor(imageData) {
    super(imageData)
    this.coinFrames = 0
    this.coinPos = 0
    this.sprite = `coin${this.coinPos}`
    // these are dynamically set by the game
    this.x = null
    this.y = null
    this.speed = null
    this.coinMoveRate = null
  }

  nextFrame() {
    this.x -= this.speed
    this.determineSprite()
  }

  determineSprite() {
    const oldPos = this.coinPos

    if (this.coinFrames >= this.coinMoveRate) {
      this.coinPos =
        this.coinPos + 1 > 3 ? (this.coinPos = 0) : this.coinPos + 1
      this.coinFrames = 0
    }

    this.sprite = `coin${this.coinPos}`
    this.coinFrames++

    // if we're switching sprites, x needs to be
    // updated for the rotation difference
    if (this.coinPos !== oldPos) {
      if (this.coinPos === 1) {
        this.x += this.width / 2
      } else if (this.coinPos === 3) {
        this.x -= this.width / 2
      }
    }
  }
}
