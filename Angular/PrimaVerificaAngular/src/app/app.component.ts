import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ClothingComponentComponent } from './ClothingComponent/ClothingComponent.component';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ClothingComponentComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Belba Jurgen';
}
