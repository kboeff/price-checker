/* global fetch */
/* global dom */

require('./polyfills');

const { Product } = require('./models/product.model');

const clearData = require('./data-handlers/clear-data');

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
        .then(async (html) => {
            const Products = await Product.fromHtml(html); // CHANGE THIS ACCORDING TO NEW MODEL ...
            
            // select all products on the page
            const product = Products.name;
            const size = Products.size;
            // console.log(Products, product, size);
            let article = [];            
            
            for (let i in product) {
                let productSpecs = product[i].children; // name and price
                let sizeSpecs = size[i].textContent || '';
                let nameSpecs = [];
                
                for (let props in productSpecs) {
                    
                    let spec = productSpecs[props].textContent;
                    if (spec !== undefined && spec !== null) {
                        nameSpecs.push(spec.trim().replace(/\s\s+/g, ' '));
                    } 
                }
                sizeSpecs = sizeSpecs.trim().replace(/\s\s+/g, ' ');
                
                article.push(clearData(nameSpecs, [sizeSpecs]));
                
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
    
    return db;
    
};

let db = crawl();

for (let obj of db) {
    console.log(obj.name);
    
}
