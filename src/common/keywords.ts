import { readFile } from './file';
import { randItem, randBetween } from './utils';

export const readKeywords = type => {
   return JSON.parse(readFile('keywords.json'))[type];
};

export const generateTitle = (type, min, max) => {
    const words = readKeywords(type);

    const titleLen = randBetween(min, max);
    let title = [];
    for (let i=0;i<titleLen;i++)
      title.push(randItem(words));
    return title.join(' ');
};

export const getSingleKeyword = type => randItem(readKeywords(type));
export const getKeywordByPos = (type, pos) => readKeywords(type)[pos];