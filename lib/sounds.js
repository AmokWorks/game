const AudioContext = window.AudioContext || window.webkitAudioContext
const audioContext = new AudioContext()
const soundNames = ['game-over', 'jump', 'level-up']
const soundBuffers = {}
let OST_BUFFER = null
let OST_PLAYING = false
let SOUNDS_LOADED = false
let OST_LOADED = false

loadSounds().catch(console.error)
loadOST().catch(console.error)

export function playSound(name) {
  if (SOUNDS_LOADED) {
    audioContext.resume()
    playBuffer(soundBuffers[name])
  }
}

export function playOST() {
  if (OST_LOADED) {
    audioContext.resume()
    if(!OST_PLAYING){
      playBuffer(OST_BUFFER, true)
      OST_PLAYING = true
    }
  }
}

export function stopOST() {
    stopBuffer(OST_BUFFER)
}


async function loadSounds() {
  await Promise.all(
    soundNames.map(async (soundName) => {
      soundBuffers[soundName] = await loadBuffer(`./assets/${soundName}.mp3`)
    })
  )

  SOUNDS_LOADED = true
}

async function loadOST() {
    OST_BUFFER = await loadBuffer(`./assets/RUNNING AMOK GAME.wav`)

  OST_LOADED = true
}

function loadBuffer(filepath) {
  return new Promise((resolve, reject) => {
    const request = new XMLHttpRequest()

    request.open('GET', filepath)
    request.responseType = 'arraybuffer'
    request.onload = () =>
      audioContext.decodeAudioData(request.response, resolve)
    request.onerror = reject
    request.send()
  })
}

function playBuffer(buffer, looping = false) {
  const source = audioContext.createBufferSource()

  source.buffer = buffer
  source.connect(audioContext.destination)
  if(looping) source.loop = true
  source.start()
}

function stopBuffer(buffer) {
  audioContext.suspend()
}