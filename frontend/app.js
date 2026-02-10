let animals = []
let perPage = 1
let lang = 'en'
let currentPage = 0; // start at first page


const grid = document.getElementById('grid')

// Fetch
function fetchAnimals() {
  fetch(`http://localhost:3001/animals?lang=${lang}`)
    .then(r => r.json())
    .then(data => {
      animals = data
      render()
    })
}

function render() {
  const cardWidth = `calc(100% / ${perPage} - 1rem)`; 

  grid.innerHTML = '';

  const start = currentPage * perPage;
  const end = start + perPage;
  const pageAnimals = animals.slice(start, end);

  pageAnimals.forEach(animal => {
    const card = document.createElement('div');
    card.className = 'card';
    card.style.flex = `0 0 ${cardWidth}`;

    let className = 'name';
    if (lang === 'de') className += ' de';
    if (lang === 'tr') className += ' tr';

    card.innerHTML = `
      <img src="http://localhost:3001${animal.image}" alt="${animal.name}" />
      <div class="${className}">${animal.name}</div>
      <button onclick="new Audio('${animal.sound}').play()">🔊</button>
    `;

    grid.appendChild(card);
  });
}


// PerPage buttons
Array.from(document.querySelectorAll('[data-layout]')).forEach(btn => {
  btn.onclick = () => {
    perPage = Number(btn.dataset.layout)
    render()
  }
})

// Drag-to-scroll (mouse)
let isDown = false, startX, scrollLeft
grid.addEventListener('mousedown', e => {
  isDown = true
  startX = e.pageX - grid.offsetLeft
  scrollLeft = grid.scrollLeft
})
grid.addEventListener('mouseleave', () => isDown = false)
grid.addEventListener('mouseup', () => isDown = false)
grid.addEventListener('mousemove', e => {
  if (!isDown) return
  e.preventDefault()
  const x = e.pageX - grid.offsetLeft
  const walk = (x - startX) * 2
  grid.scrollLeft = scrollLeft - walk
})

// Touch support
let touchStartX = 0, touchScrollLeft = 0
grid.addEventListener('touchstart', e => {
  touchStartX = e.touches[0].pageX
  touchScrollLeft = grid.scrollLeft
})
grid.addEventListener('touchmove', e => {
  const x = e.touches[0].pageX
  const walk = (x - touchStartX) * 2
  grid.scrollLeft = touchScrollLeft - walk
})

grid.addEventListener('wheel', e => {
  if (e.deltaY === 0) return; // ignore horizontal wheel
  e.preventDefault();
  grid.scrollLeft += e.deltaY; // scroll horizontally
});


// Language buttons
Array.from(document.querySelectorAll('[data-lang]')).forEach(btn => {
  btn.onclick = () => {
    lang = btn.dataset.lang
    fetchAnimals()
  }
})

document.getElementById('prev').onclick = () => {
  if (currentPage > 0) {
    currentPage--;
    render();
  }
}

document.getElementById('next').onclick = () => {
  if ((currentPage + 1) * perPage < animals.length) {
    currentPage++;
    render();
  }
}


fetchAnimals()
