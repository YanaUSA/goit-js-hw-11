import { Notify } from 'notiflix/build/notiflix-notify-aio';
import axios from 'axios';

const BASE_URL = "https://pixabay.com/api/";

export default class PicturesApi {
    constructor() {
        this.searchQuery = "";
        this.page = 1;
    }

    async fetchPics() {
        const searchPictureParams = new URLSearchParams({
            key: "31431099-cb6424a99d97f67db3bc0cdc7",
            q: `${this.searchQuery}`,
            image_type: "photo",
            orientation: "horizontal",
            safesearch: "true",
            page: `${this.page}`,
            per_page: 40,
        });

        try {
            const response = await axios.get(`${BASE_URL}?${searchPictureParams}`)

            if (response.data.hits.length === 0) {
                Notify.failure("Sorry, there are no images matching your search query. Please try again.");            
            } else if (this.page === 1) {
                Notify.success(`Hooray! We found ${response.data.totalHits} images.`);
            }            
            
            this.page += 1;

            return response.data;

        } catch (error) {
            Notify.failure(error.message);
        }
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