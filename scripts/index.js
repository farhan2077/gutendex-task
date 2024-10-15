async function fetchData() {
  const url = "https://gutendex.com/books";

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const bookList = document.getElementById("book-cards__container");
    const loader = document.getElementById("loader-wrapper");

    const data = await response.json();
    loader.style.display = "none";

    // Loop through the books and create card elements
    data.results.forEach((book) => {
      const card = document.createElement("div");
      const cardBody = document.createElement("div");
      card.className = "book-card";
      cardBody.className = "book-card__body";

      // wishlist
      const wishlist = document.createElement("div");
      wishlist.textContent = "💟";
      wishlist.className = "book-card__wishlist";

      // title
      const title = document.createElement("h2");
      title.textContent = book.title;
      title.className = "book-card__title";

      // author
      // author name
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
      genre.textContent = "classic fiction";
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

      bookList.appendChild(card);
    });

    // Display the book list
    bookList.style.display = "block";
    console.log(bookList);
  } catch (error) {
    console.error(error.message);
  }
}

fetchData();
