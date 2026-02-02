import { ChangeDetectorRef, Component, signal } from '@angular/core';
import { RecipeCard } from "./recipe-card/recipe-card";
import { RecipeService } from '../services/recipes';
import { Recipe } from '../interfaces';
import { on } from 'events';

@Component({
  selector: 'app-root',
  imports: [ RecipeCard],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  recipes = signal<Recipe[]>([]);
  constructor(private recipeService: RecipeService
  ) {}
  ngOnInit() {
    this.recipeService.getRecipes().subscribe(data => {
      this.recipes.set(data.recipes.data);
    });
  }

    onRecipeSelected(recipe: Recipe) {
      console.log('Selected recipe:', recipe);
    }
  
}
