/*
友邁科技Olemap
Date: March 31, 2011
Author: Vivian
*/

var HISTORYPANEL;
if (HISTORYPANEL && (typeof HISTORYPANEL != 'object' ))
    throw new Error("Namespace 'HISTORYPANEL' already exists");
if (typeof UM == 'undefined')
    throw new Error("you need include UM first!");

HISTORYPANEL = function(){
    var ID = {
        historyPanel: 'historyPanelDiv',
        closeBtn: 'historyCloseBtnDiv',
        recordContainer: 'historyRecordContainerDiv',
        historyDelete: 'historyDeleteIcon'
    };
    var CLASSNAME = {
        recordList: 'record-list',
        mapRecord: 'map-thumbnail-container',
        recordOffStatus: 'off-status',
        recordOnStatus: 'on-status',
        utilIconOffStatus: '_off_',
        utilIconOverStatus: '_over_'
    };
    CLASSNAME = $.extend({}, CLASSNAME, UM.URES.iconCssClass);
    var CONST = UM.URES.recordLabels;
    var $historyPanel, $recordContainer, $mapRecord;
    var _init = function(){
        $historyPanel = $('#'+ID.historyPanel);
        $recordContainer = $('#'+ID.recordContainer);
        $mapRecord = $('.'+CLASSNAME.mapRecord, $historyPanel).parent();
        if ($mapRecord.hasClass(CLASSNAME.recordOffStatus)) {
            $mapRecord.removeClass(CLASSNAME.recordOffStatus)
                      .addClass(CLASSNAME.recordOnStatus);
        }
        for (var i in historyPanel) {
            if ($.isFunction(historyPanel[i]))
                historyPanel[i]();
        }
    };
    var historyPanel = {
        init: function(){
            $('#'+ID.closeBtn).bind('click', function(){
                if ($('#'+ID.closeBtn).is(':hidden'))
                   $historyPanel.show();
                else
                    $historyPanel.hide();
            });
        },
        bindEvents: function(){
            var $recordLists = $('.'+CLASSNAME.recordList, $historyPanel);
            $('.'+CLASSNAME.recordList, $historyPanel).live('click', function(){
                resetRecordStatus();
                $(this).addClass(CLASSNAME.recordOnStatus);
            });
            $('#'+ID.historyDelete).bind('mouseout', onMouseOut)
                                   .bind('mouseover', onMouseOver);
        }
    };
    var _show = function(){
        $('#'+ID.closeBtn).trigger('click');
    };
    var resetRecordStatus = function(){
        var $recordLists = $('.'+CLASSNAME.recordList, $historyPanel);
        $('.'+CLASSNAME.recordList, $historyPanel).each(function(){
            var $recordList = $(this);
            if ($recordList.hasClass(CLASSNAME.recordOnStatus))
                $recordList.removeClass(CLASSNAME.recordOnStatus);
            if (!$recordList.hasClass(CLASSNAME.recordOffStatus))
                $recordList.addClass(CLASSNAME.recordOffStatus);
        });
    };
    var onMouseOut = function(){
        var src = $(this).attr('src');
        if (src.indexOf(CLASSNAME.utilIconOverStatus) > -1)
            $(this).attr('src', src.replace(CLASSNAME.utilIconOverStatus, CLASSNAME.utilIconOffStatus));
    };
    var onMouseOver = function(){
        var src = $(this).attr('src');
        if (src.indexOf(CLASSNAME.utilIconOffStatus) > -1)
            $(this).attr('src', src.replace(CLASSNAME.utilIconOffStatus, CLASSNAME.utilIconOverStatus));
    };
    this.init = _init;
    this.show = _show;
};
UM.extend({
	historyPanel: new HISTORYPANEL()
});
UM.addInit(function(){
    UM.historyPanel.init();
});