import { fetchDocument, createDocument } from '../common/network';
import { downloadFile, createFolder, saveToFile } from '../common/file';
import { fso, shell } from '../common/activex';
import { log, fixUrl_s, fixChars, delay } from '../common/utils';
import actions from '../loader/youtube/mouse';
import { ieb, initIE, wait, getElementsByClassName } from '../loader/browser';

const ROOT_CATALOG = 'aliexpress_electronics';
const FULL_PARSING = false;

export const fetchAliPage = (category, page) => {
    delay(10000);
    ieb.Navigate(category.replace('%PAGE_INDEX%', page));
    wait('parse category');
    return createDocument(ieb.document.body.innerHTML);
    //return fetchDocument(category.replace('%PAGE_INDEX%', page));
    //return fetchDocument(`https://www.aliexpress.com/premium/category/${category}/${page}.html?site=glo&SortType=total_tranpro_desc&tc=ppc&tag=&minPrice=10`);
};

export const parseAliCategory = (category, processPage) => {
    for (let i=1;i<=20;i++) processPage(fetchAliPage(category, i), i);
};

const deepLinkHash = '30e12e5c9935a27494e5ccc04ad4240c';

export const configureAli = () => {
    ieb.Navigate("http://aliexpress.com");
    wait('aliexpress main page');
    delay(4000);
    const $ = createDocument(ieb.document.body.innerHTML);
    //ieb.document.body.innerText = (ieb.document.body.innerHTML);


    try {
        //$('[data-role=goto-globalsite]')[0].click();
        getElementsByClassName(ieb.document, 'link-goto-globalsite')[0].click();
        wait('switch to en');
    } catch (err) {
        log('goto global site not found')
    }
    try {
        //$('[data-role=menu]')[0].click();
        ieb.document.getElementById('switcher-info').click();
        delay(2000);
        getElementsByClassName(ieb.document, 'switcher-currency-c')[0].getElementsByTagName('li')[0].getElementsByTagName('a')[0].click();

        //$('[data-currency=USD]')[0].click();
        //$('[data-role=save]')[0].click();
        getElementsByClassName(ieb.document, 'switcher-btn')[0].getElementsByTagName('button')[0].click();

        wait('switch currency')
    } catch (err) {
        log('switch currency not found')
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

export const generateContent= (url, text) => {
    const productId = parseFloat(url.split('.html')[0].split('/').reverse()[0]);
    ieb.Navigate(`http://www.aliexpress.com/item//${productId}.html`);
    wait(url);
    const $ = createDocument(ieb.document.body.innerHTML);
    if ([...$('.image-thumb-list .img-thumb-item img')].length === 0) {
        return 'error';
    }


    //ieb.document.body.style.backgroundSize = 'contain';
    //ieb.document.body.style.backgroundPosition = 'center';
    //ieb.document.body.style.backgroundRepeat = 'no-repeat';
    //ieb.document.getElementsByTagName('html')[0].style.height = '100%';
    //ieb.document.getElementsByTagName('html')[0].style.minHeight = '100%';
    //ieb.document.body.style.height = '100%';
    ieb.document.body.style.textAlign = 'center';
    ieb.document.body.style.overflow = 'hidden';
    //ieb.document.body.innerHTML = '';

    const videoLength = 50000 + Math.floor(Math.random() * 20000);


    const script = ieb.document.createElement('SCRIPT');
    script.innerHTML = `
        window.alert = function() {};
        var imagesNodes = document.querySelectorAll('.image-thumb-list .img-thumb-item img');
        var imagesList = [];
        for (var i=0;i<imagesNodes.length;i++) {
            imagesList.push(imagesNodes[i].src.split('_50x50')[0]);
        }
        var divs = document.getElementsByTagName('div');
        for (var i=0;i<divs.length;i++) divs[i].innerHTML = '';
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
        node.innerHTML = '${text}';
        setTimeout(function() {node.style.display = 'none';}, 15000);
        document.body.appendChild(node);  
        
        for(var i=0;i<15;i++) {
            let node = document.createElement("img");  
            node.style.width = '100%';
            node.src = imagesList[i%imagesList.length];
            document.body.appendChild(node); 
        }
        
        var scrollOffset=0;
        //setInterval(function() {window.scrollTo(0, scrollOffset+=3)}, 0);
        document.body.style.transition = '${videoLength + 3000}ms';
        document.body.style.transform = 'translate(0, -50%)';
    `;

    ieb.document.body.appendChild(script);

    WScript.Sleep(1000);
    shell.sendKeys('{F9}');
    WScript.Echo('START recording');
    WScript.Sleep(videoLength - 10000);
    shell.sendKeys('{F9}');
    WScript.Echo('Finish recording');
};

export const parseAliPage = (url, pageIndex, positionIndex, existing) => {

    const productId = parseFloat(url.split('.html')[0].split('/').reverse()[0]);
    if (existing.includes(productId)) {
        log('existing' + productId);
        return;
    }

    let categoryName;
    let productInfo;
    let $;

    if (FULL_PARSING || pageIndex === -1) {

        let description = '';
        try {
            //ieb.Navigate(url);
            //wait(url);

            ieb.Navigate(`http://www.aliexpress.com/item//${productId}.html`);
            wait(url);

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

            $ = createDocument(ieb.document.body.innerHTML);
            if ($('#signInField')[0] !== undefined || $('.advertise-main')[0] !== undefined) {
                return 'ITEM_REMOVED';
            }

            const descrNode = getElementsByClassName(ieb.document.body, 'description-content')[0];
            description = descrNode && descrNode.innerText || '';
            WScript.Sleep(10000);
        }
        catch (err) {
            initIE();
            return
        }
        log(description);

        const productName = $('.product-name')[0].innerText;
        const propertyList = $('.product-property-list')[0].innerText;
        categoryName = fixChars($('.ui-breadcrumb h2 a')[0].title).toLowerCase().split(' ').join('_');

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
        const computedPrice = $('.p-symbol')[0].innerText + $('.p-price')[0].innerText;
        log(computedPrice);

        productInfo = {
            url,
            productName: fixChars(productName),
            propertyList: fixChars(propertyList),
            computedPrice,
            description,
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

    if (FULL_PARSING || pageIndex === -1) {
        [...$('.image-thumb-list .img-thumb-item img')]
            .map(item => item.src.split('_50x50')[0])
            .forEach((item, index) => {
                downloadFile(item, `${ROOT_CATALOG}/${folderName}/${(index + 1000 + "").substr(1)}.${fso.getFileName(item).split('.')[1]}`);
            });
    }
};

export const parseAliExpress = (category, existingGoods) => {
    createFolder(ROOT_CATALOG);
    parseAliCategory(category, ($, pageIndex) => {
        [...$('.list-item a.product')]
        //[...$('[itemtype="http://schema.org/Offer"] [itemprop="name"]')]
            .forEach((item, positionIndex) =>{
                //if(positionIndex > 10) return;
                try {
                    parseAliPage(fixUrl_s(item.href), pageIndex, positionIndex, existingGoods);
                } catch (errrrr) {log('parsing page error'); WScript.Sleep(10000);}

            })
    });
};

export const parsePredefinedList = (list, existingGoods) => {
    createFolder(ROOT_CATALOG);
    list.forEach((url, index) => {
        parseAliPage(url, 'predefined', index, existingGoods);
    });
};