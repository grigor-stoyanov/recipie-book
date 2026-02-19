import { Component, Input, TemplateRef} from '@angular/core';
import { Ingredient, Recipe } from '../../interfaces';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-recipe-detail',
  imports: [CommonModule],
  templateUrl: './recipe-detail.html',
  styleUrl: './recipe-detail.scss',
})
export class RecipeDetail {
  @Input() recipe: Recipe | null = null;
  @Input () ingredientItems: TemplateRef<{$implicit: Ingredient, showDetails?: boolean}> | null = null;
}
