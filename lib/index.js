import DinoGame from './game/DinoGame.js'
import { getScores, createElementWithStyles } from './utils.js'

const game = new DinoGame(900, 300)
const isTouchDevice =
  'ontouchstart' in window ||
  navigator.maxTouchPoints > 0 ||
  navigator.msMaxTouchPoints > 0

export const renderScores = async (isDesktop) => {
  // The background of the modal
  const scores = document.createElement('div')
  scores.style.position = 'absolute'
  scores.style.top = isDesktop ? '1rem' : '6rem'
  scores.style.width = isDesktop ? '900px' : '90vw'
  scores.style.height = '30%'
  scores.style.display = 'flex'
  scores.style.flexDirection = 'column'
  scores.style.justifyContent = 'center'
  scores.style.alignItems = 'center'

  if(isDesktop){
    scores.style.left = '50%'
    scores.style.transform = 'translateX(-50%)'
  }

  const title = createElementWithStyles('h1', {
    fontFamily: 'PressStart2P',
    marginBottom: isDesktop ? '1rem': '3rem',
  })
  title.textContent = 'RUNNING AMOK'
  scores.appendChild(title)

  const populateScore = (i, score) => {
    const scoreDiv = createElementWithStyles('div', {
      display: 'flex',
      width: '100%',
      alignItems: 'center',
      justifyContent: 'space-between',
      fontFamily: 'PressStart2P',
      fontSize: isDesktop ? '0.8rem' : '1rem',
      padding: '0.5rem',
      margin: '0.5rem 0',
      borderBottom: '1px dotted #c3c3c3',
    })

    const index = document.createElement('span')
    index.textContent = `${i + 1}. `

    const username = document.createElement('span')
    username.textContent = `${score.username}`
    username.style.marginRight = 'auto'

    const accScore = document.createElement('span')
    accScore.textContent = `${score.score}`

    scoreDiv.appendChild(index)
    scoreDiv.appendChild(username)
    scoreDiv.appendChild(accScore)

    return scoreDiv
  }

  // The rendering of the scores
  const currScores = await getScores()
  const topFive = currScores.sort((f, s) => s.score - f.score).slice(0, isDesktop ? 5 :10)
  topFive.map((score, index) => {
    const scoreDiv = populateScore(index, score)
    scores.appendChild(scoreDiv)
  })
  // wrapper.appendChild(scores)

  let body = document.getElementById('scores')
  body.appendChild(scores)
}

const renderInfo = (isDesktop = false) => {
  const infoDiv = createElementWithStyles('div', {
    display: 'flex',
    flexDirection: 'column',
    width: isDesktop ? '900px':'90%',
    height: '20%',
    alignItems: 'left',
    justifyContent: 'space-between',
    fontFamily: 'PressStart2P',
    fontSize: isDesktop ? '0.8rem':'1.2rem',
    lineHeight: '25px',
    padding: '0.5rem',
    margin: '0.5rem',
    borderBottom: '1px dotted #c3c3c3',
    position: 'absolute',
    bottom: '2rem'
  })

  const index = document.createElement('p')
  index.textContent = `Do Not Ignore The Anarchy Coins.`

  const index2 = document.createElement('p')
  index2.textContent = `Anarchy Drives The World. The Coins Also Multiply Your Score.`

  const index3 = document.createElement('p')
  index3.textContent = `Highest Score Until 00:00 On 24.05 Wins A Gift From Us.`

  const index4 = document.createElement('p')
  index4.textContent = `“You Can Run From Reality For A While, But It Is Always Going To Catch Up Eventually. Embrace It.”`

  infoDiv.appendChild(index)
  infoDiv.appendChild(index2)
  infoDiv.appendChild(index3)
  infoDiv.appendChild(index4)

  return infoDiv
}

