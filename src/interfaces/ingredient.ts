export interface Ingredient {
    id: number;
    amount: string;
    unit: string;  // e.g. "2 cups", "1 tbsp", "200g"
    ingredient: {
        id: number;
        name: string;
    }
}