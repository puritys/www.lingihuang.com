var DEBUG = {
    log: function(obj) {
        if (typeof console.log !== "undefined") {
            console.log(obj);
        }
    }
};



var USERAGENT = navigator.userAgent.toLowerCase();
var BROWSER = {
	isIE: USERAGENT.search('msie') > -1 ? true : false,
	isIE6: USERAGENT.search('msie 6') > -1 ? true : false,
	isIE7: USERAGENT.search('msie 7') > -1 ? true : false,
	isIE8: USERAGENT.search('msie 8') > -1 ? true : false,
	isFirefox: USERAGENT.search('firefox') > -1 ? true : false,
	isChrom: USERAGENT.search('chrome') > -1 ? true : false,
	isSafari: USERAGENT.search('safari') > -1 ? true : false
};



/********************************************************************************************************
Event Object

Related Posts =>
Event Registration Models
Traditional
- http://www.quirksmode.org/js/events_tradmod.html
Advanced
- http://www.quirksmode.org/js/events_advanced.html
Event Order
- http://www.quirksmode.org/js/events_order.html
Event Properties
- http://www.quirksmode.org/js/events_properties.html
W3C Events Reference
- http://www.w3.org/TR/2000/REC-DOM-Level-2-Events-20001113/events.html
The DOM Event Model
- http://www.brainjar.com/dhtml/events/default.asp
Related function call and function apply
- http://ejohn.org/projects/flexible-javascript-events/


=== Methods ===
findTarget: return the element on which the event occurred.
findCurrentTarget: return the element at which the event is currently being processed.
findRelatedTarget: return the element that is related to the target node of the event. For mouseover events, it is the node that the
                            mouse left when it moved over the target. For mouseout events, it is the node that the mouse entered when
                            leaving the target.
stopPropagation: prevent the event from being propagated beyond the node at which is currently being handled.
cancelDefault: prevent the browser from performing a default action associated with the event.
addEvent/removeEvent: register object as event handlers.
getMousePos: return the position of the mouse.
********************************************************************************************************/
var GENERIC = {
    findTarget: function(event, node) {
        var target;
        if (window.event && window.event.srcElement) { // For IE
            target = window.event.srcElement;
        } else if (event && event.target) { // For Firefox, Opera
            target = event.target;
        }
        while (node && target && target.nodeName.toLowerCase()!== node.toLowerCase()) { // For Safari
            target = target.parentNode;
        }
        return target;
    },
    findCurrentTarget: function(event, node) {
        var currentTarget;
        if (window.event) { // For IE
            currentTarget = node;
        } else if (event && event.currentTarget) { // For Firefox, Opera
            currentTarget = event.currentTarget;
        }
        return currentTarget;
    },
    findRelatedTarget: function(event) {
        var relatedTarget;
        if (window.event) { // For IE
            if (window.event.type === "mouseover") {
                relatedTarget = window.event.fromElement;
            } else if (window.event.type === "mouseout") {
                relatedTarget = window.event.toElement;
            }
        } else if (event && event.relatedTarget) { // For Firefox
            relatedTarget = event.relatedTarget;
        }
        return relatedTarget;
    },
    stopPropagation: function(event) {
        if (window.event) { // For IE
            window.event.cancelBubble = true;
        }
        if (event && event.stopPropagation) { // For Firefox, Opera, Safari
            event.stopPropagation();
        }
    },
    cancelDefault: function(event) {
        if (window.event) { // For IE
            window.event.returnValue = false;
        }
        if (event && event.preventDefault) { // For Firefox, Opera, Safari
            event.preventDefault();
        }
    },
    addEvent: function(obj, type, fn) {
        if (!obj) {
            return;
        }
        if (type === "mousewheel" && navigator.userAgent.match("Gecko/")) {
            type = "DOMMouseScroll";
        }
        // Fix the bug the "this" keyword refers to the global window object when event handlers registered with attachEvent() are invoked as global functions instead of as methods of the element on which they are registered.
        if (obj.attachEvent) { // For IE.
            obj["e"+type+fn] = fn;
            obj[type+fn] = function() {
                obj["e"+type+fn]( window.event );
            }
            obj.attachEvent("on"+type, obj[type+fn]);
        } else if (obj.addEventListener) { // For Firefox, Opera, Safari
            obj.addEventListener(type, fn, false);
        }
    },
    removeEvent: function(obj, type, fn) {
        if (!obj) {
            return;
        }
        if (obj.detachEvent) { // For IE
            obj.detachEvent("on"+type, obj[type+fn]);
            obj[type+fn] = null;
        } else if (obj.addEventListener) { // For Firefox, Opera, Safari
            obj.removeEventListener(type, fn, false);
        }
    },
    fireEvent: function(element, type) {
        var obj = typeof(element) == "string" ? document.getElementById(element): element;
        if (document.createEvent) { // For IE
            var event = document.createEvent("MouseEvents");
            event.initEvent(type, true, true);
            obj.dispatchEvent(event);
        } else if (document.createEventObject) { // For Firefox, Opera, Safari
            var event = document.createEventObject();
            obj.fireEvent("on"+type, event);
        }
        /*
        if (document.createEventObject) {
			var ev = document.createEventObject();
			el.fireEvent('on'+evnt, ev);
		} else if (document.createEvent) {
			var ev = document.createEvent('HTMLEvents');
			ev.initEvent(evnt, true, true);
			el.dispatchEvent(ev);
		} else if(el['on'+evnt]) { // alternatively use the traditional event model (IE5)
			el['on'+evnt]();
		}
		*/
    },
    getEvent: function() {
        if (document.all) {
            return window.event;
        }
        var func = arguments.callee.caller;
        while (func != null) {
            var args = func.arguments[i];
            if (args) {
                if ((args.constructor == Event || args.constructor == MouseEvent) || (typeof args === "object" && args.preventDefault && args.stopPropagation)) {
                    return args;
                }
            }
            func = func.caller;
        }
        return null;
    },
    getMousePos: function(event) {
        var MouseObj = {};
        if (event.pageX || event.pageY) { // For Firefox, Opera, Safari
            MouseObj.x = event.pageX ;
            MouseObj.y = event.pageY;
        } else if (event.clientX || event.clientY) { // For IE
            MouseObj.x = event.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
            MouseObj.y = event.clientY + document.body.scrollTop + document.documentElement.scrollTop;
        }
        return MouseObj;
    }
};
/*******************************************************************************************************/



