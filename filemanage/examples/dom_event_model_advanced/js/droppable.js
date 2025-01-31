/********************************************************************************************************
Drag and Drop

Related Posts =>
Drag and Drop
- http://www.quirksmode.org/js/dragdrop.html
How to Drag and Drop in Javascript
- http://www.webreference.com/programming/javascript/mk/column2/
How to Drag and Drop in Javascript (Chinese)
- http://ianjung1974.blogspot.com/2007/10/javascript.html

Arguments
dragElement: the element on which the mousedown event occurred.
dropElement: the element to be dropped.
elementToDrag: the element to be dragged. if null, elementToDrag is equal to dragElement.

Methods
startDrag()
- Stop propagation.
- Records the initial position of the mousedown event.
- Register event handlers for the mousemove and mouseup events.
- Change the status of elementToDrag.

onDrag()
- Stop propagation.
- Set the position of elementToDrag.
- Change the status of dropElement.

stopDrag()
- Stop propagation.
- Set the position of elementToDrag.
- Change the status of dropElement and elementToDrag.
- Deregister event handlers for the mousemove and mouseup events.
********************************************************************************************************/
var DROPPABLE = function(_options) {
    var _self = this;
    var _dragElement,  _elementToDrag, _dropElement, _dropBoundary;
    var _documentBoundary = {left: 0, right: 0 + GEOMETRY.getViewportWidth(), top: 0, bottom: 0 + GEOMETRY.getViewportHeight()};
    var _initMouse, _start;
    var _initialize = function() {
        if (!_options) return;
        if (_options.dragElement) {
        	_dragElement = (typeof _options.dragElement == "string") ? document.getElementById(_options.dragElement) : _options.dragElement;
        }
        // Define _elementToDrag Element
        if (_options.elementToDrag)
        	_elementToDrag= (typeof _options.elementToDrag == "string") ? document.getElementById(_options.elementToDrag) : _options.elementToDrag;
        else 
        	_elementToDrag= _dragElement;
        _elementToDrag._activeStatus = "drag-active-status";
        _elementToDrag._inactiveStatus = "drag-inactive-status";
        CLASSNAME.add(_elementToDrag, _elementToDrag._inactiveStatus);
        // Add Event of MouseDown to Drag Element
        GENERIC.addEvent(_dragElement, "mousedown", _onDragStart);
        // Define Drop Element
        if (_options.dropElement) {
            _dropElement = (typeof _options.dropElement == "string") ? document.getElementById(_options.dropElement) : _options.dropElement;
            _dropElement._activeStatus = "drop-active-status";
            _dropElement._inactiveStatus = "drop-inactive-status";
            CLASSNAME.add(_dropElement, _dropElement._inactiveStatus);
            // Define Area of Drop Element
            var offset = CSS.offset(_dropElement);
            _dropBoundary = {
                left: offset.left,
                right: offset.left + _dropElement.clientWidth,
                top: offset.top,
                bottom: offset.top + _dropElement.clientHeight
            };
        }
    };
    // Add Handlers of MouseMove and MouseUp to Document
    var _addMouseHandlers = function() {
        GENERIC.addEvent(document, "mousemove", _onDrag);
        GENERIC.addEvent(document, "mouseup", _onDragEnd);
    };
    // Remove Handlers of MouseMove and MouseUp from Document
    var _removeMouseHandlers = function() {
        GENERIC.removeEvent(document, "mousemove", _onDrag);
        GENERIC.removeEvent(document, "mouseup", _onDragEnd);
    };
    // Start to Drag
    var _onDragStart = function(event) {
        var event = event || window.event;
        GENERIC.stopPropagation(event);
        var _scroll = {x:GEOMETRY.getHorizontalScroll(), y:GEOMETRY.getVerticalScroll()};
        _initMouse = {x:event.clientX+_scroll.x, y:event.clientY+_scroll.y};
        _start = CSS.offset(_elementToDrag);
        // Alter className of the Drag Element
        CLASSNAME.replace(_elementToDrag, _elementToDrag._inactiveStatus, _elementToDrag._activeStatus);
        // Add Handlers of MouseMove and MouseUp to Document
        _addMouseHandlers();
    };
    // Dragging
    var _onDrag = function(event) {
        var event = event || window.event;
        GENERIC.stopPropagation(event);
        var left = _start.left + (event.clientX - _initMouse.x);
        var top = _start.top + (event.clientY - _initMouse.y);
        // Set the Position of the Element
        if (left < _documentBoundary.left) left = _documentBoundary.left;
		if (left + _elementToDrag.offsetWidth > _documentBoundary.right) left = _documentBoundary.right - _elementToDrag.offsetWidth;
		if (top < _documentBoundary.top) top = _documentBoundary.top;
		if (top + _elementToDrag.offsetHeight > _documentBoundary.bottom) top = _documentBoundary.bottom - _elementToDrag.offsetHeight;
		/*_elementToDrag.style.position = "absolute";
		_elementToDrag.style.left = left + "px";
		_elementToDrag.style.top = top + "px";*/
		CSS.set(_elementToDrag, {"position": "absolute", "left": left, "top": top});
        // Alter className of the Drop Element
		if (_dropElement && (left >= _dropBoundary.left && (left+_elementToDrag.offsetWidth) <= _dropBoundary.right && top >= _dropBoundary.top && (top+_elementToDrag.offsetHeight) <= _dropBoundary.bottom)) {
			CLASSNAME.replace(_dropElement, _dropElement._inactiveStatus, _dropElement._activeStatus);
		} else {
			CLASSNAME.replace(_dropElement, _dropElement._activeStatus, _dropElement._inactiveStatus);
		}
    };
    // Stop Dragging
    var _onDragEnd = function(event) {
        var event = event || window.event;
        GENERIC.stopPropagation(event);
        var left = _start.left + (event.clientX - _initMouse.x);
        var top = _start.top + (event.clientY - _initMouse.y);
        // Set the Position of the Element
		if (left < _documentBoundary.left) left = _documentBoundary.left;
		if (left + _elementToDrag.offsetWidth > _documentBoundary.right) left = _documentBoundary.right - _elementToDrag.offsetWidth;
		if (top < _documentBoundary.top) top = _documentBoundary.top;
		if (top + _elementToDrag.offsetHeight > _documentBoundary.bottom) top = _documentBoundary.bottom - _elementToDrag.offsetHeight;
		if (_dropElement && (left >= _dropBoundary.left && (left+_elementToDrag.offsetWidth) <= _dropBoundary.right && top >= _dropBoundary.top && (top+_elementToDrag.offsetHeight) <= _dropBoundary.bottom)) {
			/*_elementToDrag.style.position = "absolute";
			_elementToDrag.style.left = _dropBoundary.left + (_dropElement.offsetWidth - _elementToDrag.offsetWidth) / 2 + "px";
			_elementToDrag.style.top = _dropBoundary.top + (_dropElement.offsetHeight - _elementToDrag.offsetHeight) / 2 + "px";*/
			CSS.set(_elementToDrag, {"position": "absolute", "left": _dropBoundary.left + (_dropElement.offsetWidth - _elementToDrag.offsetWidth) / 2, "top": _dropBoundary.top + (_dropElement.offsetHeight - _elementToDrag.offsetHeight) / 2});
		} else {
			/*_elementToDrag.style.position = "absolute";
			_elementToDrag.style.left = _startX + "px";
			_elementToDrag.style.top =  _startY + "px";*/
			CSS.set(_elementToDrag, {"position": "absolute", "left": _start.left, "top": _start.top});
		}
        // Alter className of the Drag and Drop Elements
		CLASSNAME.replace(_elementToDrag, _elementToDrag._activeStatus, _elementToDrag._inactiveStatus);
		CLASSNAME.replace(_dropElement, _dropElement._activeStatus, _dropElement._inactiveStatus);
        // Add Handlers of MouseMove and MouseUp to Document
        _removeMouseHandlers();
    };
    (function(){
        _initialize();
    })();
};

