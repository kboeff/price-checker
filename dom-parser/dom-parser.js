const { JSDOM } = require('jsdom');

const initDomParser = (html) => {
    return new Promise((resolve) => {
        const dom = new JSDOM(html);
       
        resolve(dom);
    });
};

module.exports = initDomParser;