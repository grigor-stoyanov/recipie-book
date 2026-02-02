import { Component, Input, EventEmitter, Output } from '@angular/core';
import { Recipe } from '../../interfaces';

@Component({
  selector: 'app-recipe-card',
  imports: [],
  templateUrl: './recipe-card.html',
  styleUrl: './recipe-card.scss'
})
export class RecipeCard {
  @Input() recipe!:Recipe;
  @Input() index?:number;
  
  @Output()
  recipeSelected = new EventEmitter<Recipe>();

  constructor() {}

  onViewRecipe() {
    this.recipeSelected.emit(this.recipe);
    console.log('View recipe clicked.');
  }
}
