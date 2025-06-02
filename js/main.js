const btnSearch = document.querySelector("#search-btn");

const searchPelicula = () => {
    const peliculaName = document.querySelector("#pelicula-input").value.trim();
    if (!peliculaName) {
        document.querySelector("#pelicula-info").innerHTML = `<p>Por favor ingresa un nombre de película</p>`;
        return;
    }

    const url = `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(peliculaName)}&include_adult=false&language=es-MX&page=1`;
    
    fetch(url, {
        method: "GET",
        headers: {
            "accept": "application/json",
            "Authorization": "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI4NGM1OTY5ZjM3Y2RiNGFiYTdhNGI5M2EzNmM1ODA2YyIsIm5iZiI6MTc0ODY0NTg2Ny42MTIsInN1YiI6IjY4M2EzN2ViYzhmYTQwYjI4MWYyYThlNiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.WD0LeJcmYtZMm4MzHrNBsMyIL3l5RCAKVAxnBfT7Mpw"
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("Error al buscar la película");
        }
        return response.json();
    })
    .then(data => {
        if (data.results.length === 0) {
            throw new Error("No se encontraron resultados");
        }
        showPelicula(data.results[0]);
    })
    .catch(error => {
        document.querySelector("#pelicula-info").innerHTML = `<p>${error.message}</p>`;
        document.querySelector("#movie-banner").style.backgroundImage = 'none';
    });
};

const baseImageUrl = "https://image.tmdb.org/t/p/original";

function showPelicula(pelicula) {
    const peliculaInfo = document.querySelector("#pelicula-info");
    const bannerElement = document.querySelector("#movie-banner");
    const posterUrl = pelicula.poster_path ? `${baseImageUrl}${pelicula.poster_path}` : 'https://via.placeholder.com/300x450?text=No+Poster';
    const bannerUrl = pelicula.backdrop_path ? `${baseImageUrl}${pelicula.backdrop_path}` : posterUrl;
    
    bannerElement.style.backgroundImage = `url(${posterUrl})`;
    
    peliculaInfo.innerHTML = `
        <h2 id="title-movie">${pelicula.title.toUpperCase()}</h2>
        <p class=info-movie><strong class="sub-movie">Título original: </strong> ${pelicula.original_title} </p>
        <p class=info-movie><strong class="sub-movie">Año: </strong> ${pelicula.release_date ? pelicula.release_date.split("-")[0] : 'Desconocido'} </p>
        <p class=info-movie><strong class="sub-movie">Popularidad: </strong> ${pelicula.popularity} </p>
        <p class=info-movie><strong class="sub-movie">Calificación: </strong> ${pelicula.vote_average}/10 </p>
        <p id="sinopsis" class=info-movie><strong class="sub-movie">Sinopsis: </strong> ${pelicula.overview || 'No disponible'}</p>
        <p id="box-banner"> <img id="banner" src="${bannerUrl}" alt="Póster de ${pelicula.title}"> </p>
        <img id="poster" src="${posterUrl}" alt="Póster de ${pelicula.title}">
    `;
}


btnSearch.addEventListener("click", searchPelicula);