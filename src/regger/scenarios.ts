﻿var fso = new ActiveXObject("Scripting.FileSystemObject");
var me = fso.getParentFolderName(WScript.ScriptFullName);

var operaScenario = {
    scenarioName: "opera",
    loginTextMode: "opera",
    nowPicsPathEX: me+"\\reggerPictureTemplates\\opera\\nowPictures\\",
    templatePicsPathEX: me+"\\reggerPictureTemplates\\opera\\picturesTemplate\\",
    closeBrowser: "1350,10",
    needScroll: true,
    scrollPosition: "1356,693",
    win10: {openBrowser: "219,747"},
    win7:  {openBrowser: "272,747"},
    mainPageCoords: {
        googlePage: 			"275,46",
        loginButtonScreen: 		"1269,88,1338,119",
        loginButton: 			"1303,104",
        createAccScreenCheck:	"495,238,571,261",
        createAccScreen: 		"620,600,733,615",
        createAccScreenALT: 	"620,578,737,599",
        createAccScreenNewDes: 	"489,424,623,455",
        createAccButton: 		"673,610",
        createAccButtonALT: 	"681,591",
        // createAccButtonMenu: 	"544,444",
        createAccButtonMenu: 	"589,491",
        createAccButtonNewDes: 	"589,491",
        registerPageScreen: 	"811,310,965,344",
        phonePageScreen:		"632,165,833,188"
    },
    registerFieldCoords: {
        firstName: 					"851,329",
        lastName: 					"1003,326",
        login:						"1067,394",
        loginErrorScreen:			"812,435,1095,461",
        password:					"872,485",
        repeatPassword:				"878,546",
        bDay:						"841,622",
        bMonth:						"928,225",
        bYear:						"1064,625",
        scrollPage:					"1359,695",
        sex:						"885,303",
        phone:						"917,366",
        continueButton:				"1092,560",
        scrollAgreementPosition:	"964,585",
        agreementButton: 			"884,636"
    },
    phoneVerificationPageCoords: {
        inputSMStextScreen:				"465,222,652,239",
        inputSMStext:					"491,259",
        inputPhoneNumberErrorsScreen:	"358,386,701,404",
        inputPhoneNumberPageScreen:		"356,166,560,187",
        inputPhoneNumber:				"447,270",
        continuePhoneButton: 			"402,414",
        confirmButton:					"692,256",
        successCreationScreen:			"557,202,812,239"
    }
};

var mozillaScenario = {
    scenarioName: "firefox",
    loginTextMode: "firefox",
    nowPicsPathEX: me+"\\reggerPictureTemplates\\firefox\\nowPictures\\",
    templatePicsPathEX: me+"\\reggerPictureTemplates\\firefox\\picturesTemplate\\",
    closeBrowser: "1350,10",
    needScroll: true,
    scrollPosition: "1356,693",
    win10: {openBrowser: "168,747"},
    win7:  {openBrowser: "211,747"},
    mainPageCoords: {
        googlePage: 		"186,52",
        loginButtonScreen: 	"1269,88,1338,119",
        loginButton: 		"1303,104",
        createAccScreenCheck:	"495,238,571,261",
        createAccScreen: 	"618,609,739,627",
        createAccScreenALT: "620,578,737,599",
        createAccScreenNewDes: 	"489,424,623,455",
        createAccButton: 	"663,617",
        createAccButtonALT: "681,591",
        // createAccButtonMenu: 	"544,444",
        createAccButtonMenu: 	"589,491",
        createAccButtonNewDes: 	"589,491",
        registerPageScreen: "811,310,965,344",
        phonePageScreen:	"632,165,833,188"
    },
    registerFieldCoords: {
        firstName: 					"851,329",
        lastName: 					"1003,326",
        login:						"1067,394",
        loginErrorScreen:			"812,435,1095,461",
        password:					"872,485",
        repeatPassword:				"878,546",
        bDay:						"841,622",
        bMonth:						"928,225",
        bYear:						"1064,625",
        scrollPage:					"1359,695",
        sex:						"885,303",
        phone:						"917,366",
        continueButton:				"1092,560",
        scrollAgreementPosition:	"964,585",
        agreementButton: 			"884,636"
    },
    phoneVerificationPageCoords: {
        inputSMStextScreen:				"467,227,658,242",
        inputSMStext:					"491,259",
        inputPhoneNumberErrorsScreen:	"358,386,701,404",
        inputPhoneNumberPageScreen:		"356,166,560,187",
        inputPhoneNumber:				"447,270",
        continuePhoneButton: 			"402,414",
        confirmButton:					"692,256",
        // successCreationScreen:			"557,202,812,239"
        successCreationScreen:			"490,200,728,235"
    }
};

