import { ieFactory, shell } from '../common/activex';
import { executeHidden } from '../common/file';
import { delay, log } from '../common/utils';
import mouse from './youtube/mouse';

export let ieb;

export const initIE = () => {
    while(true) {
        try {
            executeHidden('tskill iexplore');
            delay(5000);
            ieb = ieFactory();
            ieb.visible = true;
            ieb.Navigate("about:blank");
            const window = ieb.document.parentWindow;
            window.moveTo(0, 0);
            window.resizeTo(window.screen.width, window.screen.height);
            delay(3000);
            break;
        } catch (err) {
            log('error ie init');
        }
    }
    //mouse.maximizeIEWindow();
};

export const wait = (url) => {
    WScript.Sleep(15000);
    if (url) return;
    var refreshState = true;
    var comeFrom = "";

    mainCycle:
        for (var wc=1;wc<=3;wc++) {
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
                log("was_busy " + was_busy);
                log("ieb.busy " + ieb.busy);
                log("duration " + duration);
                log("ieb.document.readyState " + ieb.document.readyState);
                if (was_busy && (!ieb.busy || ieb.document.readyState == "complete")  && duration>5000) {
                    log('befory TRRRRYYYY');
                    try {
                        if (
                            ieb.document.title == "Не удается отобразить эту страницу" ||
                            ieb.document.body.innerHTML.indexOf("This page can’t be displayed") != -1
                        ) {
                            ieb.refresh();
                            continue mainCycle;
                        }
                        else {
                            log("Page OK");
                            return 1;
                        }
                    } catch (eeee) {return 1;}
                }
                if (duration>max_wait || (was_busy==false && duration>5000)) {
                    if(refreshState){
                        log("refrshing page!");
                        ieb.refresh();
                        continue mainCycle;
                    }
                }
                WScript.Sleep(1000);
            }
        }
    WScript.Echo("Page unavailable");
    shell.Run("tskill cmd2", 1, true);
};

export const imitate_input = (element, text) => {

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
export const getElementsByClassName = (node, classname) => {
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