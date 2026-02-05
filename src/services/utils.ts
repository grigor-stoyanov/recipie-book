import { Injectable } from '@angular/core';
import { EMPTY_RECIPE } from '../constants/const';
import { Recipe } from '../interfaces';

@Injectable({
  providedIn: 'root',
})
export class Utils {
  constructor() { }
  public * range(end: number, start = 0): Generator<number, void, unknown> {
    for (let i = start; i <= end; i++) {
      yield i;
    }
  }


  createEmptyRecipe(id: number): Partial<Recipe & { id: number }> {
    return { ...EMPTY_RECIPE, id };
  }
}
