const params = new URLSearchParams(window.location.search);
const bookId = params.get("id");

console.log({ bookId });

const loader = document.getElementById("loader-wrapper");
const container = document.getElementById("book-details__container");

async function fetchData(bookId) {
  let url = `https://gutendex.com/books/${bookId}`;
  console.log(`fetching data from ${url}`);

  try {
    const response = await fetch(url);
    if (!response.ok) {
      loader.style.display = "none";
      container.style.display = "block";
      container.textContent = response.detail;

      throw new Error(`Response status: ${response.status}`);
    }

    const data = await response.json();

    return data;
  } catch (error) {
    console.error("Error in fetchData:", error.message);
  }
}

async function main() {
  try {
    if (bookId === null || bookId === "" || bookId === undefined) {
      loader.style.display = "none";
      container.style.display = "block";
      container.textContent = "Book id not valid";
    } else {
      const data = await fetchData(bookId);

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
    console.error("Error in main:", e.message);
  }
}

function createCoverImg(data) {
  const coverImg = document.createElement("img");
  coverImg.src = data.formats["image/jpeg"];
  coverImg.className = "book-details__img fade-in";

  return coverImg;
}

function createDetailsContainer(data) {
  const detailsContainer = document.createElement("div");
  detailsContainer.className = "fade-in";

  const elements = [
    createId(data),
    createTitle(data),
    createAuthors(data),
    createLanguage(data),
    createDownloads(data),
  ];

  elements.forEach((el) => detailsContainer.appendChild(el));

  return detailsContainer;
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
      (author) => `${author.name} (${author.birth_year} ${author.death_year})`
    )
    .join(", ")}`;
  authors.className = "book-details__authors";
  return authors;
}

function createLanguage(data) {
  const language = document.createElement("div");
  language.innerHTML = `Available in ${data.languages
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
  downloads.textContent = `Downloaded ${data.download_count} times`;
  downloads.className = "book-details__downloads";
  return downloads;
}

document.addEventListener("DOMContentLoaded", main);
