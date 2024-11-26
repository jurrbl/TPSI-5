import { IngredientModel } from './ingredient.model';

export class RecipeModel{
  public _id? : string; //infatti qua ?
  public name : string;
  public description : string;
  public imagePath : string;
  public ingredients : IngredientModel[];


  constructor(_id : string, name : string, description : string, imagePath : string, ingredients : any[]){
    //non assegno l'id perchè poi lo facciamo assegnare dal server
    this.name = name;
    this.description = description;
    this.imagePath = imagePath;
    this.ingredients = ingredients;
  }
}
