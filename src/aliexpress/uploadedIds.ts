import { log } from '../common/utils';
import { fetchWin } from '../common/network';

const HOST = 'http://kino-720.ru/storage';

export const getUploadedProductsIds = () => {
    const uploadedProducts = JSON.parse(fetchWin(`${HOST}/?action=getAll`)).response;
    log('uploaded products length', uploadedProducts.length);
    return uploadedProducts;
};

export const addUploadedProductId = productId => {
    log('add uploaded product id', productId);
    fetchWin(`${HOST}/?action=addId&payload=${productId}`);
    log('done');
};

export const hasUploadedProductId = productId => {
    log('check if has uploaded product id', productId);
    const has = JSON.parse(fetchWin(`${HOST}/?action=has&payload=${productId}`)).response;
    log('has', has);
    return has;
};