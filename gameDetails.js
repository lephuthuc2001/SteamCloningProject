const appID = window.localStorage.getItem("appId");
async function getSingleGameDetail(appID) {
  try {
    const url =
      "https://steam-api-dot-cs-platform-306304.et.r.appspot.com/single-game/" +
      appID;
    const response = await fetch(url);
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.log("error" + error);
  }
}

async function renderInfo(appID) {
  const gameDetails = await getSingleGameDetail(appID);

  document.querySelector(".game-name").textContent = gameDetails.name;

  document.querySelector(
    ".body"
  ).style.backgroundImage = `url(${gameDetails.background})`;
  const imgHeaderWrapper = document.querySelector(".img-header-wrapper");
  imgHeaderWrapper.innerHTML = `<img src="${gameDetails.header_image}" alt="header" class="header" />`;

  const gameDescription = document.querySelector(".description");
  gameDescription.textContent = gameDetails.description;
  const table = document.querySelector(".mytable");

  table.innerHTML = `<tr>
  <td>Positive Rating</td>
  <td class="table_cell">${gameDetails.positive_ratings} reviews</td>
</tr>
<tr>
  <td>Average Play Time</td>
  <td class="table_cell">${gameDetails.average_playtime} hours</td>
</tr>
<tr>
  <td>Release Date</td>
  <td class="table_cell date">${dayjs(gameDetails.release_date).format(
    "DD MMMM YYYY"
  )}</td>
</tr>
<tr>
  <td>Developer</td>
  <td class="table_cell">${gameDetails.developer}</td>
</tr>
<tr>
  <td>Publisher</td>
  <td class="table_cell">${gameDetails.developer}</td>
</tr>`;

  const tagsList = gameDetails.steamspy_tags;
  const tagsGroup = document.querySelector(".game-tags");
  console.log(tagsGroup);
  for (let i = 0; i < tagsList.length; i++) {
    if (i === 5) break;
    const tag = document.createElement("div");
    tag.className = "tag";
    tag.textContent = tagsList[i];
    tagsGroup.appendChild(tag);
  }
  const backBtn = document.querySelector(".back");
  backBtn.addEventListener("click", () => {
    window.location.href = "index.html";
  });
}

// review, all review, devloper, publisher
const init = async () => {
  renderInfo(appID);
};

init();
