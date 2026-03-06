import {
  BaseEditableHolder,
  BaseInput
} from "./chunk-S26L266D.js";
import {
  InputText,
  NG_VALUE_ACCESSOR,
  TimesIcon,
  zindexutils
} from "./chunk-7DWSOU2V.js";
import {
  animate,
  style,
  transition,
  trigger
} from "./chunk-WWG27WRZ.js";
import {
  AutoFocus,
  BaseIcon,
  Bind,
  BindModule,
  ConnectedOverlayScrollHandler,
  DomHandler,
  Fluid,
  PARENT_INSTANCE,
  s
} from "./chunk-HWDZGNHS.js";
import {
  BaseStyle,
  D,
  I,
  OverlayService,
  P,
  PrimeTemplate,
  R,
  SharedModule,
  TranslationKeys,
  W,
  Yt,
  v
} from "./chunk-JNXR6VHA.js";
import {
  ChangeDetectionStrategy,
  CommonModule,
  Component,
  ContentChild,
  ContentChildren,
  Directive,
  EventEmitter,
  HostListener,
  Injectable,
  InjectionToken,
  Input,
  NgIf,
  NgModule,
  NgStyle,
  NgTemplateOutlet,
  NgZone,
  Output,
  Pipe,
  ViewChild,
  ViewEncapsulation,
  booleanAttribute,
  computed,
  forwardRef,
  inject,
  input,
  isPlatformBrowser,
  numberAttribute,
  setClassMetadata,
  signal,
  ɵɵHostDirectivesFeature,
  ɵɵInheritDefinitionFeature,
  ɵɵProvidersFeature,
  ɵɵadvance,
  ɵɵattribute,
  ɵɵclassMap,
  ɵɵcontentQuery,
  ɵɵdefineComponent,
  ɵɵdefineDirective,
  ɵɵdefineInjectable,
  ɵɵdefineInjector,
  ɵɵdefineNgModule,
  ɵɵdefinePipe,
  ɵɵdirectiveInject,
  ɵɵdomElement,
  ɵɵdomElementEnd,
  ɵɵdomElementStart,
  ɵɵdomProperty,
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
  ɵɵnamespaceSVG,
  ɵɵnextContext,
  ɵɵproperty,
  ɵɵpureFunction1,
  ɵɵpureFunction2,
  ɵɵqueryRefresh,
  ɵɵreference,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵstyleMap,
  ɵɵtemplate,
  ɵɵtemplateRefExtractor,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵviewQuery
} from "./chunk-ANLN36LO.js";

// node_modules/primeng/fesm2022/primeng-icons-eye.mjs
var _c0 = ["data-p-icon", "eye"];
var EyeIcon = class _EyeIcon extends BaseIcon {
  static \u0275fac = /* @__PURE__ */ (() => {
    let \u0275EyeIcon_BaseFactory;
    return function EyeIcon_Factory(__ngFactoryType__) {
      return (\u0275EyeIcon_BaseFactory || (\u0275EyeIcon_BaseFactory = \u0275\u0275getInheritedFactory(_EyeIcon)))(__ngFactoryType__ || _EyeIcon);
    };
  })();
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({
    type: _EyeIcon,
    selectors: [["", "data-p-icon", "eye"]],
    features: [\u0275\u0275InheritDefinitionFeature],
    attrs: _c0,
    decls: 1,
    vars: 0,
    consts: [["fill-rule", "evenodd", "clip-rule", "evenodd", "d", "M0.0535499 7.25213C0.208567 7.59162 2.40413 12.4 7 12.4C11.5959 12.4 13.7914 7.59162 13.9465 7.25213C13.9487 7.2471 13.9506 7.24304 13.952 7.24001C13.9837 7.16396 14 7.08239 14 7.00001C14 6.91762 13.9837 6.83605 13.952 6.76001C13.9506 6.75697 13.9487 6.75292 13.9465 6.74788C13.7914 6.4084 11.5959 1.60001 7 1.60001C2.40413 1.60001 0.208567 6.40839 0.0535499 6.74788C0.0512519 6.75292 0.0494023 6.75697 0.048 6.76001C0.0163137 6.83605 0 6.91762 0 7.00001C0 7.08239 0.0163137 7.16396 0.048 7.24001C0.0494023 7.24304 0.0512519 7.2471 0.0535499 7.25213ZM7 11.2C3.664 11.2 1.736 7.92001 1.264 7.00001C1.736 6.08001 3.664 2.80001 7 2.80001C10.336 2.80001 12.264 6.08001 12.736 7.00001C12.264 7.92001 10.336 11.2 7 11.2ZM5.55551 9.16182C5.98308 9.44751 6.48576 9.6 7 9.6C7.68891 9.59789 8.349 9.32328 8.83614 8.83614C9.32328 8.349 9.59789 7.68891 9.59999 7C9.59999 6.48576 9.44751 5.98308 9.16182 5.55551C8.87612 5.12794 8.47006 4.7947 7.99497 4.59791C7.51988 4.40112 6.99711 4.34963 6.49276 4.44995C5.98841 4.55027 5.52513 4.7979 5.16152 5.16152C4.7979 5.52513 4.55027 5.98841 4.44995 6.49276C4.34963 6.99711 4.40112 7.51988 4.59791 7.99497C4.7947 8.47006 5.12794 8.87612 5.55551 9.16182ZM6.2222 5.83594C6.45243 5.6821 6.7231 5.6 7 5.6C7.37065 5.6021 7.72553 5.75027 7.98762 6.01237C8.24972 6.27446 8.39789 6.62934 8.4 7C8.4 7.27689 8.31789 7.54756 8.16405 7.77779C8.01022 8.00802 7.79157 8.18746 7.53575 8.29343C7.27994 8.39939 6.99844 8.42711 6.72687 8.37309C6.4553 8.31908 6.20584 8.18574 6.01005 7.98994C5.81425 7.79415 5.68091 7.54469 5.6269 7.27312C5.57288 7.00155 5.6006 6.72006 5.70656 6.46424C5.81253 6.20842 5.99197 5.98977 6.2222 5.83594Z", "fill", "currentColor"]],
    template: function EyeIcon_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275namespaceSVG();
        \u0275\u0275domElement(0, "path", 0);
      }
    },
    encapsulation: 2
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(EyeIcon, [{
    type: Component,
    args: [{
      selector: '[data-p-icon="eye"]',
      standalone: true,
      template: `
        <svg:path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M0.0535499 7.25213C0.208567 7.59162 2.40413 12.4 7 12.4C11.5959 12.4 13.7914 7.59162 13.9465 7.25213C13.9487 7.2471 13.9506 7.24304 13.952 7.24001C13.9837 7.16396 14 7.08239 14 7.00001C14 6.91762 13.9837 6.83605 13.952 6.76001C13.9506 6.75697 13.9487 6.75292 13.9465 6.74788C13.7914 6.4084 11.5959 1.60001 7 1.60001C2.40413 1.60001 0.208567 6.40839 0.0535499 6.74788C0.0512519 6.75292 0.0494023 6.75697 0.048 6.76001C0.0163137 6.83605 0 6.91762 0 7.00001C0 7.08239 0.0163137 7.16396 0.048 7.24001C0.0494023 7.24304 0.0512519 7.2471 0.0535499 7.25213ZM7 11.2C3.664 11.2 1.736 7.92001 1.264 7.00001C1.736 6.08001 3.664 2.80001 7 2.80001C10.336 2.80001 12.264 6.08001 12.736 7.00001C12.264 7.92001 10.336 11.2 7 11.2ZM5.55551 9.16182C5.98308 9.44751 6.48576 9.6 7 9.6C7.68891 9.59789 8.349 9.32328 8.83614 8.83614C9.32328 8.349 9.59789 7.68891 9.59999 7C9.59999 6.48576 9.44751 5.98308 9.16182 5.55551C8.87612 5.12794 8.47006 4.7947 7.99497 4.59791C7.51988 4.40112 6.99711 4.34963 6.49276 4.44995C5.98841 4.55027 5.52513 4.7979 5.16152 5.16152C4.7979 5.52513 4.55027 5.98841 4.44995 6.49276C4.34963 6.99711 4.40112 7.51988 4.59791 7.99497C4.7947 8.47006 5.12794 8.87612 5.55551 9.16182ZM6.2222 5.83594C6.45243 5.6821 6.7231 5.6 7 5.6C7.37065 5.6021 7.72553 5.75027 7.98762 6.01237C8.24972 6.27446 8.39789 6.62934 8.4 7C8.4 7.27689 8.31789 7.54756 8.16405 7.77779C8.01022 8.00802 7.79157 8.18746 7.53575 8.29343C7.27994 8.39939 6.99844 8.42711 6.72687 8.37309C6.4553 8.31908 6.20584 8.18574 6.01005 7.98994C5.81425 7.79415 5.68091 7.54469 5.6269 7.27312C5.57288 7.00155 5.6006 6.72006 5.70656 6.46424C5.81253 6.20842 5.99197 5.98977 6.2222 5.83594Z"
            fill="currentColor"
        />
    `
    }]
  }], null, null);
})();

