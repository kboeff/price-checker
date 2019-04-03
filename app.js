/* global fetch */
/* global dom */

require('./polyfills');

const { Product } = require('./models/product.model');

const clearData = require('./data-handlers/clear-data');

const { Client } = require('pg');
const client = new Client();

/*
    schema: "ikea"
    table: "inventory"
    
 *   key   |   name  | description | price | width  | depth | height 
 * --------|---------|-------------|-------|--------|-------|--------
 *  serial | VARCHAR |   TEXT      | FLOAT |   INT  |  INT  |  INT  
 *
 */


// Initialize the database if table and schema are missing
(async () => {
   try {
        await client.connect();
        
        const checkSchema = await client.query("SELECT EXISTS (SELECT 1 FROM information_schema.tables WHERE  table_schema = 'ikea'");
        if (!checkSchema.rows) {
            const schema = await client.query("CREATE SCHEMA ikea");
        }
        
        const checkTable = await client.query("SELECT EXISTS (SELECT 1 FROM information_schema.tables WHERE  table_schema = 'ikea' AND table_name = 'inventory'");
        if (!checkTable.rows) {
            const table = await client.query('CREATE TABLE inventory (prod_id serial PRIMARY KEY, product_name VARCHAR (50), description TEXT, price REAL, width INT, depth INT, height INT)');
        }
        
        await client.end();
   } catch (err) {
        console.log(err);   
   }
})();

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


const updateDB = () => {
    let db = [];
    
    Promise.all([getProductData(productsUrlBase)])
        .then(function(values) {
            db.push(values);
            
            // the db object could be unnecessary
            for(let i in values) {
                // console.log(values[i]);
                
                let record = values[i];
                console.log(record);
            }
        });
    
};

updateDB();