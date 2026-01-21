import axios from "axios";
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

const API_KEY = "47873630-6df1888e9a425e125fd567ab2";
const BASE_URL = "https://pixabay.com/api/";
const PER_PAGE = 40;

document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("#search-form");
  const gallery = document.querySelector(".gallery");
  const loader = document.querySelector(".loader");
  const loadMoreBtn = document.querySelector(".load-more");

  let currentPage = 1;
  let currentQuery = "";
  let totalHits = 0;
  let lightbox = null;

  form.addEventListener("submit", onSearch);
  loadMoreBtn.addEventListener("click", onLoadMore);

  async function onSearch(event) {
    event.preventDefault();

    currentQuery = event.currentTarget.elements.query.value.trim();

    if (!currentQuery) {
      iziToast.warning({
        message: "Please enter a search query.",
        position: "topRight",
      });
      return;
    }

    currentPage = 1;
    totalHits = 0;
    gallery.innerHTML = "";
    loadMoreBtn.classList.add("is-hidden");

    await fetchAndRenderImages();
  }

  async function onLoadMore() {
    currentPage += 1;
    await fetchAndRenderImages();
  }

  async function fetchAndRenderImages() {
    loader.classList.remove("is-hidden");
    loadMoreBtn.classList.add("is-hidden");

    try {
      const data = await fetchImages(currentQuery, currentPage);

      if (data.hits.length === 0 && currentPage === 1) {
        iziToast.error({
          message:
            "Sorry, there are no images matching your search query. Please try again!",
          position: "topRight",
        });
        return;
      }

      totalHits = data.totalHits;
      
      renderGallery(data.hits);

      if (!lightbox) {
        lightbox = new SimpleLightbox(".gallery a", {
          captionsData: "alt",
          captionDelay: 250,
        });
      } else {
        lightbox.refresh();
      }

      const totalLoaded = currentPage * PER_PAGE;

      if (totalLoaded >= totalHits) {
        loadMoreBtn.classList.add("is-hidden");
        

        if (currentPage > 1) {
          iziToast.info({
            message:
              "We're sorry, but you've reached the end of search results.",
            position: "topRight",
          });
        }
      } else {
        loadMoreBtn.classList.remove("is-hidden");
      }

      if (currentPage > 1) {
        smoothScroll();
      }
    } catch (error) {
      console.error(error);
      iziToast.error({
        message: "Something went wrong. Please try again later!",
        position: "topRight",
      });
    } finally {
      loader.classList.add("is-hidden");
    }
  }

  async function fetchImages(query, page) {
    const response = await axios.get(BASE_URL, {
      params: {
        key: API_KEY,
        q: query,
        image_type: "photo",
        orientation: "horizontal",
        safesearch: true,
        page,
        per_page: PER_PAGE,
      },
    });

    return response.data;
  }

  function renderGallery(images) {
    const markup = images
      .map(
        ({
          webformatURL,
          largeImageURL,
          tags,
          likes,
          views,
          comments,
          downloads,
        }) => `
        <li class="gallery-item">
          <a class="gallery-link" href="${largeImageURL}">
            <img src="${webformatURL}" alt="${tags}" loading="lazy" />
            <div class="info">
              <p><b>Likes</b><br>${likes}</p>
              <p><b>Views</b><br>${views}</p>
              <p><b>Comments</b><br>${comments}</p>
              <p><b>Downloads</b><br>${downloads}</p>
            </div>
          </a>
        </li>
      `
      )
      .join("");

    gallery.insertAdjacentHTML("beforeend", markup);
  }

  function smoothScroll() {
    const { height } = gallery.firstElementChild.getBoundingClientRect();

    window.scrollBy({
      top: height * 2,
      behavior: "smooth",
    });
  }
});