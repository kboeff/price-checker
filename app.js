/* global fetch */
/* global dom */

require('./polyfills');

const { DETAILS } = require('./selectors');


// Get the products and add them to a queue
// let fullUrl = 'https://www.ikea.bg/living-room/Living-room-storage/Bookcases'
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
            return require('./dom-parser/index')(html);
        })
        .then((dom) => {
            // select all products on the page
            const product = dom.window.document.getElementsByClassName(DETAILS.NAME_SELECTOR);
            const size = dom.window.document.getElementsByClassName(DETAILS.SIZE_SELECTOR);
            let article = [];            
            
            for (let i in product) {
                const productSpecs = product[i].children; // name and price
                const sizeSpecs = size[i].textContent || '';
                
                for (let props in productSpecs) {
                    
                    let spec = productSpecs[props].textContent;
                    if (spec !== undefined) {
                        // console.log(spec.trim());
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
