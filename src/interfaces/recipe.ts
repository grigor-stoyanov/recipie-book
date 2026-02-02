import { Ingredient } from "./ingredient";
export interface Recipe {
  id: number;
  title: string;
  instructions: string;
  cooktime: number;
  created: string;
  iconUrl: string;
  ingredients: Ingredient[];
}