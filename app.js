const modal = document.querySelector('#modal')
const content = document.querySelector('#content')
const back = document.querySelector('#back')
const progress = document.querySelector('#progress')
const form = document.querySelector('#form')
const APP_TITLE = document.title
const LS_KEY = 'MY_TECHS'

const tech = getState()

content.addEventListener('click', openCard)
back.addEventListener('click', closeCard)
modal.addEventListener('change', toggleTech)
form.addEventListener('submit', createTech)

function openCard(event) {
  const data = event.target.dataset
  //data set - собирает все data атрибуты элемента
  const t = tech.find((el) => el.type === data.type)
  if (!t) return

  openModal(toModal(t), t.title)
}

function toModal(t) {
  const checked = t.done ? 'checked' : ''
  return `      <h2>${t.title}</h2>
  <p>
    ${t.description}
  </p>
  <hr />
  <div>
    <input type="checkbox" id="done" ${checked} data-type="${t.type}"/>
    <label for="done">Выучил</label>
  </div>`
}

function toggleTech(event) {
  const type = event.target.dataset.type
  const t = tech.find((el) => el.type === type)
  t.done = event.target.checked
  saveState()

  init()
}

function openModal(html, title = APP_TITLE) {
  document.title = `${title} | ${APP_TITLE}`
  modal.innerHTML = html
  modal.classList.add('open')
}

function toCard(t) {
  const doneClass = t.done ? 'done' : ''

  // let doneClass = ''
  // if (t.done) {
  //     doneClass = 'done'
  // }

  return `
    <div class="card ${doneClass}" data-type="${t.type}">
        <h3 data-type="${t.type}">${t.title}</h3>
    </div>
            `
}

function closeCard() {
  document.title = APP_TITLE
  modal.classList.remove('open')
}

function renderCards() {
  if (tech.length === 0) {
    content.innerHTML = "<p class='empty'>Ничего нет</p> "
  } else {
    content.innerHTML = tech.map(toCard).join('')

    //     let html = ''
    //     for (let i = 0; i < tech.length; i++) {
    //     const t = tech[i]
    //     html += toCard(t)
    // }

    // content.innerHTML = html
  }
}

function renderProgress() {
  const percent = computeProgressPercent()

  let background

  if (percent <= 30) {
    background = '#e75a5a'
  } else if (percent > 30 && percent < 70) {
    background = '#f99415'
  } else {
    background = '#73ba3c'
  }

  progress.style.background = background
  progress.style.width = percent + '%'
  progress.textContent = percent ? percent + '%' : ''
}

function computeProgressPercent() {
  if (tech.length === 0) {
    return 0
  }

  let doneCount = 0
  for (let i = 0; i < tech.length; i++) {
    if (tech[i].done) doneCount++
  }
  return Math.round((100 * doneCount) / tech.length)
}

function isInvalid(title, description) {
  return !title.value || !description.value
}

function createTech(event) {
  event.preventDefault()

  const { title, description } = event.target
  // const title = event.target.title
  // const description = event.target.description

  if (isInvalid(title, description)) {
    if (!title.value) title.classList.add('invalid')
    if (!description.value) description.classList.add('invalid')

    setTimeout(() => {
      title.classList.remove('invalid')
      description.classList.remove('invalid')
    }, 2000)

    return
  }
  const newTech = {
    title: title.value,
    description: description.value,
    done: false,
    type: title.value.toLowerCase(),
  }

  tech.push(newTech)
  title.value = ''
  description.value = ''
  saveState()
  init()
}

function init() {
  renderCards()
  renderProgress()
}

function saveState() {
  localStorage.setItem(LS_KEY, JSON.stringify(tech))
}

function getState() {
  const raw = localStorage.getItem(LS_KEY)
  return raw ? JSON.parse(raw) : []
}

init()
