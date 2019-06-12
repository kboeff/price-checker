/* global fetch */
/* global dom */

require('./polyfills');

const getCategories = require('./data-handlers/get-categories')

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
// New site structure - now there is division by rooms like this: https://www.ikea.bg/rooms/living-room/...


const rooms = ['https://www.ikea.bg/rooms/living-room/', 'https://www.ikea.bg/rooms/kitchen/'];
const categories = [];
const productsPerPage = '?sort=Default&pz=100&pg=1'; //



const fillCategories = async () => {
    for (let room of rooms) {
       let result = await getCategories(room);
       categories.push(...result)
        
    }
    console.log('categories', categories);
    await initDB();
    
    // Add route for updating db
    for (let categoryUrl of categories) {
        updateDB(categoryUrl + productsPerPage);
            // TODO: function to check if products are more than 100 and add updateDB(url+pg=2,3,etc.) in a loop
    }
}

fillCategories();


// Handle requests from the front end
// send records for display
