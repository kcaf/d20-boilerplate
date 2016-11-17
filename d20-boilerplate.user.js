// ==UserScript==
// @name         d20-boilerplate
// @namespace    https://github.com/kcaf
// @license      MIT (https://opensource.org/licenses/MIT)
// @version      2
// @description  Roll20 userscript boilerplate
// @author       kcaf
// @match        https://app.roll20.net/editor/
// @grant        unsafeWindow
// @run-at       document-start
// ==/UserScript==

var d20boilerplate = function() {
	const NAME = "d20-boilerplate";
	console.log(NAME,"> Injected");

	// Window loaded
	window.onload = function() {
		window.unwatch("d20");

		var checkLoaded = setInterval(function() {
			if (!$("#loading-overlay").is(":visible")) {
				clearInterval(checkLoaded);
				Init();
			}
		}, 1000);
	};

	// Init, d20 variable exposed and views are loaded
	function Init() {
		console.log(NAME, "> Ready");
		/* Ready to go, run your custom code here */

		rollDice("3d10+3d6+15", function(result){
			chatSend("Rolling [3d10+3d6+15]: " + result.total);
		}, null);
	}

	/* Examples */

		// Send string to chat using current char id
		function chatSend (str) {
			d20.textchat.doChatInput(str);
		}

		// Get character by name
		function charByName (name) {
			return d20.Campaign.characters.find(function(c){return c.get("name") == name});
		}

		// Returns random integer between [0,int)
		function randomInt (int) {
			return d20.textchat.diceengine.random(int);
		}

		/* 
		 * Return random result from rolling dice
		 *		roll: Dice string "3d10+3d6+15"
		 *		success: Callback on successful roll
		 *		error: Callback on error
		 *
		 * Returns result object
		*/
		function rollDice (roll, success, error) {
			d20.textchat.diceengine.process(roll, success, error);
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
unsafeWindow.eval("(" + d20boilerplate.toString() + ")()");