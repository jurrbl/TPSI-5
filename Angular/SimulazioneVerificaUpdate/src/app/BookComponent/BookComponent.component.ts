import { Component, Input } from '@angular/core';
import { NgFor } from '@angular/common';


@Component({
  selector: 'app-book-component',
  standalone: true,
  templateUrl: './BookComponent.component.html',
  styleUrls: ['./BookComponent.component.css']
})
export class BookComponent {
  @Input() book: any;         // Dati del libro
  @Input() showPages: boolean; // Variabile per mostrare/nascondere le pagine
  @Input() showNations: boolean;

  showPagesInfo(book: any): void {
    console.log(`Pages: ${book.pages}`);
  }

  constructor() {
    this.showPages = false;
    this.showNations = true;
   }
}