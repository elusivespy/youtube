var shell = new ActiveXObject("WScript.Shell");
while(1) {
    shell.run('taskkill /fi "Windowtitle eq Security Alert"', 0);
    WScript.Sleep(20000);
}