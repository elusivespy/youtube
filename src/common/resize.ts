import { executeLocal } from './file';
import { fso, shell, fileStreamFactory } from './activex';
import { saveToFile } from './file';
import { randBetween } from './utils';

export const resizeFiles = (files, width, height) => {
    const filteredFiles = files.filter(item => fso.getExtensionName(item) === 'jpg');
    filteredFiles.forEach(file => {
        executeLocal(`ffmpeg -y -i "${file}" -vf "scale=${width}:ih*${width}/iw, crop=${width}:${height}" "${file}"`);
    });
};

export const makeAliVideo = (files, price, productName) => {
    const slideDuration = 3;
    const firstLine = '';//`Buy this product only for ${price}`;
    const secondLine = '';//'Follow the link in the description below';
    const filteredFiles = files.filter(item => fso.getExtensionName(item) === 'jpg');
    const inputConcat = filteredFiles.map(file => `file '${file}'\r\nduration ${slideDuration}`).concat(`file '${filteredFiles[filteredFiles.length - 1]}'`).join('\r\n');
    const inputFilePath = `${fso.getParentFolderName(files[0])}\\input.txt`;
    const outputFilePath = `${fso.getParentFolderName(files[0])}\\${productName}.mp4`;
    if (fso.fileExists(outputFilePath)) {
        fso.getFile(outputFilePath).Delete();
    }
    saveToFile(inputFilePath, inputConcat, true);
    //executeLocal(`ffmpeg -f concat -safe 0 -i "${inputFilePath}" -c:v mjpeg -b:v 10M -preset ultrafast -qp 0 -vf "drawbox=y=(ih-150)/2:color=black@0.4:width=iw:height=150:t=max:enable='between(t,0,${slideDuration/2})',drawtext=fontsize=40:fontfile='c\\:\\\\Windows\\\\Fonts\\\\arialbd.ttf':x=(w-text_w)/2:y=(h-text_h)/2-25:fontcolor=white:text='${firstLine}':enable='between(t,0,${slideDuration/2})',drawtext=fontsize=40:fontfile='c\\:\\\\Windows\\\\Fonts\\\\arialbd.ttf':x=(w-text_w)/2:y=(h-text_h)/2+25:fontcolor=white:text='${secondLine}':enable='between(t,0,${slideDuration/2})',fps=25,format=yuv420p" "${outputFilePath}"`);
    executeLocal(`ffmpeg -f concat -safe 0 -i "${inputFilePath}" -c:v mjpeg -b:v 10M -preset ultrafast -qp 0 -vf "drawbox=y=(ih-150)/2:color=black@0.0:width=iw:height=150:t=max:enable='between(t,0,${slideDuration/2})',drawtext=fontsize=40:fontfile='c\\:\\\\Windows\\\\Fonts\\\\arialbd.ttf':x=(w-text_w)/2:y=(h-text_h)/2-25:fontcolor=white:text='${firstLine}':enable='between(t,0,${slideDuration/2})',drawtext=fontsize=40:fontfile='c\\:\\\\Windows\\\\Fonts\\\\arialbd.ttf':x=(w-text_w)/2:y=(h-text_h)/2+25:fontcolor=white:text='${secondLine}':enable='between(t,0,${slideDuration/2})',fps=25,format=yuv420p" "${outputFilePath}"`);
    return outputFilePath;
};

 export const makeAliVideoZoomFade = (files, price, productName) => {

     const makeArray = n => {
     let r = [];
     for (let i=0;i<n;i++) r.push(i);
     return r;
     };

     const slideDuration = 4;
     const slidesCount = randBetween(18, 25);
     const textDuration = 12;
     const firstLine = `Buy this product only for ${price}`;
     const secondLine = 'Follow the link in the description below';

     const filteredFiles = files.filter(item => fso.getExtensionName(item) === 'jpg');
     const inputFiles = makeArray(slidesCount).map((item, index) => filteredFiles[index % filteredFiles.length]);

     const outputFilePath = `${fso.getParentFolderName(files[0])}\\${productName}.mp4`;
     if (fso.fileExists(outputFilePath)) {
     fso.getFile(outputFilePath).Delete();
     }

     const inputString = inputFiles.map(file => `-t ${slideDuration} -i "${file}"`).join(' ');

     const font = 'c\\:\\\\Windows\\\\Fonts\\\\arialbd.ttf';
     const fadeOutFilter = `fade=t=out:st=${slideDuration - 1}:d=1`;
     const fadeInFilter = 'fade=t=in:st=0:d=1';
     const setDar = `setdar=16/9`;
     const zoomPan = `zoompan=z='if(lte(zoom,1.0),1.7,max(1.001,zoom-${ Math.floor((600 / (slideDuration * 25))) / 1000 }))':d=${slideDuration * 25}`;
     const drawBox = `drawbox=y=(ih-150)/2:color=black@0.4:width=iw:height=150:t=max:enable='between(t,0,${textDuration})'`;
     const drawTextLine1 = `drawtext=fontsize=40:fontfile='${font}':x=(w-text_w)/2:y=(h-text_h)/2-25:fontcolor=white:text='${firstLine}':enable='between(t,0,${textDuration})'`;
     const drawTextLine2 = `drawtext=fontsize=40:fontfile='${font}':x=(w-text_w)/2:y=(h-text_h)/2+25:fontcolor=white:text='${secondLine}':enable='between(t,0,${textDuration})'`;
     const finalFilters = `${drawBox},${drawTextLine1},${drawTextLine2},format=yuv420p[v]`;
     const zoomFadeFilters = makeArray(slidesCount).map((item, index) => `[${index}:v]${setDar},${zoomPan}${index === 0 ? '' : `,${fadeInFilter}`},${fadeOutFilter}[v${index}]`).join('; ');
     const vList = makeArray(slidesCount).map((item, index) => `[v${index}]`).join('');

     executeLocal(`ffmpeg ${inputString} -filter_complex "${zoomFadeFilters}; ${vList}concat=n=${slidesCount}:v=1:a=0,${finalFilters}" -map "[v]" -c:v mjpeg -b:v 5M "${outputFilePath}"`);
     return outputFilePath;
 };

 export const makeAdultZoomFade  = (files, productName) => {

     const makeArray = n => {
         let r = [];
         for (let i=0;i<n;i++) r.push(i);
         return r;
     };

     const slideDuration = 4;
     const slidesCount = randBetween(18, 25);
     const textDuration = 12;
     const firstLine = `Watch this girl orgasm`;
     const secondLine = 'Follow the link in the description below';

     const filteredFiles = files.filter(item => fso.getExtensionName(item) === 'jpg');
     const inputFiles = makeArray(slidesCount).map((item, index) => filteredFiles[index % filteredFiles.length]);

     const outputFilePath = `${fso.getParentFolderName(files[0])}\\${productName}.mp4`;
     if (fso.fileExists(outputFilePath)) {
         fso.getFile(outputFilePath).Delete();
     }

     const inputString = inputFiles.map(file => `-t ${slideDuration} -i "${file}"`).join(' ');

     const font = 'c\\:\\\\Windows\\\\Fonts\\\\arialbd.ttf';
     const fadeOutFilter = `fade=t=out:st=${slideDuration - 1}:d=1`;
     const fadeInFilter = 'fade=t=in:st=0:d=1';
     const setDar = `setdar=16/9`;
     const zoomPan = `zoompan=z='if(lte(zoom,1.0),1.7,max(1.001,zoom-${ Math.floor((600 / (slideDuration * 25))) / 1000 }))':d=${slideDuration * 25}`;
     const drawBox = `drawbox=y=(ih-150)/2:color=black@0.4:width=iw:height=150:t=max:enable='between(t,0,${textDuration})'`;
     const drawTextLine1 = `drawtext=fontsize=40:fontfile='${font}':x=(w-text_w)/2:y=(h-text_h)/2-25:fontcolor=white:text='${firstLine}':enable='between(t,0,${textDuration})'`;
     const drawTextLine2 = `drawtext=fontsize=40:fontfile='${font}':x=(w-text_w)/2:y=(h-text_h)/2+25:fontcolor=white:text='${secondLine}':enable='between(t,0,${textDuration})'`;
     const finalFilters = `${drawBox},${drawTextLine1},${drawTextLine2},format=yuv420p[v]`;
     const zoomFadeFilters = makeArray(slidesCount).map((item, index) => `[${index}:v]${setDar},${zoomPan}${index === 0 ? '' : `,${fadeInFilter}`},${fadeOutFilter}[v${index}]`).join('; ');
     const vList = makeArray(slidesCount).map((item, index) => `[v${index}]`).join('');

     executeLocal(`ffmpeg ${inputString} -filter_complex "${zoomFadeFilters}; ${vList}concat=n=${slidesCount}:v=1:a=0,${finalFilters}" -map "[v]" -c:v mjpeg -b:v 5M "${outputFilePath}"`);
     return outputFilePath;
 };