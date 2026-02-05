import { Recipe } from "../interfaces";

  export const EMPTY_RECIPE: Partial<Recipe> = {
    id: 0,
    title: '',
    instructions: '',
    cooktime: 0,
    created: '',
    iconUrl: '',
    ingredients: []
  };