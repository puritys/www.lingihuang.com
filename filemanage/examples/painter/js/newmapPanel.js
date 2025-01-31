// This file was automatically generated from newmapPanelUITemplate.soy.
// Please don't edit this file by hand.

if (typeof UITemplates == 'undefined') { var UITemplates = {}; }


UITemplates.newmapPanelUITemplate = function(opt_data, opt_sb) {
  var output = opt_sb || new soy.StringBuilder();
  output.append('<div class="label-row"><div class="label-col">名稱</div><div id="fileNameMsgDiv" class="msg-col"></div><div class="clear-float"></div></div><div class="input-row"><input id="fileNameInput" class="filename-input input-text input-text-default" type="text" value="未命名-1" /></div><div class="label-row"><div class="label-col">尺寸</div><div id="fileSizeMsgDiv" class="msg-col"></div><div class="clear-float"></div></div><div class="input-row"><div class="size-input-section"><div class="label-col">寬度</div><input id="fileWidthInput" class="width-input input-text input-text-default" type="text" value="800" /><div class="unit-col">px</div><div class="clear-float"></div></div><div class="size-input-section"><div class="label-col">高度</div><input id="fileHeightInput" class="height-input input-text input-text-default" type="text" value="500" /><div class="unit-col">px</div><div class="clear-float"></div></div><div class="clear-float"></div></div><div class="button-row"><div class="button-outer-container"><div id="submitBtnDiv" class="button-inner-container">確定</div></div><div class="button-outer-container"><div id="cancelBtnDiv" class="button-inner-container">取消</div></div><div class="clear-float"></div></div>');
  if (!opt_sb) return output.toString();
};



/*
友邁科技Olemap
Date: April 6, 2011
Author: Vivian
*/

var NEWMAPPANEL;
if (NEWMAPPANEL && (typeof NEWMAPPANEL != 'object' ))
    throw new Error("Namespace 'NEWMAPPANEL' already exists");
if (typeof UM == 'undefined')
    throw new Error("you need include UM first!");

