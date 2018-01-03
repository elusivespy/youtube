"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var file_1 = require("./file");
var utils_1 = require("./utils");
exports.readKeywords = function (type) {
    return JSON.parse(file_1.readFile('keywords.json'))[type];
};
exports.generateTitle = function (type, min, max) {
    var words = exports.readKeywords(type);
    var titleLen = utils_1.randBetween(min, max);
    var title = [];
    for (var i = 0; i < titleLen; i++)
        title.push(utils_1.randItem(words));
    return title.join(' ');
};
exports.getSingleKeyword = function (type) { return utils_1.randItem(exports.readKeywords(type)); };
exports.getKeywordByPos = function (type, pos) { return exports.readKeywords(type)[pos]; };
