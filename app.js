/* global fetch */
/* global dom */

require('./polyfills');

const updateDB = require('./data-handlers/update');
const { Client } = require('pg');
const client = new Client();

/*
    --- DB Info ---
    schema: "ikea"
    table: "inventory"
    
 *   key   |   name  | category | description | price | width  | depth | height | history |
 * --------|---------|----------|-------------|-------|--------|-------|--------|---------|
 *  serial | VARCHAR |   TEXT   |   TEXT      | FLOAT |   INT  |  INT  |  INT   | ARRAY   |
 *
 
 */


// Initialize the database if table and schema are missing
const initDB = async () => {
   try {
        await client.connect();
        console.log('Client connected to db ...');
        
        /*
        -- check if schema exists -> maybe initialize it on the hosting server
        const checkSchema = await client.query("SELECT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'ubuntu')");
        console.log('First query ok', checkSchema.rows[0].exists);
        if (!checkSchema.rows[0].exists) {
            const schema = await client.query("CREATE SCHEMA ubuntu");
            console.log('Second query ok'); // DEBUG
        }
        */
        
       const checkTable = await client.query("SELECT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'inventory')");
       console.log('query ok, returned rows:', checkTable.rows); // DEBUG
       
        if (!checkTable.rows[0].exists) {
            const table = await client.query('CREATE TABLE inventory (prod_id serial PRIMARY KEY, product_name VARCHAR (50), category TEXT, description TEXT, price REAL, width INT, depth INT, height INT, checksum uuid, history REAL ARRAY)');
            console.log(table);
        }
   } catch (err) {
        console.log(">>> Error initializing db. >>>", err);   
   }
};

// Get the products and add them to a queue
// let fullUrl = 'https://www.ikea.bg/living-room/Living-room-storage/Bookcases/?pg=2' << add page untill we get error.
const productsUrlBase = 'https://www.ikea.bg/living-room/Living-room-storage/';
const categories = ['Bookcases', 'Shelving-units', 'living-room-modular-storage-systems/eket', 'living-room-modular-storage-systems/BESTA-system'];

// Add route for updating db
// For testing purposes using IIFE
for(let i in categories) {
    (async() => {
        
        await initDB();
        return updateDB(productsUrlBase, categories[i]);
    })();
}

// Handle requests from the front end
// send records for display

