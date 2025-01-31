/********************************************************************************************************
Image Area

Related Posts =>
Creating Image Maps
- http://www.elated.com/articles/creating-image-maps/
Canvas Tutorial
- https://developer.mozilla.org/en/Canvas_tutorial
********************************************************************************************************/
var DRAWINGTOOL = function(_options) {
	var _self = this;
	var _canvas, _context;
	var _boundary = {};
	var _allShapes = [];
	var _initialize = function() {
		_canvas = document.getElementsByTagName("canvas")[0];
		if (_canvas.getContext)
			_context = _canvas.getContext("2d");
		var offset = CSS.offset(_canvas);
		_boundary = {
			left: offset.left,
			right: offset.left + _canvas.clientWidth,
			top: offset.top,
			bottom: offset.top + _canvas.clientHeight
		};
	};
	var _graphics = {
		_bound: function() {
			var bound = new BOUND({canvas:_canvas, context:_context, boundary:_boundary});
			_allShapes.push(bound);
		}
	};
	(function(){
		_initialize();
	})();
	this.bound = _graphics._bound;
};
var BOUND = function(_options) {
	var _self = this;
	var _initMouse, _scroll;
	var _canvas, _context, _dragElement;
	var _boundary;
	var _initialize = function() {
		_canvas = (_options && _options.canvas) ? _options.canvas : null;
		_context = (_options && _options.context) ? _options.context : null;
		_boundary = (_options && _options.boundary) ? _options.boundary : null;
		GENERIC.addEvent(_canvas, "mousedown", _onDragStart);
	};
	var _addMouseHandlers = function() {
		GENERIC.addEvent(document, "mousemove", _onDrag);
		GENERIC.addEvent(document, "mouseup", _onDragEnd);
	};
	var _removeMouseHandlers = function() {
		GENERIC.removeEvent(document, "mousemove", _onDrag);
		GENERIC.removeEvent(document, "mouseup", _onDragEnd);
	};
	var _element = {
		_add: function(left, top) {
			_dragElement = document.createElement("div");
			_dragElement.style.width = 0 + "px";
			_dragElement.style.height = 0 + "px";
			//_dragElement.style.backgroundColor = "#333";
			_dragElement.style.borderWidth = 1 + "px";
			_dragElement.style.borderStyle = "dashed";
			_dragElement.style.borderColor = "#333";
			_dragElement.style.position = "absolute";
			_dragElement.style.left = left + "px";
			_dragElement.style.top = top + "px";
			_dragElement.style.zIndex = 10;
			document.body.appendChild(_dragElement);
		},
		_remove: function() {
			document.body.removeChild(_dragElement);
			_dragElement = null;
		}
	};
	var _onDragStart = function(event) {
		//console.log('getViewportWidth: '+GEOMETRY.getViewportWidth()+', getViewportHeight: '+GEOMETRY.getViewportHeight());
		//console.log('getDocumentWidth: '+GEOMETRY.getDocumentWidth()+', getDocumentHeight: '+GEOMETRY.getDocumentHeight());
		//console.log('getHorizontalScroll: '+GEOMETRY.getHorizontalScroll()+', getVerticalScroll: '+GEOMETRY.getVerticalScroll());
		var event = event || window.event;
		GENERIC.stopPropagation(event);
		_scroll = {x:GEOMETRY.getHorizontalScroll(), y:GEOMETRY.getVerticalScroll()};
		_initMouse = {x:event.clientX + _scroll.x, y:event.clientY + _scroll.y};
		if (_boundary && (_initMouse.x >= _boundary.left && _initMouse.x <= _boundary.right) && 
			(_initMouse.y >= _boundary.top && _initMouse.y <= _boundary.bottom)) {
			_element._add(_initMouse.x, _initMouse.y);
		}
		_addMouseHandlers();
	};
	var _onDrag = function(event) {
		var event = event || window.event;
		GENERIC.stopPropagation(event);
		var x = event.clientX + _scroll.x;
		var y = event.clientY + _scroll.y;
		if (_boundary && x < _boundary.left)
			x = _boundary.left;
		if (_boundary && x > _boundary.right)
			x = _boundary.right;
		if (_boundary && y < _boundary.top)
			y = _boundary.top;
		if (_boundary && y > _boundary.bottom)
			y = _boundary.bottom;
		var width = x - _initMouse.x;
		var height = y - _initMouse.y;	
		if (width > 0) {
			_dragElement.style.width = width + "px";
		} else {
			_dragElement.style.width = Math.abs(width) + "px";
			_dragElement.style.left = x + "px";
		}
		if (height > 0) {
			_dragElement.style.height = height + "px";
		} else {
			_dragElement.style.height = Math.abs(height) + "px";
			_dragElement.style.top = y + "px";
		}
	};
	var _onDragEnd = function(event) {
		var event = event || window.event;
		GENERIC.stopPropagation(event);
		var x = event.clientX + _scroll.x;
		var y = event.clientY + _scroll.y;
		if (_boundary && x < _boundary.left)
			x = _boundary.left;
		if (_boundary && x > _boundary.right)
			x = _boundary.right;
		if (_boundary && y < _boundary.top)
			y = _boundary.top;
		if (_boundary && y > _boundary.bottom)
			y = _boundary.bottom;
		var width = x - _initMouse.x;
		var height = y - _initMouse.y;
		var left = _initMouse.x;
		var top = _initMouse.y;
		if (width > 0) {
			_dragElement.style.width = width + "px";
		} else {
			width = Math.abs(width);
			left = x;
			_dragElement.style.width = width + "px";
			_dragElement.style.left = left + "px";
		}
		if (height > 0) {
			_dragElement.style.height = height + "px";
		} else {
			height = Math.abs(height);
			top = y;
			_dragElement.style.height = height + "px";
			_dragElement.style.top = top + "px";
		}
		_element._remove();
		var offset = CSS.offset(_canvas);
		left = left - offset.left;
		top = top - offset.top;
		_context.fillRect(left, top, width, height);
		_removeMouseHandlers();
	};
	(function(){
		_initialize();
	})();
};