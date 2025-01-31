// This file was automatically generated from lightboxUITemplate.soy.
// Please don't edit this file by hand.

if (typeof UITemplates == 'undefined') { var UITemplates = {}; }


UITemplates.classicUITemplate = function(opt_data, opt_sb) {
  var output = opt_sb || new soy.StringBuilder();
  output.append('<div id="', soy.$$escapeHtml(opt_data.ids['overlay']), '" class="lightbox-overlay"></div><div id="', soy.$$escapeHtml(opt_data.ids['container']), '" class="lightbox-container"><div class="lightbox-classic-top-left"></div><div class="lightbox-classic-top-right"></div><div class="lightbox-classic-top-center"><div class="lightbox-hack-ie6"><div id="', soy.$$escapeHtml(opt_data.ids['closeButton']), '" class="lightbox-classic-close-button"><img src="../css/lightbox/classic/images/close_button.jpg" alt="關閉" title="關閉" /></div></div></div><div class="lightbox-classic-body-left"></div><div class="lightbox-classic-body-right"></div><div class="lightbox-classic-body-center"><div class="lightbox-hack-ie6"><div id="', soy.$$escapeHtml(opt_data.ids['content']), '" class="lightbox-content-container"></div></div></div><div class="lightbox-classic-bottom-left"></div><div class="lightbox-classic-bottom-right"></div><div class="lightbox-classic-bottom-center"><div class="lightbox-hack-ie6"></div></div><div class="lightbox-clear-float"></div></div>');
  if (!opt_sb) return output.toString();
};


UITemplates.blackUITemplate = function(opt_data, opt_sb) {
  var output = opt_sb || new soy.StringBuilder();
  output.append('<div id="', soy.$$escapeHtml(opt_data.ids['overlay']), '" class="lightbox-overlay"></div><div id="', soy.$$escapeHtml(opt_data.ids['container']), '" class="lightbox-container"><div class="lightbox-black-top-left"></div><div class="lightbox-black-top-right"></div><div class="lightbox-black-top-center"><div class="lightbox-hack-ie6"><div id="', soy.$$escapeHtml(opt_data.ids['heading']), '" class="lightbox-heading"></div><div id="', soy.$$escapeHtml(opt_data.ids['closeButton']), '" class="lightbox-black-close-button"><img src="../css/lightbox/black/images/close_button.jpg" alt="關閉" title="關閉" /></div></div></div><div class="lightbox-black-body-left"></div><div class="lightbox-black-body-right"></div><div class="lightbox-black-body-center"><div class="lightbox-hack-ie6"><div id="', soy.$$escapeHtml(opt_data.ids['content']), '" class="lightbox-content-container"></div></div></div><div class="lightbox-black-bottom-left"></div><div class="lightbox-black-bottom-right"></div><div class="lightbox-black-bottom-center"><div class="lightbox-hack-ie6"></div></div><div class="lightbox-clear-float"></div></div>');
  if (!opt_sb) return output.toString();
};



