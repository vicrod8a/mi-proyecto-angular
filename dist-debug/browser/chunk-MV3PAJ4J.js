import {
  BaseEditableHolder
} from "./chunk-S26L266D.js";
import {
  CheckIcon,
  NG_VALUE_ACCESSOR,
  NgControl
} from "./chunk-7DWSOU2V.js";
import {
  BaseIcon,
  Bind,
  BindModule,
  PARENT_INSTANCE
} from "./chunk-HWDZGNHS.js";
import {
  BaseStyle,
  PrimeTemplate,
  SharedModule,
  k,
  q
} from "./chunk-JNXR6VHA.js";
import {
  ChangeDetectionStrategy,
  CommonModule,
  Component,
  ContentChild,
  ContentChildren,
  EventEmitter,
  Injectable,
  InjectionToken,
  Input,
  NgClass,
  NgIf,
  NgModule,
  NgTemplateOutlet,
  Output,
  ViewChild,
  ViewEncapsulation,
  booleanAttribute,
  computed,
  forwardRef,
  inject,
  input,
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
  ɵɵdefineInjectable,
  ɵɵdefineInjector,
  ɵɵdefineNgModule,
  ɵɵdomElement,
  ɵɵelement,
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
  ɵɵpureFunction2,
  ɵɵqueryRefresh,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵstyleMap,
  ɵɵtemplate,
  ɵɵviewQuery
} from "./chunk-ANLN36LO.js";

// node_modules/primeng/fesm2022/primeng-icons-minus.mjs
var _c0 = ["data-p-icon", "minus"];
var MinusIcon = class _MinusIcon extends BaseIcon {
  static \u0275fac = /* @__PURE__ */ (() => {
    let \u0275MinusIcon_BaseFactory;
    return function MinusIcon_Factory(__ngFactoryType__) {
      return (\u0275MinusIcon_BaseFactory || (\u0275MinusIcon_BaseFactory = \u0275\u0275getInheritedFactory(_MinusIcon)))(__ngFactoryType__ || _MinusIcon);
    };
  })();
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({
    type: _MinusIcon,
    selectors: [["", "data-p-icon", "minus"]],
    features: [\u0275\u0275InheritDefinitionFeature],
    attrs: _c0,
    decls: 1,
    vars: 0,
    consts: [["d", "M13.2222 7.77778H0.777778C0.571498 7.77778 0.373667 7.69584 0.227806 7.54998C0.0819442 7.40412 0 7.20629 0 7.00001C0 6.79373 0.0819442 6.5959 0.227806 6.45003C0.373667 6.30417 0.571498 6.22223 0.777778 6.22223H13.2222C13.4285 6.22223 13.6263 6.30417 13.7722 6.45003C13.9181 6.5959 14 6.79373 14 7.00001C14 7.20629 13.9181 7.40412 13.7722 7.54998C13.6263 7.69584 13.4285 7.77778 13.2222 7.77778Z", "fill", "currentColor"]],
    template: function MinusIcon_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275namespaceSVG();
        \u0275\u0275domElement(0, "path", 0);
      }
    },
    encapsulation: 2
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MinusIcon, [{
    type: Component,
    args: [{
      selector: '[data-p-icon="minus"]',
      standalone: true,
      template: `
        <svg:path
            d="M13.2222 7.77778H0.777778C0.571498 7.77778 0.373667 7.69584 0.227806 7.54998C0.0819442 7.40412 0 7.20629 0 7.00001C0 6.79373 0.0819442 6.5959 0.227806 6.45003C0.373667 6.30417 0.571498 6.22223 0.777778 6.22223H13.2222C13.4285 6.22223 13.6263 6.30417 13.7722 6.45003C13.9181 6.5959 14 6.79373 14 7.00001C14 7.20629 13.9181 7.40412 13.7722 7.54998C13.6263 7.69584 13.4285 7.77778 13.2222 7.77778Z"
            fill="currentColor"
        />
    `
    }]
  }], null, null);
})();

