import { Component, Input } from '@angular/core';
import { RecipeModel } from '../../../models/recipe.model';

@Component({
  selector: 'app-recipe-item',
  standalone: true,
  imports: [],
  templateUrl: './recipe-item.component.html',
  styleUrl: './recipe-item.component.css'
})
export class RecipeItemComponent {
  @Input() recipe!: RecipeModel;
}
