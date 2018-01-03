"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var activex_1 = require("../common/activex");
var file_1 = require("../common/file");
var utils_1 = require("../common/utils");
exports.initIE = function () {
    while (true) {
        try {
            file_1.executeHidden('tskill iexplore');
            utils_1.delay(5000);
            exports.ieb = activex_1.ieFactory();
            exports.ieb.visible = true;
            exports.ieb.Navigate("about:blank");
            var window_1 = exports.ieb.document.parentWindow;
            window_1.moveTo(0, 0);
            window_1.resizeTo(window_1.screen.width, window_1.screen.height);
            utils_1.delay(3000);
            break;
        }
        catch (err) {
            utils_1.log('error ie init');
        }
    }
    //mouse.maximizeIEWindow();
};
exports.wait = function (url) {
    WScript.Sleep(15000);
    if (url)
        return;
    var refreshState = true;
    var comeFrom = "";
    mainCycle: for (var wc = 1; wc <= 3; wc++) {
        WScript.Echo("Wait Step " + wc);
        var was_html;
        try {
            was_html = exports.ieb.document.body.innerHTML;
        }
        catch (err) {
            was_html = Math.random();
        }
        var was_busy = false;
        var max_wait = wc * 60000;
        var start = new Date().getTime();
        utils_1.log("Loading page ");
        while (true) {
            var duration = (new Date().getTime() - start);
            if (exports.ieb.busy)
                was_busy = true;
            utils_1.log("was_busy " + was_busy);
            utils_1.log("ieb.busy " + exports.ieb.busy);
            utils_1.log("duration " + duration);
            utils_1.log("ieb.document.readyState " + exports.ieb.document.readyState);
            if (was_busy && (!exports.ieb.busy || exports.ieb.document.readyState == "complete") && duration > 5000) {
                utils_1.log('befory TRRRRYYYY');
                try {
                    if (exports.ieb.document.title == "Не удается отобразить эту страницу" ||
                        exports.ieb.document.body.innerHTML.indexOf("This page can’t be displayed") != -1) {
                        exports.ieb.refresh();
                        continue mainCycle;
                    }
                    else {
                        utils_1.log("Page OK");
                        return 1;
                    }
                }
                catch (eeee) {
                    return 1;
                }
            }
            if (duration > max_wait || (was_busy == false && duration > 5000)) {
                if (refreshState) {
                    utils_1.log("refrshing page!");
                    exports.ieb.refresh();
                    continue mainCycle;
                }
            }
            WScript.Sleep(1000);
        }
    }
    WScript.Echo("Page unavailable");
    activex_1.shell.Run("tskill cmd2", 1, true);
};
exports.imitate_input = function (element, text) {
    function simulate_ie(element, eventName) {
        var options = extend(defaultOptions, arguments[2] || {});
        var oEvent, eventType = null;
        for (var name in eventMatchers) {
            if (eventMatchers[name].test(eventName)) {
                eventType = name;
                break;
            }
        }
        if (!eventType)
            throw new SyntaxError('Only HTMLEvents and MouseEvents interfaces are supported');
        if (exports.ieb.document.createEvent) {
            oEvent = exports.ieb.document.createEvent(eventType);
            if (eventType == 'HTMLEvents') {
                oEvent.initEvent(eventName, options.bubbles, options.cancelable);
            }
            else {
                oEvent.initMouseEvent(eventName, options.bubbles, options.cancelable, exports.ieb.document.defaultView, options.button, options.pointerX, options.pointerY, options.pointerX, options.pointerY, options.ctrlKey, options.altKey, options.shiftKey, options.metaKey, options.button, element);
            }
            element.dispatchEvent(oEvent);
        }
        else {
            options.clientX = options.pointerX;
            options.clientY = options.pointerY;
            var evt = exports.ieb.document.createEventObject();
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
    };
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
    };
    function keyevent(element, eventname) {
        var keyboardEvent = exports.ieb.document.createEvent("KeyboardEvent");
        var initMethod = typeof keyboardEvent.initKeyboardEvent !== 'undefined' ? "initKeyboardEvent" : "initKeyEvent";
        keyboardEvent[initMethod](eventname, // event type : keydown, keyup, keypress
        true, // bubbles
        true, // cancelable
        exports.ieb.document.parentWindow, // viewArg: should be window
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
    element.value = text;
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
};
exports.getElementsByClassName = function (node, classname) {
    var a = [];
    var re = new RegExp('(^| )' + classname + '( |$)');
    var els = node.getElementsByTagName("*");
    for (var i = 0, j = els.length; i < j; i++) {
        try {
            if (re.test(els[i].className))
                a.push(els[i]);
        }
        catch (eee) { }
    }
    return a;
};
