import { Component } from '@angular/core';
import { NgFor, NgStyle, NgIf } from '@angular/common';
import { SingleClothesComponent } from '../SingleClothes/SingleClothes.component';
import { FormsModule, NgModel } from '@angular/forms'; // Importa FormsModule
import { Alert } from '@mui/material';

@Component({
  standalone: true,
  selector: 'app-ClothingComponent',
  imports: [NgFor, SingleClothesComponent, FormsModule, NgStyle, NgIf], // Aggiungi FormsModule qui
  templateUrl: './ClothingComponent.component.html',
  styleUrls: ['./ClothingComponent.component.css']
})

export class ClothingComponentComponent{

  clothingList: any[] = [
    {
      "ID": 1,
      "Nome": "Giacca Elegante",
      "Categoria": "Giacche",
      "Taglia": "L",
      "Prezzo": 120,
      "Descrizione": "Una giacca elegante perfetta per eventi formali.",
      "Immagine": "https://via.placeholder.com/400x400?text=Giacca+Elegante"
    },
    {
      "ID": 2,
      "Nome": "Pantaloni Casual",
      "Categoria": "Pantaloni",
      "Taglia": "M",
      "Prezzo": 45,
      "Descrizione": "Pantaloni comodi e casual per l'uso quotidiano.",
      "Immagine": "https://via.placeholder.com/400x400?text=Pantaloni+Casual"
    },
    {
      "ID": 3,
      "Nome": "Maglia Sportiva",
      "Categoria": "Maglie",
      "Taglia": "S",
      "Prezzo": 30,
      "Descrizione": "Maglia sportiva ideale per attività fisiche.",
      "Immagine": "https://via.placeholder.com/400x400?text=Maglia+Sportiva"
    },
    {
      "ID": 4,
      "Nome": "Giacca Invernale",
      "Categoria": "Giacche",
      "Taglia": "XL",
      "Prezzo": 150,
      "Descrizione": "Giacca calda e resistente per le stagioni fredde.",
      "Immagine": "https://via.placeholder.com/400x400?text=Giacca+Invernale"
    },
    {
      "ID": 5,
      "Nome": "Pantaloni Eleganti",
      "Categoria": "Pantaloni",
      "Taglia": "M",
      "Prezzo": 80,
      "Descrizione": "Pantaloni eleganti per occasioni speciali.",
      "Immagine": "https://via.placeholder.com/400x400?text=Pantaloni+Eleganti"
    },
    {
      "ID": 6,
      "Nome": "T-shirt Colorata",
      "Categoria": "Maglie",
      "Taglia": "L",
      "Prezzo": 25,
      "Descrizione": "T-shirt allegra e colorata per la primavera.",
      "Immagine": "https://via.placeholder.com/400x400?text=T-shirt+Colorata"
    },
    {
      "ID": 7,
      "Nome": "Cappello Estivo",
      "Categoria": "Accessori",
      "Taglia": "Unica",
      "Prezzo": 15,
      "Descrizione": "Cappello leggero per proteggersi dal sole.",
      "Immagine": "https://via.placeholder.com/400x400?text=Cappello+Estivo"
    },
    {
      "ID": 8,
      "Nome": "Cintura in Pelle",
      "Categoria": "Accessori",
      "Taglia": "Unica",
      "Prezzo": 55,
      "Descrizione": "Cintura in vera pelle per uno stile classico.",
      "Immagine": "https://via.placeholder.com/400x400?text=Cintura+in+Pelle"
    },
    {
      "ID": 9,
      "Nome": "Pantaloni da Trekking",
      "Categoria": "Pantaloni",
      "Taglia": "L",
      "Prezzo": 70,
      "Descrizione": "Pantaloni resistenti per avventure all'aperto.",
      "Immagine": "https://via.placeholder.com/400x400?text=Pantaloni+Trekking"
    },
    {
      "ID": 10,
      "Nome": "Sciarpa di Lana",
      "Categoria": "Accessori",
      "Taglia": "Unica",
      "Prezzo": 40,
      "Descrizione": "Sciarpa morbida per tenersi caldi in inverno.",
      "Immagine": "https://via.placeholder.com/400x400?text=Sciarpa+di+Lana"
    },
    {
      "ID": 11,
      "Nome": "Giacca di Pelle",
      "Categoria": "Giacche",
      "Taglia": "M",
      "Prezzo": 200,
      "Descrizione": "Giacca alla moda in vera pelle.",
      "Immagine": "https://via.placeholder.com/400x400?text=Giacca+di+Pelle"
    },
    {
      "ID": 12,
      "Nome": "Felpa con Cappuccio",
      "Categoria": "Maglie",
      "Taglia": "XL",
      "Prezzo": 60,
      "Descrizione": "Felpa casual per un comfort quotidiano.",
      "Immagine": "https://via.placeholder.com/400x400?text=Felpa+Cappuccio"
    },
    {
      "ID": 13,
      "Nome": "Guanti Termici",
      "Categoria": "Accessori",
      "Taglia": "Unica",
      "Prezzo": 25,
      "Descrizione": "Guanti isolanti per tenere calde le mani.",
      "Immagine": "https://via.placeholder.com/400x400?text=Guanti+Termici"
    },
    {
      "ID": 14,
      "Nome": "Pantaloni Cargo",
      "Categoria": "Pantaloni",
      "Taglia": "L",
      "Prezzo": 50,
      "Descrizione": "Pantaloni pratici con tasche multiple.",
      "Immagine": "https://via.placeholder.com/400x400?text=Pantaloni+Cargo"
    },
    {
      "ID": 15,
      "Nome": "Berretto Invernale",
      "Categoria": "Accessori",
      "Taglia": "Unica",
      "Prezzo": 20,
      "Descrizione": "Berretto caldo per le giornate più fredde.",
      "Immagine": "https://via.placeholder.com/400x400?text=Berretto+Invernale"
    }
  ]
  
  selectedCategory: string = '';
  selectedItem: any = null;
  
  getUniqueCategories(): string[] {
    const categories = this.clothingList.map(item => item.Categoria);
    return Array.from(new Set(categories));
  }
  getFilteredClothingList() {
    return this.selectedCategory
      ? this.clothingList.filter(item => item.Categoria === this.selectedCategory)
      : this.clothingList;
  }

  
  showDisplay(item: any) {
    this.selectedItem = item; 
  }

}
