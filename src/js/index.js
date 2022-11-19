import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import axios from 'axios';

import PicturesApi from "./picturesApiFetch";

// Notify.success("Hooray! We found totalHits images.");

const refs = {
  form: document.querySelector("#search-form"),
  input: document.querySelector("[name=searchQuery]"),
  formButton: document.querySelector("button"),
  gallery: document.querySelector(".gallery"),
  loadMoreButton: document.querySelector(".load-more"),  
}
errorMarkupRef = document.querySelector(".error-markup");

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

function onLoadMore() {  
  picturesApi.fetchPics().then(markupGallery);
};

function markupGallery(data) {
  const markup = data.hits.map(({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) => {
        return `<div class="photo-card">
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
        </div>` 
      }).join("");

  refs.gallery.insertAdjacentHTML("beforeend", markup);  

  hitsCounter(data)
}

function clearSearch() {
  refs.gallery.innerHTML = "";
}

function hitsCounter(data) {
  counter += data.hits.length;

  if (counter >= data.totalHits) {  
      console.log("counter", counter)
    console.log("totalHits", data.totalHits)
    
    refs.loadMoreButton.hidden = true;

    return Notify.failure("We're sorry, but you've reached the end of search results.");
  };
}


const lightbox = new SimpleLightbox('.gallery a', { /* options */ });

// console.dir(refs.loadMoreButton.hidden)
