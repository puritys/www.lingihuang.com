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