var yandexScenario = {
    scenarioName: "yandex",
    loginTextMode: "yandex",
    nowPicsPathEX: me+"\\reggerPictureTemplates\\yandex\\nowPictures\\",
    templatePicsPathEX: me+"\\reggerPictureTemplates\\yandex\\picturesTemplate\\",
    closeBrowser: "1350,10",
    needScroll: true,
    scrollPosition: "1356,693",
    win10: {openBrowser: "274,745"},
    win7:  {openBrowser: "274,745"},
    mainPageCoords: {
        googlePage: 			"275,46",
        loginButtonScreen: 		"1269,88,1338,119",
        loginButton: 			"1303,104",
        createAccScreenCheck:	"495,238,571,261",
        createAccScreen: 		"620,600,733,615",
        createAccScreenALT: 	"620,578,737,599",
        createAccScreenNewDes: 	"489,424,623,455",
        createAccButton: 		"673,610",
        createAccButtonALT: 	"681,591",
        // createAccButtonMenu: 	"544,444",
        createAccButtonMenu: 	"589,491",
        createAccButtonNewDes: 	"589,491",
        registerPageScreen: 	"811,310,965,344",
        phonePageScreen:		"632,165,833,188"
    },
    registerFieldCoords: {
        firstName: 					"851,329",
        lastName: 					"1003,326",
        login:						"1067,394",
        loginErrorScreen:			"812,435,1095,461",
        password:					"872,485",
        repeatPassword:				"878,546",
        bDay:						"841,622",
        bMonth:						"928,225",
        bYear:						"1064,625",
        scrollPage:					"1359,695",
        sex:						"885,303",
        phone:						"917,366",
        continueButton:				"1092,560",
        scrollAgreementPosition:	"964,585",
        agreementButton: 			"884,636"
    },
    phoneVerificationPageCoords: {
        inputSMStextScreen:				"465,222,652,239",
        inputSMStext:					"491,259",
        inputPhoneNumberErrorsScreen:	"358,386,701,404",
        inputPhoneNumberPageScreen:		"356,166,560,187",
        inputPhoneNumber:				"447,270",
        continuePhoneButton: 			"402,414",
        confirmButton:					"692,256",
        successCreationScreen:			"557,202,812,239"
    }
};

var amigoScenario = {
    scenarioName: "amigo",
    loginTextMode: "amigo",
    nowPicsPathEX: me+"\\reggerPictureTemplates\\amigo\\nowPictures\\",
    templatePicsPathEX: me+"\\reggerPictureTemplates\\amigo\\picturesTemplate\\",
    closeBrowser: "1350,10",
    needScroll: true,
    scrollPosition: "1356,693",
    win10: {openBrowser: "360,745"},
    win7:  {openBrowser: "360,745"},
    mainPageCoords: {
        googlePage: 			"275,46",
        loginButtonScreen: 		"1269,95,1338,125",
        loginButton: 			"1303,104",
        createAccScreenCheck:	"495,245,571,266",
        createAccScreen: 		"620,605,733,620",
        createAccScreenALT: 	"620,585,737,605",
        createAccScreenNewDes: 	"489,430,623,460",
        createAccButton: 		"673,610",
        createAccButtonALT: 	"681,591",
        // createAccButtonMenu: 	"544,444",
        createAccButtonMenu: 	"589,491",
        createAccButtonNewDes: 	"589,491",
        registerPageScreen: 	"811,320,965,355",
        phonePageScreen:		"632,175,833,200"
    },
    registerFieldCoords: {
        firstName: 					"851,311",
        lastName: 					"1003,311",
        login:						"1067,379",
        loginErrorScreen:			"812,445,1095,471",
        password:					"872,464",
        repeatPassword:				"878,600",
        bDay:						"841,600",
        bMonth:						"928,117",
        bYear:						"1064,600",
        scrollPage:					"1359,695",
        sex:						"885,188",
        phone:						"917,366",
        continueButton:				"1092,560",
        scrollAgreementPosition:	"964,585",
        agreementButton: 			"884,636"
    },
    phoneVerificationPageCoords: {
        inputSMStextScreen:				"465,232,652,249",
        inputSMStext:					"491,259",
        inputPhoneNumberErrorsScreen:	"358,390,711,418",
        inputPhoneNumberPageScreen:		"356,176,560,197",
        inputPhoneNumber:				"447,270",
        continuePhoneButton: 			"402,414",
        confirmButton:					"692,256",
        successCreationScreen:			"557,212,812,249"
    }
};

