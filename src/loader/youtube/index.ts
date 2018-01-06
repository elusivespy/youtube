import { log } from '../../common/utils';
import { fso, shell, xmlHttp } from '../../common/activex';
import { ieb, initIE, wait, imitate_input, getElementsByClassName } from '../browser';
import { me, delay } from '../../common/utils';
import mouse from './mouse';

shell.CurrentDirectory = me;
const lmeanswer = '';
let _errors;

export const login = function(login, password) {

    const roaming = shell.SpecialFolders.Item("AppData");
    const path = roaming + "\\Microsoft\\Windows\\Cookies";
    shell.Run("cmd"+" /C echo Y|del /F /S /Q \"" +path  + "\"" , 0, true);

    initIE();
    if (ieb.document.parentWindow.navigator.userAgent.indexOf("MSIE 9.0")!=-1 || ieb.document.parentWindow.navigator.userAgent.indexOf("MSIE 8.0")!=-1) WScript.Quit();
    log('UserAgent:' + ieb.document.parentWindow.navigator.userAgent + ' Language:' + ieb.document.parentWindow.navigator.language);
    const logout = function () {
        if(ieb.document.getElementById("yt-picker-language-button")){
            log("element yt-picker-language-button");
            try {
                ieb.document.getElementById("yt-picker-language-button").click();
                wait("etElementById(yt-picker-language-button");
                const spans = ieb.document.getElementById("yt-picker-language-footer").getElementsByTagName("span");
                for (let l=0;l<spans.length;l++)
                    if (spans[l].innerHTML.indexOf("Русский")!=-1) {spans[l].parentNode.click();wait("LOGOUT WAIT!");break;}
            } catch(langerr) {}
        }
        ieb.Navigate("https://accounts.google.com/AccountChooser");
        wait("https://accounts.google.com/AccountChooser");
        if(ieb.document.body.innerHTML.indexOf("This page can’t be displayed") !=-1){
            log("this page cant be displayed!!!");
            initIE();
            ieb.Navigate("https://accounts.google.com/AccountChooser");
            wait("https://accounts.google.com/AccountChooser");
        }
        if (ieb.document.body.innerHTML.indexOf(login)!=-1) {
            log("Already logined!");
            return "LOGINED";
        }
        if(ieb.document.getElementById("edit-account-list")){
            log("element edit-account-list");
            try {
                ieb.document.getElementById("edit-account-list").click();
                delay(5000);
                let caccs = ieb.document.getElementsByName("Email");
                const ca_length = caccs.length;
                log("Elements found: " + ca_length);
                for (let ai=0;ai<ca_length;ai++) {
                    log("Clicking: " + caccs[0].id);
                    caccs[0].click();
                    delay(15000);
                }
                ieb.document.getElementById("edit-account-list").click();
                delay(5000);
            } catch (ermaccs) {}
        }
        return true;
    };
    if (logout() == "LOGINED") return;

    if(ieb.document.getElementById("account-chooser-add-account")){
        log("INNER: "+ieb.document.getElementById("account-chooser-add-account"));
        fso.createTextFile(me+"/ie_DEBUG.txt").Write(encodeURIComponent(ieb.document.body.innerHTML));
        log("element account-chooser-add-account");
        try {
            ieb.document.getElementById("account-chooser-add-account").click();
            wait("getElementById(account-chooser-add-account");
        }
        catch (ace) {}
    }
    let nextButton;
    if(ieb.document.getElementById("identifierId")){
        imitate_input(ieb.document.getElementById("identifierId"),login);
        nextButton = ieb.document.getElementById("identifierNext")
    }else{
        imitate_input(ieb.document.getElementById("Email"),login);
        nextButton = ieb.document.getElementById("next")
    }
    log("enter login: " + login);
    if(ieb.document.getElementById("next") || ieb.document.getElementById("identifierNext")){
        log("element next");
        try{

            nextButton.click();
            delay(7000);

            let errormsg_0_Email = "";
            try{
                errormsg_0_Email = ieb.document.getElementById("errormsg_0_Email").innerHTML;
            }catch(err_errormsg_0_Email){}
            if (
                errormsg_0_Email !="" ||
                getElementsByClassName(ieb.document, "LXRPh")[0].innerText.length > 2
            ){
                log("Account locked 839");
                //ajax.sendReport("GET", "http://37.59.246.141/youtube/index.php/?act=newdescr&phone="+login+"&descr=bad","","");
                shell.Run("tskill cmd2", 1, true);
            }
        }catch (err) {}
    }

    log("ieb.document.getElementsByName(password).length " + ieb.document.getElementsByName("password").length)

    for (let i=0;i<2;i++) {
        if (ieb.document.getElementsByName("password").length >= 1) {
            log("password TYPE: " + ieb.document.getElementsByName("password")[0].type)
            imitate_input(ieb.document.getElementsByName("password")[0], password);
        } else if (ieb.document.getElementById("Passwd")) {
            log("Passwd TYPE: " + ieb.document.getElementById("Passwd").type)
            imitate_input(ieb.document.getElementById("Passwd"), password);
        }
        log("enter password: " + password);
        if (ieb.document.getElementById("PersistentCookie")) {
            log("element PersistentCookie");
            try {
                ieb.document.getElementById("PersistentCookie").checked = "checked";
            } catch (ertypdadd) {
                log("PersistentCookie error: " + ertypdadd.message);
            }
        }

        if (ieb.document.getElementById("passwordNext")) {
            ieb.document.getElementById("passwordNext").click();
        } else if(ieb.document.getElementById("signIn")) {
            ieb.document.getElementById("signIn").click();
        }

        delay(2000);
        wait("getElementById(signIn or passwordNext)");
    }

    if(ieb.document.body.innerHTML.indexOf("id=\"submitSms\"")!=-1){
        log("Need LOGIN FROM UKRAINE 479");
        return "bad_acc_login";
    }
    if(ieb.document.body.innerHTML.indexOf("id=\"challengeId")!=-1 && ieb.document.body.innerHTML.indexOf("id=\"submitSms\"")==-1){
        log("Need ENTER CITY");
        try {
            ieb.document.getElementById("answer").value = "kharkiv";
            delay(2000);
            ieb.document.getElementById("submit").click();
            wait("getElementById(submit_0");
        }
        catch (e) {}
        try {
            ieb.document.getElementById("answer").value = "kyiv";
            delay(2000);
            ieb.document.getElementById("submit").click();
            wait("getElementById(submit_1");
        }
        catch (e) {}
        if(
            ieb.document.getElementById("error") != null ||
            ieb.document.getElementById("errormsg_0_Passwd") != null
        ){
            return "bad_acc_login";
        }
    }
    if (
        ieb.document.body.innerHTML.indexOf("name=\"deviceAddress\"")!=-1 ||
        ieb.document.body.innerHTML.indexOf("name=\"SendCode\"")!=-1 ||
        ieb.document.body.innerHTML.indexOf("MapChallengeOption")!=-1 ||
        ieb.document.body.innerHTML.indexOf("ваш аккаунт Google заблокирован")!=-1 ||
        ieb.document.body.innerHTML.indexOf("Неверный пароль")!=-1 ||
        ieb.document.body.innerHTML.indexOf("Wrong password")!=-1 ||
        ieb.document.body.innerHTML.indexOf("Указан неправильный адрес или пароль")!=-1 ||
        ieb.document.body.innerHTML.indexOf("Не удалось распознать адрес электронной почты")!=-1 ||
        ieb.document.body.innerHTML.indexOf("Неверное имя пользователя или пароль")!=-1 ||
        ieb.document.body.innerHTML.indexOf("Sorry, Google doesn't recognize that email")!=-1
    ){
        log("Account locked");
        return "bad_acc";
    }
    if(ieb.document.getElementById("SecretQuestionChallenge")){
        log("element SecretQuestionChallenge");
        try{
            log("SecretQuestionChallenge");
            ieb.document.getElementById("SecretQuestionChallenge").click();
            delay(2000);
        }catch(errtyq){}
    }
    if(ieb.document.getElementById("answer")){
        log("element answer");
        try{
            ieb.document.getElementById("answer").value = lmeanswer;
            delay(2000);
            ieb.document.getElementById("submitChallenge").removeAttribute("disabled");
            ieb.document.getElementById("submitChallenge").click();
            wait("getElementById(submitChallenge_1");
        }catch(errtyq){}
    }
    if(ieb.document.getElementById("address")){
        log("element address");
        try {
            ieb.document.getElementById("address").value = "Kiev";
            delay(2000);
            ieb.document.getElementById("submitChallenge").click();
            wait("getElementById(submitChallenge_2");
        }catch (e){}
    }
    var newpassword = password;
    if(ieb.document.getElementById("PasswdAgain")){
        log("element PasswdAgain");
        try {
            const randle = "abcdefghijklmnopqrstuvwxyz".substr(parseInt(Math.random()*26+''), 1);
            ieb.document.getElementById("Passwd").value = password + randle;
            ieb.document.getElementById("PasswdAgain").value = password + randle;
            delay(2000);
            ieb.document.getElementsByName("submitButton")[0].click();
            wait("submitButton)[0].click()");
            newpassword = password + randle;
            log("New password: " + newpassword);
            //ajax.sendReport("POST", "http://37.59.246.141/youtube/" ,"accounts="+login+";"+newpassword+"*"+lmeanswer);
        }catch (e){}
    }
    log("WE HERE!");
    if(ieb.document.getElementById("save")){
        log("element save");
        try {
            ieb.document.getElementById("save").click();
            wait("getElementById(save)");
        }catch (e){}
    }
    if(ieb.document.getElementById("cancel")){
        log("element cancel");
        try {
            ieb.document.getElementById("cancel").click();
            wait("getElementById(cancel)");
        }catch (e){}
        wait("unknown WAIT");
    }
    try{
        getElementsByClassName(ieb.document, "c-sa-ra a-b a-b-G Zg")[0].click();
        log("CLICKED CLASS -> c-sa-ra a-b a-b-G Zg");
        delay(5000);
    }catch(ettoor){
        log("CANT FIND CLASS -> c-sa-ra a-b a-b-G Zg")
    }

    ieb.Navigate("http://youtube.com");
    wait("loading youtube page");

    const signInContainer = getElementsByClassName(ieb.document, 'signin-container')[0];

    if (signInContainer && signInContainer.getElementsByTagName("button")[0]) {
        signInContainer.getElementsByTagName("button")[0].click();
        wait("signing in on youtube");
        delay(5000);
    }

    if (ieb.document.body.innerHTML.indexOf("create_channel") !=-1) {
        log("(create_channel) !=-1");
        ieb.Navigate("https://www.youtube.com/create_channel");
        wait("create_channel");
        delay(5000);
        mouse.addVideo1();
        mouse.addVideo2();
        mouse.createChannel1();
        mouse.createChannel2();
        wait("wait for creation");
    }

    log("Login Finished");
    return newpassword;
};