// node_modules/primeng/fesm2022/primeng-icons-eyeslash.mjs
var _c02 = ["data-p-icon", "eyeslash"];
var EyeSlashIcon = class _EyeSlashIcon extends BaseIcon {
  pathId;
  onInit() {
    this.pathId = "url(#" + s() + ")";
  }
  static \u0275fac = /* @__PURE__ */ (() => {
    let \u0275EyeSlashIcon_BaseFactory;
    return function EyeSlashIcon_Factory(__ngFactoryType__) {
      return (\u0275EyeSlashIcon_BaseFactory || (\u0275EyeSlashIcon_BaseFactory = \u0275\u0275getInheritedFactory(_EyeSlashIcon)))(__ngFactoryType__ || _EyeSlashIcon);
    };
  })();
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({
    type: _EyeSlashIcon,
    selectors: [["", "data-p-icon", "eyeslash"]],
    features: [\u0275\u0275InheritDefinitionFeature],
    attrs: _c02,
    decls: 5,
    vars: 2,
    consts: [["fill-rule", "evenodd", "clip-rule", "evenodd", "d", "M13.9414 6.74792C13.9437 6.75295 13.9455 6.757 13.9469 6.76003C13.982 6.8394 14.0001 6.9252 14.0001 7.01195C14.0001 7.0987 13.982 7.1845 13.9469 7.26386C13.6004 8.00059 13.1711 8.69549 12.6674 9.33515C12.6115 9.4071 12.54 9.46538 12.4582 9.50556C12.3765 9.54574 12.2866 9.56678 12.1955 9.56707C12.0834 9.56671 11.9737 9.53496 11.8788 9.47541C11.7838 9.41586 11.7074 9.3309 11.6583 9.23015C11.6092 9.12941 11.5893 9.01691 11.6008 8.90543C11.6124 8.79394 11.6549 8.68793 11.7237 8.5994C12.1065 8.09726 12.4437 7.56199 12.7313 6.99995C12.2595 6.08027 10.3402 2.8014 6.99732 2.8014C6.63723 2.80218 6.27816 2.83969 5.92569 2.91336C5.77666 2.93304 5.62568 2.89606 5.50263 2.80972C5.37958 2.72337 5.29344 2.59398 5.26125 2.44714C5.22907 2.30031 5.2532 2.14674 5.32885 2.01685C5.40451 1.88696 5.52618 1.79021 5.66978 1.74576C6.10574 1.64961 6.55089 1.60134 6.99732 1.60181C11.5916 1.60181 13.7864 6.40856 13.9414 6.74792ZM2.20333 1.61685C2.35871 1.61411 2.5091 1.67179 2.6228 1.77774L12.2195 11.3744C12.3318 11.4869 12.3949 11.6393 12.3949 11.7983C12.3949 11.9572 12.3318 12.1097 12.2195 12.2221C12.107 12.3345 11.9546 12.3976 11.7956 12.3976C11.6367 12.3976 11.4842 12.3345 11.3718 12.2221L10.5081 11.3584C9.46549 12.0426 8.24432 12.4042 6.99729 12.3981C2.403 12.3981 0.208197 7.59135 0.0532336 7.25198C0.0509364 7.24694 0.0490875 7.2429 0.0476856 7.23986C0.0162332 7.16518 3.05176e-05 7.08497 3.05176e-05 7.00394C3.05176e-05 6.92291 0.0162332 6.8427 0.0476856 6.76802C0.631261 5.47831 1.46902 4.31959 2.51084 3.36119L1.77509 2.62545C1.66914 2.51175 1.61146 2.36136 1.61421 2.20597C1.61695 2.05059 1.6799 1.90233 1.78979 1.79244C1.89968 1.68254 2.04794 1.6196 2.20333 1.61685ZM7.45314 8.35147L5.68574 6.57609V6.5361C5.5872 6.78938 5.56498 7.06597 5.62183 7.33173C5.67868 7.59749 5.8121 7.84078 6.00563 8.03158C6.19567 8.21043 6.43052 8.33458 6.68533 8.39089C6.94014 8.44721 7.20543 8.43359 7.45314 8.35147ZM1.26327 6.99994C1.7351 7.91163 3.64645 11.1985 6.99729 11.1985C7.9267 11.2048 8.8408 10.9618 9.64438 10.4947L8.35682 9.20718C7.86027 9.51441 7.27449 9.64491 6.69448 9.57752C6.11446 9.51014 5.57421 9.24881 5.16131 8.83592C4.74842 8.42303 4.4871 7.88277 4.41971 7.30276C4.35232 6.72274 4.48282 6.13697 4.79005 5.64041L3.35855 4.2089C2.4954 5.00336 1.78523 5.94935 1.26327 6.99994Z", "fill", "currentColor"], [3, "id"], ["width", "14", "height", "14", "fill", "white"]],
    template: function EyeSlashIcon_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275namespaceSVG();
        \u0275\u0275domElementStart(0, "g");
        \u0275\u0275domElement(1, "path", 0);
        \u0275\u0275domElementEnd();
        \u0275\u0275domElementStart(2, "defs")(3, "clipPath", 1);
        \u0275\u0275domElement(4, "rect", 2);
        \u0275\u0275domElementEnd()();
      }
      if (rf & 2) {
        \u0275\u0275attribute("clip-path", ctx.pathId);
        \u0275\u0275advance(3);
        \u0275\u0275domProperty("id", ctx.pathId);
      }
    },
    encapsulation: 2
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(EyeSlashIcon, [{
    type: Component,
    args: [{
      selector: '[data-p-icon="eyeslash"]',
      standalone: true,
      template: `
        <svg:g [attr.clip-path]="pathId">
            <svg:path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M13.9414 6.74792C13.9437 6.75295 13.9455 6.757 13.9469 6.76003C13.982 6.8394 14.0001 6.9252 14.0001 7.01195C14.0001 7.0987 13.982 7.1845 13.9469 7.26386C13.6004 8.00059 13.1711 8.69549 12.6674 9.33515C12.6115 9.4071 12.54 9.46538 12.4582 9.50556C12.3765 9.54574 12.2866 9.56678 12.1955 9.56707C12.0834 9.56671 11.9737 9.53496 11.8788 9.47541C11.7838 9.41586 11.7074 9.3309 11.6583 9.23015C11.6092 9.12941 11.5893 9.01691 11.6008 8.90543C11.6124 8.79394 11.6549 8.68793 11.7237 8.5994C12.1065 8.09726 12.4437 7.56199 12.7313 6.99995C12.2595 6.08027 10.3402 2.8014 6.99732 2.8014C6.63723 2.80218 6.27816 2.83969 5.92569 2.91336C5.77666 2.93304 5.62568 2.89606 5.50263 2.80972C5.37958 2.72337 5.29344 2.59398 5.26125 2.44714C5.22907 2.30031 5.2532 2.14674 5.32885 2.01685C5.40451 1.88696 5.52618 1.79021 5.66978 1.74576C6.10574 1.64961 6.55089 1.60134 6.99732 1.60181C11.5916 1.60181 13.7864 6.40856 13.9414 6.74792ZM2.20333 1.61685C2.35871 1.61411 2.5091 1.67179 2.6228 1.77774L12.2195 11.3744C12.3318 11.4869 12.3949 11.6393 12.3949 11.7983C12.3949 11.9572 12.3318 12.1097 12.2195 12.2221C12.107 12.3345 11.9546 12.3976 11.7956 12.3976C11.6367 12.3976 11.4842 12.3345 11.3718 12.2221L10.5081 11.3584C9.46549 12.0426 8.24432 12.4042 6.99729 12.3981C2.403 12.3981 0.208197 7.59135 0.0532336 7.25198C0.0509364 7.24694 0.0490875 7.2429 0.0476856 7.23986C0.0162332 7.16518 3.05176e-05 7.08497 3.05176e-05 7.00394C3.05176e-05 6.92291 0.0162332 6.8427 0.0476856 6.76802C0.631261 5.47831 1.46902 4.31959 2.51084 3.36119L1.77509 2.62545C1.66914 2.51175 1.61146 2.36136 1.61421 2.20597C1.61695 2.05059 1.6799 1.90233 1.78979 1.79244C1.89968 1.68254 2.04794 1.6196 2.20333 1.61685ZM7.45314 8.35147L5.68574 6.57609V6.5361C5.5872 6.78938 5.56498 7.06597 5.62183 7.33173C5.67868 7.59749 5.8121 7.84078 6.00563 8.03158C6.19567 8.21043 6.43052 8.33458 6.68533 8.39089C6.94014 8.44721 7.20543 8.43359 7.45314 8.35147ZM1.26327 6.99994C1.7351 7.91163 3.64645 11.1985 6.99729 11.1985C7.9267 11.2048 8.8408 10.9618 9.64438 10.4947L8.35682 9.20718C7.86027 9.51441 7.27449 9.64491 6.69448 9.57752C6.11446 9.51014 5.57421 9.24881 5.16131 8.83592C4.74842 8.42303 4.4871 7.88277 4.41971 7.30276C4.35232 6.72274 4.48282 6.13697 4.79005 5.64041L3.35855 4.2089C2.4954 5.00336 1.78523 5.94935 1.26327 6.99994Z"
                fill="currentColor"
            />
        </svg:g>
        <svg:defs>
            <svg:clipPath [id]="pathId">
                <svg:rect width="14" height="14" fill="white" />
            </svg:clipPath>
        </svg:defs>
    `
    }]
  }], null, null);
})();

