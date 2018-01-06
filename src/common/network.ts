import { xmlHttp, winHttp, documentFactory } from './activex';
import { log } from './utils';

export const fetchWin = url => {
    log('winhttp', url);
    winHttp.open('POST', url, 0);
    winHttp.send();
    return winHttp.responseText;
};

export const fetch = url => {
    log('xmlhttp', url);
    xmlHttp.open('GET', url, 0);
    xmlHttp.send();
    return xmlHttp.responseText;
};

export const fetchBinary = url => {
    xmlHttp.open('GET', url, 0);
    xmlHttp.send();
    return xmlHttp.responseBody;
};

export const fetchDocument = url => {
    const document = documentFactory();
    document.write(fetch(url));
    return (r=null, c=null, i=null, j=null, a=null) => {
        const d=document, s=d.createStyleSheet();
        a = d.all;
        c = [];
        r = r.replace(/\[for\b/gi, '[htmlFor').split(',');
        for (i = r.length; i--;) {
            s.addRule(r[i], 'k:v');
            for (j = a.length; j--;) {
                a[j].currentStyle.k && c.push(a[j]);
            }
            s.removeRule(0);
        }
        return c;
    };
};

const querySelectorAll = document => {
    return (r=null, c=null, i=null, j=null, a=null) => {
        const d=document, s=d.createStyleSheet();
        a = d.all;
        c = [];
        r = r.replace(/\[for\b/gi, '[htmlFor').split(',');
        for (i = r.length; i--;) {
            s.addRule(r[i], 'k:v');
            for (j = a.length; j--;) {
                a[j].currentStyle.k && c.push(a[j]);
            }
            s.removeRule(0);
        }
        return c;
    };
};

export const createDocument = text => {
    const document = documentFactory();
    document.write(text);
    return querySelectorAll(document);
};