NEWMAPPANEL = function(){
    var OPTIONS = {
        newMapFormCssClass: 'new-map-form',
        defaultInputCssClass: 'input-text-default',
        errorInputCssClass: 'input-text-error',
        errorMsgCssClass: 'error-msg',
        headingHtml: '<h2 class="new-map-heading">開新地圖</h2>'
    };
    var ID = {
        newMapForm: 'newMapForm',
        fileNameInput: 'fileNameInput',
        fileWidthInput: 'fileWidthInput',
        fileHeightInput: 'fileHeightInput',
        submitBtn: 'submitBtnDiv',
        cancelBtn: 'cancelBtnDiv',
        fileNameMsg: 'fileNameMsgDiv',
        fileSizeMsg: 'fileSizeMsgDiv'
    };
    var CONST = {
        fileName: '未命名-',
        fileSizeMinLabel: '最小尺寸',
        fileSizeMaxLabel: '最大尺寸',
        fileNameError: '請輸入檔案名稱',
        fileSizeError: '請輸入寬及高'
    };
    var fileNameCount = 0;
    var defaultSize, minSize, maxSize;
    var minSizeMsg = [], maxSizeMsg = [];
    var $newMapPanel;
    var _init = function(){
        defaultSize = UM.URES.defaults.fileSize;
        minSize = UM.URES.fileSize.min;
        maxSize = UM.URES.fileSize.max;
        minSizeMsg = [
            CONST.fileSizeMinLabel,
            minSize.width,
            'x',
            minSize.height
        ];
       maxSizeMsg = [
            CONST.fileSizeMaxLabel,
            maxSize.width,
            'x',
            maxSize.height
        ];
        $newMapPanel = $('<form></form>').attr('id', ID.newMapForm)
                                        .addClass(OPTIONS.newMapFormCssClass)
                                        .html(UITemplates.newmapPanelUITemplate())
                                        .lightbox({
                                            theme: 'black',
                                            overlayColor: '#000',
                                            overlayOpacity: 0.7,
                                            width: 405,
                                            height: 460,
                                            position: 20,
                                            zIndex: 100,
                                            speed: 500,
                                            isOpen: false,
                                            isDraggable: false,
                                            heading: OPTIONS.headingHtml,
                                            onStart: function(){
                                                
                                            },
                                            onComplete: function(){
                                                
                                            }
                                        });
        Form.init();
    };
    var Form = {
        fileNameInput: [],
        fileWidthInput: [],
        fileHeightInput: [],
        fileNameMsg: [],
        fileSizeMsg: [],
        isValidated: {
            fileName: false,
            fileSize: false
        },
        init: function(){
            this.fileNameInput = $('#'+ID.fileNameInput);
            this.fileWidthInput = $('#'+ID.fileWidthInput);
            this.fileHeightInput = $('#'+ID.fileHeightInput);
            this.fileNameMsg = $('#'+ID.fileNameMsg);
            this.fileSizeMsg = $('#'+ID.fileSizeMsg);
            this.fileSizeMsg.html(minSizeMsg.join('') + '&nbsp;&nbsp;&nbsp;' + maxSizeMsg.join(''));
            this.bindEvents();
        },
        bindEvents: function(){
            var self = this;
            var onFocusIn = function(){
                var $input = $(this);
                if ($input.hasClass(OPTIONS.defaultInputCssClass)) {
                    $input.removeClass(OPTIONS.defaultInputCssClass)
                          .val('');
                }
                if ($input.hasClass(OPTIONS.errorInputCssClass))
                    $input.removeClass(OPTIONS.errorInputCssClass);
            };
            this.fileNameInput.bind('focusin', onFocusIn);
            this.fileWidthInput.bind('focusin', onFocusIn);
            this.fileHeightInput.bind('focusin', onFocusIn);
            $('#'+ID.submitBtn).bind('click', function(){
                self.validate();
                var isAllValidated = true;
                for (var key in self.isValidated) {
                    if (!self.isValidated[key]) {
                        isAllValidated = false;
                        break;
                    }
                }
                if (isAllValidated) {
                    $newMapPanel.triggerClose();
                    var size = {
                        width: parseInt(self.fileWidthInput.val(), 10),
                        height: parseInt(self.fileHeightInput.val(), 10)
                    };
                    UM.mapPanel.show(self.fileNameInput.val(), size);
                }
            });
            $('#'+ID.cancelBtn).bind('click', function(){
                 $newMapPanel.triggerClose();
            });
        },
        reset: function(){
            if (this.fileNameInput.hasClass(OPTIONS.errorInputCssClass))
                this.fileNameInput.removeClass(OPTIONS.errorInputCssClass);
            if (this.fileWidthInput.hasClass(OPTIONS.errorInputCssClass))
                this.fileWidthInput.removeClass(OPTIONS.errorInputCssClass);
            if (this.fileHeightInput.hasClass(OPTIONS.errorInputCssClass))
                this.fileHeightInput.removeClass(OPTIONS.errorInputCssClass);
            if (this.fileNameMsg.hasClass(OPTIONS.errorMsgCssClass))
                this.fileNameMsg.removeClass(OPTIONS.errorMsgCssClass);
            if (this.fileSizeMsg.hasClass(OPTIONS.errorMsgCssClass))
                this.fileSizeMsg.removeClass(OPTIONS.errorMsgCssClass);
            this.fileNameMsg.html('');
            this.fileSizeMsg.html('');
            for (var key in this.isValidated) {
                this.isValidated[key] = false;
            }
        },
        validate: function(){
            this.reset();
            if (this.fileNameInput.val()) {
                this.isValidated.fileName = true;
            } else {
                this.fileNameInput.addClass(OPTIONS.errorInputCssClass);
                this.fileNameMsg.addClass(OPTIONS.errorMsgCssClass)
                                  .html(CONST.fileNameError);
            }
            if (this.fileWidthInput.val() && this.fileHeightInput.val()) {
                var width = parseInt(this.fileWidthInput.val(), 10);
                var height = parseInt(this.fileHeightInput.val(), 10);
                if (width > minSize.width && width < maxSize.width && height > minSize.height && height < maxSize.height) {
                    this.isValidated.fileSize = true;
                } else if (width < minSize.width || height < minSize.height) {
                    if (width < minSize.width)
                        this.fileWidthInput.addClass(OPTIONS.errorInputCssClass);
                    if (height < minSize.height)
                        this.fileHeightInput.addClass(OPTIONS.errorInputCssClass);
                    this.fileSizeMsg.addClass(OPTIONS.errorMsgCssClass)
                                      .html(minSizeMsg.join(''));
                } else if (width > maxSize.width || height > maxSize.height) {
                    if (width > maxSize.width)
                        this.fileWidthInput.addClass(OPTIONS.errorInputCssClass);
                    if (height > maxSize.height)
                        this.fileHeightInput.addClass(OPTIONS.errorInputCssClass);
                    this.fileSizeMsg.addClass(OPTIONS.errorMsgCssClass)
                                      .html(maxSizeMsg.join(''));
                }
            } else {
                if (!width)
                    this.fileWidthInput.addClass(OPTIONS.errorInputCssClass);
                if (!height)
                    this.fileHeightInput.addClass(OPTIONS.errorInputCssClass);
                this.fileSizeMsg.addClass(OPTIONS.errorMsgCssClass)
                                  .html(CONST.fileSizeError);
            }
        }
    };
    var _show = function(callback, isVisible){
        fileNameCount++;
        Form.fileNameInput.val(CONST.fileName + fileNameCount);
        Form.fileWidthInput.val(defaultSize.width);
        Form.fileHeightInput.val(defaultSize.height);
        var callback = $.isFunction(callback) ? callback : function(){};
        var isVisible = isVisible ? isVisible : '';
        if (isVisible)
            $newMapPanel.show(callback, isVisible);
        else
            $newMapPanel.show(callback, isVisible);
    };
    this.init = _init;
    this.show = _show;
};
UM.extend({
	newMapPanel: new NEWMAPPANEL()
});
UM.addInit(function(){
    UM.newMapPanel.init();
});