/********************
Author: Vivian Huang
Date: March 8, 2014
********************/

function bindReady(handler) {
	var isReady = false;

	function ready() { 
		if (isReady) {
			return;
		}
		isReady = true;
		handler();
	}

	if ( document.addEventListener ) {  // Chrome, Firefox, Safari, Opera
		document.addEventListener("DOMContentLoaded", ready, false);
	} else if ( document.attachEvent ) {  // IE
		try {
			var isFrame = window.frameElement !== null ? TRUE : FALSE;
		} catch(e) {

		}

		// IE, the document is not inside a frame
		if (document.documentElement.doScroll && !isFrame) {
			function tryScroll() {
				if (isReady) {
					return;
				}
				try {
					document.documentElement.doScroll("left");
					ready();
				} catch(e) {
					setTimeout(tryScroll, 10);
				}
			}
			tryScroll();
		}

		// IE, the document is inside a frame
		document.attachEvent("onreadystatechange", function() {
			if ( document.readyState === "complete" ) {
				ready();
			}
		});
	}

	// Old browsers
    if (window.addEventListener) {
        window.addEventListener("load", ready, false);
    } else if (window.attachEvent) {
        window.attachEvent("onload", ready);
    } else {
		var fn = window.onload // very old browser, copy old onload
		window.onload = function() { // replace by new onload and call the old one
			fn && fn();
			ready();
		};
    }
}


var readyList = [];

function onReady(handler) {
	function executeHandlers() {
		for (var i=0; i<readyList.length; i++) {
			readyList[i]();
		}
	}

	if (!readyList.length) { // set handler on first run 
		bindReady(executeHandlers);
	}

	readyList.push(handler);
}

