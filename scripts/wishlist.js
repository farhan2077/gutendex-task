import {
  heartFilledSVG,
  heartOutlineSVG,
  getWishlist,
  toggleFavorite,
} from "./common.js";

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
    const title = document.createElement("a");
    title.textContent = book.title;
    title.className = "book-card__title";
    title.href = `/pages/book-details.html?id=${book.id}`;

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
