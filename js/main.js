const btnSearch = document.querySelector("#search-btn");
const resultado = document.querySelector('#resultado');
const loader = document.querySelector('#loader');

document.getElementById("pelicula-input").addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        document.getElementById("search-btn").click();
    }
})

const searchPelicula = () => {
    const peliculaName = document.querySelector("#pelicula-input").value.trim();
    if (!peliculaName) {
        document.querySelector("#pelicula-info").innerHTML = `<p id="Error-ingresa">Por favor ingresa un nombre de película</p>`;
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
        document.querySelector("#pelicula-info").innerHTML = `<p id="mensaje-error">${error.message}</p>`;
    });
};

const baseImageUrl = "https://image.tmdb.org/t/p/original";

function showPelicula(pelicula) {

    resultado.classList.remove('hidden');
    loader.classList.remove('hidden');
    resultado.innerHTML = '';

    setTimeout(() => {
        loader.classList.add('hidden');

        const peliculaInfo = document.querySelector("#pelicula-info");
        const banner = document.querySelector("#movie-banner");
        const poster = document.querySelector("#movie-poster");

        const posterUrl = pelicula.poster_path 
            ? `${baseImageUrl}${pelicula.poster_path}` 
            : 'https://via.placeholder.com/300x450?text=No+Poster';
        
        const bannerUrl = pelicula.backdrop_path 
            ? `${baseImageUrl}${pelicula.backdrop_path}` 
            : posterUrl;

        
        poster.style.backgroundImage = `url(${posterUrl})`;
        
        banner.style.backgroundImage = `url(${bannerUrl})`;
        
        document.querySelector(".banner").style.backgroundImage = `linear-gradient(to right, rgba(0, 0, 0, 1) 30%, rgba(0, 0, 0, 0.1) 150%),url(${bannerUrl})`;

        

        peliculaInfo.innerHTML = `
            <h2 id="title-movie">${pelicula.title.toUpperCase()}</h2>
            <main id="box-complet"> <div id="box-informacion">
            <p class="info-movie"><span class="sub-movie">Título original: </span> ${pelicula.original_title}</p>
            <p class="info-movie"><span class="sub-movie">Año: </span> ${pelicula.release_date ? pelicula.release_date.split("-")[0] : 'Desconocido'}</p>
            <p class="info-movie"><span class="sub-movie">Popularidad: </span> ${pelicula.popularity}</p>
            <p class="info-movie"><span class="sub-movie">Calificación: </span> ${pelicula.vote_average}/10</p>
            <p class="info-movie"><span class="sub-movie">Genero: </span> ${pelicula.gen}/10</p>
            <p id="sinopsis" class="info-movie"><span class="sub-movie">Sinopsis: </span> ${pelicula.overview || 'No disponible'}</p> </div>
            <div id="box-banner"> <img id="banner" src="${bannerUrl}" alt="Banner de ${pelicula.title}"> </div>
            <div id="box-poster"> <img id="poster" src="${posterUrl}" alt="Poster de ${pelicula.title}"> </div> </main> 
        `;
    }, 1500);
}
btnSearch.addEventListener("click", searchPelicula);