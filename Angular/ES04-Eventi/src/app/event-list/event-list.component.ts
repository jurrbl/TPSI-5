import { RouterOutlet } from '@angular/router';
import { Component } from '@angular/core';
import { Event } from '../event-module';
import { NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Import FormsModule

@Component({
  selector: 'app-event-list',
  standalone: true,
  imports: [NgFor, FormsModule],
  templateUrl: './event-list.component.html',
  styleUrl: './event-list.component.css'
})



export class EventListComponent {

  events: Event[] = [
    { id: 1, name: 'Concerto Rock', attendees: 5 },
    { id: 2, name: 'Fiera del Libro', attendees: 10 },
    { id: 3, name: 'Maratona Cittadina', attendees: 2 },
    { id: 4, name: 'Mostra d’Arte Moderna', attendees: 0 },
    { id: 5, name: 'Festival del Cinema', attendees: 0 },
    { id: 6, name: 'Degustazione di Vini', attendees: 0 },
    { id: 7, name: 'Corsa dei 10 Km', attendees: 3 },
    { id: 8, name: 'Spettacolo di Danza', attendees: 12 },
    { id: 9, name: 'Workshop di Fotografia', attendees: 0 },
    { id: 10, name: 'Seminario di Tecnologia', attendees: 4 },
    { id: 11, name: 'Festa di Quartiere', attendees: 5 },
    { id: 12, name: 'Torneo di Scacchi', attendees: 0 },
    { id: 13, name: 'Conferenza sulla Salute', attendees: 0 },
    { id: 14, name: 'Esibizione di Musica Jazz', attendees: 10 },
    { id: 15, name: 'Cineforum', attendees: 0 },

  ];

  newEventName: any ;  newEventAttendees: any = 0;

addEvent() {
  if (this.newEventName && this.newEventAttendees > 0) {
    const newId = Math.max(...this.events.map(e => e.id), 0) + 1;//+
    this.events.push({ id: newId, name: this.newEventName, attendees: this.newEventAttendees });//+
    this.newEventName = '';//+
    this.newEventAttendees = 0;//+
  }
}

  addAttendee(event: Event) {
    event.attendees++;
  }

  resetEvents(event: Event) {
    event.attendees = 0;
  }

  removeEvent(event: Event) {
    this.events = this.events.filter(e => e.id !== event.id);
  }



}