/********************************************************************************************************
Window Size
Free Code From dyn-web.com

Related Posted =>
W3C CSSOM View Specification
- http://www.w3.org/TR/cssom-view/
CSS Object Model View
- http://www.quirksmode.org/dom/w3c_cssom.html
Window Size & Scrolling
- http://www.howtocreate.co.uk/tutorials/javascript/browserwindow
WindowView/ScreenView/DocumentView/ElementView Properties and Mouse Position
- http://www.quirksmode.org/dom/w3c_cssom.html#offsetParent
Javascript Width and Height
- http://javascriptnote.blogspot.com/2009/05/width-and-height.html


=== Methods ===
getWindowX/Y: return the position of the window on the screen.
getViewportWidth/Height: return the size of the browser viewport area, the width/height of the scroller excluded.
getDocumentWidth/Height: return the size of the document, the width/height of the scroller included.
getHorizontalScroll/getVerticalScroll: return the position of the horizontal/vertical scroller.
********************************************************************************************************/
var GEOMETRY = {
    getWindowX: function() {
        var x = 0;
        if (window.screenLeft) { // For IE
            x = window.screenLeft;
        } else if (window.screenX) { // For Modern Browsers
            x = window.screenX;
        }
        return x;
    },
    getWindowY: function() {
        var y = 0;
        if (window.screenTop) { // For IE
            y = window.screenTop;
        } else if (window.screenY) { // For Modern Browsers
            y = window.screenY;
        }
        return y;
    },
    getViewportWidth: function() {
        var width = 0;
        if (window.innerWidth) { // For Modern Browsers
            width = window.innerWidth;
        } else if (document.documentElement && document.documentElement.clientWidth) { // For IE
            width = document.documentElement.clientWidth;
        } else if (document.body && document.body.clientWidth) {
            width = document.body.clientWidth;
        }
        return width;
    },
    getViewportHeight: function() {
        var height = 0;
        if (window.innerHeight) { // For Modern Browsers
            height = window.innerHeight;
        } else if (document.documentElement && document.documentElement.clientHeight) { // For IE
            height = document.documentElement.clientHeight;
        } else if (document.body && document.body.clientHeight) {
            height = document.body.clientHeight;
        }
        return height;
    },
    getDocumentWidth: function() {
        var width = 0;
        if (document.documentElement && document.documentElement.scrollWidth) { // For all browsers
            width = document.documentElement.scrollWidth;
        } else if (document.body && document.body.scrollWidth) {
            width = document.body.scrollWidth;
        }
        return width;
    },
    getDocumentHeight: function() {
        var height = 0;
        if (document.documentElement && document.documentElement.scrollHeight) { // For all browsers
            height = document.documentElement.scrollHeight;
        } else if (document.body && document.body.scrollHeight) {
            height = document.body.scrollHeight;
        }
        return height;
    },
    getHorizontalScroll: function() {
        var scrollX = 0;
        /*if (typeof window.pageXOffset == 'number') {
            scrollX = window.pageXOffset;
        } else if (document.documentElement && document.documentElement.scrollLeft) {
            scrollX = document.documentElement.srollLeft;
        } else if (document.body && document.body.scrollLeft) {
            scrollX = document.body.scrollLeft;
        } else if (window.scrollX) {
            scrollX = window.scrollX;
        }*/
        if (window.pageXOffset) { // For Modern Browsers
            scrollX = window.pageXOffset;
        } else if (document.documentElement && document.documentElement.scrollLeft) {
            scrollX = document.documentElement.srollLeft;
        } else if (document.body && document.body.scrollLeft) {
            scrollX = document.body.scrollLeft;
        }
        return scrollX;
    },
    getVerticalScroll: function() {
        var scrollY = 0;
        /*if (typeof window.pageYOffset == 'number') {
            scrollY = window.pageYOffset;
        } else if (document.documentElement && document.documentElement.scrollTop) {
            scrollY = document.documentElement.srollTop;
        } else if (document.body && document.body.scrollTop) {
            scrollY = document.body.scrollTop;
        } else if (window.scrollY) {
            scrollY = window.scrollY;
        }*/
        if (window.pageYOffset) { // For Modern Browsers
            scrollY = window.pageYOffset;
        } else if (document.documentElement && document.documentElement.scrollTop) {
            scrollY = document.documentElement.srollTop;
        } else if (document.body && document.body.scrollTop) {
            scrollY = document.body.scrollTop;
        }
        return scrollY;
    },
	getPageSize: function(){
		var pageWidth, pageHeight;
		var xScroll, yScroll;
		if (window.innerHeight && window.scrollMaxY) {
			// window.innerWidth: 含scrollbar width
			// window.innerHeight: 可視範圍高度
			xScroll = window.innerWidth + window.scrollMaxX;
			yScroll = window.innerHeight + window.scrollMaxY;
		} else if (document.body.scrollHeight > document.body.offsetHeight) { // Chrome, Safari
			// document.body.scrollWidth: 不含scrollbar width
			// document.body.scrollHeight: 頁面總高
			xScroll = document.body.scrollWidth;
			yScroll = document.body.scrollHeight;
		} else { // IE6, IE7, IE8
			// offsetHeight: 頁面總高
			xScroll = document.body.offsetWidth;
			yScroll = document.body.offsetHeight;
		}
		var windowWidth, windowHeight;
		if (window.innerHeight) {	// all except Explorer
			if(document.documentElement.clientWidth){ // Firefox, Chrome, Safari
				// document.documentElement.clientWidth: 不含scrollbar width
				windowWidth = document.documentElement.clientWidth;
			} else {
				windowWidth = window.innerWidth;
			}
			// window.innerHeight: 可視範圍高度
			windowHeight = window.innerHeight;
		} else if (document.documentElement && document.documentElement.clientHeight) { // IE6, IE7, IE8
			windowWidth = document.documentElement.clientWidth;
			windowHeight = document.documentElement.clientHeight;
		} else if (document.body) { // other Explorers
			windowWidth = document.body.clientWidth;
			windowHeight = document.body.clientHeight;
		}
		// for small pages with total height less then height of the viewport
		if (yScroll < windowHeight) {
			pageHeight = windowHeight;
		} else { 
			pageHeight = yScroll;
		}
		// for small pages with total width less then width of the viewport
		if (xScroll < windowWidth) {	
			pageWidth = xScroll;		
		} else {
			pageWidth = windowWidth;
		}
		return {width: pageWidth, height: pageHeight};
	},
	getWindowSize: function(){
		var windowWidth, windowHeight;
		if (window.innerHeight) {	// all except Explorer
			if(document.documentElement.clientWidth) { // Firefox, Chrome, Safari
				// document.documentElement.clientWidth: 不含scrollbar width
				windowWidth = document.documentElement.clientWidth;
			} else {
				windowWidth = window.innerWidth;
			}
			// window.innerHeight: 可視範圍高度
			windowHeight = window.innerHeight;
		} else if (document.documentElement && document.documentElement.clientHeight) { // IE6, IE7, IE8
			windowWidth = document.documentElement.clientWidth;
			windowHeight = document.documentElement.clientHeight;
		} else if (document.body) { // other Explorers
			windowWidth = document.body.clientWidth;
			windowHeight = document.body.clientHeight;
		}
		return {width: windowWidth, height: windowHeight};
	},
	getPageScroll: function(){
		var scrollLeft, scrollTop;
		if (window.pageYOffset) {
			scrollTop = window.pageYOffset;
			scrollLeft = window.pageXOffset;
		} else if (document.documentElement && document.documentElement.scrollTop) { // Explorer 6 Strict
			scrollTop = document.documentElement.scrollTop;
			scrollLeft = document.documentElement.scrollLeft;
		} else if (document.body) { // all other Explorers
			scrollTop = document.body.scrollTop;
			scrollLeft = document.body.scrollLeft;
		}
		return {scrollLeft: scrollLeft, scrollTop: scrollTop};
	}
};
/*******************************************************************************************************/


