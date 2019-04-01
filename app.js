/* global fetch */
/* global dom */

require('./polyfills');

const { DETAILS } = require('./selectors');

const { Product } = require('./models/product.model');

// Get the products and add them to a queue
// let fullUrl = 'https://www.ikea.bg/living-room/Living-room-storage/Bookcases/?pg=2' << add page untill we get error.
const productsUrlBase = 'https://www.ikea.bg/living-room/Living-room-storage/Bookcases';
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
            const Products = Product.fromHtml(html); // CHANGE THIS ACCORDING TO NEW MODEL ...
            
            // select all products on the page
            const product = dom.window.document.getElementsByClassName(Products.name);
            const size = dom.window.document.getElementsByClassName(Products.size);
            let article = [];            
            
            for (let i in product) {
                const productSpecs = product[i].children; // name and price
                const sizeSpecs = size[i].textContent || '';
                
                for (let props in productSpecs) {
                    
                    let spec = productSpecs[props].textContent;
                    if (spec !== undefined) {
                        article.push(spec.trim().replace(/\s\s+/g, ' '));
                    }
                }
                article.push(sizeSpecs.trim().replace(/\s\s+/g, ' '));
            }
            return article;
            
        })
        .catch((err) => {
            console.log(err + '\n>>>Promise went wrong.<<<');
        });
};


const crawl = () => {
    let db = [];
    
    Promise.all([getProductData(productsUrlBase)])
        .then(function(values) {
            db.push(values);
            console.log(db);
        });
    
}

crawl();
