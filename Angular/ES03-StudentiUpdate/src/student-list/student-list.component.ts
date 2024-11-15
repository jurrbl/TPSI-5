import { Component } from '@angular/core';
import { StudentComponent } from "../student/student.component";
import { NgIf } from '@angular/common';


@Component({
  selector: 'app-student-list',
  standalone: true,
  imports: [StudentComponent, NgIf],
  templateUrl: './student-list.component.html',
  styleUrl: './student-list.component.css'
})
export class StudentListComponent {
  student: any = {};
  studentList: any[] = [
    { "name": "pippo", "city": "Fossano", "gender": "M", "present": true },
    { "name": "pluto", "city": "Cuneo", "gender": "M", "present": true },
    { "name": "minnie", "city": "Alba", "gender": "F", "present": false },
    { "name": "sonny", "city": "Torino", "gender": "M", "present": true },
    { "name": "sally", "city": "Fossano", "gender": "F", "present": true },
    { "name": "elly", "city": "Genola", "gender": "F", "present": true },
    { "name": "fanny", "city": "Cuneo", "gender": "M", "present": false },
    { "name": "sandy", "city": "Alba", "gender": "F", "present": true },
    { "name": "john", "city": "Torino", "gender": "M", "present": true },
    { "name": "joe", "city": "Torino", "gender": "M", "present": true },
    { "name": "jack", "city": "Fossano", "gender": "M", "present": true }
  ];

  cities : string[] = ['Fossano', 'Genola', 'Savigliano', 'Cuneo', 'Alba', 'Canale'];
}
