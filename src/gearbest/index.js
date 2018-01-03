"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var network_1 = require("../common/network");
var utils_1 = require("../common/utils");
var activex_1 = require("../common/activex");
var browser_1 = require("../loader/browser");
var file_1 = require("../common/file");
var ROOT_CATALOG = 'gearbest_electronics';
exports.parseGearbestPage = function (url, pageIndex, positionIndex, existing) {
    var productId = url.split('http://www.gearbest.com/')[1].split('.')[0].replace('/', '__');
    if (existing.includes(productId)) {
        utils_1.log('existing' + productId);
        return;
    }
    var categoryName;
    var productInfo;
    var $;
    if (pageIndex === -1) {
        var description = '';
        try {
            browser_1.ieb.Navigate(url);
            browser_1.wait(url);
            $ = network_1.createDocument(browser_1.ieb.document.body.innerHTML);
            /* should be replaced with valid selectors for gearbest page
            if ($('#signInField')[0] !== undefined || $('.advertise-main')[0] !== undefined) {
                return 'ITEM_REMOVED';
            }
            */
            description = $('.js_showtable.description')[0].innerText.split('You Might Also Consider')[0].trim();
            WScript.Sleep(10000);
        }
        catch (err) {
            browser_1.initIE();
            return;
        }
        var productName = $('.goods_info_inner h1')[0].innerText;
        var propertyList = '';
        var computedPrice = $('.goods_price .my_shop_price')[0].innerText;
        utils_1.log(computedPrice);
        productInfo = {
            url: url,
            productName: utils_1.fixChars(productName),
            propertyList: utils_1.fixChars(propertyList),
            computedPrice: computedPrice,
            description: utils_1.fixChars(description),
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
    if (pageIndex === -1) {
        $('.n_thumbImg_item a').slice().map(function (item) { return item.big; })
            .forEach(function (item, index) {
            file_1.downloadFile(item, ROOT_CATALOG + "/" + folderName + "/" + (index + 1000 + "").substr(1) + "." + activex_1.fso.getFileName(item).split('.')[1]);
        });
    }
};
exports.fetchGearbestPage = function (category, page) {
    utils_1.delay(10000);
    browser_1.ieb.Navigate(category.replace('%PAGE_INDEX%', page));
    browser_1.wait('parse category');
    return network_1.createDocument(browser_1.ieb.document.body.innerHTML);
};
exports.parseGearbestCategory = function (category, processPage) {
    for (var i = 1; i <= 20; i++)
        processPage(exports.fetchGearbestPage(category, i), i);
};
exports.parseGearbest = function (category, existingGoods) {
    file_1.createFolder(ROOT_CATALOG);
    exports.parseGearbestCategory(category, function ($, pageIndex) {
        $('.all_proNam a').slice().forEach(function (item, positionIndex) {
            //if(positionIndex > 10) return;
            try {
                exports.parseGearbestPage(utils_1.fixUrl_s(item.href), pageIndex, positionIndex, existingGoods);
            }
            catch (errrrr) {
                utils_1.log('parsing page error');
                WScript.Sleep(10000);
            }
        });
    });
};
