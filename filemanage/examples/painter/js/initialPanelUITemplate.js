// This file was automatically generated from initialPanelUITemplate.soy.
// Please don't edit this file by hand.

if (typeof UITemplates == 'undefined') { var UITemplates = {}; }


UITemplates.initialPanelUITemplate = function(opt_data, opt_sb) {
  var output = opt_sb || new soy.StringBuilder();
  output.append('<div class="top-header">UrMapPainter</div><ul class="main-menu"><li><div class="icon-col new-map-icon"></div><div class="title-col">建立新地圖</div><div class="clear-float"></div></li><li><div class="icon-col open-map-icon"></div><div class="title-col">開啟地圖路徑</div><div class="clear-float"></div></li><li><div class="icon-col gallery-icon"></div><div class="title-col">開啟圖庫</div><div class="clear-float"></div></li></ul>');
  if (!opt_sb) return output.toString();
};
