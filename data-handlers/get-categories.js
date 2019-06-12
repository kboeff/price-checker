/* global fetch */

require('../polyfills');

const initParser = require('../dom-parser');

const getCategories = (url) => {
    console.log('Fetching categories list from', url);
    
    return fetch(url)
        .then((response) => {
            if(!response.ok) {
                throw new Error('Invalid url');
            }
            // console.log('do you even fetch, bro');
            return response.text();
        })
        .then(async (html) => {
            return initParser(html)
                .then((dom) => {
                    // console.log('fetched dom:', dom);
                    let links = dom.window.document.getElementsByClassName('absLink');
                    let hrefs = [];
                    for(let link of links) {
                        hrefs.push(link.href);
                    }
                    // console.log(hrefs);
                    return hrefs;
                })
                .catch(err => console.log("Problem with initParser getting html, error message:", err));
        });
};


module.exports = getCategories;
