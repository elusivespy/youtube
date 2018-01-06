"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var network_1 = require("../common/network");
var file_1 = require("../common/file");
var activex_1 = require("../common/activex");
var utils_1 = require("../common/utils");
var browser_1 = require("../loader/browser");
var ROOT_CATALOG = 'aliexpress_electronics';
var FULL_PARSING = false;
exports.fetchAliPage = function (category, page) {
    utils_1.delay(10000);
    browser_1.ieb.Navigate(category.replace('%PAGE_INDEX%', page));
    browser_1.wait('parse category');
    return network_1.createDocument(browser_1.ieb.document.body.innerHTML);
    //return fetchDocument(category.replace('%PAGE_INDEX%', page));
    //return fetchDocument(`https://www.aliexpress.com/premium/category/${category}/${page}.html?site=glo&SortType=total_tranpro_desc&tc=ppc&tag=&minPrice=10`);
};
exports.parseAliCategory = function (category, processPage) {
    for (var i = 1; i <= 20; i++)
        processPage(exports.fetchAliPage(category, i), i);
};
var deepLinkHash = '30e12e5c9935a27494e5ccc04ad4240c';
exports.configureAli = function () {
    browser_1.ieb.Navigate("http://aliexpress.com");
    browser_1.wait('aliexpress main page');
    utils_1.delay(4000);
    var $ = network_1.createDocument(browser_1.ieb.document.body.innerHTML);
    //ieb.document.body.innerText = (ieb.document.body.innerHTML);
    try {
        //$('[data-role=goto-globalsite]')[0].click();
        browser_1.getElementsByClassName(browser_1.ieb.document, 'link-goto-globalsite')[0].click();
        browser_1.wait('switch to en');
    }
    catch (err) {
        utils_1.log('goto global site not found');
    }
    try {
        //$('[data-role=menu]')[0].click();
        browser_1.ieb.document.getElementById('switcher-info').click();
        utils_1.delay(2000);
        browser_1.getElementsByClassName(browser_1.ieb.document, 'switcher-currency-c')[0].getElementsByTagName('li')[0].getElementsByTagName('a')[0].click();
        //$('[data-currency=USD]')[0].click();
        //$('[data-role=save]')[0].click();
        browser_1.getElementsByClassName(browser_1.ieb.document, 'switcher-btn')[0].getElementsByTagName('button')[0].click();
        browser_1.wait('switch currency');
    }
    catch (err) {
        utils_1.log('switch currency not found');
    }
};
/*
export const generateContent= (url) => {
    const productId = parseFloat(url.split('.html')[0].split('/').reverse()[0]);
    ieb.Navigate(`http://www.aliexpress.com/item//${productId}.html`);
    wait(url);

    shell.sendKeys('{F9}');
    const script = ieb.document.createElement('SCRIPT');
    script.innerHTML = `
        var node = document.createElement("div");
        node.style.position = 'fixed';
        node.style.width = '100%';
        node.style.height = '200px';
        node.style.background = 'black';
        node.style.opacity = '0.7';
        node.style.color = '#fff';
        node.style.fontSize = '42px';
        node.style.left = '0px';
        node.style.bottom = 'calc(50% - 100px)';
        node.style.display = 'flex';
        node.style.justifyContent = 'center';
        node.style.alignItems = 'center';
        node.style.zIndex = 9999999;
        node.innerHTML = 'To buy this item follow the link in video description';
        document.body.appendChild(node);
        var scrollOffset=0;
        setInterval(function() {window.scrollTo(0, scrollOffset+=document.body.scrollHeight/200)}, 0);
    `;
    ieb.document.body.appendChild(script);
    WScript.Sleep(30000);
    shell.sendKeys('{F9}');
}
*/
exports.generateContent = function (url, text) {
    var productId = parseFloat(url.split('.html')[0].split('/').reverse()[0]);
    browser_1.ieb.Navigate("http://www.aliexpress.com/item//" + productId + ".html");
    browser_1.wait(url);
    var $ = network_1.createDocument(browser_1.ieb.document.body.innerHTML);
    if ($('.image-thumb-list .img-thumb-item img').slice().length === 0) {
        return 'error';
    }
    //ieb.document.body.style.backgroundSize = 'contain';
    //ieb.document.body.style.backgroundPosition = 'center';
    //ieb.document.body.style.backgroundRepeat = 'no-repeat';
    //ieb.document.getElementsByTagName('html')[0].style.height = '100%';
    //ieb.document.getElementsByTagName('html')[0].style.minHeight = '100%';
    //ieb.document.body.style.height = '100%';
    browser_1.ieb.document.body.style.textAlign = 'center';
    browser_1.ieb.document.body.style.overflow = 'hidden';
    //ieb.document.body.innerHTML = '';
    var videoLength = 50000 + Math.floor(Math.random() * 20000);
    var script = browser_1.ieb.document.createElement('SCRIPT');
    script.innerHTML = "\n        window.alert = function() {};\n        var imagesNodes = document.querySelectorAll('.image-thumb-list .img-thumb-item img');\n        var imagesList = [];\n        for (var i=0;i<imagesNodes.length;i++) {\n            imagesList.push(imagesNodes[i].src.split('_50x50')[0]);\n        }\n        var divs = document.getElementsByTagName('div');\n        for (var i=0;i<divs.length;i++) divs[i].innerHTML = '';\n        var node = document.createElement(\"div\");  \n        node.style.position = 'fixed';\n        node.style.width = '100%';\n        node.style.height = '200px';\n        node.style.background = 'black';\n        node.style.opacity = '0.7';\n        node.style.color = '#fff';\n        node.style.fontSize = '42px'; \n        node.style.left = '0px';\n        node.style.bottom = 'calc(50% - 100px)';\n        node.style.display = 'flex';\n        node.style.justifyContent = 'center';\n        node.style.alignItems = 'center';\n        node.style.zIndex = 9999999;\n        node.innerHTML = '" + text + "';\n        setTimeout(function() {node.style.display = 'none';}, 15000);\n        document.body.appendChild(node);  \n        \n        for(var i=0;i<15;i++) {\n            let node = document.createElement(\"img\");  \n            node.style.width = '100%';\n            node.src = imagesList[i%imagesList.length];\n            document.body.appendChild(node); \n        }\n        \n        var scrollOffset=0;\n        //setInterval(function() {window.scrollTo(0, scrollOffset+=3)}, 0);\n        document.body.style.transition = '" + (videoLength + 3000) + "ms';\n        document.body.style.transform = 'translate(0, -50%)';\n    ";
    browser_1.ieb.document.body.appendChild(script);
    WScript.Sleep(1000);
    activex_1.shell.sendKeys('{F9}');
    WScript.Echo('START recording');
    WScript.Sleep(videoLength - 10000);
    activex_1.shell.sendKeys('{F9}');
    WScript.Echo('Finish recording');
};
exports.parseAliPage = function (url, pageIndex, positionIndex, existing) {
    var productId = parseFloat(url.split('.html')[0].split('/').reverse()[0]);
    if (existing.includes(productId)) {
        utils_1.log('existing' + productId);
        return;
    }
    var categoryName;
    var productInfo;
    var $;
    if (FULL_PARSING || pageIndex === -1) {
        var description = '';
        try {
            //ieb.Navigate(url);
            //wait(url);
            browser_1.ieb.Navigate("http://www.aliexpress.com/item//" + productId + ".html");
            browser_1.wait(url);
            //hotfix for parsing
            //actions.ali_google();
            //wait(url);
            /*
            actions.parser_password();
            'dy54bd6y'.split('').forEach(letter => {shell.sendKeys(letter);delay(700)});
            actions.parser_submit();
            wait(url);
            actions.parser_access();
            wait(url);
            */
            $ = network_1.createDocument(browser_1.ieb.document.body.innerHTML);
            if ($('#signInField')[0] !== undefined || $('.advertise-main')[0] !== undefined) {
                return 'ITEM_REMOVED';
            }
            var descrNode = browser_1.getElementsByClassName(browser_1.ieb.document.body, 'description-content')[0];
            description = descrNode && descrNode.innerText || '';
            WScript.Sleep(10000);
        }
        catch (err) {
            browser_1.initIE();
            return;
        }
        utils_1.log(description);
        var productName = $('.product-name')[0].innerText;
        var propertyList = $('.product-property-list')[0].innerText;
        categoryName = utils_1.fixChars($('.ui-breadcrumb h2 a')[0].title).toLowerCase().split(' ').join('_');
        /*

         let currency = $('[itemprop="currency"]')[0];
         let priceCurrency = $('[itemprop="priceCurrency"]')[0];
         let price = $('[itemprop="price"]')[0];
         let lowPrice = $('[itemprop="lowPrice"]')[0];
         let highPrice = $('[itemprop="highPrice"]')[0];



         currency = currency && currency.innerText;
         priceCurrency = priceCurrency && priceCurrency.innerText;
         price = price && price.innerText;
         lowPrice = lowPrice && lowPrice.innerText;
         highPrice = highPrice && highPrice.innerText;



         const computedPrice = `${currency || priceCurrency || ''}${price || lowPrice || highPrice}`;
         */
        var computedPrice = $('.p-symbol')[0].innerText + $('.p-price')[0].innerText;
        utils_1.log(computedPrice);
        productInfo = {
            url: url,
            productName: utils_1.fixChars(productName),
            propertyList: utils_1.fixChars(propertyList),
            computedPrice: computedPrice,
            description: description,
        };
    }
    else {
        categoryName = 'not_categorized';
        productInfo = {
            url: url,
            notParsed: true,
        };
    }
    if (pageIndex === -1)
        categoryName = 'not_categorized';
    file_1.createFolder(ROOT_CATALOG + "/" + categoryName);
    var folderName = categoryName + "/" + productId;
    file_1.createFolder(ROOT_CATALOG + "/" + folderName);
    file_1.saveToFile(ROOT_CATALOG + "/" + folderName + "/productInfo.json", JSON.stringify(productInfo));
    if (FULL_PARSING || pageIndex === -1) {
        $('.image-thumb-list .img-thumb-item img').slice().map(function (item) { return item.src.split('_50x50')[0]; })
            .forEach(function (item, index) {
            file_1.downloadFile(item, ROOT_CATALOG + "/" + folderName + "/" + (index + 1000 + "").substr(1) + "." + activex_1.fso.getFileName(item).split('.')[1]);
        });
    }
};
exports.parseAliExpress = function (category, existingGoods) {
    file_1.createFolder(ROOT_CATALOG);
    exports.parseAliCategory(category, function ($, pageIndex) {
        $('.list-item a.product').slice().forEach(function (item, positionIndex) {
            //if(positionIndex > 10) return;
            try {
                exports.parseAliPage(utils_1.fixUrl_s(item.href), pageIndex, positionIndex, existingGoods);
            }
            catch (errrrr) {
                utils_1.log('parsing page error');
                WScript.Sleep(10000);
            }
        });
    });
};
exports.parsePredefinedList = function (list, existingGoods) {
    file_1.createFolder(ROOT_CATALOG);
    list.forEach(function (url, index) {
        exports.parseAliPage(url, 'predefined', index, existingGoods);
    });
};
