import { Component } from '@angular/core';
import { NgFor, NgStyle, NgClass, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BookComponent } from '../BookComponent/BookComponent.component';
import { bookModel } from '../bookModel';

@Component({
  selector: 'app-library-component',
  standalone: true,
  imports: [BookComponent, NgFor, NgStyle, NgClass, NgIf, FormsModule],
  templateUrl: './LibraryComponent.component.html',
  styleUrls: ['./LibraryComponent.component.css']
})
export class LibraryComponentComponent {
  bookList: bookModel[] = [
    { author: 'Hans Christian Andersen', country: 'Denmark', pages: 784, title: 'Fairy tales', year: 1836 },
    { author: 'Dante Alighieri', country: 'Italy', pages: 928, title: 'The Divine Comedy', year: 1315 },
    { author: 'Jane Austen', country: 'United Kingdom', pages: 226, title: 'Pride and Prejudice', year: 1813 },
    { author: 'Giovanni Boccaccio', country: 'Italy', pages: 1024, title: 'The Decameron', year: 1351 },
    { author: 'Miguel de Cervantes', country: 'Spain', pages: 1056, title: 'Don Quijote De La Mancha', year: 1610 },
    { author: 'Geoffrey Chaucer', country: 'England', pages: 544, title: 'The Canterbury Tales', year: 1450 },
    { author: 'Anton Chekhov', country: 'Russia', pages: 194, title: 'Stories', year: 1886 }
  ];

  showPageNumbers: boolean = true;
  selectedCountry: string = ''; // Valore selezionato nella combo

  // Metodo per filtrare i libri
  get filteredBooks(): bookModel[] {
    if (this.selectedCountry) {
      return this.bookList.filter(book => book.country === this.selectedCountry);
    }
    return this.bookList;
  }

  showPages(book: any): void {
    console.log(`Pages: ${book.pages}`);
  }


  removeBook(index: number): void {
    this.bookList.splice(index, 1);
  }
}