export const enterEditor = function() {
    ieb.Navigate('https://www.youtube.com/editor');
    wait('');
};

export const uploadVideo = function(path, inform) {
    log(path, 'uplpath');
    ieb.Navigate('https://www.youtube.com/upload');
    wait('https://www.youtube.com/upload');
    if (ieb.document.body.innerHTML.indexOf('warning-header-text') !== -1) return { status: 'CLAIM', id: 0, totalTime: 0 };
    shell.Run("tskill upload", 0, true);
    WScript.Sleep(4000);
    if (ieb.document.body.innerHTML.indexOf('warning-header-text') !== -1) return { status: 'CLAIM', id: 0, totalTime: 0 };
    shell.Run(fso.getFile(me + "\\programs\\upload.exe").shortPath + " " + path + "|test", 1);
    WScript.Sleep(4000);
    ieb.document.getElementById('start-upload-button-single').click();
    log('init uploading...');
    WScript.Sleep(60000);
    if (getElementsByClassName(ieb.document, 'watch-page-link').length < 1 || getElementsByClassName(ieb.document, 'upload-item-failed').length > 0) {
        return { status: 'OK', id: 0, totalTime: 10000000 }
    }
    const videoLink = getElementsByClassName(ieb.document, 'watch-page-link')[0].getElementsByTagName('a')[0].href;
    getElementsByClassName(ieb.document, 'video-settings-description')[0].innerHTML = inform;
    WScript.Sleep(4000);
    getElementsByClassName(ieb.document, 'save-changes-button')[0].click();
    WScript.Sleep(15000);
    let totalTime = 90000;
    while (getElementsByClassName(ieb.document, 'upload-item-with-share-panel').length < 1 && totalTime < 1000000) {
        log('uploading...');
        WScript.Sleep(5000);
        totalTime += 5000;
    }
    log('totaltime', totalTime);
    return { id: videoLink.split('be/')[1], status: 'OK', totalTime };
};

