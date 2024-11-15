import { Component, Input } from '@angular/core';
import { NgClass } from '@angular/common';
import { NgIf } from '@angular/common';


@Component({
  selector: 'app-student',
  standalone: true,
  imports: [NgClass, NgIf],
  templateUrl: './student.component.html',
  styleUrl: './student.component.css'
})
export class StudentComponent {
  @Input() student: any;

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    let num = this.generaNumero(1,3);
    this.student.present = num == 1;
  }


  onStudentClick(): void {
    this.student.present =!this.student.present;
  }

  generaNumero(a: number, b: number) {
    return Math.floor((b - a) * Math.random()) + a;
  }
}
