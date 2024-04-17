const TMDB_API_KEY = '8cde2d10bf15eb193eda5236cbee0438';
let popularMovies = []; // Armazena os filmes populares para filtragem por gênero

document.addEventListener('DOMContentLoaded', () => {
    getPopularMovies();
});

function getPopularMovies() {
    const url = `https://api.themoviedb.org/3/movie/popular?api_key=${TMDB_API_KEY}&language=pt-BR&page=1`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.results && data.results.length > 0) {
                popularMovies = data.results; // Armazena os filmes populares
                displayMovies(popularMovies);
            } else {
                alert('Nenhum filme popular encontrado!');
            }
        })
        .catch(error => console.error('Erro ao buscar filmes populares:', error));
}

function displayMovies(movies) {
    const moviesDiv = document.getElementById('movies');
    moviesDiv.innerHTML = '';

    movies.forEach(movie => {
        const movieElement = document.createElement('div');
        movieElement.classList.add('movie');
        movieElement.innerHTML = `
            <img src="https://image.tmdb.org/t/p/w200/${movie.poster_path}" alt="${movie.title}">
            <p>${movie.title}</p>
        `;
        movieElement.addEventListener('click', () => openDialog(movie));
        moviesDiv.appendChild(movieElement);
    });
}

function searchMovies() {
    const movieName = document.getElementById('movieNameInput').value.trim();
    
    if (movieName === '') {
        alert('Por favor, digite o nome do filme.');
        return;
    }

    const url = `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(movieName)}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.results && data.results.length > 0) {
                displayMovies(data.results);
            } else {
                alert('Nenhum filme encontrado!');
            }
        })
        .catch(error => console.error('Erro ao buscar dados:', error));
}

function filterByGenre(genreId) {
    let filteredMovies = [];

    if (genreId === 'inicio') {
        filteredMovies = popularMovies.slice(0, 100); // Mostra os primeiros 100 filmes
    } else {
        filteredMovies = popularMovies.filter(movie => movie.genre_ids.includes(genreId)).slice(0, 100); // Mostra os primeiros 100 filmes
    }

    displayMovies(filteredMovies);
}

function openDialog(movie) {
    // Verifica se o objeto movie contém as informações necessárias
    if (movie.id && movie.backdrop_path && movie.poster_path && movie.title) {
        const url = `https://api.themoviedb.org/3/movie/${movie.id}?api_key=${TMDB_API_KEY}&language=pt-BR`;

        fetch(url)
            .then(response => response.json())
            .then(movieDetails => {
                displayMovieInfoDialog(movie, movieDetails);
                displayTrailer(movie.id);
            })
            .catch(error => console.error('Erro ao buscar informações do filme:', error));
    } else {
        console.error('Objeto movie não contém informações necessárias.');
    }
}

function displayMovieInfoDialog(movie, movieDetails) {
    const movieDialogContent = document.getElementById('movieDialogContent');
    movieDialogContent.innerHTML = `
        <span class="close" onclick="closeDialog()">&times;</span>
        <div class="movie-info">
            <div class="movie-info__background" style="background-image: url('https://image.tmdb.org/t/p/original/${movie.backdrop_path}')"></div>
            <img class="movie-info__poster" src="https://image.tmdb.org/t/p/w200/${movie.poster_path}" alt="${movie.title}">
            <h2>${movie.title}</h2>
            <p><strong>Título Original:</strong> ${movieDetails.original_title}</p>
            <p><strong>Ano de Lançamento:</strong> ${movieDetails.release_date ? movieDetails.release_date.substring(0, 4) : 'N/A'}</p>
            <p><strong>Avaliação:</strong> ${movieDetails.vote_average}</p>
            <p><strong>Número de Votos:</strong> ${movieDetails.vote_count}</p>
            <p><strong>Resumo:</strong> ${movieDetails.overview}</p>
            <div id="trailerContainer" class="trailer-container"></div>
            <button id="copyButton" onclick="copyDetailedInformation()">Copiar Informações</button>
        </div>
    `;

    const dialog = document.getElementById('movieInfoDialog');
    dialog.style.display = 'block';
}

function displayTrailer(movieId) {
    const trailerContainer = document.getElementById('trailerContainer');
    trailerContainer.innerHTML = '';

    const url = `https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${TMDB_API_KEY}&language=pt-BR`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.results && data.results.length > 0) {
                const trailerKey = data.results[0].key;
                const trailerUrl = `https://www.youtube.com/embed/${trailerKey}`;

                const trailerFrame = document.createElement('iframe');
                trailerFrame.src = trailerUrl;
                trailerFrame.width = '100%'; // Define a largura do vídeo como 100% do contêiner pai
                trailerFrame.height = 315; // Define a altura do vídeo
                trailerFrame.allowFullscreen = true;

                trailerContainer.appendChild(trailerFrame);
            } else {
                trailerContainer.innerHTML = '<p>Nenhum trailer disponível.</p>';
            }
        })
        .catch(error => console.error('Erro ao buscar trailer:', error));
}

function copyDetailedInformation() {
    const movieInfo = document.getElementById('movieDialogContent').innerHTML;
    const codeToCopy = `<!-- Gerador criado por templateina.org -->

<!--  criado do zero por izaias nelson alberto -->
${movieInfo}`;

    // Copiar para a área de transferência
    navigator.clipboard.writeText(codeToCopy)
        .then(() => alert('As informações foram copiadas com sucesso!'))
        .catch(error => console.error('Erro ao copiar informações:', error));
}

function closeDialog() {
    const dialog = document.getElementById('movieInfoDialog');
    dialog.style.display = 'none';
}
