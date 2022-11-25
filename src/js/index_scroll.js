import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import { Notify } from 'notiflix/build/notiflix-notify-aio';

import PicturesApi from "./picturesApiFetch";

const refs = {
  form: document.querySelector("#search-form"),
  input: document.querySelector("[name=searchQuery]"),
  formButton: document.querySelector("button"),
  gallery: document.querySelector(".gallery"),
}

const picturesApi = new PicturesApi();

let counter = 0;

refs.form.addEventListener("submit", onSearchInput);

function clearSearch() {
  refs.gallery.innerHTML = "";
}

function onSearchInput(evt) {
  evt.preventDefault();

  picturesApi.query = evt.currentTarget.elements.searchQuery.value;

  if (picturesApi.query === "") {
    return;
  }

  picturesApi.resetPage();

  picturesApi.fetchPics().then((data) => {  
    clearSearch();
    markupGallery(data);
    }       
  ) 
};

function markupGallery(data) {
  const markup = data.hits.map(({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) => {
        return `<div class="photo-card">
        <a href="${largeImageURL}">
        <img src="${webformatURL}" alt="${tags}" loading="lazy" class="picture"/>
        </a>
        <div class="info">
          <p class="info-item">
            <b>Likes</b>
            ${likes}
          </p>
          <p class="info-item">
            <b>Views</b>
            ${views}
          </p>
          <p class="info-item">
            <b>Comments</b>
            ${comments}
          </p>
          <p class="info-item">
            <b>Downloads</b>
            ${downloads}
          </p>
        </div>
      </div>
    ` 
      }).join("");

  refs.gallery.insertAdjacentHTML("beforeend", markup);

  hitsCounter(data);

  new SimpleLightbox('.gallery a', { captionDelay: 250 }).refresh();

  const scrollTarget = refs.gallery.lastElementChild;

  if (scrollTarget) {
    scrollObserver.observe(scrollTarget);       
  }
}

const scrollObserver = new IntersectionObserver(([entry], observer) => {
  if (entry.isIntersecting) {
  scrollObserver.unobserve(entry.target);
  picturesApi.fetchPics().then(markupGallery);
};
}
, { rootMargin: "300px", threshold: 0.5 });

    
function hitsCounter(data) {
  counter += data.hits.length;

  if (counter >= data.totalHits) {
    Notify.failure("We're sorry, but you've reached the end of search results.");
    scrollObserver.unobserve(entry.target);
    return;
  }
};