// node_modules/@primeuix/styles/dist/checkbox/index.mjs
var style = "\n    .p-checkbox {\n        position: relative;\n        display: inline-flex;\n        user-select: none;\n        vertical-align: bottom;\n        width: dt('checkbox.width');\n        height: dt('checkbox.height');\n    }\n\n    .p-checkbox-input {\n        cursor: pointer;\n        appearance: none;\n        position: absolute;\n        inset-block-start: 0;\n        inset-inline-start: 0;\n        width: 100%;\n        height: 100%;\n        padding: 0;\n        margin: 0;\n        opacity: 0;\n        z-index: 1;\n        outline: 0 none;\n        border: 1px solid transparent;\n        border-radius: dt('checkbox.border.radius');\n    }\n\n    .p-checkbox-box {\n        display: flex;\n        justify-content: center;\n        align-items: center;\n        border-radius: dt('checkbox.border.radius');\n        border: 1px solid dt('checkbox.border.color');\n        background: dt('checkbox.background');\n        width: dt('checkbox.width');\n        height: dt('checkbox.height');\n        transition:\n            background dt('checkbox.transition.duration'),\n            color dt('checkbox.transition.duration'),\n            border-color dt('checkbox.transition.duration'),\n            box-shadow dt('checkbox.transition.duration'),\n            outline-color dt('checkbox.transition.duration');\n        outline-color: transparent;\n        box-shadow: dt('checkbox.shadow');\n    }\n\n    .p-checkbox-icon {\n        transition-duration: dt('checkbox.transition.duration');\n        color: dt('checkbox.icon.color');\n        font-size: dt('checkbox.icon.size');\n        width: dt('checkbox.icon.size');\n        height: dt('checkbox.icon.size');\n    }\n\n    .p-checkbox:not(.p-disabled):has(.p-checkbox-input:hover) .p-checkbox-box {\n        border-color: dt('checkbox.hover.border.color');\n    }\n\n    .p-checkbox-checked .p-checkbox-box {\n        border-color: dt('checkbox.checked.border.color');\n        background: dt('checkbox.checked.background');\n    }\n\n    .p-checkbox-checked .p-checkbox-icon {\n        color: dt('checkbox.icon.checked.color');\n    }\n\n    .p-checkbox-checked:not(.p-disabled):has(.p-checkbox-input:hover) .p-checkbox-box {\n        background: dt('checkbox.checked.hover.background');\n        border-color: dt('checkbox.checked.hover.border.color');\n    }\n\n    .p-checkbox-checked:not(.p-disabled):has(.p-checkbox-input:hover) .p-checkbox-icon {\n        color: dt('checkbox.icon.checked.hover.color');\n    }\n\n    .p-checkbox:not(.p-disabled):has(.p-checkbox-input:focus-visible) .p-checkbox-box {\n        border-color: dt('checkbox.focus.border.color');\n        box-shadow: dt('checkbox.focus.ring.shadow');\n        outline: dt('checkbox.focus.ring.width') dt('checkbox.focus.ring.style') dt('checkbox.focus.ring.color');\n        outline-offset: dt('checkbox.focus.ring.offset');\n    }\n\n    .p-checkbox-checked:not(.p-disabled):has(.p-checkbox-input:focus-visible) .p-checkbox-box {\n        border-color: dt('checkbox.checked.focus.border.color');\n    }\n\n    .p-checkbox.p-invalid > .p-checkbox-box {\n        border-color: dt('checkbox.invalid.border.color');\n    }\n\n    .p-checkbox.p-variant-filled .p-checkbox-box {\n        background: dt('checkbox.filled.background');\n    }\n\n    .p-checkbox-checked.p-variant-filled .p-checkbox-box {\n        background: dt('checkbox.checked.background');\n    }\n\n    .p-checkbox-checked.p-variant-filled:not(.p-disabled):has(.p-checkbox-input:hover) .p-checkbox-box {\n        background: dt('checkbox.checked.hover.background');\n    }\n\n    .p-checkbox.p-disabled {\n        opacity: 1;\n    }\n\n    .p-checkbox.p-disabled .p-checkbox-box {\n        background: dt('checkbox.disabled.background');\n        border-color: dt('checkbox.checked.disabled.border.color');\n    }\n\n    .p-checkbox.p-disabled .p-checkbox-box .p-checkbox-icon {\n        color: dt('checkbox.icon.disabled.color');\n    }\n\n    .p-checkbox-sm,\n    .p-checkbox-sm .p-checkbox-box {\n        width: dt('checkbox.sm.width');\n        height: dt('checkbox.sm.height');\n    }\n\n    .p-checkbox-sm .p-checkbox-icon {\n        font-size: dt('checkbox.icon.sm.size');\n        width: dt('checkbox.icon.sm.size');\n        height: dt('checkbox.icon.sm.size');\n    }\n\n    .p-checkbox-lg,\n    .p-checkbox-lg .p-checkbox-box {\n        width: dt('checkbox.lg.width');\n        height: dt('checkbox.lg.height');\n    }\n\n    .p-checkbox-lg .p-checkbox-icon {\n        font-size: dt('checkbox.icon.lg.size');\n        width: dt('checkbox.icon.lg.size');\n        height: dt('checkbox.icon.lg.size');\n    }\n";

