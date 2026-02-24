import { Component, Input, Self, SkipSelf, TemplateRef} from '@angular/core';
import { Ingredient, Recipe } from '../../interfaces';
import { CommonModule } from '@angular/common';
import { RecipeService } from '../../services/recipes';

@Component({
  selector: 'app-recipe-detail',
  imports: [CommonModule],
  templateUrl: './recipe-detail.html',
  styleUrl: './recipe-detail.scss',
})
export class RecipeDetail {
  @Input() recipe: Recipe | null = null;
  @Input () ingredientItems: TemplateRef<{$implicit: Ingredient, showDetails?: boolean}> | null = null;

  // Get the instance of service from parent component (if exists) or root if not found in parent
  constructor(@SkipSelf() private recipeService: RecipeService) {
  }


  ngOnInit() {
    this.recipeService.getRecipes().subscribe(res => {
      console.log('Recipes:', res);
    });
  }
}
