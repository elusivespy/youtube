import { sendData } from '../loader/youtube';

export const getShortLink = (mode, payload) => {

    const extraParams = Object.keys(payload).map(item => `${item}=${payload[item]}`).join('&');

    const shortPathArr = [
        //"http://37.59.246.141/youtube/?act=getadult&login=igor123aaa&appkey=R_3d47d627386e4521a5cf60d7424412d8`,
        `http://37.59.246.141/youtube/?act=${mode}&login=trussss&appkey=R_cd095da8cb8187378440fae72f266520`,
        `http://37.59.246.141/youtube/?act=${mode}&login=angelicakozlov&appkey=R_639c47077c7b42cbbb67d4e10b38bfd0`,
        `http://37.59.246.141/youtube/?act=${mode}&login=demiandark&appkey=R_362c2378ffd742d0ab01574de59ba30d`,
        `http://37.59.246.141/youtube/?act=${mode}&login=oscorp&appkey=R_6bfce689d8bc49909b284d563b787929`,
        `http://37.59.246.141/youtube/?act=${mode}&login=pochtomatsuka&appkey=R_5251b09cbadf4bed8c26304d059ff50c`
    ];
    const shortPath = shortPathArr[Math.floor(shortPathArr.length * Math.random())];
    return sendData("POST", `${shortPath}&${extraParams}` , "", "");
};