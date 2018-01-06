"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var usedCache = [];
var usedCount = {};
exports.isUsedWords = function (text) {
    var words = text.split(' ');
    var countOfMatches = 0;
    words.forEach(function (word) {
        var result = usedCache.indexOf(word) !== -1;
        if (result) {
            usedCount[word] = usedCount[word] ? usedCount[word] + 1 : 1;
            countOfMatches++;
        }
    });
    if (countOfMatches > 2) {
        return true;
    }
    else {
        usedCache = usedCache.concat(words);
        return false;
    }
};
exports.processTitle = function (text) {
    var stopWords = [
        'sex',
        'porn',
        'porno',
        'ass',
        'tits',
        'hot',
        'new',
        '2017',
        '2016',
        'sexy',
        'xiaomi',
        'redmi',
        'snapdragon',
        'sex',
        'massage',
        'cellulite',
        'vacuum',
        'silicone',
        'free',
        'shipping',
        'wholesale',
        'wholesale',
        'pieces',
        'original',
        'newest',
        'hot',
        'high',
        'quality',
        'small',
        'for',
        'and',
        'in',
        'a',
        'the',
        'portable',
        'kit',
        'lot',
        'real',
        'plus',
        'to',
        'pcs',
        'used',
        '10pcs',
        '1pcs',
        '2pcs',
        '3pcs',
        '5pcs',
        'arrival',
        'freeshipping',
        'refurbished',
        'iphone',
        'android',
        'global',
        'version',
        'note',
        'mi5',
        'mi',
        'core',
        'octa',
        'quad',
        'dual',
        'power',
        'bank',
        'powerbank',
        'mobile',
        'phone',
        'office',
        'notebook',
        'laptop',
        'computer',
        'windows7',
        'windows',
        'smartphone',
        'iphone6',
        'gift',
        'cell',
        'delivery',
        'from',
        'ru',
        'apple',
        'ram',
        'rom',
        'lcd',
        'screen',
        'display',
        'tablet',
        'tablets',
        'pc',
        'support',
        'router',
        'inch',
        '5s',
        '6s',
        'case',
        'cover',
        'os',
        'cdek',
        'express',
        'full',
        'russia',
        'russian',
        'ultra',
        'brand',
        'cam'
    ];
    //remove duplicates and stopwords, change first letter to uppercase
    return text.toLowerCase().split(/[ -]/)
        .filter(function (item, i, allItems) { return i == allItems.indexOf(item) && stopWords.indexOf(item) === -1 && !/^\d+gb?$/.test(item) && !/^\d+mm$/.test(item); })
        .map(function (item) { return "" + item.substr(0, 1).toUpperCase() + item.substr(1); }).join(' ');
};
