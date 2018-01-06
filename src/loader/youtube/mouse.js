"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var file_1 = require("../../common/file");
var m = function (coords) {
    file_1.executeLocal("mouse " + coords);
    WScript.Sleep(10000);
};
var actions = {
    maximizeIEWindow: function () { return m('1288,15'); },
    closeX: function () { return m("1317,74"); },
    flash: function () { return m("863,441"); },
    teamviewer: function () { return m("845,435"); },
    close_lang: function () { return m("1321,133"); },
    close_lang2: function () { return m("1306,133"); },
    add_photo: function () { return m("653,214"); },
    more: function () { return m("565,279"); },
    upl_photo: function () { return m("600,160"); },
    select_photo: function () { return m("689,453"); },
    select_photo2: function () { return m("689,465"); },
    select_photo3: function () { return m("689,475"); },
    parser_password: function () { return m("1063,320"); },
    parser_submit: function () { return m("1059,370"); },
    parser_access: function () { return m("996,327"); },
    ali_google: function () { return m("834,442"); },
    watchvid: function () { return m("1316,80"); },
    sep20: function () { return m("1313,141"); },
    sep202: function () { return m("1311,176"); },
    addVideo1: function () { return m("1200,85"); },
    addVideo2: function () { return m("1200,120"); },
    createChannel1: function () { return m("827,515"); },
    createChannel2: function () { return m("827,540"); },
};
exports.default = actions;
