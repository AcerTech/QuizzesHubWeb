import { Component, OnInit } from '@angular/core';
import { Grade } from 'src/app/models/interfaces';
import { GradeService } from 'src/app/services';

@Component({
  selector: 'app-grades-list',
  templateUrl: './grades-list.component.html',
  styleUrls: ['./grades-list.component.css']
})
export class GradesListComponent implements OnInit {
  grades: Grade[] = [];
  errorMsg: string = "";

  constructor(private gradeService: GradeService) { }

  ngOnInit(): void {
    this.getGrades();

  }

  getGrades() {
    this.gradeService.getGrades().subscribe(
      data => {
        this.grades = data
        // console.log(data)
      }, (err: any) => {
        this.errorMsg = err
      }, () => {

      }
    )
  }

}
