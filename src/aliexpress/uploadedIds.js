"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("../common/utils");
var network_1 = require("../common/network");
var HOST = 'http://kino-720.ru/storage';
exports.getUploadedProductsIds = function () {
    var uploadedProducts = JSON.parse(network_1.fetchWin(HOST + "/?action=getAll")).response;
    utils_1.log('uploaded products length', uploadedProducts.length);
    return uploadedProducts;
};
exports.addUploadedProductId = function (productId) {
    utils_1.log('add uploaded product id', productId);
    network_1.fetchWin(HOST + "/?action=addId&payload=" + productId);
    utils_1.log('done');
};
exports.hasUploadedProductId = function (productId) {
    utils_1.log('check if has uploaded product id', productId);
    var has = JSON.parse(network_1.fetchWin(HOST + "/?action=has&payload=" + productId)).response;
    utils_1.log('has', has);
    return has;
};
