/********************************************************************************************************
Canvas

Related Posts =>
HTML5 Rocks Graphics
- http://www.html5rocks.com/en/features/graphics
HTML5 Canvas Tutorials
- http://www.html5canvastutorials.com/
html2canvas - Screenshots with JavaScript
- http://html2canvas.hertzen.com/
Creating Image Maps
- http://www.elated.com/articles/creating-image-maps/
Canvas Tutorial
- https://developer.mozilla.org/en/Canvas_tutorial
********************************************************************************************************/
var CANVAS = function(options) {
	var _self = this;
	var _defaults = {
		width: (options && options.width) ? options.width : 1000,
		height: (options && options.height) ? options.height : 1000,
		zIndex: (options && options.zIndex) ? options.zIndex : 999,
		parent: (options && options.parent) ? options.parent : document.body
	};
	var _canvas, _context;
	var _overlays = {};
	var _initialize = function() {
		_canvas = document.createElement("canvas");
		_canvas.width = _defaults.width;
		_canvas.height = _defaults.height;
		_canvas.style.display = "block";
		_canvas.style.position = "absolute";
		_canvas.style.left = "0px";
		_canvas.style.top = "0px";
		_canvas.style.zIndex = _defaults.zIndex;
		//_canvas = document.getElementById("realCanvas");
		if (!_canvas.getContext && typeof G_vmlCanvasManager != "undefined") // For IE
			_context = G_vmlCanvasManager.initElement(_canvas);
		if (_canvas.getContext)
			_context = _canvas.getContext("2d");
		_defaults.parent.appendChild(_canvas);
	};
	var _penStyle = {
		_get: function() {
			
		},
		_setFillColor: function(fillColor, fillAlpha) {
			_context.fillStyle = fillColor;
			_context.globalAlpha = fillAlpha;
		},
		_setStrokeColor: function(strokeWidth, strokeColor, strokeAlpha) {
			_context.lineWidth = strokeWidth;
			_context.strokeStyle = strokeColor;
			_context.globalAlpha = strokeAlpha;
			_context.lineCap = "round";
			_context.lineJoin = "round";
		}
	};
	var _graphics = {
		_bound: function(options) {
			var overlay = new _bound(options);
			_overlays[overlay.id] = overlay;
			return overlay;
		},
		_roundRectangle: function(options) {
			var overlay = new _roundRectangle(options);
			_overlays[overlay.id] = overlay;
			return overlay;
		},
		_circle: function(options) {
			var overlay = new _circle(options);
			_overlays[overlay.id] = overlay;
			return overlay;
		},
		_polyline: function(options) {
			var overlay = new _polyline(options);
			_overlays[overlay.id] = overlay;
			return overlay;
		},
		_polygon: function(options) {
			var overlay = new _polygon(options);
			_overlays[overlay.id] = overlay;
			return overlay;
		}
	};
	var _clear = function() {
		_context.clearRect(0, 0, _canvas.width, _canvas.height);
	};
	var _add = function(overlay) {
		_clear();
		_redraw();
		/*if (overlay.isRectangle)
			_draw._rectangle(overlay);
		else if (overlay.isBound)
			_draw._bound(overlay);
		else if (overlay.isCircle)
			_draw._circle(overlay);
		else if (overlay.isPolyline)
			_draw._polyline(overlay);
		else if (overlay.isPolygon)
			_draw._polygon(overlay);*/
	};
	var _remove = function(overlay) {
		delete _overlays[overlay.id];
	};
	var _removeAll = function() {
		_clear();
		_overlays = {};
	};
	var _draw = {
		_bound: function(overlay) {
			var defaults = overlay.defaults;
			var min = defaults.points.min;
			var max = defaults.points.max;
			_penStyle._setFillColor(defaults.fillColor, defaults.fillAlpha);
			_penStyle._setStrokeColor(defaults.strokeWidth, defaults.strokeColor, defaults.strokeAlpha);
			_context.beginPath();
			_context.moveTo(min.x, min.y);
			_context.lineTo(max.x, min.y);
			_context.lineTo(max.x, max.y);
			_context.lineTo(min.x, max.y);
			_context.closePath();
			_context.fill();
			_context.stroke();
		},
		_roundRectangle: function(overlay) {
			var defaults = overlay.defaults;
			var min = defaults.points.min;
			var max = defaults.points.max;
			var radius = defaults.radius;
			_penStyle._setFillColor(defaults.fillColor, defaults.fillAlpha);
			_penStyle._setStrokeColor(defaults.strokeWidth, defaults.strokeColor, defaults.strokeAlpha);
			_context.beginPath();
			_context.moveTo(min.x, min.y + radius);
			_context.lineTo(min.x, max.y - radius);
			_context.quadraticCurveTo(min.x, max.y, min.x + radius, max.y);
			_context.lineTo(max.x - radius, max.y);
			_context.quadraticCurveTo(max.x, max.y, max.x, max.y - radius);
			_context.lineTo(max.x, min.y + radius);
			_context.quadraticCurveTo(max.x, min.y, max.x - radius, min.y);
			_context.lineTo(min.x + radius, min.y);
			_context.quadraticCurveTo(min.x, min.y, min.x, min.y + radius);
			_context.closePath();
			_context.fill();
			_context.stroke();
			/*
			ctx.moveTo(x,y+radius);  
			ctx.lineTo(x,y+height-radius);  
			ctx.quadraticCurveTo(x,y+height,x+radius,y+height);  
			ctx.lineTo(x+width-radius,y+height);  
			ctx.quadraticCurveTo(x+width,y+height,x+width,y+height-radius);  
			ctx.lineTo(x+width,y+radius);  
			ctx.quadraticCurveTo(x+width,y,x+width-radius,y);  
			ctx.lineTo(x+radius,y);  
			ctx.quadraticCurveTo(x,y,x,y+radius);  
			*/
		},
		_circle: function(overlay) {
			var defaults = overlay.defaults;
			_penStyle._setFillColor(defaults.fillColor, defaults.fillAlpha);
			_penStyle._setStrokeColor(defaults.strokeWidth, defaults.strokeColor, defaults.strokeAlpha);
			_context.beginPath();
			_context.arc(defaults.x, defaults.y, defaults.radius, defaults.startAngle, defaults.endAngle, defaults.anticlockwise);
			_context.fill();
			_context.stroke();
		},
		_polyline: function(overlay) {
			var defaults = overlay.defaults;
			_penStyle._setStrokeColor(defaults.strokeWidth, defaults.strokeColor, defaults.strokeAlpha);
			_context.beginPath();
			for (var i=0; i<defaults.points.length; i++) {
				var point = defaults.points[i];
				if (i == 0) {
					_context.moveTo(point.x, point.y);
				} else {
					_context.lineTo(point.x, point.y);
				}
			}
			//_context.closePath();
			_context.stroke();
		},
		_polygon: function(overlay) {
			var defaults = overlay.defaults;
			_penStyle._setFillColor(defaults.fillColor, defaults.fillAlpha);
			_penStyle._setStrokeColor(defaults.strokeWidth, defaults.strokeColor, defaults.strokeAlpha);
			_context.beginPath();
			for (var i=0; i<defaults.points.length; i++) {
				var point = defaults.points[i];
				if (i == 0)
					_context.moveTo(point.x, point.y);
				else
					_context.lineTo(point.x, point.y);
			}
			_context.closePath();
			_context.fill();
			_context.stroke();
		}
	};
	var _redraw = function() {
		for (var i in _overlays) {
			var overlay = _overlays[i];
			if (overlay.isBound)
				_draw._bound(overlay);
			else if (overlay.isRoundRectangle)
				_draw._roundRectangle(overlay);
			else if (overlay.isCircle)
				_draw._circle(overlay);
			else if (overlay.isPolyline)
				_draw._polyline(overlay);
			else if (overlay.isPolygon)
				_draw._polygon(overlay);
		}
	};
	var _bound = function(options) {
		var _defaults = {
			points: (options && options.points) ? options.points : null,
			fillColor: (options && options.fillColor) ? options.fillColor : "#fff",
			fillAlpha: (options && typeof options.fillAlpha == "number") ? options.fillAlpha : 0,
			strokeWidth: (options && typeof options.strokeWidth == "number") ? options.strokeWidth : 0,
			strokeColor: (options && options.strokeColor) ? options.strokeColor : "#000",
			strokeAlpha: (options && typeof options.strokeAlpha == "number") ? options.strokeAlpha : 0
		};
		var _initialize = function() {
			
		};
		var _getMinPoint = function() {
			return _defaults.points.min;
		};
		var _getMaxPoint = function() {
			return _defaults.points.max;
		};
		var _getWidth = function() {
			return _defaults.points.max.x - _defaults.points.min.x;
		};
		var _getHeight = function() {
			return _defaults.points.max.y - _defaults.points.min.y;
		};
		var _extend = function(point) {
			if (!point)
				return;
			var minx, miny, maxx, maxy;
			if (!point.isBound) {
				minx = point.x;
				miny = point.y;
				maxx = point.x;
				maxy = point.y;
			} else {
				var bMin = point.getMinPoint();
				var bMax = point.getMaxPoint();
				minx = bMin.x;
				miny = bMin.y;
				maxx = bMax.x;
				maxy = bMax.y;
			}
			var min = _getMinPoint();
			var max = _getMaxPoint();
			var minX = Math.min(minx, min.x);
			var minY = Math.min(miny, min.y);
			var maxX = Math.max(maxx, max.x);
			var maxY = Math.max(maxy, max.y);
			_defaults.points.min = {x:minX, y:minY};
			_defaults.points.max = {x:maxX, y:maxY};
		};
		var _contains = function(point) {
			if (!point.isBound) {
				var min = _getMinPoint();
				var max = _getMaxPoint();
				if (point.x < min.x || point.y < min.y || point.x > max.x || point.y > max.y)
					return false;
				else
					return true;
			} else {
				var min = _getMinPoint();
				var max = _getMaxPoint();
				var bMin = point.getMinPoint();
				var bMax = point.getMaxPoint();
				if (bMin.x < min.x || bMin.y < min.y || bMax.x > max.x || bMax.y > max.y)
					return false;
				else
					return true;
			}
		};
		(function(){
			_initialize();
		})();
		this.isBound = true;
		this.id = new Date().getTime();
		this.defaults = _defaults;
		this.getMinPoint = _getMinPoint;
		this.getMaxPoint = _getMaxPoint;
		this.getWidth = _getWidth;
		this.getHeight = _getHeight;
	};
	var _roundRectangle = function(options) {
		var _defaults = {
			points: (options && options.points) ? options.points : null,
			radius: (options && typeof options.radius == "number") ? options.radius : 0,
			fillColor: (options && options.fillColor) ? options.fillColor : "#fff",
			fillAlpha: (options && typeof options.fillAlpha == "number") ? options.fillAlpha : 0,
			strokeWidth: (options && typeof options.strokeWidth == "number") ? options.strokeWidth : 0,
			strokeColor: (options && options.strokeColor) ? options.strokeColor : "#000",
			strokeAlpha: (options && typeof options.strokeAlpha == "number") ? options.strokeAlpha : 0
		};
		var _initialize = function() {
			
		};
		(function(){
			_initialize();
		})();
		this.isRoundRectangle = true;
		this.id = new Date().getTime();
		this.defaults = _defaults;
	};
	var _circle = function(options) {
		var _defaults = {
			x: (options && typeof options.x == "number") ? options.x : 0,
			y: (options && typeof options.y == "number") ? options.y : 0,
			radius: (options && typeof options.radius == "number") ? options.radius : 0,
			startAngle: 0,
			endAngle: Math.PI * 2,
			anticlockwise: true,
			fillColor: (options && options.fillColor) ? options.fillColor : "#fff",
			fillAlpha: (options && typeof options.fillAlpha == "number") ? options.fillAlpha : 0,
			strokeWidth: (options && typeof options.strokeWidth == "number") ? options.strokeWidth : 0,
			strokeColor: (options && options.strokeColor) ? options.strokeColor : "#000",
			strokeAlpha: (options && typeof options.strokeAlpha == "number") ? options.strokeAlpha : 0
		};
		var _initialize = function() {
			
		};
		(function(){
			_initialize();
		})();
		this.isCircle = true;
		this.id = new Date().getTime();
		this.defaults = _defaults;
	};
	var _polyline = function(options) {
		var _defaults = {
			points: (options && options.points) ? options.points : [],
			strokeWidth: (options && typeof options.strokeWidth == "number") ? options.strokeWidth : 0,
			strokeColor: (options && options.strokeColor) ? options.strokeColor : "#000",
			strokeAlpha: (options && typeof options.strokeAlpha == "number") ? options.strokeAlpha : 0
		};
		var _initialize = function() {
			
		};
		var _getVertex = function(index) {
			return _defaults.points[index];
		};
		var _setVertex = function(index, point) {
			_defaults.points[index] = point;
		};
		var _addVertex = function(point, index) {
			if (!point)
				return;
			if (typeof index == "number") {
				if (index >= _defaults.points.length) {
					_defaults.points.push(point);
				} else {
					for (var i=_defaults.points.length; i>=index; i--) {
						if (i == index)
							_defaults.points.splice(i, 1, point);
						else
							_defaults.points.splice(i, 1, _defaults.points[i-1]);
					}
				}
			} else {
				_defaults.points.push(point);
			}
		};
		var _removeVertex = function(index) {
			if (typeof index == "number")
				_defaults.points.splice(index, 1);
			else
				_defaults.points = [];
		};
		(function(){
			_initialize();
		})();
		this.isPolyline = true;
		this.id = new Date().getTime();
		this.defaults = _defaults;
		this.getVertex = _getVertex;
		this.setVertex = _setVertex;
		this.addVertex = _addVertex;
		this.removeVertex = _removeVertex;
	};
	var _polygon = function(options) {
		var _defaults = {
			points: (options && options.points) ? options.points : [],
			fillColor: (options && options.fillColor) ? options.fillColor : "#fff",
			fillAlpha: (options && typeof options.fillAlpha == "number") ? options.fillAlpha : 0,
			strokeWidth: (options && typeof options.strokeWidth == "number") ? options.strokeWidth : 0,
			strokeColor: (options && options.strokeColor) ? options.strokeColor : "#000",
			strokeAlpha: (options && typeof options.strokeAlpha == "number") ? options.strokeAlpha : 0
		};
		var _initialize = function() {
			
		};
		var _addVertex = function(point, index) {
			if (!point)
				return;
			if (typeof index == "number") {
				if (index >= _defaults.points.length) {
					_defaults.points.push(point);
				} else {
					for (var i=_defaults.points.length; i>=index; i--) {
						if (i == index)
							_defaults.points.splice(i, 1, point);
						else
							_defaults.points.splice(i, 1, _defaults.points[i-1]);
					}
				}
			} else {
				_defaults.points.push(point);
			}
		};
		(function(){
			_initialize();
		})();
		this.isPolygon = true;
		this.id = new Date().getTime();
		this.defaults = _defaults;
		this.addVertex = _addVertex;
	};
	(function(){
		_initialize();
	})();
	this.canvas = _canvas;
	this.bound = _graphics._bound;
	this.roundRectangle = _graphics._roundRectangle;
	this.circle = _graphics._circle;
	this.polyline = _graphics._polyline;
	this.polygon = _graphics._polygon;
	this.add = _add;
	this.remove = _remove;
	this.removeAll = _removeAll;
};
var DRAW = function(options) {
	var _self = this;
	var _defaults = {
		width: (options && options.width) ? options.width : 1000,
		height: (options && options.height) ? options.height : 1000,
		zIndex: (options && options.zIndex) ? options.zIndex : 999,
		parent: (options && options.parent) ? options.parent : document.body
	};
	var _CANVAS;
	var _fakeCanvas, _fakeContext;
	var _offset = {}, _boundary = {};
	var _scroll, _mouseDownPoint, _mouseCurrentPoint, _isMouseDown = false, _overlay = null;
	var _type = "", _events = {}, _radius = 10;
	var _pen = {
		fillColor: "#333",
		fillAlpha: 0.5,
		strokeWidth: 2,
		strokeColor: "#333",
		strokeAlpha: 0.8
	};
	var _points = [];
	var _initialize = function() {
		_CANVAS = new CANVAS(_defaults);
		_fakeCanvas = document.createElement("canvas");
		_fakeCanvas.width = _CANVAS.canvas.width;
		_fakeCanvas.height = _CANVAS.canvas.height;
		_fakeCanvas.className = "area-canvas";
		_fakeCanvas.style.position = "absolute";
		_fakeCanvas.style.display = "block";
		_fakeCanvas.style.left = _CANVAS.canvas.style.left;
		_fakeCanvas.style.top = _CANVAS.canvas.style.top;
		_fakeCanvas.style.zIndex = parseInt(_CANVAS.canvas.style.zIndex, 10) + 1;
		//_fakeCanvas = document.getElementById("fakeCanvas");
		if (!_fakeCanvas.getContext && typeof G_vmlCanvasManager != "undefined")
			_fakeContext = G_vmlCanvasManager.initElement(_fakeCanvas);
		if (_fakeCanvas.getContext)
			_fakeContext = _fakeCanvas.getContext("2d");
		_CANVAS.canvas.parentNode.appendChild(_fakeCanvas);
		_offset = CSS.offset(_fakeCanvas);
		_boundary = {
			left: _offset.left,
			right: _offset.left + _fakeCanvas.width,
			top: _offset.top,
			bottom: _offset.top + _fakeCanvas.height
		};
	};
	var _removeAllHandlers = function(){
		for (var i in _events) {
			if (_events.hasOwnProperty(i) && typeof _events[i] == "function") {
				if (i == "mousemove" || i == "mouseup")
					GENERIC.removeEvent(document, i, _events[i]);
				else
					GENERIC.removeEvent(_defaults.parent, i, _events[i]);
			}
		}
	};
	var _addMouseHandlers = function(type, fn) {
		GENERIC.addEvent(document, type, fn);
	};
	var _removeMouseHandlers = function(type, fn) {
		GENERIC.removeEvent(document, type, fn);
	};
	var _fakeContextTool = {
		_setFillColor: function() {
			_fakeContext.fillStyle = _pen.fillColor;
			_fakeContext.globalAlpha = _pen.fillAlpha;
		},
		_setStrokeColor: function() {
			_fakeContext.lineWidth = _pen.strokeWidth;
			_fakeContext.strokeStyle = _pen.strokeColor;
			_fakeContext.globalAlpha = _pen.strokeAlpha;
			_fakeContext.lineCap = "round";
			_fakeContext.lineJoin = "round";
		},
		_clear: function() {
			_fakeContext.clearRect(0, 0, _fakeCanvas.width, _fakeCanvas.height);
		},
		_show: function() {
			_fakeCanvas.style.display = "block";
		},
		_hide: function() {
			_fakeCanvas.style.display = "none";
		}
	};
	var _distance = function(point1, point2) {
		var deltaX = point1.x - point2.x;
		var deltaY = point1.y - point2.y;
		return Math.sqrt(deltaX * deltaX + deltaY * deltaY);
	};
	var _ready = function(events, radius) {
		_removeAllHandlers();
		for (var i in events) {
			if (events.hasOwnProperty(i) && typeof events[i] == "function" && i != "mousemove" && i != "mouseup") 
				GENERIC.addEvent(_defaults.parent, i, events[i]);
		}
		_events = events;
		if (typeof radius == "number")
			_radius = radius;
	};
	var _clear = function() {
		_fakeContextTool._clear();
		_fakeContextTool._show();
		_CANVAS.removeAll();
	};
	var _graphics = {
		_bound: function() {
			var events = {
				mousedown: function(event){
					var event = event || window.event;
					GENERIC.cancelDefault(event);
					GENERIC.stopPropagation(event);
					var target = GENERIC.findTarget(event);
					//if (target != _CANVAS.canvas && target != _fakeCanvas)
						//return;
					if (!target)
						return;
					_isMouseDown = true;
					_scroll = {x:GEOMETRY.getHorizontalScroll(), y:GEOMETRY.getVerticalScroll()};
					_mouseDownPoint = {x:event.clientX + _scroll.x, y:event.clientY + _scroll.y};
					if (_boundary && (_mouseDownPoint.x >= _boundary.left && _mouseDownPoint.x <= _boundary.right) && 
						(_mouseDownPoint.y >= _boundary.top && _mouseDownPoint.y <= _boundary.bottom)) {
						_fakeContextTool._clear();
						_fakeContextTool._setFillColor();
						_fakeContextTool._setStrokeColor();
						_fakeContextTool._show();
						_addMouseHandlers("mousemove", events.mousemove);
						_addMouseHandlers("mouseup", events.mouseup);
					}
				},
				mousemove: function(event){
					var event = event || window.event;
					GENERIC.cancelDefault(event);
					GENERIC.stopPropagation(event);
					if (_isMouseDown) {
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
						var minX = Math.min(x, _mouseDownPoint.x);
						var minY = Math.min(y, _mouseDownPoint.y);
						var maxX = Math.max(x, _mouseDownPoint.x);
						var maxY = Math.max(y, _mouseDownPoint.y);
						_fakeContextTool._clear();
						_fakeContext.beginPath();
						_fakeContext.moveTo(minX - _offset.left, minY - _offset.top);
						_fakeContext.lineTo(maxX - _offset.left, minY - _offset.top);
						_fakeContext.lineTo(maxX - _offset.left, maxY - _offset.top);
						_fakeContext.lineTo(minX - _offset.left, maxY - _offset.top);
						_fakeContext.closePath();
						_fakeContext.fill();
						_fakeContext.stroke();
					}
				},
				mouseup: function(event){
					var event = event || window.event;
					GENERIC.cancelDefault(event);
					GENERIC.stopPropagation(event);
					if (_isMouseDown) {
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
						var minX = Math.min(x, _mouseDownPoint.x) - _offset.left;
						var minY = Math.min(y, _mouseDownPoint.y) - _offset.top;
						var maxX = Math.max(x, _mouseDownPoint.x) - _offset.left;
						var maxY = Math.max(y, _mouseDownPoint.y) - _offset.top;
						_fakeContextTool._clear();
						_overlay = _CANVAS.bound({
							points: {
								min: {x:minX, y:minY},
								max: {x:maxX, y:maxY}
							},
							fillColor: _pen.fillColor,
							fillAlpha: _pen.fillAlpha,
							strokeWidth: _pen.strokeWidth,
							strokeColor: _pen.strokeColor,
							strokeAlpha: _pen.strokeAlpha
						});
						_CANVAS.add(_overlay);
						_fakeContextTool._hide();
						_removeMouseHandlers();
						_isMouseDown = false;
						_mouseDownPoint = null;
						_overlay = null;
						_removeMouseHandlers("mousemove", events.mousemove);
						_removeMouseHandlers("mouseup", events.mouseup);
					}
				}
			};
			_ready(events);
		},
		_roundRectangle: function(radius) {
			var events = {
				mousedown: function(event){
					var event = event || window.event;
					GENERIC.cancelDefault(event);
					GENERIC.stopPropagation(event);
					var target = GENERIC.findTarget(event);
					//if (target != _CANVAS.canvas && target != _fakeCanvas)
						//return;
					if (!target)
						return;
					_isMouseDown = true;
					_scroll = {x:GEOMETRY.getHorizontalScroll(), y:GEOMETRY.getVerticalScroll()};
					_mouseDownPoint = {x:event.clientX + _scroll.x, y:event.clientY + _scroll.y};
					if (_boundary && (_mouseDownPoint.x >= _boundary.left && _mouseDownPoint.x <= _boundary.right) && 
						(_mouseDownPoint.y >= _boundary.top && _mouseDownPoint.y <= _boundary.bottom)) {
						_fakeContextTool._clear();
						_fakeContextTool._setFillColor();
						_fakeContextTool._setStrokeColor();
						_fakeContextTool._show();
						_addMouseHandlers("mousemove", events.mousemove);
						_addMouseHandlers("mouseup", events.mouseup);
					}
				},
				mousemove: function(event){
					var event = event || window.event;
					GENERIC.cancelDefault(event);
					GENERIC.stopPropagation(event);
					if (_isMouseDown) {
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
						var minX = Math.min(x, _mouseDownPoint.x);
						var minY = Math.min(y, _mouseDownPoint.y);
						var maxX = Math.max(x, _mouseDownPoint.x);
						var maxY = Math.max(y, _mouseDownPoint.y);
						var width = maxX - minX;
						var height = maxY - minY;
						_fakeContextTool._clear();
						_fakeContext.beginPath();
						_fakeContext.moveTo(minX - _offset.left, minY - _offset.top + _radius);
						_fakeContext.lineTo(minX - _offset.left, maxY - _offset.top - _radius);
						_fakeContext.quadraticCurveTo(minX - _offset.left, maxY - _offset.top, minX - _offset.left + _radius, maxY - _offset.top);
						_fakeContext.lineTo(maxX - _offset.left - _radius, maxY - _offset.top);
						_fakeContext.quadraticCurveTo(maxX - _offset.left, maxY - _offset.top, maxX - _offset.left, maxY - _offset.top - _radius);
						_fakeContext.lineTo(maxX - _offset.left, minY - _offset.top + _radius);
						_fakeContext.quadraticCurveTo(maxX - _offset.left, minY - _offset.top, maxX - _offset.left - _radius, minY - _offset.top);
						_fakeContext.lineTo(minX - _offset.left + _radius, minY - _offset.top);
						_fakeContext.quadraticCurveTo(minX - _offset.left, minY - _offset.top, minX - _offset.left, minY - _offset.top + _radius);
						_fakeContext.closePath();
						_fakeContext.fill();
						_fakeContext.stroke();
					}
				},
				mouseup: function(event){
					var event = event || window.event;
					GENERIC.cancelDefault(event);
					GENERIC.stopPropagation(event);
					if (_isMouseDown) {
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
						var minX = Math.min(x, _mouseDownPoint.x) - _offset.left;
						var minY = Math.min(y, _mouseDownPoint.y) - _offset.top;
						var maxX = Math.max(x, _mouseDownPoint.x) - _offset.left;
						var maxY = Math.max(y, _mouseDownPoint.y) - _offset.top;
						_fakeContextTool._clear();
						_overlay = _CANVAS.roundRectangle({
							points: {
								min: {x:minX, y:minY},
								max: {x:maxX, y:maxY}
							},
							radius: _radius,
							fillColor: _pen.fillColor,
							fillAlpha: _pen.fillAlpha,
							strokeWidth: _pen.strokeWidth,
							strokeColor: _pen.strokeColor,
							strokeAlpha: _pen.strokeAlpha
						});
						_CANVAS.add(_overlay);
						_fakeContextTool._hide();
						_removeMouseHandlers();
						_isMouseDown = false;
						_mouseDownPoint = null;
						_overlay = null;
						_removeMouseHandlers("mousemove", events.mousemove);
						_removeMouseHandlers("mouseup", events.mouseup);
					}
				}
			};
			_ready(events, radius);
		},
		_circle: function() {
			var events = {
				mousedown: function(event){
					var event = event || window.event;
					GENERIC.cancelDefault(event);
					GENERIC.stopPropagation(event);
					var target = GENERIC.findTarget(event);
					//if (target != _CANVAS.canvas && target != _fakeCanvas)
						//return;
					if (!target)
						return;
					_isMouseDown = true;
					_scroll = {x:GEOMETRY.getHorizontalScroll(), y:GEOMETRY.getVerticalScroll()};
					_mouseDownPoint = {x:event.clientX + _scroll.x, y:event.clientY + _scroll.y};
					if (_boundary && (_mouseDownPoint.x >= _boundary.left && _mouseDownPoint.x <= _boundary.right) && 
						(_mouseDownPoint.y >= _boundary.top && _mouseDownPoint.y <= _boundary.bottom)) {
						_fakeContextTool._clear();
						_fakeContextTool._setFillColor();
						_fakeContextTool._setStrokeColor();
						_fakeContextTool._show();
						_addMouseHandlers("mousemove", events.mousemove);
						_addMouseHandlers("mouseup", events.mouseup);
					}
				},
				mousemove: function(event){
					var event = event || window.event;
					GENERIC.cancelDefault(event);
					GENERIC.stopPropagation(event);
					if (_isMouseDown) {
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
						var minX = Math.min(x, _mouseDownPoint.x);
						var minY = Math.min(y, _mouseDownPoint.y);
						var maxX = Math.max(x, _mouseDownPoint.x);
						var maxY = Math.max(y, _mouseDownPoint.y);
						var radius = Math.round(Math.sqrt(Math.pow(maxX - minX, 2) + Math.pow(maxY - minY, 2)));
						_fakeContextTool._clear();
						_fakeContext.beginPath();
						_fakeContext.arc(_mouseDownPoint.x - _offset.left, _mouseDownPoint.y - _offset.top, radius, 0, Math.PI * 2, true);
						_fakeContext.fill();
						_fakeContext.stroke();
					}
				},
				mouseup: function(event){
					var event = event || window.event;
					GENERIC.cancelDefault(event);
					GENERIC.stopPropagation(event);
					if (_isMouseDown) {
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
						var minX = Math.min(x, _mouseDownPoint.x);
						var minY = Math.min(y, _mouseDownPoint.y);
						var maxX = Math.max(x, _mouseDownPoint.x);
						var maxY = Math.max(y, _mouseDownPoint.y);
						var radius = Math.round(Math.sqrt(Math.pow(maxX - minX, 2) + Math.pow(maxY - minY, 2)));
						_fakeContextTool._clear();
						_overlay = _CANVAS.circle({
							x: _mouseDownPoint.x - _offset.left,
							y: _mouseDownPoint.y - _offset.top,
							radius: radius,
							fillColor: _pen.fillColor,
							fillAlpha: _pen.fillAlpha,
							strokeWidth: _pen.strokeWidth,
							strokeColor: _pen.strokeColor,
							strokeAlpha: _pen.strokeAlpha
						});
						_CANVAS.add(_overlay);
						_fakeContextTool._hide();
						_removeMouseHandlers();
						_isMouseDown = false;
						_mouseDownPoint = null;
						_overlay = null;
						_removeMouseHandlers("mousemove", events.mousemove);
						_removeMouseHandlers("mouseup", events.mouseup);
					}
				}
			};
			_ready(events);
		},
		_polyline: function() {
			var events = {
				mousedown: function(event){
					var event = event || window.event;
					GENERIC.cancelDefault(event);
					GENERIC.stopPropagation(event);
				},
				mousemove: function(event){
					var event = event || window.event;
					GENERIC.cancelDefault(event);
					GENERIC.stopPropagation(event);
					if (!_isMouseDown && _overlay) {
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
						_fakeContextTool._clear();
						_fakeContext.beginPath();
						_fakeContext.moveTo(_mouseDownPoint.x - _offset.left, _mouseDownPoint.y - _offset.top);
						_fakeContext.lineTo(x - _offset.left, y - _offset.top);
						_fakeContext.stroke();
					}
				},
				mouseup: function(event){
					var event = event || window.event;
					GENERIC.cancelDefault(event);
					GENERIC.stopPropagation(event);
				},
				click: function(event){
					var event = event || window.event;
					GENERIC.cancelDefault(event);
					GENERIC.stopPropagation(event);
					var target = GENERIC.findTarget(event);
					//if (target != _CANVAS.canvas && target != _fakeCanvas)
						//return;
					if (!target)
						return;
					_scroll = {x:GEOMETRY.getHorizontalScroll(), y:GEOMETRY.getVerticalScroll()};
					_mouseDownPoint = {x:event.clientX + _scroll.x, y:event.clientY + _scroll.y};
					_isMouseDown = false;
					if (_boundary && _mouseDownPoint.x < _boundary.left)
						_mouseDownPoint.x = _boundary.left;
					if (_boundary && _mouseDownPoint.x > _boundary.right)
						_mouseDownPoint.x = _boundary.right;
					if (_boundary && _mouseDownPoint.y < _boundary.top)
						_mouseDownPoint.y = _boundary.top;
					if (_boundary && _mouseDownPoint.y > _boundary.bottom)
						_mouseDownPoint.y = _boundary.bottom;
					if (!_points.length) {
						_overlay = _CANVAS.polyline({
							points: [],
							strokeWidth: _pen.strokeWidth,
							strokeColor: _pen.strokeColor,
							strokeAlpha: _pen.strokeAlpha
						});
					}
					var isDiff = true;
					var point = {x:_mouseDownPoint.x - _offset.left, y:_mouseDownPoint.y - _offset.top};
					if (_points.length > 1) {
						var dist = _distance(_points[_points.length-1], point);
						if (!dist) // prevent push the same point twice when double click is triggered
							isDiff = false;
					}
					if (isDiff) {
						_points.push(point);
						_overlay.addVertex(point);
					}
					if (_overlay)
						_CANVAS.add(_overlay);
					_fakeContextTool._setStrokeColor();
					_fakeContextTool._show();
					_addMouseHandlers("mousemove", events.mousemove);
					_addMouseHandlers("mouseup", events.mouseup);
				},
				dblclick: function(event){
					var event = event || window.event;
					GENERIC.cancelDefault(event);
					GENERIC.stopPropagation(event);
					_isMouseDown = false;
					if (_points.length > 1) {
						_fakeContextTool._clear();
						_CANVAS.remove(_overlay);
						_overlay = _CANVAS.polyline({
							points: _points,
							strokeWidth: _pen.strokeWidth,
							strokeColor: _pen.strokeColor,
							strokeAlpha: _pen.strokeAlpha
						});
						if (_overlay)
							_CANVAS.add(_overlay);
						_fakeContextTool._hide();
						_removeMouseHandlers();
						_points = [];
						_mouseDownPoint = null;
						_overlay = null;
						_removeMouseHandlers("mousemove", events.mousemove);
						_removeMouseHandlers("mouseup", events.mouseup);
					}
				}
			};
			_ready(events);
		},
		_polygon: function() {
			var events = {
				mousedown: function(event){
					var event = event || window.event;
					GENERIC.cancelDefault(event);
					GENERIC.stopPropagation(event);
				},
				mousemove: function(event){
					var event = event || window.event;
					GENERIC.cancelDefault(event);
					GENERIC.stopPropagation(event);
					if (!_isMouseDown && _overlay) {
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
						_fakeContextTool._clear();
						_fakeContext.beginPath();
						_fakeContext.moveTo(_mouseDownPoint.x - _offset.left, _mouseDownPoint.y - _offset.top);
						_fakeContext.lineTo(x - _offset.left, y - _offset.top);
						_fakeContext.stroke();
					}
				},
				mouseup: function(event){
					var event = event || window.event;
					GENERIC.cancelDefault(event);
					GENERIC.stopPropagation(event);
				},
				click: function(event){
					var event = event || window.event;
					GENERIC.cancelDefault(event);
					GENERIC.stopPropagation(event);
					var target = GENERIC.findTarget(event);
					//if (target != _CANVAS.canvas && target != _fakeCanvas)
						//return;
					if (!target)
						return;
					_isMouseDown = false;
					_scroll = {x:GEOMETRY.getHorizontalScroll(), y:GEOMETRY.getVerticalScroll()};
					_mouseDownPoint = {x:event.clientX + _scroll.x, y:event.clientY + _scroll.y};
					if (_boundary && _mouseDownPoint.x < _boundary.left)
						_mouseDownPoint.x = _boundary.left;
					if (_boundary && _mouseDownPoint.x > _boundary.right)
						_mouseDownPoint.x = _boundary.right;
					if (_boundary && _mouseDownPoint.y < _boundary.top)
						_mouseDownPoint.y = _boundary.top;
					if (_boundary && _mouseDownPoint.y > _boundary.bottom)
						_mouseDownPoint.y = _boundary.bottom;
					if (!_points.length) {
						_overlay = _CANVAS.polyline({
							points: [],
							strokeWidth: _pen.strokeWidth,
							strokeColor: _pen.strokeColor,
							strokeAlpha: _pen.strokeAlpha
						});
					}
					var isDiff = true;
					var point = {x:_mouseDownPoint.x - _offset.left, y:_mouseDownPoint.y - _offset.top};
					if (_points.length > 1) {
						var dist = _distance(_points[_points.length-1], point);
						if (!dist) // prevent push the same point twice when double click is triggered
							isDiff = false;
					}
					if (isDiff) {
						_points.push(point);
						_overlay.addVertex(point);
					}
					if (_overlay)
						_CANVAS.add(_overlay);
					_fakeContextTool._setStrokeColor();
					_fakeContextTool._show();
					_addMouseHandlers("mousemove", events.mousemove);
					_addMouseHandlers("mouseup", events.mouseup);
				},
				dblclick: function(event){
					var event = event || window.event;
					GENERIC.cancelDefault(event);
					GENERIC.stopPropagation(event);
					_isMouseDown = false;
					if (_points.length > 1) {
						_fakeContextTool._clear();
						_CANVAS.remove(_overlay);
						_overlay = _CANVAS.polygon({
							points: _points,
							fillColor: _pen.fillColor,
							fillAlpha: _pen.fillAlpha,
							strokeWidth: _pen.strokeWidth,
							strokeColor: _pen.strokeColor,
							strokeAlpha: _pen.strokeAlpha
						});
						if (_overlay)
							_CANVAS.add(_overlay);
						_fakeContextTool._hide();
						_removeMouseHandlers();
						_points = [];
						_mouseDownPoint = null;
						_overlay = null;
						_removeMouseHandlers("mousemove", events.mousemove);
						_removeMouseHandlers("mouseup", events.mouseup);
					}
				}
			};
			_ready(events);
		},
		_pen: function() {
			var events = {
				mousedown: function(event){
					var event = event || window.event;
					GENERIC.cancelDefault(event);
					GENERIC.stopPropagation(event);
					var target = GENERIC.findTarget(event);
					//if (target != _CANVAS.canvas && target != _fakeCanvas)
						//return;
					if (!target)
						return;
					_isMouseDown = true;
					_scroll = {x:GEOMETRY.getHorizontalScroll(), y:GEOMETRY.getVerticalScroll()};
					_mouseDownPoint = {x:event.clientX + _scroll.x, y:event.clientY + _scroll.y};
					if (_boundary && (_mouseDownPoint.x >= _boundary.left && _mouseDownPoint.x <= _boundary.right) && 
						(_mouseDownPoint.y >= _boundary.top && _mouseDownPoint.y <= _boundary.bottom)) {
						_fakeContextTool._clear();
						_fakeContextTool._setStrokeColor();
						_fakeContext.beginPath();
						var point = {x:_mouseDownPoint.x - _offset.left, y:_mouseDownPoint.y - _offset.top};
						_points.push(point);
						_fakeContext.moveTo(point.x, point.y);
						_fakeContext.stroke();
						_fakeContextTool._show();
						_addMouseHandlers("mousemove", events.mousemove);
						_addMouseHandlers("mouseup", events.mouseup);
					}
				},
				mousemove: function(event){
					var event = event || window.event;
					GENERIC.cancelDefault(event);
					GENERIC.stopPropagation(event);
					if (_isMouseDown) {
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
						var point = {x:x - _offset.left, y:y - _offset.top};
						_points.push(point);
						_fakeContext.lineTo(point.x, point.y);
						_fakeContext.stroke();
					}
				},
				mouseup: function(event){
					var event = event || window.event;
					GENERIC.cancelDefault(event);
					GENERIC.stopPropagation(event);
					if (_isMouseDown) {
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
						var point = {x:x - _offset.left, y:y - _offset.top};
						_points.push(point);
						_fakeContextTool._clear();
						_overlay = _CANVAS.polyline({
							points: _points,
							strokeWidth: _pen.strokeWidth,
							strokeColor: _pen.strokeColor,
							strokeAlpha: _pen.strokeAlpha
						});
						_CANVAS.add(_overlay);
						_fakeContextTool._hide();
						_removeMouseHandlers();
						_points = [];
						_isMouseDown = false;
						_mouseDownPoint = null;
						_overlay = null;
						_removeMouseHandlers("mousemove", events.mousemove);
						_removeMouseHandlers("mouseup", events.mouseup);
					}
				}
			};
			_ready(events);
		},
		_penPolygon: function() {
			var events = {
				mousedown: function(event){
					var event = event || window.event;
					GENERIC.cancelDefault(event);
					GENERIC.stopPropagation(event);
					var target = GENERIC.findTarget(event);
					//if (target != _CANVAS.canvas && target != _fakeCanvas)
						//return;
					if (!target)
						return;
					_isMouseDown = true;
					_scroll = {x:GEOMETRY.getHorizontalScroll(), y:GEOMETRY.getVerticalScroll()};
					_mouseDownPoint = {x:event.clientX + _scroll.x, y:event.clientY + _scroll.y};
					if (_boundary && (_mouseDownPoint.x >= _boundary.left && _mouseDownPoint.x <= _boundary.right) && 
						(_mouseDownPoint.y >= _boundary.top && _mouseDownPoint.y <= _boundary.bottom)) {
						_fakeContextTool._clear();
						_fakeContextTool._setStrokeColor();
						_fakeContext.beginPath();
						var point = {x:_mouseDownPoint.x - _offset.left, y:_mouseDownPoint.y - _offset.top};
						_points.push(point);
						_fakeContext.moveTo(point.x, point.y);
						_fakeContext.stroke();
						_fakeContextTool._show();
						_addMouseHandlers("mousemove", events.mousemove);
						_addMouseHandlers("mouseup", events.mouseup);
					}
				},
				mousemove: function(event){
					var event = event || window.event;
					GENERIC.cancelDefault(event);
					GENERIC.stopPropagation(event);
					if (_isMouseDown) {
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
						var point = {x:x - _offset.left, y:y - _offset.top};
						_points.push(point);
						_fakeContext.lineTo(point.x, point.y);
						_fakeContext.stroke();
					}
				},
				mouseup: function(event){
					var event = event || window.event;
					GENERIC.cancelDefault(event);
					GENERIC.stopPropagation(event);
					if (_isMouseDown) {
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
						var point = {x:x - _offset.left, y:y - _offset.top};
						_points.push(point);
						_fakeContextTool._clear();
						_overlay = _CANVAS.polygon({
							points: _points,
							fillColor: _pen.fillColor,
							fillAlpha: _pen.fillAlpha,
							strokeWidth: _pen.strokeWidth,
							strokeColor: _pen.strokeColor,
							strokeAlpha: _pen.strokeAlpha
						});
						_CANVAS.add(_overlay);
						_fakeContextTool._hide();
						_removeMouseHandlers();
						_points = [];
						_isMouseDown = false;
						_mouseDownPoint = null;
						_overlay = null;
						_removeMouseHandlers("mousemove", events.mousemove);
						_removeMouseHandlers("mouseup", events.mouseup);
					}
				}
			};
			_ready(events);
		}
	};
	(function(){
		_initialize();
	})();
	this.clear = _clear;
	this.bound = _graphics._bound;
	this.roundRectangle = _graphics._roundRectangle;
	this.circle = _graphics._circle;
	this.polyline = _graphics._polyline;
	this.polygon = _graphics._polygon;
	this.pen = _graphics._pen;
	this.penPolygon = _graphics._penPolygon;
};