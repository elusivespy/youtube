import registerSmsArea from "./registerNewAccSmsArea";
var browser;
function log(...args){
    for(var i = 0; i < args.length; i++){
        WScript.Echo(args[i])
    }
}

import session from "./session";
import ajax from "./sendData";
import scenarios from "./scenarios";


var mode = {};
var browserTskill = "";
var ie = new ActiveXObject("WinHttp.WinHttpRequest.5.1");
var fso = new ActiveXObject("Scripting.FileSystemObject");
var me = fso.getParentFolderName(WScript.ScriptFullName);
var shell = new ActiveXObject("WScript.Shell");
shell.CurrentDirectory = me;
var phoneState = false;
var registerPagePhoneNumber = false;

// ieb = new ActiveXObject("InternetExplorer.Application");
// ieb.visible = true;
// ieb.Navigate("about:blank");
// WScript.Sleep(5000);
// ieb.document.parentWindow.clipboardData.setData("Text",description); // save data to buffer
// shell.sendKeys("^{v}");

const setBrowser = browser => {

    var tskillAllBrowsers =['firefox', 'amigo', 'maxthon'];

    for(var i = 0; i < tskillAllBrowsers.length; i++) {
        log("KILL BROWSER --> " + "tskill " + tskillAllBrowsers[i]);
        // if (browserTskill != "opera" && browserTskill != "browser") {
        shell.Run("tskill " +  tskillAllBrowsers[i], 1, true);
        // WScript.Sleep(1000);
        // }
    }

    switch (browser) {
        case "moz":
            mode = scenarios.mozillaScenario;
            browserTskill = "firefox";
            break;
        case "op":
            mode = scenarios.operaScenario;
            browserTskill = "opera";
            break;
        case "ya":
            mode = scenarios.yandexScenario;
            browserTskill = "browser";
            break;
        case "amigo":
            mode = scenarios.amigoScenario;
            browserTskill = "amigo";
            break;
        case "mx5":
            mode = scenarios.mx5Scenario;
            browserTskill = "maxthon";
            break;
        case "kmeleon":
            mode = scenarios.kmeleonScenario;
            browserTskill = "k-meleon";
            break;
        case "avant":
            mode = scenarios.avantScenario;
            browserTskill = "avant";
            break;
    }
}

