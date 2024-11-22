import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { EventListComponent } from './event-list/event-list.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, EventListComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'ES04-Eventi';
}
