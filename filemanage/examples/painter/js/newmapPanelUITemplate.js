// This file was automatically generated from newmapPanelUITemplate.soy.
// Please don't edit this file by hand.

if (typeof UITemplates == 'undefined') { var UITemplates = {}; }


UITemplates.newmapPanelUITemplate = function(opt_data, opt_sb) {
  var output = opt_sb || new soy.StringBuilder();
  output.append('<div class="label-row"><div class="label-col">名稱</div><div id="fileNameMsgDiv" class="msg-col"></div><div class="clear-float"></div></div><div class="input-row"><input id="fileNameInput" class="filename-input input-text input-text-default" type="text" value="未命名-1" /></div><div class="label-row"><div class="label-col">尺寸</div><div id="fileSizeMsgDiv" class="msg-col"></div><div class="clear-float"></div></div><div class="input-row"><div class="size-input-section"><div class="label-col">寬度</div><input id="fileWidthInput" class="width-input input-text input-text-default" type="text" value="800" /><div class="unit-col">px</div><div class="clear-float"></div></div><div class="size-input-section"><div class="label-col">高度</div><input id="fileHeightInput" class="height-input input-text input-text-default" type="text" value="500" /><div class="unit-col">px</div><div class="clear-float"></div></div><div class="clear-float"></div></div><div class="button-row"><div class="button-outer-container"><div id="submitBtnDiv" class="button-inner-container">確定</div></div><div class="button-outer-container"><div id="cancelBtnDiv" class="button-inner-container">取消</div></div><div class="clear-float"></div></div>');
  if (!opt_sb) return output.toString();
};
