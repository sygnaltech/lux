"use strict";
(() => {
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
})();
//# sourceMappingURL=popup.js.map
