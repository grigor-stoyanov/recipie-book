import { ChangeDetectorRef, Component, computed, signal } from '@angular/core';
import { RecipeCard } from "./recipe-card/recipe-card";
import { RecipeService } from '../services/recipes';
import { Recipe } from '../interfaces';
import { CommonModule } from '@angular/common';
import { Utils } from '../services/utils';


// Standalone component default by Angular CLI
@Component({
  selector: 'app-root',
  // each import is local and scoped to this component
  imports: [RecipeCard, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  recipes = signal<Recipe[]>([]);
  totalPages = signal(0);
  currentPage = 0;
  pages = computed(() => {
   return Array.from(this.utils.range(this.totalPages(),1));
  })

  constructor(private recipeService: RecipeService,
    private utils: Utils
  ) { }

  ngOnInit() {
    this.recipeService.getRecipes().subscribe(data => {
      this.recipes.set(data.recipes.data);
      this.totalPages.set(data.recipes.totalPages);
    });
  }

  loadRecipes(pageNo: number) {
    this.currentPage = pageNo;
    this.recipeService.getRecipes(pageNo)
      .subscribe(data => {
        this.recipes.set(data.recipes.data);
        this.totalPages.set(data.recipes.totalPages);
      })
  };

  
  onRecipeSelected(recipe: Recipe) {
    console.log('Selected recipe:', recipe);
  }
  // custom tracking function to identify unique items
  trackRecipe(index: number, recipe: Recipe) {
    return recipe.id;
  }
}