/********************************************************************************************************
Box Model

Related Posts =>
Styles and classes, getComputedStyle
- http://javascript.info/tutorial/styles-and-classes-getcomputedstyle
Javascript Get Styles
- http://www.quirksmode.org/dom/getstyles.html
style、currentStyle、getComputedStyle区别介绍
- http://www.cnblogs.com/flyjs/archive/2012/02/20/2360502.html
Element Dimensions
- http://snipplr.com/view/7911/element-dimensions/
W3C DOM Compatibility
- http://www.quirksmode.org/dom/w3c_cssom.html#elementviewm
Find Position
- http://www.quirksmode.org/js/findpos.html
Browser Specific Referencing
- http://www.howtocreate.co.uk/tutorials/javascript/browserspecific
Absolute Coordinates of DOM Element within Document
- http://blogs.korzh.com/progtips/2008/05/28/absolute-coordinates-of-dom-element-within-document.html
IE Quirks: offsetParent of DOM Element Added into document.body
- http://blogs.korzh.com/progtips/2008/07/02/ie-quirk-offsetparent-of-dom-element-added-into-document-body.html
DOM Tests: offset
- http://www.quirksmode.org/dom/tests/offset.html

=== Methods ===
get/set: return or set the values of CSS properties.
innerWidth/Height: return or set the size of the element, excluding borders and scrollbar, but including padding.
outerWidth/Height: return or set the size of the element, including borders.
scrollWidth/Height: return or set the size of the element, including those parts that are currently hidden. If there's no hidden content, it should be equal to clientX/clientY.
scrollPos: return or set the scrolling position of the element and padding.
offset: return the position of the element relative to the top-left corner of the document.
********************************************************************************************************/
var CSS = {
    getStyle: function(element) {
        if (!element) {
            return;
        }
        if (typeof element === "string") {
            element = document.getElementById(element);
        }
        if (element.currentStyle) { // For IE
            return element.currentStyle;
        } else if (document.defaultView && document.defaultView.getComputedStyle) { // For Modern Browsers
            return document.defaultView.getComputedStyle(element, null);
        } else {
            return element.style;
        }
    },
    get: function(element, name) {
        if (!element) {
            return;
        }
        if (typeof element === "string") {
            element = document.getElementById(element);
        }

        // Convert "background-color" to "backgroundColor"
        var camelCase = name.replace(/\-(\w)/g, function(all, letter) {
            return letter.toUpperCase();
        });

        if (element.currentStyle) { // For IE
            return element.currentStyle[name] || element.currentStyle[camelCase];
        } else if (document.defaultView && document.defaultView.getComputedStyle) { // For Modern Browsers
            name = name.replace(/([A-Z])/g, "-$1").toLowerCase();
            return document.defaultView.getComputedStyle(element, null).getPropertyValue(name);
        } else {
            return element.style[name] || element.style[camelCase];
        }
    },
    set: function(element, properties) {
        if (!element) {
            return;
        }
        if (typeof element === "string") {
            element = document.getElementById(element);
        }
        for (var name in properties) {
            // Convert "background-color" to "backgroundColor"
            var camelCase = name.replace(/\-(\w)/g, function(all, letter) {
                return letter.toUpperCase();
            });
            if (typeof properties[name] === "number") {
                element.style[camelCase] = (parseInt(properties[name], 10) || 0) + "px";
            }
            if (typeof properties[name] === "string") {
                element.style[camelCase] = properties[name];
            }
        }
    },
    innerWidth: function(element, value) {
        if (!element) {
            return;
        }
        if (typeof element === "string") {
            element = document.getElementById(element);
        }
        if (value) {
            element.clientWidth = value;
        } else {
            return element.clientWidth;
        }
    },
    innerHeight: function(element, value) {
        if (!element) {
            return;
        }
        if (typeof element === "string") {
            element = document.getElementById(element);
        }
        if (value) {
            element.clientHeight = value;
        } else {
            return element.clientHeight;
        }
    },
    outerWidth: function(element, value) {
        if (!element) {
            return;
        }
        if (typeof element === "string") {
            element = document.getElementById(element);
        }
        if (value) {
            element.offsetWidth = value;
        } else {
            return element.offsetWidth;
        }
    },
    outerHeight: function(element, value) {
        if (!element) {
            return;
        }
        if (typeof element === "string") {
            element = document.getElementById(element);
        }
        if (value) {
            element.offsetHeight = value;
        } else {
            return element.offsetHeight;
        }
    },
    scrollWidth: function(element, value) {
        if (!element) {
            return;
        }
        if (typeof element === "string") {
            element = document.getElementById(element);
        }
        if (value) {
            element.scrollWidth = value;
        } else {
            return element.scrollWidth;
        }
    },
    scrollHeight: function(element, value) {
        if (!element) {
            return;
        }
        if (typeof element === "string") {
            element = document.getElementById(element);
        }
        var height = 0;
        if (value) {
            element.scrollHeight = value;
        } else {
            element.scrollHeight < element.clientHeight ? height = element.clientHeight : height = element.scrollHeight;
            return height;
        }
    },
    scrollPos: function(element, value) {
        if (!element) {
            return;
        }
        if (typeof element === "string") {
            element = document.getElementById(element);
        }
        if (value) {
            element.scrollLeft = value.scrollLeft;
            element.scrollTop = value.scrollTop;
        } else {
            return {left:element.scrollLeft, top:element.scrollTop};
        }
    },
    offset: function(element) {
        if (!element) {
            return;
        }
        if (typeof element === "string") {
            element = document.getElementById(element);
        }
        //var elem = element;
        var left = 0, top = 0;
        /*while (elem.offsetParent) {
            left += elem.offsetLeft;
            top += elem.offsetTop;
            elem = elem.offsetParent;
        }*/
        for (var elem = element; elem; elem = elem.offsetParent) {
            left += elem.offsetLeft;
            top += elem.offsetTop;
        }
        for (elem = element.parentNode; elem && elem != document.body; elem = elem.parentNode) {
            if (elem.scrollLeft) {
                left -= elem.scrollLeft;
            }
            if (elem.scrollTop) {
                top -= elem.scrollTop;
            }
        }
        return {left:left, top:top};
    }
};
/*******************************************************************************************************/


