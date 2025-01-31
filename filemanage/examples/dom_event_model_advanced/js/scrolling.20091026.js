/********************************************************************************************************
Scrolling

Related Posts =>
Mousewheel Programming In Javascript
- http://adomas.org/javascript-mouse-wheel/
MouseWheel on Mac
- http://www.unfocus.com/2009/04/17/mousewheel-on-mac/
jsScrolling
- http://www.n-son.com/scripts/jsScrolling/
********************************************************************************************************/
var SCROLLER = function(_options) {
    var _self = this;
    var _scrollerElement, _elementToScroll, _classnameToScroll = "container";
    var _viewableWidth = 0, _viewableHeight = 0, _totalWidth = 0, _totalHeight = 0;
    var _initialize = function() {
        if (!_options) return;
        _scrollerElement = (typeof _options.element == "string") ? document.getElementById(_options.element) : _options.element;
        if (_options.classnameToScroll) _classnameToScroll = _options.classnameToScroll;
        _elementToScroll = ELEMENT.find(_classnameToScroll, _scrollerElement);
        if (_options.viewableWidth) _viewableWidth = _options.viewableWidth;
        if (_options.viewableHeight) _viewableHeight = _options.viewableHeight;
        _totalWidth = _elementToScroll.offsetWidth;
        _totalHeight = _elementToScroll.offsetHeight;
    };
    var _onScrollX = function(x, y) {
        if (x < _viewableWidth - _totalWidth)
            x = _viewableWidth - _totalWidth;
        if (x > 0)
            x = 0;
        _elementToScroll.style.left = x + "px";
    };
    var _onScrollY = function(x, y) {
        if (y < _viewableHeight - _totalHeight)
            y = _viewableHeight - _totalHeight;
        if (y > 0)
            y = 0;
        _elementToScroll.style.top = y + "px";
    };
    (function(){
        _initialize();
    })();
    this.elementToScroll = _elementToScroll;
    this.viewableWidth = _viewableWidth;
    this.viewableHeight = _viewableHeight;
    this.totalWidth = _totalWidth;
    this.totalHeight = _totalHeight;
    this.onScrollX = _onScrollX;
    this.onScrollY = _onScrollY;
};
var SCROLLBAR = function(_options, _scroller) {
    var _self = this;
    var _yScrollbarElement, _yTrackElement, _yHandlerElement, _yUpElement, _yDownElement, _yHandlerBoundary;
    var _xScrollbarElement, _xTrackElement, _xHandlerElement, _xLeftElement, _xRightElement, _xHandlerBoundary;
    var _yTrackerSize, _yHandlerSize, _yHandlerPos, _yTimer, _xTrackerSize, _xHandlerSize, _xHandlerPos, _xTimer;
    var _yDist = _xDist = 10;
    var _delay = 40;
    var _yRatio, _xRatio;
    var _className = {
        _yUp: "y-up",
        _yDown: "y-down",
        _yTrack: "y-track",
        _yHandler: "y-handler",
        _xLeft: "x-left",
        _xRight: "x-right",
        _xTrack: "x-track",
        _xHandler: "x-handler"
    };
    var _initialize = function() {
        if (!_options) return;
        for (var key in _options) {
            if (key == "y") {
                _vertical._initialize(_options[key]);
            } else if (key == "x") {
                _horizontal._initialize(_options[key]);
            }    
        }
    };
    var _vertical = {
        _initialize: function(element) {
            _yScrollbarElement = (typeof element == "string") ? document.getElementById(element) : element;
            _yUpElement = ELEMENT.find(_className._yUp, _yScrollbarElement);
            _yDownElement = ELEMENT.find(_className._yDown, _yScrollbarElement);
            _yTrackElement = ELEMENT.find(_className._yTrack, _yScrollbarElement);
            _yTrackSize = {width:_yTrackElement.offsetWidth, height:_yTrackElement.offsetHeight};
            _yHandlerElement = ELEMENT.find(_className._yHandler, _yTrackElement);
            ELEMENT.disableSelection(_yHandlerElement);
            _yHandlerSize = {width:_yHandlerElement.offsetWidth, height:_yHandlerElement.offsetHeight};
            var offset = CSS.offset(_yTrackElement);
            _yHandlerPos = {x:offset.left, y:offset.top};
            var left = parseInt(_yScrollbarElement.style.left, 10) || 0;
            var right = left + _yTrackElement.offsetWidth;
            var top = parseInt(_yScrollbarElement.style.top, 10) || 0;
            var bottom = top + _yTrackElement.offsetHeight;
            _yHandlerBoundary = {left: left, right: right, top: top, bottom: bottom};
            //GENERIC.removeEvent(_yUpElement, "mousedown", _vertical._onScrollUp);
            GENERIC.addEvent(_yUpElement, "mousedown", _vertical._onScrollUp);
            GENERIC.addEvent(_yUpElement, "mouseup", _vertical._onScrollEnd);
            //GENERIC.removeEvent(_yDownElement, "mousedown", _vertical._onScrollDown);
            GENERIC.addEvent(_yDownElement, "mousedown", _vertical._onScrollDown);
            GENERIC.addEvent(_yDownElement, "mouseup", _vertical._onScrollEnd);
            //GENERIC.removeEvent(_yTrackElement, "mousedown", _vertical._onScrollTrack);
            GENERIC.addEvent(_yTrackElement, "mousedown", _vertical._onScrollTrack);
            //GENERIC.removeEvent(_yHandlerElement, "mousedown", _vertical._onDragStart);
            GENERIC.addEvent(_yHandlerElement, "mousedown", _vertical._onDragStart);
            if (_scroller) {
                GENERIC.addEvent(_scroller.elementToScroll, "mousewheel", _vertical._onScrollWheel);
                _yRatio = (_scroller.totalHeight - _scroller.viewableHeight) / (_yTrackSize.height - _yHandlerSize.height);
            }
        },
        _onScrollUp: function(event) {
            _vertical._onScrollStart(0, -_yDist);
        },
        _onScrollDown: function(event) {
            _vertical._onScrollStart(0, _yDist);
        },
        _onScrollTrack: function(event) {
            var event = event || window.event;
            _vertical._onScroll(0, event.clientY + document.body.scrollTop - _yHandlerPos.y - _yHandlerSize.height/2);
        },
        _onScrollStart: function(xDist, yDist) {
            var x = xDist;
            var yDist = yDist;
            _vertical._onScrollEnd();
            _yTimer = window.setInterval(function(){
                var y = (parseInt(_yHandlerElement.style.top, 10) || 0) + yDist;
                _vertical._onScroll(x, y);
            }, _delay);
        },
        _onScrollEnd: function() {
            if (_yTimer)
                window.clearInterval(_yTimer);
        },
        _onScrollWheel: function(event) {
            var event = event || window.event;
            var delta = 0;
            if (event.wheelDelta) // For IE
                delta = -event.wheelDelta / 120;
            else if (event.detail) // For Firefox
                delta = event.detail / 3;
            _vertical._onScroll(0, (parseInt(_yHandlerElement.style.top, 10) || 0) + delta * 10);
            GENERIC.cancelDefault(event);
        },
        _onDragStart: function(event) {
            var event = event || window.event;
            GENERIC.stopPropagation(event);
            _yHandlerElement._start = {x:parseInt(_yHandlerElement.style.left, 10) || 0, y:parseInt(_yHandlerElement.style.top, 10) || 0};
            _yHandlerElement._initMouse = {x:event.clientX, y:event.clientY};
            GENERIC.addEvent(document, "mousemove", _vertical._onDrag);
            GENERIC.addEvent(document, "mouseup", _vertical._onDragEnd);
        },
        _onDrag: function(event) {
            var event = event || window.event;
            var y = _yHandlerElement._start.y + (event.clientY - _yHandlerElement._initMouse.y);
            _vertical._onScroll(0, y);
        },
        _onDragEnd: function(event) {
            var event = event || window.event;
            var y = _yHandlerElement._start.y + (event.clientY - _yHandlerElement._initMouse.y);
            _vertical._onScroll(0, y);
            GENERIC.removeEvent(document, "mousemove", _vertical._onDrag);
            GENERIC.removeEvent(document, "mouseup", _vertical._onDragEnd);
        },
        _onScroll: function(x, y) {
            if (y < _yHandlerBoundary.top)
                y = _yHandlerBoundary.top;
            if (y > _yHandlerBoundary.bottom - _yHandlerSize.height)
                y = _yHandlerBoundary.bottom - _yHandlerSize.height;
            _yHandlerElement.style.top = y + "px";
            if (_scroller)
                _scroller.onScrollY(0, -Math.round(y*_yRatio));
        }
    };
    var _horizontal = {
        _initialize: function(element) {
            _xScrollbarElement = (typeof element == "string") ? document.getElementById(element) : element;
            _xLeftElement = ELEMENT.find(_className._xLeft, _xScrollbarElement);
            _xRightElement = ELEMENT.find(_className._xRight, _xScrollbarElement);
            _xTrackElement = ELEMENT.find(_className._xTrack, _xScrollbarElement);
            _xTrackSize = {width:_xTrackElement.offsetWidth, height:_xTrackElement.offsetHeight};
            _xHandlerElement = ELEMENT.find(_className._xHandler, _xTrackElement);
            ELEMENT.disableSelection(_xHandlerElement);
            _xHandlerSize = {width:_xHandlerElement.offsetWidth, height:_xHandlerElement.offsetHeight};
            var offset = CSS.offset(_xTrackElement);
            _xHandlerPos = {x:offset.left, y:offset.top};
            var left = parseInt(_xHandlerElement.style.left, 10) || 0;
            var right = left + _xTrackElement.offsetWidth;
            var top = parseInt(_xHandlerElement.style.top, 10) || 0;
            var bottom = top + _xTrackElement.offsetHeight;
            _xHandlerBoundary = {left: left, right: right, top: top, bottom: bottom};
            //GENERIC.removeEvent(_xLeftElement, "mousedown", _horizontal._onScrollLeft);
            GENERIC.addEvent(_xLeftElement, "mousedown", _horizontal._onScrollLeft);
            GENERIC.addEvent(_xLeftElement, "mouseup", _horizontal._onScrollEnd);
            //GENERIC.removeEvent(_xRightElement, "mousedown", _horizontal._onScrollRight);
            GENERIC.addEvent(_xRightElement, "mousedown", _horizontal._onScrollRight);
            GENERIC.addEvent(_xRightElement, "mouseup", _horizontal._onScrollEnd);
            //GENERIC.removeEvent(_xTrackElement, "mousedown", _horizontal._onScrollTrack);
            GENERIC.addEvent(_xTrackElement, "mousedown", _horizontal._onScrollTrack);
            //GENERIC.removeEvent(_xHandlerElement, "mousedown", _horizontal._onDragStart);
            GENERIC.addEvent(_xHandlerElement, "mousedown", _horizontal._onDragStart);
            if (_scroller)
                _xRatio = (_scroller.totalWidth - _scroller.viewableWidth) / (_xTrackSize.width - _xHandlerSize.width);
        },
        _onScrollLeft: function(event) {
            _horizontal._onScrollStart(-_xDist, 0);
        },
        _onScrollRight: function(event) {
            _horizontal._onScrollStart(_xDist, 0);
        },
        _onScrollTrack: function(event) {
            var event = event || window.event;
            _horizontal._onScroll(event.clientX - _xHandlerPos.x - _xHandlerSize.width/2, 0);
        },
        _onScrollStart: function(xDist, yDist) {
            var xDist = xDist;
            var y = yDist;
            _horizontal._onScrollEnd();
            _xTimer = window.setInterval(function(){
                var x = (parseInt(_xHandlerElement.style.left, 10) || 0) + xDist;
                _horizontal._onScroll(x, y);
            }, _delay);
        },
        _onScrollEnd: function() {
            if (_xTimer)
                window.clearInterval(_xTimer);
        },
        _onDragStart: function(event) {
            var event = event || window.event;
            GENERIC.stopPropagation(event);
            _xHandlerElement._start = {x:parseInt(_xHandlerElement.style.left, 10) || 0, y:parseInt(_xHandlerElement.style.top, 10) || 0};
            _xHandlerElement._initMouse = {x:event.clientX, y:event.clientY};
            GENERIC.addEvent(document, "mousemove", _horizontal._onDrag);
            GENERIC.addEvent(document, "mouseup", _horizontal._onDragEnd);
        },
        _onDrag: function(event) {
            var event = event || window.event;
            var x = _xHandlerElement._start.x + (event.clientX - _xHandlerElement._initMouse.x);
            _horizontal._onScroll(x, 0);
        },
        _onDragEnd: function(event) {
            var event = event || window.event;
            var x = _xHandlerElement._start.x + (event.clientX - _xHandlerElement._initMouse.x);
            _horizontal._onScroll(x, 0);
            GENERIC.removeEvent(document, "mousemove", _horizontal._onDrag);
            GENERIC.removeEvent(document, "mouseup", _horizontal._onDragEnd);
        },
        _onScroll: function(x, y) {
            if (x < _xHandlerBoundary.left)
                x = _xHandlerBoundary.left;
            if (x > _xHandlerBoundary.right - _xHandlerSize.width)
                x = _xHandlerBoundary.right - _xHandlerSize.width;
            _xHandlerElement.style.left = x + "px";
            if (_scroller)
                _scroller.onScrollX(-Math.round(x*_xRatio), 0);
        }
    };
    (function(){
        _initialize();
    })();
};
var SCROLLING = function(_options) {
    var _self = this;
    var _scroller, _scrollbar, _yRatio, _xRatio;
    var _initialize = function() {
        if (!_options) return;
        if (!_scroller && _options.scroller)
            _scroller = new SCROLLER(_options.scroller);
        if (!_scrollbar && _options.scrollbar)
            _scrollbar = new SCROLLBAR(_options.scrollbar, _scroller);
    };
    (function(){
        _initialize();
    })();
};

