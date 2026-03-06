import {
  BaseComponent,
  Bind,
  BindModule,
  ButtonModule,
  PARENT_INSTANCE
} from "./chunk-HWDZGNHS.js";
import {
  BaseStyle,
  Footer,
  Header,
  PrimeTemplate,
  SharedModule,
  k
} from "./chunk-JNXR6VHA.js";
import {
  BehaviorSubject,
  ChangeDetectionStrategy,
  CommonModule,
  Component,
  ContentChild,
  ContentChildren,
  Injectable,
  InjectionToken,
  Input,
  NgIf,
  NgModule,
  NgTemplateOutlet,
  RouterLink,
  RouterLinkActive,
  RouterModule,
  ViewEncapsulation,
  inject,
  setClassMetadata,
  signal,
  ɵsetClassDebugInfo,
  ɵɵHostDirectivesFeature,
  ɵɵInheritDefinitionFeature,
  ɵɵProvidersFeature,
  ɵɵadvance,
  ɵɵclassMap,
  ɵɵcontentQuery,
  ɵɵdefineComponent,
  ɵɵdefineInjectable,
  ɵɵdefineInjector,
  ɵɵdefineNgModule,
  ɵɵdirectiveInject,
  ɵɵelement,
  ɵɵelementContainer,
  ɵɵelementContainerEnd,
  ɵɵelementContainerStart,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵgetCurrentView,
  ɵɵgetInheritedFactory,
  ɵɵlistener,
  ɵɵloadQuery,
  ɵɵnextContext,
  ɵɵprojection,
  ɵɵprojectionDef,
  ɵɵproperty,
  ɵɵqueryRefresh,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵstyleMap,
  ɵɵtemplate,
  ɵɵtext,
  ɵɵtextInterpolate
} from "./chunk-ANLN36LO.js";

// node_modules/@primeuix/styles/dist/card/index.mjs
var style = "\n    .p-card {\n        background: dt('card.background');\n        color: dt('card.color');\n        box-shadow: dt('card.shadow');\n        border-radius: dt('card.border.radius');\n        display: flex;\n        flex-direction: column;\n    }\n\n    .p-card-caption {\n        display: flex;\n        flex-direction: column;\n        gap: dt('card.caption.gap');\n    }\n\n    .p-card-body {\n        padding: dt('card.body.padding');\n        display: flex;\n        flex-direction: column;\n        gap: dt('card.body.gap');\n    }\n\n    .p-card-title {\n        font-size: dt('card.title.font.size');\n        font-weight: dt('card.title.font.weight');\n    }\n\n    .p-card-subtitle {\n        color: dt('card.subtitle.color');\n    }\n";

