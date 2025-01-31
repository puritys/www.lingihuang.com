// This file was automatically generated from painterUITemplate.soy.
// Please don't edit this file by hand.

if (typeof UITemplates == 'undefined') { var UITemplates = {}; }


UITemplates.mapPanelUITemplate = function(opt_data, opt_sb) {
  var output = opt_sb || new soy.StringBuilder();
  output.append('<div id="', soy.$$escapeHtml(opt_data.mapPanelId), '" class="map-panel"><div class="top-left"></div><div class="top-right"></div><div class="top-center"><div class="hack-ie6"><div class="close-button"><img src="../images/painter/close_button.jpg" alt="關閉" title="關閉" /></div><h2 class="panel-heading">', soy.$$escapeHtml(opt_data.title), '</h2><input class="input-text hidden-status" type="text" value="', soy.$$escapeHtml(opt_data.title), '" /></div></div><div class="body-left"></div><div class="body-right"></div><div class="body-center"><div class="map-container"></div></div><div class="bottom-left"></div><div class="bottom-right"></div><div class="bottom-center"><div class="hack-ie6"></div></div><div class="clear-float"></div></div>');
  if (!opt_sb) return output.toString();
};


UITemplates.addLayerRecord = function(opt_data, opt_sb) {
  var output = opt_sb || new soy.StringBuilder();
  output.append('<div class="layer-row"><div class="eye-col"><div class="eye-outer-container"><div class="eye-inner-container eye-on-status"></div></div></div><div class="right-record-col on-status"><div class="vertical-splitter"></div><div class="icon-col ', soy.$$escapeHtml(opt_data.icon), '"></div><div class="desc-col">', soy.$$escapeHtml(opt_data.title), '</div><input class="input-text hidden-status" type="text" value="', soy.$$escapeHtml(opt_data.title), '" /><div class="clear-float"></div></div><div class="clear-float"></div><div class="record-splitter"></div></div>');
  if (!opt_sb) return output.toString();
};


UITemplates.addGroupRecord = function(opt_data, opt_sb) {
  var output = opt_sb || new soy.StringBuilder();
  output.append('<div class="group-row"><div class="eye-col"><div class="eye-outer-container"><div class="eye-inner-container eye-on-status"></div></div></div><div class="right-record-col on-status"><div class="vertical-splitter"></div><div class="arrow-col expand-icon"></div><div class="icon-col group-icon"></div><div class="desc-col">', soy.$$escapeHtml(opt_data.title), '</div><input class="input-text hidden-status" type="text" value="', soy.$$escapeHtml(opt_data.title), '" /><div class="clear-float"></div></div><div class="clear-float"></div><div class="record-splitter"></div></div>');
  if (!opt_sb) return output.toString();
};


UITemplates.addMapRecord = function(opt_data, opt_sb) {
  var output = opt_sb || new soy.StringBuilder();
  output.append('<div class="record-list map-record"><div class="eye-col"><div class="eye-outer-container"><div class="eye-inner-container eye-on-status"></div></div></div><div class="right-record-col on-status"><div class="vertical-splitter"></div><div class="map-thumbnail-container"></div><div class="map-desc-col">地圖</div><div class="icon-col lock-icon"></div><div class="clear-float"></div></div><div class="clear-float"></div></div>');
  if (!opt_sb) return output.toString();
};
