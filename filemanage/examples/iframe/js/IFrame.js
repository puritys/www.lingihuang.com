/********************************************************************************************************
Dynamically Generate iFrame

Related Posts =>
Scripting iFrames
- http://www.dyn-web.com/tutorials/iframes/
********************************************************************************************************/
var IFRAME = function(_ID, _WIDTH, _HEIGHT, _PARENT, _OPTIONS) {
	var _SELF = this;
	var _ELEMENT;
	this.width =300;
	this.height = 500;
	this.frameBorder = 0;
	this.marginWidth = 0;
	this.marginHeight = 0;
	this.scrolling = "auto";
	var _initialize = function() {
		if (!_ID) return;
		if (typeof _ID.nodeType == 1) 
			_ELEMENT = id;
		else
			_ELEMENT = document.createElement("iframe");
		var Id = _ID;
		if (typeof Id != "string") Id = new Date().getTime();
		_ELEMENT.setAttribute("id", Id);
		_ELEMENT.setAttribute("name", Id);
		if (_WIDTH) _SELF.width = _WIDTH;
		if (_HEIGHT) _SELF.height = _HEIGHT;
		if (_PARENT)
			_PARENT.appendChild(_ELEMENT);
		else
			document.body.appendChild(_ELEMENT);
		if (_OPTIONS) {
			for (var property in _OPTIONS) 
				_SELF[property] = _OPTIONS[property];
		}
		for (var key in _setProperty) 
			_setProperty[key]();
	};
	var _setProperty = {
		width: function(value) {
			if (value) _SELF.width = value;
			_ELEMENT.style.width = _SELF.width + "px";
		},
		height: function(value) {
			if (value) _SELF.height = value;
			_ELEMENT.style.height = _SELF.height + "px";
		},
		frameBorder: function() {
			_ELEMENT.setAttribute("frameBorder", _SELF.frameBorder);
		},
		marginWidth: function() {
			_ELEMENT.setAttribute("marginWidth", _SELF.marginWidth);
		},
		marginHeight: function() {
			_ELEMENT.setAttribute("marginHeight", _SELF.marginHeight);
		},
		scrolling: function() {
			_ELEMENT.setAttribute("scrolling", _SELF.scrolling);
		}
	};
	this.setWidth = _setProperty.width;
	this.setHeight = _setProperty.height;
	this.load = function(src) {console.log(_ELEMENT);
		if (_ELEMENT) {
			_ELEMENT.setAttribute("src", src);
			GENERIC.addEvent(_ELEMENT, "load", _SELF.setPosition);
		}
	};
	this.setPosition = function() {
		if (_ELEMENT) {
			var left = (GEOMETRY.getViewportWidth() - CSS.outerWidth(_ELEMENT)) / 2;
			var top = (GEOMETRY.getViewportHeight() - CSS.outerHeight(_ELEMENT)) / 2;
			_ELEMENT.style.position = "relative";
			_ELEMENT.style.left = left + "px";
			_ELEMENT.style.top = top + "px";
		}
	};
	(function() {
		_initialize();
	})();
};