var avantScenario = {
    scenarioName: "avant",
    loginTextMode: "avant",
    nowPicsPathEX: me+"\\reggerPictureTemplates\\avant\\nowPictures\\",
    templatePicsPathEX: me+"\\reggerPictureTemplates\\avant\\picturesTemplate\\",
    closeBrowser: "1350,10",
    needScroll: true,
    scrollPosition: "1356,693",
    win10: {openBrowser: "410,745"},
    win7:  {openBrowser: "410,745"},
    mainPageCoords: {
        googlePage: 			"375,46",
        loginButtonScreen: 		"1269,75,1338,105",
        loginButton: 			"1303,85",
        createAccScreenCheck:	"495,237,571,261",
        createAccScreen: 		"620,585,733,600",
        createAccScreenALT: 	"620,565,737,585",
        createAccScreenNewDes: 	"489,410,623,440",
        createAccButton: 		"673,610",
        createAccButtonALT: 	"681,591",
        // createAccButtonMenu: 	"544,444",
        createAccButtonMenu: 	"582,477",
        createAccButtonNewDes: 	"582,477",
        registerPageScreen: 	"811,295,965,326",
        phonePageScreen:		"632,155,833,180"
    },
    registerFieldCoords: {
        firstName: 					"851,309",
        lastName: 					"1003,306",
        login:						"1067,374",
        loginErrorScreen:			"812,422,1095,459",
        password:					"872,466",
        repeatPassword:				"878,535",
        bDay:						"841,604",
        bMonth:						"940,234",
        bYear:						"1064,604",
        scrollPage:					"1359,695",
        sex:						"937,303",
        phone:						"917,365",
        continueButton:				"1092,560",
        scrollAgreementPosition:	"966,589",
        agreementButton: 			"876,634"
    },
    phoneVerificationPageCoords: {
        inputSMStextScreen:				"466,212,655,228",
        inputSMStext:					"502,253",
        inputPhoneNumberErrorsScreen:	"355,372,704,388",
        inputPhoneNumberPageScreen:		"354,152,560,172",
        inputPhoneNumber:				"436,258",
        continuePhoneButton: 			"400,400",
        confirmButton:					"692,248",
        successCreationScreen:			"557,184,812,222"
    }
};
var mx5Scenario = {
    scenarioName: "mx5",
    loginTextMode: "mx5",
    nowPicsPathEX: me+"\\reggerPictureTemplates\\mx5\\nowPictures\\",
    templatePicsPathEX: me+"\\reggerPictureTemplates\\mx5\\picturesTemplate\\",
    closeBrowser: "1350,10",
    needScroll: true,
    scrollPosition: "1356,693",
    win10: {openBrowser: "470,745"},
    win7:  {openBrowser: "470,745"},
    mainPageCoords: {
        googlePage: 			"375,46",
        loginButtonScreen: 		"1251,108,1320,143",
        loginButton: 			"1280,125",
        createAccScreenCheck:	"495,255,568,276",
        createAccScreen: 		"495,255,568,276",
        createAccScreenALT: 	"495,255,568,276",
        createAccScreenNewDes: 	"495,255,568,276",
        createAccButton: 		"554,503",
        createAccButtonALT: 	"681,591",
        // createAccButtonMenu: 	"544,444",
        createAccButtonMenu: 	"554,503",
        createAccButtonNewDes: 	"554,503",
        registerPageScreen: 	"811,334,965,365",
        phonePageScreen:		"632,155,833,180"
    },
    registerFieldCoords: {
        firstName: 					"851,309",
        lastName: 					"1003,306",
        login:						"1067,374",
        loginErrorScreen:			"808,459,1100,493",
        password:					"872,466",
        repeatPassword:				"878,535",
        bDay:						"841,604",
        bMonth:						"928,113",
        bYear:						"1064,604",
        scrollPage:					"1359,695",
        sex:						"885,185",
        phone:						"917,366",
        continueButton:				"1092,560",
        scrollAgreementPosition:	"962,585",
        agreementButton: 			"876,634"
    },
    phoneVerificationPageCoords: {
        inputSMStextScreen:				"466,212,655,228",
        inputSMStext:					"502,253",
        inputPhoneNumberErrorsScreen:	"355,372,704,388",
        inputPhoneNumberPageScreen:		"354,152,560,172",
        inputPhoneNumber:				"436,258",
        continuePhoneButton: 			"396,402",
        confirmButton:					"692,256",
        successCreationScreen:			"557,212,812,249"
    }
};