// node_modules/primeng/fesm2022/primeng-card.mjs
var _c0 = ["header"];
var _c1 = ["title"];
var _c2 = ["subtitle"];
var _c3 = ["content"];
var _c4 = ["footer"];
var _c5 = ["*", [["p-header"]], [["p-footer"]]];
var _c6 = ["*", "p-header", "p-footer"];
function Card_div_0_ng_container_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementContainer(0);
  }
}
function Card_div_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 1);
    \u0275\u0275projection(1, 1);
    \u0275\u0275template(2, Card_div_0_ng_container_2_Template, 1, 0, "ng-container", 2);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275classMap(ctx_r0.cx("header"));
    \u0275\u0275property("pBind", ctx_r0.ptm("header"));
    \u0275\u0275advance(2);
    \u0275\u0275property("ngTemplateOutlet", ctx_r0.headerTemplate || ctx_r0._headerTemplate);
  }
}
function Card_div_2_ng_container_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementContainerStart(0);
    \u0275\u0275text(1);
    \u0275\u0275elementContainerEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r0.header);
  }
}
function Card_div_2_ng_container_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementContainer(0);
  }
}
function Card_div_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 1);
    \u0275\u0275template(1, Card_div_2_ng_container_1_Template, 2, 1, "ng-container", 3)(2, Card_div_2_ng_container_2_Template, 1, 0, "ng-container", 2);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275classMap(ctx_r0.cx("title"));
    \u0275\u0275property("pBind", ctx_r0.ptm("title"));
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r0.header && !ctx_r0._titleTemplate && !ctx_r0.titleTemplate);
    \u0275\u0275advance();
    \u0275\u0275property("ngTemplateOutlet", ctx_r0.titleTemplate || ctx_r0._titleTemplate);
  }
}
function Card_div_3_ng_container_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementContainerStart(0);
    \u0275\u0275text(1);
    \u0275\u0275elementContainerEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r0.subheader);
  }
}
function Card_div_3_ng_container_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementContainer(0);
  }
}
function Card_div_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 1);
    \u0275\u0275template(1, Card_div_3_ng_container_1_Template, 2, 1, "ng-container", 3)(2, Card_div_3_ng_container_2_Template, 1, 0, "ng-container", 2);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275classMap(ctx_r0.cx("subtitle"));
    \u0275\u0275property("pBind", ctx_r0.ptm("subtitle"));
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r0.subheader && !ctx_r0._subtitleTemplate && !ctx_r0.subtitleTemplate);
    \u0275\u0275advance();
    \u0275\u0275property("ngTemplateOutlet", ctx_r0.subtitleTemplate || ctx_r0._subtitleTemplate);
  }
}
function Card_ng_container_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementContainer(0);
  }
}
function Card_div_7_ng_container_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementContainer(0);
  }
}
function Card_div_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 1);
    \u0275\u0275projection(1, 2);
    \u0275\u0275template(2, Card_div_7_ng_container_2_Template, 1, 0, "ng-container", 2);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275classMap(ctx_r0.cx("footer"));
    \u0275\u0275property("pBind", ctx_r0.ptm("footer"));
    \u0275\u0275advance(2);
    \u0275\u0275property("ngTemplateOutlet", ctx_r0.footerTemplate || ctx_r0._footerTemplate);
  }
}
var style2 = (
  /*css*/
  `
    ${style}

    .p-card {
        display: block;
    }
`
);
var classes = {
  root: "p-card p-component",
  header: "p-card-header",
  body: "p-card-body",
  caption: "p-card-caption",
  title: "p-card-title",
  subtitle: "p-card-subtitle",
  content: "p-card-content",
  footer: "p-card-footer"
};
var CardStyle = class _CardStyle extends BaseStyle {
  name = "card";
  style = style2;
  classes = classes;
  static \u0275fac = /* @__PURE__ */ (() => {
    let \u0275CardStyle_BaseFactory;
    return function CardStyle_Factory(__ngFactoryType__) {
      return (\u0275CardStyle_BaseFactory || (\u0275CardStyle_BaseFactory = \u0275\u0275getInheritedFactory(_CardStyle)))(__ngFactoryType__ || _CardStyle);
    };
  })();
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({
    token: _CardStyle,
    factory: _CardStyle.\u0275fac
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(CardStyle, [{
    type: Injectable
  }], null, null);
})();
var CardClasses;
(function(CardClasses2) {
  CardClasses2["root"] = "p-card";
  CardClasses2["header"] = "p-card-header";
  CardClasses2["body"] = "p-card-body";
  CardClasses2["caption"] = "p-card-caption";
  CardClasses2["title"] = "p-card-title";
  CardClasses2["subtitle"] = "p-card-subtitle";
  CardClasses2["content"] = "p-card-content";
  CardClasses2["footer"] = "p-card-footer";
})(CardClasses || (CardClasses = {}));
var CARD_INSTANCE = new InjectionToken("CARD_INSTANCE");
var Card = class _Card extends BaseComponent {
  $pcCard = inject(CARD_INSTANCE, {
    optional: true,
    skipSelf: true
  }) ?? void 0;
  bindDirectiveInstance = inject(Bind, {
    self: true
  });
  _componentStyle = inject(CardStyle);
  onAfterViewChecked() {
    this.bindDirectiveInstance.setAttrs(this.ptms(["host", "root"]));
  }
  /**
   * Header of the card.
   * @group Props
   */
  header;
  /**
   * Subheader of the card.
   * @group Props
   */
  subheader;
  /**
   * Inline style of the element.
   * @group Props
   */
  set style(value) {
    if (!k(this._style(), value)) {
      this._style.set(value);
      if (this.el?.nativeElement) {
        if (value) {
          Object.keys(value).forEach((key) => {
            this.el.nativeElement.style[key] = value[key];
          });
        }
      }
    }
  }
  get style() {
    return this._style();
  }
  /**
   * Class of the element.
   * @deprecated since v20.0.0, use `class` instead.
   * @group Props
   */
  styleClass;
  headerFacet;
  footerFacet;
  headerTemplate;
  titleTemplate;
  subtitleTemplate;
  contentTemplate;
  footerTemplate;
  _headerTemplate;
  _titleTemplate;
  _subtitleTemplate;
  _contentTemplate;
  _footerTemplate;
  _style = signal(null, ...ngDevMode ? [{
    debugName: "_style"
  }] : []);
  getBlockableElement() {
    return this.el.nativeElement.children[0];
  }
  templates;
  onAfterContentInit() {
    this.templates.forEach((item) => {
      switch (item.getType()) {
        case "header":
          this._headerTemplate = item.template;
          break;
        case "title":
          this._titleTemplate = item.template;
          break;
        case "subtitle":
          this._subtitleTemplate = item.template;
          break;
        case "content":
          this._contentTemplate = item.template;
          break;
        case "footer":
          this._footerTemplate = item.template;
          break;
        default:
          this._contentTemplate = item.template;
          break;
      }
    });
  }
  static \u0275fac = /* @__PURE__ */ (() => {
    let \u0275Card_BaseFactory;
    return function Card_Factory(__ngFactoryType__) {
      return (\u0275Card_BaseFactory || (\u0275Card_BaseFactory = \u0275\u0275getInheritedFactory(_Card)))(__ngFactoryType__ || _Card);
    };
  })();
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({
    type: _Card,
    selectors: [["p-card"]],
    contentQueries: function Card_ContentQueries(rf, ctx, dirIndex) {
      if (rf & 1) {
        \u0275\u0275contentQuery(dirIndex, Header, 5);
        \u0275\u0275contentQuery(dirIndex, Footer, 5);
        \u0275\u0275contentQuery(dirIndex, _c0, 4);
        \u0275\u0275contentQuery(dirIndex, _c1, 4);
        \u0275\u0275contentQuery(dirIndex, _c2, 4);
        \u0275\u0275contentQuery(dirIndex, _c3, 4);
        \u0275\u0275contentQuery(dirIndex, _c4, 4);
        \u0275\u0275contentQuery(dirIndex, PrimeTemplate, 4);
      }
      if (rf & 2) {
        let _t;
        \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx.headerFacet = _t.first);
        \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx.footerFacet = _t.first);
        \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx.headerTemplate = _t.first);
        \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx.titleTemplate = _t.first);
        \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx.subtitleTemplate = _t.first);
        \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx.contentTemplate = _t.first);
        \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx.footerTemplate = _t.first);
        \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx.templates = _t);
      }
    },
    hostVars: 4,
    hostBindings: function Card_HostBindings(rf, ctx) {
      if (rf & 2) {
        \u0275\u0275styleMap(ctx._style());
        \u0275\u0275classMap(ctx.cn(ctx.cx("root"), ctx.styleClass));
      }
    },
    inputs: {
      header: "header",
      subheader: "subheader",
      style: "style",
      styleClass: "styleClass"
    },
    features: [\u0275\u0275ProvidersFeature([CardStyle, {
      provide: CARD_INSTANCE,
      useExisting: _Card
    }, {
      provide: PARENT_INSTANCE,
      useExisting: _Card
    }]), \u0275\u0275HostDirectivesFeature([Bind]), \u0275\u0275InheritDefinitionFeature],
    ngContentSelectors: _c6,
    decls: 8,
    vars: 11,
    consts: [[3, "pBind", "class", 4, "ngIf"], [3, "pBind"], [4, "ngTemplateOutlet"], [4, "ngIf"]],
    template: function Card_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275projectionDef(_c5);
        \u0275\u0275template(0, Card_div_0_Template, 3, 4, "div", 0);
        \u0275\u0275elementStart(1, "div", 1);
        \u0275\u0275template(2, Card_div_2_Template, 3, 5, "div", 0)(3, Card_div_3_Template, 3, 5, "div", 0);
        \u0275\u0275elementStart(4, "div", 1);
        \u0275\u0275projection(5);
        \u0275\u0275template(6, Card_ng_container_6_Template, 1, 0, "ng-container", 2);
        \u0275\u0275elementEnd();
        \u0275\u0275template(7, Card_div_7_Template, 3, 4, "div", 0);
        \u0275\u0275elementEnd();
      }
      if (rf & 2) {
        \u0275\u0275property("ngIf", ctx.headerFacet || ctx.headerTemplate || ctx._headerTemplate);
        \u0275\u0275advance();
        \u0275\u0275classMap(ctx.cx("body"));
        \u0275\u0275property("pBind", ctx.ptm("body"));
        \u0275\u0275advance();
        \u0275\u0275property("ngIf", ctx.header || ctx.titleTemplate || ctx._titleTemplate);
        \u0275\u0275advance();
        \u0275\u0275property("ngIf", ctx.subheader || ctx.subtitleTemplate || ctx._subtitleTemplate);
        \u0275\u0275advance();
        \u0275\u0275classMap(ctx.cx("content"));
        \u0275\u0275property("pBind", ctx.ptm("content"));
        \u0275\u0275advance(2);
        \u0275\u0275property("ngTemplateOutlet", ctx.contentTemplate || ctx._contentTemplate);
        \u0275\u0275advance();
        \u0275\u0275property("ngIf", ctx.footerFacet || ctx.footerTemplate || ctx._footerTemplate);
      }
    },
    dependencies: [CommonModule, NgIf, NgTemplateOutlet, SharedModule, BindModule, Bind],
    encapsulation: 2,
    changeDetection: 0
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(Card, [{
    type: Component,
    args: [{
      selector: "p-card",
      standalone: true,
      imports: [CommonModule, SharedModule, BindModule],
      template: `
        <div [pBind]="ptm('header')" [class]="cx('header')" *ngIf="headerFacet || headerTemplate || _headerTemplate">
            <ng-content select="p-header"></ng-content>
            <ng-container *ngTemplateOutlet="headerTemplate || _headerTemplate"></ng-container>
        </div>
        <div [pBind]="ptm('body')" [class]="cx('body')">
            <div [pBind]="ptm('title')" [class]="cx('title')" *ngIf="header || titleTemplate || _titleTemplate">
                <ng-container *ngIf="header && !_titleTemplate && !titleTemplate">{{ header }}</ng-container>
                <ng-container *ngTemplateOutlet="titleTemplate || _titleTemplate"></ng-container>
            </div>
            <div [pBind]="ptm('subtitle')" [class]="cx('subtitle')" *ngIf="subheader || subtitleTemplate || _subtitleTemplate">
                <ng-container *ngIf="subheader && !_subtitleTemplate && !subtitleTemplate">{{ subheader }}</ng-container>
                <ng-container *ngTemplateOutlet="subtitleTemplate || _subtitleTemplate"></ng-container>
            </div>
            <div [pBind]="ptm('content')" [class]="cx('content')">
                <ng-content></ng-content>
                <ng-container *ngTemplateOutlet="contentTemplate || _contentTemplate"></ng-container>
            </div>
            <div [pBind]="ptm('footer')" [class]="cx('footer')" *ngIf="footerFacet || footerTemplate || _footerTemplate">
                <ng-content select="p-footer"></ng-content>
                <ng-container *ngTemplateOutlet="footerTemplate || _footerTemplate"></ng-container>
            </div>
        </div>
    `,
      changeDetection: ChangeDetectionStrategy.OnPush,
      encapsulation: ViewEncapsulation.None,
      providers: [CardStyle, {
        provide: CARD_INSTANCE,
        useExisting: Card
      }, {
        provide: PARENT_INSTANCE,
        useExisting: Card
      }],
      host: {
        "[class]": "cn(cx('root'), styleClass)",
        "[style]": "_style()"
      },
      hostDirectives: [Bind]
    }]
  }], null, {
    header: [{
      type: Input
    }],
    subheader: [{
      type: Input
    }],
    style: [{
      type: Input
    }],
    styleClass: [{
      type: Input
    }],
    headerFacet: [{
      type: ContentChild,
      args: [Header]
    }],
    footerFacet: [{
      type: ContentChild,
      args: [Footer]
    }],
    headerTemplate: [{
      type: ContentChild,
      args: ["header", {
        descendants: false
      }]
    }],
    titleTemplate: [{
      type: ContentChild,
      args: ["title", {
        descendants: false
      }]
    }],
    subtitleTemplate: [{
      type: ContentChild,
      args: ["subtitle", {
        descendants: false
      }]
    }],
    contentTemplate: [{
      type: ContentChild,
      args: ["content", {
        descendants: false
      }]
    }],
    footerTemplate: [{
      type: ContentChild,
      args: ["footer", {
        descendants: false
      }]
    }],
    templates: [{
      type: ContentChildren,
      args: [PrimeTemplate]
    }]
  });
})();
var CardModule = class _CardModule {
  static \u0275fac = function CardModule_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _CardModule)();
  };
  static \u0275mod = /* @__PURE__ */ \u0275\u0275defineNgModule({
    type: _CardModule,
    imports: [Card, SharedModule, BindModule],
    exports: [Card, SharedModule, BindModule]
  });
  static \u0275inj = /* @__PURE__ */ \u0275\u0275defineInjector({
    imports: [Card, SharedModule, BindModule, SharedModule, BindModule]
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(CardModule, [{
    type: NgModule,
    args: [{
      imports: [Card, SharedModule, BindModule],
      exports: [Card, SharedModule, BindModule]
    }]
  }], null, null);
})();

