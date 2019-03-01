const initParser = require('./dom-parser');

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
                    return new Product(name, size);
                });
    }
}

module.exports = { Product };