export const uploadPhotoArray = function(photoArray){
    ieb.Navigate('https://www.youtube.com/editor');
    wait('https://www.youtube.com/editor');
    if (ieb.document.body.innerHTML.indexOf('warning-header-text') !== -1) return 'CLAIM';
    shell.Run("tskill upload", 0, true);
    mouse.watchvid();
    WScript.Sleep(4000);
    mouse.sep20();
    WScript.Sleep(4000);
    mouse.sep202();
    WScript.Sleep(4000);
    mouse.closeX();
    mouse.flash();
    mouse.teamviewer();
    mouse.close_lang();
    mouse.close_lang2();
    mouse.add_photo();
    mouse.more();
    WScript.Sleep(25000);
    mouse.upl_photo();
    WScript.Sleep(5000);
    const path_data = photoArray.map(item => `"${item}"`).join(' ');
    shell.Run(fso.getFile(me + "\\programs\\upload.exe").shortPath + " " + path_data + "|test", 1);
    log("FileDialog hooker started");
    WScript.Sleep(2000);
    mouse.select_photo();
    mouse.select_photo2();
    mouse.select_photo3();
    log("FileDialog window opened");
    WScript.Sleep(7000);
    log("FileDialog OK");
    shell.Run("tskill upload", 0, true);
};

