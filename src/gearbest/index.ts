import { fetchDocument, createDocument } from '../common/network';
import { log, fixUrl_s, fixChars, delay } from '../common/utils';
import { fso, shell } from '../common/activex';
import { ieb, initIE, wait, getElementsByClassName } from '../loader/browser';
import { downloadFile, createFolder, saveToFile } from '../common/file';
const ROOT_CATALOG = 'gearbest_electronics';

export const parseGearbestPage = (url, pageIndex, positionIndex, existing) => {

    const productId = url.split('http://www.gearbest.com/')[1].split('.')[0].replace('/', '__');
    if (existing.includes(productId)) {
        log('existing' + productId);
        return;
    }

    let categoryName;
    let productInfo;
    let $;

    if (pageIndex === -1) {

        let description = '';
        try {

            ieb.Navigate(url);
            wait(url);

            $ = createDocument(ieb.document.body.innerHTML);
            /* should be replaced with valid selectors for gearbest page
            if ($('#signInField')[0] !== undefined || $('.advertise-main')[0] !== undefined) {
                return 'ITEM_REMOVED';
            }
            */

            description = $('.js_showtable.description')[0].innerText.split('You Might Also Consider')[0].trim();
            WScript.Sleep(10000);
        }
        catch (err) {
            initIE();
            return
        }

        const productName = $('.goods_info_inner h1')[0].innerText;
        const propertyList = '';

        const computedPrice = $('.goods_price .my_shop_price')[0].innerText;
        log(computedPrice);

        productInfo = {
            url,
            productName: fixChars(productName),
            propertyList: fixChars(propertyList),
            computedPrice,
            description: fixChars(description),
        };
    }
    else {
        categoryName = 'not_categorized';
        productInfo = {
            url,
            notParsed: true,
        };
    }

    if (pageIndex === -1) categoryName = 'not_categorized';

    createFolder(`${ROOT_CATALOG}/${categoryName}`);
    const folderName = `${categoryName}/${productId}`;
    createFolder(`${ROOT_CATALOG}/${folderName}`);


    saveToFile(`${ROOT_CATALOG}/${folderName}/productInfo.json`, JSON.stringify(productInfo));

    if (pageIndex === -1) {
        [...$('.n_thumbImg_item a')]
            .map(item => item.big)
            .forEach((item, index) => {
                downloadFile(item, `${ROOT_CATALOG}/${folderName}/${(index + 1000 + "").substr(1)}.${fso.getFileName(item).split('.')[1]}`);
            });
    }
};

export const fetchGearbestPage = (category, page) => {
    delay(10000);
    ieb.Navigate(category.replace('%PAGE_INDEX%', page));
    wait('parse category');
    return createDocument(ieb.document.body.innerHTML);};

export const parseGearbestCategory = (category, processPage) => {
    for (let i=1;i<=20;i++) processPage(fetchGearbestPage(category, i), i);
};

export const parseGearbest = (category, existingGoods) => {
    createFolder(ROOT_CATALOG);
    parseGearbestCategory(category, ($, pageIndex) => {
        [...$('.all_proNam a')]
            .forEach((item, positionIndex) =>{
                //if(positionIndex > 10) return;
                try {
                    parseGearbestPage(fixUrl_s(item.href), pageIndex, positionIndex, existingGoods);
                } catch (errrrr) {log('parsing page error'); WScript.Sleep(10000);}

            })
    });
};