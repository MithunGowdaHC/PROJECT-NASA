const resultsnav = document.getElementById("resultsNav");
const favoritesnav = document.getElementById("favoritesnav");
const imagesContainer = document.querySelector(".images-container");
const saveConfirmed = document.querySelector(".save-confirmed");
const loader = document.querySelector(".loader");

const apiKey = `BSQXA2NQdc5MkItSTmaXx1694N87lpiYB0wfx7XP`;
const count = 10;
const apiUrl = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&count=${count}`;

let resultsArray = [];
let favorites = {};

function showContent() {
  window.scrollTo({ top: 0, behavior: "instant" });
  // if(page === 'results'){
  //   resultsnav.classList.remove('hidden')
  //   favoritesnav.classList.add('hidden');
  // }else
  // {
  //   resultsnav.classList.add('hidden')
  //   favoritesnav.classList.remove('hidden');
  // }else
  
  loader.classList.add('hidden');
}

function createDOMNodes(page) {
  const currentArray =
    page === "results" ? resultsArray : Object.values(favorites);

  currentArray.forEach((result) => {
    const card = document.createElement("div");
    card.classList.add("card");

    const link = document.createElement("a");
    link.href = result.hdurl;
    link.title = "View Full Image";
    link.target = "_blank";

    const image = document.createElement("img");
    const imgResults =
      result.hdurl === undefined
        ? "https://apod.nasa.gov/apod/image/2305/NGC5128_Lorenzi_3000.jpg"
        : result.url;
    image.src = imgResults;
    image.alt = "NASA Picture of the DAY";
    image.loading = "lazy";
    image.classList.add("card-img-top");

    const cardBody = document.createElement("div");
    cardBody.classList.add("card-body");

    const cardTitle = document.createElement("h5");
    cardTitle.classList.add("card-title");
    cardTitle.textContent = result.title;

    const saveText = document.createElement("p");
    saveText.classList.add("clickable");
    if (page === "results") {
      saveText.textContent = "Add To Favorites";
      saveText.setAttribute("onClick", `saveFavorite('${result.url}')`);
    } else {
      saveText.textContent = "Remove from  Favorites";
      saveText.setAttribute("onClick", `removeFavorite('${result.url}')`);
    }

    const cardText = document.createElement("p");
    cardText.textContent = result.explanation;

    const footer = document.createElement("small");
    footer.classList.add("text-muted");

    const date = document.createElement("strong");
    date.textContent = result.date;

    const copyrightResult =
      result.copyright === undefined
        ? "Patrick Ignacio Chumack "
        : result.copyright;
    const copyright = document.createElement("span");
    copyright.textContent = ` ${copyrightResult}`;

    footer.append(date, copyright);
    cardBody.append(cardTitle, saveText, cardText, footer);
    link.append(image);
    card.append(link, cardBody);
    imagesContainer.appendChild(card);
  });
}

function updateDOM(page) {
  if (localStorage.getItem("nasaFavorites")) {
    favorites = JSON.parse(localStorage.getItem("nasaFavorites"));
    // console.log("favorites from localStorage", favorites);
  }
  imagesContainer.textContent = "";
  createDOMNodes(page);
  showContent(page);
}
async function getNasaPictures() {
  loader.classList.remove("hidden");
  try {
    const response = await fetch(apiUrl);
    resultsArray = await response.json();
    // console.log(resultsArray);
    updateDOM("results");
  } catch (error) {}
}

function saveFavorite(itemUrl) {
  resultsArray.forEach((item) => {
    if (item.url.includes(itemUrl) && !favorites[itemUrl]) {
      favorites[itemUrl] = item;
      console.log(JSON.stringify(favorites));
      saveConfirmed.hidden = false;
      setTimeout(() => {
        saveConfirmed.hidden = true;
      }, 2000);

      localStorage.setItem("nasaFavorites", JSON.stringify(favorites));
    }
  });
}

function removeFavorite(itemUrl) {
  if (favorites[itemUrl]) {
    delete favorites[itemUrl];
    localStorage.setItem("nasaFavorites", JSON.stringify(favorites));
    updateDOM("favorites");
  }
}

getNasaPictures();
