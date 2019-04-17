const { Client } = require('pg');
const priceAlert = require('./price-alert');
const getProductData = require('./get-product-data');

const client = new Client;

const updateDB = (productsUrlBase) => {
    let props = ['name', 'description', 'price', 'width', 'depth', 'height'];
    // let db = [];  // what does this do?
    
    Promise.all([getProductData(productsUrlBase)])
        .then(async (values) => {
            // db.push(values);
            
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
                    let arrLit = '{' + record.price +'}';
                    
                    if (check.rows.length === 0) {
                        let rows = await client.query("INSERT INTO inventory(product_name, description, price, width, depth, height, checksum, history) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)", [record.name, record.description, record.price, record.width, record.depth, record.height, checksum, arrLit]);
                        // console.log(rows); // DEBUG
                    } else {
                        // compare prices, signal for changes!
                        let item = check.rows[0];
                        // console.log(item);
                        if (item.price !== record.price) {
                            priceAlert(item, record.price);
                            let formattedPrice = parseFloat(Math.round(record.price * 100) / 100).toFixed(2);
                            let txt = "UPDATE inventory SET price=" + formattedPrice + ", history = history||ARRAY[cast(" + formattedPrice +"as real)] WHERE checksum='" + checksum + "'";
                            let updatePrice = await client.query(txt);
                            console.log(updatePrice);
            
                        }
                    }
               } catch (err) {
                   console.log('Query error - checking / inserting items: ', typeof record.price, err);
               }
               
            }
        
        });
};

module.exports = updateDB;