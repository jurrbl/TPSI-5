import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LibraryComponentComponent } from './LibraryComponent/LibraryComponent.component';
import { NgFor, NgStyle, NgClass } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, LibraryComponentComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.less'
})
export class AppComponent {
  title = 'Belba Jurgen';
}
