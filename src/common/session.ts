import { log } from './utils';
import { readFile, saveToFile } from './file';

export const session = (...args) => {
    if (args.length==1) {
        log('Start parsing...');
        log(readFile('session.json'));
        const parsedJSON = JSON.parse(readFile('session.json'))[args[0]];
        log('Parsing successful!');
        return parsedJSON;
    }
    else if (args.length==2) {
        let data = JSON.parse(readFile('session.json'));
        const mergedData = {...data, [args[0]]: args[1]};
        saveToFile('session.json', JSON.stringify(mergedData));
    }
    else
        log("Error session usage");
};


export const cache = (...args) => {
    if (args.length==1)
        return JSON.parse(readFile('cache.json'))[args[0]];
    else if (args.length==2) {
        let data = JSON.parse(readFile('cache.json'));
        const mergedData = {...data, [args[0]]: args[1]};
        saveToFile('cache.json', JSON.stringify(mergedData));
    }
    else
        log("Error cache usage");
};