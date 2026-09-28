const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

const gallery = $("#gallery");
const searchInput = $("#searchInput");
const resultCount = $("#resultCount");
const emptyState = $("#emptyState");
const fileInput = $("#fileInput");
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
const themeIcon = $(".theme-icon");
const toast = $("#toast");
const toastText = $("#toastText");

const artworkData = [
  {
    id: 1,
    title: "Moonlit Reflection",
    artist: "Astra Vale",
    category: "anime",
    src: "https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=900&q=80",
    alt: "Anime-inspired moonlit scene with reflection"
  },
  {
    id: 2,
    title: "Neon Pulse",
    artist: "Kiro Matsu",
    category: "game",
    src: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=900&q=80",
    alt: "Futuristic game art with neon lighting"
  },
  {
    id: 3,
    title: "Enchanted Glade",
    artist: "Mina Sora",
    category: "oc",
    src: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80",
    alt: "Original character in a mystical forest setting"
  },
  {
    id: 4,
    title: "Crimson Ascension",
    artist: "Ren Takeda",
    category: "anime",
    src: "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?auto=format&fit=crop&w=900&q=80",
    alt: "Dramatic anime battle scene"
  },
  {
    id: 5,
    title: "Skyward Guardian",
    artist: "Yumi Kestrel",
    category: "game",
    src: "https://images.unsplash.com/photo-1528819622761-6bcf94b7d8d4?auto=format&fit=crop&w=900&q=80",
    alt: "Heroic fantasy game artwork"
  },
  {
    id: 6,
    title: "Luminous Garden",
    artist: "Noa Winter",
    category: "oc",
    src: "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?auto=format&fit=crop&w=900&q=80",
    alt: "Original character with glowing botanical elements"
  },
  {
    id: 7,
    title: "Ancient Fortress",
    artist: "Orion Kade",
    category: "anime",
    src: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=900&q=80",
    alt: "Detailed anime fantasy architecture"
  },
  {
    id: 8,
    title: "Retro Velocity",
    artist: "Lena Flux",
    category: "game",
    src: "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=900&q=80",
    alt: "Retro-futuristic game racing scene"
  },
  {
    id: 9,
    title: "Velvet Silence",
    artist: "Ari Sol",
    category: "oc",
    src: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=900&q=80",
    alt: "Contemplative original character portrait"
  },
  {
    id: 10,
    title: "Winter Reverie",
    artist: "Mika Hale",
    category: "anime",
    src: "https://images.unsplash.com/photo-1519638399535-1b036603ac77?auto=format&fit=crop&w=900&q=80",
    alt: "Anime seasonal illustration with winter mood"
  },
  {
    id: 11,
    title: "Infinite Horizon",
    artist: "Sora Dusk",
    category: "game",
    src: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=900&q=80",
    alt: "Vast sci-fi game landscape"
  },
  {
    id: 12,
    title: "Ethereal Wanderer",
    artist: "Iris Kwan",
    category: "oc",
    src: "https://images.unsplash.com/photo-1504593811423-6dd665756598?auto=format&fit=crop&w=900&q=80",
    alt: "Original character traveling through a mystical realm"
  }
];

let allArtworks = [...artworkData];
let activeFilter = "all";
let searchQuery = "";
let currentVisible = [];
let currentLightboxIndex = 0;

function showToast(message, duration = 1800) {
  if (!toast || !toastText) return;
  
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
  if (!gallery || !resultCount || !emptyState) return;
  
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
  if (!currentVisible[index] || !lightbox || !lightboxImg) return;

  currentLightboxIndex = index;
  const art = currentVisible[index];

  lightboxImg.classList.remove("loaded");
  if (imageLoading) imageLoading.classList.remove("hidden");

  lightboxImg.src = art.src;
  lightboxImg.alt = art.alt;

  lightboxImg.onload = () => {
    if (imageLoading) imageLoading.classList.add("hidden");
    lightboxImg.classList.add("loaded");
  };

  lightboxImg.onerror = () => {
    if (imageLoading) imageLoading.classList.add("hidden");
  };

  if (lightboxTitle) lightboxTitle.textContent = art.title;
  if (lightboxArtist) lightboxArtist.textContent = `by ${art.artist}`;
  if (lightboxCategory) lightboxCategory.textContent = art.category;

  lightbox.classList.add("open");
  lightbox.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function closeLightbox() {
  if (!lightbox) return;
  
  lightbox.classList.remove("open");
  lightbox.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
  if (imageLoading) imageLoading.classList.remove("hidden");
  if (lightboxImg) lightboxImg.classList.remove("loaded");
}

function changeLightbox(direction) {
  if (!currentVisible.length) return;

  const nextIndex =
    (currentLightboxIndex + direction + currentVisible.length) % currentVisible.length;

  openLightbox(nextIndex);
}

if (searchInput) {
  searchInput.addEventListener("input", (event) => {
    searchQuery = event.target.value;
    renderGallery();
  });
}

if (filterButtons.length) {
  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      activeFilter = button.dataset.filter;
      filterButtons.forEach((btn) => btn.classList.toggle("active", btn === button));
      renderGallery();
    });
  });
}

if (fileInput) {
  fileInput.addEventListener("change", (event) => {
    const files = Array.from(event.target.files || []);
    if (!files.length) return;

    files.forEach((file) => {
      if (!file.type.startsWith("image/")) return;

      const objectUrl = URL.createObjectURL(file);
      const cleanName = file.name.replace(/\.[^/.]+$/, "") || "Uploaded Artwork";

      allArtworks.unshift({
        id: Date.now() + Math.random(),
        title: cleanName,
        artist: "You",
        category: activeFilter === "all" ? "oc" : activeFilter,
        src: objectUrl,
        alt: `Uploaded artwork: ${cleanName}`
      });
    });

    renderGallery();
    showToast(`${files.length} image${files.length > 1 ? "s" : ""} added`);
    fileInput.value = "";
  });
}

if (lightboxClose) lightboxClose.addEventListener("click", closeLightbox);
if (lightboxBackdrop) lightboxBackdrop.addEventListener("click", closeLightbox);
if (navPrev) navPrev.addEventListener("click", () => changeLightbox(-1));
if (navNext) navNext.addEventListener("click", () => changeLightbox(1));

document.addEventListener("keydown", (event) => {
  if (!lightbox || !lightbox.classList.contains("open")) return;

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

if (lightbox) {
  lightbox.addEventListener(
    "touchstart",
    (event) => {
      if (event.changedTouches && event.changedTouches.length) {
        touchStartX = event.changedTouches[0].clientX;
      }
    },
    { passive: true }
  );

  lightbox.addEventListener("touchend", (event) => {
    if (!lightbox.classList.contains("open")) return;

    if (!event.changedTouches || !event.changedTouches.length) return;
    
    const touchEndX = event.changedTouches[0].clientX;
    const distance = touchEndX - touchStartX;

    if (distance > 50) {
      changeLightbox(-1);
    }

    if (distance < -50) {
      changeLightbox(1);
    }
  });
}

if (themeBtn && themeIcon) {
  themeBtn.addEventListener("click", () => {
    const isLight = document.body.classList.toggle("light-mode");
    themeIcon.textContent = isLight ? "☀️" : "🌙";
    localStorage.setItem("theme", isLight ? "light" : "dark");
  });
}

const savedTheme = localStorage.getItem("theme");
if (savedTheme === "light" || (!savedTheme && window.matchMedia("(prefers-color-scheme: light)").matches)) {
  document.body.classList.add("light-mode");
  if (themeIcon) themeIcon.textContent = "☀️";
}

renderGallery();
