import {
  baseUrl,
  heartFilledSVG,
  heartOutlineSVG,
  getWishlist,
  toggleFavorite,
  debug,
  fetchData,
} from "./common.js";

function saveSearchState() {
  const searchState = {
    searchTerm: currentSearchTerm,
    topic: currentTopic,
    page: currentPage,
  };
  localStorage.setItem("bookSearchState", JSON.stringify(searchState));
}

function loadSearchState() {
  const savedState = localStorage.getItem("bookSearchState");
  if (savedState) {
    const { searchTerm, topic, page } = JSON.parse(savedState);
    currentSearchTerm = searchTerm;
    currentTopic = topic;
    currentPage = page;

    document.getElementById("search-input").value = searchTerm;
    document.getElementById("select-input").value = topic;

    return true;
  }
  return false;
}

function createBookCard(bookList, book) {
  const wishlists = getWishlist();

  const card = document.createElement("div");
  const cardBody = document.createElement("div");
  card.className = "book-card";
  cardBody.className = "book-card__body";

  // wishlist
  const wishlist = document.createElement("div");
  wishlist.innerHTML = wishlists.some(
    (wishlistedItem) => wishlistedItem.id === book.id
  )
    ? heartFilledSVG
    : heartOutlineSVG;

  wishlist.className = "book-card__wishlist-toggler";
  wishlist.style.cursor = "pointer";

  wishlist.onclick = function () {
    const isFavorite = toggleFavorite(book);
    this.innerHTML = isFavorite ? heartFilledSVG : heartOutlineSVG;
  };

  // id
  const bookId = book.id;
  const id = document.createElement("div");
  id.textContent = `ID: ${bookId}`;
  id.className = "book-card__id";

  // title
  const title = document.createElement("a");
  title.textContent = book.title;
  title.className = "book-card__title";
  title.href = `/pages/book-details.html?id=${bookId}`;

  // author
  const authors = document.createElement("p");
  authors.textContent = `${book.authors
    .map((author) => author.name)
    .join(", ")}`;
  authors.className = "book-card__authors";

  // cover image
  const coverImg = document.createElement("img");
  coverImg.src = book.formats["image/jpeg"];
  coverImg.className = "book-card__img";

  // genre
  const genre = document.createElement("div");
  const topics = book.subjects[0].split(" -- ");
  genre.textContent = `${topics[topics.length - 1]}`;
  genre.className = "book-card__genre";

  cardBody.appendChild(title);
  cardBody.appendChild(authors);
  cardBody.appendChild(id);
  cardBody.appendChild(genre);

  card.appendChild(wishlist);
  card.appendChild(coverImg);
  card.appendChild(cardBody);

  bookList.appendChild(card);
}

function renderBooks(data, bookList) {
  bookList.innerHTML = "";

  data.results.forEach((book) => {
    createBookCard(bookList, book);
  });
}

async function handlePageChange(newPage) {
  currentPage = newPage;
  const url = getUrlWithQueryParams(
    currentSearchTerm,
    currentTopic,
    currentPage
  );

  const loader = document.getElementById("loader-wrapper");
  const content = document.getElementById("content__container");

  try {
    loader.style.display = "flex";
    content.style.display = "none";

    const data = await fetchData(url);

    if (data.results.length === 0) {
      bookList.style.display = "grid";
      bookList.textContent = "No results found.";
    } else {
      const bookList = document.getElementById("book-cards__container");
      renderBooks(data, bookList);
    }

    updatePaginationButtons(data.previous, data.next);

    loader.style.display = "none";
    content.style.display = "block";
  } catch (error) {
    debug("error", "Error in handlePageChange:", error.message);
    loader.style.display = "none";
    bookList.textContent = "An error occurred while fetching data.";
    bookList.style.display = "grid";
  }
}

