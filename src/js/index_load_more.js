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
refs.loadMoreButton.addEventListener("click", onLoadMore);

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
}

function hitsCounter(data) {
  counter += data.hits.length;
  if (counter > 40) {

      console.log(counter)
      smoothScroll();
  } else if (counter >= data.totalHits) {  
    refs.loadMoreButton.hidden = true;
    
    return Notify.failure("We're sorry, but you've reached the end of search results.");
  }
};

function smoothScroll() {
const { height: cardHeight } = document.querySelector(".gallery").firstElementChild.getBoundingClientRect();

    window.scrollBy({
      top: cardHeight * 2,
      behavior: "smooth",
    });
}