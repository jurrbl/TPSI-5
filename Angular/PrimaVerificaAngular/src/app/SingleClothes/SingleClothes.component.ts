import { Component, Input } from '@angular/core';
import { ClothingComponentComponent } from '../ClothingComponent/ClothingComponent.component';

@Component({
  standalone: true,
  selector: 'app-SingleClothes',
  templateUrl: './SingleClothes.component.html',
  styleUrls: ['./SingleClothes.component.css']
})
export class SingleClothesComponent{


  @Input() item: any;

  

}
