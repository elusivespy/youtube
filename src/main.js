"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("./common/polyfills");
var utils_1 = require("./common/utils");
var activex_1 = require("./common/activex");
var file_1 = require("./common/file");
var aliexpress_1 = require("./aliexpress");
var categories_1 = require("./aliexpress/categories");
var resize_1 = require("./common/resize");
var proxy_1 = require("./common/proxy");
var browser_1 = require("./loader/browser");
var youtube_1 = require("./loader/youtube");
var session_1 = require("./common/session");
var uploadedIds_1 = require("./aliexpress/uploadedIds");
var text_1 = require("./common/text");
var gearProductId = function (url) { return url.split('http://www.gearbest.com/')[1].split('.')[0].replace('/', '__'); };
var aliProductId = function (url) { return parseFloat(url.split('.html')[0].split('/').reverse()[0]); };
var gearLink = function (url) { return "http://epnclick.ru/redirect/cpa/o/osh9ruzjytl23vnxy773ze6l67lxz8i4/?to=" + encodeURIComponent(url); };
var aliLink = function (url) { return "http://alipromo.com/redirect/product/30e12e5c9935a27494e5ccc04ad4240c/" + aliProductId(url) + "/en"; };
var currentIndex = 0;
var UPLOADING_DELAY = 8 * 60000;
var ENABLE_PROXY = true;
var ROOT_CATALOG = 'aliexpress_electronics';
var PARSER_FULL_ALGORITHM = aliexpress_1.parseAliPage;
var PRODUCT_ID_ALGORITHM = aliProductId;
var LINK_ALGORITHM = aliLink;
var ENABLE_CACHE = true;
var PARSER_SOURCE = categories_1.ELECTRONICS_NEW;
var PARSER_MODE = false;
/*

const ROOT_CATALOG = 'gearbest_electronics';
const PARSER_FULL_ALGORITHM = parseGearbestPage;
const PRODUCT_ID_ALGORITHM = gearProductId;
const LINK_ALGORITHM = gearLink;
const ENABLE_CACHE = false;
const PARSER_SOURCE = GEARBEST_ELECTRONICS;
const PARSER_MODE = false;

 */
