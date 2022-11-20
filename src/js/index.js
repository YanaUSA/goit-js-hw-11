import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import { Notify } from 'notiflix/build/notiflix-notify-aio';

import PicturesApi from "./picturesApiFetch";

const refs = {
  form: document.querySelector("#search-form"),
  input: document.querySelector("[name=searchQuery]"),
  formButton: document.querySelector("button"),
  gallery: document.querySelector(".gallery"),
  loadMoreButton: document.querySelector(".load-more"),  
}

const picturesApi = new PicturesApi();

refs.loadMoreButton.hidden = true;

let counter = 0;

refs.form.addEventListener("submit", onSearchInput);
refs.loadMoreButton.addEventListener("click", onLoadMore)

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
      refs.loadMoreButton.hidden = false;
    }       
  )  
};

  console.log("ysssssssss")

function onLoadMore() {  
  picturesApi.fetchPics().then(markupGallery);
};

function markupGallery(data) {
  const markup = data.hits.map(({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) => {
        return `<a href="${largeImageURL}">
      <div class="photo-card">
        <img src="${webformatURL}" alt="${tags}" loading="lazy" />
        <div class="info">
          <p class="info-item">
            <b>Likes ${likes}</b>
          </p>
          <p class="info-item">
            <b>Views ${views}</b>
          </p>
          <p class="info-item">
            <b>Comments ${comments}</b>
          </p>
          <p class="info-item">
            <b>Downloads ${downloads}</b>
          </p>
        </div>
      </div>
    </a>` 
      }).join("");

  refs.gallery.insertAdjacentHTML("beforeend", markup);

  hitsCounter(data);

  new SimpleLightbox('.gallery a', { captionDelay: 250 }).refresh();  
}

function clearSearch() {
  refs.gallery.innerHTML = "";
}

function hitsCounter(data) {
  counter += data.hits.length;

  if (counter >= data.totalHits) {  
    refs.loadMoreButton.hidden = true;
    return Notify.failure("We're sorry, but you've reached the end of search results.");
  }
}