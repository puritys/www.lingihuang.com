/*
友邁科技Olemap
Date: April 7, 2011
Author: Vivian
*/

var TOOLPANEL;
if (TOOLPANEL && (typeof TOOLPANEL != 'object' ))
    throw new Error("Namespace 'TOOLPANEL' already exists");
if (typeof UM == 'undefined')
    throw new Error("you need include UM first!");

TOOLPANEL = function(){
    var OPTIONS = {
        toolIdSuffix: 'ToolIcon',
        toolIconCssClass: 'icon',
        toolIconCssSuffix: '-icon',
        submenuBgCssClass: 'submenu-background',
        toolSelectOffCssClass: '-off-',
        toolSelectOverCssClass: '-over-',
        toolIconOffStatus: '_off_',
        toolIconOverStatus: '_over_',
        toolIconOnStatus: '_on_'
    };
    var ID = {
        toolOptions: 'toolOptionsDiv',
        toolIcon: 'toolIconDiv',
        fillinColorSelect: 'fillinColorSelect',
        borderColorSelect: 'borderColorSelect',
        strokeSelect: 'strokeSelect',
        strokeValue: 'strokeValue',
        strokeSelectIcon: 'strokeSelectIcon',
        transparencyPicker: 'transparencyPicker',
        transparencyValue: 'transparencyValue',
        transparencySelectIcon: 'transparencySelectIcon',
        noToolOption: 'noToolOptionSpan',
        toolIcons: 'toolIconsDiv',
        moveTool: 'moveToolIcon',
        transformTool: 'transformToolIcon',
        pencilTool: 'pencilToolIcon',
        bezierTool: 'bezierToolIcon',
        selectTool: 'selectToolIcon',
        shapeTool: 'shapeToolIcon',
        polylineTool: 'polylineToolIcon',
        markerTool: 'markerToolIcon',
        textTool: 'textToolIcon',
        colorSwitcher: 'colorSwitcherDiv',
        fillInColor: 'fillInColorDiv',
        borderColor: 'borderColorDiv',
        bezierMenu: 'bezierMenuDiv',
        shapeMenu: 'shapeMenuDiv',
        strokeDropDown: 'strokeDropDownDiv',
        transparencySlider: 'transparencySliderDiv'
    };
    var CONST = {
        noToolOptions: '沒有任何選項'
    };
    var BROWSER = {
        firefox: $.browser.mozilla ? true : false,
        ie8: ($.browser.msie && $.browser.version.substr(0, 1) == '8') ? true : false
    };
    var ToolBar = {
        toolIcon: $('#'+ID.toolIcon).get(0),
        toolOptions: $('#'+ID.toolOptions),
        fillinColorSelect: $('#'+ID.fillinColorSelect),
        borderColorSelect: $('#'+ID.borderColorSelect),
        strokeSelect: $('#'+ID.strokeSelect),
        strokeValue: $('#'+ID.strokeValue),
        strokeSelectIcon: $('#'+ID.strokeSelectIcon),
        transparencyPicker: $('#'+ID.transparencyPicker),
        transparencyValue: $('#'+ID.transparencyValue),
        transparencySelectIcon: $('#'+ID.transparencySelectIcon),
        noToolOption: $('#'+ID.noToolOption),
        fillInColorPicker: [],
        borderColorPicker: [],
        strokeDropDown: $('#'+ID.strokeDropDown),
        transparencySlider: $('#'+ID.transparencySlider),
        init: function(){
            this.bindStrokeEvents();
            this.bindTransparencyEvents();
            this.bindColorEvents();
        },
        bindStrokeEvents: function(){
            var self = this;
            this.strokeSelectIcon.bind({
                mouseover: function(){
                    var classname = $(this).get(0).className;
                    if (classname.indexOf(OPTIONS.toolSelectOffCssClass) > -1)
                        $(this).get(0).className = classname.replace(OPTIONS.toolSelectOffCssClass, OPTIONS.toolSelectOverCssClass);
                },
                mouseout: function(){
                    var classname = $(this).get(0).className;
                    if (classname.indexOf(OPTIONS.toolSelectOverCssClass) > -1)
                        $(this).get(0).className = classname.replace(OPTIONS.toolSelectOverCssClass, OPTIONS.toolSelectOffCssClass);
                },
                click: function(){
                    if (self.fillInColorPicker.length)
                        self.fillInColorPicker.ColorPickerHide();
                    if (self.borderColorPicker.length)
                        self.borderColorPicker.ColorPickerHide();
                    self.transparencySlider.hide();
                    if (self.strokeDropDown.is(':hidden'))
                        self.strokeDropDown.show();
                    else
                        self.strokeDropDown.hide();
                }
            });
            $('a', self.strokeDropDown).bind('click', function(){
                self.strokeDropDown.hide();
                self.strokeValue.html($(this).html());
                return false;
            });
        },
        bindTransparencyEvents: function(){
            var self = this;
            this.transparencySelectIcon.bind({
                mouseover: function(){
                    var classname = $(this).get(0).className;
                    if (classname.indexOf(OPTIONS.toolSelectOffCssClass) > -1)
                        $(this).get(0).className = classname.replace(OPTIONS.toolSelectOffCssClass, OPTIONS.toolSelectOverCssClass);
                },
                mouseout: function(){
                    var classname = $(this).get(0).className;
                    if (classname.indexOf(OPTIONS.toolSelectOverCssClass) > -1)
                        $(this).get(0).className = classname.replace(OPTIONS.toolSelectOverCssClass, OPTIONS.toolSelectOffCssClass);
                },
                click: function(){
                    if (self.fillInColorPicker.length)
                        self.fillInColorPicker.ColorPickerHide();
                    if (self.borderColorPicker.length)
                        self.borderColorPicker.ColorPickerHide();
                    self.strokeDropDown.hide();
                    if (self.transparencySlider.is(':hidden'))
                        self.transparencySlider.show();
                    else
                        self.transparencySlider.hide();
                }
            });
            var $els = $('div div', self.transparencySlider);
            var $slideBar = $els.eq(0);
            var $slideHandle = $els.eq(1);
            var isMouseDown = false;
            var posX = 0, mouseX = 0;
            var boundary = {
                left: 0,
                right: 0,
                top: 0,
                bottom: 0
            };
            var setPosition = function(ev){
                var left = posX + (ev.pageX - mouseX);
                if (left < boundary.left)
                    left = boundary.left;
                if (left > boundary.right)
                    left = boundary.right;
                if (ev.pageY >= boundary.top && ev.pageY <= boundary.bottom) {
                    $slideHandle.css({'left': left + 'px'});
                    var total = boundary.right - boundary.left;
                    var percent = ((left - boundary.left) / total).toFixed(2) * 100;
                    self.transparencyValue.html(percent);
                }
            };
            var onMouseDown = function(ev){
                posX = $(this).position().left - $(this).width()/3;
                mouseX = ev.pageX;
                var pos = $slideBar.position();
                var sliderOffset = self.transparencySlider.offset();
                boundary = {
                    left: pos.left - $(this).width()/3,
                    right: pos.left + $slideBar.width() - $(this).width()/2 - 2,
                    top: sliderOffset.top,
                    bottom: sliderOffset.top + self.transparencySlider.height()
                };
                isMouseDown = true;
                $(document).bind('mousemove', onMouseMove);
                $(document).bind('mouseup', onMouseUp);
            };
            var onMouseMove = function(ev){
                if (isMouseDown) {
                    setPosition(ev);
                }
            };
            var onMouseUp = function(ev){
                setPosition(ev);
                $(document).unbind('mousemove', onMouseMove);
                $(document).unbind('mousemove', onMouseMove);
                isMouseDown = false;
            };
            $slideHandle.bind('mousedown', onMouseDown);
        },
        bindColorEvents: function(){
            var self = this;
            this.fillinColorSelect.bind('click', function(){
                self.reset();
                if (!self.fillInColorPicker.length) {
                    self.fillInColorPicker = $(this).ColorPicker({
                        onSubmit: function(hsb, hex, rgb, el){
                            $(el).ColorPickerHide();
                            $('div', $(el)).eq(0).css({'backgroundColor': '#'+hex});
                            ToolPanel.setFillInColor('#'+hex);
                        }
                    });
                }
                self.fillInColorPicker.ColorPickerShow();
            });
            this.borderColorSelect.bind('click', function(){
                self.reset();
                if (!self.borderColorPicker.length) {
                    self.borderColorPicker = $(this).ColorPicker({
                        onSubmit: function(hsb, hex, rgb, el){
                            $(el).ColorPickerHide();
                            $('div', $(el)).eq(0).css({'borderColor': '#'+hex});
                            ToolPanel.setBorderColor('#'+hex);
                        }
                    });
                }
                self.borderColorPicker.ColorPickerShow();
            });
        },
        reset: function(){
            if (this.fillInColorPicker.length)
                this.fillInColorPicker.ColorPickerHide();
            if (this.borderColorPicker.length)
                this.borderColorPicker.ColorPickerHide();
            this.strokeDropDown.hide();
            this.transparencySlider.hide();
        },
        hideOptions: function(){
            this.fillinColorSelect.hide();
            this.borderColorSelect.hide();
            this.strokeSelect.hide();
            this.transparencyPicker.hide();
            this.toolOptions.hide();
            this.noToolOption.hide();
            this.strokeDropDown.hide();
            this.transparencySlider.hide();
        },
        showOptions: function($el){
            this.hideOptions();
            var tool = $el.data('tool');
            var toolName = $el.attr('title');
            var classname = this.toolIcon.className;
            if (classname.indexOf(OPTIONS.toolIconCssSuffix) > -1) {
                this.toolIcon.className = OPTIONS.toolIconCssClass + ' ' + tool + OPTIONS.toolIconCssSuffix;
            }
            switch(tool) {
                case 'transform':
                case 'bezier':
                case 'convert':
                case 'select':
                case 'marker':
                    this.noToolOption.html(toolName + CONST.noToolOptions);
                    this.noToolOption.show();
                    break;
                case 'pencil':
                case 'polyline':
                    this.borderColorSelect.show();
                    this.strokeSelect.show();
                    this.transparencyPicker.show();
                    this.toolOptions.show();
                    break;
                case 'move':
                case 'bound':
                case 'circle':
                case 'polygon':
                case 'building':
                case 'text':
                default:
                    this.fillinColorSelect.show();
                    this.borderColorSelect.show();
                    this.strokeSelect.show();
                    this.transparencyPicker.show();
                    this.toolOptions.show();
            }
        },
        setFillInColor: function(color){
            if (!color)
                return;
            $('div', this.fillinColorSelect).eq(0).css('backgroundColor', color);
        },
        getFillInColor: function(){
            return $('div', this.fillinColorSelect).eq(0).css('backgroundColor');
        },
        setBorderColor: function(color){
            if (!color)
                return;
            $('div', this.borderColorSelect).eq(0).css('borderColor', color);
        },
        getBorderColor: function(){
            return $('div', this.borderColorSelect).eq(0).css('borderColor');
        }
    };
    var ToolPanel = {
        moveTool: $('#'+ID.moveTool),
        transformTool: $('#'+ID.transformTool),
        pencilTool: $('#'+ID.pencilTool),
        bezierTool: $('#'+ID.bezierTool),
        selectTool: $('#'+ID.selectTool),
        shapeTool: $('#'+ID.shapeTool),
        polylineTool: $('#'+ID.polylineTool),
        markerTool: $('#'+ID.markerTool),
        textTool: $('#'+ID.textTool),
        colorSwitcher: $('#'+ID.colorSwitcher),
        fillInColor: $('#'+ID.fillInColor),
        borderColor: $('#'+ID.borderColor),
        bezierMenu: $('#'+ID.bezierMenu),
        shapeMenu: $('#'+ID.shapeMenu),
        fillInColorPicker: [],
        borderColorPicker: [],
        resetStatus: function(){
            $('img', $('#'+ID.toolIcons)).each(function(){
                $img = $(this);
                var src = $img.attr('src');
                if (src.indexOf('_over_') > -1) {
                    $img.attr('src', src.replace('_over_', '_off_'));
                }
                if (src.indexOf('_on_') > -1) {
                    $img.attr('src', src.replace('_on_', '_off_'));
                }
            });
        },
        init: function(){
            this.moveTool.data('tool', 'move');
            this.transformTool.data('tool', 'transform');
            this.pencilTool.data('tool', 'pencil');
            this.bezierTool.data('tool', 'bezier');
            this.shapeTool.data('tool', 'bound');
            this.selectTool.data('tool', 'select');
            this.polylineTool.data('tool', 'polyline');
            this.markerTool.data('tool', 'marker');
            this.textTool.data('tool', 'text');
            if (BROWSER.firefox || BROWSER.ie8) {
                $('.'+OPTIONS.submenuBgCssClass, this.bezierMenu).css({'position': 'absolute', 'left': 0, 'top': 0});
                $('.'+OPTIONS.submenuBgCssClass, this.shapeMenu).css({'position': 'absolute', 'left': 0, 'top': 0});
            }
            this.bindEvents();
            this.moveTool.trigger('click');
            this.bindToolMenuEvents();
        },
        bindEvents: function(){
            var self = this;
            var onMouseOut = function(){
                var $img = $(this);
                var src = $img.attr('src');
                if (src.indexOf(OPTIONS.toolIconOverStatus) > -1) {
                    $img.attr('src', src.replace(OPTIONS.toolIconOverStatus, OPTIONS.toolIconOffStatus));
                }
            };
            var onMouseOver = function(){
                var $img = $(this);
                var src = $img.attr('src');
                if (src.indexOf(OPTIONS.toolIconOffStatus) > -1) {
                    $img.attr('src', src.replace(OPTIONS.toolIconOffStatus, OPTIONS.toolIconOverStatus));
                }
            };
            var onClick = function(){
                self.resetStatus();
                var $img = $(this);
                var src = $img.attr('src');
                if (src.indexOf(OPTIONS.toolIconOffStatus) > -1) {
                    $img.attr('src', src.replace(OPTIONS.toolIconOffStatus, OPTIONS.toolIconOnStatus));
                }
                if (src.indexOf(OPTIONS.toolIconOverStatus) > -1) {
                    $img.attr('src', src.replace(OPTIONS.toolIconOverStatus, OPTIONS.toolIconOnStatus));
                }
                var tool = $img.data('tool');
                switch(tool) {
                    case 'bezier':
                    case 'convert':
                        self.shapeMenu.hide();
                        self.bezierMenu.show();
                        break;
                    case 'bound':
                    case 'circle':
                    case 'polygon':
                    case 'building':
                        self.bezierMenu.hide();
                        self.shapeMenu.show();
                        break;
                    default:
                        self.bezierMenu.hide();
                        self.shapeMenu.hide();
                }
                ToolBar.showOptions($img);
            };
            this.moveTool.bind({
                mouseover: onMouseOver,
                mouseout: onMouseOut,
                click: onClick
            });
            this.transformTool.bind({
                mouseover: onMouseOver,
                mouseout: onMouseOut,
                click: onClick
            });
            this.pencilTool.bind({
                mouseover: onMouseOver,
                mouseout: onMouseOut,
                click: onClick
            });
            this.bezierTool.bind({
                mouseover: onMouseOver,
                mouseout: onMouseOut,
                click: onClick
            });
            this.selectTool.bind({
                mouseover: onMouseOver,
                mouseout: onMouseOut,
                click: onClick
            });
            this.shapeTool.bind({
                mouseover: onMouseOver,
                mouseout: onMouseOut,
                click: onClick
            });
            this.polylineTool.bind({
                mouseover: onMouseOver,
                mouseout: onMouseOut,
                click: onClick
            });
            this.markerTool.bind({
                mouseover: onMouseOver,
                mouseout: onMouseOut,
                click: onClick
            });
            this.textTool.bind({
                mouseover: onMouseOver,
                mouseout: onMouseOut,
                click: onClick
            });
            this.colorSwitcher.bind('click', function(){
                var fillInColor = self.fillInColor.css('backgroundColor');
                var borderColor = self.borderColor.css('backgroundColor');
                self.fillInColor.css('backgroundColor', borderColor);
                self.borderColor.css('backgroundColor', fillInColor);
                ToolBar.setFillInColor(borderColor);
                ToolBar.setBorderColor(fillInColor);
            });
            this.fillInColor.bind({
                click: function(){
                    $(this).css({'z-index': 1});
                    self.borderColor.css({'z-index': 0});
                },
                dblclick: function(){
                    if (!self.fillInColorPicker.length) {
                        self.fillInColorPicker = $(this).ColorPicker({
                            onSubmit: function(hsb, hex, rgb, el){
                                $(el).ColorPickerHide();
                                $(el).css('backgroundColor', '#'+hex);
                                ToolBar.setFillInColor('#'+hex);
                            }
                        });
                    }
                    self.fillInColorPicker.ColorPickerShow();
                }
            });
            this.borderColor.bind({
                click: function(){
                    $(this).css({'z-index': 1});
                    self.fillInColor.css({'z-index': 0});
                },
                dblclick: function(){
                    if (!self.borderColorPicker.length) {
                        self.borderColorPicker = $(this).ColorPicker({
                            onSubmit: function(hsb, hex, rgb, el){
                                $(el).ColorPickerHide();
                                $(el).css('backgroundColor', '#'+hex);
                                ToolBar.setBorderColor('#'+hex);
                            }
                        });
                    }
                    self.borderColorPicker.ColorPickerShow();
                }
            });
        },
        bindToolMenuEvents: function(){
            var self = this;
            $('li', self.bezierMenu).bind('click', function(){
                var $li = $(this);
                var currentTool = self.bezierTool.data('tool');
                var newTool = $li.attr('name');
                var src = self.bezierTool.attr('src');
                var toolName = $('div', $li).eq(1).html();
                if (currentTool != newTool) {
                    self.bezierTool.data('tool', newTool)
                                   .attr('src', src.replace(currentTool, newTool))
                                   .attr('title', toolName)
                                   .attr('alt', toolName)
                                   .trigger('click');
                }
                self.bezierMenu.hide();
            });
            $('li', self.shapeMenu).bind('click', function(){
                var $li = $(this);
                var currentTool = self.shapeTool.data('tool');
                var newTool = $li.attr('name');
                var src = self.shapeTool.attr('src');
                var toolName = $('div', $li).eq(1).html();
                if (currentTool != newTool) {
                    self.shapeTool.data('tool', newTool)
                                  .attr('src', src.replace(currentTool, newTool))
                                  .attr('title', toolName)
                                  .attr('alt', toolName)
                                  .trigger('click');
                }
                self.shapeMenu.hide();
            });
        },
        setFillInColor: function(color){
            if (!color)
                return;
            this.fillInColor.css('backgroundColor', color);
        },
        getFillInColor: function(){
            return this.fillInColor.css('backgroundColor');
        },
        setBorderColor: function(color){
            if (!color)
                return;
            this.borderColor.css('backgroundColor', color);
        },
        getBorderColor: function(){
            return this.borderColor.css('backgroundColor');
        }
    };
    (function(){
        ToolBar.init();
        ToolPanel.init();
    })();
};
UM.extend({
	toolPanel: new TOOLPANEL()
});