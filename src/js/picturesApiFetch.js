import { Notify } from 'notiflix/build/notiflix-notify-aio';
import axios from 'axios';

const BASE_URL = "https://pixabay.com/api/";

export default class PicturesApi {
    constructor() {
        this.searchQuery = "";
        this.page = 1;
    }

    fetchPics() {
        const searchPictureParams = new URLSearchParams({
            key: "31431099-cb6424a99d97f67db3bc0cdc7",
            q: `${this.searchQuery}`,
            image_type: "photo",
            orientation: "horizontal",
            safesearch: "true",
            page: `${this.page}`,
            per_page: 100,
        });

        return fetch(`${BASE_URL}?${searchPictureParams}`).then((response) => {
                if (!response.ok) {
                    throw new Error(response.status);
                }
                return response.json();
            }
        ).then(data => {
            // console.log(data)
            if (data.hits.length === 0) {
                Notify.failure("Sorry, there are no images matching your search query. Please try again.");
            }
            this.page += 1;

            return data;
        }
        ).catch((error) => {
        if (error.message === "404") {

            console.log("ERROR 404");

            // document.body.innerHTML = "";
            // const errorMarkup = `<p class="error"><b>Error: 404</b></p>`;
            // errorMarkupRef.innerHTML = errorMarkup;        
            }
        }
        ) 
    }

    get query() {
        return this.searchQuery;
    };

    set query(newQuery) {
        this.searchQuery = newQuery;
    }

    resetPage() {
        this.page = 1;
    }
};