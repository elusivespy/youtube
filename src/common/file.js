"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var activex_1 = require("./activex");
var network_1 = require("./network");
var utils_1 = require("./utils");
var storagePath = activex_1.fso.getParentFolderName(WScript.ScriptFullName) + "/storage";
var programsPath = activex_1.fso.getParentFolderName(WScript.ScriptFullName) + "/programs";
if (!activex_1.fso.folderExists(storagePath)) {
    activex_1.fso.createFolder(storagePath);
}
exports.executeLocal = function (command) {
    activex_1.shell.Run(programsPath + "/" + command, 1, true);
};
exports.executeLocalBackground = function (command) {
    activex_1.shell.Run(programsPath + "/" + command, 1);
};
exports.execute = function (command) {
    activex_1.shell.Run(command, 1, true);
};
exports.executeHidden = function (command) {
    activex_1.shell.Run(command, 0, true);
};
exports.createFolder = function (path) {
    if (!activex_1.fso.folderExists(storagePath + "/" + path)) {
        activex_1.fso.createFolder(storagePath + "/" + path);
    }
};
exports.folderExists = function (path) {
    return activex_1.fso.folderExists(storagePath + "/" + path);
};
exports.saveToFile = function (path, data, globalPath) {
    if (globalPath === void 0) { globalPath = false; }
    var file = activex_1.fso.createTextFile(globalPath ? path : storagePath + "/" + path);
    var resultData = Array.isArray(data) ? data.join('\r\n') : data;
    file.Write(resultData);
    file.close();
};
exports.readFile = function (path) {
    utils_1.log(path);
    return activex_1.fso.getFile(storagePath + "/" + path).openAsTextStream(1, 0).readall();
};
exports.appendToFile = function (path, data) {
    if (!activex_1.fso.fileExists(storagePath + "/" + path)) {
        exports.saveToFile(path, data);
    }
    else {
        var file = activex_1.fso.getFile(storagePath + "/" + path).openAsTextStream(8, 0);
        var resultData = Array.isArray(data) ? data.join('\r\n') : data;
        file.Write(resultData);
        file.close();
    }
};
exports.downloadFile = function (url, path) {
    var fs = activex_1.fileStreamFactory();
    fs.Type = 1;
    fs.Mode = 3;
    fs.Open();
    fs.Write(network_1.fetchBinary(url));
    WScript.Echo(storagePath + "/" + path);
    fs.SaveToFile(storagePath + "/" + path, 2);
    fs.Close();
};
exports.getFilesList = function (path) {
    var files = [];
    var _files = new Enumerator(activex_1.fso.getFolder(storagePath + "/" + path).Files);
    for (; !_files.atEnd(); _files.moveNext()) {
        files.push(_files.item() + '');
    }
    return files;
};
exports.getFilesListAbsolute = function (path) {
    var files = [];
    var _files = new Enumerator(activex_1.fso.getFolder(path).Files);
    for (; !_files.atEnd(); _files.moveNext()) {
        files.push(_files.item() + '');
    }
    return files;
};
exports.getSubFoldersList = function (path) {
    var folders = [];
    var _folders = new Enumerator(activex_1.fso.getFolder(storagePath + "/" + path).subFolders);
    for (; !_folders.atEnd(); _folders.moveNext()) {
        folders.push(_folders.item() + '');
    }
    return folders;
};