function browserOperation(scenario){
    if(registerPagePhoneNumber) {
        var getPhoneForRegisterPage;
        getPhoneForRegisterPage = registerSmsArea;
    }

	var loginTextMode = scenario.loginTextMode;
    phoneState = false;
	var nowPicsPath = scenario.nowPicsPathEX;
	var templatePicsPath =  scenario.templatePicsPathEX;
	var base=[];
	var lmelogin, lmepassword;
	this.startJob = function(){
		var params = scenario.mainPageCoords;
		var registerFieldCoords = scenario.registerFieldCoords;
		var phoneVerificationPageCoords = scenario.phoneVerificationPageCoords;

        // checkScreenState("inputPhoneNumberErrorsScreen", phoneVerificationPageCoords.inputPhoneNumberErrorsScreen);
        // checkScreenStateEXPERIMENTAL("dynamicScreenPage");
        // session.userSession("new_acc", {login:"login",password:"pass"});
        // WScript.Quit();
		
		if (
		    scenario.scenarioName === "opera" ||
		    scenario.scenarioName === "avant" ||
            scenario.scenarioName === "kl" ||
            scenario.scenarioName === "yandex"
        ) {
			base["closeBrowser"] = scenario.closeBrowser;
			simulate("closeBrowser");
			base["closeBrowser"] = scenario.closeBrowser;
			simulate("closeBrowser");
			WScript.Sleep(5000);
		}

		base["openBrowser"] = scenario.win10.openBrowser;
		simulate("openBrowser");
		WScript.Sleep(10000);

		this.navigateToGooglePage(params.googlePage);
        var checkState = checkScreenState("loginButtonScreen", params.loginButtonScreen);

        if(checkState.status === "STATUS_BAD") {
            this.navigateToGoogleAccountsPage(params.googlePage);
        } else {
            this.pressLoginButton(params.loginButton);
		}

        checkState = checkScreenState("createAccNewDes", params.createAccScreenCheck);
		log("createAccNewDes checkState: " + JSON.stringify(checkState));

        if(checkState.page !== "createAccNewDes") {
            if (scenario.needScroll) {
                base["scrollToBottom"] = scenario.scrollPosition;
                simulate("scrollToBottom");
                WScript.Sleep(5000);
                checkScreenState("createAccScreen", params.createAccScreenALT);
                this.navigateToRegisterPage(params.createAccButtonALT);
            } else {
                checkScreenState("createAccScreen", params.createAccScreen);
                this.navigateToRegisterPage(params.createAccButton);
            }
        }else{
            base["createAccmenuBut"] = params.createAccButtonMenu;
            simulate("createAccmenuBut");
            this.navigateToRegisterPage(params.createAccButtonNewDes);
        }
		checkScreenState("registerPageScreen", params.registerPageScreen);
		
		var regPagePhoneData = this.registerNewAccount(registerFieldCoords);

		checkScreenStateEXPERIMENTAL("dynamicScreenPage");

        if(regPagePhoneData !== ''){
            this.phoneVerificationPage();
            this.smsVerificationPage(regPagePhoneData);
        }

		// checkScreenState("phonePageScreen", params.phonePageScreen);
		//this.phoneVerificationPage(phoneVerificationPageCoords);
		//this.smsVerificationPage(phoneVerificationPageCoords);
	};

	this.navigateToGooglePage = function(googlePage){
		base["googlePage"] = googlePage;
		simulate("googlePage");
		imitate("http://google.com");
		imitate("{ENTER}");
		WScript.Sleep(10000);
	};

	this.navigateToGoogleAccountsPage = function(googlePage){
		base["googlePage"] = googlePage;
		simulate("googlePage");
		imitate("https://accounts.google.com/signin/v2/identifier");
		imitate("{ENTER}");
		WScript.Sleep(10000);
	};

	this.pressLoginButton = function(loginButton){
		base["loginButton"] = loginButton;
		simulate("loginButton");
		WScript.Sleep(10000);
	};

	this.navigateToRegisterPage = function(createAccButton){
		base["createAccButton"] = createAccButton;
		simulate("createAccButton");
		WScript.Sleep(10000);
	};

	this.registerNewAccount = function(params) {
        function randomizeText(text, count) {
            text = text.split('');
            for (var i=0;i<count;i++) {
                text.splice(Math.floor(Math.random() * text.length), 0, 	String.fromCharCode(97 + Math.floor(Math.random() * 26)));
            }
            return text.join('');
        }
		var getFirstLastName = getPersonalData();
		var firstName = getFirstLastName.firstName;
		// var firstName = uFirst(translate(getFirstName()+"", "en").split(" ").join(""));
		base["firstName"] = params.firstName;
		simulate("firstName");
		imitate(firstName);
		
		log("firstName: " +  firstName);
		
		var lastName = getFirstLastName.lastName;
		// var lastName = uFirst(translate(getLastName()+"", "en").split(" ").join(""));
		base["lastName"] = params.lastName;
		simulate("lastName");
		imitate(lastName);
		log("lastName: " +  lastName);
		
		// var login = (translate(firstName, "en")+translate(lastName, "en")).toLowerCase().replace(" ", "");
		// var login = (firstName+lastName).toLowerCase().replace(" ", "");
        var login = randomizeText(firstName+lastName, 5).toLowerCase().replace(" ", "");

        base["login"] = params.login;
		simulate("login");
		imitate(login);
		log("login: " +  login);
		
		base["check_login"] = params.password;
		simulate("check_login");
		
		var loginStatus = checkScreenState("loginErrorScreen", params.loginErrorScreen);
        if(loginStatus.status === "login_error"){
            if (loginTextMode === "firefox"){
                login = login+firstName+Math.floor(100 + Math.random() * 900);
                base["login"] = params.login;
                simulate("login");
                imitate(login);
            }
            else{
                login = firstName+Math.floor(1000 + Math.random() * 9000);
                base["login"] = params.login;
                simulate("login", 100);
                simulate("login", 100);
                imitate(login);
            }
            log("login: " +  login);
        }
		lmelogin = login;// global
		
		var lmepass = rPass();
		lmepassword = lmepass; // global
		base["password"] = params.password;
		simulate("password");
		imitate(lmepass);
		base["repeatPassword"] = params.repeatPassword;
		simulate("repeatPassword");
		imitate(lmepass);
		log("lmepass: " +  lmepass);

		var BirthDay = 1 + Math.floor(Math.random() * 27)+"";
		base["bDay"] = params.bDay;
		simulate("bDay");
		imitate(BirthDay+"");
		log("BirthDay: " +  BirthDay);
		
		var BirthYear = 1950 + Math.floor(Math.random() * 40)+"";
		base["bYear"] = params.bYear;
		simulate("bYear");
		imitate(BirthYear);
		log("BirthYear: " +  BirthYear);
		
		base["scrollPage"] = params.scrollPage;
		simulate("scrollPage");
		
		base["bMonth"] = params.bMonth;
		base["bMonthsecond"] = params.bMonth.split(",")[0] +","+ (Math.floor(params.bMonth.split(",")[1]) + Math.floor(Math.random() * 274));
		simulate("bMonth");
		simulate("bMonthsecond");
		
		base["sex"] = params.sex;
		base["sexsecond"] = params.sex.split(",")[0] +","+ (Math.floor(params.sex.split(",")[1]) + Math.floor(Math.random() * 25));
		simulate("sex");
		simulate("sexsecond");

        var phoneData;
        if (registerPagePhoneNumber) {
            phoneData = getPhoneForRegisterPage.getNumber();
            // phoneData = {number: "79111050134"};
            var phoneNumber = phoneData.number;
            base["phone"] = params.phone;
            simulate("phone");
            imitate("{BACKSPACE}");
            imitate("{BACKSPACE}");
            imitate("{BACKSPACE}");
            imitate("{BACKSPACE}");
            imitate("{BACKSPACE}");
            imitate("{+}");
            imitate(phoneNumber);
        }

		base["continueButton"] = params.continueButton;
		simulate("continueButton");
		WScript.Sleep(8000);
		
		base["scrollAgreementPosition"] = params.scrollAgreementPosition;
		for(var i=0;i<3;i++){
			simulate("scrollAgreementPosition", 1);// second arg is time to wait CANT BE (0)ZERO and NOT necessary
		}
		
		base["agreementButton"] = params.agreementButton;
		simulate("agreementButton");

		return phoneData;
	};

	this.phoneVerificationPage = function(phone){
		var params = scenario.phoneVerificationPageCoords;
		checkScreenState("inputPhoneNumberPageScreen", params.inputPhoneNumberPageScreen);

		if (!registerPagePhoneNumber) {
            var phoneNumber = phone; // entering phone number
            base["inputPhoneNumber"] = params.inputPhoneNumber;
            simulate("inputPhoneNumber");
            imitate("{+}");
            imitate(phoneNumber);
            log("phoneNumber: " + phoneNumber);
        }

		base["continuePhoneButton"] = params.continuePhoneButton;
		simulate("continuePhoneButton");
		WScript.Sleep(10000);
	
		checkScreenState("inputPhoneNumberErrorsScreen", params.inputPhoneNumberErrorsScreen);
	};

	this.smsVerificationPage = function(sms){
		var params = scenario.phoneVerificationPageCoords;
		checkScreenState("inputSMStextScreen", params.inputSMStextScreen);

        var receivedSMS = sms; // received SMS

        if (!registerPagePhoneNumber) {
            receivedSMS = getPhoneForRegisterPage.getSMS(sms.id);  // received SMS
        }

		base["inputSMStext"] = params.inputSMStext;
		simulate("inputSMStext");
		imitate(receivedSMS);
		
		base["confirmButton"] = params.confirmButton;
		simulate("confirmButton");
		WScript.Sleep(10000);
		
		 checkScreenState("successCreationScreen", params.successCreationScreen);
		// WScript.Sleep(5000);

	};

	function checkScreenStateEXPERIMENTAL(pictureName){

	// can find the page where we now!
		var picturesCoord = getScreenCoordsFromObject(scenario.mainPageCoords).concat(getScreenCoordsFromObject(scenario.phoneVerificationPageCoords));
		log(picturesCoord);
		var picsCoordLength = picturesCoord.length;
		for(var i=0;i<picsCoordLength;i++){
			
			var nowPic = nowPicsPath+pictureName+".jpg";
			log("now coords: " + picturesCoord[i]);
			base[pictureName] = "screen,"+picturesCoord[i]+","+nowPic;
			simulate(pictureName);

			var pageStatus = comparePictures(nowPic);
		
			if(pageStatus.status !== "STATUS_OK"){
				if(i === picsCoordLength-1){
					log("pageNot FOUND DYNAMICALLY!");
					shell.Run("tskill cmd2", 0, true);
					WScript.Quit();
				}
				log("LOOKING FOR PAGE!");
			}else{
				log("--------> NOW PAGE: " + pageStatus.page);
				return pageStatus.page;
			}
		}
		
		function getScreenCoordsFromObject(Array){
			var result = [];
			for(let value in Array){
				if(Array[value].split(",").length > 2)
					result.push(Array[value])
			}
			return result;
		}
	}

	function checkScreenState(pictureName, pictureCoord){
		var nowPic = nowPicsPath+pictureName+".jpg";
		base[pictureName] = "screen,"+pictureCoord+","+nowPic;
		simulate(pictureName);
		var pageStatus = comparePictures(nowPic);
			
		switch(pageStatus.status){
			case "STATUS_LOGIN_ERROR":
				return {status: "login_error", page: ""};
			case "STATUS_BAD":
				if(
					pictureName !== "loginButtonScreen" &&
					pictureName !== "loginErrorScreen" &&
					pictureName !== "inputPhoneNumberErrorsScreen" &&
					pictureName !== "createAccNewDes"
				){
					log("ERROR PAGE!");
					shell.Run("tskill cmd2", 0, true);
					WScript.Quit();
				} else {
                    return pageStatus;
                }
				break;
			case "STATUS_BAD_PHONE":
				log("ERROR PAGE!");
				shell.Run("tskill cmd2", 0, true);
				WScript.Quit();
				break;
            default:
                return pageStatus;
		}
	}

	function comparePictures(nowPage) {
		
		var pages = [templatePicsPath+"loginButtonTemplate.jpg", templatePicsPath +"loginErrorTemplate.jpg", templatePicsPath+"createAccTemplate.jpg", templatePicsPath+"createAccALTTemplate.jpg", templatePicsPath+"createAccNewDesTemplate.jpg", templatePicsPath+"registerPageTemplate.jpg", templatePicsPath+"inputPhoneNumberPageTemplate.jpg", templatePicsPath+"inputPhoneNumberErrorsTemplate.jpg", templatePicsPath+"inputSMStextTemplate.jpg", templatePicsPath+"successCreationTemplate.jpg"];

		var current_page = "";
		
		for (var p = 0; p < pages.length; p++) {
			if (fileCompare(pages[p],nowPage)) {
				// log(pages[p]);
				current_page = pages[p];
				break;
			}
		}

		switch (current_page) {
			case templatePicsPath+"loginButtonTemplate.jpg":
				log("login page!");
				return {status: "STATUS_OK", page: "loginButton"};
			case templatePicsPath+"loginErrorTemplate.jpg":
				log("login page!");
				return {status: "STATUS_LOGIN_ERROR", page: "loginError"};
			case templatePicsPath+"createAccNewDesTemplate.jpg":
			    return {status: "STATUS_OK", page:"createAccNewDes"};
			case templatePicsPath+"createAccALTTemplate.jpg":
			case templatePicsPath+"createAccTemplate.jpg":
				log("create acc page!");
				return {status: "STATUS_OK", page: "createAcc"};
			case templatePicsPath+"registerPageTemplate.jpg":
				log("register page!");
				return {status: "STATUS_OK", page: "registerPage"};
			case templatePicsPath+"inputPhoneNumberPageTemplate.jpg":
				log("Phone page!");
                phoneState = true;
				return {status: "STATUS_OK", page: "inputPhoneNumberPage"};
			case templatePicsPath+"inputPhoneNumberErrorsTemplate.jpg":
				log("PHONE PAGE ERROR!");
				return {status: "STATUS_BAD_PHONE", page: "inputPhoneNumberErrors"};
			case templatePicsPath+"inputSMStextTemplate.jpg":
				log("SMS page!");
				return {status: "STATUS_OK", page: "inputSMStext"};
			case templatePicsPath+"successCreationTemplate.jpg":
				log("SUCCESS CREATION!");
				var phoneStatus = "*browser";
				if(!phoneState){
                    phoneStatus = "@no_phone"
                }
				ajax.sendReport("POST","http://37.59.246.141/youtube/","state=completed&accounts=" + lmelogin+";"+lmepassword+phoneStatus);
				session.userSession("new_acc", {login:lmelogin,password:lmepassword});
				shell.Run("tskill cmd2", 0, true);
				return {status: "STATUS_OK", page: "successCreation"};
			default:
				return {status: "STATUS_BAD", page: "NOT_FOUND"};
		}
	}
	// function fetch(url) {
		// var http = new ActiveXObject("Microsoft.XMLHttp");
		// http.open("GET", url, 0);
		// http.send();
		// return http.responseText;
	// }

	function getPersonalData() {
		var response = ajax.sendData("GET", "http://www.fakenamegenerator.com/gen-random-ru-us.php", "");
		var data = response.split("class=\"address\"")[1].split("<h3>")[1].split("</h3>")[0].split(" ");
		return {
			firstName: data[0],
			lastName: data[1]
		}
	}

	function urldecode (str) {	
		return decodeURIComponent((str + '').replace(/\+/g, '%20'));
	}

	function getFirstName() {
		var res = "";
		var iedata = new ActiveXObject("WinHttp.WinHttpRequest.5.1");
		iedata.open("POST","http://37.59.246.141/youtube/?act=getfirstname",0);
		iedata.send();
		return urldecode(iedata.responseText);
	}

	function getLastName() {
		var res = "";
		var iedata = new ActiveXObject("WinHttp.WinHttpRequest.5.1");
		iedata.open("POST","http://37.59.246.141/youtube/?act=getlastname",0);
		iedata.send();
		return urldecode(iedata.responseText);
	}

	function uFirst(text) {
		var text = text.split(" ");
		for (var i=0;i<text.length;i++) 
			text[i] = text[i].substr(0,1).toUpperCase() + text[i].substr(1).toLowerCase();
		return text.join(" ");
	}

	function translate(text, lang) {
		var user_agent = "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML like Gecko) Chrome/28.0.1500.95 Safari/537.36";
		function sendData(method, url, data) {
			ie.open(method, url, 0);
			ie.setRequestHeader("Accept", "text/html, application/xml;q=0.9, application/xhtml+xml, image/png, image/webp, image/jpeg, image/gif, image/x-xbitmap, */*;q=0.1");
			ie.setRequestHeader("Accept-Language", "ru-RU,ru;q=0.9,en;q=0.8");
			ie.setRequestHeader("User-agent", user_agent);
			if (method === "POST") ie.setRequestHeader ("Content-Type", "application/x-www-form-urlencoded");
			ie.send(data);
			return ie.responseText;
		}

		// if (mode!="adulten") 
			// return text;
		log("tex: " +text);		
		
		sendData("GET", "https://translate.yandex.net/api/v1.5/tr.json/translate?key=trnsl.1.1.20160605T105026Z.daf9a9c60ffebf31.58a32ac13c6d47d0a31101a2cb6261bfabd7ca9f&text=" + text +"&lang=en", 0);
		WScript.Echo(ie.responseText);
		return(eval("tlan="+ie.responseText)["text"][0]);
	}

	function rPass() {
		var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
			var string_length = 8+Math.floor(Math.random() * 5);
			var randomstring = '';
			for (var i=0; i<string_length; i++) {
				var rnum = Math.floor(Math.random() * chars.length);
				randomstring += chars.substring(rnum,rnum+1);
			}
			return(randomstring);	
	}

	function fileCompare(f1, f2) {
		log("Compare: " + f1.split(".")[0].split("\\")[f1.split("\\").length-1]+" VS "+f2.split(".")[0].split("\\")[f1.split("\\").length-1]);

        function getPercentage (a, b) {
            var result;
            if (a > b) {
                result = Math.floor(((a - b) / a) * 100);
                // result = Math.floor(((a - b) * 100) / b);
            } else {
                result = Math.floor(((b - a) / b) * 100);
                // result = Math.floor(((b - a) * 100) / a);
            }
            return result;
        }

        function countNotWhitePixels(v) {
            var counter = 0;
            for (i = 1; i <= v.Count; i++) {
                if (v(i) < (-1800000)) {
                    counter++;
                }
            }
            return counter;
        }

        var Img, IP, v, v2, i, img1PixelCount, img2PixelCount, countImg1, countImg2, diffPercent, percentCountPixelsDiff, result;
        Img = new ActiveXObject("WIA.ImageFile");
        // IP = new ActiveXObject("WIA.ImageProcess");

        Img.LoadFile(f1);
        v = Img.ARGBData;
        img1PixelCount = v.Count;

        Img.LoadFile(f2);
        v2 = Img.ARGBData;
        img2PixelCount = v2.Count;

        percentCountPixelsDiff = getPercentage(img1PixelCount, img2PixelCount);

        // log("width: " + Img.Width, "height: " + Img.Height);
        // log("percentCountPixelsDiff is " + percentCountPixelsDiff + "%");

        if (percentCountPixelsDiff < 1) {
            log(img1PixelCount, img2PixelCount);
            countImg1 = countNotWhitePixels(v);
            countImg2 = countNotWhitePixels(v2);
            log("countImg1: " + countImg1, "countImg2: " + countImg2);

            diffPercent = getPercentage(countImg1, countImg2);
            log("Difference is: " + diffPercent + "%") ;

            if (diffPercent < 5) {
                result = true;
            } else {
                result = false;
            }
        } else {
            log(percentCountPixelsDiff + "% > 1%");
            result = false;
        }

        // var Stream = new ActiveXObject("ADODB.Stream");
		// Stream.Type = 2;
		// Stream.Open();
		// Stream.LoadFromFile(f1);
		// var File1 = Stream.ReadText();
		// Stream.Close();
		// Stream.Open();
		// Stream.LoadFromFile(f2);
		// var File2 = Stream.ReadText();
		// Stream.Close();
		// return File1 == File2;
		return result;
	}

	function simulate(dname, time = 1000) {
		WScript.Sleep(time);
		WScript.Echo("emulator3.exe " + base[dname]);
		shell.Run("emulator3.exe " + base[dname], 1, true);
		WScript.Sleep(time);
	}

	function imitate(text) {
		if (text.indexOf("{")!=-1){
			shell.SendKeys(text);WScript.Sleep(300+Math.floor(Math.random()*100));
			return;
		}
		for (let j=0;j<text.length;j++){
			try {
				shell.SendKeys(text.substr(j,1));
			} catch(error_key) {}
			WScript.Sleep(100+Math.floor(Math.random()*100));
		}
	}
}

