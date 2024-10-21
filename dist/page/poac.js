"use strict";
(() => {
  // src/page/poac.ts
  var PoacPage = class {
    constructor() {
    }
    setup() {
    }
    exec() {
      var SimplybookWidget;
      console.log("exec");
      (function(w, d, s, i) {
        const script = d.createElement(s);
        script.async = true;
        script.src = "//widget.simplybook.me/v2/widget/widget.js";
        script.onload = function() {
          const widgetConstructor = w.SimplybookWidget;
          if (typeof widgetConstructor !== "function") {
            console.error("SimplybookWidget is not defined as a function. The script may not have loaded properly.");
            return;
          }
          const widget = new widgetConstructor({
            "widget_type": "button",
            "url": "https://luxradiology.simplybook.me",
            "theme": "air",
            "theme_settings": {
              "timeline_modern_display": "as_slots",
              "timeline_hide_unavailable": "1",
              "hide_past_days": "0",
              "timeline_show_end_time": "0",
              "sb_base_color": "#d75481",
              "display_item_mode": "list",
              "booking_nav_bg_color": "#58b9db",
              "body_bg_color": "#f2f2f2",
              "sb_review_image": "",
              "dark_font_color": "#333333",
              "light_font_color": "#ffffff",
              "btn_color_1": "#d75481",
              "sb_company_label_color": "#ffffff",
              "hide_img_mode": "1",
              "show_sidebar": "1",
              "sb_busy": "#b3b3b3",
              "sb_available": "#ffdee8"
            },
            "timeline": "modern",
            "datepicker": "top_calendar",
            "is_rtl": false,
            "app_config": {
              "clear_session": 1,
              "allow_switch_to_ada": 0,
              "predefined": {}
            },
            "button_title": "Book now",
            "button_background_color": "#d75481",
            "button_text_color": "#ffffff",
            "button_position": "right",
            "button_position_offset": "55%",
            "container_id": i
          });
          d.querySelectorAll('[book="sbm"]').forEach((element) => {
            element.addEventListener("click", () => {
              widget.options.app_config.predefined.service = element.getAttribute("book-serviceid");
              console.log(widget);
              widget.showPopupFrame("book");
            });
          });
        };
        d.head.appendChild(script);
      })(window, document, "script", "sbw_0kr3c2");
    }
  };
})();
//# sourceMappingURL=poac.js.map
