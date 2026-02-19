import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';

// structural directives are just attribute directive with template instances
@Directive({
  selector: '[ngxUnless]'
})
export class NgxUnless {
  visible = false;
  @Input()
  set ngxUnless(condition:boolean){
    if (!condition && !this.visible){
      this.viewContainer.createEmbeddedView(this.templateRef);
      this.visible = true
    } else if(condition && this.visible) {
      this.viewContainer.clear();
      this.visible = false;
    }
  }
  constructor(private templateRef: TemplateRef<any>, private viewContainer: ViewContainerRef) {


   }

}