/********************************************************************************************************
Element

=== Methods ===
has(): return true if the child node is nested inside the parent node.
contains(): return child nodes inside the parent node.
append(): append child nodes into the parent node.
remove(): remove child nodes from the parent node.
********************************************************************************************************/
var ELEMENT = {
    has: function(parent, child) {
        if (!parent || !child) {
            return;
        }
        if (typeof parent === "string") {
            parent = document.getElementById(parent);
        }
        if (typeof child === "string") {
            parent = document.getElementById(child);
        }
        var element = child;
        while (element.parentNode) {
            if (element.parentNode == parent) {
                return true;
            }
            element = element.parentNode;
        }
        return false;
    },
    contains: function(parent, child) {
        if (!parent || !child) {
            return;
        }
        if (typeof parent === "string") {
            parent = document.getElementById(parent);
        }
        if (typeof child === "string") {
            child = parent.getElementsByTagName(child);
        }
        return child;
    },
    find: function(classname, parent) {
		if (!parent) {
            parent = document.body;
        }
		var children = parent.childNodes;
		for (var node=0; node<children.length; node++) {
			if (children[node].nodeType === 1 && children[node].className && children[node].className === classname) {
				return children[node];
            }
		}
	},
    append: function(parent, child) {
        if (!parent || !child) {
            return;
        }
        if (typeof parent === "string") {
            parent = document.getElementById(parent);
        }
        if (typeof child === "string") {
            child = parent.getElementsByTagName(child);
        }
        if (child.length > 0) {
            for (var i=0; i<child.length; i++) {
                parent.appendChild(child[i]);
            }
        }
    },
    remove: function(parent, child) {
        if (!parent || !child) {
            return;
        }
        if (typeof parent === "string") {
            parent = document.getElementById(parent);
        }
        if (typeof child === "string") {
            child = parent.getElementsByTagName(child);
        }
        if (child.length > 0) {
            for (var i=0; i<child.length; i++) {
                parent.removeChild(child[i]);
            }
        }
    },
    disableSelection: function(element) {
    	element.unselectable = "on";
		element.style.UserSelect = "none";
		element.style.MozUserSelect = "none";
		element.style.KhtmlUserSelect = "none";
		element.style.OUserSelect = "none";
    }
};
/*******************************************************************************************************/


