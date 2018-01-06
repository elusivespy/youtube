import { log } from './utils';
import { fetchWin } from './network';
import { randItem } from './utils';

const HOST = 'http://kino-720.ru/storage/proxy.php';

export const getProxy = () => {
    //const proxy = JSON.parse(fetchWin(`${HOST}/?action=getProxy`)).response;
    const proxy = randItem(fetchWin('http://account.fineproxy.org/api/getproxy/?format=txt&type=socksip&login=EUR216337&password=M9GkEMLxLZ').split('\r\n'));

    log('proxy', proxy);
    return proxy;
};