// src/app/services/sidebar.service.ts
var SidebarService = class _SidebarService {
  sidebarVisibleSubject = new BehaviorSubject(true);
  sidebarVisible$ = this.sidebarVisibleSubject.asObservable();
  constructor() {
    this.loadSidebarState();
  }
  loadSidebarState() {
    const saved = localStorage.getItem("sidebarState");
    if (saved !== null) {
      this.sidebarVisibleSubject.next(JSON.parse(saved));
    }
  }
  toggleSidebar() {
    const newState = !this.sidebarVisibleSubject.value;
    this.sidebarVisibleSubject.next(newState);
    this.saveSidebarState();
  }
  setSidebarVisible(visible) {
    this.sidebarVisibleSubject.next(visible);
    this.saveSidebarState();
  }
  getSidebarVisible() {
    return this.sidebarVisibleSubject.value;
  }
  saveSidebarState() {
    localStorage.setItem("sidebarState", JSON.stringify(this.sidebarVisibleSubject.value));
  }
  static \u0275fac = function SidebarService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _SidebarService)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _SidebarService, factory: _SidebarService.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(SidebarService, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], () => [], null);
})();

// src/app/components/sidebar/sidebar.component.ts
function SidebarComponent_div_0_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 2)(1, "div", 3)(2, "h3");
    \u0275\u0275element(3, "i", 4);
    \u0275\u0275text(4, " Men\xFA");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "button", 5);
    \u0275\u0275listener("click", function SidebarComponent_div_0_Template_button_click_5_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.toggleSidebar());
    });
    \u0275\u0275element(6, "i", 6);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(7, "p-card")(8, "ul", 7)(9, "li")(10, "a", 8);
    \u0275\u0275element(11, "i", 9);
    \u0275\u0275elementStart(12, "span");
    \u0275\u0275text(13, "Inicio");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(14, "li")(15, "a", 10);
    \u0275\u0275element(16, "i", 11);
    \u0275\u0275elementStart(17, "span");
    \u0275\u0275text(18, "Perfil");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(19, "li")(20, "a", 12);
    \u0275\u0275element(21, "i", 13);
    \u0275\u0275elementStart(22, "span");
    \u0275\u0275text(23, "Configuraci\xF3n");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(24, "li")(25, "a", 14);
    \u0275\u0275element(26, "i", 15);
    \u0275\u0275elementStart(27, "span");
    \u0275\u0275text(28, "Group");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(29, "li")(30, "a", 16);
    \u0275\u0275element(31, "i", 17);
    \u0275\u0275elementStart(32, "span");
    \u0275\u0275text(33, "Reportes");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(34, "li")(35, "a", 18);
    \u0275\u0275element(36, "i", 19);
    \u0275\u0275elementStart(37, "span");
    \u0275\u0275text(38, "Cerrar Sesi\xF3n");
    \u0275\u0275elementEnd()()()()()();
  }
}
function SidebarComponent_div_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 20)(1, "button", 21);
    \u0275\u0275listener("click", function SidebarComponent_div_1_Template_button_click_1_listener() {
      \u0275\u0275restoreView(_r3);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.toggleSidebar());
    });
    \u0275\u0275element(2, "i", 4);
    \u0275\u0275elementEnd()();
  }
}
var SidebarComponent = class _SidebarComponent {
  sidebarService;
  sidebarVisible = true;
  subscription;
  constructor(sidebarService) {
    this.sidebarService = sidebarService;
  }
  ngOnInit() {
    this.subscription = this.sidebarService.sidebarVisible$.subscribe((visible) => {
      this.sidebarVisible = visible;
    });
  }
  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }
  toggleSidebar() {
    this.sidebarService.toggleSidebar();
  }
  saveSidebarState() {
  }
  static \u0275fac = function SidebarComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _SidebarComponent)(\u0275\u0275directiveInject(SidebarService));
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _SidebarComponent, selectors: [["app-sidebar"]], decls: 2, vars: 2, consts: [["class", "sidebar", 4, "ngIf"], ["class", "sidebar-collapsed", 4, "ngIf"], [1, "sidebar"], [1, "sidebar-header"], [1, "pi", "pi-bars"], ["title", "Cerrar men\xFA", 1, "toggle-btn", 3, "click"], [1, "pi", "pi-times"], [1, "menu-list"], ["routerLink", "/home", "routerLinkActive", "active"], [1, "pi", "pi-home"], ["routerLink", "/profile"], [1, "pi", "pi-user"], ["routerLink", "/settings"], [1, "pi", "pi-cog"], ["routerLink", "/group"], [1, "pi", "pi-users"], ["routerLink", "/reports"], [1, "pi", "pi-chart-bar"], ["routerLink", "/auth/login"], [1, "pi", "pi-sign-out"], [1, "sidebar-collapsed"], ["title", "Abrir men\xFA", 1, "toggle-btn", 3, "click"]], template: function SidebarComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275template(0, SidebarComponent_div_0_Template, 39, 0, "div", 0)(1, SidebarComponent_div_1_Template, 3, 0, "div", 1);
    }
    if (rf & 2) {
      \u0275\u0275property("ngIf", ctx.sidebarVisible);
      \u0275\u0275advance();
      \u0275\u0275property("ngIf", !ctx.sidebarVisible);
    }
  }, dependencies: [CommonModule, NgIf, ButtonModule, RouterModule, RouterLink, RouterLinkActive, CardModule, Card], styles: ["\n\n.sidebar[_ngcontent-%COMP%] {\n  width: 250px;\n  height: 100vh;\n  background:\n    linear-gradient(\n      180deg,\n      #2c3e50,\n      #34495e);\n  color: white;\n  position: fixed;\n  left: 0;\n  top: 0;\n  overflow-y: auto;\n  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);\n  display: flex;\n  flex-direction: column;\n  z-index: 1000;\n}\n.sidebar-header[_ngcontent-%COMP%] {\n  padding: 20px;\n  border-bottom: 1px solid #34495e;\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n}\n.sidebar-header[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%] {\n  margin: 0;\n  font-size: 1.3rem;\n  display: flex;\n  align-items: center;\n  gap: 10px;\n  color: #ecf0f1;\n  flex: 1;\n  white-space: nowrap;\n}\n.sidebar-header[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%]   i[_ngcontent-%COMP%] {\n  color: #3498db;\n  flex-shrink: 0;\n}\n.toggle-btn[_ngcontent-%COMP%] {\n  background: none;\n  border: none;\n  color: #ecf0f1;\n  cursor: pointer;\n  font-size: 1.3rem;\n  padding: 8px 12px;\n  border-radius: 4px;\n  transition: all 0.3s ease;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  flex-shrink: 0;\n}\n.toggle-btn[_ngcontent-%COMP%]:hover {\n  background-color: rgba(255, 255, 255, 0.1);\n  color: #3498db;\n}\n.menu-list[_ngcontent-%COMP%] {\n  list-style: none;\n  padding: 0;\n  margin: 0;\n  flex: 1;\n}\n.menu-list[_ngcontent-%COMP%]   li[_ngcontent-%COMP%] {\n  margin: 0;\n}\n.menu-list[_ngcontent-%COMP%]   a[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 15px;\n  padding: 15px 20px;\n  color: #bdc3c7;\n  text-decoration: none;\n  transition: all 0.3s ease;\n  border-bottom: 1px solid #34495e;\n  word-wrap: break-word;\n}\n.menu-list[_ngcontent-%COMP%]   a[_ngcontent-%COMP%]:hover {\n  background-color: #34495e;\n  color: #ecf0f1;\n  padding-left: 25px;\n}\n.menu-list[_ngcontent-%COMP%]   a.active[_ngcontent-%COMP%] {\n  background-color: #3498db;\n  color: white;\n  border-left: 4px solid #2980b9;\n  padding-left: 20px;\n}\n.menu-list[_ngcontent-%COMP%]   a[_ngcontent-%COMP%]   i[_ngcontent-%COMP%] {\n  font-size: 1.1rem;\n  width: 20px;\n  text-align: center;\n  flex-shrink: 0;\n}\n.menu-list[_ngcontent-%COMP%]   a[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  font-weight: 500;\n  word-break: break-word;\n  white-space: nowrap;\n}\n.sidebar-actions[_ngcontent-%COMP%] {\n  padding: 15px;\n  border-top: 1px solid #34495e;\n  background-color: rgba(0, 0, 0, 0.2);\n}\n.sidebar-collapsed[_ngcontent-%COMP%] {\n  width: 70px;\n  height: 100vh;\n  background:\n    linear-gradient(\n      180deg,\n      #2c3e50,\n      #34495e);\n  position: fixed;\n  left: 0;\n  top: 0;\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: flex-start;\n  padding: 20px 0;\n  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);\n  z-index: 1000;\n}\n.sidebar-collapsed[_ngcontent-%COMP%]   .toggle-btn[_ngcontent-%COMP%] {\n  width: 45px;\n  height: 45px;\n  margin-bottom: 20px;\n}\n@media (max-width: 768px) {\n  .sidebar[_ngcontent-%COMP%] {\n    width: 100%;\n    height: auto;\n    position: fixed;\n    top: 0;\n    left: 0;\n    right: 0;\n    bottom: 0;\n    max-height: 100vh;\n    transform: translateX(0);\n  }\n  .sidebar-header[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%] {\n    font-size: 1.2rem;\n  }\n  .menu-list[_ngcontent-%COMP%]   a[_ngcontent-%COMP%] {\n    padding: 12px 15px;\n    font-size: 0.95rem;\n  }\n  .sidebar-collapsed[_ngcontent-%COMP%] {\n    display: none;\n  }\n}\n@media (max-width: 480px) {\n  .sidebar[_ngcontent-%COMP%] {\n    width: 100%;\n  }\n  .sidebar-header[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%] {\n    font-size: 1rem;\n  }\n  .menu-list[_ngcontent-%COMP%]   a[_ngcontent-%COMP%] {\n    padding: 10px 12px;\n    gap: 10px;\n  }\n  .menu-list[_ngcontent-%COMP%]   a[_ngcontent-%COMP%]   i[_ngcontent-%COMP%] {\n    font-size: 1rem;\n  }\n}\n.sidebar-collapsed[_ngcontent-%COMP%]   .toggle-btn[_ngcontent-%COMP%] {\n  width: 40px;\n  height: 40px;\n  margin-bottom: 20px;\n}\n@media (max-width: 768px) {\n  .sidebar[_ngcontent-%COMP%] {\n    width: 100%;\n    height: auto;\n    position: relative;\n  }\n  .sidebar-collapsed[_ngcontent-%COMP%] {\n    display: none;\n  }\n}\n/*# sourceMappingURL=sidebar.component.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(SidebarComponent, [{
    type: Component,
    args: [{ selector: "app-sidebar", standalone: true, imports: [CommonModule, ButtonModule, RouterModule, CardModule], template: '<div class="sidebar" *ngIf="sidebarVisible">\r\n  <div class="sidebar-header">\r\n    <h3><i class="pi pi-bars"></i> Men\xFA</h3>\r\n    <button class="toggle-btn" (click)="toggleSidebar()" title="Cerrar men\xFA">\r\n      <i class="pi pi-times"></i>\r\n    </button>\r\n  </div>\r\n  <p-card>\r\n    <ul class="menu-list">\r\n      <li>\r\n        <a routerLink="/home" routerLinkActive="active">\r\n          <i class="pi pi-home"></i>\r\n          <span>Inicio</span>\r\n        </a>\r\n      </li>\r\n      <li>\r\n        <a routerLink="/profile">\r\n          <i class="pi pi-user"></i>\r\n          <span>Perfil</span>\r\n        </a>\r\n      </li>\r\n      <li>\r\n        <a routerLink="/settings">\r\n          <i class="pi pi-cog"></i>\r\n          <span>Configuraci\xF3n</span>\r\n        </a>\r\n      </li>\r\n      <li>\r\n        <a routerLink="/group">\r\n          <i class="pi pi-users"></i>\r\n          <span>Group</span>\r\n        </a>\r\n      </li>\r\n      <li>\r\n        <a routerLink="/reports">\r\n          <i class="pi pi-chart-bar"></i>\r\n          <span>Reportes</span>\r\n        </a>\r\n      </li>\r\n      <li>\r\n        <a routerLink="/auth/login">\r\n          <i class="pi pi-sign-out"></i>\r\n          <span>Cerrar Sesi\xF3n</span>\r\n        </a>\r\n      </li>\r\n    </ul>\r\n  </p-card>\r\n</div>\r\n\r\n<div *ngIf="!sidebarVisible" class="sidebar-collapsed">\r\n  <button class="toggle-btn" (click)="toggleSidebar()" title="Abrir men\xFA">\r\n    <i class="pi pi-bars"></i>\r\n  </button>\r\n</div>', styles: ["/* src/app/components/sidebar/sidebar.component.css */\n.sidebar {\n  width: 250px;\n  height: 100vh;\n  background:\n    linear-gradient(\n      180deg,\n      #2c3e50,\n      #34495e);\n  color: white;\n  position: fixed;\n  left: 0;\n  top: 0;\n  overflow-y: auto;\n  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);\n  display: flex;\n  flex-direction: column;\n  z-index: 1000;\n}\n.sidebar-header {\n  padding: 20px;\n  border-bottom: 1px solid #34495e;\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n}\n.sidebar-header h3 {\n  margin: 0;\n  font-size: 1.3rem;\n  display: flex;\n  align-items: center;\n  gap: 10px;\n  color: #ecf0f1;\n  flex: 1;\n  white-space: nowrap;\n}\n.sidebar-header h3 i {\n  color: #3498db;\n  flex-shrink: 0;\n}\n.toggle-btn {\n  background: none;\n  border: none;\n  color: #ecf0f1;\n  cursor: pointer;\n  font-size: 1.3rem;\n  padding: 8px 12px;\n  border-radius: 4px;\n  transition: all 0.3s ease;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  flex-shrink: 0;\n}\n.toggle-btn:hover {\n  background-color: rgba(255, 255, 255, 0.1);\n  color: #3498db;\n}\n.menu-list {\n  list-style: none;\n  padding: 0;\n  margin: 0;\n  flex: 1;\n}\n.menu-list li {\n  margin: 0;\n}\n.menu-list a {\n  display: flex;\n  align-items: center;\n  gap: 15px;\n  padding: 15px 20px;\n  color: #bdc3c7;\n  text-decoration: none;\n  transition: all 0.3s ease;\n  border-bottom: 1px solid #34495e;\n  word-wrap: break-word;\n}\n.menu-list a:hover {\n  background-color: #34495e;\n  color: #ecf0f1;\n  padding-left: 25px;\n}\n.menu-list a.active {\n  background-color: #3498db;\n  color: white;\n  border-left: 4px solid #2980b9;\n  padding-left: 20px;\n}\n.menu-list a i {\n  font-size: 1.1rem;\n  width: 20px;\n  text-align: center;\n  flex-shrink: 0;\n}\n.menu-list a span {\n  font-weight: 500;\n  word-break: break-word;\n  white-space: nowrap;\n}\n.sidebar-actions {\n  padding: 15px;\n  border-top: 1px solid #34495e;\n  background-color: rgba(0, 0, 0, 0.2);\n}\n.sidebar-collapsed {\n  width: 70px;\n  height: 100vh;\n  background:\n    linear-gradient(\n      180deg,\n      #2c3e50,\n      #34495e);\n  position: fixed;\n  left: 0;\n  top: 0;\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: flex-start;\n  padding: 20px 0;\n  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);\n  z-index: 1000;\n}\n.sidebar-collapsed .toggle-btn {\n  width: 45px;\n  height: 45px;\n  margin-bottom: 20px;\n}\n@media (max-width: 768px) {\n  .sidebar {\n    width: 100%;\n    height: auto;\n    position: fixed;\n    top: 0;\n    left: 0;\n    right: 0;\n    bottom: 0;\n    max-height: 100vh;\n    transform: translateX(0);\n  }\n  .sidebar-header h3 {\n    font-size: 1.2rem;\n  }\n  .menu-list a {\n    padding: 12px 15px;\n    font-size: 0.95rem;\n  }\n  .sidebar-collapsed {\n    display: none;\n  }\n}\n@media (max-width: 480px) {\n  .sidebar {\n    width: 100%;\n  }\n  .sidebar-header h3 {\n    font-size: 1rem;\n  }\n  .menu-list a {\n    padding: 10px 12px;\n    gap: 10px;\n  }\n  .menu-list a i {\n    font-size: 1rem;\n  }\n}\n.sidebar-collapsed .toggle-btn {\n  width: 40px;\n  height: 40px;\n  margin-bottom: 20px;\n}\n@media (max-width: 768px) {\n  .sidebar {\n    width: 100%;\n    height: auto;\n    position: relative;\n  }\n  .sidebar-collapsed {\n    display: none;\n  }\n}\n/*# sourceMappingURL=sidebar.component.css.map */\n"] }]
  }], () => [{ type: SidebarService }], null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(SidebarComponent, { className: "SidebarComponent", filePath: "src/app/components/sidebar/sidebar.component.ts", lineNumber: 16 });
})();

export {
  Card,
  CardModule,
  SidebarService,
  SidebarComponent
};
//# sourceMappingURL=chunk-LQ6ABAKB.js.map
