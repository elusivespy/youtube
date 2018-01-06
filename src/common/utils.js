"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var activex_1 = require("./activex");
var network_1 = require("./network");
exports.log = function () {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    return WScript.Echo(args.join(', '));
};
exports.fixUrl = function (url) { return url.replace('about://', 'http://'); };
exports.fixUrl_s = function (url) { return url.replace('about://', 'https://'); };
exports.fixChars = function (text) { return text.replace(/[^a-zA-Z0-9\.\-]/g, " "); };
exports.delay = function (msec) { exports.log('delay', msec); WScript.Sleep(msec); };
exports.me = activex_1.fso.getParentFolderName(WScript.ScriptFullName);
function shuffle(a) {
    for (var i = a.length; i; i--) {
        var j = Math.floor(Math.random() * i);
        _a = [a[j], a[i - 1]], a[i - 1] = _a[0], a[j] = _a[1];
    }
    var _a;
}
exports.shuffle = shuffle;
exports.randItem = function (arr) { return arr[Math.floor(Math.random() * arr.length)]; };
exports.randBetween = function (min, max) { return Math.floor(Math.random() * (max - min)) + min; };
exports.getRandomWord = function () { return network_1.fetchWin('http://setgetgo.com/randomword/get.php'); };
exports.mixWords = function (text) { return text.split(' ').map(function (word, index) { return index % 2 === 0 ? exports.getRandomWord() : word; }).join(' '); };
