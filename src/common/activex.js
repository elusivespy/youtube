"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fso = new ActiveXObject('Scripting.FileSystemObject');
exports.shell = new ActiveXObject('WScript.Shell');
exports.xmlHttp = new ActiveXObject('Microsoft.XMLHttp');
exports.winHttp = new ActiveXObject("WinHttp.WinHttpRequest.5.1");
exports.ieFactory = function () { return new ActiveXObject('InternetExplorer.Application'); };
exports.documentFactory = function () { return new ActiveXObject('HtmlFile'); };
exports.fileStreamFactory = function () { return new ActiveXObject('ADODB.Stream'); };
