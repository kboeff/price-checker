/*      This is the data that needs cleaning:
 *   
        name:
       'BRIMNES',
 *     'комбинация със стъклени вратички',
 *     '',
 *     '598,00 лв 2990 точки',
 
        size:
 *     'Ширина: 160 смДълбочина: 35 смВисочина: 190 см Още информация Сравни',
 *     'ново',
 *
*/

// !!!!!!!!!!!
// <div class="productTile active" data-id="11438" 
// data-product="30275564" data-product-data="[{"productRetailerPartNo":"30275564","productPriceAmount":100.00,"productOriginalPriceAmount":100.00,"productPriceCurrency":"BGN","productTitle":"стъклена врата","productCategory":"Врати BILLY","productQuantity":1}]" data-variant-fbq="[{"content_name":"стъклена врата","content_category":"Врати BILLY","content_ids":["30275564"],"content_type":"product","value":100.00,"currency":"BGN"}]">

module.exports = (names, size) => {
    if(names === undefined || size === undefined || names.length === 0) {
        return;
    }
    
    let name = [...names];
    while (name.length > 4) {
        name.shift();
    }
    let Cleared = {};
    // console.log(name, size, name[3], size[0]);
    
    let priceText = name[3].split(' лв');
    
    let sizeText = size[0].split(' см');
    
    Cleared.name = name[0];
    Cleared.description = name[1];
    Cleared.price = parseFloat(priceText[0].replace(',', '.'));
    
    for (let dim of sizeText) {
        if (dim.indexOf('Ширина: ') !== -1) {
             Cleared.width = parseInt(dim.replace('Ширина: ', ''));
        } else if(dim.indexOf('Височина: ') !== -1) {
             Cleared.height = parseInt(dim.replace('Височина: ', ''));
        } else if(dim.indexOf('Дълбочина: ') !== -1) {
             Cleared.depth = parseInt(dim.replace('Дълбочина: ', ''));
        }
    }
    return Cleared;
}