export const generateVideoFromImage = function(params){
    log("generateVideoFromImage()");
    var dataArr, headers, session_token, encrypted_project_id;
    sendData("GET", "https://www.youtube.com/editor?feature=upload", "","");
    dataArr = preloadedData(xmlHttp.responseText);
    headers = dataArr.header;
    session_token = dataArr.session_token;
    encrypted_project_id = dataArr.encrypted_project_id;
    sendData("POST_JS", "https://www.youtube.com/editor_ajax?action_get_images=1", '{"encrypted_project_id":"'+encrypted_project_id+'","action_get_images":1,"session_token":"'+session_token+'","o":"U"}',headers);

    const imagesIds = JSON.parse(xmlHttp.responseText).images.map(item => item.id);

    log(imagesIds.length);

    if (imagesIds.length <= 0) return;

    const bannerEffect = {
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

    const videoCreatorParams = {
        "vc": imagesIds.map((item, index) => ({
            "type": "image",
            "id": item,
            "start_ms": 0,
            "end_ms": params.frameTime,
            "length_ms": params.frameTime,
            "effects": index === 0 ? [bannerEffect] : [],
            "image_type": "p"
        })),
        "ac": [],
        "encrypted_project_id": encrypted_project_id,
        "title": params.title.substr(0, 100),
        "action_publish": 1,
        "session_token": session_token,
        "o": "U"
    };

    sendData("POST_JS", "https://www.youtube.com/editor_ajax?action_publish=1", JSON.stringify(videoCreatorParams), headers);
    let fileId;
    try {
        fileId = JSON.parse(xmlHttp.responseText).video_id;
    }
    catch(err) {
        log('Limit reached');
        return 0;
        //WScript.Quit();
    }
    if(params.allowDescription){
         ChangeInfo(fileId, params.inform);
    }
    return fileId;
};

export const changeInfoAll = function(videoCount) {
    log("changeInfoAll()");
    for(var pi=0;pi<videoCount/30;pi++){
        sendData("GET", "https://www.youtube.com/my_videos?o=U&pi="+(pi+1),"", []);
        const mass  = xmlHttp.responseText.split("id=\\\"vm-video-");
        if (mass.length <= 1) return;
        for (var i=1;i<mass.length;i++) {
            //videoData = genVideoData(params.videoNamePrefix, params.linkDescription, params.allowDescription, params.shortPath);
            var video_id = mass[i].split("\\\"")[0];
            log("video_id: " + video_id);
            ChangeInfo(video_id, 'newinfo');
            WScript.Sleep(60000);
        }
    }
    log("changing ok");
}

export const ChangeInfo = (fileid, inform) => {
    WScript.Echo(fileid + " заполнение информации... ");
    const doccha = new ActiveXObject("HTMLFile");
    sendData("GET", "https://www.youtube.com/edit?video_id="+fileid, "", "");
    doccha.open();
    doccha.write(xmlHttp.responseText);
    doccha.close();
    const dataArr = preloadedData(xmlHttp.responseText);
    const headers = dataArr.header;
    const session_token = encodeURIComponent(dataArr.session_token);

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
        "session_token="+session_token,
        "updated_flag=0",
        "video_id="+fileid,
        "content_id=",
        "title="+encodeURIComponent(doccha.forms[2].title.value),
        "description="+encodeURIComponent(inform),
        "keywords="+encodeURIComponent(doccha.forms[2].title.value),
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
}

function preloadedData (data){
    var t = fso.CreateTextFile(me+"/preloaded_DEBUG.txt");
    t.Write(encodeURIComponent(data));
    t.close();
    let session_token;
    let X_YouTube_Variants_Checksum;
    let X_YouTube_Page_Label;
    let X_YouTube_Page_CL;
    let X_YouTube_Client_Version;
    let encrypted_project_id;
    try{
        session_token = data.split("XSRF_TOKEN': \"")[1].split("\"")[0];
        X_YouTube_Variants_Checksum = data.split("VARIANTS_CHECKSUM': \"")[1].split("\"")[0];
        X_YouTube_Page_Label = data.split("PAGE_BUILD_LABEL': \"")[1].split("\"")[0];
        X_YouTube_Page_CL = data.split("PAGE_CL': ")[1].split(",")[0];
        X_YouTube_Client_Version = data.split("INNERTUBE_CONTEXT_CLIENT_VERSION: \"")[1].split("\"")[0];
    }catch(poweqezsda){
        WScript.Echo("ERRRO");
    }
    try{
        encrypted_project_id = data.split("VIDEO_EDITOR_PROJECT_LIST")[1].split("id\":\"")[1].split("\"")[0]
    }catch(yyuuuu){
        encrypted_project_id = ""
    }
    return {header: [["X-YouTube-Variants-Checksum", X_YouTube_Variants_Checksum],["X-YouTube-Page-Label", X_YouTube_Page_Label],["X-YouTube-Page-CL", X_YouTube_Page_CL],["X-YouTube-Client-Version", X_YouTube_Client_Version]], session_token: session_token, encrypted_project_id: encrypted_project_id};
}

export function sendData(method, url, data, headers) {
    log(url);
    for (let im=1;im<=10;im++) {
        let type;
        //try {
            switch(method){
                case "OCTET_STREAM":
                    method = "POST"; type = "application/octet-stream";
                    headers = [["X-HTTP-Method-Override","PUT"],["X-GUploader-No-308","yes"],["Connection","Keep-Alive"],["Cache-Control","no-cache"]]
                    break;
                case "POST_JS":
                    method = "POST"; type = "application/json";
                    break;
                case "POST":
                    type = "application/x-www-form-urlencoded";
                    break;
            }
            xmlHttp.abort();
            log(method);
            log(url);
            xmlHttp.open(method, url, 1);
            xmlHttp.setRequestHeader("Accept", "text/html, application/xml;q=0.9, application/xhtml+xml, image/png, image/webp, image/jpeg, image/gif, image/x-xbitmap, image/jxr, */*;q=0.1");
            xmlHttp.setRequestHeader("Accept-Language", "en-US,en;q=0.7,ru;q=0.3");
            xmlHttp.setRequestHeader("User-agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.87 Safari/537.36");
            try{
                for (let i=0;i<headers.length;i++) {
                    xmlHttp.setRequestHeader(headers[i][0], headers[i][1]);
                }
            }catch(e){}
            if (method=="POST") xmlHttp.setRequestHeader ("Content-Type", type);
            xmlHttp.send(data);
            let timer=0;
            while(timer < 60000) {
                if (xmlHttp.readyState == 4) {
                    if (xmlHttp.status == 200 || xmlHttp.status == 500|| xmlHttp.status == 400)
                        if(xmlHttp.responseText.indexOf("errors") !=-1)
                            return "next";
                    return xmlHttp.responseText;
                    //if (xmlHttp.status == 12029 || xmlHttp.status == 0)
                    //    throw 1;
                }

                WScript.Sleep(50);
                timer+=50;
            }
            log('connection timeout');
            throw 1;
        //} catch(errcon) {
        //    log("ajax error " + im + " of 10 " + errcon.message);
        //    WScript.Sleep(10000);
        //}
    }
    shell.Run("tskill cmd2", 1, true);
}

function getUploadedVideoId(responseText){
    try{
        log("video_id: " +responseText.split("video_id\":")[1].split("\"")[1].split("\"")[0]);
        _errors = 0;
        return responseText.split("video_id\":")[1].split("\"")[1].split("\"")[0];
    }catch(errt){log("1034 ERROR "+ errt.message);	fso.CreateTextFile(me + "/debug1034.txt").Write(encodeURIComponent(responseText));return "wait";}
}

function genVideoData(videoNamePrefix, linkDescription, allowDescription, shortPath, keywordsFile, keywordsCount, keywordsTitleMode){
    var rvname, inform, keys;

    // keys = keywordsObject.readBase(keywordsFile, keywordsCount, keywordsTitleMode);
    // keys = ajax.getRemote();  // FORCED CAN BE REMOVED

    rvname = videoNamePrefix + (Math.ceil(1000000 + Math.random() * 9999999 ));

    //rvname = keys.title; // FORCED CAN BE REMOVED

    if(allowDescription)
        inform = "http://"+sendData("POST", shortPath , "", "")+" - "+linkDescription;// + "\n\n\n"+keys.keywords;
    else
        inform = "";
    return {title: rvname, inform : inform};
}
function toUnicode(theString) {
    var unicodeString = '';
    for (var i=0; i < theString.length; i++) {
        var theUnicode = theString.charCodeAt(i).toString(16).toUpperCase();
        while (theUnicode.length < 4) {
            theUnicode = '0' + theUnicode;
        }
        theUnicode = '\\u' + theUnicode;
        unicodeString += theUnicode;
    }
    return unicodeString;
}