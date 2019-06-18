/* global fetch */
/* global dom */

require('../polyfills');
const clearData = require('./clear-data');
const { Product } = require('../models/product.model');

const getProductData = (url) => {
    console.log('Fetching data from target site...')
    return fetch(url)
        .then((response) => {
            if(!response.ok) {
                throw new Error('Invalid url');
            }
            
            return response.text();
        })
        .then(async (html) => {
            const Products = await Product.fromHtml(html); // CHANGE THIS ACCORDING TO NEW MODEL ...
           
            let products = clearData(Product);
           
            let article = [];            
            
            for (let i = 0; i < products.length; i++) {
                let product = clearData(Product);
                
                let productSpecs = product[i].children; // name and price 
                let sizeSpecs = details[i].textContent || '';
                let nameSpecs = [];
                
                for (let props in productSpecs) {
                    
                    let spec = productSpecs[props].textContent;
                    if (spec !== undefined && spec !== null) {
                        nameSpecs.push(spec.trim().replace(/\s\s+/g, ' '));
                    } 
                }
                sizeSpecs = sizeSpecs.trim().replace(/\s\s+/g, ' ');
                
                if (nameSpecs.length > 0) {
                    article.push(clearData(nameSpecs, [sizeSpecs]));
                }
                
            }
            return article;
            
        })
        .catch((err) => {
            console.log(err + '\n>>>Promise went wrong.<<<');
        });
};


module.exports = getProductData;