function updatePaginationButtons(prevUrl, nextUrl) {
  const prevButton = document.getElementById("pagination__prev-btn");
  const nextButton = document.getElementById("pagination__next-btn");

  prevButton.disabled = !prevUrl;
  nextButton.disabled = !nextUrl;

  prevButton.style.display = prevUrl ? "block" : "none";
  nextButton.style.display = nextUrl ? "block" : "none";

  prevButton.onclick = prevUrl ? () => handlePageChange(currentPage - 1) : null;
  nextButton.onclick = nextUrl ? () => handlePageChange(currentPage + 1) : null;
}

async function initialFetchAndRender() {
  const hasSavedState = loadSearchState();

  try {
    let url = "";
    if (hasSavedState) {
      url = getUrlWithQueryParams(currentSearchTerm, currentTopic, currentPage);
    } else {
      url = `${baseUrl}/?page=1`;
    }

    const data = await fetchData(url);

    const loader = document.getElementById("loader-wrapper");
    const bookList = document.getElementById("book-cards__container");
    const content = document.getElementById("content__container");

    loader.style.display = "none";
    bookList.style.display = "grid";

    renderBooks(data, bookList);

    const paginationContainer = document.createElement("div");
    const prevButton = document.createElement("button");
    const nextButton = document.createElement("button");

    paginationContainer.id = "pagination__container";
    prevButton.id = "pagination__prev-btn";
    nextButton.id = "pagination__next-btn";
    prevButton.textContent = "← Previous";
    nextButton.textContent = "Next →";

    paginationContainer.appendChild(prevButton);
    paginationContainer.appendChild(nextButton);
    content.appendChild(paginationContainer);

    updatePaginationButtons(data.previous, data.next);
  } catch (error) {
    debug("error", "Error in initialFetchAndRender:", error.message);
  }
}

function debounce(func, delay) {
  let timeoutId;
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
}

function getUrlWithQueryParams(search, topic, page) {
  let url = `${baseUrl}/?`;
  const params = new URLSearchParams();

  if (search) params.append("search", search);
  if (topic) params.append("topic", topic);
  if (page > 1) params.append("page", page);

  return url + params.toString();
}

let currentPage = 1;
let currentSearchTerm = "";
let currentTopic = "";

async function refetchAndRender() {
  const searchTerm = document.getElementById("search-input").value.trim();
  const topicSelect = document.getElementById("select-input");
  const topic = topicSelect.value;

  currentPage = 1; // reset to first page when search or topic changes
  currentSearchTerm = searchTerm;
  currentTopic = topic;

  saveSearchState();

  const url = getUrlWithQueryParams(
    currentSearchTerm,
    currentTopic,
    currentPage
  );

  const loader = document.getElementById("loader-wrapper");
  const content = document.getElementById("content__container");

  try {
    // show loader and hide content
    loader.style.display = "flex";
    content.style.display = "none";

    const bookList = document.getElementById("book-cards__container");
    const pagination = document.getElementById("pagination__container");

    const data = await fetchData(url);

    // data loading is done > hide loader and show content
    loader.style.display = "none";
    content.style.display = "block";

    if (data.results.length === 0) {
      // since no result found, no need to show pagination
      pagination.style.display = "none";

      bookList.style.display = "grid";
      bookList.textContent = "No results found.";
    } else {
      pagination.style.display = "flex";
      renderBooks(data, bookList);
      updatePaginationButtons(data.previous, data.next);
    }
  } catch (error) {
    debug("error", "Error in refetchAndRender:", error.message);
    // hide loader and show error message
    loader.style.display = "none";
    content.innerHTML = `<div>An error occurred while fetching data. <span style="cursor: pointer; text-decoration: underline;" onclick="location.reload()">Retry again</span></div>`;
    content.style.display = "block";
  }
}

document.addEventListener("DOMContentLoaded", () => {
  initialFetchAndRender();

  const searchInput = document.getElementById("search-input");
  const topicSelect = document.getElementById("select-input");

  searchInput.addEventListener("input", debounce(refetchAndRender, 500));
  topicSelect.addEventListener("change", refetchAndRender);
});
