export const fso = new ActiveXObject('Scripting.FileSystemObject');
export const shell = new ActiveXObject('WScript.Shell');
export const xmlHttp = new ActiveXObject('Microsoft.XMLHttp');
export const winHttp = new ActiveXObject("WinHttp.WinHttpRequest.5.1");

export const ieFactory = () => new ActiveXObject('InternetExplorer.Application');
export const documentFactory = () => new ActiveXObject('HtmlFile');
export const fileStreamFactory = () => new ActiveXObject('ADODB.Stream');