function SendFile(host, key) {
	var Boundary = "---------------------------zObSSwmaO93z";
	var Stream = new ActiveXObject("ADODB.Stream");Stream.Type = 1;Stream.Mode = 3;Stream.Open();
	var FieldHeader = "--"+Boundary+"\nContent-Disposition: form-data; name=\"method\"\n\npost\n--"+Boundary+"\nContent-Disposition: form-data; name=\"key\"\n\n"+key+"\n--"+Boundary+"\nContent-Disposition: form-data; name=\"file\"; filename=\"capcha.jpg\"\nContent-Type: image/pjpeg\n\n";
	//WScript.Echo(FieldHeader);
	Stream.Write(StringToBinary(FieldHeader));
	var Stream2 = new ActiveXObject("ADODB.Stream");Stream2.Type = 1;Stream2.Open();
	Stream2.LoadFromFile(fso.getParentFolderName(WScript.ScriptFullName)+ "/cap.jpg");
	Stream.Write(Stream2.Read());
	Stream.Write(StringToBinary("\n--" + Boundary + "--"));
	Stream.Position = 0;
	var XMLHttp = new ActiveXObject("MSXML2.XMLHTTP");
	XMLHttp.Open("POST",host,0);
	XMLHttp.SetRequestHeader("Content-type","multipart/form-data;boundary="+Boundary);
	XMLHttp.Send(Stream.Read());
	return XMLHttp.responseText;
}
function StringToBinary(SourceString){
	var Stream1 = new ActiveXObject("ADODB.Stream");
	Stream1.Charset = "Windows-1251";
	Stream1.Type = 2  ;
	Stream1.Mode = 3 ;
	Stream1.Open();
	Stream1.WriteText(SourceString);
	Stream1.Position = 0;
	Stream1.Type = 1;
	return Stream1.Read();
}
function DownloadFile(path) {
	var oXMLHTTP4 = new ActiveXObject("MSXML2.XMLHTTP")
	oXMLHTTP4.Open("GET", path, 0);
	oXMLHTTP4.Send();
	var Stream3 = new ActiveXObject("ADODB.Stream");
	Stream3.Mode = 3;
	Stream3.Type = 1;
	Stream3.Open();
	Stream3.Write(oXMLHTTP4.responseBody);
	Stream3.SaveToFile("cap.jpg", 2);
}
function RecognCaptcha() {
	var key= "54a0607b03d3e7274fa08742355b15e8";
    var capid, ctext;
	var cstate = SendFile("http://antigate.com/in.php", key);
	if (cstate.split("|")[0] === "OK") capid = cstate.split("|")[1]; else {WScript.Echo(cstate);return "";}
	var shell  = new ActiveXObject("WScript.Shell");
	var ie = new ActiveXObject("MSXML2.XMLHTTP");
	while(true) {
		ie.open("GET","http://antigate.com/res.php?key="+key+"&action=get&id="+capid,0);
		ie.setRequestHeader("If-Modified-Since", "Thu, 1 Jan 1970 00:00:00 UTC");
		ie.send();
		cstate = ie.responseText;
		if (cstate.split("|")[0] === "OK") {
			ctext = (cstate.split("|")[1]);
			break;
		}else{
			WScript.Echo(cstate);
			WScript.Sleep(2000)	;
			if (cstate === "ERROR_NO_SUCH_CAPCHA_ID" || cstate ==="ERROR_CAPTCHA_UNSOLVABLE") {
				return "bad";
			}
		}
	}
	return (ctext);
	//http://antigate.com/res.php?key=54a0607b03d3e7274fa08742355b15e8&action=reportbad&id=CAPCHA_ID_HERE
}

export default {
    mozilla: function(registerPagePhoneMode) {
        if(registerPagePhoneMode) {
            registerPagePhoneNumber = true;
        }
        browser = new browserOperation(mode);
        browser.startJob();
        return {
            phone: browser.phoneVerificationPage,
            sms: browser.smsVerificationPage
        }
    },
    setBrowser,
};

// function simulate(dname, time) {
// time = time || 1000;
// WScript.Sleep(time);
// WScript.Echo("emulator3.exe " + base[dname]);
// shell.Run("emulator3.exe " + base[dname], 1, true);
// WScript.Sleep(time);
// }
// var base = [];
// var nowPic = "1.jpg";
// base["22"] = "screen,"812,435,1095,461","+nowPic;
// simulate("22");
