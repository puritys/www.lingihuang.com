// This file was automatically generated from colorpickerUITemplate.soy.
// Please don't edit this file by hand.

if (typeof UITemplates == 'undefined') { var UITemplates = {}; }


UITemplates.colorpickerUITemplate = function(opt_data, opt_sb) {
  var output = opt_sb || new soy.StringBuilder();
  output.append('<div class="colorpicker"><div class="colorpicker_close"><img src="../images/painter/color_picker/colorpicker_close_button.jpg" title="關閉" alt="關閉" /></div><div class="colorpicker_color"><div><div></div></div></div><div class="colorpicker_hue"><div></div></div><div class="colorpicker_new_color"></div><div class="colorpicker_current_color"></div><div class="colorpicker_hex"><input type="text" maxlength="6" size="6" /></div><div class="colorpicker_rgb_r colorpicker_field"><input type="text" maxlength="3" size="3" /><span></span></div><div class="colorpicker_rgb_g colorpicker_field"><input type="text" maxlength="3" size="3" /><span></span></div><div class="colorpicker_rgb_b colorpicker_field"><input type="text" maxlength="3" size="3" /><span></span></div><div class="colorpicker_hsb_h colorpicker_field"><input type="text" maxlength="3" size="3" /><span></span></div><div class="colorpicker_hsb_s colorpicker_field"><input type="text" maxlength="3" size="3" /><span></span></div><div class="colorpicker_hsb_b colorpicker_field"><input type="text" maxlength="3" size="3" /><span></span></div><div class="colorpicker_submit"><div class="button-inner-container">確定</div></div><div class="colorpicker_cancel"><div class="button-inner-container">取消</div></div></div>');
  if (!opt_sb) return output.toString();
};




/**
 *
 * Color picker
 * Author: Stefan Petre www.eyecon.ro
 * 
 * Dual licensed under the MIT and GPL licenses
 * 
 */

