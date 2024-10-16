const baseUrl = "https://gutendex.com/books";

const heartFilledSVG = `
<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="#e11d48" stroke="#e11d48" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
</svg>`;

const heartOutlineSVG = `
<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="#ffe4e6" stroke="#e11d48" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
</svg>`;

function getWishlist() {
  return JSON.parse(localStorage.getItem("wishlist")) || [];
}

function saveToWishlist(items) {
  localStorage.setItem("wishlist", JSON.stringify(items));
}

function toggleFavorite(book) {
  let wishtlists = getWishlist();
  const index = wishtlists.findIndex(
    (wishlistedItem) => wishlistedItem.id === book.id
  );

  if (index > -1) {
    wishtlists.splice(index, 1);
  } else {
    wishtlists.push(book);
  }

  saveToWishlist(wishtlists);
  return wishtlists.some((wishlistedItem) => wishlistedItem.id === book.id);
}

let nextUrl = null;
let prevUrl = null;

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
  id.textContent = `#${bookId}`;
  id.className = "book-card__id";

  // title
  const title = document.createElement("a");
  title.textContent = book.title;
  title.className = "book-card__title";
  title.href = `/pages/book-details.html?id=${bookId}`;

  // author
  const authors = document.createElement("p");
  authors.textContent = `by ${book.authors
    .map((author) => author.name)
    .join(", ")}`;
  authors.className = "book-card__authors";

  // cover image
  const coverImg = document.createElement("img");
  coverImg.src = book.formats["image/jpeg"];
  coverImg.className = "book-card__img";

  // genre
  const genre = document.createElement("div");
  genre.textContent = "classic fiction"; // change this
  genre.className = "book-card__genre";

  cardBody.appendChild(title);
  cardBody.appendChild(authors);
  cardBody.appendChild(genre);
  cardBody.appendChild(id);

  card.appendChild(wishlist);
  card.appendChild(coverImg);
  card.appendChild(cardBody);

  bookList.appendChild(card);
}

async function fetchData(currPage = 1) {
  console.log("fetchData > ", currPage);
  let url = baseUrl;
  url = `https://gutendex.com/books/?page=${currPage}`;
  // url = `https://api.npoint.io/abfa29a2347ccfad4a72`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const data = await response.json();
    console.log(data.previous, data.next);
    return data;
  } catch (error) {
    console.error("Error in fetchData:", error.message);
  }
}

function render(data, bookList) {
  bookList.innerHTML = "";

  data.results.forEach((book) => {
    createBookCard(bookList, book);
  });
}

async function fetchAndRender() {
  let currPage = 1;

  try {
    const data = await fetchData(currPage);
    let isPrevNull = data.previous === null;
    let isNextNull = data.next === null;

    const loader = document.getElementById("loader-wrapper");
    loader.style.display = "none";
    const bookList = document.getElementById("book-cards__container");
    bookList.style.display = "block";
    const content = document.getElementById("content__container");

    render(data, bookList);

    const paginationContainer = document.createElement("div");
    const prev = document.createElement("button");
    const next = document.createElement("button");

    paginationContainer.className = "pagination-container";
    prev.className = "pagination__prev-btn";
    next.className = "pagination__next-button";

    prev.textContent = "← Previous";
    next.textContent = "Next →";

    paginationContainer.className = "pagination__container";
    prev.classList = "pagination__prev-btn";
    next.classList = "pagination__next-btn";

    prev.addEventListener("click", async (event) => {
      event.preventDefault();

      if (!isPrevNull) {
        currPage--;

        content.style.display = "none";
        loader.style.display = "flex";

        const data = await fetchData(currPage);
        isPrevNull = data.previous === null;
        isNextNull = data.next === null;

        isPrevNull
          ? prev.setAttribute("disabled", "true")
          : prev.removeAttribute("disabled");

        isNextNull
          ? next.setAttribute("disabled", "true")
          : next.removeAttribute("disabled");

        content.style.display = "block";
        loader.style.display = "none";

        render(data, bookList);
      }
    });

    next.addEventListener("click", async (event) => {
      event.preventDefault();

      if (!isNextNull) {
        currPage++;

        content.style.display = "none";
        loader.style.display = "flex";

        const data = await fetchData(currPage);
        isPrevNull = data.previous === null;
        isNextNull = data.next === null;
        isPrevNull
          ? prev.setAttribute("disabled", "true")
          : prev.removeAttribute("disabled");

        isNextNull
          ? next.setAttribute("disabled", "true")
          : next.removeAttribute("disabled");

        content.style.display = "block";
        loader.style.display = "none";

        render(data, bookList);
      }
    });

    isPrevNull
      ? prev.setAttribute("disabled", "true")
      : prev.removeAttribute("disabled");

    isNextNull
      ? next.setAttribute("disabled", "true")
      : next.removeAttribute("disabled");

    paginationContainer.appendChild(prev);
    paginationContainer.appendChild(next);

    content.appendChild(paginationContainer);
  } catch (error) {
    console.error("Error in fetchAndRender:", error.message);
  }
}

document.addEventListener("DOMContentLoaded", fetchAndRender);
