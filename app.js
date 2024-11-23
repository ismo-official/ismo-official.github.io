const tracklist = [...Array(10).keys()].map((i) => `./assets/audio/0${i}.mp3`)

const tracks = [
  { title: 'ismot on ismoja', duration: '1:57' },
  { title: 'savonlinnan markkinat', duration: '1:14' },
  { title: 'sillan alla', duration: '1:47' },
  { title: 'vastarannalla', duration: '1:25' },
  { title: 'alkoholisti', duration: '2:08' },
  { title: 'en ole sitä mitä sinä luulet', duration: '1:56' },
  { title: 'elämä', duration: '2:12' },
  { title: 'kännis ku kalakukko', duration: '2:50' },
  { title: 'narkomaanit ja ryssäläiset', duration: '1:19' },
  { title: 'hukutaan paskaan', duration: '2:00' },
]

document.getElementById('tracklist').innerHTML = tracklist
  .map(
    (_, index) =>
      `<div id="track_${index}" class="title" onclick="playTrack(${index})">
        <span>${index < 9 ? `0${index + 1}` : index + 1} ${
        tracks[index].title
      }</span>
        <span>${tracks[index].duration}</span>
      </div>`
  )
  .join(' ')

const player = document.getElementById('player')
const rewind = document.getElementById('rewind')

const ISMOT_ON_ISMOJA = 0
const HUKUTAAN_PASKAAN = 9

player.setAttribute('src', tracklist[ISMOT_ON_ISMOJA])
rewind.setAttribute('src', './assets/audio/rewind.mp3')

rewind.loop = true

let track = ISMOT_ON_ISMOJA
let degree = 0
let interval = null

const stopRolling = () => {
  clearInterval(interval)
}

const setSelectedTrackText = () => {
  document.getElementById(`track_${track}`).classList.add('playing')
}

const activateButton = (id) => {
  for (const knob of ['backward', 'play', 'stop', 'forward']) {
    document.getElementById(knob).classList.remove('active')
  }

  document.getElementById(id).classList.add('active')
}

const rollTape = (rewind) => {
  interval = setInterval(() => {
    degree += 1

    for (const id of ['roll_1', 'roll_2']) {
      document.getElementById(id).style.transform = `rotate(${degree}deg)`
    }

    if (rewind === 'backward') {
      player.currentTime = player.currentTime - 0.5

      if (player.currentTime === 0) {
        if (track === ISMOT_ON_ISMOJA) {
          pause()
        }

        if (track !== ISMOT_ON_ISMOJA) {
          track -= 1
          player.setAttribute('src', tracklist[track])

          player.onloadedmetadata = () => {
            player.currentTime = player.duration

            tracklist.forEach((_track, index) => {
              document
                .getElementById(`track_${index}`)
                .classList.remove('playing')
            })

            setSelectedTrackText()
          }
        }
      }
    }

    if (rewind === 'forward') {
      player.currentTime = player.currentTime + 0.5

      if (player.currentTime === player.duration) {
        if (track === HUKUTAAN_PASKAAN) {
          pause()
        }

        if (track !== HUKUTAAN_PASKAAN) {
          track += 1
          player.setAttribute('src', tracklist[track])

          player.onloadedmetadata = () => {
            tracklist.forEach((_track, index) => {
              document
                .getElementById(`track_${index}`)
                .classList.remove('playing')
            })

            setSelectedTrackText()
          }
        }
      }
    }
  }, 25)
}

const changeImage = (image) => {
  for (const id of ['roll_1', 'roll_2']) {
    document.getElementById(id).src = image
  }
}

const play = () => {
  if (track === HUKUTAAN_PASKAAN && player.currentTime === player.duration)
    return
  if (player.paused) {
    rewind.pause()
    setSelectedTrackText()
    stopRolling()
    rollTape()
    player.play()
    activateButton('play')
    changeImage('./assets/images/cassette_roll.png')
  }
}

const playTrack = (tracknumber) => {
  track = tracknumber
  player.setAttribute('src', tracklist[tracknumber])

  tracklist.forEach((_track, index) => {
    document.getElementById(`track_${index}`).classList.remove('playing')
  })

  player.onloadedmetadata = () => {
    play()
  }
}

const handleRewind = () => {
  player.pause()
  stopRolling()
  rewind.play()
  document.getElementById(`track_${track}`).classList.add('playing')
  changeImage('./assets/images/cassette_roll_rewind.png')
}

const backward = () => {
  if (track === 0 && player.currentTime === 0) return

  if (rewind.paused) {
    handleRewind()
    rollTape('backward')
    activateButton('backward')
  }
}

const pause = () => {
  if (track === ISMOT_ON_ISMOJA && player.currentTime === 0 && rewind.paused)
    return
  rewind.pause()
  player.pause()
  stopRolling()
  activateButton('stop')
  changeImage('./assets/images/cassette_roll.png')
}

const forward = () => {
  if (track === HUKUTAAN_PASKAAN && player.currentTime === player.duration)
    return

  if (rewind.paused) {
    handleRewind()
    rollTape('forward')
    activateButton('forward')
  }
}

player.addEventListener('ended', () => {
  if (rewind.paused) {
    if (track !== HUKUTAAN_PASKAAN) {
      track += 1
      playTrack(track)
    } else {
      pause()
    }
  }
})
