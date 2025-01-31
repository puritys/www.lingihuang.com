// This file was automatically generated from alertUITemplate.soy.
// Please don't edit this file by hand.

if (typeof UITemplates == 'undefined') { var UITemplates = {}; }


UITemplates.alertUITemplate = function(opt_data, opt_sb) {
  var output = opt_sb || new soy.StringBuilder();
  output.append('<div class="alert-top-left"></div><div class="alert-top-right"></div><div class="alert-top-center"><div class="alert-hack-ie6"><div id="', soy.$$escapeHtml(opt_data.ids['heading']), '" class="alert-heading-col"></div><div id="', soy.$$escapeHtml(opt_data.ids['closeButton']), '" class="alert-close-button"><img src="../images/alert/close_button.jpg" alt="關閉" title="關閉" /></div></div></div><div class="alert-body-left"></div><div class="alert-body-right"></div><div class="alert-body-center"><div class="alert-hack-ie6"><div class="alert-content-container"><p id="', soy.$$escapeHtml(opt_data.ids['message']), '" class="alert-msg"></p><div class="alert-button-outer-container"><button id="', soy.$$escapeHtml(opt_data.ids['okButton']), '" class="alert-button-inner-container">確定</button></div></div></div></div><div class="alert-bottom-left"></div><div class="alert-bottom-right"></div><div class="alert-bottom-center"><div class="alert-hack-ie6"></div></div><div class="alert-clear-float"></div>');
  if (!opt_sb) return output.toString();
};



/*
友邁科技Olemap
Date: April 7, 2011
Author: Vivian
*/

var ALERT = function(message, heading, opts){
    var defaults = {
        alertWrapperCssClass: 'alert-wrapper',
        bodyLeftCssClass: 'alert-body-left',
        bodyRightCssClass: 'alert-body-right',
        bodyCenterCssClass: 'alert-body-center',
        width: 300,
        height: 120,
        duration: 500,
        message: '',
        heading: '',
        onLoad: function(){},
        onResize: function(){},
        onShow: function(){},
        onHide: function(){}
    };
    var OPTIONS = $.extend({}, defaults, opts, {message: message, heading: heading});
    var TIMESTAMP = new Date().getTime();
    var ID = {
        wrapper: 'alertWrapperDiv' + TIMESTAMP,
        heading: 'alertHeadingDiv' + TIMESTAMP,
        message: 'alertMessageP' + TIMESTAMP,
        okButton: 'alertOkButtonDiv' + TIMESTAMP,
        closeButton: 'closeButtonDiv' + TIMESTAMP
    };
    var $alertWrapper;
    var _setContent = function(message, heading, callback){
        var callback = $.isFunction(callback) ? callback : function(){};
        if (heading)
            $('#'+ID.heading).html(heading);
        if (message)
            $('#'+ID.message).html(message);
        OPTIONS.onLoad();
        callback();
    };
    var bindEvents = function(){
        var $okButton = $('#'+ID.okButton);
        $okButton.bind('click', function(){
            $alertWrapper.fadeOut(OPTIONS.duration, OPTIONS.onHide);
        });
        $okButton.bind('keypress', function(event){
            var isIE = $.browser.msie;
            if (isIE) {
                if (event.charCode == 32 || event.charCode == 13 || event.charCode == 27)
                    $okButton.trigger('click');
            } else {
                if (event.keyCode == 32 || event.keyCode == 13 || event.keyCode == 27)
                    $okButton.trigger('click');
            }
        });
        $('#'+ID.closeButton).bind('click', function(){
            $alertWrapper.fadeOut(OPTIONS.duration);
        });
    };
    var resize = function(callback){
        var callback = $.isFunction(callback) ? callback : function(){};
        $alertWrapper.width(OPTIONS.width);
        $('.'+OPTIONS.bodyLeftCssClass, $alertWrapper).height(OPTIONS.height);
        $('.'+OPTIONS.bodyRightCssClass, $alertWrapper).height(OPTIONS.height);
        $('.'+OPTIONS.bodyCenterCssClass, $alertWrapper).height(OPTIONS.height);
        OPTIONS.onResize();
        callback();
    };
    var setPosition = function(){
        var left = parseInt(($(document).width() - $alertWrapper.width()) / 2);
        $alertWrapper.css({'left': left});
        _show();
    };
    var _show = function(){
        $alertWrapper.fadeIn(OPTIONS.duration, function(){
            $('#'+ID.okButton).focus();
            OPTIONS.onShow();
        });
    };
    (function(){
        $alertWrapper = $('<div></div>').attr('id', ID.wrapper)
                                        .addClass(OPTIONS.alertWrapperCssClass)
                                        .html(UITemplates.alertUITemplate({ids: ID}))
                                        .appendTo($('body'));
        bindEvents();
        if (OPTIONS.message)
            _setContent(OPTIONS.message, OPTIONS.heading, function(){
                resize(function(){
                    setPosition();
                });
            });
    })();
    this.setContent = _setContent;
    this.show = _show;
};
(function(){
    window.alert = function(message, heading, opts){
        if (!window._alert_) {
            window._alert_ = new ALERT(message, heading, opts);
        } else {
            window._alert_.setContent(message, heading, window._alert_.show);
        }
    }
})();
