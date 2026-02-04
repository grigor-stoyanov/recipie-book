import { Component, Input, EventEmitter, Output, ElementRef } from '@angular/core';
import { Recipe } from '../../interfaces';
import { CommonModule } from '@angular/common';
import { TruncatePipe } from '../../pipes/truncate-pipe';

@Component({
  selector: 'app-recipe-card',
  imports: [CommonModule,TruncatePipe],
  templateUrl: './recipe-card.html',
  styleUrl: './recipe-card.scss'
})
export class RecipeCard {
  @Input() recipe!:Recipe;
  @Input() index?:number;
  @Output()
  recipeSelected = new EventEmitter<Recipe>();
  @Input()
  liked = false;
  pulsing = false;

  @Output() likedChange = new EventEmitter<{liked: boolean, id: number}>();

  constructor(
    public host: ElementRef<HTMLElement>
  ) {}

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
  
  pulse() {
    this.pulsing = true;

    setTimeout(() => {
      this.pulsing = false;
    }, 600);
  }
}
