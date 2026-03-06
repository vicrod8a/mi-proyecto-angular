import {
  Card,
  CardModule,
  SidebarComponent,
  SidebarService
} from "./chunk-LQ6ABAKB.js";
import {
  Button,
  ButtonModule
} from "./chunk-HWDZGNHS.js";
import "./chunk-JNXR6VHA.js";
import {
  AsyncPipe,
  CommonModule,
  Component,
  RouterModule,
  setClassMetadata,
  ɵsetClassDebugInfo,
  ɵɵadvance,
  ɵɵclassProp,
  ɵɵdefineComponent,
  ɵɵdirectiveInject,
  ɵɵelement,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵlistener,
  ɵɵpipe,
  ɵɵpipeBind1,
  ɵɵtext
} from "./chunk-ANLN36LO.js";

// src/app/pages/home/home.component.ts
var HomeComponent = class _HomeComponent {
  sidebarService;
  constructor(sidebarService) {
    this.sidebarService = sidebarService;
  }
  toggleSidebar() {
    this.sidebarService.toggleSidebar();
  }
  static \u0275fac = function HomeComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _HomeComponent)(\u0275\u0275directiveInject(SidebarService));
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _HomeComponent, selectors: [["app-home"]], decls: 33, vars: 4, consts: [[1, "content"], [1, "dashboard-header"], [1, "header-top"], ["title", "Men\xFA", 1, "menu-toggle", 3, "click"], [1, "pi", "pi-bars"], [1, "pi", "pi-home"], [1, "dashboard-grid"], ["header", "Resumen", 1, "dashboard-card"], ["label", "Ver Detalles", "icon", "pi pi-eye", 1, "mt-3"], ["header", "Actividad Reciente", 1, "dashboard-card"], [1, "activity-list"], [1, "pi", "pi-check-circle"], [1, "pi", "pi-user"], [1, "pi", "pi-bell"], ["header", "Acciones R\xE1pidas", 1, "dashboard-card"], [1, "action-buttons"], ["label", "Agregar Nuevo", "icon", "pi pi-plus", 1, "p-button-success"], ["label", "Configuraci\xF3n", "icon", "pi pi-cog", 1, "p-button-secondary", "ml-2"], ["label", "Reportes", "icon", "pi pi-chart-bar", 1, "p-button-info", "ml-2"]], template: function HomeComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275element(0, "app-sidebar");
      \u0275\u0275elementStart(1, "div", 0);
      \u0275\u0275pipe(2, "async");
      \u0275\u0275elementStart(3, "div", 1)(4, "div", 2)(5, "button", 3);
      \u0275\u0275listener("click", function HomeComponent_Template_button_click_5_listener() {
        return ctx.toggleSidebar();
      });
      \u0275\u0275element(6, "i", 4);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(7, "h1");
      \u0275\u0275element(8, "i", 5);
      \u0275\u0275text(9, " Panel de Control");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(10, "p");
      \u0275\u0275text(11, "Bienvenido a tu panel principal");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(12, "div", 6)(13, "p-card", 7)(14, "p");
      \u0275\u0275text(15, "Esta es tu \xE1rea de panel principal. Puedes agregar gr\xE1ficos, estad\xEDsticas y otros componentes aqu\xED.");
      \u0275\u0275elementEnd();
      \u0275\u0275element(16, "p-button", 8);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(17, "p-card", 9)(18, "ul", 10)(19, "li");
      \u0275\u0275element(20, "i", 11);
      \u0275\u0275text(21, " Usuario inici\xF3 sesi\xF3n correctamente");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(22, "li");
      \u0275\u0275element(23, "i", 12);
      \u0275\u0275text(24, " Perfil actualizado");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(25, "li");
      \u0275\u0275element(26, "i", 13);
      \u0275\u0275text(27, " Nueva notificaci\xF3n recibida");
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(28, "p-card", 14)(29, "div", 15);
      \u0275\u0275element(30, "p-button", 16)(31, "p-button", 17)(32, "p-button", 18);
      \u0275\u0275elementEnd()()()();
    }
    if (rf & 2) {
      \u0275\u0275advance();
      \u0275\u0275classProp("sidebar-collapsed", !\u0275\u0275pipeBind1(2, 2, ctx.sidebarService.sidebarVisible$));
    }
  }, dependencies: [CommonModule, RouterModule, SidebarComponent, CardModule, Card, ButtonModule, Button, AsyncPipe], styles: ["\n\n.content[_ngcontent-%COMP%] {\n  margin-left: 250px;\n  padding: 20px;\n  background-color: #f8f9fa;\n  min-height: 100vh;\n  transition: margin-left 0.3s ease;\n  box-sizing: border-box;\n  width: calc(100% - 250px);\n  overflow-x: hidden;\n}\n.content.sidebar-collapsed[_ngcontent-%COMP%] {\n  margin-left: 70px;\n  width: calc(100% - 70px);\n}\n.dashboard-header[_ngcontent-%COMP%] {\n  margin-bottom: 30px;\n}\n.header-top[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 15px;\n  margin-bottom: 20px;\n  flex-wrap: wrap;\n}\n.menu-toggle[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      135deg,\n      #667eea 0%,\n      #764ba2 100%);\n  border: none;\n  color: white;\n  width: 45px;\n  height: 45px;\n  border-radius: 8px;\n  font-size: 1.5rem;\n  cursor: pointer;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  transition: all 0.3s ease;\n  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);\n  flex-shrink: 0;\n}\n.menu-toggle[_ngcontent-%COMP%]:hover {\n  transform: scale(1.05);\n  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);\n}\n.menu-toggle[_ngcontent-%COMP%]:active {\n  transform: scale(0.95);\n}\n.dashboard-header[_ngcontent-%COMP%]   h1[_ngcontent-%COMP%] {\n  color: #495057;\n  font-size: 2rem;\n  margin: 0;\n  display: flex;\n  align-items: center;\n  gap: 10px;\n  word-break: break-word;\n}\n.dashboard-header[_ngcontent-%COMP%]   h1[_ngcontent-%COMP%]   i[_ngcontent-%COMP%] {\n  color: #6c757d;\n  flex-shrink: 0;\n}\n.dashboard-header[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  color: #6c757d;\n  font-size: 1rem;\n  margin: 5px 0 0;\n  word-break: break-word;\n}\n.dashboard-grid[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));\n  gap: 20px;\n}\n.dashboard-card[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      135deg,\n      #ffffff 0%,\n      #f1f3f4 100%);\n  border-radius: 12px;\n  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);\n  border: 1px solid #e9ecef;\n  transition: transform 0.3s ease, box-shadow 0.3s ease;\n  padding: 20px;\n}\n.dashboard-card[_ngcontent-%COMP%]:hover {\n  transform: translateY(-2px);\n  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);\n}\n.activity-list[_ngcontent-%COMP%] {\n  list-style: none;\n  padding: 0;\n  margin: 0;\n}\n.activity-list[_ngcontent-%COMP%]   li[_ngcontent-%COMP%] {\n  padding: 10px 0;\n  border-bottom: 1px solid #ecf0f1;\n  display: flex;\n  align-items: center;\n  gap: 10px;\n  word-break: break-word;\n}\n.activity-list[_ngcontent-%COMP%]   li[_ngcontent-%COMP%]:last-child {\n  border-bottom: none;\n}\n.activity-list[_ngcontent-%COMP%]   i[_ngcontent-%COMP%] {\n  color: #6c757d;\n  font-size: 1.1rem;\n  flex-shrink: 0;\n}\n.action-buttons[_ngcontent-%COMP%] {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 10px;\n}\n.action-buttons[_ngcontent-%COMP%]   p-button[_ngcontent-%COMP%] {\n  flex: 1;\n  min-width: 120px;\n}\n.ml-2[_ngcontent-%COMP%] {\n  margin-left: 10px !important;\n}\n.mt-3[_ngcontent-%COMP%] {\n  margin-top: 15px !important;\n}\n@media (max-width: 1024px) {\n  .content[_ngcontent-%COMP%] {\n    margin-left: 250px;\n    width: calc(100% - 250px);\n  }\n  .dashboard-header[_ngcontent-%COMP%]   h1[_ngcontent-%COMP%] {\n    font-size: 1.8rem;\n  }\n  .dashboard-header[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n    font-size: 0.95rem;\n  }\n  .dashboard-grid[_ngcontent-%COMP%] {\n    grid-template-columns: 1fr;\n  }\n}\n@media (max-width: 768px) {\n  .content[_ngcontent-%COMP%] {\n    margin-left: 0;\n    width: 100%;\n    padding: 15px;\n  }\n  .content.sidebar-collapsed[_ngcontent-%COMP%] {\n    margin-left: 0;\n    width: 100%;\n  }\n  .header-top[_ngcontent-%COMP%] {\n    gap: 10px;\n  }\n  .menu-toggle[_ngcontent-%COMP%] {\n    width: 40px;\n    height: 40px;\n    font-size: 1.2rem;\n  }\n  .dashboard-header[_ngcontent-%COMP%]   h1[_ngcontent-%COMP%] {\n    font-size: 1.5rem;\n  }\n  .dashboard-header[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n    font-size: 0.9rem;\n  }\n  .dashboard-grid[_ngcontent-%COMP%] {\n    grid-template-columns: 1fr;\n    gap: 15px;\n  }\n  .dashboard-card[_ngcontent-%COMP%] {\n    padding: 15px;\n  }\n  .activity-list[_ngcontent-%COMP%]   li[_ngcontent-%COMP%] {\n    padding: 8px 0;\n    font-size: 0.9rem;\n  }\n  .action-buttons[_ngcontent-%COMP%] {\n    gap: 8px;\n  }\n}\n@media (max-width: 480px) {\n  .content[_ngcontent-%COMP%] {\n    padding: 10px;\n  }\n  .header-top[_ngcontent-%COMP%] {\n    gap: 8px;\n    margin-bottom: 15px;\n  }\n  .menu-toggle[_ngcontent-%COMP%] {\n    width: 38px;\n    height: 38px;\n    font-size: 1rem;\n  }\n  .dashboard-header[_ngcontent-%COMP%]   h1[_ngcontent-%COMP%] {\n    font-size: 1.2rem;\n    gap: 8px;\n  }\n  .dashboard-header[_ngcontent-%COMP%]   h1[_ngcontent-%COMP%]   i[_ngcontent-%COMP%] {\n    font-size: 1.1rem;\n  }\n  .dashboard-header[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n    font-size: 0.85rem;\n  }\n  .dashboard-grid[_ngcontent-%COMP%] {\n    gap: 12px;\n  }\n  .dashboard-card[_ngcontent-%COMP%] {\n    padding: 12px;\n  }\n  .activity-list[_ngcontent-%COMP%]   li[_ngcontent-%COMP%] {\n    padding: 6px 0;\n    font-size: 0.85rem;\n    gap: 8px;\n  }\n  .activity-list[_ngcontent-%COMP%]   i[_ngcontent-%COMP%] {\n    font-size: 1rem;\n  }\n  .action-buttons[_ngcontent-%COMP%] {\n    flex-direction: column;\n  }\n  .action-buttons[_ngcontent-%COMP%]   p-button[_ngcontent-%COMP%] {\n    min-width: 100%;\n  }\n}\n.activity-list[_ngcontent-%COMP%]   i[_ngcontent-%COMP%] {\n  color: #6c757d;\n  font-size: 1.2rem;\n}\n.action-buttons[_ngcontent-%COMP%] {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 10px;\n}\n.action-buttons[_ngcontent-%COMP%]   .p-button[_ngcontent-%COMP%] {\n  flex: 1;\n  min-width: 120px;\n  background:\n    linear-gradient(\n      135deg,\n      #6c757d 0%,\n      #495057 100%);\n  border: none;\n  color: white;\n  transition: background 0.3s ease;\n}\n.action-buttons[_ngcontent-%COMP%]   .p-button[_ngcontent-%COMP%]:hover {\n  background:\n    linear-gradient(\n      135deg,\n      #5a6268 0%,\n      #343a40 100%);\n}\n@media (max-width: 768px) {\n  .content[_ngcontent-%COMP%] {\n    margin-left: 0;\n    padding: 15px;\n  }\n  .dashboard-header[_ngcontent-%COMP%]   h1[_ngcontent-%COMP%] {\n    font-size: 2rem;\n  }\n  .dashboard-grid[_ngcontent-%COMP%] {\n    grid-template-columns: 1fr;\n  }\n}\n/*# sourceMappingURL=home.component.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(HomeComponent, [{
    type: Component,
    args: [{ selector: "app-home", standalone: true, imports: [CommonModule, RouterModule, SidebarComponent, CardModule, ButtonModule], template: '<app-sidebar></app-sidebar>\r\n<div class="content" [class.sidebar-collapsed]="!(sidebarService.sidebarVisible$ | async)">\r\n  <div class="dashboard-header">\r\n    <div class="header-top">\r\n      <button class="menu-toggle" (click)="toggleSidebar()" title="Men\xFA">\r\n        <i class="pi pi-bars"></i>\r\n      </button>\r\n      <h1><i class="pi pi-home"></i> Panel de Control</h1>\r\n    </div>\r\n    <p>Bienvenido a tu panel principal</p>\r\n  </div>\r\n\r\n  <div class="dashboard-grid">\r\n    <p-card header="Resumen" class="dashboard-card">\r\n      <p>Esta es tu \xE1rea de panel principal. Puedes agregar gr\xE1ficos, estad\xEDsticas y otros componentes aqu\xED.</p>\r\n      <p-button label="Ver Detalles" icon="pi pi-eye" class="mt-3"></p-button>\r\n    </p-card>\r\n\r\n    <p-card header="Actividad Reciente" class="dashboard-card">\r\n      <ul class="activity-list">\r\n        <li><i class="pi pi-check-circle"></i> Usuario inici\xF3 sesi\xF3n correctamente</li>\r\n        <li><i class="pi pi-user"></i> Perfil actualizado</li>\r\n        <li><i class="pi pi-bell"></i> Nueva notificaci\xF3n recibida</li>\r\n      </ul>\r\n    </p-card>\r\n\r\n    <p-card header="Acciones R\xE1pidas" class="dashboard-card">\r\n      <div class="action-buttons">\r\n        <p-button label="Agregar Nuevo" icon="pi pi-plus" class="p-button-success"></p-button>\r\n        <p-button label="Configuraci\xF3n" icon="pi pi-cog" class="p-button-secondary ml-2"></p-button>\r\n        <p-button label="Reportes" icon="pi pi-chart-bar" class="p-button-info ml-2"></p-button>\r\n      </div>\r\n    </p-card>\r\n  </div>\r\n</div>', styles: ["/* src/app/pages/home/home.component.css */\n.content {\n  margin-left: 250px;\n  padding: 20px;\n  background-color: #f8f9fa;\n  min-height: 100vh;\n  transition: margin-left 0.3s ease;\n  box-sizing: border-box;\n  width: calc(100% - 250px);\n  overflow-x: hidden;\n}\n.content.sidebar-collapsed {\n  margin-left: 70px;\n  width: calc(100% - 70px);\n}\n.dashboard-header {\n  margin-bottom: 30px;\n}\n.header-top {\n  display: flex;\n  align-items: center;\n  gap: 15px;\n  margin-bottom: 20px;\n  flex-wrap: wrap;\n}\n.menu-toggle {\n  background:\n    linear-gradient(\n      135deg,\n      #667eea 0%,\n      #764ba2 100%);\n  border: none;\n  color: white;\n  width: 45px;\n  height: 45px;\n  border-radius: 8px;\n  font-size: 1.5rem;\n  cursor: pointer;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  transition: all 0.3s ease;\n  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);\n  flex-shrink: 0;\n}\n.menu-toggle:hover {\n  transform: scale(1.05);\n  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);\n}\n.menu-toggle:active {\n  transform: scale(0.95);\n}\n.dashboard-header h1 {\n  color: #495057;\n  font-size: 2rem;\n  margin: 0;\n  display: flex;\n  align-items: center;\n  gap: 10px;\n  word-break: break-word;\n}\n.dashboard-header h1 i {\n  color: #6c757d;\n  flex-shrink: 0;\n}\n.dashboard-header p {\n  color: #6c757d;\n  font-size: 1rem;\n  margin: 5px 0 0;\n  word-break: break-word;\n}\n.dashboard-grid {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));\n  gap: 20px;\n}\n.dashboard-card {\n  background:\n    linear-gradient(\n      135deg,\n      #ffffff 0%,\n      #f1f3f4 100%);\n  border-radius: 12px;\n  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);\n  border: 1px solid #e9ecef;\n  transition: transform 0.3s ease, box-shadow 0.3s ease;\n  padding: 20px;\n}\n.dashboard-card:hover {\n  transform: translateY(-2px);\n  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);\n}\n.activity-list {\n  list-style: none;\n  padding: 0;\n  margin: 0;\n}\n.activity-list li {\n  padding: 10px 0;\n  border-bottom: 1px solid #ecf0f1;\n  display: flex;\n  align-items: center;\n  gap: 10px;\n  word-break: break-word;\n}\n.activity-list li:last-child {\n  border-bottom: none;\n}\n.activity-list i {\n  color: #6c757d;\n  font-size: 1.1rem;\n  flex-shrink: 0;\n}\n.action-buttons {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 10px;\n}\n.action-buttons p-button {\n  flex: 1;\n  min-width: 120px;\n}\n.ml-2 {\n  margin-left: 10px !important;\n}\n.mt-3 {\n  margin-top: 15px !important;\n}\n@media (max-width: 1024px) {\n  .content {\n    margin-left: 250px;\n    width: calc(100% - 250px);\n  }\n  .dashboard-header h1 {\n    font-size: 1.8rem;\n  }\n  .dashboard-header p {\n    font-size: 0.95rem;\n  }\n  .dashboard-grid {\n    grid-template-columns: 1fr;\n  }\n}\n@media (max-width: 768px) {\n  .content {\n    margin-left: 0;\n    width: 100%;\n    padding: 15px;\n  }\n  .content.sidebar-collapsed {\n    margin-left: 0;\n    width: 100%;\n  }\n  .header-top {\n    gap: 10px;\n  }\n  .menu-toggle {\n    width: 40px;\n    height: 40px;\n    font-size: 1.2rem;\n  }\n  .dashboard-header h1 {\n    font-size: 1.5rem;\n  }\n  .dashboard-header p {\n    font-size: 0.9rem;\n  }\n  .dashboard-grid {\n    grid-template-columns: 1fr;\n    gap: 15px;\n  }\n  .dashboard-card {\n    padding: 15px;\n  }\n  .activity-list li {\n    padding: 8px 0;\n    font-size: 0.9rem;\n  }\n  .action-buttons {\n    gap: 8px;\n  }\n}\n@media (max-width: 480px) {\n  .content {\n    padding: 10px;\n  }\n  .header-top {\n    gap: 8px;\n    margin-bottom: 15px;\n  }\n  .menu-toggle {\n    width: 38px;\n    height: 38px;\n    font-size: 1rem;\n  }\n  .dashboard-header h1 {\n    font-size: 1.2rem;\n    gap: 8px;\n  }\n  .dashboard-header h1 i {\n    font-size: 1.1rem;\n  }\n  .dashboard-header p {\n    font-size: 0.85rem;\n  }\n  .dashboard-grid {\n    gap: 12px;\n  }\n  .dashboard-card {\n    padding: 12px;\n  }\n  .activity-list li {\n    padding: 6px 0;\n    font-size: 0.85rem;\n    gap: 8px;\n  }\n  .activity-list i {\n    font-size: 1rem;\n  }\n  .action-buttons {\n    flex-direction: column;\n  }\n  .action-buttons p-button {\n    min-width: 100%;\n  }\n}\n.activity-list i {\n  color: #6c757d;\n  font-size: 1.2rem;\n}\n.action-buttons {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 10px;\n}\n.action-buttons .p-button {\n  flex: 1;\n  min-width: 120px;\n  background:\n    linear-gradient(\n      135deg,\n      #6c757d 0%,\n      #495057 100%);\n  border: none;\n  color: white;\n  transition: background 0.3s ease;\n}\n.action-buttons .p-button:hover {\n  background:\n    linear-gradient(\n      135deg,\n      #5a6268 0%,\n      #343a40 100%);\n}\n@media (max-width: 768px) {\n  .content {\n    margin-left: 0;\n    padding: 15px;\n  }\n  .dashboard-header h1 {\n    font-size: 2rem;\n  }\n  .dashboard-grid {\n    grid-template-columns: 1fr;\n  }\n}\n/*# sourceMappingURL=home.component.css.map */\n"] }]
  }], () => [{ type: SidebarService }], null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(HomeComponent, { className: "HomeComponent", filePath: "src/app/pages/home/home.component.ts", lineNumber: 16 });
})();
export {
  HomeComponent
};
//# sourceMappingURL=chunk-Q5D7LUPL.js.map
