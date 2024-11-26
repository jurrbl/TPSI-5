export class IngredientModel
{
    public _id? : string;
    public name : string;
    public amount : number;


    constructor(name: string, amount: number, unit: string, recipeId: string)
    {
        this.name = name;
        this.amount = amount;
    }
}