// node_modules/@primeuix/styles/dist/password/index.mjs
var style2 = "\n    .p-password {\n        display: inline-flex;\n        position: relative;\n    }\n\n    .p-password .p-password-overlay {\n        min-width: 100%;\n    }\n\n    .p-password-meter {\n        height: dt('password.meter.height');\n        background: dt('password.meter.background');\n        border-radius: dt('password.meter.border.radius');\n    }\n\n    .p-password-meter-label {\n        height: 100%;\n        width: 0;\n        transition: width 1s ease-in-out;\n        border-radius: dt('password.meter.border.radius');\n    }\n\n    .p-password-meter-weak {\n        background: dt('password.strength.weak.background');\n    }\n\n    .p-password-meter-medium {\n        background: dt('password.strength.medium.background');\n    }\n\n    .p-password-meter-strong {\n        background: dt('password.strength.strong.background');\n    }\n\n    .p-password-fluid {\n        display: flex;\n    }\n\n    .p-password-fluid .p-password-input {\n        width: 100%;\n    }\n\n    .p-password-input::-ms-reveal,\n    .p-password-input::-ms-clear {\n        display: none;\n    }\n\n    .p-password-overlay {\n        padding: dt('password.overlay.padding');\n        background: dt('password.overlay.background');\n        color: dt('password.overlay.color');\n        border: 1px solid dt('password.overlay.border.color');\n        box-shadow: dt('password.overlay.shadow');\n        border-radius: dt('password.overlay.border.radius');\n    }\n\n    .p-password-content {\n        display: flex;\n        flex-direction: column;\n        gap: dt('password.content.gap');\n    }\n\n    .p-password-toggle-mask-icon {\n        inset-inline-end: dt('form.field.padding.x');\n        color: dt('password.icon.color');\n        position: absolute;\n        top: 50%;\n        margin-top: calc(-1 * calc(dt('icon.size') / 2));\n        width: dt('icon.size');\n        height: dt('icon.size');\n    }\n\n    .p-password-clear-icon {\n        position: absolute;\n        top: 50%;\n        margin-top: -0.5rem;\n        cursor: pointer;\n        inset-inline-end: dt('form.field.padding.x');\n        color: dt('form.field.icon.color');\n    }\n\n    .p-password:has(.p-password-toggle-mask-icon) .p-password-input {\n        padding-inline-end: calc((dt('form.field.padding.x') * 2) + dt('icon.size'));\n    }\n\n    .p-password:has(.p-password-toggle-mask-icon) .p-password-clear-icon {\n        inset-inline-end: calc((dt('form.field.padding.x') * 2) + dt('icon.size'));\n    }\n\n    .p-password:has(.p-password-clear-icon) .p-password-input {\n        padding-inline-end: calc((dt('form.field.padding.x') * 2) + dt('icon.size'));\n    }\n\n    .p-password:has(.p-password-clear-icon):has(.p-password-toggle-mask-icon)  .p-password-input {\n        padding-inline-end: calc((dt('form.field.padding.x') * 3) + calc(dt('icon.size') * 2));\n    }\n\n";

