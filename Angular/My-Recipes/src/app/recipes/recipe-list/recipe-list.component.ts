import { Component } from '@angular/core';
import { RecipeItemComponent }  from './recipe-item/recipe-item.component';
import { RecipeModel } from '../../models/recipe.model';

@Component({
  selector: 'app-recipe-list',
  standalone: true,
  imports: [RecipeItemComponent],
  templateUrl: './recipe-list.component.html',
  styleUrl: './recipe-list.component.css'
})
export class RecipeListComponent {

  recipes: RecipeModel[] = [
    {
      "name": "Spaghetti alla chitarra",
      "description": "Un particolare tipo di pasta che...",
      "imagePath": "https://images.lacucinaitaliana.it/wp-content/uploads/2017/02/Maccheroni-alla-chitarra.jpg",
      "ingredients": [
        {
          "name": "Ingredient A",
          "amount": 31
        },
        {
          "name": "Ingredient B",
          "amount": 81
        }
      ]
    },
    {
      "name": "Lasagne alla bolognese",
      "description": "Pasta calorica emiliana...",
      "imagePath": "https://www.cucinare.it/uploads/wp-content/uploads/2015/05/pasta_alla_bolognese.webp",
      "ingredients": [
        {
          "name": "Ingredient C",
          "amount": 32
        },
        {
          "name": "Ingredient D",
          "amount": 82
        }
      ]
    },
    {
      "name": "Gnocchi ai formaggi",
      "description": "ottimi soprattutto in montagna...",
      "imagePath": "https://images.fidhouse.com/fidelitynews/wp-content/uploads/sites/6/2017/05/1495792337_13c855513b63705bb079c377ed01563d4eb12ccc-223759579.jpg?w=580",
      "ingredients": [
        {
          "name": "Ingredient E",
          "amount": 33
        },
        {
          "name": "Ingredient F",
          "amount": 83
        }
      ]
    },
    {
      "name": "Tiramisu",
      "description": "con panna e mascarcope...",
      "imagePath": "https://blog.giallozafferano.it/acasadimaria/wp-content/uploads/2019/06/tiramisu-sav.png",
      "ingredients": [
        {
          "name": "Ingredient G",
          "amount": 34
        },
        {
          "name": "Ingredient H",
          "amount": 84
        }
      ]
    }
];

selectedRecipe: RecipeModel;
constructor ()
{
  this.selectedRecipe = this.recipes[0];
}
}
