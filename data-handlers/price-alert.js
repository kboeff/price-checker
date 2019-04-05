module.exports = (item, newPrice) => {
    // SEND alert to front-end
    console.log('New price of ' + item.product_name);
    console.log(`Changed from ${item.price} to ${newPrice}`);
    
};