/********************************************************************************************************
Classname
********************************************************************************************************/
var CLASSNAME = {
    has: function(className, classes) {
        return className.match(classes);
    },
    add: function(element, className) {
        if (!element || !className) {
            return;
        }
        if (element.nodeType === 1 && !this.has(element.className, className)) {
            element.className += (element.className ? " " : "") + className;
        }
    },
    remove: function(element, className) {
        if (!element || !className) {
            return;
        }
        if (element.nodeType === 1 && this.has(element.className, className) && this.has(element.className, className).length >= 0) {
            var newClass = "";
            var tmp = element.className.split(" ");
            for (var i=0; i<tmp.length; i++) {
                if (tmp[i] != className) {
                    newClass += tmp[i] + " ";
                }
            }
            element.className = newClass.substr(0, newClass.length-1);
        }
    },
    replace: function(element, oldString, newString) {
        if (!element || !oldString || !newString) {
            return;
        }
        this.remove(element, oldString);
        this.add(element, newString);
    }
};
/*******************************************************************************************************/


/********************************************************************************************************
Attribute
********************************************************************************************************/
var ATTRIBUTE = {
    set: function(element, args) {
        if (!element || !args) {
            return;
        }
        if (element.nodeType === 1) {
            for (var attr in args) {
                if (typeof attr !== "string") {
                    attr = attr.toString();
                }
                element.setAttribute(attr, args[attr]);
            }
        }
    },
    get: function(element, attr) {
        return element.getAttribute(attr);
    }
};
/*******************************************************************************************************/



