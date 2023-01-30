import { SUPABASE_PROJECT_URL, SUPABASE_API_KEY } from './secrets.js'
const supabase = window.supabase.createClient(
  SUPABASE_PROJECT_URL,
  SUPABASE_API_KEY
)

export function getImageData(image) {
  const { width, height } = image
  const tmpCanvas = document.createElement('canvas')
  const ctx = tmpCanvas.getContext('2d')
  let result

  tmpCanvas.width = width
  tmpCanvas.height = height
  ctx.drawImage(image, 0, 0)

  result = ctx.getImageData(0, 0, width, height)
  tmpCanvas.remove()
  return result
}

export async function loadImage(url) {
  return new Promise((resolve, reject) => {
    const image = new Image()

    image.onload = () => resolve(image)
    image.onerror = reject
    image.src = url
  })
}

function getFontName(url) {
  const ext = url.slice(url.lastIndexOf('.'))
  const pathParts = url.split('/')

  return pathParts[pathParts.length - 1].slice(0, -1 * ext.length)
}

export async function loadFont(url, fontName) {
  if (!fontName) fontName = getFontName(url)
  const styleEl = document.createElement('style')

  styleEl.innerHTML = `
    @font-face {
      font-family: ${fontName};
      src: url(${url});
    }
  `
  document.head.appendChild(styleEl)
  await document.fonts.load(`12px ${fontName}`)
}

export function randInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export function randBoolean() {
  return Boolean(randInteger(0, 1))
}

export function randItem(arr) {
  return arr[randInteger(0, arr.length - 1)]
}

export async function addScore(player, score) {
  await supabase
    .from('leaderboard')
    .insert([{ username: player, score: score.value, coins: score.coins }])
}

export async function updateScore(player, score) {
  await supabase
    .from('leaderboard')
    .update({ score: score.value, coins: score.coins })
    .eq('username', player)
}

export async function getScores() {
  return await supabase
    .from('leaderboard')
    .select('*')
    .then((data) => {
      const scores = data.data

      return scores
    })
}

export const hideControls = () => {
  const buttons = document.getElementById('wrapper')
  buttons.style.zIndex = '-1'
}

export const showControls = () => {
  const buttons = document.getElementById('wrapper')
  buttons.style.zIndex = '1'
}

export const renderScores = async (game) => {
  // The background of the modal
  const modal = document.createElement('div')
  modal.classList.add('modal')
  modal.style.position = 'absolute'
  modal.style.background = '#c3c3c3'
  modal.style.opacity = '70%'
  modal.style.display = 'flex'
  modal.style.width = '100vw'
  modal.style.height = '100vh'
  modal.style.display = 'flex'
  modal.style.flexDirection = 'column'
  modal.style.justifyContent = 'center'
  modal.style.alignItems = 'center'

  // The contents
  const wrapper = document.createElement('div')
  wrapper.style.position = 'absolute'
  wrapper.style.top = '10rem'
  wrapper.style.width = '80%'
  wrapper.style.height = 'auto'
  wrapper.style.display = 'flex'
  wrapper.style.flexDirection = 'column'

  // The rendering of the scores
  const { wrapper: leaderboard, currScores: scores } = await showTopScores()
  wrapper.appendChild(leaderboard)

  // Render form for username
  const form = renderNameForm(game, scores)
  wrapper.appendChild(form)

  modal.appendChild(wrapper)
  let body = document.getElementById('scores')
  body.appendChild(modal)
}

