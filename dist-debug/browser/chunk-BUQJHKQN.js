import {
  Component,
  RouterLink,
  RouterModule,
  setClassMetadata,
  ɵsetClassDebugInfo,
  ɵɵdefineComponent,
  ɵɵelement,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵtext
} from "./chunk-ANLN36LO.js";

// src/app/pages/landing/landing.component.ts
var LandingComponent = class _LandingComponent {
  static \u0275fac = function LandingComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _LandingComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _LandingComponent, selectors: [["app-landing"]], decls: 10, vars: 0, consts: [[1, "hero"], [1, "hero-content"], [1, "buttons"], ["routerLink", "/auth/login", 1, "btn", "primary"], ["routerLink", "/auth/register", 1, "btn", "secondary"]], template: function LandingComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "section", 0)(1, "div", 1)(2, "h1");
      \u0275\u0275text(3, "Bienvenido");
      \u0275\u0275elementEnd();
      \u0275\u0275element(4, "p");
      \u0275\u0275elementStart(5, "div", 2)(6, "button", 3);
      \u0275\u0275text(7, " Iniciar sesi\xF3n ");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(8, "button", 4);
      \u0275\u0275text(9, " Crear cuenta ");
      \u0275\u0275elementEnd()()()();
    }
  }, dependencies: [RouterModule, RouterLink], styles: ['\n\n.hero[_ngcontent-%COMP%] {\n  height: 100vh;\n  background:\n    linear-gradient(\n      135deg,\n      #1e293b,\n      #0f172a);\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  text-align: center;\n  color: white;\n  font-family: "Segoe UI", sans-serif;\n}\n.hero-content[_ngcontent-%COMP%] {\n  max-width: 600px;\n}\n.hero[_ngcontent-%COMP%]   h1[_ngcontent-%COMP%] {\n  font-size: 3rem;\n  margin-bottom: 1rem;\n}\n.hero[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  font-size: 1.2rem;\n  margin-bottom: 2rem;\n  color: #cbd5e1;\n}\n.buttons[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: center;\n  gap: 1rem;\n}\n.btn[_ngcontent-%COMP%] {\n  padding: 12px 28px;\n  border-radius: 8px;\n  font-size: 1rem;\n  cursor: pointer;\n  border: none;\n  transition: 0.3s ease;\n}\n.primary[_ngcontent-%COMP%] {\n  background-color: #3b82f6;\n  color: white;\n}\n.primary[_ngcontent-%COMP%]:hover {\n  background-color: #2563eb;\n}\n.secondary[_ngcontent-%COMP%] {\n  background-color: transparent;\n  border: 2px solid #3b82f6;\n  color: #3b82f6;\n}\n.secondary[_ngcontent-%COMP%]:hover {\n  background-color: #3b82f6;\n  color: white;\n}\n/*# sourceMappingURL=landing.component.css.map */'] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(LandingComponent, [{
    type: Component,
    args: [{ selector: "app-landing", standalone: true, imports: [RouterModule], template: '<section class="hero">\r\n  <div class="hero-content">\r\n    <h1>Bienvenido</h1>\r\n    <p></p>\r\n\r\n    <div class="buttons">\r\n      <button routerLink="/auth/login" class="btn primary">\r\n        Iniciar sesi\xF3n\r\n      </button>\r\n\r\n      <button routerLink="/auth/register" class="btn secondary">\r\n       Crear cuenta\r\n      </button>\r\n    </div>\r\n  </div>\r\n</section>', styles: ['/* src/app/pages/landing/landing.component.css */\n.hero {\n  height: 100vh;\n  background:\n    linear-gradient(\n      135deg,\n      #1e293b,\n      #0f172a);\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  text-align: center;\n  color: white;\n  font-family: "Segoe UI", sans-serif;\n}\n.hero-content {\n  max-width: 600px;\n}\n.hero h1 {\n  font-size: 3rem;\n  margin-bottom: 1rem;\n}\n.hero p {\n  font-size: 1.2rem;\n  margin-bottom: 2rem;\n  color: #cbd5e1;\n}\n.buttons {\n  display: flex;\n  justify-content: center;\n  gap: 1rem;\n}\n.btn {\n  padding: 12px 28px;\n  border-radius: 8px;\n  font-size: 1rem;\n  cursor: pointer;\n  border: none;\n  transition: 0.3s ease;\n}\n.primary {\n  background-color: #3b82f6;\n  color: white;\n}\n.primary:hover {\n  background-color: #2563eb;\n}\n.secondary {\n  background-color: transparent;\n  border: 2px solid #3b82f6;\n  color: #3b82f6;\n}\n.secondary:hover {\n  background-color: #3b82f6;\n  color: white;\n}\n/*# sourceMappingURL=landing.component.css.map */\n'] }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(LandingComponent, { className: "LandingComponent", filePath: "src/app/pages/landing/landing.component.ts", lineNumber: 11 });
})();
export {
  LandingComponent
};
//# sourceMappingURL=chunk-BUQJHKQN.js.map
