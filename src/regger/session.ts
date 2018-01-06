function log(text){	WScript.Echo(text);}
function userSession(...args) {
    var fso = new ActiveXObject("Scripting.FileSystemObject");
    var me = fso.getParentFolderName(WScript.ScriptFullName);
    var shell = new ActiveXObject("WScript.Shell");
    shell.CurrentDirectory = me;
    var userFolder = shell.ExpandEnvironmentStrings("%USERNAME%");

    var sessionFolder = me + "\\session\\" + userFolder;

    if(!fso.FolderExists(sessionFolder)){
        fso.CreateFolder(sessionFolder);
    }
    sessionFolder += "\\";
    log("Now File is: " + sessionFolder + args[0]+".txt");

	if (args.length==1) {
        return JSON.parse(fso.getFile(sessionFolder + args[0] + ".txt").OpenAsTextStream(1, 0).readall());
    } else if (args.length==2) {
		var out = fso.CreateTextFile(sessionFolder + args[0] + ".txt");
		out.Write(JSON.stringify(args[1]));
		out.close();
	} else {
        WScript.Echo("Error session usage");
    }
}
export default {
	userSession: userSession,
	JSON: JSON
};