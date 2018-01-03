import './common/polyfills';
import { log, me, delay, shuffle, mixWords } from './common/utils';
import { fso, shell } from './common/activex';
import { getShortLink } from './common/shortlink';
import { getFilesList, getFilesListAbsolute, getSubFoldersList, readFile, execute, executeLocal, executeLocalBackground, saveToFile } from './common/file';
import { parseAliExpress, parseAliPage, configureAli, generateContent } from './aliexpress';
import { parseGearbestPage, parseGearbest } from './gearbest';
import { ELECTRONICS_LIST, GENERAL_LIST, ELECTRONICS_NEW } from './aliexpress/categories';
import { GEARBEST_ELECTRONICS } from './gearbest/categories';
import {resizeFiles, makeAliVideo, makeAliVideoZoomFade, makeAdultZoomFade } from './common/resize';
import { getProxy } from './common/proxy';
import { initIE } from './loader/browser';
import { login, uploadPhotoArray, uploadVideo, generateVideoFromImage, enterEditor, changeInfoAll, ChangeInfo } from './loader/youtube';
import { session, cache } from './common/session';
import { hasUploadedProductId, addUploadedProductId } from './aliexpress/uploadedIds';
import { isUsedWords, processTitle } from './common/text';
import { init as initAdult } from './scenarios/adult';

const gearProductId = url => url.split('http://www.gearbest.com/')[1].split('.')[0].replace('/', '__');
const aliProductId = url => parseFloat(url.split('.html')[0].split('/').reverse()[0]);

const gearLink = url => `http://epnclick.ru/redirect/cpa/o/osh9ruzjytl23vnxy773ze6l67lxz8i4/?to=${encodeURIComponent(url)}`;
const aliLink = url => `http://alipromo.com/redirect/product/30e12e5c9935a27494e5ccc04ad4240c/${aliProductId(url)}/en`;

let currentIndex = 0;
const UPLOADING_DELAY = 8 * 60000;
const ENABLE_PROXY = true;


const ROOT_CATALOG = 'aliexpress_electronics';
const PARSER_FULL_ALGORITHM = parseAliPage;
const PRODUCT_ID_ALGORITHM = aliProductId;
const LINK_ALGORITHM = aliLink;
const ENABLE_CACHE = true;
const PARSER_SOURCE = ELECTRONICS_NEW;
const PARSER_MODE = false;

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

const adultSource = [
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
let flattenFoldersList;

if (ENABLE_CACHE && cache('flattenFoldersList') && cache('flattenFoldersList').length > 0) {
   log('USING CACHE!!!!');
   flattenFoldersList = cache('flattenFoldersList');
}
else {
    log('NO CACHE!!!!');
    const treeFoldersList = getSubFoldersList(ROOT_CATALOG)
        .map(item => item.split('storage\\')[1]).map(category => (
                getSubFoldersList(category).map(item => item.split('storage\\')[1])
            )
        );

    let doneCount = 0;
    flattenFoldersList = [];
    do {
        doneCount = 0;
        treeFoldersList.forEach((item, index) =>
            treeFoldersList[index].length > 0 ?
                flattenFoldersList.push(treeFoldersList[index].splice(0, 1)) : doneCount++
        );
    } while (doneCount < treeFoldersList.length);

    if (ENABLE_CACHE) {
        cache('flattenFoldersList', flattenFoldersList);
        log('cached successful');
    }
}

if (PARSER_MODE) {
    const existingGoods = flattenFoldersList.map(currentProductFolder => {
        try {
            const data = JSON.parse(readFile(`${currentProductFolder}\\productInfo.json`));
            return PRODUCT_ID_ALGORITHM(data.url);
        } catch (eeee) {return 0;}

    });
    initIE();
    PARSER_SOURCE.forEach(item => {
        parseAliExpress(item, existingGoods);
    });

    WScript.Quit();
}

shuffle(flattenFoldersList);

execute('tskill wscript');
execute('tskill upload');
executeLocalBackground('security_fix.js');

if (ENABLE_PROXY) {
    executeLocal(`proxy`);
    delay(2000);
    executeLocal(`proxy socks=${getProxy()}`);
}
delay(3000);


//login('cyrmusrlogaianouva', 'xEdB0NNVXA7');
//configureAli();
flattenFoldersList.forEach(currentProductFolder => {

    //let uploadSource = getFilesList('aliexpress_electronics\\not_categorized\\373511572');

    try {
        let data;
        try {
            data = JSON.parse(readFile(`${currentProductFolder}\\productInfo.json`));
        }
        catch(error) {log('broken product file. try next...'); return;}
        const productId = PRODUCT_ID_ALGORITHM(data.url);

        //const productSEOName = processTitle(data.url.split('item/')[1].split('/')[0].replace(/[-]/g, ' '));
        //if (isUsedWords(productSEOName)) return;
/*
        if (hasUploadedProductId(productId)) {
            log('video already uploaded');
            return;
        }

 */
        addUploadedProductId(productId);

        if (data.notParsed) {
            log('Not parsed. Will be parsed now...');
            initIE();
            if (PARSER_FULL_ALGORITHM(data.url, -1, -1, []) === 'ITEM_REMOVED') {
                throw { message: 'ITEM_REMOVED' };
            }
            data = JSON.parse(readFile(`${currentProductFolder}\\productInfo.json`));
        } else {
            log('Parsed uploading...');
            initIE();
        }


        let productName = processTitle(data.productName).substr(0, 100); //productSEOName;

        const price = (data.computedPrice === 'undefined' ? '': data.computedPrice);
        const propertyList = data.propertyList.split('   ').join('\r\n').split('  ').join(': ');
        const description = data.description;

        //initIE();
        let uploadSource = getFilesList(currentProductFolder);


        //        http://${getShortLink('getalinew', { productid: productId })}\r\n

        const titlePrice = price.indexOf('$')!==-1 ? ('$' + price.split('$')[1].split(' ')[0] + ' ') : '';

        const inform = `${LINK_ALGORITHM(data.url)} - ${productName}\r\n
            \r\n
            \r\n
            ${propertyList}
            ${description.substr(0, 4500)}
        `;



        resizeFiles(uploadSource, 1280, 720);

        WScript.Sleep(5000);
        const priceValue = +price.split('$')[1].split(' ')[0];
        const justMakedVideoPath = makeAliVideoZoomFade(uploadSource, titlePrice, `${priceValue < 1 ? Math.floor(priceValue * 100) / 100 : titlePrice.split('.')[0]} ${productName}`);
        const justUploaded = uploadVideo(justMakedVideoPath, inform);

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



        if (justUploaded.status === 'CLAIM') WScript.Quit();

        delay(UPLOADING_DELAY - justUploaded.totalTime < 0 ? 0 : UPLOADING_DELAY - justUploaded.totalTime);

        if (fso.fileExists(justMakedVideoPath)) {
            fso.getFile(justMakedVideoPath).Delete();
        }

    } catch(someerr) {
        log(someerr.message);
        if (someerr.message !== 'ITEM_REMOVED') {
            delay(UPLOADING_DELAY);
        } else {
            log('ITEM REMOVED');
            delay(60000);
            if (ENABLE_PROXY) {
               executeLocal(`proxy socks=${getProxy()}`);
            }
        }
    }

});

