"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var youtube_1 = require("../loader/youtube");
var file_1 = require("../common/file");
var keywords_1 = require("../common/keywords");
var utils_1 = require("../common/utils");
var shortlink_1 = require("../common/shortlink");
var browser_1 = require("../loader/browser");
exports.init = function () {
    var counter = 0;
    while (true) {
        try {
            browser_1.initIE();
            var uploadSource = file_1.getFilesList('adult');
            var photo = utils_1.randItem(uploadSource);
            var title = keywords_1.getKeywordByPos('stars', counter++); //generateTitle('adult', 5, 10);
            var inform = "http://" + shortlink_1.getShortLink('getalinew', {}) + " - " + keywords_1.getSingleKeyword('names');
            youtube_1.uploadPhotoArray([photo, photo, photo, photo, photo]);
            youtube_1.generateVideoFromImage({
                title: title,
                firstPicText: "To watch her orgasm follow \nthe link below in the description",
                inform: inform,
                allowDescription: true,
                frameTime: 10000 + Math.ceil(Math.random() * 10000),
            });
        }
        catch (someerr) {
            utils_1.log(someerr.message);
        }
        utils_1.delay(10 * 60000);
    }
};
/*

 [...document.querySelectorAll('.tweet-text')].map(item => item.innerText.replace(/(?:https?|ftp):\/\/[\n\S]+/g, '').replace(/[^\w\s]/gi, ''))

 */ 
