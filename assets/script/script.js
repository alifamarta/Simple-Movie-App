// URL API
const API_URL = 'https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=3e5b8523dd4a0a2b29e901b0c83d7cc5&page=1';
const IMG_PATH = 'https://image.tmdb.org/t/p/w1280';
const SEARCH_API = 'https://api.themoviedb.org/3/search/movie?api_key=3e5b8523dd4a0a2b29e901b0c83d7cc5&query="';

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
        const { title, poster_path, vote_average } = movie;

        let movieEl = document.createElement('div');
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
    // membuat URL untuk halaman detail
    const url = `assets/pages/detail.html?id=${movie.id}`;

    // membuka halaman detail
    const newWindow = window.open(url, '_blank');

    newWindow.onload = function () {
        const urlParams = new URLSearchParams(newWindow.location.search);

        fetch(`https://api.themoviedb.org/3/movie/${movie.id}?api_key=3e5b8523dd4a0a2b29e901b0c83d7cc5&language=en-US`)
            .then(res => res.json())
            .then(data => {
                const movie = data;

                // movie page
                newWindow.document.querySelector('.movie-img').src = IMG_PATH + movie.poster_path;
                newWindow.document.querySelector('.movie-title').textContent = movie.title;
                newWindow.document.querySelector('.text-rating').textContent = movie.vote_average.toFixed(1);
                newWindow.document.querySelector('.movie-overview').textContent = movie.overview;
            })
    }
}

// Mengambil data rating lalu merubah warna
function getClassByRate(vote) {
    if (vote >= 7) {
        return 'green';
    } else if (vote > 5) {
        return 'orange';
    } else {
        return 'red';
    }
}

function getColorbyRate(vote) {
    if (vote >= 7) {
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