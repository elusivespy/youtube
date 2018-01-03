"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("./utils");
var file_1 = require("./file");
exports.session = function () {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    if (args.length == 1) {
        utils_1.log('Start parsing...');
        utils_1.log(file_1.readFile('session.json'));
        var parsedJSON = JSON.parse(file_1.readFile('session.json'))[args[0]];
        utils_1.log('Parsing successful!');
        return parsedJSON;
    }
    else if (args.length == 2) {
        var data = JSON.parse(file_1.readFile('session.json'));
        var mergedData = __assign({}, data, (_a = {}, _a[args[0]] = args[1], _a));
        file_1.saveToFile('session.json', JSON.stringify(mergedData));
    }
    else
        utils_1.log("Error session usage");
    var _a;
};
exports.cache = function () {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    if (args.length == 1)
        return JSON.parse(file_1.readFile('cache.json'))[args[0]];
    else if (args.length == 2) {
        var data = JSON.parse(file_1.readFile('cache.json'));
        var mergedData = __assign({}, data, (_a = {}, _a[args[0]] = args[1], _a));
        file_1.saveToFile('cache.json', JSON.stringify(mergedData));
    }
    else
        utils_1.log("Error cache usage");
    var _a;
};
