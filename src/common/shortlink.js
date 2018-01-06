"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var youtube_1 = require("../loader/youtube");
exports.getShortLink = function (mode, payload) {
    var extraParams = Object.keys(payload).map(function (item) { return item + "=" + payload[item]; }).join('&');
    var shortPathArr = [
        //"http://37.59.246.141/youtube/?act=getadult&login=igor123aaa&appkey=R_3d47d627386e4521a5cf60d7424412d8`,
        "http://37.59.246.141/youtube/?act=" + mode + "&login=trussss&appkey=R_cd095da8cb8187378440fae72f266520",
        "http://37.59.246.141/youtube/?act=" + mode + "&login=angelicakozlov&appkey=R_639c47077c7b42cbbb67d4e10b38bfd0",
        "http://37.59.246.141/youtube/?act=" + mode + "&login=demiandark&appkey=R_362c2378ffd742d0ab01574de59ba30d",
        "http://37.59.246.141/youtube/?act=" + mode + "&login=oscorp&appkey=R_6bfce689d8bc49909b284d563b787929",
        "http://37.59.246.141/youtube/?act=" + mode + "&login=pochtomatsuka&appkey=R_5251b09cbadf4bed8c26304d059ff50c"
    ];
    var shortPath = shortPathArr[Math.floor(shortPathArr.length * Math.random())];
    return youtube_1.sendData("POST", shortPath + "&" + extraParams, "", "");
};
