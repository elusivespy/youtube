var ie = new ActiveXObject("WinHttp.WinHttpRequest.5.1");
ie.SetTimeouts(1800000, 1800000, 1800000, 1800000);

function sendData(method, url, data) {
	var user_agent = "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML like Gecko) Chrome/28.0.1500.95 Safari/537.36";
	ie.open(method, url, 0);
	ie.setRequestHeader("Accept", "text/html, application/xml;q=0.9, application/xhtml+xml, image/png, image/webp, image/jpeg, image/gif, image/x-xbitmap, */*;q=0.1");
	ie.setRequestHeader("Accept-Language", "ru-RU,ru;q=0.9,en;q=0.8");
	ie.setRequestHeader("User-agent", user_agent);
	if (method=="POST") ie.setRequestHeader ("Content-Type", "application/x-www-form-urlencoded"); 
	ie.send(data);
	return ie.responseText;
}
export default {
	sendData: sendData,
	sendReport: sendData
}