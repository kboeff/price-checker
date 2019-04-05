/* global fetch */
/* global dom */

require('./polyfills');

const { Product } = require('./models/product.model');

const clearData = require('./data-handlers/clear-data');
const priceAlert = require('./data-handlers/price-alert');

// const makeQuery = require('./db/index');

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
console.log(process.env.PGUSER);

// Initialize the database if table and schema are missing
(async () => {
   try {
        await client.connect();
        console.log('Client connected to db ...')
        
        const checkSchema = await client.query("SELECT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'ubuntu')");
        console.log('First query ok');
        if (!checkSchema.rows[0].exists) {
            const schema = await client.query("CREATE SCHEMA ubuntu");
            console.log('Second query ok'); // DEBUG
        }
        
        
       const checkTable = await client.query("SELECT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'ubuntu' AND table_name = 'inventory')");
       console.log('query ok, returned rows:', checkTable.rows); // DEBUG
       
        if (!checkTable.rows[0].exists) {
            const table = await client.query('CREATE TABLE inventory (prod_id serial PRIMARY KEY, product_name VARCHAR (50), description TEXT, price REAL, width INT, depth INT, height INT, checksum TEXT)');
            console.log(table);
        }
   } catch (err) {
        console.log(">>> Error initializing db. >>>", err);   
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
    let props = ['name', 'description', 'price', 'width', 'depth', 'height']; // additional serial key and checksum in DB
    let db = [];
    
    Promise.all([getProductData(productsUrlBase)])
        .then(async (values) => {
            db.push(values);
            
            let records = values[0];
            
            for(let key in Object.keys(records)) {
                let record = records[key];
                let checksum = '';
                for(let p of props) {
                    if(p !== 'price') {
                        checksum += record[p] || '';
                    }
                }
               
               try {
                   const check = await client.query('SELECT * FROM inventory WHERE checksum=$1', [checksum]);
                    // console.log(check); // DEBUG
                    // Record not found in db, add.                
                    if (check.rows.length === 0) {
                        let rows = await client.query('INSERT INTO inventory(product_name, description, price, width, depth, height, checksum) VALUES ($1, $2, $3, $4, $5, $6, $7)', [record.name, record.description, record.price, record.width, record.depth, record.height, checksum]);
                        // console.log(rows); // DEBUG
                    } else {
                        // compare prices, signal for changes!
                        let item = check.rows[0];
                        // console.log(item);
                        if (item.price !== record.price) {
                            priceAlert(item, record.price);
                            let updateItem = await client.query('UPDATE inventory SET price=$1 WHERE checksum=$2', [record.price, checksum]);
                            console.log(updateItem);
            
                        }
                    }
               } catch (err) {
                   console.log('Query error - checking / inserting items:', err);
               }
               
            }
        
        });
    
};


// Add route for updating db
updateDB();

// Handle requests from the front end
// send records for display

