const initParser = require('../dom-parser');

const { DETAILS } = require('../selectors');

class Product {
    
    constructor(name, details, code, price, data) {
        this.name = name;
        this.details = details;
        this.code = code;
        this.price = price;
        this.data = data;
    }
    
    static fromHtml(html) {
        return initParser(html)
                .then((dom) => {
                    // const selected = dom.window.document.getElementsByClassName(DETAILS.NAME_SELECTOR).parentElement.className;
                    const name = dom.window.document.getElementsByClassName(DETAILS.NAME_SELECTOR);
                    const details = dom.window.document.getElementsByClassName(DETAILS.DESC_SELECTOR);
                    const code = dom.window.document.getElementsByClassName(DETAILS.CODE_SELECTOR);
                    const price = dom.window.document.getElementsByClassName(DETAILS.PRICE_SELECTOR);
                    const data = dom.window.document.getElementsByClassName(DETAILS.DATA_SELECTOR);
                    // console.log(name, size);
                    return new Product(name, details, code, price, data);
                })
                .catch(err => console.log("Problem with initParser getting html, error message:", err));
    }
}

module.exports = { Product };