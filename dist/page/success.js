"use strict";
(() => {
  // src/page/success.ts
  var SuccessPage = class {
    constructor() {
    }
    setup() {
    }
    exec() {
      if (localStorage.getItem("poac")) {
        document.querySelectorAll('[conditional="poac"]').forEach((element) => {
          element.style.setProperty("display", "block", "important");
        });
      }
    }
  };
})();
//# sourceMappingURL=success.js.map
