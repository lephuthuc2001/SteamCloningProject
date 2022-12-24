// data: name, background, price
const URL = {
  allGame: "https://steam-api-dot-cs-platform-306304.et.r.appspot.com/games?",
  genresList:
    "https://steam-api-dot-cs-platform-306304.et.r.appspot.com/genres",
  tagList:
    "https://steam-api-dot-cs-platform-306304.et.r.appspot.com/steamspy-tags",
  singleGameDetail:
    "https://steam-api-dot-cs-platform-306304.et.r.appspot.com/single-game/",
  featuredGames:
    "https://steam-api-dot-cs-platform-306304.et.r.appspot.com/features",
};

// -------------------- BEST GAMES HANDLING ----------------------------------
const bestGamesList = document.querySelector(".best-games.list");
const result = document.querySelector(".games-per-genre.list");
let bestGames = [];
function addGame(numberOfGames, data, gameList) {
  for (let i = 0; i < numberOfGames; i++) {
    const gameName = data[i].name;
    const gamePrice = data[i].price;
    const gameBackground = data[i].header_image;
    const gameID = data[i].appid;
    const game = document.createElement("div");
    game.className = "game";

    game.innerHTML = `<div class="wrapper">
    <div class="game-photo">
      <img src=${gameBackground} alt="" class="background" id=${gameID} />
    </div>
    <div class="info">
      <div class="name">${gameName}</div>
      <div class="price">${gamePrice}$</div>
    </div>
  </div>`;
    if (gameName.length >= 18)
      game.querySelector(".name").style.fontSize = "1.1rem";
    if (gameName.length >= 28)
      game.querySelector(".name").style.fontSize = "1rem";
    if (gameName.length >= 31)
      game.querySelector(".name").style.fontSize = "0.92rem";

    if (gamePrice === 0) game.querySelector(".price").textContent = "Free";
    gameList.appendChild(game);
    const img = game.querySelector(".background");
    img.addEventListener("click", function () {
      window.localStorage.setItem("appId", img.id);
      window.location.href = "gameDetails.html";
    });
  }
}

async function getBestGames() {
  try {
    const repsonse = await fetch(URL.featuredGames);
    const data = await repsonse.json();
    return data.data;
  } catch (error) {
    console.log("error" + error);
  }
}

const clear = (e) => {
  while (e.firstElementChild) {
    e.removeChild(e.firstElementChild);
  }
};

const initialize = async () => {
  bestGames = await getBestGames();
  await initGenresList();
  clear(bestGamesList);
  await addGame(5, bestGames, bestGamesList);
  document.querySelector(".cate-list").firstElementChild.click();
};

const next = () => {
  const lastGame = bestGames.find(
    (game) =>
      game.name ===
      bestGamesList.lastElementChild.querySelector(".wrapper .info .name")
        .textContent
  );
  const firstGame = bestGames.find(
    (game) =>
      game.name ===
      bestGamesList.firstElementChild.querySelector(".wrapper .info .name")
        .textContent
  );
  let indexOfLastGame = bestGames.indexOf(lastGame);
  let indexOfFirstGame = bestGames.indexOf(firstGame);

  if (indexOfLastGame + 2 >= 11) {
    bestGames.push(bestGames.shift());
    indexOfLastGame--;
    indexOfFirstGame--;
  }

  const displayGames = bestGames.slice(
    indexOfFirstGame + 1,
    indexOfLastGame + 2
  );

  clear(bestGamesList);

  addGame(5, displayGames, bestGamesList);
};

const back = () => {
  bestGames.unshift(bestGames.pop());
  clear(bestGamesList);
  addGame(5, bestGames, bestGamesList);
};

const btnNext = document.querySelector(".next");
btnNext.addEventListener("click", () => {
  next();
});

const btnBack = document.querySelector(".back");
btnBack.addEventListener("click", () => {
  back();
});

// -------------------- BEST GAMES HANDLING ----------------------------------
async function getGenresList() {
  try {
    const response = await fetch(URL.genresList + "?limit=290");
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.log("error" + error);
  }
}

const comparer = (a, b) => {
  if (a.count < b.count) return 1;
  if (a.count > b.count) return -1;
  return 0;
};

async function initGenresList() {
  const genresList = await getGenresList().then((list) => list.sort(comparer));
  const cateLists = document.querySelector(".cate-list");
  for (let i = 0; i < 12; i++) {
    const newCate = document.createElement("button");
    newCate.className = "cate";
    cateLists.appendChild(newCate);
    newCate.textContent = `${genresList[i].name.toUpperCase()}`;
    newCate.addEventListener("click", () => {
      renderGamesPerGenre(genresList[i].name);
    });
  }
  const genreBtns = cateLists.querySelectorAll(".cate");

  for (let i = 0; i < genreBtns.length; i++) {
    genreBtns[i].addEventListener("click", () => {
      const currentActiveBtn = document
        .querySelector(".cate-list")
        .querySelector(".active");

      if (currentActiveBtn) currentActiveBtn.classList.remove("active");
      genreBtns[i].classList.add("active");
    });
  }
}

async function getGamesPerGenre(genre) {
  try {
    const url =
      URL.allGame +
      new URLSearchParams({ genres: genre, limit: 15 }).toString();
    console.log(url);
    const response = await fetch(url);
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.log("error" + error);
  }
}

async function renderGamesPerGenre(genre) {
  const gamesPerGenre = await getGamesPerGenre(genre);
  if (gamesPerGenre.length === 0) return;
  clear(document.querySelector(".games-per-genre.list"));
  addGame(15, gamesPerGenre, document.querySelector(".games-per-genre.list"));
  document.querySelector(
    ".games-per-genre.title"
  ).textContent = `${genre.toUpperCase()} Games`;
}

initialize();
document.getElementsByClassName;
/// ------------------- search ---------------------

async function getGamesByQuery(query) {
  try {
    const url =
      URL.allGame +
      new URLSearchParams({
        q: query,
        limit: 15,
      }).toString();
    const response = await fetch(url);
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.log("error" + error);
  }
}

async function getGamesByTag(tag) {
  try {
    const url =
      URL.allGame +
      new URLSearchParams({
        steamspy_tags: tag,
        limit: 15,
      }).toString();
    const response = await fetch(url);
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.log("error" + error);
  }
}

async function renderGamesBySearch(query) {
  const gamesByQuery = await getGamesByQuery(query);
  const gamesByTags = await getGamesByTag(query);
  const gamesBySearch = [...gamesByQuery, ...gamesByTags];
  if (gamesBySearch.length === 0) return;
  clear(document.querySelector(".games-per-genre.list"));
  addGame(
    gamesBySearch.length,
    gamesBySearch,
    document.querySelector(".games-per-genre.list")
  );
  document.querySelector(
    ".games-per-genre.title"
  ).textContent = `Results for ${query.toUpperCase()} `;
  query = "";
  const currentActiveBtn = document
    .querySelector(".cate-list")
    .querySelector(".active");

  if (currentActiveBtn) currentActiveBtn.classList.remove("active");
}

const searchInput = document.querySelector(".search-input");
const searchBtn = document.querySelector(".search");
let query = "";
searchInput.addEventListener("input", () => {
  query = searchInput.value;
});
searchBtn.addEventListener("click", () => {
  renderGamesBySearch(query);
});

///////// render new page + back()/////////
