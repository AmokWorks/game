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

export async function renderControls(game) {
  console.log('game:', game.state.dino)
}

export async function addScore(player, score) {
  await supabase
    .from('leaderboard')
    .insert([{ username: player, score: score.value, coins: score.coins }])
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

export const renderScores = () => {
  // const scores = document.createElement('div')
  // scores.style.width = '100vw'
  // scores.style.height = '100vh'
  // scores.style.background = 'red'
  // let body = document.getElementById('scores')
  // const currScores = await getScores()
  // currScores.sort((f, s) => s.score - f.score)
  // console.log(currScores)
  // for (const currScore of currScores) {
  //   const row = document.createElement('p')
  //   row.innerHTML = `${currScore.username} - ${currScore.score}`
  //   scores.appendChild(row)
  // }
  // body.appendChild(scores)
}
