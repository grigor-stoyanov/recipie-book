import { Component, Input, EventEmitter, Output, ElementRef, ContentChild } from '@angular/core';
import { Recipe } from '../../interfaces';
import { CommonModule } from '@angular/common';
import { TruncatePipe } from '../../pipes/truncate-pipe';

@Component({
  selector: 'app-recipe-card',
  imports: [CommonModule, TruncatePipe],
  templateUrl: './recipe-card.html',
  styleUrl: './recipe-card.scss'
})
export class RecipeCard {
  @Input() recipe!: Recipe;
  @Input() index?: number;
  @Output()
  recipeSelected = new EventEmitter<Recipe>();
  @Input()
  liked = false;
  @Input()
  isLoading!: boolean;

  @Output() likedChange = new EventEmitter<{ liked: boolean, id: number }>();
  @ContentChild('cardLoader') loadingPlaceholder!: ElementRef<HTMLElement>;
  
  private shimmerInterval!: ReturnType<typeof setInterval>;

  constructor(
    public host: ElementRef<HTMLElement>
  ) { }
  ngAfterContentInit() {
    let pos = 0;
    if (!this.isLoading) return;
    this.shimmerInterval = setInterval(() => {
      // pos wraps back to 0 after reaching 100, creating a continuous loop
    pos = (pos + 5) % 100;
    this.loadingPlaceholder.nativeElement.style.setProperty('--pos', pos + '%');
  }, 40);


  }
  
  ngOnDestroy() {
    if (this.shimmerInterval) {
      clearInterval(this.shimmerInterval);
    }
  }

  onViewRecipe() {
    this.recipeSelected.emit(this.recipe);
    console.log('View recipe clicked.');
  }

  recipeComplexity() {
    return {
      'easy': this.recipe.cooktime <= 30,
      'time-consuming': this.recipe.cooktime > 60
    };
  }
  scaleIngredients() {
    const count = this.recipe.ingredients.length;
    const maxFont = 1.0;
    const minFont = 0.35;
    const maxItemsBeforeShrink = 2;
    if (count <= maxItemsBeforeShrink) {
      return { fontSize: `${maxFont}rem`, lineHeight: '1.35' };
    }
    const shrinkFactor = Math.min((count - maxItemsBeforeShrink) * 0.15, 0.35);
    const font = maxFont - shrinkFactor;

    return {
      fontSize: `${Math.max(font, minFont)}rem`,
      lineHeight: font < 0.9 ? '1.15' : '1.25'
    };

  }
  toggleLike() {
    this.likedChange.emit(
      { liked: !this.liked, id: this.recipe.id }
    );
  }
}
