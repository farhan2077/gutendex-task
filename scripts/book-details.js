import { baseUrl, fetchData, debug } from "./common.js";

const params = new URLSearchParams(window.location.search);
const bookId = params.get("id");
const url = `${baseUrl}/${bookId}`;

const loader = document.getElementById("loader-wrapper");
const container = document.getElementById("book-details__container");

function createCoverImg(data) {
  const coverImg = document.createElement("img");
  if ("image/jpeg" in data.formats) {
    coverImg.src = data.formats["image/jpeg"];
  } else {
    coverImg.src = "https://placehold.co/200x280/png";
  }
  coverImg.className = "book-details__img fade-in";

  return coverImg;
}

function createTitle(data) {
  const title = document.createElement("h2");
  title.textContent = data.title;
  title.className = "book-details__title";
  return title;
}

function createAuthors(data) {
  const authors = document.createElement("p");
  authors.innerHTML = `${data.authors
    .map(
      (author) => `${author.name} (${author.birth_year} - ${author.death_year})`
    )
    .join(", ")}`;
  authors.className = "book-details__authors";
  return authors;
}

function createLanguage(data) {
  const language = document.createElement("div");
  language.innerHTML = `${data.languages
    .map(
      (lang) =>
        `<img class="book-details__languages-item" src="https://unpkg.com/language-icons/icons/${lang}.svg" />`
    )
    .join(", ")}`;
  language.className = "book-details__languages";
  return language;
}

function createId(data) {
  const id = document.createElement("div");
  id.textContent = `ID: ${data.id}`;
  id.className = "book-details__id";
  return id;
}

function createDownloads(data) {
  const downloads = document.createElement("div");
  downloads.textContent = `${data.download_count} downloads`;
  downloads.className = "book-details__downloads";
  return downloads;
}

function createTopic(data) {
  const topic = document.createElement("div");
  const topics = data.subjects[0].split(" -- ");
  topic.textContent = topics[topics.length - 1];
  topic.className = "book-details__topic";
  return topic;
}

function createDetailsContainer(data) {
  const detailsContainer = document.createElement("div");
  detailsContainer.className = "fade-in";

  const elements = [
    createId(data),
    createTitle(data),
    createTopic(data),
    createAuthors(data),
    createLanguage(data),
    createDownloads(data),
  ];

  elements.forEach((el) => detailsContainer.appendChild(el));

  return detailsContainer;
}

async function main() {
  try {
    if (bookId === null || bookId === "" || bookId === undefined) {
      loader.style.display = "none";
      container.style.display = "block";
      container.textContent = "Book id not valid";
    } else {
      const data = await fetchData(url);

      loader.style.display = "none";
      container.style.display = "flex";

      const elements = [createCoverImg(data), createDetailsContainer(data)];

      for (let i = 0; i < elements.length; i++) {
        container.appendChild(elements[i]);

        await new Promise((resolve) =>
          setTimeout(() => {
            elements[i].classList.add("visible");
            resolve();
          }, 100 * (i + 1))
        );
      }
    }
  } catch (e) {
    debug("error", "Error in main:", e.message);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  main();
});
