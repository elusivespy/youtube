import { login, uploadPhotoArray, generateVideoFromImage, enterEditor, changeInfoAll } from '../loader/youtube';
import { getFilesList } from '../common/file';
import { generateTitle, getSingleKeyword, getKeywordByPos } from '../common/keywords';
import { log, randItem, delay } from '../common/utils';
import { getShortLink } from '../common/shortlink';
import { initIE } from '../loader/browser';



export const init = () => {
    let counter = 0;
    while(true) {
        try {
            initIE();
            const uploadSource = getFilesList('adult');
            const photo = randItem(uploadSource);

            const title = getKeywordByPos('stars', counter++); //generateTitle('adult', 5, 10);
            const inform = `http://${getShortLink('getalinew', {})} - ${getSingleKeyword('names')}`;

            uploadPhotoArray([photo, photo, photo, photo, photo]);
            generateVideoFromImage({
                title,
                firstPicText: "To watch her orgasm follow \nthe link below in the description",
                inform,
                allowDescription: true,
                frameTime: 10000 + Math.ceil(Math.random() * 10000),
            });
        } catch(someerr) {log(someerr.message);}
        delay(10 * 60000);
    }

};

/*

 [...document.querySelectorAll('.tweet-text')].map(item => item.innerText.replace(/(?:https?|ftp):\/\/[\n\S]+/g, '').replace(/[^\w\s]/gi, ''))

 */