let animals = []
let perPage = 1
let lang = 'en' // default lang


function fetchAnimals() {
  fetch(`http://localhost:3001/animals?lang=${lang}`)
    .then(r => r.json())
    .then(data => {
      animals = data
      render()
    })
}

function render() {
  const grid = document.getElementById('grid')
  grid.style.gridTemplateColumns = `repeat(${perPage}, 1fr)`
  grid.innerHTML = ''

  animals.slice(0, perPage).forEach(animal => {
    const card = document.createElement('div')
    card.className = 'card'

    let styleName = ''
    if (lang === 'de') styleName = 'color: red; font-weight: bold;'
    if (lang === 'tr') styleName = 'font-style: italic; font-family: cursive;'

    card.innerHTML = `
      <img src="http://localhost:3001${animal.image}" alt="${animal.name}" />
      <div class="name" style="${styleName}">${animal.name}</div>
      <button onclick="new Audio('${animal.sound}').play()">🔊</button>
    `

    grid.appendChild(card)
  })
}

Array.from(document.querySelectorAll('[data-layout]')).forEach(btn => {
  btn.onclick = () => {
    perPage = Number(btn.dataset.layout)
    render()
  }
})

Array.from(document.querySelectorAll('[data-lang]')).forEach(btn => {
  btn.onclick = () => {
    lang = btn.dataset.lang
    fetchAnimals()
  }
})

fetchAnimals()