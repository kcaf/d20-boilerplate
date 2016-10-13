// ==UserScript==
// @name         d20-boilerplate
// @namespace    https://github.com/kcaf
// @license      MIT (https://opensource.org/licenses/MIT)
// @version      1
// @description  Roll20 userscript boilerplate to bypass Content Security Policy and gain access to d20 object.
// @author       kcaf
// @match        https://app.roll20.net/editor/
// @grant        unsafeWindow
// @run-at       document-start
// ==/UserScript==

var KCAF = function() {
    const NAME = "https://github.com/kcaf";

    console.log(NAME,"> Injected");

    window.onload = function() {
        window.unwatch("d20");
        console.log(NAME, "> Begin");
        /* Custom code here */

        //chatSend("/roll 1d100"));
        //console.log( "Character:", charByName("Mob Barley") );
        //console.log( "Random number:", diceRandom(20) +1 );
    };

    /* Examples */

        // Send string to chat using current char id
        function chatSend (str) {
            d20.textchat.doChatInput(str);
        };

        // Get character by name
        function charByName (name) {
            var char = null;
            d20.Campaign.characters.each(function(c) {
                if (c.get("name") == name) char = c;
            });
            return char;
        };

        // Returns random integer between [0,int)
        function diceRandom (int) {
            return d20.textchat.diceengine.random(int);
        };

    /* end Examples */

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

// Inject
unsafeWindow.eval("(" + KCAF.toString() + ")()");
