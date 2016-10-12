// ==UserScript==
// @name         KCAF-d20
// @namespace    https://github.com/kcaf
// @license      MIT (https://opensource.org/licenses/MIT)
// @version      1
// @description  Roll20 bypass CSP and gain access to d20 variable
// @author       kcaf
// @match        https://app.roll20.net/editor/
// @grant        unsafeWindow
// @run-at       document-start
// ==/UserScript==

var KCAF = function() {
    const NAME = "https://github.com/kcaf";
    window.onload = function() {
        window.unwatch("d20");
        console.log(NAME, "> Begin");
        // Custom code here
    };

    console.log(NAME,"> Injected");

    /* object.watch polyfill by Eli Grey, http://eligrey.com */
    if (!Object.prototype.watch) {
        Object.defineProperty(Object.prototype, "watch", {
            enumerable: false,
            configurable: true,
            writable: false,
            value: function (prop, handler) {
                var
                oldval = this[prop],
                newval = oldval,
                getter = function () {
                    return newval;
                },
                setter = function (val) {
                    oldval = newval;
                    return (newval = handler.call(this, prop, oldval, val));
                };

                if (delete this[prop]) {
                    Object.defineProperty(this, prop, {
                        get: getter,
                        set: setter,
                        enumerable: true,
                        configurable: true
                    });
                }
            }
        });
    }

    if (!Object.prototype.unwatch) {
        Object.defineProperty(Object.prototype, "unwatch", {
            enumerable: false,
            configurable: true,
            writable: false,
            value: function (prop) {
                var val = this[prop];
                delete this[prop];
                this[prop] = val;
            }
        });
    }
    /* end object.watch polyfill */

    window.d20ext = {};
    window.watch("d20ext", function (id, oldValue, newValue) {
        console.log(NAME, "> Set Development");
        newValue.environment = "development";
        return newValue;
    });

    window.d20 = {};
    window.watch("d20", function (id, oldValue, newValue) {
        console.log(NAME, "> Obtained d20 variable");
        window.unwatch("d20ext");
        window.d20ext.environment = "production";
        newValue.environment = "production";
        return newValue;
    });
};

unsafeWindow.eval("(" + KCAF.toString() + ")()");
