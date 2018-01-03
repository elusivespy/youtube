"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("./utils");
var network_1 = require("./network");
var utils_2 = require("./utils");
var HOST = 'http://kino-720.ru/storage/proxy.php';
exports.getProxy = function () {
    //const proxy = JSON.parse(fetchWin(`${HOST}/?action=getProxy`)).response;
    var proxy = utils_2.randItem(network_1.fetchWin('http://account.fineproxy.org/api/getproxy/?format=txt&type=socksip&login=EUR216337&password=M9GkEMLxLZ').split('\r\n'));
    utils_1.log('proxy', proxy);
    return proxy;
};
