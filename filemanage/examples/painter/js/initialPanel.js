// This file was automatically generated from initialPanelUITemplate.soy.
// Please don't edit this file by hand.

if (typeof UITemplates == 'undefined') { var UITemplates = {}; }


UITemplates.initialPanelUITemplate = function(opt_data, opt_sb) {
  var output = opt_sb || new soy.StringBuilder();
  output.append('<div class="top-header">UrMapPainter</div><ul class="main-menu"><li><div class="icon-col new-map-icon"></div><div class="title-col">建立新地圖</div><div class="clear-float"></div></li><li><div class="icon-col open-map-icon"></div><div class="title-col">開啟地圖路徑</div><div class="clear-float"></div></li><li><div class="icon-col gallery-icon"></div><div class="title-col">開啟圖庫</div><div class="clear-float"></div></li></ul>');
  if (!opt_sb) return output.toString();
};



/*
友邁科技Olemap
Date: March 30, 2011
Author: Vivian
*/

var INITIALPANEL;
if (INITIALPANEL && (typeof INITIALPANEL != 'object' ))
    throw new Error("Namespace 'INITIALPANEL' already exists");
if (typeof UM == 'undefined')
    throw new Error("you need include UM first!");

INITIALPANEL = function(){
    var OPTIONS = {
        initialContainerCssClass: 'initial-container',
        mainOverStatusCssClass: 'over-status'
    };
    var ID = {
        initialContainer: 'initialContainerDiv'
    };
    var $initialPanel;
    var _init = function(){
        $initialPanel = $('<div></div>').attr('id', ID.initialContainer)
                                        .addClass(OPTIONS.initialContainerCssClass)
                                        .html(UITemplates.initialPanelUITemplate())
                                        .lightbox({
                                            theme: 'classic',
                                            overlayColor: '#000',
                                            overlayOpacity: 0.7,
                                            width: 545,
                                            height: 460,
                                            position: 20,
                                            zIndex: 100,
                                            speed: 500,
                                            isOpen: true,
                                            isDraggable: false,
                                            heading: '',
                                            onStart: function(){
                                                
                                            },
                                            onComplete: function(){
                                                
                                            }
                                        });
        bindEvents();
    };
    var bindEvents = function(){
        var $menus = $('li', $('#'+ID.initialContainer));
        $menus.eq(0).bind('mouseout', onMouseOut)
                    .bind('mouseover', onMouseOver)
                    .bind('click', function(){
                        $initialPanel.triggerClose();
                    });
        $menus.eq(1).bind('mouseout', onMouseOut)
                    .bind('mouseover', onMouseOver);
        $menus.eq(2).bind('mouseout', onMouseOut)
                    .bind('mouseover', onMouseOver);
        
    };
    var onMouseOut = function(){
        if ($(this).hasClass(OPTIONS.mainOverStatusCssClass))
            $(this).removeClass(OPTIONS.mainOverStatusCssClass);
    };
    var onMouseOver = function(){
        $(this).addClass(OPTIONS.mainOverStatusCssClass);
    };
    this.init = _init;
};
UM.extend({
	initialPanel: new INITIALPANEL()
});
UM.addInit(function(){
    //UM.initialPanel.init();
});