if (isTouchDevice) {
  renderScores(false)
  const buttonUp = document.createElement('div')

  buttonUp.style.border = 'none'
  buttonUp.style.zIndex = '999'
  buttonUp.style.backgroundImage = 'url("../assets/up100px.png")'
  buttonUp.style.backgroundSize = 'cover'
  buttonUp.style.width = '150px'
  buttonUp.style.height = '150px'
  buttonUp.style.position = 'absolute'
  buttonUp.style.top = '63%'
  buttonUp.style.right = '6rem'

  const buttonDown = document.createElement('div')

  buttonDown.style.border = 'none'
  buttonDown.style.zIndex = '999'
  buttonDown.style.backgroundImage = 'url("../assets/down100px.png")'
  buttonDown.style.backgroundSize = 'cover'
  buttonDown.style.width = '150px'
  buttonDown.style.height = '150px'
  buttonDown.style.position = 'absolute'
  buttonDown.style.top = '63%'
  buttonDown.style.left = '6rem'

  const logo = document.createElement('div')
  logo.style.display = 'flex'
  // logo.style.flexDirection = 'column'
  logo.style.alignItems = 'center'
  logo.style.justifyContent = 'center'
  // logo.style.width = '400px'
  logo.style.width = '450px'
  logo.style.height = '120px'
  logo.style.position = 'absolute'
  // logo.style.top = '65%'
  logo.style.top = '67%'
  logo.style.left = '50%'
  logo.style.transform = 'translateX(-50%)'

  logo.style.background = 'transparent'

  const amokMirror = document.createElement('div')
  const amokLogo = document.createElement('div')

  amokLogo.style.border = 'none'
  amokLogo.style.zIndex = '999'
  amokLogo.style.backgroundImage = 'url("../assets/amok logo 550px wide.png")'
  amokLogo.style.backgroundSize = 'contain'
  amokLogo.style.width = '400px'
  amokLogo.style.height = '58px'

  amokMirror.style.border = 'none'
  amokMirror.style.zIndex = '999'
  amokMirror.style.backgroundImage = 'linear-gradient(to bottom, rgba(247, 247, 247, 1) 45%, rgba(247, 247, 247, 0)), url("../assets/amok logo 550px wide.png")'
  amokMirror.style.backgroundSize = 'contain'
  amokMirror.style.width = '400px'
  amokMirror.style.height = '58px'
  amokMirror.style.transform = 'scaleY(-1)'

  const logoA = createElementWithStyles('span', {
    fontFamily: 'PressStart2P',
    fontSize: '2.3rem',
    fontWeight: '700',
    marginBottom: '6.5rem',
    transform: 'scaleY(-1)'

  })
  logoA.textContent = 'A'

  const logoAlt = createElementWithStyles('span', {
    fontFamily: 'PressStart2P',
    fontSize: '2.5rem',
    fontWeight: '700',
    marginBottom: '6rem',

  })
  logoAlt.textContent = 'MOK WORKS'

  const logoRegistered = createElementWithStyles('span', {
    fontFamily: 'PressStart2P',
    fontSize: '1.5rem',
    fontWeight: '700',
    marginBottom: '8rem',

  })
  logoRegistered.textContent = '®'

  buttonUp.addEventListener('touchstart', (e) => {
    e.preventDefault()
    game.onInput('jump')
  })

  buttonDown.addEventListener('touchstart', (e) => {
    e.preventDefault()
    game.onInput('duck')
  })
  buttonDown.addEventListener('touchend', ({ touches }) => {
    game.onInput('stop-duck')
  })

  const wrapper = document.getElementById('wrapper')

  const infoDiv = renderInfo()

  wrapper.appendChild(buttonUp)
  wrapper.appendChild(buttonDown)
  // logo.appendChild(amokLogo)
  // logo.appendChild(amokMirror)
  logo.appendChild(logoA)
  logo.appendChild(logoAlt)
  // logo.appendChild(logoRegistered)
  wrapper.appendChild(logo)
  wrapper.appendChild(infoDiv)

  const muteButton = createElementWithStyles('div', {
    fontFamily: 'PressStart2P',
    width: '80px',
    height: '80px',
    backgroundImage:'url("../assets/mute.png")',
    backgroundSize: 'contain',
    position: 'absolute',
    right: '2rem',
    top: '2rem',
    zIndex: '999999999999999999'
  })

  const unMuteButton = createElementWithStyles('div', {
    fontFamily: 'PressStart2P',
    width: '80px',
    height: '80px',
    backgroundImage:'url("../assets/unmute.png")',
    backgroundSize: 'contain',
    position: 'absolute',
    right: '2rem',
    top: '2rem',
    zIndex: '999999999999999999'
  })

  muteButton.addEventListener('touchstart', (e) => {
    console.log('clicked')
    console.log(game.isMuted)
    e.preventDefault()

      game.mute()
    wrapper.replaceChild(unMuteButton, muteButton)
  })

  unMuteButton.addEventListener('touchstart', (e) => {
    console.log('clicked')
    console.log(game.isMuted)
    e.preventDefault()

      game.unmute()
    wrapper.replaceChild(muteButton, unMuteButton)
  })

  wrapper.appendChild(muteButton)
} else {
  const wrapper = document.getElementById('wrapper')
  renderScores(true)
  const infoDiv = renderInfo(true)
  wrapper.appendChild(infoDiv)

  const muteButton = createElementWithStyles('div', {
    fontFamily: 'PressStart2P',
    width: '40px',
    height: '40px',
    backgroundImage:'url("../assets/mute.png")',
    backgroundSize: 'contain',
    position: 'absolute',
    right: '50%',
    top: '1rem',
    transform: 'translateX(1100%)',
    zIndex: '999999999999999999'
  })

  const unMuteButton = createElementWithStyles('div', {
    fontFamily: 'PressStart2P',
    width: '40px',
    height: '40px',
    backgroundImage:'url("../assets/unmute.png")',
    backgroundSize: 'contain',
    position: 'absolute',
    right: '50%',
    top: '1rem',
    transform: 'translateX(1100%)',
    zIndex: '999999999999999999'
  })

  muteButton.addEventListener('mousedown', (e) => {
    console.log('clicked')
    console.log(game.isMuted)
    e.preventDefault()

      game.mute()
    wrapper.replaceChild(unMuteButton, muteButton)
  })

  unMuteButton.addEventListener('mousedown', (e) => {
    console.log('clicked')
    console.log(game.isMuted)
    e.preventDefault()

      game.unmute()
    wrapper.replaceChild(muteButton, unMuteButton)
  })

  wrapper.appendChild(muteButton)


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

game.start(false, false).catch(console.error)
