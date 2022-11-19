// export function fetchPics(name) {
//     const BASE_URL = "https://pixabay.com/api/";

//     let page = 1;
//     const searchPictureParams = new URLSearchParams({
//         key: "31431099-cb6424a99d97f67db3bc0cdc7",
//         q: `${name}`,
//         image_type: "photo",
//         orientation: "horizontal",
//         safesearch: "true",
//         page: `${page}`,
//         per_page: 4,
//     });

//     return axios.get(`${BASE_URL}?${searchPictureParams}`).then((response) => {
//             if (!response.ok) {
//                 throw new Error(response.status);
//             }
//             return response.json();
//         }
//     ).then(data => {
//         if (data.hits.length === 0) {
//             Notify.failure("Sorry, there are no images matching your search query. Please try again.");
//         }
//     }
//     )
// };  



