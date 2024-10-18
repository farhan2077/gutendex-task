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
  const index = wishtlists.findIndex((favorite) => favorite.id === book.id);

  if (index > -1) {
    wishtlists.splice(index, 1);
  } else {
    wishtlists.push(book);
  }

  saveToWishlist(wishtlists);
  return wishtlists.some((favorite) => favorite.id === book.id);
}

function renderFavorites() {
  const wishtlists = getWishlist();
  const wishlistContainer = document.getElementById("book-cards__container");

  if (wishtlists.length === 0) {
    wishlistContainer.innerHTML = "<p>Your wishlist is empty!</p>";
    return;
  }

  wishtlists.forEach((book) => {
    const card = document.createElement("div");
    const cardBody = document.createElement("div");
    card.className = "book-card";
    cardBody.className = "book-card__body";

    // wishlist
    const wishlist = document.createElement("div");
    wishlist.innerHTML = heartFilledSVG;
    wishlist.className = "book-card__wishlist-toggler";
    wishlist.style.cursor = "pointer";

    wishlist.onclick = function () {
      const isFavorite = toggleFavorite(book);
      this.innerHTML = isFavorite ? heartFilledSVG : heartOutlineSVG;
      window.location.reload();
    };

    // title
    const title = document.createElement("h2");
    title.textContent = book.title;
    title.className = "book-card__title";

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
    const topics = book.subjects[0].split(" -- ");
    genre.textContent = `${topics[topics.length - 1]}`;
    genre.className = "book-card__genre";

    // id
    const id = document.createElement("div");
    id.textContent = `#${book.id}`;
    id.className = "book-card__id";

    cardBody.appendChild(title);
    cardBody.appendChild(authors);
    cardBody.appendChild(genre);
    cardBody.appendChild(id);

    card.appendChild(wishlist);
    card.appendChild(coverImg);
    card.appendChild(cardBody);

    wishlistContainer.appendChild(card);
  });
}

document.addEventListener("DOMContentLoaded", renderFavorites);
