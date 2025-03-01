const DEBUG = false;

export const baseUrl = "https://gutendex.com/books";

export const heartFilledSVG = `
<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="#e11d48" stroke="#e11d48" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
</svg>`;

export const heartOutlineSVG = `
<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="#ffe4e6" stroke="#e11d48" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
</svg>`;

export function getWishlist() {
  return JSON.parse(localStorage.getItem("wishlist")) || [];
}

function saveToWishlist(items) {
  localStorage.setItem("wishlist", JSON.stringify(items));
}

export function toggleFavorite(book) {
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

export function debug(level, ...args) {
  // only two levels = log | error
  if (DEBUG) {
    if (level === "error") {
      console.error(...args);
    } else {
      console.log(...args);
    }
  }
}

export async function fetchData(url) {
  debug(
    "log",
    "---------------",
    new Date().toLocaleTimeString(),
    "---------------"
  );
  debug("log", "⌛ Fetching", url);

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const data = await response.json();
    debug("log", "✅ Fetched", url);
    debug("log", "prev ->", data.previous);
    debug("log", "next ->", data.next);
    return data;
  } catch (error) {
    debug("error", "Error in fetchData:", error.message);
  }
}
