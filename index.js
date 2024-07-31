const MAX_POKEMON = 151;
const listWrapper = document.querySelector(".list-wrapper");
const searchInput = document.querySelector(".search-input");
const numberFilter = document.querySelector("#number");
const nameFilter = document.querySelector("#name");
const notFOundMessage = document.querySelector("#not-found-message");


let allPokemons = [];

fetch(`https://pokeapi.co/api/v2/pokemon?limit=${MAX_POKEMON}`)
.then((response) => response.json())
.then((data) => {
    allPokemons = data.results;
    displayPokemons(allPokemons);
});

async function fetchPokemnonData(id) {
    try{
        const [pokemon, pokemonSpecies] = await Promise.all([
            fetch(`https://pokeapi.co/api/v2/pokemon/${id}`).
            then((res) => res.json()),
            fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`).
            then((res) => res.json()),
        ]);
        return true;
    }
    catch(error){
        console.error("Failed to fetch Pokemon Data");
    }
}

function displayPokemons(pokemon){
    listWrapper.innerHTML = "";

    pokemon.forEach((pokemon) => {
      const pokemonID = pokemon.url.split("/")[6];
      const listItem = document.createElement("div");
      listItem.className = "list-item";
      listItem.innerHTML = `
        <div class="number-wrap">
            <p class="caption-fonts">#${pokemonID}</p>
        </div>
        <div class="img-wrap">
            <img src="https://raw.githubusercontent.com/pokeapi/sprites/master/sprites/pokemon/other/dream-world/${pokemonID}.svg" alt="${pokemon.name}">
        </div>
        <div class="name-wrap">
            <p class="body3-fonts">#${pokemon.name}</p>
        </div>
      `;

      listItem.addEventListener("click", async () => {
        const success = await fetchPokemnonData(pokemonID);
        if(success){
            window.location.href = `./detail.html?id=${pokemonID}`;
        }
      });

      listWrapper.appendChild(listItem);
    });
}

searchInput.addEventListener("keyup", handleSearch);

function handleSearch() {
    const searchTerm = searchInput.value.toLowerCase();
    let filterPokemons;

    if(numberFilter.checked){
        filterPokemons = allPokemons.filter((pokemon) => {
            const pokemonId = pokemon.url.split("/")[6];
            return pokemonId.startsWith(searchTerm);
        });
    }

    else if(nameFilter.checked){
        filterPokemons = allPokemons.filter((pokemon) => 
            pokemon.name.toLowerCase().startsWith(searchTerm)
        );
    }

    else{
        filterPokemons = allPokemons;
    }

    displayPokemons(filterPokemons);

    if(filterPokemons.length === 0){
        notFOundMessage.style.display = "block";
    }

    else{
        notFOundMessage.style.display = "none";
    }
}

const closeButton = document.querySelector(".search-close-icon");

closeButton.addEventListener("click", clearSearch);

function clearSearch() {
    searchInput.value = "";
    displayPokemons(allPokemons);
    notFOundMessage.style.display = "none";
}