// node_modules/primeng/fesm2022/primeng-checkbox.mjs
var _c02 = ["icon"];
var _c1 = ["input"];
var _c2 = (a0, a1) => ({
  checked: a0,
  class: a1
});
function Checkbox_ng_container_3_ng_container_1_span_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "span", 8);
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275classMap(ctx_r1.cx("icon"));
    \u0275\u0275property("ngClass", ctx_r1.checkboxIcon)("pBind", ctx_r1.ptm("icon"));
  }
}
function Checkbox_ng_container_3_ng_container_1__svg_svg_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275namespaceSVG();
    \u0275\u0275element(0, "svg", 9);
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275classMap(ctx_r1.cx("icon"));
    \u0275\u0275property("pBind", ctx_r1.ptm("icon"));
  }
}
function Checkbox_ng_container_3_ng_container_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementContainerStart(0);
    \u0275\u0275template(1, Checkbox_ng_container_3_ng_container_1_span_1_Template, 1, 4, "span", 6)(2, Checkbox_ng_container_3_ng_container_1__svg_svg_2_Template, 1, 3, "svg", 7);
    \u0275\u0275elementContainerEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r1.checkboxIcon);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", !ctx_r1.checkboxIcon);
  }
}
function Checkbox_ng_container_3__svg_svg_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275namespaceSVG();
    \u0275\u0275element(0, "svg", 10);
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275classMap(ctx_r1.cx("icon"));
    \u0275\u0275property("pBind", ctx_r1.ptm("icon"));
  }
}
function Checkbox_ng_container_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementContainerStart(0);
    \u0275\u0275template(1, Checkbox_ng_container_3_ng_container_1_Template, 3, 2, "ng-container", 3)(2, Checkbox_ng_container_3__svg_svg_2_Template, 1, 3, "svg", 5);
    \u0275\u0275elementContainerEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r1.checked);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r1._indeterminate());
  }
}
function Checkbox_4_ng_template_0_Template(rf, ctx) {
}
function Checkbox_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275template(0, Checkbox_4_ng_template_0_Template, 0, 0, "ng-template");
  }
}
var style2 = (
  /*css*/
  `
    ${style}

    /* For PrimeNG */
    p-checkBox.ng-invalid.ng-dirty .p-checkbox-box,
    p-check-box.ng-invalid.ng-dirty .p-checkbox-box,
    p-checkbox.ng-invalid.ng-dirty .p-checkbox-box {
        border-color: dt('checkbox.invalid.border.color');
    }
`
);
var classes = {
  root: ({
    instance
  }) => ["p-checkbox p-component", {
    "p-checkbox-checked p-highlight": instance.checked,
    "p-disabled": instance.$disabled(),
    "p-invalid": instance.invalid(),
    "p-variant-filled": instance.$variant() === "filled",
    "p-checkbox-sm p-inputfield-sm": instance.size() === "small",
    "p-checkbox-lg p-inputfield-lg": instance.size() === "large"
  }],
  box: "p-checkbox-box",
  input: "p-checkbox-input",
  icon: "p-checkbox-icon"
};
var CheckboxStyle = class _CheckboxStyle extends BaseStyle {
  name = "checkbox";
  style = style2;
  classes = classes;
  static \u0275fac = /* @__PURE__ */ (() => {
    let \u0275CheckboxStyle_BaseFactory;
    return function CheckboxStyle_Factory(__ngFactoryType__) {
      return (\u0275CheckboxStyle_BaseFactory || (\u0275CheckboxStyle_BaseFactory = \u0275\u0275getInheritedFactory(_CheckboxStyle)))(__ngFactoryType__ || _CheckboxStyle);
    };
  })();
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({
    token: _CheckboxStyle,
    factory: _CheckboxStyle.\u0275fac
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(CheckboxStyle, [{
    type: Injectable
  }], null, null);
})();
var CheckboxClasses;
(function(CheckboxClasses2) {
  CheckboxClasses2["root"] = "p-checkbox";
  CheckboxClasses2["box"] = "p-checkbox-box";
  CheckboxClasses2["input"] = "p-checkbox-input";
  CheckboxClasses2["icon"] = "p-checkbox-icon";
})(CheckboxClasses || (CheckboxClasses = {}));
var CHECKBOX_INSTANCE = new InjectionToken("CHECKBOX_INSTANCE");
var CHECKBOX_VALUE_ACCESSOR = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => Checkbox),
  multi: true
};
var Checkbox = class _Checkbox extends BaseEditableHolder {
  hostName = "";
  /**
   * Value of the checkbox.
   * @group Props
   */
  value;
  /**
   * Allows to select a boolean value instead of multiple values.
   * @group Props
   */
  binary;
  /**
   * Establishes relationships between the component and label(s) where its value should be one or more element IDs.
   * @group Props
   */
  ariaLabelledBy;
  /**
   * Used to define a string that labels the input element.
   * @group Props
   */
  ariaLabel;
  /**
   * Index of the element in tabbing order.
   * @group Props
   */
  tabindex;
  /**
   * Identifier of the focus input to match a label defined for the component.
   * @group Props
   */
  inputId;
  /**
   * Inline style of the input element.
   * @group Props
   */
  inputStyle;
  /**
   * Style class of the component.
   * @deprecated since v20.0.0, use `class` instead.
   * @group Props
   */
  styleClass;
  /**
   * Style class of the input element.
   * @group Props
   */
  inputClass;
  /**
   * When present, it specifies input state as indeterminate.
   * @group Props
   */
  indeterminate = false;
  /**
   * Form control value.
   * @group Props
   */
  formControl;
  /**
   * Icon class of the checkbox icon.
   * @group Props
   */
  checkboxIcon;
  /**
   * When present, it specifies that the component cannot be edited.
   * @group Props
   */
  readonly;
  /**
   * When present, it specifies that the component should automatically get focus on load.
   * @group Props
   */
  autofocus;
  /**
   * Value in checked state.
   * @group Props
   */
  trueValue = true;
  /**
   * Value in unchecked state.
   * @group Props
   */
  falseValue = false;
  /**
   * Specifies the input variant of the component.
   * @defaultValue undefined
   * @group Props
   */
  variant = input(...ngDevMode ? [void 0, {
    debugName: "variant"
  }] : []);
  /**
   * Specifies the size of the component.
   * @defaultValue undefined
   * @group Props
   */
  size = input(...ngDevMode ? [void 0, {
    debugName: "size"
  }] : []);
  /**
   * Callback to invoke on value change.
   * @param {CheckboxChangeEvent} event - Custom value change event.
   * @group Emits
   */
  onChange = new EventEmitter();
  /**
   * Callback to invoke when the receives focus.
   * @param {Event} event - Browser event.
   * @group Emits
   */
  onFocus = new EventEmitter();
  /**
   * Callback to invoke when the loses focus.
   * @param {Event} event - Browser event.
   * @group Emits
   */
  onBlur = new EventEmitter();
  inputViewChild;
  get checked() {
    return this._indeterminate() ? false : this.binary ? this.modelValue() === this.trueValue : q(this.value, this.modelValue());
  }
  _indeterminate = signal(void 0, ...ngDevMode ? [{
    debugName: "_indeterminate"
  }] : []);
  /**
   * The template of the checkbox icon.
   * @group Templates
   */
  checkboxIconTemplate;
  templates;
  _checkboxIconTemplate;
  focused = false;
  _componentStyle = inject(CheckboxStyle);
  bindDirectiveInstance = inject(Bind, {
    self: true
  });
  $pcCheckbox = inject(CHECKBOX_INSTANCE, {
    optional: true,
    skipSelf: true
  }) ?? void 0;
  $variant = computed(() => this.variant() || this.config.inputStyle() || this.config.inputVariant(), ...ngDevMode ? [{
    debugName: "$variant"
  }] : []);
  onAfterContentInit() {
    this.templates?.forEach((item) => {
      switch (item.getType()) {
        case "icon":
          this._checkboxIconTemplate = item.template;
          break;
        case "checkboxicon":
          this._checkboxIconTemplate = item.template;
          break;
      }
    });
  }
  onChanges(changes) {
    if (changes.indeterminate) {
      this._indeterminate.set(changes.indeterminate.currentValue);
    }
  }
  onAfterViewChecked() {
    this.bindDirectiveInstance.setAttrs(this.ptms(["host", "root"]));
  }
  updateModel(event) {
    let newModelValue;
    const selfControl = this.injector.get(NgControl, null, {
      optional: true,
      self: true
    });
    const currentModelValue = selfControl && !this.formControl ? selfControl.value : this.modelValue();
    if (!this.binary) {
      if (this.checked || this._indeterminate()) newModelValue = currentModelValue.filter((val) => !k(val, this.value));
      else newModelValue = currentModelValue ? [...currentModelValue, this.value] : [this.value];
      this.onModelChange(newModelValue);
      this.writeModelValue(newModelValue);
      if (this.formControl) {
        this.formControl.setValue(newModelValue);
      }
    } else {
      newModelValue = this._indeterminate() ? this.trueValue : this.checked ? this.falseValue : this.trueValue;
      this.writeModelValue(newModelValue);
      this.onModelChange(newModelValue);
    }
    if (this._indeterminate()) {
      this._indeterminate.set(false);
    }
    this.onChange.emit({
      checked: newModelValue,
      originalEvent: event
    });
  }
  handleChange(event) {
    if (!this.readonly) {
      this.updateModel(event);
    }
  }
  onInputFocus(event) {
    this.focused = true;
    this.onFocus.emit(event);
  }
  onInputBlur(event) {
    this.focused = false;
    this.onBlur.emit(event);
    this.onModelTouched();
  }
  focus() {
    this.inputViewChild?.nativeElement.focus();
  }
  /**
   * @override
   *
   * @see {@link BaseEditableHolder.writeControlValue}
   * Writes the value to the control.
   */
  writeControlValue(value, setModelValue) {
    setModelValue(value);
    this.cd.markForCheck();
  }
  static \u0275fac = /* @__PURE__ */ (() => {
    let \u0275Checkbox_BaseFactory;
    return function Checkbox_Factory(__ngFactoryType__) {
      return (\u0275Checkbox_BaseFactory || (\u0275Checkbox_BaseFactory = \u0275\u0275getInheritedFactory(_Checkbox)))(__ngFactoryType__ || _Checkbox);
    };
  })();
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({
    type: _Checkbox,
    selectors: [["p-checkbox"], ["p-checkBox"], ["p-check-box"]],
    contentQueries: function Checkbox_ContentQueries(rf, ctx, dirIndex) {
      if (rf & 1) {
        \u0275\u0275contentQuery(dirIndex, _c02, 4);
        \u0275\u0275contentQuery(dirIndex, PrimeTemplate, 4);
      }
      if (rf & 2) {
        let _t;
        \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx.checkboxIconTemplate = _t.first);
        \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx.templates = _t);
      }
    },
    viewQuery: function Checkbox_Query(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275viewQuery(_c1, 5);
      }
      if (rf & 2) {
        let _t;
        \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx.inputViewChild = _t.first);
      }
    },
    hostVars: 5,
    hostBindings: function Checkbox_HostBindings(rf, ctx) {
      if (rf & 2) {
        \u0275\u0275attribute("data-p-highlight", ctx.checked)("data-p-checked", ctx.checked)("data-p-disabled", ctx.$disabled());
        \u0275\u0275classMap(ctx.cn(ctx.cx("root"), ctx.styleClass));
      }
    },
    inputs: {
      hostName: "hostName",
      value: "value",
      binary: [2, "binary", "binary", booleanAttribute],
      ariaLabelledBy: "ariaLabelledBy",
      ariaLabel: "ariaLabel",
      tabindex: [2, "tabindex", "tabindex", numberAttribute],
      inputId: "inputId",
      inputStyle: "inputStyle",
      styleClass: "styleClass",
      inputClass: "inputClass",
      indeterminate: [2, "indeterminate", "indeterminate", booleanAttribute],
      formControl: "formControl",
      checkboxIcon: "checkboxIcon",
      readonly: [2, "readonly", "readonly", booleanAttribute],
      autofocus: [2, "autofocus", "autofocus", booleanAttribute],
      trueValue: "trueValue",
      falseValue: "falseValue",
      variant: [1, "variant"],
      size: [1, "size"]
    },
    outputs: {
      onChange: "onChange",
      onFocus: "onFocus",
      onBlur: "onBlur"
    },
    features: [\u0275\u0275ProvidersFeature([CHECKBOX_VALUE_ACCESSOR, CheckboxStyle, {
      provide: CHECKBOX_INSTANCE,
      useExisting: _Checkbox
    }, {
      provide: PARENT_INSTANCE,
      useExisting: _Checkbox
    }]), \u0275\u0275HostDirectivesFeature([Bind]), \u0275\u0275InheritDefinitionFeature],
    decls: 5,
    vars: 24,
    consts: [["input", ""], ["type", "checkbox", 3, "focus", "blur", "change", "checked", "pBind"], [3, "pBind"], [4, "ngIf"], [4, "ngTemplateOutlet", "ngTemplateOutletContext"], ["data-p-icon", "minus", 3, "class", "pBind", 4, "ngIf"], [3, "class", "ngClass", "pBind", 4, "ngIf"], ["data-p-icon", "check", 3, "class", "pBind", 4, "ngIf"], [3, "ngClass", "pBind"], ["data-p-icon", "check", 3, "pBind"], ["data-p-icon", "minus", 3, "pBind"]],
    template: function Checkbox_Template(rf, ctx) {
      if (rf & 1) {
        const _r1 = \u0275\u0275getCurrentView();
        \u0275\u0275elementStart(0, "input", 1, 0);
        \u0275\u0275listener("focus", function Checkbox_Template_input_focus_0_listener($event) {
          \u0275\u0275restoreView(_r1);
          return \u0275\u0275resetView(ctx.onInputFocus($event));
        })("blur", function Checkbox_Template_input_blur_0_listener($event) {
          \u0275\u0275restoreView(_r1);
          return \u0275\u0275resetView(ctx.onInputBlur($event));
        })("change", function Checkbox_Template_input_change_0_listener($event) {
          \u0275\u0275restoreView(_r1);
          return \u0275\u0275resetView(ctx.handleChange($event));
        });
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(2, "div", 2);
        \u0275\u0275template(3, Checkbox_ng_container_3_Template, 3, 2, "ng-container", 3)(4, Checkbox_4_Template, 1, 0, null, 4);
        \u0275\u0275elementEnd();
      }
      if (rf & 2) {
        \u0275\u0275styleMap(ctx.inputStyle);
        \u0275\u0275classMap(ctx.cn(ctx.cx("input"), ctx.inputClass));
        \u0275\u0275property("checked", ctx.checked)("pBind", ctx.ptm("input"));
        \u0275\u0275attribute("id", ctx.inputId)("value", ctx.value)("name", ctx.name())("tabindex", ctx.tabindex)("required", ctx.required() ? "" : void 0)("readonly", ctx.readonly ? "" : void 0)("disabled", ctx.$disabled() ? "" : void 0)("aria-labelledby", ctx.ariaLabelledBy)("aria-label", ctx.ariaLabel);
        \u0275\u0275advance(2);
        \u0275\u0275classMap(ctx.cx("box"));
        \u0275\u0275property("pBind", ctx.ptm("box"));
        \u0275\u0275advance();
        \u0275\u0275property("ngIf", !ctx.checkboxIconTemplate && !ctx._checkboxIconTemplate);
        \u0275\u0275advance();
        \u0275\u0275property("ngTemplateOutlet", ctx.checkboxIconTemplate || ctx._checkboxIconTemplate)("ngTemplateOutletContext", \u0275\u0275pureFunction2(21, _c2, ctx.checked, ctx.cx("icon")));
      }
    },
    dependencies: [CommonModule, NgClass, NgIf, NgTemplateOutlet, SharedModule, CheckIcon, MinusIcon, BindModule, Bind],
    encapsulation: 2,
    changeDetection: 0
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(Checkbox, [{
    type: Component,
    args: [{
      selector: "p-checkbox, p-checkBox, p-check-box",
      standalone: true,
      imports: [CommonModule, SharedModule, CheckIcon, MinusIcon, BindModule],
      template: `
        <input
            #input
            [attr.id]="inputId"
            type="checkbox"
            [attr.value]="value"
            [attr.name]="name()"
            [checked]="checked"
            [attr.tabindex]="tabindex"
            [attr.required]="required() ? '' : undefined"
            [attr.readonly]="readonly ? '' : undefined"
            [attr.disabled]="$disabled() ? '' : undefined"
            [attr.aria-labelledby]="ariaLabelledBy"
            [attr.aria-label]="ariaLabel"
            [style]="inputStyle"
            [class]="cn(cx('input'), inputClass)"
            [pBind]="ptm('input')"
            (focus)="onInputFocus($event)"
            (blur)="onInputBlur($event)"
            (change)="handleChange($event)"
        />
        <div [class]="cx('box')" [pBind]="ptm('box')">
            <ng-container *ngIf="!checkboxIconTemplate && !_checkboxIconTemplate">
                <ng-container *ngIf="checked">
                    <span *ngIf="checkboxIcon" [class]="cx('icon')" [ngClass]="checkboxIcon" [pBind]="ptm('icon')"></span>
                    <svg data-p-icon="check" *ngIf="!checkboxIcon" [class]="cx('icon')" [pBind]="ptm('icon')" />
                </ng-container>
                <svg data-p-icon="minus" *ngIf="_indeterminate()" [class]="cx('icon')" [pBind]="ptm('icon')" />
            </ng-container>
            <ng-template *ngTemplateOutlet="checkboxIconTemplate || _checkboxIconTemplate; context: { checked: checked, class: cx('icon') }"></ng-template>
        </div>
    `,
      providers: [CHECKBOX_VALUE_ACCESSOR, CheckboxStyle, {
        provide: CHECKBOX_INSTANCE,
        useExisting: Checkbox
      }, {
        provide: PARENT_INSTANCE,
        useExisting: Checkbox
      }],
      changeDetection: ChangeDetectionStrategy.OnPush,
      encapsulation: ViewEncapsulation.None,
      host: {
        "[class]": "cn(cx('root'), styleClass)",
        "[attr.data-p-highlight]": "checked",
        "[attr.data-p-checked]": "checked",
        "[attr.data-p-disabled]": "$disabled()"
      },
      hostDirectives: [Bind]
    }]
  }], null, {
    hostName: [{
      type: Input
    }],
    value: [{
      type: Input
    }],
    binary: [{
      type: Input,
      args: [{
        transform: booleanAttribute
      }]
    }],
    ariaLabelledBy: [{
      type: Input
    }],
    ariaLabel: [{
      type: Input
    }],
    tabindex: [{
      type: Input,
      args: [{
        transform: numberAttribute
      }]
    }],
    inputId: [{
      type: Input
    }],
    inputStyle: [{
      type: Input
    }],
    styleClass: [{
      type: Input
    }],
    inputClass: [{
      type: Input
    }],
    indeterminate: [{
      type: Input,
      args: [{
        transform: booleanAttribute
      }]
    }],
    formControl: [{
      type: Input
    }],
    checkboxIcon: [{
      type: Input
    }],
    readonly: [{
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
    trueValue: [{
      type: Input
    }],
    falseValue: [{
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
    size: [{
      type: Input,
      args: [{
        isSignal: true,
        alias: "size",
        required: false
      }]
    }],
    onChange: [{
      type: Output
    }],
    onFocus: [{
      type: Output
    }],
    onBlur: [{
      type: Output
    }],
    inputViewChild: [{
      type: ViewChild,
      args: ["input"]
    }],
    checkboxIconTemplate: [{
      type: ContentChild,
      args: ["icon", {
        descendants: false
      }]
    }],
    templates: [{
      type: ContentChildren,
      args: [PrimeTemplate]
    }]
  });
})();
var CheckboxModule = class _CheckboxModule {
  static \u0275fac = function CheckboxModule_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _CheckboxModule)();
  };
  static \u0275mod = /* @__PURE__ */ \u0275\u0275defineNgModule({
    type: _CheckboxModule,
    imports: [Checkbox, SharedModule],
    exports: [Checkbox, SharedModule]
  });
  static \u0275inj = /* @__PURE__ */ \u0275\u0275defineInjector({
    imports: [Checkbox, SharedModule, SharedModule]
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(CheckboxModule, [{
    type: NgModule,
    args: [{
      imports: [Checkbox, SharedModule],
      exports: [Checkbox, SharedModule]
    }]
  }], null, null);
})();

export {
  Checkbox,
  CheckboxModule
};
//# sourceMappingURL=chunk-MV3PAJ4J.js.map