// node_modules/primeng/fesm2022/primeng-password.mjs
var _c03 = ["content"];
var _c1 = ["footer"];
var _c2 = ["header"];
var _c3 = ["clearicon"];
var _c4 = ["hideicon"];
var _c5 = ["showicon"];
var _c6 = ["input"];
var _c7 = (a0) => ({
  class: a0
});
var _c8 = (a0, a1) => ({
  showTransitionParams: a0,
  hideTransitionParams: a1
});
var _c9 = (a0) => ({
  value: "visible",
  params: a0
});
var _c10 = (a0) => ({
  width: a0
});
function Password_ng_container_2__svg_svg_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = \u0275\u0275getCurrentView();
    \u0275\u0275namespaceSVG();
    \u0275\u0275elementStart(0, "svg", 9);
    \u0275\u0275listener("click", function Password_ng_container_2__svg_svg_1_Template_svg_click_0_listener() {
      \u0275\u0275restoreView(_r3);
      const ctx_r3 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r3.clear());
    });
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r3 = \u0275\u0275nextContext(2);
    \u0275\u0275classMap(ctx_r3.cx("clearIcon"));
    \u0275\u0275property("pBind", ctx_r3.ptm("clearIcon"));
  }
}
function Password_ng_container_2_3_ng_template_0_Template(rf, ctx) {
}
function Password_ng_container_2_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275template(0, Password_ng_container_2_3_ng_template_0_Template, 0, 0, "ng-template");
  }
}
function Password_ng_container_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r2 = \u0275\u0275getCurrentView();
    \u0275\u0275elementContainerStart(0);
    \u0275\u0275template(1, Password_ng_container_2__svg_svg_1_Template, 1, 3, "svg", 6);
    \u0275\u0275elementStart(2, "span", 7);
    \u0275\u0275listener("click", function Password_ng_container_2_Template_span_click_2_listener() {
      \u0275\u0275restoreView(_r2);
      const ctx_r3 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r3.clear());
    });
    \u0275\u0275template(3, Password_ng_container_2_3_Template, 1, 0, null, 8);
    \u0275\u0275elementEnd();
    \u0275\u0275elementContainerEnd();
  }
  if (rf & 2) {
    const ctx_r3 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", !ctx_r3.clearIconTemplate && !ctx_r3._clearIconTemplate);
    \u0275\u0275advance();
    \u0275\u0275classMap(ctx_r3.cx("clearIcon"));
    \u0275\u0275property("pBind", ctx_r3.ptm("clearIcon"));
    \u0275\u0275advance();
    \u0275\u0275property("ngTemplateOutlet", ctx_r3.clearIconTemplate || ctx_r3._clearIconTemplate);
  }
}
function Password_ng_container_3_ng_container_1__svg_svg_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r5 = \u0275\u0275getCurrentView();
    \u0275\u0275namespaceSVG();
    \u0275\u0275elementStart(0, "svg", 12);
    \u0275\u0275listener("click", function Password_ng_container_3_ng_container_1__svg_svg_1_Template_svg_click_0_listener() {
      \u0275\u0275restoreView(_r5);
      const ctx_r3 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r3.onMaskToggle());
    });
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r3 = \u0275\u0275nextContext(3);
    \u0275\u0275classMap(ctx_r3.cx("maskIcon"));
    \u0275\u0275property("pBind", ctx_r3.ptm("maskIcon"));
  }
}
function Password_ng_container_3_ng_container_1_span_2_1_ng_template_0_Template(rf, ctx) {
}
function Password_ng_container_3_ng_container_1_span_2_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275template(0, Password_ng_container_3_ng_container_1_span_2_1_ng_template_0_Template, 0, 0, "ng-template");
  }
}
function Password_ng_container_3_ng_container_1_span_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r6 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "span", 7);
    \u0275\u0275listener("click", function Password_ng_container_3_ng_container_1_span_2_Template_span_click_0_listener() {
      \u0275\u0275restoreView(_r6);
      const ctx_r3 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r3.onMaskToggle());
    });
    \u0275\u0275template(1, Password_ng_container_3_ng_container_1_span_2_1_Template, 1, 0, null, 13);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r3 = \u0275\u0275nextContext(3);
    \u0275\u0275property("pBind", ctx_r3.ptm("maskIcon"));
    \u0275\u0275advance();
    \u0275\u0275property("ngTemplateOutlet", ctx_r3.hideIconTemplate || ctx_r3._hideIconTemplate)("ngTemplateOutletContext", \u0275\u0275pureFunction1(3, _c7, ctx_r3.cx("maskIcon")));
  }
}
function Password_ng_container_3_ng_container_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementContainerStart(0);
    \u0275\u0275template(1, Password_ng_container_3_ng_container_1__svg_svg_1_Template, 1, 3, "svg", 10)(2, Password_ng_container_3_ng_container_1_span_2_Template, 2, 5, "span", 11);
    \u0275\u0275elementContainerEnd();
  }
  if (rf & 2) {
    const ctx_r3 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", !ctx_r3.hideIconTemplate && !ctx_r3._hideIconTemplate);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r3.hideIconTemplate || ctx_r3._hideIconTemplate);
  }
}
function Password_ng_container_3_ng_container_2__svg_svg_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r7 = \u0275\u0275getCurrentView();
    \u0275\u0275namespaceSVG();
    \u0275\u0275elementStart(0, "svg", 15);
    \u0275\u0275listener("click", function Password_ng_container_3_ng_container_2__svg_svg_1_Template_svg_click_0_listener() {
      \u0275\u0275restoreView(_r7);
      const ctx_r3 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r3.onMaskToggle());
    });
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r3 = \u0275\u0275nextContext(3);
    \u0275\u0275classMap(ctx_r3.cx("unmaskIcon"));
    \u0275\u0275property("pBind", ctx_r3.ptm("unmaskIcon"));
  }
}
function Password_ng_container_3_ng_container_2_span_2_1_ng_template_0_Template(rf, ctx) {
}
function Password_ng_container_3_ng_container_2_span_2_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275template(0, Password_ng_container_3_ng_container_2_span_2_1_ng_template_0_Template, 0, 0, "ng-template");
  }
}
function Password_ng_container_3_ng_container_2_span_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r8 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "span", 7);
    \u0275\u0275listener("click", function Password_ng_container_3_ng_container_2_span_2_Template_span_click_0_listener() {
      \u0275\u0275restoreView(_r8);
      const ctx_r3 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r3.onMaskToggle());
    });
    \u0275\u0275template(1, Password_ng_container_3_ng_container_2_span_2_1_Template, 1, 0, null, 13);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r3 = \u0275\u0275nextContext(3);
    \u0275\u0275property("pBind", ctx_r3.ptm("unmaskIcon"));
    \u0275\u0275advance();
    \u0275\u0275property("ngTemplateOutlet", ctx_r3.showIconTemplate || ctx_r3._showIconTemplate)("ngTemplateOutletContext", \u0275\u0275pureFunction1(3, _c7, ctx_r3.cx("unmaskIcon")));
  }
}
function Password_ng_container_3_ng_container_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementContainerStart(0);
    \u0275\u0275template(1, Password_ng_container_3_ng_container_2__svg_svg_1_Template, 1, 3, "svg", 14)(2, Password_ng_container_3_ng_container_2_span_2_Template, 2, 5, "span", 11);
    \u0275\u0275elementContainerEnd();
  }
  if (rf & 2) {
    const ctx_r3 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", !ctx_r3.showIconTemplate && !ctx_r3._showIconTemplate);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r3.showIconTemplate || ctx_r3._showIconTemplate);
  }
}
function Password_ng_container_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementContainerStart(0);
    \u0275\u0275template(1, Password_ng_container_3_ng_container_1_Template, 3, 2, "ng-container", 4)(2, Password_ng_container_3_ng_container_2_Template, 3, 2, "ng-container", 4);
    \u0275\u0275elementContainerEnd();
  }
  if (rf & 2) {
    const ctx_r3 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r3.unmasked);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", !ctx_r3.unmasked);
  }
}
function Password_div_4_ng_container_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementContainer(0);
  }
}
function Password_div_4_ng_container_3_ng_container_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementContainer(0);
  }
}
function Password_div_4_ng_container_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementContainerStart(0);
    \u0275\u0275template(1, Password_div_4_ng_container_3_ng_container_1_Template, 1, 0, "ng-container", 8);
    \u0275\u0275elementContainerEnd();
  }
  if (rf & 2) {
    const ctx_r3 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275property("ngTemplateOutlet", ctx_r3.contentTemplate || ctx_r3._contentTemplate);
  }
}
function Password_div_4_ng_template_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 17)(1, "div", 17);
    \u0275\u0275element(2, "div", 18);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "div", 17);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r3 = \u0275\u0275nextContext(2);
    \u0275\u0275classMap(ctx_r3.cx("content"));
    \u0275\u0275property("pBind", ctx_r3.ptm("content"));
    \u0275\u0275advance();
    \u0275\u0275classMap(ctx_r3.cx("meter"));
    \u0275\u0275property("pBind", ctx_r3.ptm("meter"));
    \u0275\u0275advance();
    \u0275\u0275classMap(ctx_r3.cx("meterLabel"));
    \u0275\u0275property("ngStyle", \u0275\u0275pureFunction1(14, _c10, ctx_r3.meter ? ctx_r3.meter.width : ""))("pBind", ctx_r3.ptm("meterLabel"));
    \u0275\u0275advance();
    \u0275\u0275classMap(ctx_r3.cx("meterText"));
    \u0275\u0275property("pBind", ctx_r3.ptm("meterText"));
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r3.infoText);
  }
}
function Password_div_4_ng_container_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementContainer(0);
  }
}
function Password_div_4_Template(rf, ctx) {
  if (rf & 1) {
    const _r9 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 7, 1);
    \u0275\u0275listener("click", function Password_div_4_Template_div_click_0_listener($event) {
      \u0275\u0275restoreView(_r9);
      const ctx_r3 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r3.onOverlayClick($event));
    })("@overlayAnimation.start", function Password_div_4_Template_div_animation_overlayAnimation_start_0_listener($event) {
      \u0275\u0275restoreView(_r9);
      const ctx_r3 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r3.onAnimationStart($event));
    })("@overlayAnimation.done", function Password_div_4_Template_div_animation_overlayAnimation_done_0_listener($event) {
      \u0275\u0275restoreView(_r9);
      const ctx_r3 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r3.onAnimationEnd($event));
    });
    \u0275\u0275template(2, Password_div_4_ng_container_2_Template, 1, 0, "ng-container", 8)(3, Password_div_4_ng_container_3_Template, 2, 1, "ng-container", 16)(4, Password_div_4_ng_template_4_Template, 5, 16, "ng-template", null, 2, \u0275\u0275templateRefExtractor)(6, Password_div_4_ng_container_6_Template, 1, 0, "ng-container", 8);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const content_r10 = \u0275\u0275reference(5);
    const ctx_r3 = \u0275\u0275nextContext();
    \u0275\u0275styleMap(ctx_r3.sx("overlay"));
    \u0275\u0275classMap(ctx_r3.cx("overlay"));
    \u0275\u0275property("@overlayAnimation", \u0275\u0275pureFunction1(13, _c9, \u0275\u0275pureFunction2(10, _c8, ctx_r3.showTransitionOptions, ctx_r3.hideTransitionOptions)))("pBind", ctx_r3.ptm("overlay"));
    \u0275\u0275advance(2);
    \u0275\u0275property("ngTemplateOutlet", ctx_r3.headerTemplate || ctx_r3._headerTemplate);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r3.contentTemplate || ctx_r3._contentTemplate)("ngIfElse", content_r10);
    \u0275\u0275advance(3);
    \u0275\u0275property("ngTemplateOutlet", ctx_r3.footerTemplate || ctx_r3._footerTemplate);
  }
}
var style3 = (
  /*css*/
  `
    ${style2}

    /* For PrimeNG */
    p-password.ng-invalid.ng-dirty .p-inputtext {
        border-color: dt('inputtext.invalid.border.color');
    }

    p-password.ng-invalid.ng-dirty .p-inputtext:enabled:focus {
        border-color: dt('inputtext.focus.border.color');
    }

    p-password.ng-invalid.ng-dirty .p-inputtext::placeholder {
        color: dt('inputtext.invalid.placeholder.color');
    }

    .p-password-fluid-directive {
        width: 100%;
    }
`
);
var inlineStyles = {
  root: ({
    instance
  }) => ({
    position: instance.$appendTo() === "self" ? "relative" : void 0
  }),
  overlay: {
    position: "absolute"
  }
};
var classes = {
  root: ({
    instance
  }) => ["p-password p-component p-inputwrapper", {
    "p-inputwrapper-filled": instance.$filled(),
    "p-variant-filled": instance.$variant() === "filled",
    "p-inputwrapper-focus": instance.focused,
    "p-password-fluid": instance.hasFluid
  }],
  rootDirective: ({
    instance
  }) => ["p-password p-inputtext p-component p-inputwrapper", {
    "p-inputwrapper-filled": instance.$filled(),
    "p-variant-filled": instance.$variant() === "filled",
    "p-password-fluid-directive": instance.hasFluid
  }],
  pcInputText: "p-password-input",
  maskIcon: "p-password-toggle-mask-icon p-password-mask-icon",
  unmaskIcon: "p-password-toggle-mask-icon p-password-unmask-icon",
  overlay: "p-password-overlay p-component",
  content: "p-password-content",
  meter: "p-password-meter",
  meterLabel: ({
    instance
  }) => `p-password-meter-label ${instance.meter ? "p-password-meter-" + instance.meter.strength : ""}`,
  meterText: "p-password-meter-text",
  clearIcon: "p-password-clear-icon"
};
var PasswordStyle = class _PasswordStyle extends BaseStyle {
  name = "password";
  style = style3;
  classes = classes;
  inlineStyles = inlineStyles;
  static \u0275fac = /* @__PURE__ */ (() => {
    let \u0275PasswordStyle_BaseFactory;
    return function PasswordStyle_Factory(__ngFactoryType__) {
      return (\u0275PasswordStyle_BaseFactory || (\u0275PasswordStyle_BaseFactory = \u0275\u0275getInheritedFactory(_PasswordStyle)))(__ngFactoryType__ || _PasswordStyle);
    };
  })();
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({
    token: _PasswordStyle,
    factory: _PasswordStyle.\u0275fac
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(PasswordStyle, [{
    type: Injectable
  }], null, null);
})();
var PasswordClasses;
(function(PasswordClasses2) {
  PasswordClasses2["root"] = "p-password";
  PasswordClasses2["pcInputText"] = "p-password-input";
  PasswordClasses2["maskIcon"] = "p-password-mask-icon";
  PasswordClasses2["unmaskIcon"] = "p-password-unmask-icon";
  PasswordClasses2["overlay"] = "p-password-overlay";
  PasswordClasses2["meter"] = "p-password-meter";
  PasswordClasses2["meterLabel"] = "p-password-meter-label";
  PasswordClasses2["meterText"] = "p-password-meter-text";
  PasswordClasses2["clearIcon"] = "p-password-clear-icon";
})(PasswordClasses || (PasswordClasses = {}));
var PASSWORD_DIRECTIVE_INSTANCE = new InjectionToken("PASSWORD_DIRECTIVE_INSTANCE");
var PASSWORD_INSTANCE = new InjectionToken("PASSWORD_INSTANCE");
var PasswordDirective = class _PasswordDirective extends BaseEditableHolder {
  zone;
  bindDirectiveInstance = inject(Bind, {
    self: true
  });
  $pcPasswordDirective = inject(PASSWORD_DIRECTIVE_INSTANCE, {
    optional: true,
    skipSelf: true
  }) ?? void 0;
  onAfterViewChecked() {
    this.bindDirectiveInstance.setAttrs(this.ptms(["host", "root"]));
  }
  /**
   * Text to prompt password entry. Defaults to PrimeNG I18N API configuration.
   * @group Props
   */
  promptLabel = "Enter a password";
  /**
   * Text for a weak password. Defaults to PrimeNG I18N API configuration.
   * @group Props
   */
  weakLabel = "Weak";
  /**
   * Text for a medium password. Defaults to PrimeNG I18N API configuration.
   * @group Props
   */
  mediumLabel = "Medium";
  /**
   * Text for a strong password. Defaults to PrimeNG I18N API configuration.
   * @group Props
   */
  strongLabel = "Strong";
  /**
   * Whether to show the strength indicator or not.
   * @group Props
   */
  feedback = true;
  /**
   * Sets the visibility of the password field.
   * @defaultValue false
   * @type boolean
   * @group Props
   */
  set showPassword(show) {
    this.el.nativeElement.type = show ? "text" : "password";
  }
  /**
   * Specifies the input variant of the component.
   * @defaultValue 'outlined'
   * @group Props
   */
  variant = input(...ngDevMode ? [void 0, {
    debugName: "variant"
  }] : []);
  /**
   * Spans 100% width of the container when enabled.
   * @defaultValue false
   * @group Props
   */
  fluid = input(void 0, ...ngDevMode ? [{
    debugName: "fluid",
    transform: booleanAttribute
  }] : [{
    transform: booleanAttribute
  }]);
  /**
   * Specifies the size of the component.
   * @defaultValue undefined
   * @group Props
   */
  size = input(void 0, ...ngDevMode ? [{
    debugName: "size",
    alias: "pSize"
  }] : [{
    alias: "pSize"
  }]);
  pcFluid = inject(Fluid, {
    optional: true,
    host: true,
    skipSelf: true
  });
  $variant = computed(() => this.variant() || this.config.inputStyle() || this.config.inputVariant(), ...ngDevMode ? [{
    debugName: "$variant"
  }] : []);
  get hasFluid() {
    return this.fluid() ?? !!this.pcFluid;
  }
  panel;
  meter;
  info;
  filled;
  content;
  label;
  scrollHandler;
  documentResizeListener;
  _componentStyle = inject(PasswordStyle);
  constructor(zone) {
    super();
    this.zone = zone;
  }
  onInput(e) {
    this.writeModelValue(this.el.nativeElement.value);
  }
  createPanel() {
    if (isPlatformBrowser(this.platformId)) {
      this.panel = this.renderer.createElement("div");
      this.renderer.addClass(this.panel, "p-password-overlay");
      this.renderer.addClass(this.panel, "p-component");
      this.content = this.renderer.createElement("div");
      this.renderer.addClass(this.content, "p-password-content");
      this.renderer.appendChild(this.panel, this.content);
      this.meter = this.renderer.createElement("div");
      this.renderer.addClass(this.meter, "p-password-meter");
      this.renderer.appendChild(this.content, this.meter);
      this.label = this.renderer.createElement("div");
      this.renderer.addClass(this.label, "p-password-meter-label");
      this.renderer.appendChild(this.meter, this.label);
      this.info = this.renderer.createElement("div");
      this.renderer.addClass(this.info, "p-password-meter-text");
      this.renderer.setProperty(this.info, "textContent", this.promptLabel);
      this.renderer.appendChild(this.content, this.info);
      this.renderer.setStyle(this.panel, "minWidth", `${this.el.nativeElement.offsetWidth}px`);
      this.renderer.appendChild(document.body, this.panel);
      this.updateMeter();
    }
  }
  showOverlay() {
    if (this.feedback) {
      if (!this.panel) {
        this.createPanel();
      }
      this.renderer.setStyle(this.panel, "zIndex", String(++DomHandler.zindex));
      this.renderer.setStyle(this.panel, "display", "block");
      this.zone.runOutsideAngular(() => {
        setTimeout(() => {
          W(this.panel, "p-connected-overlay-visible");
          this.bindScrollListener();
          this.bindDocumentResizeListener();
        }, 1);
      });
      D(this.panel, this.el.nativeElement);
    }
  }
  hideOverlay() {
    if (this.feedback && this.panel) {
      W(this.panel, "p-connected-overlay-hidden");
      P(this.panel, "p-connected-overlay-visible");
      this.unbindScrollListener();
      this.unbindDocumentResizeListener();
      this.zone.runOutsideAngular(() => {
        setTimeout(() => {
          this.onDestroy();
        }, 150);
      });
    }
  }
  onFocus() {
    this.showOverlay();
  }
  onBlur() {
    this.hideOverlay();
  }
  labelSignal = signal("", ...ngDevMode ? [{
    debugName: "labelSignal"
  }] : []);
  onKeyup(e) {
    if (this.feedback) {
      let value = e.target.value, label = null, meterPos = null;
      if (value.length === 0) {
        label = this.promptLabel;
        meterPos = "0px 0px";
      } else {
        var score = this.testStrength(value);
        if (score < 30) {
          label = this.weakLabel;
          meterPos = "0px -10px";
        } else if (score >= 30 && score < 80) {
          label = this.mediumLabel;
          meterPos = "0px -20px";
        } else if (score >= 80) {
          label = this.strongLabel;
          meterPos = "0px -30px";
        }
        this.labelSignal.set(label);
        this.updateMeter();
      }
      if (!this.panel || !R(this.panel, "p-connected-overlay-visible")) {
        this.showOverlay();
      }
      if (this.meter) {
        this.renderer.setStyle(this.meter, "backgroundPosition", meterPos);
      }
      if (this.info) {
        this.info.textContent = label;
      }
    }
  }
  updateMeter() {
    if (this.labelSignal() && this.meter && this.info) {
      const label = this.labelSignal();
      const strengthClass = this.strengthClass(label.toLowerCase());
      const width = this.getWidth(label.toLowerCase());
      this.renderer.addClass(this.meter, strengthClass);
      this.renderer.setStyle(this.meter, "width", width);
      this.info.textContent = label;
    }
  }
  getWidth(label) {
    return label === "weak" ? "33.33%" : label === "medium" ? "66.66%" : label === "strong" ? "100%" : "";
  }
  strengthClass(label) {
    return `p-password-meter${label ? `-${label}` : ""}`;
  }
  testStrength(str) {
    let grade = 0;
    let val;
    val = str.match("[0-9]");
    grade += this.normalize(val ? val.length : 1 / 4, 1) * 25;
    val = str.match("[a-zA-Z]");
    grade += this.normalize(val ? val.length : 1 / 2, 3) * 10;
    val = str.match("[!@#$%^&*?_~.,;=]");
    grade += this.normalize(val ? val.length : 1 / 6, 1) * 35;
    val = str.match("[A-Z]");
    grade += this.normalize(val ? val.length : 1 / 6, 1) * 30;
    grade *= str.length / 8;
    return grade > 100 ? 100 : grade;
  }
  normalize(x, y) {
    let diff = x - y;
    if (diff <= 0) return x / y;
    else return 1 + 0.5 * (x / (x + y / 4));
  }
  bindScrollListener() {
    if (!this.scrollHandler) {
      this.scrollHandler = new ConnectedOverlayScrollHandler(this.el.nativeElement, () => {
        if (R(this.panel, "p-connected-overlay-visible")) {
          this.hideOverlay();
        }
      });
    }
    this.scrollHandler.bindScrollListener();
  }
  unbindScrollListener() {
    if (this.scrollHandler) {
      this.scrollHandler.unbindScrollListener();
    }
  }
  bindDocumentResizeListener() {
    if (isPlatformBrowser(this.platformId)) {
      if (!this.documentResizeListener) {
        const window = this.document.defaultView;
        this.documentResizeListener = this.renderer.listen(window, "resize", this.onWindowResize.bind(this));
      }
    }
  }
  unbindDocumentResizeListener() {
    if (this.documentResizeListener) {
      this.documentResizeListener();
      this.documentResizeListener = null;
    }
  }
  onWindowResize() {
    if (!Yt()) {
      this.hideOverlay();
    }
  }
  onDestroy() {
    if (this.panel) {
      if (this.scrollHandler) {
        this.scrollHandler.destroy();
        this.scrollHandler = null;
      }
      this.unbindDocumentResizeListener();
      this.renderer.removeChild(this.document.body, this.panel);
      this.panel = null;
      this.meter = null;
      this.info = null;
    }
  }
  static \u0275fac = function PasswordDirective_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _PasswordDirective)(\u0275\u0275directiveInject(NgZone));
  };
  static \u0275dir = /* @__PURE__ */ \u0275\u0275defineDirective({
    type: _PasswordDirective,
    selectors: [["", "pPassword", ""]],
    hostVars: 2,
    hostBindings: function PasswordDirective_HostBindings(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275listener("input", function PasswordDirective_input_HostBindingHandler($event) {
          return ctx.onInput($event);
        })("focus", function PasswordDirective_focus_HostBindingHandler() {
          return ctx.onFocus();
        })("blur", function PasswordDirective_blur_HostBindingHandler() {
          return ctx.onBlur();
        })("keyup", function PasswordDirective_keyup_HostBindingHandler($event) {
          return ctx.onKeyup($event);
        });
      }
      if (rf & 2) {
        \u0275\u0275classMap(ctx.cx("rootDirective"));
      }
    },
    inputs: {
      promptLabel: "promptLabel",
      weakLabel: "weakLabel",
      mediumLabel: "mediumLabel",
      strongLabel: "strongLabel",
      feedback: [2, "feedback", "feedback", booleanAttribute],
      showPassword: "showPassword",
      variant: [1, "variant"],
      fluid: [1, "fluid"],
      size: [1, "pSize", "size"]
    },
    features: [\u0275\u0275ProvidersFeature([PasswordStyle, {
      provide: PASSWORD_DIRECTIVE_INSTANCE,
      useExisting: _PasswordDirective
    }, {
      provide: PARENT_INSTANCE,
      useExisting: _PasswordDirective
    }]), \u0275\u0275HostDirectivesFeature([Bind]), \u0275\u0275InheritDefinitionFeature]
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(PasswordDirective, [{
    type: Directive,
    args: [{
      selector: "[pPassword]",
      standalone: true,
      host: {
        "[class]": "cx('rootDirective')"
      },
      providers: [PasswordStyle, {
        provide: PASSWORD_DIRECTIVE_INSTANCE,
        useExisting: PasswordDirective
      }, {
        provide: PARENT_INSTANCE,
        useExisting: PasswordDirective
      }],
      hostDirectives: [Bind]
    }]
  }], () => [{
    type: NgZone
  }], {
    promptLabel: [{
      type: Input
    }],
    weakLabel: [{
      type: Input
    }],
    mediumLabel: [{
      type: Input
    }],
    strongLabel: [{
      type: Input
    }],
    feedback: [{
      type: Input,
      args: [{
        transform: booleanAttribute
      }]
    }],
    showPassword: [{
      type: Input
    }],
    variant: [{
      type: Input,
      args: [{
        isSignal: true,
        alias: "variant",
        required: false
      }]
    }],
    fluid: [{
      type: Input,
      args: [{
        isSignal: true,
        alias: "fluid",
        required: false
      }]
    }],
    size: [{
      type: Input,
      args: [{
        isSignal: true,
        alias: "pSize",
        required: false
      }]
    }],
    onInput: [{
      type: HostListener,
      args: ["input", ["$event"]]
    }],
    onFocus: [{
      type: HostListener,
      args: ["focus"]
    }],
    onBlur: [{
      type: HostListener,
      args: ["blur"]
    }],
    onKeyup: [{
      type: HostListener,
      args: ["keyup", ["$event"]]
    }]
  });
})();
var MapperPipe = class _MapperPipe {
  transform(value, mapper, ...args) {
    return mapper(value, ...args);
  }
  static \u0275fac = function MapperPipe_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _MapperPipe)();
  };
  static \u0275pipe = /* @__PURE__ */ \u0275\u0275definePipe({
    name: "mapper",
    type: _MapperPipe,
    pure: true
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MapperPipe, [{
    type: Pipe,
    args: [{
      name: "mapper",
      pure: true,
      standalone: true
    }]
  }], null, null);
})();
var Password_VALUE_ACCESSOR = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => Password),
  multi: true
};
var Password = class _Password extends BaseInput {
  bindDirectiveInstance = inject(Bind, {
    self: true
  });
  $pcPassword = inject(PASSWORD_INSTANCE, {
    optional: true,
    skipSelf: true
  }) ?? void 0;
  onAfterViewChecked() {
    this.bindDirectiveInstance.setAttrs(this.ptms(["host", "root"]));
  }
  /**
   * Defines a string that labels the input for accessibility.
   * @group Props
   */
  ariaLabel;
  /**
   * Specifies one or more IDs in the DOM that labels the input field.
   * @group Props
   */
  ariaLabelledBy;
  /**
   * Label of the input for accessibility.
   * @group Props
   */
  label;
  /**
   * Text to prompt password entry. Defaults to PrimeNG I18N API configuration.
   * @group Props
   */
  promptLabel;
  /**
   * Regex value for medium regex.
   * @group Props
   */
  mediumRegex = "^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})";
  /**
   * Regex value for strong regex.
   * @group Props
   */
  strongRegex = "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})";
  /**
   * Text for a weak password. Defaults to PrimeNG I18N API configuration.
   * @group Props
   */
  weakLabel;
  /**
   * Text for a medium password. Defaults to PrimeNG I18N API configuration.
   * @group Props
   */
  mediumLabel;
  /**
   * specifies the maximum number of characters allowed in the input element.
   * @deprecated since v20.0.0, use maxlength instead.
   * @group Props
   */
  maxLength;
  /**
   * Text for a strong password. Defaults to PrimeNG I18N API configuration.
   * @group Props
   */
  strongLabel;
  /**
   * Identifier of the accessible input element.
   * @group Props
   */
  inputId;
  /**
   * Whether to show the strength indicator or not.
   * @group Props
   */
  feedback = true;
  /**
   * Whether to show an icon to display the password as plain text.
   * @group Props
   */
  toggleMask;
  /**
   * Style class of the input field.
   * @group Props
   */
  inputStyleClass;
  /**
   * Style class of the element.
   * @deprecated since v20.0.0, use `class` instead.
   * @group Props
   */
  styleClass;
  /**
   * Inline style of the input field.
   * @group Props
   */
  inputStyle;
  /**
   * Transition options of the show animation.
   * @group Props
   */
  showTransitionOptions = ".12s cubic-bezier(0, 0, 0.2, 1)";
  /**
   * Transition options of the hide animation.
   * @group Props
   */
  hideTransitionOptions = ".1s linear";
  /**
   * Specify automated assistance in filling out password by browser.
   * @group Props
   */
  autocomplete;
  /**
   * Advisory information to display on input.
   * @group Props
   */
  placeholder;
  /**
   * When enabled, a clear icon is displayed to clear the value.
   * @group Props
   */
  showClear = false;
  /**
   * When present, it specifies that the component should automatically get focus on load.
   * @group Props
   */
  autofocus;
  /**
   * Index of the element in tabbing order.
   * @group Props
   */
  tabindex;
  /**
   * Target element to attach the overlay, valid values are "body" or a local ng-template variable of another element (note: use binding with brackets for template variables, e.g. [appendTo]="mydiv" for a div element having #mydiv as variable name).
   * @defaultValue 'self'
   * @group Props
   */
  appendTo = input(void 0, ...ngDevMode ? [{
    debugName: "appendTo"
  }] : []);
  /**
   * Callback to invoke when the component receives focus.
   * @param {Event} event - Browser event.
   * @group Emits
   */
  onFocus = new EventEmitter();
  /**
   * Callback to invoke when the component loses focus.
   * @param {Event} event - Browser event.
   * @group Emits
   */
  onBlur = new EventEmitter();
  /**
   * Callback to invoke when clear button is clicked.
   * @group Emits
   */
  onClear = new EventEmitter();
  input;
  contentTemplate;
  footerTemplate;
  headerTemplate;
  clearIconTemplate;
  hideIconTemplate;
  showIconTemplate;
  templates;
  $appendTo = computed(() => this.appendTo() || this.config.overlayAppendTo(), ...ngDevMode ? [{
    debugName: "$appendTo"
  }] : []);
  _contentTemplate;
  _footerTemplate;
  _headerTemplate;
  _clearIconTemplate;
  _hideIconTemplate;
  _showIconTemplate;
  overlayVisible = false;
  meter;
  infoText;
  focused = false;
  unmasked = false;
  mediumCheckRegExp;
  strongCheckRegExp;
  resizeListener;
  scrollHandler;
  overlay;
  value = null;
  translationSubscription;
  _componentStyle = inject(PasswordStyle);
  overlayService = inject(OverlayService);
  onInit() {
    this.infoText = this.promptText();
    this.mediumCheckRegExp = new RegExp(this.mediumRegex);
    this.strongCheckRegExp = new RegExp(this.strongRegex);
    this.translationSubscription = this.config.translationObserver.subscribe(() => {
      this.updateUI(this.value || "");
    });
  }
  onAfterContentInit() {
    this.templates.forEach((item) => {
      switch (item.getType()) {
        case "content":
          this._contentTemplate = item.template;
          break;
        case "header":
          this._headerTemplate = item.template;
          break;
        case "footer":
          this._footerTemplate = item.template;
          break;
        case "clearicon":
          this._clearIconTemplate = item.template;
          break;
        case "hideicon":
          this._hideIconTemplate = item.template;
          break;
        case "showicon":
          this._showIconTemplate = item.template;
          break;
        default:
          this._contentTemplate = item.template;
          break;
      }
    });
  }
  onAnimationStart(event) {
    switch (event.toState) {
      case "visible":
        this.overlay = event.element;
        zindexutils.set("overlay", this.overlay, this.config.zIndex.overlay);
        this.$attrSelector && this.overlay.setAttribute(this.$attrSelector, "");
        this.appendContainer();
        this.alignOverlay();
        this.bindScrollListener();
        this.bindResizeListener();
        break;
      case "void":
        this.unbindScrollListener();
        this.unbindResizeListener();
        this.overlay = null;
        break;
    }
  }
  onAnimationEnd(event) {
    switch (event.toState) {
      case "void":
        zindexutils.clear(event.element);
        break;
    }
  }
  appendContainer() {
    DomHandler.appendOverlay(this.overlay, this.$appendTo() === "body" ? this.document.body : this.$appendTo(), this.$appendTo());
  }
  alignOverlay() {
    this.overlay.style.minWidth = v(this.input.nativeElement) + "px";
    if (this.$appendTo() === "self") I(this.overlay, this.input?.nativeElement);
    else D(this.overlay, this.input?.nativeElement);
  }
  onInput(event) {
    this.value = event.target.value;
    this.onModelChange(this.value);
  }
  onInputFocus(event) {
    this.focused = true;
    if (this.feedback) {
      this.overlayVisible = true;
    }
    this.onFocus.emit(event);
  }
  onInputBlur(event) {
    this.focused = false;
    if (this.feedback) {
      this.overlayVisible = false;
    }
    this.onModelTouched();
    this.onBlur.emit(event);
  }
  onKeyUp(event) {
    if (this.feedback) {
      let value = event.target.value;
      this.updateUI(value);
      if (event.code === "Escape") {
        this.overlayVisible && (this.overlayVisible = false);
        return;
      }
      if (!this.overlayVisible) {
        this.overlayVisible = true;
      }
    }
  }
  updateUI(value) {
    let label = null;
    let meter = null;
    switch (this.testStrength(value)) {
      case 1:
        label = this.weakText();
        meter = {
          strength: "weak",
          width: "33.33%"
        };
        break;
      case 2:
        label = this.mediumText();
        meter = {
          strength: "medium",
          width: "66.66%"
        };
        break;
      case 3:
        label = this.strongText();
        meter = {
          strength: "strong",
          width: "100%"
        };
        break;
      default:
        label = this.promptText();
        meter = null;
        break;
    }
    this.meter = meter;
    this.infoText = label;
  }
  onMaskToggle() {
    this.unmasked = !this.unmasked;
  }
  onOverlayClick(event) {
    this.overlayService.add({
      originalEvent: event,
      target: this.el.nativeElement
    });
  }
  testStrength(str) {
    let level = 0;
    if (this.strongCheckRegExp?.test(str)) level = 3;
    else if (this.mediumCheckRegExp?.test(str)) level = 2;
    else if (str.length) level = 1;
    return level;
  }
  bindScrollListener() {
    if (isPlatformBrowser(this.platformId)) {
      if (!this.scrollHandler) {
        this.scrollHandler = new ConnectedOverlayScrollHandler(this.input.nativeElement, () => {
          if (this.overlayVisible) {
            this.overlayVisible = false;
          }
        });
      }
      this.scrollHandler.bindScrollListener();
    }
  }
  bindResizeListener() {
    if (isPlatformBrowser(this.platformId)) {
      if (!this.resizeListener) {
        const window = this.document.defaultView;
        this.resizeListener = this.renderer.listen(window, "resize", () => {
          if (this.overlayVisible && !Yt()) {
            this.overlayVisible = false;
          }
        });
      }
    }
  }
  unbindScrollListener() {
    if (this.scrollHandler) {
      this.scrollHandler.unbindScrollListener();
    }
  }
  unbindResizeListener() {
    if (this.resizeListener) {
      this.resizeListener();
      this.resizeListener = null;
    }
  }
  promptText() {
    return this.promptLabel || this.getTranslation(TranslationKeys.PASSWORD_PROMPT);
  }
  weakText() {
    return this.weakLabel || this.getTranslation(TranslationKeys.WEAK);
  }
  mediumText() {
    return this.mediumLabel || this.getTranslation(TranslationKeys.MEDIUM);
  }
  strongText() {
    return this.strongLabel || this.getTranslation(TranslationKeys.STRONG);
  }
  restoreAppend() {
    if (this.overlay && this.$appendTo()) {
      if (this.$appendTo() === "body") this.renderer.removeChild(this.document.body, this.overlay);
      else this.document.getElementById(this.$appendTo()).removeChild(this.overlay);
    }
  }
  inputType(unmasked) {
    return unmasked ? "text" : "password";
  }
  getTranslation(option) {
    return this.config.getTranslation(option);
  }
  clear() {
    this.value = null;
    this.onModelChange(this.value);
    this.writeValue(this.value);
    this.onClear.emit();
  }
  /**
   * @override
   *
   * @see {@link BaseEditableHolder.writeControlValue}
   * Writes the value to the control.
   */
  writeControlValue(value, setModelValue) {
    if (value === void 0) this.value = null;
    else this.value = value;
    if (this.feedback) this.updateUI(this.value || "");
    setModelValue(this.value);
    this.cd.markForCheck();
  }
  onDestroy() {
    if (this.overlay) {
      zindexutils.clear(this.overlay);
      this.overlay = null;
    }
    this.restoreAppend();
    this.unbindResizeListener();
    if (this.scrollHandler) {
      this.scrollHandler.destroy();
      this.scrollHandler = null;
    }
    if (this.translationSubscription) {
      this.translationSubscription.unsubscribe();
    }
  }
  static \u0275fac = /* @__PURE__ */ (() => {
    let \u0275Password_BaseFactory;
    return function Password_Factory(__ngFactoryType__) {
      return (\u0275Password_BaseFactory || (\u0275Password_BaseFactory = \u0275\u0275getInheritedFactory(_Password)))(__ngFactoryType__ || _Password);
    };
  })();
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({
    type: _Password,
    selectors: [["p-password"]],
    contentQueries: function Password_ContentQueries(rf, ctx, dirIndex) {
      if (rf & 1) {
        \u0275\u0275contentQuery(dirIndex, _c03, 4);
        \u0275\u0275contentQuery(dirIndex, _c1, 4);
        \u0275\u0275contentQuery(dirIndex, _c2, 4);
        \u0275\u0275contentQuery(dirIndex, _c3, 4);
        \u0275\u0275contentQuery(dirIndex, _c4, 4);
        \u0275\u0275contentQuery(dirIndex, _c5, 4);
        \u0275\u0275contentQuery(dirIndex, PrimeTemplate, 4);
      }
      if (rf & 2) {
        let _t;
        \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx.contentTemplate = _t.first);
        \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx.footerTemplate = _t.first);
        \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx.headerTemplate = _t.first);
        \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx.clearIconTemplate = _t.first);
        \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx.hideIconTemplate = _t.first);
        \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx.showIconTemplate = _t.first);
        \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx.templates = _t);
      }
    },
    viewQuery: function Password_Query(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275viewQuery(_c6, 5);
      }
      if (rf & 2) {
        let _t;
        \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx.input = _t.first);
      }
    },
    hostVars: 4,
    hostBindings: function Password_HostBindings(rf, ctx) {
      if (rf & 2) {
        \u0275\u0275styleMap(ctx.sx("root"));
        \u0275\u0275classMap(ctx.cn(ctx.cx("root"), ctx.styleClass));
      }
    },
    inputs: {
      ariaLabel: "ariaLabel",
      ariaLabelledBy: "ariaLabelledBy",
      label: "label",
      promptLabel: "promptLabel",
      mediumRegex: "mediumRegex",
      strongRegex: "strongRegex",
      weakLabel: "weakLabel",
      mediumLabel: "mediumLabel",
      maxLength: [2, "maxLength", "maxLength", numberAttribute],
      strongLabel: "strongLabel",
      inputId: "inputId",
      feedback: [2, "feedback", "feedback", booleanAttribute],
      toggleMask: [2, "toggleMask", "toggleMask", booleanAttribute],
      inputStyleClass: "inputStyleClass",
      styleClass: "styleClass",
      inputStyle: "inputStyle",
      showTransitionOptions: "showTransitionOptions",
      hideTransitionOptions: "hideTransitionOptions",
      autocomplete: "autocomplete",
      placeholder: "placeholder",
      showClear: [2, "showClear", "showClear", booleanAttribute],
      autofocus: [2, "autofocus", "autofocus", booleanAttribute],
      tabindex: [2, "tabindex", "tabindex", numberAttribute],
      appendTo: [1, "appendTo"]
    },
    outputs: {
      onFocus: "onFocus",
      onBlur: "onBlur",
      onClear: "onClear"
    },
    features: [\u0275\u0275ProvidersFeature([Password_VALUE_ACCESSOR, PasswordStyle, {
      provide: PASSWORD_INSTANCE,
      useExisting: _Password
    }, {
      provide: PARENT_INSTANCE,
      useExisting: _Password
    }]), \u0275\u0275HostDirectivesFeature([Bind]), \u0275\u0275InheritDefinitionFeature],
    decls: 5,
    vars: 25,
    consts: [["input", ""], ["overlay", ""], ["content", ""], ["pInputText", "", 3, "input", "focus", "blur", "keyup", "pSize", "ngStyle", "value", "variant", "invalid", "pAutoFocus", "pt"], [4, "ngIf"], [3, "class", "style", "pBind", "click", 4, "ngIf"], ["data-p-icon", "times", 3, "class", "pBind", "click", 4, "ngIf"], [3, "click", "pBind"], [4, "ngTemplateOutlet"], ["data-p-icon", "times", 3, "click", "pBind"], ["data-p-icon", "eyeslash", 3, "class", "pBind", "click", 4, "ngIf"], [3, "pBind", "click", 4, "ngIf"], ["data-p-icon", "eyeslash", 3, "click", "pBind"], [4, "ngTemplateOutlet", "ngTemplateOutletContext"], ["data-p-icon", "eye", 3, "class", "pBind", "click", 4, "ngIf"], ["data-p-icon", "eye", 3, "click", "pBind"], [4, "ngIf", "ngIfElse"], [3, "pBind"], [3, "ngStyle", "pBind"]],
    template: function Password_Template(rf, ctx) {
      if (rf & 1) {
        const _r1 = \u0275\u0275getCurrentView();
        \u0275\u0275elementStart(0, "input", 3, 0);
        \u0275\u0275listener("input", function Password_Template_input_input_0_listener($event) {
          \u0275\u0275restoreView(_r1);
          return \u0275\u0275resetView(ctx.onInput($event));
        })("focus", function Password_Template_input_focus_0_listener($event) {
          \u0275\u0275restoreView(_r1);
          return \u0275\u0275resetView(ctx.onInputFocus($event));
        })("blur", function Password_Template_input_blur_0_listener($event) {
          \u0275\u0275restoreView(_r1);
          return \u0275\u0275resetView(ctx.onInputBlur($event));
        })("keyup", function Password_Template_input_keyup_0_listener($event) {
          \u0275\u0275restoreView(_r1);
          return \u0275\u0275resetView(ctx.onKeyUp($event));
        });
        \u0275\u0275elementEnd();
        \u0275\u0275template(2, Password_ng_container_2_Template, 4, 5, "ng-container", 4)(3, Password_ng_container_3_Template, 3, 2, "ng-container", 4)(4, Password_div_4_Template, 7, 15, "div", 5);
      }
      if (rf & 2) {
        \u0275\u0275classMap(ctx.cn(ctx.cx("pcInputText"), ctx.inputStyleClass));
        \u0275\u0275property("pSize", ctx.size())("ngStyle", ctx.inputStyle)("value", ctx.value)("variant", ctx.$variant())("invalid", ctx.invalid())("pAutoFocus", ctx.autofocus)("pt", ctx.ptm("pcInputText"));
        \u0275\u0275attribute("label", ctx.label)("aria-label", ctx.ariaLabel)("aria-labelledBy", ctx.ariaLabelledBy)("id", ctx.inputId)("tabindex", ctx.tabindex)("type", ctx.unmasked ? "text" : "password")("placeholder", ctx.placeholder)("autocomplete", ctx.autocomplete)("name", ctx.name())("maxlength", ctx.maxlength() || ctx.maxLength)("minlength", ctx.minlength())("required", ctx.required() ? "" : void 0)("disabled", ctx.$disabled() ? "" : void 0);
        \u0275\u0275advance(2);
        \u0275\u0275property("ngIf", ctx.showClear && ctx.value != null);
        \u0275\u0275advance();
        \u0275\u0275property("ngIf", ctx.toggleMask);
        \u0275\u0275advance();
        \u0275\u0275property("ngIf", ctx.overlayVisible);
      }
    },
    dependencies: [CommonModule, NgIf, NgTemplateOutlet, NgStyle, InputText, AutoFocus, TimesIcon, EyeSlashIcon, EyeIcon, SharedModule, BindModule, Bind],
    encapsulation: 2,
    data: {
      animation: [trigger("overlayAnimation", [transition(":enter", [style({
        opacity: 0,
        transform: "scaleY(0.8)"
      }), animate("{{showTransitionParams}}")]), transition(":leave", [animate("{{hideTransitionParams}}", style({
        opacity: 0
      }))])])]
    },
    changeDetection: 0
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(Password, [{
    type: Component,
    args: [{
      selector: "p-password",
      standalone: true,
      imports: [CommonModule, InputText, AutoFocus, TimesIcon, EyeSlashIcon, EyeIcon, SharedModule, BindModule],
      template: `
        <input
            #input
            [attr.label]="label"
            [attr.aria-label]="ariaLabel"
            [attr.aria-labelledBy]="ariaLabelledBy"
            [attr.id]="inputId"
            [attr.tabindex]="tabindex"
            pInputText
            [pSize]="size()"
            [ngStyle]="inputStyle"
            [class]="cn(cx('pcInputText'), inputStyleClass)"
            [attr.type]="unmasked ? 'text' : 'password'"
            [attr.placeholder]="placeholder"
            [attr.autocomplete]="autocomplete"
            [value]="value"
            [variant]="$variant()"
            [attr.name]="name()"
            [attr.maxlength]="maxlength() || maxLength"
            [attr.minlength]="minlength()"
            [attr.required]="required() ? '' : undefined"
            [attr.disabled]="$disabled() ? '' : undefined"
            [invalid]="invalid()"
            (input)="onInput($event)"
            (focus)="onInputFocus($event)"
            (blur)="onInputBlur($event)"
            (keyup)="onKeyUp($event)"
            [pAutoFocus]="autofocus"
            [pt]="ptm('pcInputText')"
        />
        <ng-container *ngIf="showClear && value != null">
            <svg data-p-icon="times" *ngIf="!clearIconTemplate && !_clearIconTemplate" [class]="cx('clearIcon')" (click)="clear()" [pBind]="ptm('clearIcon')" />
            <span (click)="clear()" [class]="cx('clearIcon')" [pBind]="ptm('clearIcon')">
                <ng-template *ngTemplateOutlet="clearIconTemplate || _clearIconTemplate"></ng-template>
            </span>
        </ng-container>

        <ng-container *ngIf="toggleMask">
            <ng-container *ngIf="unmasked">
                <svg data-p-icon="eyeslash" [class]="cx('maskIcon')" [pBind]="ptm('maskIcon')" *ngIf="!hideIconTemplate && !_hideIconTemplate" (click)="onMaskToggle()" />
                <span *ngIf="hideIconTemplate || _hideIconTemplate" (click)="onMaskToggle()" [pBind]="ptm('maskIcon')">
                    <ng-template *ngTemplateOutlet="hideIconTemplate || _hideIconTemplate; context: { class: cx('maskIcon') }"></ng-template>
                </span>
            </ng-container>
            <ng-container *ngIf="!unmasked">
                <svg data-p-icon="eye" *ngIf="!showIconTemplate && !_showIconTemplate" [class]="cx('unmaskIcon')" [pBind]="ptm('unmaskIcon')" (click)="onMaskToggle()" />
                <span *ngIf="showIconTemplate || _showIconTemplate" (click)="onMaskToggle()" [pBind]="ptm('unmaskIcon')">
                    <ng-template *ngTemplateOutlet="showIconTemplate || _showIconTemplate; context: { class: cx('unmaskIcon') }"></ng-template>
                </span>
            </ng-container>
        </ng-container>

        <div
            #overlay
            *ngIf="overlayVisible"
            [class]="cx('overlay')"
            [style]="sx('overlay')"
            (click)="onOverlayClick($event)"
            [@overlayAnimation]="{
                value: 'visible',
                params: { showTransitionParams: showTransitionOptions, hideTransitionParams: hideTransitionOptions }
            }"
            (@overlayAnimation.start)="onAnimationStart($event)"
            (@overlayAnimation.done)="onAnimationEnd($event)"
            [pBind]="ptm('overlay')"
        >
            <ng-container *ngTemplateOutlet="headerTemplate || _headerTemplate"></ng-container>
            <ng-container *ngIf="contentTemplate || _contentTemplate; else content">
                <ng-container *ngTemplateOutlet="contentTemplate || _contentTemplate"></ng-container>
            </ng-container>
            <ng-template #content>
                <div [class]="cx('content')" [pBind]="ptm('content')">
                    <div [class]="cx('meter')" [pBind]="ptm('meter')">
                        <div [class]="cx('meterLabel')" [ngStyle]="{ width: meter ? meter.width : '' }" [pBind]="ptm('meterLabel')"></div>
                    </div>
                    <div [class]="cx('meterText')" [pBind]="ptm('meterText')">{{ infoText }}</div>
                </div>
            </ng-template>
            <ng-container *ngTemplateOutlet="footerTemplate || _footerTemplate"></ng-container>
        </div>
    `,
      animations: [trigger("overlayAnimation", [transition(":enter", [style({
        opacity: 0,
        transform: "scaleY(0.8)"
      }), animate("{{showTransitionParams}}")]), transition(":leave", [animate("{{hideTransitionParams}}", style({
        opacity: 0
      }))])])],
      providers: [Password_VALUE_ACCESSOR, PasswordStyle, {
        provide: PASSWORD_INSTANCE,
        useExisting: Password
      }, {
        provide: PARENT_INSTANCE,
        useExisting: Password
      }],
      changeDetection: ChangeDetectionStrategy.OnPush,
      encapsulation: ViewEncapsulation.None,
      host: {
        "[class]": "cn(cx('root'), styleClass)",
        "[style]": "sx('root')"
      },
      hostDirectives: [Bind]
    }]
  }], null, {
    ariaLabel: [{
      type: Input
    }],
    ariaLabelledBy: [{
      type: Input
    }],
    label: [{
      type: Input
    }],
    promptLabel: [{
      type: Input
    }],
    mediumRegex: [{
      type: Input
    }],
    strongRegex: [{
      type: Input
    }],
    weakLabel: [{
      type: Input
    }],
    mediumLabel: [{
      type: Input
    }],
    maxLength: [{
      type: Input,
      args: [{
        transform: numberAttribute
      }]
    }],
    strongLabel: [{
      type: Input
    }],
    inputId: [{
      type: Input
    }],
    feedback: [{
      type: Input,
      args: [{
        transform: booleanAttribute
      }]
    }],
    toggleMask: [{
      type: Input,
      args: [{
        transform: booleanAttribute
      }]
    }],
    inputStyleClass: [{
      type: Input
    }],
    styleClass: [{
      type: Input
    }],
    inputStyle: [{
      type: Input
    }],
    showTransitionOptions: [{
      type: Input
    }],
    hideTransitionOptions: [{
      type: Input
    }],
    autocomplete: [{
      type: Input
    }],
    placeholder: [{
      type: Input
    }],
    showClear: [{
      type: Input,
      args: [{
        transform: booleanAttribute
      }]
    }],
    autofocus: [{
      type: Input,
      args: [{
        transform: booleanAttribute
      }]
    }],
    tabindex: [{
      type: Input,
      args: [{
        transform: numberAttribute
      }]
    }],
    appendTo: [{
      type: Input,
      args: [{
        isSignal: true,
        alias: "appendTo",
        required: false
      }]
    }],
    onFocus: [{
      type: Output
    }],
    onBlur: [{
      type: Output
    }],
    onClear: [{
      type: Output
    }],
    input: [{
      type: ViewChild,
      args: ["input"]
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
    headerTemplate: [{
      type: ContentChild,
      args: ["header", {
        descendants: false
      }]
    }],
    clearIconTemplate: [{
      type: ContentChild,
      args: ["clearicon", {
        descendants: false
      }]
    }],
    hideIconTemplate: [{
      type: ContentChild,
      args: ["hideicon", {
        descendants: false
      }]
    }],
    showIconTemplate: [{
      type: ContentChild,
      args: ["showicon", {
        descendants: false
      }]
    }],
    templates: [{
      type: ContentChildren,
      args: [PrimeTemplate]
    }]
  });
})();
var PasswordModule = class _PasswordModule {
  static \u0275fac = function PasswordModule_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _PasswordModule)();
  };
  static \u0275mod = /* @__PURE__ */ \u0275\u0275defineNgModule({
    type: _PasswordModule,
    imports: [Password, PasswordDirective, SharedModule, BindModule],
    exports: [PasswordDirective, Password, SharedModule, BindModule]
  });
  static \u0275inj = /* @__PURE__ */ \u0275\u0275defineInjector({
    imports: [Password, SharedModule, BindModule, SharedModule, BindModule]
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(PasswordModule, [{
    type: NgModule,
    args: [{
      imports: [Password, PasswordDirective, SharedModule, BindModule],
      exports: [PasswordDirective, Password, SharedModule, BindModule]
    }]
  }], null, null);
})();

export {
  Password,
  PasswordModule
};
//# sourceMappingURL=chunk-XCAPMW7J.js.map
