import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Recipe } from '../interfaces';
interface RecipesResponse {
  recipes: {data: Recipe[]};
}
@Injectable({
  providedIn: 'root',
})
export class RecipeService {
  private apiUrl = 'http://localhost:9000/api/recipes';
  constructor(private http: HttpClient) {}

  getRecipes(): Observable<RecipesResponse> {
    return this.http.get<RecipesResponse>(this.apiUrl);
  }
}
