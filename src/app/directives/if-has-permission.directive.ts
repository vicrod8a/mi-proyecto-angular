import { Directive, Input, TemplateRef, ViewContainerRef, effect } from '@angular/core';
import { PermissionService } from '../services/permission.service';

@Directive({
  selector: '[ifHasPermission]',
  standalone: true
})
export class IfHasPermissionDirective {
  private required: string[] = [];
  private hasView = false;

  constructor(
    private templateRef: TemplateRef<any>,
    private vcr: ViewContainerRef,
    private permService: PermissionService
  ) {
    // reactively watch for permission changes
    effect(() => {
      const allowed = this.permService.hasAnyPermission(this.required);
      if (allowed && !this.hasView) {
        this.vcr.createEmbeddedView(this.templateRef);
        this.hasView = true;
      } else if (!allowed && this.hasView) {
        this.vcr.clear();
        this.hasView = false;
      }
    });
  }

  @Input()
  set ifHasPermission(value: string | string[]) {
    if (Array.isArray(value)) {
      this.required = value;
    } else if (value) {
      this.required = [value];
    } else {
      this.required = [];
    }
  }
}
