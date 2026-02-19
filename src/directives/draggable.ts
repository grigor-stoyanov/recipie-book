import { Directive, ElementRef, HostListener, Renderer2, Output, EventEmitter, HostBinding, Host, Optional } from '@angular/core';
import { RecipeCard } from '../components/recipe-card/recipe-card';

@Directive({
  selector: '[appDraggable]',
  // access to directive reference
  exportAs: 'appDraggable'
})
export class Draggable {
  @Output() droppedRecipe = new EventEmitter<{ dragged: RecipeCard, target: HTMLElement | null }>();

  public isDragging = false;
  private isDown = false;
  private currentDrag: Host|null = null;
  private startX = 0;
  private startY = 0;
  private currentX = 0;
  private currentY = 0;
  private lastHovered: HTMLElement | null = null;

  @HostBinding('style.transform')
  get transform() {
    return `translate(${this.currentX}px, ${this.currentY}px)`;
  }

  @HostBinding('style.transition')
  transition = 'transform 0.2s ease-out';

  @HostBinding('style.position')
  position = 'relative';

  // renderer safer way to apply changes to abstract DOM
  constructor(
    private el: ElementRef,
     private renderer: Renderer2,
    @Host() @Optional() public recipeCard: RecipeCard) {
  }

  get host(): HTMLElement {
    return this.el.nativeElement;
  }

  @HostListener('mousedown', ['$event'])
  onMouseDown(event: MouseEvent) {
    this.isDown = true;
    this.isDragging = false;
    this.transition = 'none';

    this.startX = event.clientX - this.currentX;
    this.startY = event.clientY - this.currentY;
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    if (!this.isDown) return;
    const dx = event.clientX - this.startX;
    const dy = event.clientY - this.startY;

    if (Math.abs(dx) > 5 || Math.abs(dy) > 5) {
      this.isDragging = true;
      this.currentDrag = this.recipeCard;
    } else {
      this.isDragging = false;
      return;
    }

    this.currentX = dx;
    this.currentY = dy;
    
    // temporary workaround to detect hover over element
    this.renderer.setStyle(this.el.nativeElement, 'pointer-events', 'none');
    this.lastHovered = document.elementFromPoint(event.clientX, event.clientY) as HTMLElement;

  }

  @HostListener('document:mouseup')
  onMouseUp() {
    this.isDragging = false;
    this.isDown = false;
    this.transition = 'transform 0.2s ease-out';
    this.currentX = 0;
    this.currentY = 0;
    if(this.recipeCard && this.currentDrag == this.recipeCard){
      this.droppedRecipe.emit({ dragged: this.recipeCard, target: this.lastHovered });
    }
    this.renderer.setStyle(this.el.nativeElement, 'pointer-events', 'unset');
    this.currentDrag =  false;
  }
}