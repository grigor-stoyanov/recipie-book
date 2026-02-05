import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { delay, Observable } from 'rxjs';
import { Recipe } from '../interfaces';
interface RecipesResponse {
  recipes: {data: Recipe[], total: number, page: number, limit: number,totalPages:number};
}
@Injectable({
  providedIn: 'root',
})
export class RecipeService {
  private apiUrl = 'http://localhost:9000/api/recipes';
  constructor(private http: HttpClient) {}

  getRecipes(pageNo=0,searchQuery?:string): Observable<RecipesResponse> {
    let url = `${this.apiUrl}?pageNo=${pageNo}`;
    if(searchQuery) {
      url += `&keyword=${encodeURIComponent(searchQuery)}`;
    }
    return this.http.get<RecipesResponse>(url).pipe(delay(300)); // Simulate network delay
  }
}