/********************************************************************************************************
Data Type
********************************************************************************************************/
var DATATYPE = {
    isNumber: function(obj) {
        if (obj.constructor === Number) {
            return true;
        } else {
            return false;
        }
    },
    isString: function(obj) {
        if (obj.constructor === String) {
            return true;
        } else {
            return false;
        }
    },
    isArray: function(obj) {
        if (obj.constructor === Array) {
            return true;
        } else {
            return false;
        }
    },
    isObject: function(obj) {
        if (obj.constructor === Object) {
            return true;
        } else {
            return false;
        }
    },
    isFunction: function(obj) {
        if (obj.constructor === Function) {
            return true;
        } else {
            return false;
        }
    }
};
/*******************************************************************************************************/



/********************************************************************************************************
AJAX

Dynamically Load Script
Related Posts =>
Dynamic Script Loading
- http://unixpapa.com/js/dyna.html
The Best Way to Load External Javascript
- http://www.nczonline.net/blog/2009/07/28/the-best-way-to-load-external-javascript/
Javascript Inclusion
- http://www.phpied.com/javascript-include-ready-onload/


Dynamically Load Style
Related Posts =>
CSS Inclusion
- http://www.phpied.com/javascript-include-ready-onload/

AJAX
Related Posts =>
The Ultimate AJAX Object
- http://www.hunlock.com/blogs/The_Ultimate_Ajax_Object
The XMLHttpRequest Object
- http://www.w3.org/TR/XMLHttpRequest/


=== Methods ===
getScript(): dynamically load script.
getStyle(): dynamically load style.
encodeFromData(): convert the properties of an object to a string from that can be used as the body of a POST request.

ajax()
Arguments
options = {
    url: "myFile.xml",
    type: "post",
    contentType: "application/x-www-form-urlencoded",
    cache: true,
    dataType: "xml",
    data: {username:"myName", password:xxxxxx},
    async: true,
    timeout: 0,
    start: self.onStart,
    progress: self.onProgress,
    stop: self.onStop,
    error: self.onError,
    success: self.onSuccess,
    complete: self.onComplete
};
********************************************************************************************************/
var HTTPUTILITY = {
    getScript: function(url, callback) {
        var isLoaded = false;  
        var script = document.createElement("script");  
        script.setAttribute("language", "javascript");  
        script.setAttribute("type", "text/javascript");  
        script.setAttribute("src", url);
        script.onload = script.onreadystatechange = function() {  
            if (!isLoaded && (!this.readyState || this.readyState === "loaded" || this.readyState === "complete")) {  
                isLoaded = true;  
                if (typeof callback === "function") {
                   callback();
                }
                if (this.tagName.toLowerCase() === "script") {
                   document.getElementsByTagName("head")[0].removeChild(this);
                }
            }  
        };
        var head = document.getElementsByTagName("head")[0];  
        head.appendChild(script);  
    },
    getStyle: function(url, callback) {
        var isLoaded = false;
        var style = document.createElement("link");
        style.setAttribute("rel", "stylesheet");
        style.setAttribute("type", "text/css");
        style.setAttribute("href", url);
        style.onload = style.onreadystatechange = function() {
            if (!isLoaded && (!this.readyState || this.readyState === "loaded" || this.readyState === "complete")) {
                isLoaded = true;
                if (typeof callback === "function") {
                    callback();
                }
                if (this.tagName.toLowerCase() === "link") {
                    document.getElementsByTagName("head")[0].removeChild(this);
                }
            }
        }
        var head = document.getElementsByTagName("head")[0];
        head.appendChild(style);
    },
    encodeFormData: function(data) {
        if (!data) {
            return;
        }
        var pairs = [];
        var regexp = /%20/g; // A regular expression to match an encoded space.
        for (var name in data) {
            // Create a name/value pair, but encode name and value first. The global function encodeURIComponent does almost what we want,
            // but it encodes spaces as %20 instead of as "+". We have to fix that with String.replace().
            var value = data[name].toString();
            var pair = encodeURIComponent(name).replace(regexp, "+") + "=" + encodeURIComponent(value).replace(regexp, "+");
            pairs.push(pair);
        }
        return pairs.join("&"); // Concatenate all the name/value pairs, separating them with &.
    },
    decode: function() {
        
    },
    ajax: function(options) {
        var self = this;
        var options = options;
        var timer = null;
        var settings = {
            url: "",
            type: "GET",
            contentType: "application/x-www-form-urlencoded",
            cache: false,
            async: true,
            timeout: 0,
            dataType: {
                xml: "application/xml, text/xml",
                html: "text/html",
                script: "text/javascript, application/javascript",
                json: "application/json, text/javascript",
                text: "text/plain",
                _default: "text/plain"
            },
            xmlHttpRequest: function() {
                return window.ActiveXObject ? new ActiveXObject("Microsoft.XMLHTTP") : new XMLHttpRequest();
            }
        };
        var initialize = function() {
            if (!options) {
                return;
            }
            for (var name in set) {
                set[name]();
            }
        };
        var set = {
            url: function() {
                if (!options.url) {
                    options.url = settings.url;
                }
            },
            type: function() {
                if (!options.type) {
                    options.type = settings.type;
                }
            },
            contentType: function() {
                if (!options.contentType) {
                    options.contentType = settings.contentType;
                }
            },
            cache: function() {
                if (!options.cache) {
                    options.cache = settings.cache;
                }
            },
            dataType: function() {
                switch(options.dataType) {
                    case "html":
                        options.dataType = "text/html";
                        break;
                    case "text":
                        options.dataType = "text/plain";
                        break;
                    case "xml":
                        options.dataType = "text/xml";
                        break;
                    case "json":
                            options.dataType = "json";
                            break;
                    default:
                        options.dataType = "text/plain";
                }
            },
            data: function() {
                if (options.data) {
                    options.data = HTTPUTILITY.encodeFormData(options.data);
                }
                if (!options.cache) {
                    options.data += "&timestamp=" + new Date().getTime();
                }
            },
            async: function() {
                if (!options.async) {
                    options.async = settings.async;
                }
            },
            timeout: function() {
                if (!options.timeout) {
                    options.timeout = settings.timeout;
                }
            },
            start: function() {
                if (!options.start) {
                    options.start = onStart;
                }
            },
            progress: function() {
                if (!options.progress) {
                    options.progress = onProgress;
                }
            },
            stop: function() {
                if (!options.stop) {
                    options.stop = onStop;
                }
            },
            error: function() {
                if (!options.error) {
                    options.error = onError;
                }
            },
            success: function() {
                if (!options.success) {
                    options.success = onSuccess;
                }
            },
            complete: function() {
                if (!options.complete) {
                    options.complete = onComplete;
                }
            },
            initialize: function() {
                var xmlHttpRequest = settings.xmlHttpRequest();
                if (xmlHttpRequest) {
                    send(xmlHttpRequest);
                }
            }
        };
        var send = function(xmlHttpRequest) {
            if (!xmlHttpRequest) {
                return;
            }
            if (timer) {
                clearTimeout(timer);
            }
            if (options.timeout) {
                timer = setTimeout(function(){
                    options.onStop(xmlHttpRequest);
                }, options.timeout);
            }
            xmlHttpRequest.onreadystatechange = function() {
                options.progress(xmlHttpRequest);
            }
            //xmlHttpRequest.setRequestHeader("Content-Type", options.dataType + "; charset=utf-8");
            if (/post/i.test(options.type)) {
                xmlHttpRequest.open(options.type, options.url, options.async);
                xmlHttpRequest.setRequestHeader("Content-Type", options.contentType);
                xmlHttpRequest.setRequestHeader("Content-Length", options.data.length);
                xmlHttpRequest.send(options.data);
            } else {
                xmlHttpRequest.open(options.type, options.url + "?" + options.data, options.async);
                xmlHttpRequest.send(null);
            }
        };
        var onProgress = function(xmlHttpRequest) {
            if (xmlHttpRequest.readyState !== 4) {
                options.start(xmlHttpRequest);
            } else {
                if (timer) {
                    clearTimeout(timer);
                }
                if (xmlHttpRequest.status === 0 || xmlHttpRequest.status === 200) {
                    options.success(xmlHttpRequest, "success");
                } else {
                    options.error(xmlHttpRequest, "error");
                }
            }
        };
        var onStart = function(xmlHttpRequest) {
            console.log("AJAX onStart");
        };
        var onStop = function(xmlHttpRequest) {
            xmlHttpRequest.abort();
            xmlHttpRequest = null;
        };
        var onError = function(xmlHttpRequest, status) {
            options.onComplete(xmlHttpRequest.responseText, status);
        };
        var get = function(xmlHttpRequest) {
            //var type = xmlHttpRequest.getResponseHeader("Content-Type");
            switch(options.dataType) {
                case "text/html":
                    return xmlHttpRequest.responseText;
                    break;
                case "text/plain":
                    return xmlHttpRequest.responseText;
                    break;
                case "text/xml":
                    return xmlHttpRequest.responseXML;
                    break;
                case "json":
                        return xmlHttpRequest.responseText;
                        break;
                default:
                    return xmlHttpRequest.responseText;
            }
        };
        var onSuccess = function(xmlHttpRequest, status) {
            var response = get(xmlHttpRequest);
            options.complete(response, status);
        };
        var onComplete = function(response, status) {
            console.log("AJAX onComplete: " + response);
        };
        (function(){
            initialize();
        })();
    }
};
/*******************************************************************************************************/



