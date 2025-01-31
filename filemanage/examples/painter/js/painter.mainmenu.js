/*
友邁科技Olemap
Date: April 7, 2011
Author: Vivian
*/

var MAINMENU;
if (MAINMENU && (typeof MAINMENU != 'object' ))
    throw new Error("Namespace 'MAINMENU' already exists");
if (typeof UM == 'undefined')
    throw new Error("you need include UM first!");

MAINMENU = function(){
    var OPTIONS = {
        mainButtonIdSuffix: 'ButtonAnchor',
        submenuIdSuffix: 'SubmenuDiv',
        mainOverStatusCssClass: 'over-status',
        subOverStatusCssClass: 'over-status',
        submenuBgCssClass: 'submenu-background',
        timeout: 100
    };
    var ID = {
        mainmenu: 'mainMenuUL',
        newMap: 'newMapFn',
        openMap: 'openMapFn',
        saveMap: 'saveMapFn',
        printMap: 'printMapFn',
        undo: 'undoFn',
        redo: 'redoFn',
        cut: 'cutFn',
        copy: 'copyFn',
        paste: 'pasteFn',
        newLayer: 'newLayerFn',
        duplicateLayer: 'duplicateLayerFn',
        deleteLayer: 'deleteLayerFn',
        newGroup: 'newGroupFn',
        duplicateGroup: 'duplicateGroupFn',
        deleteGroup: 'deleteGroupFn',
        historyPanel: 'historyPanelFn',
        layerPanel: 'layerPanelFn'
    };
    var TIMER = null;
    var BROWSER = {
        firefox: $.browser.mozilla ? true : false,
        ie8: ($.browser.msie && $.browser.version.substr(0, 1) == '8') ? true : false
    };
    var init = {
        menu: function(){
            $('a', $('#'+ID.mainmenu)).each(function(){
                var id = $(this).attr('id');
                if (id) {
                    var $menuAnchor = $(this);
                    var name = id.split(OPTIONS.mainButtonIdSuffix)[0];
                    var $submenu = $('#'+name+OPTIONS.submenuIdSuffix);
                    $menuAnchor.data('name', name)
                               .bind('mouseout', function(){
                                    resetMainMenu();
                                    closeTimer($(this));
                               })
                               .bind('mouseover', function(){
                                    resetMainMenu();
                                    $(this).addClass(OPTIONS.mainOverStatusCssClass);
                                    show($(this));
                               });
                    if (BROWSER.firefox || BROWSER.ie8)
                        $('.'+OPTIONS.submenuBgCssClass, $submenu).css({'position': 'absolute', 'left': 0, 'top': 0});
                    $submenu.data('name', name)
                            .data('menuAnchor', $menuAnchor)
                            .bind('mouseout', function(){
                                resetMainMenu();
                                closeTimer($(this));
                            })
                            .bind('mouseover', function(){
                                resetMainMenu();
                                $(this).data('menuAnchor').addClass(OPTIONS.mainOverStatusCssClass);
                                cancelTimer($(this));
                            });
                }
            });
        },
        bindEvents: function(){
            $('#'+ID.newMap).bind({
                mouseover: onMouseOver,
                mouseout: onMouseOut,
                click: function(){
                    resetSubMenu($(this).parent());
                    closeTimer($(this).parent().parent());
                    UM.newMapPanel.show();
                }
            });
            $('#'+ID.openMap).bind({
                mouseover: onMouseOver,
                mouseout: onMouseOut,
                click: function(){
                    resetSubMenu($(this).parent());
                }
            });
            $('#'+ID.saveMap).bind({
                mouseover: onMouseOver,
                mouseout: onMouseOut,
                click: function(){
                    resetSubMenu($(this).parent());
                }
            });
            $('#'+ID.printMap).bind({
                mouseover: onMouseOver,
                mouseout: onMouseOut,
                click: function(){
                    resetSubMenu($(this).parent());
                    closeTimer($(this).parent().parent());
                    window.print();
                }
            });
            $('#'+ID.printMap).bind({
                mouseover: onMouseOver,
                mouseout: onMouseOut,
                click: function(){
                    resetSubMenu($(this).parent());
                }
            });
            $('#'+ID.undo).bind({
                mouseover: onMouseOver,
                mouseout: onMouseOut,
                click: function(){
                    resetSubMenu($(this).parent());
                }
            });
            $('#'+ID.redo).bind({
                mouseover: onMouseOver,
                mouseout: onMouseOut,
                click: function(){
                    resetSubMenu($(this).parent());
                }
            });
            $('#'+ID.cut).bind({
                mouseover: onMouseOver,
                mouseout: onMouseOut,
                click: function(){
                    resetSubMenu($(this).parent());
                }
            });
            $('#'+ID.copy).bind({
                mouseover: onMouseOver,
                mouseout: onMouseOut,
                click: function(){
                    resetSubMenu($(this).parent());
                }
            });
            $('#'+ID.paste).bind({
                mouseover: onMouseOver,
                mouseout: onMouseOut,
                click: function(){
                    resetSubMenu($(this).parent());
                }
            });
            $('#'+ID.newLayer).bind({
                mouseover: onMouseOver,
                mouseout: onMouseOut,
                click: function(){
                    resetSubMenu($(this).parent());
                    UM.layerPanel.addLayer();
                }
            });
            $('#'+ID.duplicateLayer).bind({
                mouseover: onMouseOver,
                mouseout: onMouseOut,
                click: function(){
                    resetSubMenu($(this).parent());
                }
            });
            $('#'+ID.deleteLayer).bind({
                mouseover: onMouseOver,
                mouseout: onMouseOut,
                click: function(){
                    resetSubMenu($(this).parent());
                    closeTimer($(this).parent().parent());
                    UM.layerPanel.deleteGroupOrLayer('layer');
                }
            });
            $('#'+ID.newGroup).bind({
                mouseover: onMouseOver,
                mouseout: onMouseOut,
                click: function(){
                    resetSubMenu($(this).parent());
                    UM.layerPanel.addGroup();
                }
            });
            $('#'+ID.duplicateGroup).bind({
                mouseover: onMouseOver,
                mouseout: onMouseOut,
                click: function(){
                    resetSubMenu($(this).parent());
                }
            });
            $('#'+ID.deleteGroup).bind({
                mouseover: onMouseOver,
                mouseout: onMouseOut,
                click: function(){
                    resetSubMenu($(this).parent());
                    closeTimer($(this).parent().parent());
                    UM.layerPanel.deleteGroupOrLayer('group');
                }
            });
            $('#'+ID.historyPanel).bind({
                mouseover: onMouseOver,
                mouseout: onMouseOut,
                click: function(){
                    resetSubMenu($(this).parent());
                    UM.historyPanel.show();
                }
            });
            $('#'+ID.layerPanel).bind({
                mouseover: onMouseOver,
                mouseout: onMouseOut,
                click: function(){
                    resetSubMenu($(this).parent());
                    UM.layerPanel.show();
                }
            });
        }
    };
    var resetMainMenu = function(){
        $('a', $('#'+ID.mainmenu)).each(function(){
            if ($(this).hasClass(OPTIONS.mainOverStatusCssClass))
                $(this).removeClass(OPTIONS.mainOverStatusCssClass);
        });
    };
    var resetSubMenu = function($submenu){
        $('.list', $submenu).each(function(){
            if ($(this).hasClass(OPTIONS.subOverStatusCssClass))
                $(this).removeClass(OPTIONS.subOverStatusCssClass);
        });
    };
    var onMouseOver = function(){
        resetSubMenu($(this).parent());
        $(this).addClass(OPTIONS.subOverStatusCssClass);
    };
    var onMouseOut = function(){
        resetSubMenu($(this).parent());
    };
    var show = function($el){
        var $submenu = $('#'+$el.data('name')+OPTIONS.submenuIdSuffix);
        $submenu.show();
    };
    var hide = function($el){
        var $submenu = $('#'+$el.data('name')+OPTIONS.submenuIdSuffix);
        $submenu.hide();
    };
    var closeTimer = function($el){
        TIMER = setTimeout(function(){
            hide($el);}, OPTIONS.timeout);
    };
    var cancelTimer = function($el){
        if (TIMER)
			clearTimeout(TIMER);
    };
    (function(){
        for (var i in init) {
            if ($.isFunction(init[i]))
                init[i]();
        }
    })();
};
UM.extend({
	mainMenu: new MAINMENU()
});