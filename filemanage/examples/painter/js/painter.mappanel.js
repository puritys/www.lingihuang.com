/*
友邁科技Olemap
Date: April 6, 2011
Author: Vivian
*/

var MAPPANEL;
if (MAPPANEL && (typeof MAPPANEL != 'object' ))
    throw new Error("Namespace 'MAPPANEL' already exists");
if (typeof UM == 'undefined')
    throw new Error("you need include UM first!");

MAPPANEL = function(){
    var self = this;
    var DATE = new Date();
    var ID = {
        bodyContent: 'bodyContentDiv',
        mapPanel: 'mapPanelDiv'
    };
    var CLASSNAME = {
        closeBtn: 'close-button',
        inputClosePos: 'input-close-pos',
        bodyLeft: 'body-left',
        bodyRight: 'body-right',
        bodyCenter: 'body-center',
        mapContainer: 'map-container',
        mapHeading: 'panel-heading',
        mapHeadingInput: 'input-text'
    };
    var $mapPanel;
    var _MAP, _DRAW;
    var bindEvents = function(){
        var $mapHeading = $('.'+CLASSNAME.mapHeading, $mapPanel);
        var $mapHeadingInput = $('.'+CLASSNAME.mapHeadingInput, $mapPanel);
        var $closeButton = $('.'+CLASSNAME.closeBtn, $mapPanel);
        var onFocusOut = function(){
            if ($closeButton.hasClass(CLASSNAME.inputClosePos))
                $closeButton.removeClass(CLASSNAME.inputClosePos);
            $mapHeading.html($mapHeadingInput.val());
            $mapHeadingInput.hide();
            $mapHeading.show();
        };
        $mapHeading.bind('dblclick', function(){
            if (!$closeButton.hasClass(CLASSNAME.inputClosePos))
                    $closeButton.addClass(CLASSNAME.inputClosePos);
            $mapHeadingInput.val($(this).html());
            $(this).hide();
            $mapHeadingInput.show();
        });
        $mapHeadingInput.bind({
            focusin: function(){
                
            },
            focusout: onFocusOut,
            keyup: function(ev){
                if (ev.keyCode == 13) {
                    onFocusOut();
                }
            }
        });
        $closeButton.bind('click', function(){
            if (!UM.URES.isSaved) {
                var message = '在關閉前，是否要儲存「'+ $mapHeading.html() + '」？';
                var heading = '<h2 class="alert-heading">UrPainter</h2>';
                alert(message, heading, {
                    onHide: function(){
                        UM.URES.isSaved = true;
                        $mapPanel.remove();
                    }
                });
            }
        });
    };
    var resizeMap = function(){
        _MAP.checkResize();
        _MAP.refreshMap();
    };
    var _show = function(name, size){
        if (!name || !size)
            return;
        if (UM.URES.isSaved) {
            UM.URES.isSaved = false;
            var html = UITemplates.mapPanelUITemplate({
                mapPanelId: ID.mapPanel + new Date().getTime(),
                title: name
            });
            $mapPanel = $(html);
            $mapPanel.appendTo($('#'+ID.bodyContent));
            var $mapContainer = $('.'+CLASSNAME.mapContainer, $mapPanel);
            var mapPanelBox = UM.URES.mapPanelBox;
            $mapPanel.width(size.width + mapPanelBox.left + mapPanelBox.right);
            $('.'+CLASSNAME.bodyLeft, $mapPanel).height(size.height);
            $('.'+CLASSNAME.bodyRight, $mapPanel).height(size.height);
            $('.'+CLASSNAME.bodyCenter, $mapPanel).height(size.height);
            $('.'+CLASSNAME.mapHeading, $mapPanel).width(size.width - 20);
            $('.'+CLASSNAME.mapHeadingInput, $mapPanel).width(size.width - 20);
            $mapContainer.css({'width': size.width, 'height': size.height});
            _MAP = new UMap($mapContainer.get(0));
            self.map = _MAP;
            _DRAW = new UDraw(_MAP);
            self.draw = _DRAW;
            _MAP.addControl(U_FULLZOOM_CONTROL);
            _MAP.addControl(U_TYPE_CONTROL);
            _MAP.addControl(U_SCALE_CONTROL);
            _MAP.enableWheelZoom();
            var defaultLatLng = UM.URES.defaults.latlng;
            var defaultLatlng = new ULatLng(defaultLatLng.lat, defaultLatLng.lng);
            _MAP.centerAndZoom(defaultLatlng, UM.URES.defaults.zoomlevel);
            bindEvents();
        }
    };
    this.show = _show;
};
UM.extend({
	mapPanel: new MAPPANEL()
});
UM.addInit(function(){
    
});