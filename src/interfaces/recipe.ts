import { Ingredient } from "./ingredient";
export interface Recipe {
  id: number;
  title: string;
  instructions: string;
  cooktime: number;
  created: string;
  iconUrl: string;
  mealType?: string;
  ingredients: Ingredient[];
}

export interface RecipesResponse {
  recipes: {data: Recipe[] | [], total?: number, page?: number, limit?: number,totalPages:number};
}