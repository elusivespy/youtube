import { fso, shell } from './activex';
import { fetchWin } from './network';
export const log = (...args) => WScript.Echo(args.join(', '));
export const fixUrl = url => url.replace('about://', 'http://');
export const fixUrl_s = url => url.replace('about://', 'https://');
export const fixChars = text => text.replace(/[^a-zA-Z0-9\.\-]/g, " ");
export const delay = msec => {log('delay', msec);WScript.Sleep(msec);};
export const me = fso.getParentFolderName(WScript.ScriptFullName);
export function shuffle(a) {
    for (let i = a.length; i; i--) {
        let j = Math.floor(Math.random() * i);
        [a[i - 1], a[j]] = [a[j], a[i - 1]];
    }
}

export const randItem = arr => arr[Math.floor(Math.random() * arr.length)];
export const randBetween = (min, max) => Math.floor(Math.random() * (max - min)) + min;

export const getRandomWord = () => fetchWin('http://setgetgo.com/randomword/get.php');
export const mixWords = text => text.split(' ').map((word, index) => index % 2 === 0 ? getRandomWord() : word).join(' ');