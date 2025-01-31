/********************************************************************************************************
ContextMenu

Related Posts =>
jQuery Context Menu Plugin
- http://abeautifulsite.net/notebook/80

Javascript Context Menu
- http://www.webtoolkit.info/javascript-context-menu.html
********************************************************************************************************/
var CONTEXTMENU = function(_menuElement, _boundaryElement) {
    var _SELF = this;
    var _menuElement = (typeof _menuElement == "string") ? document.getElementById(_menuElement) : _menuElement;
    var _boundaryElement = (typeof _boundaryElement == "string") ? document.getElementById(_boundaryElement) : _boundaryElement;
    var _initialize = function() {
        if (!_menuElement) return;
        GENERIC.addEvent(document, "contextmenu", _onMousedownHandler);
        GENERIC.addEvent(document, "keydown", _onKeydownHandler);
    };
    var _onMousedownHandler = function(event) {
        GENERIC.cancelDefault(event);
        _onShow(event, _addMenuHandlers);
    };
    var _onKeydownHandler = function(event) {
        if (event.keyCode == 27)
            _onHide();
    };
    var _onShow = function(event, callback) {
        if (_boundaryElement) {
            var offset = CSS.offset(_boundaryElement);
            var left = offset.left;
            var top = offset.top;
            var right = left + CSS.outerWidth(_boundaryElement);
            var bottom = top + CSS.outerHeight(_boundaryElement);
            if ((event.clientX >= left && event.clientX <= right) && (event.clientY >= top && event.clientY <= bottom)) {
                _menuElement.style.display = "block";
                _menuElement.style.left = event.clientX + "px";
                _menuElement.style.top = event.clientY + "px";
            }
        } else {
            _menuElement.style.display = "block";
            _menuElement.style.left = event.clientX + "px";
            _menuElement.style.top = event.clientY + "px";
        }
        if (callback) callback();
    };
    var _onHide = function() {
        _menuElement.style.display = "none";
        _removeMenuHandlers();
    };
    var _onExitHandler = function() {
        _onHide();
        return false;
    };
    var _addMenuHandlers = function() {
        var anchors = _menuElement.getElementsByTagName("a");
        var len = anchors.length;
        for (var i=0; i<len; i++) {
            var data = anchors[i].getAttribute("data");
            if (data) {
                switch(data) {
                    case "exit":
                        GENERIC.addEvent(anchors[i], "click", _onExitHandler);
                    default:
                        //
                }
            }
        }
    };
    var _removeMenuHandlers = function() {
        var anchors = _menuElement.getElementsByTagName("a");
        var len = anchors.length;
        for (var i=0; i<len; i++) {
            var data = anchors[i].getAttribute("data");
            if (data) {
                switch(data) {
                    case "exit":
                        GENERIC.removeEvent(anchors[i], "click", _onExitHandler);
                    default:
                        //
                }
            }
        }
    };
    (function(){
        _initialize();
    })();
};

