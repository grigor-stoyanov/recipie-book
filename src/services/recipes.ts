import { Inject, Injectable, Optional } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { delay, Observable, catchError, of } from 'rxjs';
import { RecipesResponse } from '../interfaces';
import { ApiConfig, CONFIG_TOKEN } from '../config';

// Single instance provided in the root available for injection in constructor
@Injectable({
  // provides a factory for service
  providedIn: 'root',
})
export class RecipeService {
  private apiUrl = 'http://localhost:90001/api';
  // config is optional and can be null if not provided, but if provided it will be injected by Angular's DI system
  constructor(private http: HttpClient, @Optional() @Inject(CONFIG_TOKEN) private config: ApiConfig | null) {}

  getRecipes(pageNo=0,searchQuery?:string): Observable<RecipesResponse> {
    let url = `${this.config?.apiUrl || this.apiUrl}/recipes?pageNo=${pageNo}`;
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
