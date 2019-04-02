const initParser = require('../dom-parser');

const { DETAILS } = require('../selectors');

class Product {
    
    constructor(name, size) {
        this.name = name;
        this.size = size;
    }
    
    static fromHtml(html) {
        return initParser(html)
                .then((dom) => {
                    const name = dom.window.document.getElementsByClassName(DETAILS.NAME_SELECTOR);
                    const size = dom.window.document.getElementsByClassName(DETAILS.SIZE_SELECTOR);
                    // console.log(name, size);
                    return new Product(name, size);
                })
                .catch(err => console.log("Problem with initParser getting html, error message:", err));
    }
}

module.exports = { Product };