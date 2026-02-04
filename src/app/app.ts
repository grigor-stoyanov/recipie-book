import { ChangeDetectorRef, Component, computed, ElementRef, signal, ViewChild } from '@angular/core';
import { RecipeCard } from "./recipe-card/recipe-card";
import { RecipeService } from '../services/recipes';
import { Recipe } from '../interfaces';
import { CommonModule } from '@angular/common';
import { Utils } from '../services/utils';
import { debounceTime, distinctUntilChanged, Subject,switchMap, of } from 'rxjs';


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
  });
  @ViewChild('searchInput') searchInput!: ElementRef<HTMLInputElement>;
  private searchSubject = new Subject<string>();

  constructor(private recipeService: RecipeService,
    private utils: Utils
  ) { 
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(query => query
         ? this.recipeService.getRecipes(0, query)
         : of({ recipes: { data: [], totalPages: 0 } }))
    ).subscribe(data => {
      this.recipes.set(data.recipes.data);
      this.totalPages.set(data.recipes.totalPages);
      this.currentPage = 0;
    });
  }

  ngOnInit() {
    this.recipeService.getRecipes().subscribe(data => {
      this.recipes.set(data.recipes.data);
      this.totalPages.set(data.recipes.totalPages);
    });
  }

  loadRecipes(pageNo: number) {
    this.currentPage = pageNo;
    let query;
    if(this.searchInput.nativeElement.value) {
      query = this.searchInput.nativeElement.value;
    }
    this.recipeService.getRecipes(pageNo, query)
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
  onSearch(event: Event) {
    const input = event.target as HTMLInputElement;
    this.searchSubject.next(input.value);
  }
  clearSearch() {
    this.searchInput.nativeElement.value = '';
    this.loadRecipes(0);
  }
}
