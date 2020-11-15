import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { QuestionsService } from '../../services/questions.service';
import { Answer } from 'src/app/models/interfaces';

@Component({
  selector: 'app-answer-entry',
  templateUrl: './answer-entry.component.html',
  styleUrls: ['./answer-entry.component.css']
})
export class AnswerEntryComponent implements OnInit {
  @Output() notifyAnswerAdded: EventEmitter<Answer> = new EventEmitter<Answer>();
  selectedImgUrl: string = ''
  answerForm = new FormGroup({
    answerText: new FormControl(),
    imgUrl: new FormControl(),
    displayOrder: new FormControl('000'),
    isCorrect: new FormControl(false)
  })

  constructor(
    private fb: FormBuilder,
    private questionService: QuestionsService
  ) { }

  ngOnInit(): void {
  }


  createForm() {
    this.answerForm = this.fb.group({
      answerText: [null, [Validators.required]],
      imgUrl: '',
      displayOrder: '000',
      isCorrect: false
    });
  }

  saveAnswer() {
    // console.log(this.answerForm.value)
    this.notifyAnswerAdded.emit(this.answerForm.value)
  }

  onSelectImage(imgUrl) {
    this.selectedImgUrl = imgUrl
    this.answerForm.controls['imgUrl'].setValue(imgUrl);
  }
}
