/*
友邁科技Olemap
Date: April 7, 2011
Author: Vivian
*/

var LAYERPANEL;
if (LAYERPANEL && (typeof LAYERPANEL != 'object' ))
    throw new Error("Namespace 'LAYERPANEL' already exists");
if (typeof UM == 'undefined')
    throw new Error("you need include UM first!");

LAYERPANEL = function(){
    var ID = {
        layerPanel: 'layerPanelDiv',
        closeBtn: 'layerCloseBtnDiv',
        recordContainer: 'layerRecordContainerForm',
        layerUtilities: 'layerUtilitiesDiv',
        moveUp: 'moveUpIcon',
        moveDown: 'moveDownIcon',
        newGroup: 'newGroupIcon',
        newLayer: 'newLayerIcon',
        layerDelete: 'layerDeleteIcon'
    };
    var CLASSNAME = {
        recordList: 'record-list',
        layerRecord: 'layer-record',
        groupRecord: 'group-record',
        mapRecord: 'map-record',
        layerRow: 'layer-row',
        groupRow: 'group-row',
        recordCol: 'right-record-col',
        recordOffStatus: 'off-status',
        recordOnStatus: 'on-status',
        descCol: 'desc-col',
        inputText: 'input-text',
        expandCol: 'arrow-col',
        expandIcon: 'expand-icon',
        collapseIcon: 'collapse-icon',
        eyeIcon: 'eye-inner-container',
        eyeIconOnStatus: 'eye-on-status',
        utilIconOffStatus: '_off_',
        utilIconOverStatus: '_over_'
    };
    CLASSNAME = $.extend({}, CLASSNAME, UM.URES.iconCssClass);
    var CONST = UM.URES.recordLabels;
    var $layerPanel, $recordContainer, $mapRecord, layerCount = 1, groupCount = 1;
    var _init = function(){
        $layerPanel = $('#'+ID.layerPanel);
        $recordContainer = $('#'+ID.recordContainer);
        $mapRecord = $('.'+CLASSNAME.mapRecord, $layerPanel);
        if ($('.'+CLASSNAME.recordCol, $mapRecord).hasClass(CLASSNAME.recordOffStatus)) {
            $('.'+CLASSNAME.recordCol, $mapRecord).removeClass(CLASSNAME.recordOffStatus)
                                                        .addClass(CLASSNAME.recordOnStatus);
        }
        for (var i in layerPanel) {
            if ($.isFunction(layerPanel[i]))
                layerPanel[i]();
        }
    };
    var layerPanel = {
        init: function(){
            $('#'+ID.closeBtn).bind('click', function(){
                if ($('#'+ID.closeBtn).is(':hidden'))
                   $layerPanel.show();
                else
                    $layerPanel.hide();
            });
        },
        bindRecordListEvents: function(){
            var $recordLists = $('.'+CLASSNAME.recordList, $layerPanel);
            var $noMapRecordLists = $recordLists.not($mapRecord);
            $('.'+CLASSNAME.eyeIcon, $layerPanel).live('click', function(){
                if ($(this).hasClass(CLASSNAME.eyeIconOnStatus))
                    $(this).removeClass(CLASSNAME.eyeIconOnStatus);
                else
                    $(this).addClass(CLASSNAME.eyeIconOnStatus);
            });
            
            $('.'+CLASSNAME.descCol, $layerPanel).live('dblclick', function(){
                resetInputStatus();
                var $descCol = $(this);
                var $input = $descCol.next();
                if ($descCol.is(':visible')) {
                    $descCol.hide();
                }
                if ($input.is(':hidden')) {
                    $input.val($descCol.html())
                          .show()
                          .focus();
                }
            });
            $('.'+CLASSNAME.inputText, $layerPanel).live({
                focusin: function(){
                    
                },
                focusout: function(){
                    onFocusOut($(this));
                },
                keyup: function(ev){
                    if (ev.keyCode == 13) {
                        onFocusOut($(this));
                    }
                }
            });
            $('.'+CLASSNAME.expandCol, $layerPanel).live('click', function(){
                var $expandCol = $(this);
                var $groupRecord = $(this).parent().parent().parent();
                $layers = $('.'+CLASSNAME.layerRow, $groupRecord);
                if ($expandCol.hasClass(CLASSNAME.expandIcon)) {
                    $expandCol.removeClass(CLASSNAME.expandIcon)
                              .addClass(CLASSNAME.collapseIcon);
                    $layers.hide();
                } else {
                    $expandCol.removeClass(CLASSNAME.collapseIcon)
                              .addClass(CLASSNAME.expandIcon);
                    $layers.show();
                }
            });
            //$recordLists.not($mapRecord).sortable();
            /*
            $recordLists.not($mapRecord).draggable({
                cursor: 'move',
                containment: $recordContainer,
                start: function(event, ui){
                    console.log(event);
                    console.log(ui);
                },
                drag: function(event, ui){
                    
                },
                stop: function(event, ui){
                    
                }
            });*/
            $('.'+CLASSNAME.recordCol, $recordLists).live('click', function(){
                resetRecordStatus();
                $(this).addClass(CLASSNAME.recordOnStatus);
            });
        },
        bindUtilitiesEvents: function(){
            $('#'+ID.moveDown).bind({
                mouseover: onMouseOver,
                mouseout: onMouseOut,
                click: moveDown
            });
            $('#'+ID.moveUp).bind({
                mouseover: onMouseOver,
                mouseout: onMouseOut,
                click: moveUp
            });
            $('#'+ID.newGroup).bind({
                mouseover: onMouseOver,
                mouseout: onMouseOut,
                click: _addGroup
            });
            $('#'+ID.newLayer).bind({
                mouseover: onMouseOver,
                mouseout: onMouseOut,
                click: _addLayer
            });
            $('#'+ID.layerDelete).bind({
                mouseover: onMouseOver,
                mouseout: onMouseOut,
                click: _deleteGroupOrLayer
            });
        }
    };
    var _show = function(){
        $('#'+ID.closeBtn).trigger('click');
    };
    var resetRecordStatus = function(){
        var $recordLists = $('.'+CLASSNAME.recordList, $layerPanel);
        $('.'+CLASSNAME.recordCol, $recordLists).each(function(){
            var $recordList = $(this);
            if ($recordList.hasClass(CLASSNAME.recordOnStatus))
                $recordList.removeClass(CLASSNAME.recordOnStatus);
            if (!$recordList.hasClass(CLASSNAME.recordOffStatus))
                $recordList.addClass(CLASSNAME.recordOffStatus);
        });
    };
    var resetInputStatus = function(){
       $('.'+CLASSNAME.descCol, $layerPanel).each(function(){
            var $descCol = $(this);
            var $input = $(this).next();
            if ($descCol.is(':hidden'))
                $descCol.show();
            if ($input.is(':visible'))
                $input.hide();
        });
    };
    var onFocusOut = function($input){
        var $descCol = $input.prev();
        if ($descCol.is(':hidden')) {
            $descCol.html($input.val())
                    .show();
        }
        if ($input.is(':visible')) {
            $input.hide();
        }
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
    var getRecordList = function(){
        var $recordList = [];
        $('.'+CLASSNAME.recordList, $layerPanel).each(function(){
            if (!$recordList.length) {
                if ($(this).find('.'+CLASSNAME.recordOnStatus).length) {
                    $recordList = $(this);
                    if ($recordList.hasClass(CLASSNAME.groupRecord))
                        $recordList = $recordList.find('.'+CLASSNAME.recordOnStatus).parent();
                    return false;
                }
            }
        });
        return $recordList;
    };
    var getNoMapRecordList = function(){
        var $recordList = [];
        $('.'+CLASSNAME.recordList, $layerPanel).not($mapRecord).each(function(){
            if (!$recordList.length) {
                if ($(this).find('.'+CLASSNAME.recordOnStatus).length) {
                    $recordList = $(this);
                    if ($recordList.hasClass(CLASSNAME.groupRecord))
                        $recordList = $recordList.find('.'+CLASSNAME.recordOnStatus).parent();
                    return false;
                }
            }
        });
        return $recordList;
    };
    var _addGroup = function(){
        var $recordList = getRecordList();
        var $recordListParent = $recordList.parent();
        // group只能有一層, group裡面無法新增group
        if ($recordListParent.hasClass(CLASSNAME.recordList)) { // 點擊group裡任何一筆record
            if ($recordList.hasClass(CLASSNAME.groupRow)) { // 新增group在group record的 group folder之前
                groupCount++;
                resetRecordStatus();
                var html = UITemplates.addGroupRecord({
                    title: CONST.group + groupCount
                });
                var $record = $('<div></div>').addClass(CLASSNAME.recordList)
                                              .addClass(CLASSNAME.groupRecord)
                                              .html(html);
                $record.insertBefore($recordListParent);
            }
        } else { // 新增group在layer record or map record之前
            groupCount++;
            resetRecordStatus();
            var html = UITemplates.addGroupRecord({
                title: CONST.group + groupCount
            });
            var $record = $('<div></div>').addClass(CLASSNAME.recordList)
                                          .addClass(CLASSNAME.groupRecord)
                                          .html(html);
            $record.insertBefore($recordList);
        }
    };
    var _addLayer = function(){
        layerCount++;
        var $recordList = getRecordList();
        resetRecordStatus();
        var html = UITemplates.addLayerRecord({
            icon: CLASSNAME.layerIconCssClass,
            title: CONST.layer + layerCount
        });
        var $recordListParent = $recordList.parent();
        if ($recordListParent.hasClass(CLASSNAME.recordList)) { // 點擊group裡任何一筆record
            if ($recordList.hasClass(CLASSNAME.groupRow)) { // 新增layer在group record的 group folder之前
                var $record = $('<div></div>').addClass(CLASSNAME.recordList)
                                              .addClass(CLASSNAME.layerRecord)
                                              .html(html);
                $record.insertBefore($recordListParent);
            } else { // 新增layer在group裡
                $(html).insertBefore($recordList);
            }
        } else { // 新增layer在layer record or map record之前
            var $record = $('<div></div>').addClass(CLASSNAME.recordList)
                                          .addClass(CLASSNAME.layerRecord)
                                          .html(html);
            $record.insertBefore($recordList);
        }
    };
    var _deleteGroupOrLayer = function(recordType){
        var $recordList = getNoMapRecordList();
        if ($recordList.length) {
            var $recordListParent = $recordList.parent();
            var type = 'layer';
            var label = '圖層';
            if ($recordListParent.hasClass(CLASSNAME.recordList)) { // 點擊group裡任何一筆record
                if ($recordList.hasClass(CLASSNAME.groupRow)) {
                    type = 'group';
                    label = '群組';
                }
            }
            if (typeof recordType == 'string' && recordType != type) {
                alert('請選擇「' + label + '」進行刪除');
                return false;
            }
            if ($recordListParent.hasClass(CLASSNAME.recordList)) { // 點擊group裡任何一筆record
                if ($recordList.hasClass(CLASSNAME.groupRow)) { // 點擊group folder
                    var $nextRecordList = $recordListParent.next();
                    if ($nextRecordList.length) {
                        resetRecordStatus();
                        $recordListParent.remove();
                        $nextRecordList.find('.'+CLASSNAME.recordCol)
                                       .addClass(CLASSNAME.recordOnStatus);
                    }
                } else { // 點擊group裡的layer record
                    var $nextRecordList = $recordList.next();
                    if (!$nextRecordList.length)
                        $nextRecordList = $recordListParent.next();
                    if ($nextRecordList.length) {
                        resetRecordStatus();
                        $recordList.remove();
                        $nextRecordList.find('.'+CLASSNAME.recordCol)
                                       .addClass(CLASSNAME.recordOnStatus);
                    }
                }
            } else { // 點擊layer record
                var $nextRecordList = $recordList.next();
                resetRecordStatus();
                $recordList.remove();
                if ($nextRecordList.length) {
                    $nextRecordList.find('.'+CLASSNAME.recordCol)
                                   .addClass(CLASSNAME.recordOnStatus);
                }
            }
        }
    };
    var moveDown = function(){
        var $recordList = getNoMapRecordList();
        var $recordListParent = $recordList.parent();
        if ($recordListParent.hasClass(CLASSNAME.recordList)) { // 點擊group裡任何一筆record
            if ($recordList.hasClass(CLASSNAME.groupRow)) { // 點擊group folder
                var $nextRecordList = $recordListParent.next();
                if (!$nextRecordList.hasClass(CLASSNAME.mapRecord)) {
                    $recordListParent.clone()
                                     .insertAfter($nextRecordList);
                    $recordListParent.remove();
                }
            } else { // 點擊group裡的layer record
                var $nextRecordList = $recordList.next();
                if ($nextRecordList.length) {
                    $recordList.clone()
                               .insertAfter($nextRecordList);
                    $recordList.remove();
                } else { // 將group裡的layer record移出group
                    var $record = $('<div></div>').addClass(CLASSNAME.recordList)
                                                  .addClass(CLASSNAME.layerRecord)
                                                  .append($recordList.clone());
                    $record.insertAfter($recordListParent);
                    $recordList.remove();
                }
            }
        } else { // 點擊layer record
            var $nextRecordList = $recordList.next();
            if (!$nextRecordList.hasClass(CLASSNAME.mapRecord)) {
                var $groupRow = $nextRecordList.find('.'+CLASSNAME.groupRow);
                if ($groupRow.length) { // 將layer record移入group裡
                    var $record = $recordList.find('.'+CLASSNAME.layerRow)
                                             .clone()
                                             .insertAfter($groupRow);
                    $recordList.remove();
                } else {
                    $recordList.clone()
                               .insertAfter($nextRecordList);
                    $recordList.remove();
                }
            }
        }
    };
    var moveUp = function(){
        var $recordList = getNoMapRecordList();
        var $recordListParent = $recordList.parent();
        if ($recordListParent.hasClass(CLASSNAME.recordList)) { // 點擊group裡任何一筆record
            if ($recordList.hasClass(CLASSNAME.groupRow)) { // 點擊group folder
                var $prevRecordList = $recordListParent.prev();
                if ($prevRecordList.length) {
                    $recordListParent.clone()
                                     .insertBefore($prevRecordList);
                    $recordListParent.remove();
                }
            } else { // 點擊group裡的layer record
                var $prevRecordList = $recordList.prev();
                if ($prevRecordList.length && !$prevRecordList.hasClass(CLASSNAME.groupRow)) {
                    $recordList.clone()
                               .insertBefore($prevRecordList);
                    $recordList.remove();
                } else { // 將group裡的layer record移出group
                    var $record = $('<div></div>').addClass(CLASSNAME.recordList)
                                                  .addClass(CLASSNAME.layerRecord)
                                                  .append($recordList.clone());
                    $record.insertBefore($recordListParent);
                    $recordList.remove();
                }
            }
        } else { // 點擊layer record
            var $prevRecordList = $recordList.prev();
            if ($prevRecordList.length) {
                var $groupRow = $prevRecordList.find('.'+CLASSNAME.groupRow);
                if ($groupRow.length) { // 將layer record移入group裡
                    var $record = $recordList.find('.'+CLASSNAME.layerRow)
                                             .clone()
                                             .appendTo($prevRecordList);
                    $recordList.remove();
                } else {
                    $recordList.clone()
                               .insertBefore($prevRecordList);
                    $recordList.remove();
                }
            }
        }
    };
    this.init = _init;
    this.show = _show;
    this.addGroup = _addGroup;
    this.addLayer = _addLayer;
    this.deleteGroupOrLayer = _deleteGroupOrLayer;
};
UM.extend({
	layerPanel: new LAYERPANEL()
});
UM.addInit(function(){
    UM.layerPanel.init();
});