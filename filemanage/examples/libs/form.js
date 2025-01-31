var FORM = function() {
    var _VALIDATION = {
        emailFormat: function(value) {
            var emailReg = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
            return emailReg.test(value);
        }
    };
};


/********************************************************************************************************
CheckBox

Arguments
checkboxListElement: the check box.

Methods
onToggle()
- Get the check box checked or unchecked.

get()
- Get the value of the check box.
********************************************************************************************************/
var CHECKBOX = function(_checkboxListElement) {
    var _self = this;
    var _checkboxListElement = (typeof _checkboxListElement === "string") ? document.getElementById(_checkboxListElement) : _checkboxListElement;
    var _initialize = function() {
        if (!_checkboxListElement) {
            return;
        }
        var children = _checkboxListElement.getElementsByTagName("LI");
        for (var node=0; node<children.length; node++) {
            var checkboxElement = children[node].getElementsByTagName("span")[0];
            checkboxElement.onStatus = "checkbox-on-status";
            checkboxElement.offStatus = "checkbox-off-status";
            if (!checkboxElement.getAttribute("checked")) {
                checkboxElement.setAttribute("checked", "false");
            }
            if (!checkboxElement.getAttribute("value")) {
                checkboxElement.setAttribute("value", "");
            }
            GENERIC.addEvent(checkboxElement, "click", _onToggle);
        }
    };
    var _onToggle = function() {
        if (this.className.search(this.onStatus) > 0) {
            CLASSNAME.replace(this, this.onStatus, this.offStatus);
            this.setAttribute("checked", "false");
        } else if (this.className.search(this.offStatus) > 0) {
            CLASSNAME.replace(this, this.offStatus, this.onStatus);
            this.setAttribute("checked", "true");
        }
    };
    var _get = function() {
        var value = "";
        var children = _checkboxListElement.getElementsByTagName("LI");
        for (var node=0; node<children.length; node++) {
            var checkboxElement = children[node].getElementsByTagName("span")[0];
            if (checkboxElement.getAttribute("checked") === "true") {
                value = checkboxElement.getAttribute("value");
            }
        }
        return value;
    };
    this.get = _get;
    (function(){
        _initialize();
    })();
};
/*******************************************************************************************************/



/********************************************************************************************************
Select List

Related Posts =>
The DOM Event Model
- http://www.brainjar.com/dhtml/events/default6.asp

Arguments
selectElement: the select box.

Methods
onToggle()
- Show or hide the dropdown menu.

show()
- The action of showing the dropdown menu.

hide()
- The action of hiding the dropdown menu.

onClose()
- Hide the dropdown menu when the mouse leaves the dropdown menu.

onClickHandler()
- The event object for the click event.
- Set the value of headTextNode as the option selected.
- Hide the dropdown menu.

onKeydownHandler()
- The event object for the keydown event.
- Hide the dropdown menu.
********************************************************************************************************/
var SELECTLIST = function(_selectElement) {
    var _self = this;
    var _selectElement = _selectElement, _headTextNode, _arrowDownElement, _listElement;
    var _initialize = function() {
        if (!_selectElement) {
            return;
        }
        if (typeof _selectElement === "string") {
            _selectElement = document.getElementById(_selectElement);
        }
        var children = _selectElement.childNodes;
        var dtElement;
        for (var node=0; node<children.length; node++) {
            if (children[node].nodeName.toLowerCase() === "span") {
                _arrowDownElement = children[node];
                GENERIC.addEvent(_arrowDownElement, "click", _onToggle);
            }
            if (children[node].nodeName.toLowerCase() === "dt") {
                dtElement = children[node];
                _headTextNode = children[node].childNodes[0];
            }
            if (children[node].nodeName.toLowerCase() === "dd") {
                _listElement = children[node];
                GENERIC.addEvent(_listElement, "mouseout", _onClose);
                _listElement.style.display = "none";
                _listElement.style.position = "absolute";
                _listElement.style.left = "0px";
                _listElement.style.top = dtElement.offsetHeight + "px";
                _listElement.style.zIndex = "10";
                var options = children[node].getElementsByTagName("a");
                for (var o=0; o<options.length; o++) {
                    GENERIC.addEvent(options[o], "click", _onClickHandler);
                }
            }
        }
        GENERIC.addEvent(document, "keydown", _onKeydownHandler);
    };
    var _onToggle = function() {
        if (_listElement.style.display === "none") {
            _onShow();
        } else if (_listElement.style.display == "block") {
            _onHide();
        }
        return false;
    };
    var _onShow = function() {
        _listElement.style.display = "block";
    };
    var _onHide = function() {
        _listElement.style.display = "none";
    };
    var _onClose = function(event) {
        var event = event || window.event;
        // currentTarget refers to the element at which the event is currently being processed.
        //var currentTarget = (window.event) ? this : event.currentTarget;
        var currentTarget = GENERIC.findCurrentTarget(event, this);
        // relatedTarget refers to the element that is related to the target node of the event.
        //var relatedTarget = (window.event) ? event.toElement : event.relatedTarget;
        var relatedTarget = GENERIC.findRelatedTarget(event);
        // Element.contains determins if one element is nested inside another.
        if (currentTarget != relatedTarget && !ELEMENT.contains(currentTarget, relatedTarget)) {
            _onHide();
        }
    };
    var _onClickHandler = function() {
        _headTextNode.innerHTML = this.innerHTML;
        _onHide();
        return false;
    };
    var _onKeydownHandler = function(event) {
        if (event.keyCode == 27) {
            _onHide();
        }
    };
    (function(){
        _initialize();
    })();
};
/*******************************************************************************************************/
