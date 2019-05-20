const { Client } = require('pg');
const priceAlert = require('./price-alert');
const getProductData = require('./get-product-data');
const crypto = require('crypto');

const client = new Client;

const updateDB = async (productsUrlBase, category) => {
    // connect to db
    await client.connect();
    const records = await getProductData(productsUrlBase);

    for (const record of records) {

        let checksum = '';

        for (let key in record){
            if (record.hasOwnProperty(key)) {
                if (key !== 'price') {
                    checksum += record[key] || '';
                }
            }
        }

        try {
            const md5Checksum = crypto.createHash('md5').update(checksum).digest("hex");
            const check = await client.query('SELECT * FROM inventory WHERE checksum=$1', [md5Checksum]);
            // console.log(check, 'if this is empty, INSERT in DB!'); // DEBUG
            
            // Record not found in db, add.
            let arrLit = '{' + record.price +'}';

            if (check.rows.length === 0) {
                let rows = await client.query("INSERT INTO inventory(product_name, category, description, price, width, depth, height, checksum, history) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)", [record.name, category, record.description, record.price, record.width, record.depth, record.height, md5Checksum, arrLit]);
                console.log(rows, 'INSERTED to DB.'); // DEBUG
            } else {
                // compare prices, signal for changes!
                let item = check.rows[0];
                // console.log(item);
                if (item.price !== record.price) {
                    priceAlert(item, record.price);
                    let formattedPrice = parseFloat(Math.round(record.price * 100) / 100).toFixed(2);
                    let txt = "UPDATE inventory SET price=" + formattedPrice + ", history = history||ARRAY[cast(" + formattedPrice +"as real)] WHERE checksum='" + md5Checksum + "::uuid'";
                    let updatePrice = await client.query(txt);
                    console.log(updatePrice);

                }
            }
        } catch (err) {
            console.log('Query error - checking / inserting items: ', err);
        }
    }

};

module.exports = updateDB;