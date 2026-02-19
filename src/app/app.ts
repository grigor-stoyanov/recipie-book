import {
  ChangeDetectorRef,
  Component,
  computed,
  ElementRef,
  signal,
  ViewChild,
  ViewChildren,
  QueryList,
  Host,
  InjectionToken,
  Inject,
} from '@angular/core';
import { RecipeCard } from '../components/recipe-card/recipe-card';
import { RecipeService } from '../services/recipes';
import { Recipe } from '../interfaces';
import { CommonModule } from '@angular/common';
import { Utils } from '../services/utils';
import { debounceTime, distinctUntilChanged, Subject, switchMap, of } from 'rxjs';
import { RecipeDetail } from '../components/recipe-detail/recipe-detail';
import { Draggable } from '../directives/draggable';
import { HttpClient } from '@angular/common/http';

function recipeServiceProvider(http:HttpClient): RecipeService{
  return new RecipeService(http);
}
// unique identifier for dependency
const RECIPE_SERVICE = new InjectionToken<RecipeService>('RECIPE_SERVICE');

// Standalone component default by Angular CLI
@Component({
  selector: 'app-root',
  // each import is local and scoped to this component
  imports: [RecipeCard, CommonModule, RecipeDetail, Draggable],
  templateUrl: './app.html',
  providers:[
    {provide: RECIPE_SERVICE, useFactory: recipeServiceProvider,deps:[HttpClient]}
  ],
  styleUrl: './app.scss',
})
export class App {
  currentPage = 1;
  recipes = signal<Recipe[]>([]);
  totalPages = signal(0);
  pages = computed(() => {
    return Array.from(this.utils.range(this.totalPages(), 1));
  });
  isLoading = signal(true);
  selectedRecipe = signal<Recipe | null>(null);

  // viewchild can reference html element or component instance from current template
  @ViewChild('searchInput', { read: ElementRef }) searchInput!: ElementRef<HTMLInputElement>;
  @ViewChild('likedArea', { static: true }) likedArea!: ElementRef;
  @ViewChildren(Draggable) draggables!: QueryList<Draggable>;

  @ViewChildren(RecipeCard)
  cards!: QueryList<RecipeCard>;
  likedRecipes = signal<Set<number>>(new Set<number>());

  private searchSubject = new Subject<string>();
  private cardPositions = new Map<number, DOMRect>();

  constructor(
    @Inject(RECIPE_SERVICE) private recipeService: RecipeService,
    private utils: Utils,
  ) {
    this.searchSubject
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((query) =>
          query
            ? this.recipeService.getRecipes(0, query)
            : of({ recipes: { data: [], totalPages: 0 } }),
        ),
      )
      .subscribe((data) => {
        this.recipes.set(data.recipes.data);
        this.totalPages.set(data.recipes.totalPages);
        this.currentPage = 0;
      });
  }

  // lifecycle hook runs after component is created
  ngOnInit() {
    console.log('App component initialized.');
    this.recipes.set(
      Array.from({ length: 6 }, (_, i) => this.utils.createEmptyRecipe(i)) as Recipe[],
    );
    this.recipeService.getRecipes().subscribe((data) => {
      this.recipes.set(data.recipes.data);
      this.totalPages.set(data.recipes.totalPages);
      this.isLoading.set(false);
    });
  }

  ngAfterViewInit() {
    // After template is initialized
    this.cards.changes.subscribe(() => {
      // Updated on structural changes (like *ngFor)
      this.animateReorder();
    });
    this.draggables.changes.subscribe((data) => {
      console.log('item dragged');
    });
  }
  onRecipeLiked(liked: { id: number; liked: boolean }) {
    this.capturePositions();
    const likedSet = new Set(this.likedRecipes());
    if (liked.liked) {
      likedSet.add(liked.id);
    } else {
      likedSet.delete(liked.id);
    }
    this.likedRecipes.set(likedSet);
    this.recipes.set(
      this.recipes().sort((a, b) => {
        const aLiked = likedSet.has(a.id);
        const bLiked = likedSet.has(b.id);
        if (aLiked && !bLiked) return -1;
        if (!aLiked && bLiked) return 1;
        return 0;
      }),
    );
  }

  loadRecipes(pageNo: number) {
    this.currentPage = pageNo;
    let query;
    this.isLoading.set(true);
    this.recipes.set(
      Array.from({ length: 6 }, (_, i) => this.utils.createEmptyRecipe(i)) as Recipe[],
    );
    if (this.searchInput.nativeElement.value) {
      query = this.searchInput.nativeElement.value;
    }
    this.recipeService.getRecipes(pageNo, query).subscribe((data) => {
      this.recipes.set(data.recipes.data);
      this.totalPages.set(data.recipes.totalPages);
      this.isLoading.set(false);
    });
  }

  onRecipeSelected(recipe: Recipe) {
    this.selectedRecipe.set(recipe);
    console.log('Recipe selected:', recipe);
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

  animateReorder() {
    this.cards.forEach((card) => {
      const el = card.host.nativeElement;
      const id = card.recipe.id;
      // get old position
      const oldPos = this.cardPositions.get(id);
      if (!oldPos) return;
      // get new positiona after DOM update
      const newPos = el.getBoundingClientRect();
      // Calculate the delta make items appear they still in old position
      const dx = oldPos.left - newPos.left;
      const dy = oldPos.top - newPos.top;

      el.style.transform = `translate(${dx}px, ${dy}px)`;
      el.style.transition = 'transform 0s';
      // restore to new position with animation
      requestAnimationFrame(() => {
        el.style.transform = '';
        el.style.transition = 'transform 300ms ease';
      });
    });

    this.cardPositions.clear();
  }
  capturePositions() {
    this.cards.forEach((card) => {
      this.cardPositions.set(card.recipe.id, card.host.nativeElement.getBoundingClientRect());
    });
  }

  onDrop({ dragged, target }: { dragged: RecipeCard; target: HTMLElement | null }) {
    if (!target) return;
    if (this.likedArea.nativeElement === target && !dragged.liked) {
      dragged.toggleLike();
    }

    const targetCardIndex = this.draggables.find((el) => el.host.contains(target))?.recipeCard
      .index;
    if (!targetCardIndex) return;
    this.capturePositions();
    const list = [...this.recipes()];
    const from = list.indexOf(dragged.recipe);
    const to = targetCardIndex - 1;

    if (from === -1 || to === -1 || from === to) return;

    [list[from], list[to]] = [list[to], list[from]];

    this.recipes.set(list);
  }
}
