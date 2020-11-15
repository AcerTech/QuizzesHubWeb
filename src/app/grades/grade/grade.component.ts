import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Grade } from 'src/app/models/interfaces';
import { GradeService } from 'src/app/services';

@Component({
  selector: 'app-grade',
  templateUrl: './grade.component.html',
  styleUrls: ['./grade.component.css']
})
export class GradeComponent implements OnInit {
  gradeForm: FormGroup;
  grade: Grade;
  errorMessage: any;

  constructor(private fb: FormBuilder,
    private gradeService: GradeService) { }

  ngOnInit(): void {
    this.createForm()
  }

  createForm() {
    this.gradeForm = this.fb.group({
      name: [null, [Validators.required]],
      description: '',
      displayOrder: 0,
      isActive: true
    });
  }

  saveGrade() {

  }

  deleteGrade() {

  }

}
