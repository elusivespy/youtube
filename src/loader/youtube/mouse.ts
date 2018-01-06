import { executeLocal } from '../../common/file';
const m = coords => {
    executeLocal(`mouse ${coords}`);
    WScript.Sleep(10000);
};

const actions = {
    maximizeIEWindow: () => m('1288,15'),
    closeX: () => m("1317,74"),
    flash: () => m("863,441"),
    teamviewer: () => m("845,435"),
    close_lang: () => m("1321,133"),
    close_lang2: () => m("1306,133"),
    add_photo: () => m("653,214"),
    more: () => m("565,279"),
    upl_photo: () => m("600,160"),
    select_photo: () => m("689,453"),
    select_photo2: () => m("689,465"),
    select_photo3: () => m("689,475"),
    parser_password: () => m("1063,320"),
    parser_submit: () => m("1059,370"),
    parser_access: () => m("996,327"),
    ali_google: () => m("834,442"),
    watchvid: () => m("1316,80"),
    sep20: () => m("1313,141"),
    sep202: () => m("1311,176"),
    addVideo1: () => m("1200,85"),
    addVideo2: () => m("1200,120"),
    createChannel1: () => m("827,515"),
    createChannel2: () => m("827,540"),
};

export default actions;