/*
友邁科技Olemap
Date: March 31, 2011
Author: Vivian

== Sample ==
var lightbox = $('#id').lightbox({
    theme: 'blue',
    overlayColor: '#000',
	overlayOpacity: 0.7,
	width: 300,
	height: 200,
	position: 30,
	zIndex: 100,
	speed: 500,
	isOpen: true,
	isDraggable: true,
	cursor: 'move',
	containment: $(document.body),
	heading: 'Lihgtbox Heading',
	onStart: function(){},
    onLoad: function(){},
	onComplete: function(){},
	onShow: function(){},
	onHide: function(){},
	onResize: function(){}
});

** Parameters **
theme: the theme of the lightbox, the default value is blue.
overlayColor: a string of the overlay color.
overlayOpacity: a number of the overlay opacity and the value is between 0 to 1.
width: a number of the width of the lightbox.
height: a number of the height of the lightbox.
position: a number of the top position of the lightbox.
zIndex: a number of z-index of the lightbox.
speed: a number of the speed of fading in/out the lightbox.
isOpen: a boolean of a variable to determine to show/hide the lightbox on the initial.
isDraggable: a boolean of a variable to determine if to get the lightbox draggable.
cursor: a string of the value of the cursor style.
containment: a jQuery selector of the value to determine where the lightbox could be moved to.
heading: a string of the title of the lightbox.
onStart: a function to be triggered when the content is loaded on the initial.
onLoad: a function to be triggered when the content is completely loaded.
onComplete: a function to be triggered before the lightbox is shown up.
onShow: a function to be triggered when showing the lightbox up.
onHide: a function to be triggered when hiding the lightbox.
onResize: a function to be triggered when resizing the lightbox.

** Methods **
lightbox.show(callback, isVisible): to show(isVisible='') or hide(isVisible='hidden') the lightbox; the default value of isVisible is equal to ''.
lightbox.load(heading, content, width, height): to load the content.
lightbox.resize(width, height, callback): to resize the lightbox.
*/
(function($){
	$.fn.lightbox = function(opts){
		var $lightboxContent = $(this);
		var defaults = {
            lightboxCssClass: 'lightbox-wrapper',
            theme: 'black',
			overlayColor: '#000',
			overlayOpacity: 0.7,
			width: 300,
			height: 200,
			position: 30,
			zIndex: 0,
			speed: 500,
			isOpen: false,
			isDraggable: false,
            isConstrained: false,
			cursor: 'move',
			containment: $(document.body),
			scroll: false,
			heading: '',
			content: $lightboxContent ? $lightboxContent : '',
			onStart: function(){},
            onLoad: function(){},
			onComplete: function(){},
			onShow: function(){},
			onHide: function(){},
			onResize: function(){}
		};
		var OPTS = $.extend({}, defaults, opts);
		var TIMESTAMP = new Date().getTime();
		var ID = {};
        var BROWSER = {
            ie6: ($.browser.msie && $.browser.version.substr(0, 1) == '6') ? true : false,
            ie7: ($.browser.msie && $.browser.version.substr(0, 1) == '7') ? true : false,
            ie8: ($.browser.msie && $.browser.version.substr(0, 1) == '8') ? true : false
        };
        var ISSCROLLED = false;
        var init = function(){
            if ($('#'+ID.wrapper).length)
				return;
            var html = '';
            switch (OPTS.theme) {
                case 'classic':
                    ID = {
                        wrapper: 'lightboxWrapperDiv' + TIMESTAMP,
                        overlay: 'lightboxOverlayDiv' + TIMESTAMP,
                        closeButton: 'lightboxCloseButtonAnchor' + TIMESTAMP,
                        container: 'lightboxContainerDiv' + TIMESTAMP,
                        content: 'lightboxContentDiv' + TIMESTAMP
                    };
                    html = UITemplates.classicUITemplate({
                        ids: ID
                    });
                    break;
                case 'black':
                default:
                    ID = {
                        wrapper: 'lightboxWrapperDiv' + TIMESTAMP,
                        overlay: 'lightboxOverlayDiv' + TIMESTAMP,
                        heading: 'lightboxHeading' + TIMESTAMP,
                        closeButton: 'lightboxCloseButtonAnchor' + TIMESTAMP,
                        container: 'lightboxContainerDiv' + TIMESTAMP,
                        content: 'lightboxContentDiv' + TIMESTAMP
                    };
                    html = UITemplates.blackUITemplate({
                        ids: ID
                    });
            }
            getCss(OPTS.theme + UM.URES.lightboxCss.idSuffix, UM.URES.lightboxCss.url + OPTS.theme + UM.URES.lightboxCss.filename, function(){
                $('<div></div>').attr('id', ID.wrapper)
                                .addClass(OPTS.lightboxCssClass)
                                .css('z-index', OPTS.zIndex)
                                .html(html)
                                .appendTo($(document.body));
                $('#'+ID.overlay).css({
                    'backgroundColor': OPTS.overlayColor,
                    'opacity': OPTS.overlayOpacity
                });
                // classicUITemplate has no heading
                if (OPTS.content) {
                    _load(OPTS.heading, OPTS.content, OPTS.width, OPTS.height, function(){
                        if (OPTS.onLoad)
                            OPTS.onLoad();
                    });
                }
            });
        };
        var getCss = function(id, url, callback) {
            var chkTime = 100;
            var onload = function(styleId){
                if (document.getElementById(styleId)) {
                    if (callback)
                        callback();
                } else {
                    setTimeout(onload, chkTime);
                }
            };
            var css= id ? document.getElementById(id) : null;
            if (!css) {
                css = document.createElement('link');
                css.id = id || new Date().getTime();
                css.type = 'text/css';
                css.rel = 'stylesheet';
                document.getElementsByTagName('head')[0].appendChild(css);
            }
            css.href = url;
            if (callback)
                onload(css.id);
        };
        var bindEvents = function(){
            $('#'+ID.overlay).bind('click', function(){
                _show(function(){}, 'hidden');
            });
            $('#'+ID.closeButton).bind('click', function(){
                _show(function(){}, 'hidden');
                return false;
            });
            $(window).bind('resize', function(){
                var pageSize = getPageSize();
                $('#'+ID.overlay).css({
                    'width': pageSize.width,
                    'height': pageSize.height
                });
            }).trigger('resize');
            if (OPTS.isDraggable) {
                $('#'+ID.container).parent().draggable({
                    cursor: OPTS.cursor,
                    containment: OPTS.containment,
                    handle: $('#'+ID.heading).parent(),
                    scroll: OPTS.scroll
                });
            }
        };
		var _show = function(callback, isVisible){
            var isVisible = isVisible ? isVisible : '';
			if (isVisible == 'hidden') {
                var callback = $.isFunction(callback) ? callback : OPTS.onHide;
                $('#'+ID.wrapper).fadeOut(OPTS.speed, function(){
					if (BROWSER.ie6) {
						var $elements = $('embed, object, select').not($('embed, object, select', $('#'+ID.content)));
						$elements.css('visibility', 'visible');
					}
					callback();
				});
			} else {
                callback = $.isFunction(callback) ? callback : OPTS.onShow;
                _resize(OPTS.width, OPTS.height, function(){
                    $('#'+ID.wrapper).fadeIn(OPTS.speed, function(){
                        if (BROWSER.ie6) {
                            var $elements = $('embed, object, select').not($('embed, object, select', $('#'+ID.content)));
                            $elements.css('visibility', 'hidden');
                        }
                        if ($.isFunction(OPTS.onComplete))
                            OPTS.onComplete();
                        bindEvents();
                        callback();
                    });
                    
                });
			}
		};
		var _load = function(heading, content, width, height, callback){
            var callback = $.isFunction(callback) ? callback : OPTS.onLoad;
			if ($.isFunction(OPTS.onStart))
				OPTS.onStart();
            var heading = (heading && typeof heading == 'string' && !heading.indexOf('#')) ? $(heading) : heading;
			var content = (typeof content == 'string' && !content.indexOf('#')) ? $(content) : content;
			var $heading = $('#'+ID.heading);
			var $content = $('#'+ID.content);
			if ($heading.length) {
                $heading.append(heading);
                if ($heading.children().is(':hidden'))
                    $(heading).children().show();
            }
			$content.append(content);
			if ($content.children().is(':hidden'))
				$content.children().show();
            callback();
            _resize(width, height, function(){
                if (OPTS.isOpen) {
                    _show();
                }
            });
		};
		var _resize = function(width, height, callback){
			var width = width ? width : OPTS.width;
			var height = height ? height : OPTS.height;
			var callback = $.isFunction(callback) ? callback : OPTS.onResize;
            width = ISSCROLLED ? (width - 17) : width; // 捲軸寬17px
            if (OPTS.isConstrained) { // 頁面有捲軸
                
            } else { // 頁面沒有捲軸
                $('#'+ID.container).css({'position': 'absolute', 'margin-left': -width/2, 'top': OPTS.position});
            }
            $('#'+ID.container).width(width);
			$('#'+ID.content).height(height);
			callback();
		};
		var getPageSize = function(){
			var pageWidth, pageHeight;
			var xScroll, yScroll;
            if (window.innerHeight && window.scrollMaxY) {	// Firefox
                // window.innerWidth: 含scrollbar width
                // window.innerHeight: 可視範圍高度
				xScroll = window.innerWidth + window.scrollMaxX;
				yScroll = window.innerHeight + window.scrollMaxY;
			} else if (document.body.scrollHeight > document.body.offsetHeight) { // all but Explorer Mac
                xScroll = document.body.scrollWidth;
				yScroll = document.body.scrollHeight;
			} else { // IE6, IE7, IE8, Chrome, Safari
                // offsetHeight: 頁面總高
                xScroll = document.body.offsetWidth;
				yScroll = document.body.offsetHeight;
			}
			var windowWidth, windowHeight;
			if (window.innerHeight) {	// all except Explorer
				if(document.documentElement.clientWidth){ // Firefox, Chrome, Safari
                    // document.documentElement.clientWidth: 不含scrollbar width
                    windowWidth = document.documentElement.clientWidth; 
				} else {
					windowWidth = window.innerWidth;
				}
				// window.innerHeight: 可視範圍高度
                windowHeight = window.innerHeight;
			} else if (document.documentElement && document.documentElement.clientHeight) { // IE6, IE7, IE8
                windowWidth = document.documentElement.clientWidth;
				windowHeight = document.documentElement.clientHeight;
			} else if (document.body) { // other Explorers
                windowWidth = document.body.clientWidth;
				windowHeight = document.body.clientHeight;
			}
			// for small pages with total height less then height of the viewport
			if (yScroll < windowHeight) {
				pageHeight = windowHeight;
			} else { 
				pageHeight = yScroll;
                ISSCROLLED = true;
			}
			// for small pages with total width less then width of the viewport
			if (xScroll < windowWidth) {	
				pageWidth = xScroll;		
			} else {
				pageWidth = windowWidth;
			}
			return {width: pageWidth, height: pageHeight};
		};
        var _triggerClose = function(){
            _show(function(){}, 'hidden');
        };
        (function(){
            init();
		})();
		this.show = _show;
		this.load = _load;
		this.resize = _resize;
        this.triggerClose = _triggerClose;
        return this;
	}
})(jQuery);

