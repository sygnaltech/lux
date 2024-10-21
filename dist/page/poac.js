"use strict";
(() => {
  // node_modules/js-cookie/dist/js.cookie.mjs
  function assign(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];
      for (var key in source) {
        target[key] = source[key];
      }
    }
    return target;
  }
  var defaultConverter = {
    read: function(value) {
      if (value[0] === '"') {
        value = value.slice(1, -1);
      }
      return value.replace(/(%[\dA-F]{2})+/gi, decodeURIComponent);
    },
    write: function(value) {
      return encodeURIComponent(value).replace(
        /%(2[346BF]|3[AC-F]|40|5[BDE]|60|7[BCD])/g,
        decodeURIComponent
      );
    }
  };
  function init(converter, defaultAttributes) {
    function set(name, value, attributes) {
      if (typeof document === "undefined") {
        return;
      }
      attributes = assign({}, defaultAttributes, attributes);
      if (typeof attributes.expires === "number") {
        attributes.expires = new Date(Date.now() + attributes.expires * 864e5);
      }
      if (attributes.expires) {
        attributes.expires = attributes.expires.toUTCString();
      }
      name = encodeURIComponent(name).replace(/%(2[346B]|5E|60|7C)/g, decodeURIComponent).replace(/[()]/g, escape);
      var stringifiedAttributes = "";
      for (var attributeName in attributes) {
        if (!attributes[attributeName]) {
          continue;
        }
        stringifiedAttributes += "; " + attributeName;
        if (attributes[attributeName] === true) {
          continue;
        }
        stringifiedAttributes += "=" + attributes[attributeName].split(";")[0];
      }
      return document.cookie = name + "=" + converter.write(value, name) + stringifiedAttributes;
    }
    function get(name) {
      if (typeof document === "undefined" || arguments.length && !name) {
        return;
      }
      var cookies = document.cookie ? document.cookie.split("; ") : [];
      var jar = {};
      for (var i = 0; i < cookies.length; i++) {
        var parts = cookies[i].split("=");
        var value = parts.slice(1).join("=");
        try {
          var found = decodeURIComponent(parts[0]);
          jar[found] = converter.read(value, found);
          if (name === found) {
            break;
          }
        } catch (e) {
        }
      }
      return name ? jar[name] : jar;
    }
    return Object.create(
      {
        set,
        get,
        remove: function(name, attributes) {
          set(
            name,
            "",
            assign({}, attributes, {
              expires: -1
            })
          );
        },
        withAttributes: function(attributes) {
          return init(this.converter, assign({}, this.attributes, attributes));
        },
        withConverter: function(converter2) {
          return init(assign({}, this.converter, converter2), this.attributes);
        }
      },
      {
        attributes: { value: Object.freeze(defaultAttributes) },
        converter: { value: Object.freeze(converter) }
      }
    );
  }
  var api = init(defaultConverter, { path: "/" });

  // src/popup.ts
  var Popup = class {
    constructor(url, config = {}) {
      var _a, _b, _c, _d, _e;
      this.url = url;
      this.config = {
        width: (_a = config.width) != null ? _a : 800,
        height: (_b = config.height) != null ? _b : 600,
        resizable: (_c = config.resizable) != null ? _c : "no",
        scrollbars: (_d = config.scrollbars) != null ? _d : "yes",
        status: (_e = config.status) != null ? _e : "yes"
      };
    }
    show() {
      const windowFeatures = `width=${this.config.width},height=${this.config.height},resizable=${this.config.resizable},scrollbars=${this.config.scrollbars},status=${this.config.status}`;
      const popup = window.open(this.url, "_blank", windowFeatures);
      if (!popup || popup.closed || typeof popup.closed == "undefined") {
        alert("Pop-up blocked! Please allow pop-ups for this website to proceed.");
      }
    }
  };

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
      document.querySelectorAll('[book="cp"]').forEach((element) => {
        element.addEventListener("click", (event) => {
          event.preventDefault();
          const url = element.href;
          const popup = new Popup(url, { width: 1e3 });
          popup.show();
        });
      });
      api.set("poac", "true");
    }
  };
})();
/*! js-cookie v3.0.5 | MIT */
//# sourceMappingURL=poac.js.map
