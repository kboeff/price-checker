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

module.exports = (names, size) => {
    if(names === undefined || size === undefined || names.length === 0) {
        return {};
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
