/* global fetch */
require('./polyfills');


// Get the products and add them to a queue
const productsUrlBase = 'https://www.ikea.bg/living-room/Living-room-storage/';
const categories = ['Bookcases', 'Shelving-units', 'living-room-modular-storage-systems/eket', 'living-room-modular-storage-systems/BESTA-system'];

const getProductData = (url) => {
    return fetch(url)
        .then((response) => {
            if(!response.ok) {
                throw new Error('Invalid url');
            }
            
            return response.text();
        })
        .then((html) => {
            return require('./dom-parser/index')(html);
        })
        .then(($) => {
            const title = $('title').html();
            console.log(title);
        })
        .catch();
};

getProductData(productsUrlBase + categories[0]);