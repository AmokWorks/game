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
  await supabase.from('leaderboard').insert([
    {
      username: player,
      score: score.value * (score.coins ? score.coins : 1),
      coins: score.coins,
    },
  ])
}

export async function updateScore(player, score) {
  await supabase
    .from('leaderboard')
    .update({
      score: score.value * (score.coins ? score.coins : 1),
      coins: score.coins,
    })
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

export const renderScores = async (game) => {
  // The background of the modal
  const modal = document.createElement('div')
  modal.classList.add('modal')
  modal.style.position = 'absolute'
  modal.style.background = '#c3c3c3'
  modal.style.opacity = '100%'
  modal.style.borderRadius = '2rem'
  modal.style.display = 'flex'
  modal.style.width = '800px'
  modal.style.height = '400px'
  modal.style.display = 'flex'
  modal.style.flexDirection = 'column'
  modal.style.justifyContent = 'center'
  modal.style.alignItems = 'center'
  modal.style.top = '40%'
  modal.style.border = '2px solid #000'
  modal.style.zIndex = '999'

  // The contents
  const wrapper = document.createElement('div')
  wrapper.style.position = 'absolute'
  wrapper.style.top = '5rem'
  wrapper.style.width = '80%'
  wrapper.style.height = 'auto'
  wrapper.style.display = 'flex'
  wrapper.style.flexDirection = 'column'
  wrapper.style.fontFamily = 'PressStart2P'
  wrapper.style.fontSize = '1.5rem'
  wrapper.style.alignItems = 'center'

  const exit = document.createElement('div')
  exit.style.background = 'red'
  exit.style.border = '1px solid black'
  exit.style.borderRadius = '50%'
  exit.style.width = '2rem'
  exit.style.height = '2rem'
  exit.textContent = 'x'
  exit.style.position = 'absolute'
  exit.style.top = '1rem'
  exit.style.right = '1rem'
  exit.style.display = 'flex'
  exit.style.alignItems = 'center'
  exit.style.justifyContent = 'center'
  exit.style.paddingLeft = '0.2rem'
  exit.style.fontSize = '1.5rem'
  exit.style.fontFamily = 'PressStart2P'

  exit.onclick = () => game.resetGame()

  modal.appendChild(exit)

  const { value, coins } = game.state.score
  const scoreLine = document.createElement('p')
  scoreLine.textContent = `Your Score: ${value}`
  scoreLine.style.marginBottom = '1rem'

  wrapper.appendChild(scoreLine)

  const coinsLine = document.createElement('p')
  coinsLine.textContent = `Coins Collected: ${coins}`
  coinsLine.style.marginBottom = '1rem'

  wrapper.appendChild(coinsLine)

  const divider = document.createElement('p')
  divider.style.borderBottom = '1px dashed #000'
  divider.style.height = '2px'
  divider.style.width = '100%'
  divider.style.marginBottom = '1rem'

  wrapper.appendChild(divider)

  const totalLine = document.createElement('p')
  totalLine.textContent = `Total Score: ${(coins ? coins : 1) * value}`
  totalLine.style.fontWeight = '600'
  totalLine.style.marginBottom = '1rem'

  wrapper.appendChild(totalLine)

  const scores = await getScores()
  // Render form for username
  const form = renderNameForm(game, scores)
  wrapper.appendChild(form)
  modal.appendChild(wrapper)
  let body = document.getElementById('scores')
  body.appendChild(modal)
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
  if (!nameInput?.value) game.resetGame()
  const usernameExists = scores.find((row) => row.username === nameInput.value)

  if (usernameExists) {
    console.log(
      usernameExists.score <
        game.state.score.value *
          (game.state.score.coins ? game.state.score.coins : 1),
      usernameExists.score,
      game.state.score.value *
        (game.state.score.coins ? game.state.score.coins : 1)
    )
    if (
      usernameExists.score <
      game.state.score.value *
        (game.state.score.coins ? game.state.score.coins : 1)
    ) {
      updateScore(nameInput.value, game.state.score)
    }
  } else {
    addScore(nameInput.value, game.state.score)
  }
  game.resetGame()
}

export const createElementWithStyles = (elementType, styles = {}) => {
  const el = document.createElement(elementType)
  Object.keys(styles).forEach((styleName) => {
    el.style[styleName] = styles[styleName]
  })
  return el
}
