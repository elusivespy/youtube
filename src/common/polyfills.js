Array.isArray = function(arg) {
    return Object.prototype.toString.call(arg) === '[object Array]';
};
Array.prototype.map = function(callback, thisArg) {
    var T, A, k;
    if (this == null) {
        throw new TypeError(' this is null or not defined');
    }
    var O = Object(this);
    var len = O.length >>> 0;
    if (typeof callback !== 'function') {
        throw new TypeError(callback + ' is not a function');
    }
    if (arguments.length > 1) {
        T = thisArg;
    }
    A = new Array(len);
    k = 0;
    while (k < len) {
        var kValue, mappedValue;
        if (k in O) {
            kValue = O[k];
            mappedValue = callback.call(T, kValue, k, O);
            A[k] = mappedValue;
        }
        k++;
    }
    return A;
};

Array.prototype.forEach = function (callback, thisArg) {
    var T, k;
    if (this == null) {
        throw new TypeError(' this is null or not defined');
    }
    var O = Object(this);
    var len = O.length >>> 0;
    if (typeof callback !== 'function') {
        throw new TypeError(callback + ' is not a function');
    }
    if (arguments.length > 1) {
        T = thisArg;
    }
    k = 0;
    while (k < len) {
        var kValue;
        if (k in O) {
            kValue = O[k];
            callback.call(T, kValue, k, O);
        }
        k++;
    }
};

Array.prototype.includes = function(searchElement/*, fromIndex*/) {
    'use strict';
    var O = Object(this);
    var len = parseInt(O.length) || 0;
    if (len === 0) {
        return false;
    }
    var n = parseInt(arguments[1]) || 0;
    var k;
    if (n >= 0) {
        k = n;
    } else {
        k = len + n;
        if (k < 0) {
            k = 0;
        }
    }
    while (k < len) {
        var currentElement = O[k];
        if (searchElement === currentElement ||
            (searchElement !== searchElement && currentElement !== currentElement)
        ) {
            return true;
        }
        k++;
    }
    return false;
};

JSON = {
    parse: function(sJSON) { return eval('(' + sJSON + ')'); },
    stringify: (function () {
        var toString = Object.prototype.toString;
        var isArray = Array.isArray || function (a) { return toString.call(a) === '[object Array]'; };
        var escMap = {'"': '\\"', '\\': '\\\\', '\b': '\\b', '\f': '\\f', '\n': '\\n', '\r': '\\r', '\t': '\\t'};
        var escFunc = function (m) { return escMap[m] || '\\u' + (m.charCodeAt(0) + 0x10000).toString(16).substr(1); };
        var escRE = /[\\"\u0000-\u001F\u2028\u2029]/g;
        return function stringify(value) {
            if (value == null) {
                return 'null';
            } else if (typeof value === 'number') {
                return isFinite(value) ? value.toString() : 'null';
            } else if (typeof value === 'boolean') {
                return value.toString();
            } else if (typeof value === 'object') {
                if (typeof value.toJSON === 'function') {
                    return stringify(value.toJSON());
                } else if (isArray(value)) {
                    var res = '[';
                    for (var i = 0; i < value.length; i++)
                        res += (i ? ', ' : '') + stringify(value[i]);
                    return res + ']';
                } else if (toString.call(value) === '[object Object]') {
                    var tmp = [];
                    for (var k in value) {
                        if (value.hasOwnProperty(k))
                            tmp.push(stringify(k) + ': ' + stringify(value[k]));
                    }
                    return '{' + tmp.join(', ') + '}';
                }
            }
            return '"' + value.toString().replace(escRE, escFunc) + '"';
        };
    })()
};

Object.keys = (function() {
    var hasOwnProperty = Object.prototype.hasOwnProperty,
        hasDontEnumBug = !({ toString: null }).propertyIsEnumerable('toString'),
        dontEnums = [
            'toString',
            'toLocaleString',
            'valueOf',
            'hasOwnProperty',
            'isPrototypeOf',
            'propertyIsEnumerable',
            'constructor'
        ],
        dontEnumsLength = dontEnums.length;

    return function(obj) {
        if (typeof obj !== 'object' && (typeof obj !== 'function' || obj === null)) {
            throw new TypeError('Object.keys called on non-object');
        }

        var result = [], prop, i;

        for (prop in obj) {
            if (hasOwnProperty.call(obj, prop)) {
                result.push(prop);
            }
        }

        if (hasDontEnumBug) {
            for (i = 0; i < dontEnumsLength; i++) {
                if (hasOwnProperty.call(obj, dontEnums[i])) {
                    result.push(dontEnums[i]);
                }
            }
        }
        return result;
    };
}());

Array.prototype.filter = function(fun/*, thisArg*/) {
    'use strict';

    if (this === void 0 || this === null) {
        throw new TypeError();
    }

    var t = Object(this);
    var len = t.length >>> 0;
    if (typeof fun !== 'function') {
        throw new TypeError();
    }

    var res = [];
    var thisArg = arguments.length >= 2 ? arguments[1] : void 0;
    for (var i = 0; i < len; i++) {
        if (i in t) {
            var val = t[i];
            if (fun.call(thisArg, val, i, t)) {
                res.push(val);
            }
        }
    }

    return res;
};

Array.prototype.indexOf = function(searchElement, fromIndex) {
    var k;
    if (this == null) {
        throw new TypeError('"this" is null or not defined');
    }

    var O = Object(this);

    var len = O.length >>> 0;

    if (len === 0) {
        return -1;
    }

    var n = +fromIndex || 0;

    if (Math.abs(n) === Infinity) {
        n = 0;
    }

    if (n >= len) {
        return -1;
    }

    k = Math.max(n >= 0 ? n : len - Math.abs(n), 0);

    while (k < len) {
        if (k in O && O[k] === searchElement) {
            return k;
        }
        k++;
    }
    return -1;
};

Array.prototype.some = function(fun/*, thisArg*/) {
    'use strict';

    if (this == null) {
        throw new TypeError('Array.prototype.some called on null or undefined');
    }

    if (typeof fun !== 'function') {
        throw new TypeError();
    }

    var t = Object(this);
    var len = t.length >>> 0;

    var thisArg = arguments.length >= 2 ? arguments[1] : void 0;
    for (var i = 0; i < len; i++) {
        if (i in t && fun.call(thisArg, t[i], i , t)) {
            return true;
        }
    }

    return false;
};

String.prototype.trim = function() {
    return this.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
};

String.prototype.endsWith = function(searchStr, Position) {
    if (!(Position < this.length))
        Position = this.length;
    else
        Position |= 0; // round position
    return this.substr(Position - searchStr.length,
            searchStr.length) === searchStr;
};

console = {
    log: function(text) { WScript.Echo(text) }
};


Array.prototype.fill = function(value) {
    if (this == null) {
        throw new TypeError('this is null or not defined');
    }
    var O = Object(this);
    var len = O.length >>> 0;
    var start = arguments[1];
    var relativeStart = start >> 0;
    var k = relativeStart < 0 ?
        Math.max(len + relativeStart, 0) :
        Math.min(relativeStart, len);
    var end = arguments[2];
    var relativeEnd = end === undefined ?
        len : end >> 0;
    var final = relativeEnd < 0 ?
        Math.max(len + relativeEnd, 0) :
        Math.min(relativeEnd, len);
    while (k < final) {
        O[k] = value;
        k++;
    }
    return O;
};