/********************************************************************************************************
Cookies

Related Posts =>
Tutorial: JavaScript and Cookies
- http://www.elated.com/articles/javascript-and-cookies/
Cookies
- http://www.quirksmode.org/js/cookies.html


=== Methods ===
set(): set the cookie.
get(): get the cookie.
del(): delete the cookie.
********************************************************************************************************/
var COOKIE = {
    set: function(name, value, options) {
        if (!name) {
            return;
        }

        options = options || {};
        if (!options.expires) {
            options.expires = 1;
        }

        var date = new Date();
        date.setTime(date.getTime() + options.expires*24*60*60*1000);
        var expires = "; expires=" + date.toGMTString();
        var path = options.path ? '; path=' + (options.path) : '';
        var domain = options.domain ? '; domain=' + (options.domain) : '';
        var secure = options.secure ? '; secure' : '';
        document.cookie = [name, "=", encodeURIComponent(value), expires, path, domain, secure].join("");
    },
    get: function(name) {
        if (!name) {
            return;
        }

        var value = "";
        if (document.cookie && document.cookie != "") {
            var cookies = document.cookie.split(";");
            for (var i=0; i<cookies.length; i++) {
                var cookie = cookies[i];
                // Trim the space.
                while(cookie.charAt(0) === " ") {
                    cookie = cookie.substring(1, cookie.length);
                }
                // Tell if this cookie string begins with the name we want.
                if (cookie.substring(0, name.length + 1) == (name + "=")) {
                    value = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return value;
    },
    del: function(name) {
        if (!name) {
            return;
        }
        this.set(name, "", -1);
    }
};
/*******************************************************************************************************/

