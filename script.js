const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

const gallery = $("#gallery");
const searchInput = $("#searchInput");
const resultCount = $("#resultCount");
const emptyState = $("#emptyState");
const filterButtons = [...$$(".filter-tab")];

const lightbox = $("#lightbox");
const lightboxBackdrop = $("#lightboxBackdrop");
const lightboxClose = $("#lightboxClose");
const navPrev = $("#navPrev");
const navNext = $("#navNext");
const lightboxImg = $("#lightboxImg");
const lightboxTitle = $("#lightboxTitle");
const lightboxArtist = $("#lightboxArtist");
const lightboxCategory = $("#lightboxCategory");
const imageLoading = $("#imageLoading");

const themeBtn = $("#themeBtn");
const themeIcon = $("#themeBtn .theme-icon");
const toast = $("#toast");
const toastText = $("#toastText");

const artworkData = [
  {
    id: 1,
    src: "images/IMG_7831.png",
    alt: "Fanart",
    title: "fanart1",
    artist: "Tiw",
    category: "oc"
  },
  {
    id: 2,
    src: "images/781_20260928202203.png",
    alt: "Fanart",
    title: "fanart2",
    artist: "Tiw",
    category: "oc"
  }
];

let allArtworks = [...artworkData];
let activeFilter = "all";
let searchQuery = "";
let currentVisible = [];
let currentLightboxIndex = 0;

function showToast(message, duration = 1800) {
  toastText.textContent = message;
  toast.classList.add("show");

  clearTimeout(showToast.timerId);
  showToast.timerId = setTimeout(() => {
    toast.classList.remove("show");
  }, duration);
}

function getVisibleArtworks() {
  const query = searchQuery.trim().toLowerCase();

  return allArtworks.filter((art) => {
    const matchesFilter = activeFilter === "all" || art.category === activeFilter;
    const matchesQuery =
      !query ||
      art.title.toLowerCase().includes(query) ||
      art.artist.toLowerCase().includes(query) ||
      art.category.toLowerCase().includes(query);

    return matchesFilter && matchesQuery;
  });
}

function renderGallery() {
  const filtered = getVisibleArtworks();
  currentVisible = filtered;
  resultCount.textContent = filtered.length;

  if (!filtered.length) {
    gallery.innerHTML = "";
    emptyState.classList.remove("hidden");
    return;
  }

  emptyState.classList.add("hidden");

  gallery.innerHTML = filtered
    .map(
      (art) => `
        <article class="gallery-card">
          <img
            src="${art.src}"
            alt="${art.alt}"
            loading="lazy"
            decoding="async"
          />
          <div class="gallery-overlay">
            <div class="card-title">${art.title}</div>
            <div class="card-artist">by ${art.artist}</div>
            <span class="card-category">${art.category}</span>
          </div>
          <button
            type="button"
            class="gallery-card-button"
            aria-label="View ${art.title}"
            data-id="${art.id}"
          ></button>
        </article>
      `
    )
    .join("");

  gallery.querySelectorAll(".gallery-card-button").forEach((button) => {
    button.addEventListener("click", () => {
      const artId = Number(button.dataset.id);
      const index = filtered.findIndex((art) => art.id === artId);

      if (index >= 0) {
        openLightbox(index);
      }
    });
  });
}

function openLightbox(index) {
  if (!currentVisible[index]) return;

  currentLightboxIndex = index;
  const art = currentVisible[index];

  lightboxImg.classList.remove("loaded");
  imageLoading.classList.remove("hidden");

  lightboxImg.src = art.src;
  lightboxImg.alt = art.alt;

  lightboxImg.onload = () => {
    imageLoading.classList.add("hidden");
    lightboxImg.classList.add("loaded");
  };

  lightboxImg.onerror = () => {
    imageLoading.classList.add("hidden");
  };

  lightboxTitle.textContent = art.title;
  lightboxArtist.textContent = `by ${art.artist}`;
  lightboxCategory.textContent = art.category;

  lightbox.classList.add("open");
  lightbox.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function closeLightbox() {
  lightbox.classList.remove("open");
  lightbox.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
  imageLoading.classList.remove("hidden");
  lightboxImg.classList.remove("loaded");
}

function changeLightbox(direction) {
  if (!currentVisible.length) return;

  const nextIndex =
    (currentLightboxIndex + direction + currentVisible.length) % currentVisible.length;

  openLightbox(nextIndex);
}

searchInput.addEventListener("input", (event) => {
  searchQuery = event.target.value;
  renderGallery();
});

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    activeFilter = button.dataset.filter;
    filterButtons.forEach((btn) => btn.classList.toggle("active", btn === button));
    renderGallery();
  });
});

lightboxClose.addEventListener("click", closeLightbox);
lightboxBackdrop.addEventListener("click", closeLightbox);
navPrev.addEventListener("click", () => changeLightbox(-1));
navNext.addEventListener("click", () => changeLightbox(1));

document.addEventListener("keydown", (event) => {
  if (!lightbox.classList.contains("open")) return;

  if (event.key === "Escape") {
    closeLightbox();
  }

  if (event.key === "ArrowLeft") {
    changeLightbox(-1);
  }

  if (event.key === "ArrowRight") {
    changeLightbox(1);
  }
});

let touchStartX = 0;

lightbox.addEventListener(
  "touchstart",
  (event) => {
    touchStartX = event.changedTouches[0].clientX;
  },
  { passive: true }
);

lightbox.addEventListener("touchend", (event) => {
  if (!lightbox.classList.contains("open")) return;

  const touchEndX = event.changedTouches[0].clientX;
  const distance = touchEndX - touchStartX;

  if (distance > 50) {
    changeLightbox(-1);
  }

  if (distance < -50) {
    changeLightbox(1);
  }
});

themeBtn.addEventListener("click", () => {
  const isLight = document.body.classList.toggle("light-mode");
  themeIcon.textContent = isLight ? "☀️" : "🌙";
  localStorage.setItem("theme", isLight ? "light" : "dark");
});

const savedTheme = localStorage.getItem("theme");
if (savedTheme === "light" || (!savedTheme && window.matchMedia("(prefers-color-scheme: light)").matches)) {
  document.body.classList.add("light-mode");
  themeIcon.textContent = "☀️";
}

renderGallery();
