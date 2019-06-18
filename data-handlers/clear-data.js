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
    let productList = [];
    
    let names = Product.name.map(h3 => h3.firstElementChild.innerText);
    let details = Product.details.map(p => p.innerText);
    let code = Product.code.map(p => p.innerText);
    let price = Product.price.map(p => p.innerTextinnerText.replace(' лв','').replace(',','.'));
    let data = Product.data.map(div => div.getAttribute('data-product-data'));
    
    let maxLen = Math.max(names.length, details.length, code.length, price.length, data.length); // if some attribute is missing
    
    for (let i = 0; i < maxLen; i++) {
        productList.push({
            name: names[i],
            details: details[i],
            code: code[i],
            price: price[i],
            data: data[i]
        })
    }
    
    return productList;
}
