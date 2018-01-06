"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var activex_1 = require("./activex");
var utils_1 = require("./utils");
exports.fetchWin = function (url) {
    utils_1.log('winhttp', url);
    activex_1.winHttp.open('POST', url, 0);
    activex_1.winHttp.send();
    return activex_1.winHttp.responseText;
};
exports.fetch = function (url) {
    utils_1.log('xmlhttp', url);
    activex_1.xmlHttp.open('GET', url, 0);
    activex_1.xmlHttp.send();
    return activex_1.xmlHttp.responseText;
};
exports.fetchBinary = function (url) {
    activex_1.xmlHttp.open('GET', url, 0);
    activex_1.xmlHttp.send();
    return activex_1.xmlHttp.responseBody;
};
exports.fetchDocument = function (url) {
    var document = activex_1.documentFactory();
    document.write(exports.fetch(url));
    return function (r, c, i, j, a) {
        if (r === void 0) { r = null; }
        if (c === void 0) { c = null; }
        if (i === void 0) { i = null; }
        if (j === void 0) { j = null; }
        if (a === void 0) { a = null; }
        var d = document, s = d.createStyleSheet();
        a = d.all;
        c = [];
        r = r.replace(/\[for\b/gi, '[htmlFor').split(',');
        for (i = r.length; i--;) {
            s.addRule(r[i], 'k:v');
            for (j = a.length; j--;) {
                a[j].currentStyle.k && c.push(a[j]);
            }
            s.removeRule(0);
        }
        return c;
    };
};
var querySelectorAll = function (document) {
    return function (r, c, i, j, a) {
        if (r === void 0) { r = null; }
        if (c === void 0) { c = null; }
        if (i === void 0) { i = null; }
        if (j === void 0) { j = null; }
        if (a === void 0) { a = null; }
        var d = document, s = d.createStyleSheet();
        a = d.all;
        c = [];
        r = r.replace(/\[for\b/gi, '[htmlFor').split(',');
        for (i = r.length; i--;) {
            s.addRule(r[i], 'k:v');
            for (j = a.length; j--;) {
                a[j].currentStyle.k && c.push(a[j]);
            }
            s.removeRule(0);
        }
        return c;
    };
};
exports.createDocument = function (text) {
    var document = activex_1.documentFactory();
    document.write(text);
    return querySelectorAll(document);
};
