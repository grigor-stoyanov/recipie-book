import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { delay, Observable, catchError, of } from 'rxjs';
import { RecipesResponse } from '../interfaces';

// Single instance provided in the root available for injection in constructor
// @Injectable({
//   // provides a factory for service
//   providedIn: 'root',
// })
export class RecipeService {
  private apiUrl = 'http://localhost:9000/api/recipes';
  private apiUrl2 = 'http://172.21.227.48:9000/api/recipes';
  constructor(private http: HttpClient) {}

  getRecipes(pageNo=0,searchQuery?:string): Observable<RecipesResponse> {
    let url = `${this.apiUrl2}?pageNo=${pageNo}`;
    if(searchQuery) {
      url += `&keyword=${encodeURIComponent(searchQuery)}`;
    }
    return this.http.get<RecipesResponse>(url)
      .pipe(delay(300),  // Simulate network delay
         catchError(err => {
            console.error('API error:', err);
            const emptyResponse: RecipesResponse = {
              recipes: {
                data: [],
                totalPages: 0
              }
            };
            return of(emptyResponse);
          })
        );
  }

  // TODO: add recipe edit/add

  // TODO: demonstrate async pipe
}
