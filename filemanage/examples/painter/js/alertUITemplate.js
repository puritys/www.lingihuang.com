// This file was automatically generated from alertUITemplate.soy.
// Please don't edit this file by hand.

if (typeof UITemplates == 'undefined') { var UITemplates = {}; }


UITemplates.alertUITemplate = function(opt_data, opt_sb) {
  var output = opt_sb || new soy.StringBuilder();
  output.append('<div class="alert-top-left"></div><div class="alert-top-right"></div><div class="alert-top-center"><div class="alert-hack-ie6"><div id="', soy.$$escapeHtml(opt_data.ids['heading']), '" class="alert-heading-col"></div><div id="', soy.$$escapeHtml(opt_data.ids['closeButton']), '" class="alert-close-button"><img src="../images/alert/close_button.jpg" alt="關閉" title="關閉" /></div></div></div><div class="alert-body-left"></div><div class="alert-body-right"></div><div class="alert-body-center"><div class="alert-hack-ie6"><div class="alert-content-container"><p id="', soy.$$escapeHtml(opt_data.ids['message']), '" class="alert-msg"></p><div class="alert-button-outer-container"><button id="', soy.$$escapeHtml(opt_data.ids['okButton']), '" class="alert-button-inner-container">確定</button></div></div></div></div><div class="alert-bottom-left"></div><div class="alert-bottom-right"></div><div class="alert-bottom-center"><div class="alert-hack-ie6"></div></div><div class="alert-clear-float"></div>');
  if (!opt_sb) return output.toString();
};
