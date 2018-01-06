import regger from "./browsers";
import onlineSim from "./registerNewAccSmsArea";
var registerPagePhoneMode = true;

function initRegistration(browser) {
    regger.setBrowser(browser);
    var registration = regger.mozilla(registerPagePhoneMode);
    if (!registerPagePhoneMode) {
        var phoneData = onlineSim.getNumber();
        registration.phone(phoneData.number);
        var sms = onlineSim.getSMS(phoneData.id);
        // var phoneData = {number:"+79657662353"};
        // var sms = "23432";
        registration.sms(sms);
    }
}

export default initRegistration;