(function ($) {
	var ColorPicker = function () {
		var ids = {}, inAction, charMin = 65, visible;
		var defaults = {
            eventName: 'click',
            onShow: function () {},
            onBeforeShow: function(){},
            onHide: function () {},
            onChange: function () {},
            onSubmit: function () {},
            color: 'ff0000',
            livePreview: true,
            flat: false
		};
		var	fillRGBFields = function(hsb, cal){
            var rgb = HSBToRGB(hsb);
            $(cal).data('colorpicker').fields
                .eq(1).val(rgb.r).end()
                .eq(2).val(rgb.g).end()
                .eq(3).val(rgb.b).end();
		};
		var	fillHSBFields = function(hsb, cal){
            $(cal).data('colorpicker').fields
                .eq(4).val(hsb.h).end()
                .eq(5).val(hsb.s).end()
                .eq(6).val(hsb.b).end();
		};
		var	fillHexFields = function(hsb, cal){
            $(cal).data('colorpicker').fields
                .eq(0).val(HSBToHex(hsb)).end();
		};
		var	setSelector = function(hsb, cal){
        var overlayHeight = $(cal).data('colorpicker').selector.height();
            $(cal).data('colorpicker').selector.css('backgroundColor', '#' + HSBToHex({h: hsb.h, s: 100, b: 100}));
            $(cal).data('colorpicker').selectorIndic.css({
                left: parseInt(overlayHeight * hsb.s/100, 10),
                top: parseInt(overlayHeight * (100-hsb.b)/100, 10)
            });
		};
		var	setHue = function(hsb, cal){
			var overlayHeight = $(cal).data('colorpicker').selector.height();
            $(cal).data('colorpicker').hue.css('top', parseInt(overlayHeight - overlayHeight * hsb.h/360, 10));
		};
		var	setCurrentColor = function(hsb, cal){
			$(cal).data('colorpicker').currentColor.css('backgroundColor', '#' + HSBToHex(hsb));
		};
		var	setNewColor = function(hsb, cal){
			$(cal).data('colorpicker').newColor.css('backgroundColor', '#' + HSBToHex(hsb));
		};
		var	keyDown = function(ev){
            var pressedKey = ev.charCode || ev.keyCode || -1;
            if ((pressedKey > charMin && pressedKey <= 90) || pressedKey == 32) {
                return false;
            }
            var cal = $(this).parent().parent();
            if (cal.data('colorpicker').livePreview === true) {
                change.apply(this);
            }
		};
		var	change = function(ev){
            var cal = $(this).parent().parent(), col;
            if (this.parentNode.className.indexOf('_hex') > 0) {
                cal.data('colorpicker').color = col = HexToHSB(fixHex(this.value));
            } else if (this.parentNode.className.indexOf('_hsb') > 0) {
                cal.data('colorpicker').color = col = fixHSB({
                    h: parseInt(cal.data('colorpicker').fields.eq(4).val(), 10),
                    s: parseInt(cal.data('colorpicker').fields.eq(5).val(), 10),
                    b: parseInt(cal.data('colorpicker').fields.eq(6).val(), 10)
                });
            } else {
                cal.data('colorpicker').color = col = RGBToHSB(fixRGB({
                    r: parseInt(cal.data('colorpicker').fields.eq(1).val(), 10),
                    g: parseInt(cal.data('colorpicker').fields.eq(2).val(), 10),
                    b: parseInt(cal.data('colorpicker').fields.eq(3).val(), 10)
                }));
            }
            if (ev) {
                fillRGBFields(col, cal.get(0));
                fillHexFields(col, cal.get(0));
                fillHSBFields(col, cal.get(0));
            }
            setSelector(col, cal.get(0));
            setHue(col, cal.get(0));
            setNewColor(col, cal.get(0));
            cal.data('colorpicker').onChange.apply(cal, [col, HSBToHex(col), HSBToRGB(col)]);
		};
		var blur = function(ev){
            var cal = $(this).parent().parent();
            cal.data('colorpicker').fields.parent().removeClass('colorpicker_focus');
		};
		var	focus = function(){
            charMin = this.parentNode.className.indexOf('_hex') > 0 ? 70 : 65;
            $(this).parent().parent().data('colorpicker').fields.parent().removeClass('colorpicker_focus');
            $(this).parent().addClass('colorpicker_focus');
		};
		var	downIncrement = function(ev){
            var field = $(this).parent().find('input').focus();
            var current = {
                el: $(this).parent().addClass('colorpicker_slider'),
                max: this.parentNode.className.indexOf('_hsb_h') > 0 ? 360 : (this.parentNode.className.indexOf('_hsb') > 0 ? 100 : 255),
                y: ev.pageY,
                field: field,
                val: parseInt(field.val(), 10),
                preview: $(this).parent().parent().data('colorpicker').livePreview				
            };
            $(document).bind('mouseup', current, upIncrement);
            $(document).bind('mousemove', current, moveIncrement);
		};
		var	moveIncrement = function(ev){
            ev.data.field.val(Math.max(0, Math.min(ev.data.max, parseInt(ev.data.val + ev.pageY - ev.data.y, 10))));
            if (ev.data.preview) {
                change.apply(ev.data.field.get(0), [true]);
            }
            return false;
		};
		var	upIncrement = function(ev){
            change.apply(ev.data.field.get(0), [true]);
            ev.data.el.removeClass('colorpicker_slider').find('input').focus();
            $(document).unbind('mouseup', upIncrement);
            $(document).unbind('mousemove', moveIncrement);
            return false;
		};
		var	downHue = function(ev){
            var current = {
                cal: $(this).parent(),
                y: $(this).offset().top
            };
            current.preview = current.cal.data('colorpicker').livePreview;
            $(document).bind('mouseup', current, upHue);
            $(document).bind('mousemove', current, moveHue);
		};
		var	moveHue = function(ev){
            var overlayHeight = ev.data.cal.data('colorpicker').selector.height();
            change.apply(
                ev.data.cal.data('colorpicker')
                    .fields
                    .eq(4)
                    .val(parseInt(360*(overlayHeight - Math.max(0,Math.min(overlayHeight,(ev.pageY - ev.data.y))))/overlayHeight, 10))
                    .get(0),
                [ev.data.preview]
            );
            return false;
		};
		var	upHue = function(ev){
            fillRGBFields(ev.data.cal.data('colorpicker').color, ev.data.cal.get(0));
            fillHexFields(ev.data.cal.data('colorpicker').color, ev.data.cal.get(0));
            $(document).unbind('mouseup', upHue);
            $(document).unbind('mousemove', moveHue);
            return false;
		};
		var	downSelector = function(ev){
            var current = {
                cal: $(this).parent(),
                pos: $(this).offset()
            };
            current.preview = current.cal.data('colorpicker').livePreview;
            $(document).bind('mouseup', current, upSelector);
            $(document).bind('mousemove', current, moveSelector);
		};
		var	moveSelector = function(ev){
            var overlayHeight = ev.data.cal.data('colorpicker').selector.height();
            change.apply(
                ev.data.cal.data('colorpicker')
                    .fields
                    .eq(6)
                    .val(parseInt(100*(overlayHeight - Math.max(0,Math.min(overlayHeight,(ev.pageY - ev.data.pos.top))))/overlayHeight, 10))
                    .end()
                    .eq(5)
                    .val(parseInt(100*(Math.max(0,Math.min(overlayHeight,(ev.pageX - ev.data.pos.left))))/overlayHeight, 10))
                    .get(0),
                [ev.data.preview]
            );
            return false;
		};
		var	upSelector = function(ev){
            fillRGBFields(ev.data.cal.data('colorpicker').color, ev.data.cal.get(0));
            fillHexFields(ev.data.cal.data('colorpicker').color, ev.data.cal.get(0));
            $(document).unbind('mouseup', upSelector);
            $(document).unbind('mousemove', moveSelector);
            return false;
		};
		var	enterSubmit = function(ev){
			$(this).addClass('colorpicker_focus');
		};
		var	leaveSubmit = function(ev){
			$(this).removeClass('colorpicker_focus');
		};
		var	clickSubmit = function(ev){
            var cal = $(this).parent();
            var col = cal.data('colorpicker').color;
            cal.data('colorpicker').origColor = col;
            setCurrentColor(col, cal.get(0));
            cal.data('colorpicker').onSubmit(col, HSBToHex(col), HSBToRGB(col), cal.data('colorpicker').el);
		};
		var	show = function(ev){
            var cal = $('#' + $(this).data('colorpickerId'));
            cal.data('colorpicker').onBeforeShow.apply(this, [cal.get(0)]);
            var pos = $(this).offset();
            var viewPort = getViewport();
            var top = pos.top + this.offsetHeight;
            var left = pos.left;
            if (top + cal.height() > viewPort.t + viewPort.h) {
                top -= this.offsetHeight + cal.height();
            }
            if (left + cal.width() > viewPort.l + viewPort.w) {
                left -= cal.width();
            }
            cal.css({left: left + 'px', top: top + 'px'});
            if (cal.data('colorpicker').onShow.apply(this, [cal.get(0)]) != false) {
                cal.show();
            }
            $(document).bind('mousedown', {cal: cal}, hide);
            return false;
		};
		var	hide = function(ev){
            if (!isChildOf(ev.data.cal.get(0), ev.target, ev.data.cal.get(0))) {
                if (ev.data.cal.data('colorpicker').onHide.apply(this, [ev.data.cal.get(0)]) != false) {
                    ev.data.cal.hide();
                }
                $(document).unbind('mousedown', hide);
            }
		};
		var	isChildOf = function(parentEl, el, container){
            if (parentEl == el) {
                return true;
            }
            if (parentEl.contains) {
                return parentEl.contains(el);
            }
            if (parentEl.compareDocumentPosition) {
                return !!(parentEl.compareDocumentPosition(el) & 16);
            }
            var prEl = el.parentNode;
            while(prEl && prEl != container) {
                if (prEl == parentEl)
                    return true;
                prEl = prEl.parentNode;
            }
            return false;
		};
		var	getViewport = function(){
            var m = document.compatMode == 'CSS1Compat';
            return {
                l : window.pageXOffset || (m ? document.documentElement.scrollLeft : document.body.scrollLeft),
                t : window.pageYOffset || (m ? document.documentElement.scrollTop : document.body.scrollTop),
                w : window.innerWidth || (m ? document.documentElement.clientWidth : document.body.clientWidth),
                h : window.innerHeight || (m ? document.documentElement.clientHeight : document.body.clientHeight)
            };
		};
		var	fixHSB = function(hsb){
            return {
                h: Math.min(360, Math.max(0, hsb.h)),
                s: Math.min(100, Math.max(0, hsb.s)),
                b: Math.min(100, Math.max(0, hsb.b))
            };
		}; 
		var	fixRGB = function(rgb){
            return {
                r: Math.min(255, Math.max(0, rgb.r)),
                g: Math.min(255, Math.max(0, rgb.g)),
                b: Math.min(255, Math.max(0, rgb.b))
            };
		};
		var	fixHex = function(hex){
            var len = 6 - hex.length;
            if (len > 0) {
                var o = [];
                for (var i=0; i<len; i++) {
                    o.push('0');
                }
                o.push(hex);
                hex = o.join('');
            }
            return hex;
		};
		var	HexToRGB = function(hex){
             // 16進位轉10進位
            var hex = parseInt(((hex.indexOf('#') > -1) ? hex.substring(1) : hex), 16);
            return {r: hex >> 16, g: (hex & 0x00FF00) >> 8, b: (hex & 0x0000FF)};
		};
		var	HexToHSB = function(hex){
			return RGBToHSB(HexToRGB(hex));
		};
		var	RGBToHSB = function(rgb){
            var hsb = {
                h: 0,
                s: 0,
                b: 0
            };
            var min = Math.min(rgb.r, rgb.g, rgb.b);
            var max = Math.max(rgb.r, rgb.g, rgb.b);
            var delta = max - min;
            hsb.b = max;
            if (max != 0) {
                
            }
            hsb.s = max != 0 ? 255 * delta / max : 0;
            if (hsb.s != 0) {
                if (rgb.r == max) {
                    hsb.h = (rgb.g - rgb.b) / delta;
                } else if (rgb.g == max) {
                    hsb.h = 2 + (rgb.b - rgb.r) / delta;
                } else {
                    hsb.h = 4 + (rgb.r - rgb.g) / delta;
                }
            } else {
                hsb.h = -1;
            }
            hsb.h *= 60;
            if (hsb.h < 0) {
                hsb.h += 360;
            }
            hsb.s *= 100/255;
            hsb.b *= 100/255;
            return hsb;
		};
		var	HSBToRGB = function(hsb){
            var rgb = {};
            var h = Math.round(hsb.h);
            var s = Math.round(hsb.s*255/100);
            var v = Math.round(hsb.b*255/100);
            if(s == 0) {
                rgb.r = rgb.g = rgb.b = v;
            } else {
                var t1 = v;
                var t2 = (255-s)*v/255;
                var t3 = (t1-t2)*(h%60)/60;
                if(h==360) h = 0;
                if(h<60) {rgb.r=t1;	rgb.b=t2; rgb.g=t2+t3}
                else if(h<120) {rgb.g=t1; rgb.b=t2;	rgb.r=t1-t3}
                else if(h<180) {rgb.g=t1; rgb.r=t2;	rgb.b=t2+t3}
                else if(h<240) {rgb.b=t1; rgb.r=t2;	rgb.g=t1-t3}
                else if(h<300) {rgb.b=t1; rgb.g=t2;	rgb.r=t2+t3}
                else if(h<360) {rgb.r=t1; rgb.g=t2;	rgb.b=t1-t3}
                else {rgb.r=0; rgb.g=0;	rgb.b=0}
            }
            return {r:Math.round(rgb.r), g:Math.round(rgb.g), b:Math.round(rgb.b)};
		};
		var	RGBToHex = function(rgb){
             // 10進位轉16進位
            var hex = [
                rgb.r.toString(16),
                rgb.g.toString(16),
                rgb.b.toString(16)
            ];
            $.each(hex, function(nr, val){
                if (val.length == 1) {
                    hex[nr] = '0' + val;
                }
            });
            return hex.join('');
		};
		var	HSBToHex = function(hsb){
			return RGBToHex(HSBToRGB(hsb));
		};
		var	restoreOriginal = function(){
				var cal = $(this).parent();
				var col = cal.data('colorpicker').origColor;
				cal.data('colorpicker').color = col;
				fillRGBFields(col, cal.get(0));
				fillHexFields(col, cal.get(0));
				fillHSBFields(col, cal.get(0));
				setSelector(col, cal.get(0));
				setHue(col, cal.get(0));
				setNewColor(col, cal.get(0));
		};
		return {
			init: function (opt) {
				opt = $.extend({}, defaults, opt||{});
				if (typeof opt.color == 'string') {
					opt.color = HexToHSB(opt.color);
				} else if (opt.color.r != undefined && opt.color.g != undefined && opt.color.b != undefined) {
					opt.color = RGBToHSB(opt.color);
				} else if (opt.color.h != undefined && opt.color.s != undefined && opt.color.b != undefined) {
					opt.color = fixHSB(opt.color);
				} else {
					return this;
				}
				return this.each(function () {
					if (!$(this).data('colorpickerId')) {
						var options = $.extend({}, opt);
						options.origColor = opt.color;
						var id = 'collorpicker_' + parseInt(Math.random() * 1000);
						$(this).data('colorpickerId', id);
                        var html = UITemplates.colorpickerUITemplate();
						var cal = $(html).attr('id', id);
						if (options.flat) {
							cal.appendTo(this).show();
						} else {
							cal.appendTo(document.body);
						}
						options.fields = cal.find('input')
                                            .bind('keyup', keyDown)
                                            .bind('change', change)
                                            .bind('blur', blur)
                                            .bind('focus', focus);
						cal.find('span').bind('mousedown', downIncrement).end()
                           .find('>div.colorpicker_current_color').bind('click', restoreOriginal);
						options.selector = cal.find('div.colorpicker_color').bind('mousedown', downSelector);
						options.selectorIndic = options.selector.find('div div');
						options.el = this;
						options.hue = cal.find('div.colorpicker_hue div');
						cal.find('div.colorpicker_hue').bind('mousedown', downHue);
						options.newColor = cal.find('div.colorpicker_new_color');
						options.currentColor = cal.find('div.colorpicker_current_color');
						cal.data('colorpicker', options);
						cal.find('div.colorpicker_submit')
							.bind('mouseenter', enterSubmit)
							.bind('mouseleave', leaveSubmit)
							.bind('click', clickSubmit);
                        cal.find('div.colorpicker_cancel')
                            .bind('click', function(){
                                cal.hide();
                            });
                        cal.find('div.colorpicker_close')
                            .bind('click', function(){
                                cal.hide();
                            });
						fillRGBFields(options.color, cal.get(0));
						fillHSBFields(options.color, cal.get(0));
						fillHexFields(options.color, cal.get(0));
						setHue(options.color, cal.get(0));
						setSelector(options.color, cal.get(0));
						setCurrentColor(options.color, cal.get(0));
						setNewColor(options.color, cal.get(0));
						if (options.flat) {
							cal.css({
								position: 'relative',
								display: 'block'
							});
						} else {
							$(this).bind(options.eventName, show);
						}
					}
				});
			},
			showPicker: function() {
                return this.each( function () {
					if ($(this).data('colorpickerId')) {
						show.apply(this);
					}
				});
			},
			hidePicker: function() {
				return this.each( function () {
					if ($(this).data('colorpickerId')) {
						$('#' + $(this).data('colorpickerId')).hide();
					}
				});
			},
			setColor: function(col) {
				if (typeof col == 'string') {
					col = HexToHSB(col);
				} else if (col.r != undefined && col.g != undefined && col.b != undefined) {
					col = RGBToHSB(col);
				} else if (col.h != undefined && col.s != undefined && col.b != undefined) {
					col = fixHSB(col);
				} else {
					return this;
				}
				return this.each(function(){
					if ($(this).data('colorpickerId')) {
						var cal = $('#' + $(this).data('colorpickerId'));
						cal.data('colorpicker').color = col;
						cal.data('colorpicker').origColor = col;
						fillRGBFields(col, cal.get(0));
						fillHSBFields(col, cal.get(0));
						fillHexFields(col, cal.get(0));
						setHue(col, cal.get(0));
						setSelector(col, cal.get(0));
						setCurrentColor(col, cal.get(0));
						setNewColor(col, cal.get(0));
					}
				});
			}
		};
	}();
	$.fn.extend({
		ColorPicker: ColorPicker.init,
		ColorPickerHide: ColorPicker.hidePicker,
		ColorPickerShow: ColorPicker.showPicker,
		ColorPickerSetColor: ColorPicker.setColor
	});
})(jQuery)