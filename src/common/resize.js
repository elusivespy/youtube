"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var file_1 = require("./file");
var activex_1 = require("./activex");
var file_2 = require("./file");
var utils_1 = require("./utils");
exports.resizeFiles = function (files, width, height) {
    var filteredFiles = files.filter(function (item) { return activex_1.fso.getExtensionName(item) === 'jpg'; });
    filteredFiles.forEach(function (file) {
        file_1.executeLocal("ffmpeg -y -i \"" + file + "\" -vf \"scale=" + width + ":ih*" + width + "/iw, crop=" + width + ":" + height + "\" \"" + file + "\"");
    });
};
exports.makeAliVideo = function (files, price, productName) {
    var slideDuration = 3;
    var firstLine = ''; //`Buy this product only for ${price}`;
    var secondLine = ''; //'Follow the link in the description below';
    var filteredFiles = files.filter(function (item) { return activex_1.fso.getExtensionName(item) === 'jpg'; });
    var inputConcat = filteredFiles.map(function (file) { return "file '" + file + "'\r\nduration " + slideDuration; }).concat("file '" + filteredFiles[filteredFiles.length - 1] + "'").join('\r\n');
    var inputFilePath = activex_1.fso.getParentFolderName(files[0]) + "\\input.txt";
    var outputFilePath = activex_1.fso.getParentFolderName(files[0]) + "\\" + productName + ".mp4";
    if (activex_1.fso.fileExists(outputFilePath)) {
        activex_1.fso.getFile(outputFilePath).Delete();
    }
    file_2.saveToFile(inputFilePath, inputConcat, true);
    //executeLocal(`ffmpeg -f concat -safe 0 -i "${inputFilePath}" -c:v mjpeg -b:v 10M -preset ultrafast -qp 0 -vf "drawbox=y=(ih-150)/2:color=black@0.4:width=iw:height=150:t=max:enable='between(t,0,${slideDuration/2})',drawtext=fontsize=40:fontfile='c\\:\\\\Windows\\\\Fonts\\\\arialbd.ttf':x=(w-text_w)/2:y=(h-text_h)/2-25:fontcolor=white:text='${firstLine}':enable='between(t,0,${slideDuration/2})',drawtext=fontsize=40:fontfile='c\\:\\\\Windows\\\\Fonts\\\\arialbd.ttf':x=(w-text_w)/2:y=(h-text_h)/2+25:fontcolor=white:text='${secondLine}':enable='between(t,0,${slideDuration/2})',fps=25,format=yuv420p" "${outputFilePath}"`);
    file_1.executeLocal("ffmpeg -f concat -safe 0 -i \"" + inputFilePath + "\" -c:v mjpeg -b:v 10M -preset ultrafast -qp 0 -vf \"drawbox=y=(ih-150)/2:color=black@0.0:width=iw:height=150:t=max:enable='between(t,0," + slideDuration / 2 + ")',drawtext=fontsize=40:fontfile='c\\:\\\\Windows\\\\Fonts\\\\arialbd.ttf':x=(w-text_w)/2:y=(h-text_h)/2-25:fontcolor=white:text='" + firstLine + "':enable='between(t,0," + slideDuration / 2 + ")',drawtext=fontsize=40:fontfile='c\\:\\\\Windows\\\\Fonts\\\\arialbd.ttf':x=(w-text_w)/2:y=(h-text_h)/2+25:fontcolor=white:text='" + secondLine + "':enable='between(t,0," + slideDuration / 2 + ")',fps=25,format=yuv420p\" \"" + outputFilePath + "\"");
    return outputFilePath;
};
exports.makeAliVideoZoomFade = function (files, price, productName) {
    var makeArray = function (n) {
        var r = [];
        for (var i = 0; i < n; i++)
            r.push(i);
        return r;
    };
    var slideDuration = 4;
    var slidesCount = utils_1.randBetween(18, 25);
    var textDuration = 12;
    var firstLine = "Buy this product only for " + price;
    var secondLine = 'Follow the link in the description below';
    var filteredFiles = files.filter(function (item) { return activex_1.fso.getExtensionName(item) === 'jpg'; });
    var inputFiles = makeArray(slidesCount).map(function (item, index) { return filteredFiles[index % filteredFiles.length]; });
    var outputFilePath = activex_1.fso.getParentFolderName(files[0]) + "\\" + productName + ".mp4";
    if (activex_1.fso.fileExists(outputFilePath)) {
        activex_1.fso.getFile(outputFilePath).Delete();
    }
    var inputString = inputFiles.map(function (file) { return "-t " + slideDuration + " -i \"" + file + "\""; }).join(' ');
    var font = 'c\\:\\\\Windows\\\\Fonts\\\\arialbd.ttf';
    var fadeOutFilter = "fade=t=out:st=" + (slideDuration - 1) + ":d=1";
    var fadeInFilter = 'fade=t=in:st=0:d=1';
    var setDar = "setdar=16/9";
    var zoomPan = "zoompan=z='if(lte(zoom,1.0),1.7,max(1.001,zoom-" + Math.floor((600 / (slideDuration * 25))) / 1000 + "))':d=" + slideDuration * 25;
    var drawBox = "drawbox=y=(ih-150)/2:color=black@0.4:width=iw:height=150:t=max:enable='between(t,0," + textDuration + ")'";
    var drawTextLine1 = "drawtext=fontsize=40:fontfile='" + font + "':x=(w-text_w)/2:y=(h-text_h)/2-25:fontcolor=white:text='" + firstLine + "':enable='between(t,0," + textDuration + ")'";
    var drawTextLine2 = "drawtext=fontsize=40:fontfile='" + font + "':x=(w-text_w)/2:y=(h-text_h)/2+25:fontcolor=white:text='" + secondLine + "':enable='between(t,0," + textDuration + ")'";
    var finalFilters = drawBox + "," + drawTextLine1 + "," + drawTextLine2 + ",format=yuv420p[v]";
    var zoomFadeFilters = makeArray(slidesCount).map(function (item, index) { return "[" + index + ":v]" + setDar + "," + zoomPan + (index === 0 ? '' : "," + fadeInFilter) + "," + fadeOutFilter + "[v" + index + "]"; }).join('; ');
    var vList = makeArray(slidesCount).map(function (item, index) { return "[v" + index + "]"; }).join('');
    file_1.executeLocal("ffmpeg " + inputString + " -filter_complex \"" + zoomFadeFilters + "; " + vList + "concat=n=" + slidesCount + ":v=1:a=0," + finalFilters + "\" -map \"[v]\" -c:v mjpeg -b:v 5M \"" + outputFilePath + "\"");
    return outputFilePath;
};
exports.makeAdultZoomFade = function (files, productName) {
    var makeArray = function (n) {
        var r = [];
        for (var i = 0; i < n; i++)
            r.push(i);
        return r;
    };
    var slideDuration = 4;
    var slidesCount = utils_1.randBetween(18, 25);
    var textDuration = 12;
    var firstLine = "Watch this girl orgasm";
    var secondLine = 'Follow the link in the description below';
    var filteredFiles = files.filter(function (item) { return activex_1.fso.getExtensionName(item) === 'jpg'; });
    var inputFiles = makeArray(slidesCount).map(function (item, index) { return filteredFiles[index % filteredFiles.length]; });
    var outputFilePath = activex_1.fso.getParentFolderName(files[0]) + "\\" + productName + ".mp4";
    if (activex_1.fso.fileExists(outputFilePath)) {
        activex_1.fso.getFile(outputFilePath).Delete();
    }
    var inputString = inputFiles.map(function (file) { return "-t " + slideDuration + " -i \"" + file + "\""; }).join(' ');
    var font = 'c\\:\\\\Windows\\\\Fonts\\\\arialbd.ttf';
    var fadeOutFilter = "fade=t=out:st=" + (slideDuration - 1) + ":d=1";
    var fadeInFilter = 'fade=t=in:st=0:d=1';
    var setDar = "setdar=16/9";
    var zoomPan = "zoompan=z='if(lte(zoom,1.0),1.7,max(1.001,zoom-" + Math.floor((600 / (slideDuration * 25))) / 1000 + "))':d=" + slideDuration * 25;
    var drawBox = "drawbox=y=(ih-150)/2:color=black@0.4:width=iw:height=150:t=max:enable='between(t,0," + textDuration + ")'";
    var drawTextLine1 = "drawtext=fontsize=40:fontfile='" + font + "':x=(w-text_w)/2:y=(h-text_h)/2-25:fontcolor=white:text='" + firstLine + "':enable='between(t,0," + textDuration + ")'";
    var drawTextLine2 = "drawtext=fontsize=40:fontfile='" + font + "':x=(w-text_w)/2:y=(h-text_h)/2+25:fontcolor=white:text='" + secondLine + "':enable='between(t,0," + textDuration + ")'";
    var finalFilters = drawBox + "," + drawTextLine1 + "," + drawTextLine2 + ",format=yuv420p[v]";
    var zoomFadeFilters = makeArray(slidesCount).map(function (item, index) { return "[" + index + ":v]" + setDar + "," + zoomPan + (index === 0 ? '' : "," + fadeInFilter) + "," + fadeOutFilter + "[v" + index + "]"; }).join('; ');
    var vList = makeArray(slidesCount).map(function (item, index) { return "[v" + index + "]"; }).join('');
    file_1.executeLocal("ffmpeg " + inputString + " -filter_complex \"" + zoomFadeFilters + "; " + vList + "concat=n=" + slidesCount + ":v=1:a=0," + finalFilters + "\" -map \"[v]\" -c:v mjpeg -b:v 5M \"" + outputFilePath + "\"");
    return outputFilePath;
};