const showTopScores = async () => {
  const wrapper = document.createElement('div')
  wrapper.style.fontFamily = 'PressStart2P'
  wrapper.style.display = 'flex'
  wrapper.style.flexDirection = 'column'
  wrapper.style.alignItems = 'center'
  wrapper.style.height = '100%'
  wrapper.style.width = '100%'

  const title = document.createElement('p')
  title.style.fontSize = '3rem'
  // title.style.fontFamily = 'PressStart2P'
  title.innerText = 'LEADERBOARD'

  // Render the actual scores
  const table = document.createElement('table')
  table.style.width = '100%'
  table.style.fontSize = '1rem'
  table.style.marginTop = '1rem'
  const titleRow = document.createElement('tr')

  const userTitle = document.createElement('td')
  userTitle.align = 'center'
  userTitle.innerHTML = 'Username'

  const scoresTitle = document.createElement('td')
  scoresTitle.innerHTML = 'Score'

  titleRow.appendChild(userTitle)
  titleRow.appendChild(scoresTitle)

  // table.appendChild(titleRow)

  const currScores = await getScores()
  currScores.sort((f, s) => s.score - f.score)

  const topTen = currScores.slice(0, 10)
  topTen.forEach((currScore, idx) => {
    const row = document.createElement('tr')
    row.style.height = '2rem'

    const pos = document.createElement('td')
    pos.innerHTML = `${idx + 1}.`
    pos.style.width = '4rem'
    const user = document.createElement('td')
    user.innerHTML = currScore.username

    const score = document.createElement('td')
    score.innerHTML = currScore.score

    row.appendChild(pos)
    row.appendChild(user)
    row.appendChild(score)

    table.appendChild(row)
  })

  wrapper.appendChild(title)
  wrapper.appendChild(table)

  return { wrapper, currScores }
}

const renderNameForm = (game, scores) => {
  const wrapper = document.createElement('div')
  wrapper.style.display = 'flex'
  wrapper.style.height = '10rem'
  wrapper.style.alignItems = 'center'
  wrapper.style.marginLeft = '2rem'

  const label = document.createElement('span')
  label.innerHTML = 'Your Name:'
  label.style.fontSize = '1.5rem'
  label.style.fontFamily = 'PressStart2P'

  const input = document.createElement('input')
  input.classList.add('username')
  input.style.height = '2rem'
  input.style.fontSize = '1.6rem'

  const submit = document.createElement('button')
  submit.style.width = '6rem'
  submit.style.height = '2rem'
  submit.style.marginLeft = '1rem'
  submit.style.background = 'inherit'
  submit.style.fontFamily = 'PressStart2P'
  submit.style.color = 'black'
  submit.textContent = 'Submit'
  submit.onclick = () => sendScore(game, scores)

  wrapper.appendChild(label)
  wrapper.appendChild(input)
  wrapper.appendChild(submit)

  return wrapper
}

const sendScore = (game, scores) => {
  const nameInput = document.getElementsByClassName('username')?.[0]
  if (!nameInput?.value) return
  const usernameExists = scores.find((row) => row.username === nameInput.value)

  if (usernameExists) {
    updateScore(nameInput.value, game.state.score)
  } else {
    addScore(nameInput.value, game.state.score)
  }
  game.resetGame()
}

export const renderTutorial = (game) => {
  const wrapper = createElementWithStyles('div', {
    position: 'absolute',
    display: 'flex',
    width: '100vw',
    height: '100vh',
    background: 'rgba(200,200,200,0.4)',
    zIndex: '9999',
    alignItems: 'center',
    justifyContent: 'space-around',
    fontFamily: 'PressStart2P',
  })
  wrapper.classList.add('tutorial')

  const styles = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '10rem',
    height: '25rem',
    backgroundRepeat: 'no-repeat',
    backgroundSize: '10rem',
    backgroundImage: "url('../assets/hand-left.png')",
    filter: 'grayscale(100%)',
  }
  const left = createElementWithStyles('div', {
    ...styles,
  })

  const jump = createElementWithStyles('p', {
    fontSize: '2rem',
    opacity: '0.7',
  })
  const text = document.createTextNode('JUMP')
  jump.appendChild(text)
  left.appendChild(jump)

  const right = createElementWithStyles('div', styles)
  const duck = createElementWithStyles('p', {
    fontSize: '2rem',
    opacity: '0.7',
  })
  const textDuck = document.createTextNode('DUCK')
  duck.appendChild(textDuck)
  right.appendChild(duck)

  const border = createElementWithStyles('div', {
    height: '100vh',
    width: '3px',
    backgroundColor: '#a1a1a1',
  })
  wrapper.appendChild(left)
  wrapper.appendChild(border)
  wrapper.appendChild(right)

  wrapper.onclick = () => {
    const tut = document.getElementsByClassName('tutorial')
    while (tut.length > 0) {
      tut[0].parentNode.removeChild(tut[0])
    }
    game.onInput('jump')
  }

  const body = document.getElementById('scores')
  body.appendChild(wrapper)
}

const createElementWithStyles = (elementType, styles = {}) => {
  const el = document.createElement(elementType)
  Object.keys(styles).forEach((styleName) => {
    el.style[styleName] = styles[styleName]
  })
  return el
}
