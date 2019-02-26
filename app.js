/* global fetch */
require('./polyfills');

const { DETAILS } = require('./selectors');


// Get the products and add them to a queue
// let fullUrl = 'https://www.ikea.bg/living-room/Living-room-storage/Bookcases'
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
            const product = $(DETAILS.NAME_SELECTOR).html();
            console.log(product.trim());
        })
        .catch((err) => {
            console.log(err + '\n>>>Promise went wrong.<<<');
        });
};

getProductData(productsUrlBase + categories[0]);