var kmeleonScenario = {
    scenarioName: "kl",
    loginTextMode: "kl",
    nowPicsPathEX: me+"\\reggerPictureTemplates\\kl\\nowPictures\\",
    templatePicsPathEX: me+"\\reggerPictureTemplates\\kl\\picturesTemplate\\",
    closeBrowser: "1350,10",
    needScroll: true,
    scrollPosition: "1356,693",
    win10: {openBrowser: "540,745"},
    win7:  {openBrowser: "540,745"},
    mainPageCoords: {
        googlePage: 			"275,46",
        loginButtonScreen: 		"1269,115,1338,145",
        loginButton: 			"1303,129",
        createAccScreenCheck:	"496,244,566,266",
        createAccScreen: 		"618,631,732,647",
        createAccScreenALT: 	"617,523,732,536",
        createAccScreenNewDes: 	"496,244,566,266",
        createAccButton: 		"681,532",
        createAccButtonALT: 	"681,532",
        // createAccButtonMenu: 	"544,444",
        createAccButtonMenu: 	"552,489",
        createAccButtonNewDes: 	"552,489",
        registerPageScreen: 	"811,335,965,375",
        phonePageScreen:		"632,165,833,188"
    },
    registerFieldCoords: {
        firstName: 					"851,355",
        lastName: 					"1003,351",
        login:						"1067,420",
        loginErrorScreen:			"812,460,1095,495",
        password:					"872,510",
        repeatPassword:				"878,570",
        bDay:						"841,650",
        bMonth:						"928,225",
        bYear:						"1064,650",
        scrollPage:					"1359,695",
        sex:						"885,305",
        phone:						"917,365",
        continueButton:				"1092,560",
        scrollAgreementPosition:	"962,589",
        agreementButton: 			"884,635"
    },
    phoneVerificationPageCoords: {
        inputSMStextScreen:				"465,255,652,275",
        inputSMStext:					"530,295",
        inputPhoneNumberErrorsScreen:	"358,415,701,432",
        inputPhoneNumberPageScreen:		"356,190,560,215",
        inputPhoneNumber:				"447,270",
        continuePhoneButton: 			"402,443",
        confirmButton:					"692,294",
        successCreationScreen:			"558,227,809,260"
    }
};


export default {
	mozillaScenario: mozillaScenario,
	operaScenario: operaScenario,
	yandexScenario: yandexScenario,
	amigoScenario: amigoScenario,
	avantScenario: avantScenario,
	mx5Scenario: mx5Scenario,
	kmeleonScenario: kmeleonScenario
};