/*      Takes this object: 
        Product { 
            name: [array of names],
            details: [array of details], 
            code: [array of codes], 
            price: [array of prices]
        } and returns array of Product objects like:
        { name: name, details: details, code: code, price: price }, { same...}, etc...
*/

module.exports = (Product) => {
    let productArray = [];
    
    let names = Product.name.map(h3 => h3.firstElementChild.innerText);
    let details = Product.details.map(p => p.innerText);
    
    
    return productArray;
}
