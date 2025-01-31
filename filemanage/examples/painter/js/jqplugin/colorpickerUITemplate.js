// This file was automatically generated from colorpickerUITemplate.soy.
// Please don't edit this file by hand.

if (typeof UITemplates == 'undefined') { var UITemplates = {}; }


UITemplates.colorpickerUITemplate = function(opt_data, opt_sb) {
  var output = opt_sb || new soy.StringBuilder();
  output.append('<div class="colorpicker"><div class="colorpicker_close"><img src="../images/painter/color_picker/colorpicker_close_button.jpg" title="關閉" alt="關閉" /></div><div class="colorpicker_color"><div><div></div></div></div><div class="colorpicker_hue"><div></div></div><div class="colorpicker_new_color"></div><div class="colorpicker_current_color"></div><div class="colorpicker_hex"><input type="text" maxlength="6" size="6" /></div><div class="colorpicker_rgb_r colorpicker_field"><input type="text" maxlength="3" size="3" /><span></span></div><div class="colorpicker_rgb_g colorpicker_field"><input type="text" maxlength="3" size="3" /><span></span></div><div class="colorpicker_rgb_b colorpicker_field"><input type="text" maxlength="3" size="3" /><span></span></div><div class="colorpicker_hsb_h colorpicker_field"><input type="text" maxlength="3" size="3" /><span></span></div><div class="colorpicker_hsb_s colorpicker_field"><input type="text" maxlength="3" size="3" /><span></span></div><div class="colorpicker_hsb_b colorpicker_field"><input type="text" maxlength="3" size="3" /><span></span></div><div class="colorpicker_submit"><div class="button-inner-container">確定</div></div><div class="colorpicker_cancel"><div class="button-inner-container">取消</div></div></div>');
  if (!opt_sb) return output.toString();
};
