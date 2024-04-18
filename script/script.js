// URL API
const API_URL = 'https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=3fd2be6f0c70a2a598f084ddfb75487c&page=1';
const IMG_PATH = 'https://image.tmdb.org/t/p/w1280';
const SEARCH_API = 'https://api.themoviedb.org/3/search/movie?api_key=3fd2be6f0c70a2a598f084ddfb75487c&query="';

// Mengambil element html
const main = document.getElementById('main');
const form = document.getElementById('form');
const search = document.getElementById('search');

// Mengambil data film dari API
getMovies(API_URL)

async function getMovies(url) {
    try {
        const res = await fetch(url);
        const data = await res.json();
    
        showMovies(data.results);
    } catch (err) {
        console.error(err);
    }
}

// Menampilkan data movie dari API
function showMovies(movies) {
    main.innerHTML = '';
    movies.forEach(movie => {
        const { title, poster_path, vote_average} = movie;

        const movieEl = document.createElement('div');
        movieEl.classList.add('movie');

        movieEl.innerHTML = `
        <img src="${IMG_PATH + poster_path}" alt="${title}">
        <div class="movie-info">
            <h3>${title}</h3>
            <span class="${getClassByRate(vote_average)}">${vote_average.toFixed(1)}</span>
        </div>
        `;
        main.appendChild(movieEl);

        movieEl.addEventListener('click', () => showMovieDetails(movie));
    });
}

function showMovieDetails(movie) {
    const { title, poster_path, vote_average, overview } = movie;
    const modal = document.getElementById('movieModal') || createModal();

    modal.style.display = 'block';

    const ratingColor = getColorbyRate(vote_average);

    modal.querySelector('.modal-rating').style.color = ratingColor;

    modal.querySelector('.modal-title').textContent = title;
    modal.querySelector('.modal-img').src = IMG_PATH + poster_path;
    modal.querySelector('.modal-rating').textContent = `${vote_average.toFixed(1)}`;
    modal.querySelector('.modal-overview').textContent = overview;

    window.onclick = function (event) {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    }
}

function createModal() {
    const modal = document.createElement('div');
    modal.setAttribute('id', 'movieModal');
    modal.classList.add('modal');

    modal.innerHTML = `
    <div class="modal-content">
        <span class="close">&times;</span>
        <img class="modal-img" src="" alt="">
        <h2 class="modal-title"></h2>
        <p class="modal-rating"></p>
        <p class="modal-overview"></p>
    </div>
    `;

    document.body.appendChild(modal);

    modal.querySelector('.close').onclick = function () {
       modal.style.display = "none" 
    }

    return modal;
}

// Mengambil data rating lalu merubah warna
function getClassByRate(vote) {
    if (vote >= 8) {
        return 'green';
    } else if (vote > 5) {
        return 'orange';
    } else {
        return 'red';
    }
}

function getColorbyRate(vote) {
    if (vote >= 8) {
        return '#00ce7a';
    } else if (vote > 5) {
        return 'orange';
    } else {
        return 'red';
    }
}

// Element search
search.addEventListener("keyup", function (event) {
    if (event.key === "enter") {
        event.preventDefault();
        form.submit();
    }
})

// Menampilkan halaman search
form.addEventListener('submit', (e) => {
    e.preventDefault();

    const searchTerm = search.value;
    if (searchTerm && searchTerm !== '') {
        getMovies(SEARCH_API + searchTerm);

        search.value = '';
    } else {
        window.location.reload();
    }
})