//changeInfoAll(1000);
//getShortLink('getalinew', { productid: 123 });
//initIE();
//parseGearbestPage('http://www.gearbest.com/cases-leather/pp_448894.html', -1, -1, []);
/*
initIE();
GEARBEST_ELECTRONICS.forEach(item => {
    parseGearbest(item, []);
});

WScript.Quit();
*/
/*
 5.39.47.9:42931
 5.39.47.9:42932
*/
//parseAliExpress(ALI.PHONES_AND_TELECOMMUNICATION);
var adultSource = [
    "Women Casual Leggings Fitness Winter Jeggings New Arrival Ladies Plain Elastic Waist Color Pants Block Mesh Insert Leggings 6012",
    "Dropship Leggings Jeans for Women Denim Pants with Pocket Slim Jeggings Fitness Plus Size Leggins S-XXL Black/Gray/Blue KL0055",
    "SHEIN Ladies Side Striped Skinny Pants High Waist Woman Pants Casual Women Autumn Black Zipper Fly Skinny Trousers",
    "OHVERA Suede Bodycon Mid Waist Pants Capris Leggings Lace Up Burr Hole Sexy Trousers Women Black Pencil Pants Female Bottom",
    "SHEIN Striped Side Tailored Wide Leg Pants Green High Waisted Pants Zipper Fly Casual Trousers Elegant Loose Pants",
    "Simenual 2017 Hot sale patchwork heart hip leggings sportswear for women bodybuilding grey slim sexy legging female pants sale",
    "NADANBAO Autumn Women Leggings Fresh Lotus Printing Woman Leggins Aztec Round Ombre Fitness Trousers",
    "bikini new women bikini set rhinestone swimsear bikini bottom",
    "GareMay Winter High Waisted Outer Wear Women female skinny",
    "LASPERAL Elegant Irregular Ruffles Women High Waist Loose",
    "CWLSP Autumn Winter High Waist Jeans For Women Back Zipper",
    "Tengeio Summer Boyfriend Jeans For Women Vintage High Waist",
    "SEJIAN BIG size Winter Women High Waist Elastic Casual",
    "Aselnn Spring summer Women Vertical Striped Pants Female",
    "SHEIN Rise Piped Dress Army Women High Waist Zipper Fly",
    "Future Time Boyfriend Jeans For Women Vintage Distressed",
    "GOPLUS Slim Pencil Pants Vintage High Waist Jeans loose",
    "GCAROL Euro Classic Women High Waist Vintage Slim Mom Style",
    "GareMay Skirt for Women All Fit Tutu School White Back",
    "Female Denim Candy Color Jeans Donna Stretch Skinny Tataria",
    "aosheng Women sweatpant Camouflage Jogger Harem Loose",
    "Kuk 10 Color Women Casual Side Striped High Waist",
    "hirigin Summer Women Corduroy Overall Vest Jumpsuit Braces",
    "Aselnn Spring Women Casual Elastic Waist Skinny",
    "Tresdin Women's Clothing Candy Colors Pants Elastic Women",
    "ITFABS Women Hole Destroyed Ripped Distressed Slim Denim",
    "GAREMAY Candy Pencil Spring Fall Khaki Pants For Women",
    "Eastdamo Slim Jeans For Women Skinny High Waist Blue Denim",
    "RZIV 2017 woman casual stretch denim solid color waist",
    "WSUNSEXE Knee Hole Ripped Jeans Women Slim Fit Low Waist",
    "NVZHUREN Denim Pants Women Elastic High Waist Skinny",
    "AISIDE Plus Size Stretch High Waist Skinny Jeans Female",
    "CHRLEISURE S-XXL Loose Elastic Trousers for Women",
    "Makuluya gift BETTER fabric women elastic high waist formal",
    "RAGEDEOR 2016 Skinny Jeans Women Denim Holes Destroyed Knee",
    "JQISGKVO autumn winter after opening stretch bag hip pencil",
    "SETWIGG Winter Wool Blend Plaid Irregular A-line",
    "MXTOPPY Women Summer Denim Skirts High Waist Mini",
    "20 Colors Plus Size Women Spring Summer Casual Jeans Skinny",
    "FFLMYUHULIU Casual Women Chiffon Elastic Waist Solid Color",
    "Hzirip Summer High Waist Womens Pockets Button Denim Skirt",
    "Women High Waist Elastic Casual Solid Regular AIYANGA",
    "WannaThis Hugcitar women high waist elastic solid casual",
    "saimishi Super Deals Women Suede Pencil Skirt Knee Length",
    "MXTOPPY Korean Pencil Pants Candy Color Skinny Jeans Women",
    "Simplee Vintage grid casual women bottom Zipper suit",
    "wangcangli women fleece pants Loose winter thicken Elastic",
    "Simplee Apparel OL chiffon high waist Women style casual"
];
/*
const ADULT_DELAY = 3 * 60000;
const skip = 4;
let uploadSource = getFilesList(`adult`);
initIE();
for (let i=skip,len=adultSource.length;i<len;i++) {
    const videoName = processTitle(adultSource[i]).substr(0, 100);
    const justMakedVideoPath = makeAdultZoomFade(uploadSource.slice(i * 3, i * 3 + 3), videoName);
    const inform = `http://${getShortLink('getalinew', {})} - ${videoName}\r\n
            \r\n
            \r\n
        `;
    const justUploaded = uploadVideo(justMakedVideoPath, inform);

    if (justUploaded.status === 'CLAIM') WScript.Quit();

    delay(ADULT_DELAY - justUploaded.totalTime < 0 ? 0 : ADULT_DELAY - justUploaded.totalTime);

    if (fso.fileExists(justMakedVideoPath)) {
        fso.getFile(justMakedVideoPath).Delete();
    }
}

WScript.Quit();
*/
var flattenFoldersList;
if (ENABLE_CACHE && session_1.cache('flattenFoldersList') && session_1.cache('flattenFoldersList').length > 0) {
    utils_1.log('USING CACHE!!!!');
    flattenFoldersList = session_1.cache('flattenFoldersList');
}
else {
    utils_1.log('NO CACHE!!!!');
    var treeFoldersList_1 = file_1.getSubFoldersList(ROOT_CATALOG)
        .map(function (item) { return item.split('storage\\')[1]; }).map(function (category) { return (file_1.getSubFoldersList(category).map(function (item) { return item.split('storage\\')[1]; })); });
    var doneCount_1 = 0;
    flattenFoldersList = [];
    do {
        doneCount_1 = 0;
        treeFoldersList_1.forEach(function (item, index) {
            return treeFoldersList_1[index].length > 0 ?
                flattenFoldersList.push(treeFoldersList_1[index].splice(0, 1)) : doneCount_1++;
        });
    } while (doneCount_1 < treeFoldersList_1.length);
    if (ENABLE_CACHE) {
        session_1.cache('flattenFoldersList', flattenFoldersList);
        utils_1.log('cached successful');
    }
}
if (PARSER_MODE) {
    var existingGoods_1 = flattenFoldersList.map(function (currentProductFolder) {
        try {
            var data = JSON.parse(file_1.readFile(currentProductFolder + "\\productInfo.json"));
            return PRODUCT_ID_ALGORITHM(data.url);
        }
        catch (eeee) {
            return 0;
        }
    });
    browser_1.initIE();
    PARSER_SOURCE.forEach(function (item) {
        aliexpress_1.parseAliExpress(item, existingGoods_1);
    });
    WScript.Quit();
}
utils_1.shuffle(flattenFoldersList);
file_1.execute('tskill wscript');
file_1.execute('tskill upload');
file_1.executeLocalBackground('security_fix.js');
if (ENABLE_PROXY) {
    file_1.executeLocal("proxy");
    utils_1.delay(2000);
    file_1.executeLocal("proxy socks=" + proxy_1.getProxy());
}
utils_1.delay(3000);
//login('cyrmusrlogaianouva', 'xEdB0NNVXA7');
//configureAli();
flattenFoldersList.forEach(function (currentProductFolder) {
    //let uploadSource = getFilesList('aliexpress_electronics\\not_categorized\\373511572');
    try {
        var data = void 0;
        try {
            data = JSON.parse(file_1.readFile(currentProductFolder + "\\productInfo.json"));
        }
        catch (error) {
            utils_1.log('broken product file. try next...');
            return;
        }
        var productId = PRODUCT_ID_ALGORITHM(data.url);
        //const productSEOName = processTitle(data.url.split('item/')[1].split('/')[0].replace(/[-]/g, ' '));
        //if (isUsedWords(productSEOName)) return;
        /*
                if (hasUploadedProductId(productId)) {
                    log('video already uploaded');
                    return;
                }
        
         */
        uploadedIds_1.addUploadedProductId(productId);
        if (data.notParsed) {
            utils_1.log('Not parsed. Will be parsed now...');
            browser_1.initIE();
            if (PARSER_FULL_ALGORITHM(data.url, -1, -1, []) === 'ITEM_REMOVED') {
                throw { message: 'ITEM_REMOVED' };
            }
            data = JSON.parse(file_1.readFile(currentProductFolder + "\\productInfo.json"));
        }
        else {
            utils_1.log('Parsed uploading...');
            browser_1.initIE();
        }
        var productName = text_1.processTitle(data.productName).substr(0, 100); //productSEOName;
        var price = (data.computedPrice === 'undefined' ? '' : data.computedPrice);
        var propertyList = data.propertyList.split('   ').join('\r\n').split('  ').join(': ');
        var description = data.description;
        //initIE();
        var uploadSource = file_1.getFilesList(currentProductFolder);
        //        http://${getShortLink('getalinew', { productid: productId })}\r\n
        var titlePrice = price.indexOf('$') !== -1 ? ('$' + price.split('$')[1].split(' ')[0] + ' ') : '';
        var inform = LINK_ALGORITHM(data.url) + " - " + productName + "\r\n\n            \r\n\n            \r\n\n            " + propertyList + "\n            " + description.substr(0, 4500) + "\n        ";
        resize_1.resizeFiles(uploadSource, 1280, 720);
        WScript.Sleep(5000);
        var priceValue = +price.split('$')[1].split(' ')[0];
        var justMakedVideoPath = resize_1.makeAliVideoZoomFade(uploadSource, titlePrice, (priceValue < 1 ? Math.floor(priceValue * 100) / 100 : titlePrice.split('.')[0]) + " " + productName);
        var justUploaded = youtube_1.uploadVideo(justMakedVideoPath, inform);
        /*//BANDICAM

        const bandicamFolder = `${shell.SpecialFolders.Item('MyDocuments')}\\Bandicam`;

        getFilesListAbsolute(bandicamFolder).forEach(file => fso.getFile(file).Delete());

        if (generateContent(data.url, `Buy this product only for ${titlePrice || price}<br>Follow the link in the description below`) === 'error') {
            WScript.Echo('Impossible to create content');
            return;
        }

        const justMakedVideoPath = getFilesListAbsolute(bandicamFolder)[0];
        WScript.Echo(justMakedVideoPath);
        WScript.Sleep(15000);

        const fileName = `${+titlePrice.replace('$','') < 1 ? Math.floor(+titlePrice.replace('$','') * 100) / 100 : titlePrice.split('.')[0]} ${productName}.avi`;
        fso.getFile(justMakedVideoPath).Move(`${bandicamFolder}\\${fileName}`);
        const newPath = `${bandicamFolder}\\${fileName}`;
        const justUploaded = uploadVideo(newPath, inform);

         WScript.Sleep(5000);
         fso.getFile(newPath).Delete();

         // BANDICAM END */
        if (justUploaded.status === 'CLAIM')
            WScript.Quit();
        utils_1.delay(UPLOADING_DELAY - justUploaded.totalTime < 0 ? 0 : UPLOADING_DELAY - justUploaded.totalTime);
        if (activex_1.fso.fileExists(justMakedVideoPath)) {
            activex_1.fso.getFile(justMakedVideoPath).Delete();
        }
    }
    catch (someerr) {
        utils_1.log(someerr.message);
        if (someerr.message !== 'ITEM_REMOVED') {
            utils_1.delay(UPLOADING_DELAY);
        }
        else {
            utils_1.log('ITEM REMOVED');
            utils_1.delay(60000);
            if (ENABLE_PROXY) {
                file_1.executeLocal("proxy socks=" + proxy_1.getProxy());
            }
        }
    }
});
