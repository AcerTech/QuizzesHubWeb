import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { Book, Chapter, Quiz } from 'src/app/models/interfaces';
import { QuizzesService } from 'src/app/services';

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.css']
})
export class QuizComponent implements OnInit, OnDestroy {
  @Output() notifyQuizAdded: EventEmitter<Quiz> = new EventEmitter<Quiz>();
  @Output() notifyQuizDeleted: EventEmitter<Quiz> = new EventEmitter<Quiz>();
  sub: Subscription;
  selectedBook: Book;
  _selectedChapterId: string;
  @Input() set selectedChapterId(value: string) {
    this._selectedChapterId = value;
    if (!value) {
      return;
    }
    this.refillQuizForm();

  }

  get selectedChapterId(): string {
    return this._selectedChapterId;
  }

  private _selectedQuizForEdit: Quiz;
  get selectedQuizForEdit(): Quiz {
    return this._selectedQuizForEdit;
  }
  @Input() set selectedQuizForEdit(v: Quiz) {
    this._selectedQuizForEdit = v;
    if (!v) {
      this.createForm();//reset form
      return;
    }
    this.refillQuizForm();
  }


  quizForm: FormGroup;
  quiz: Quiz;
  errorMsg: string = ""

  constructor(
    private fb: FormBuilder,
    private quizService: QuizzesService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    const b = localStorage.getItem('selectedBook');
    if (b) {
      this.selectedBook = JSON.parse(b)
    }

    this.createForm();
  }

  createForm() {
    this.quizForm = this.fb.group({
      name: [null, [Validators.required]],
      description: '',
      isActive: true,
      displayOrder: '000',
    });
  }

  saveQuiz() {
    if (this.selectedQuizForEdit) {
      this.updateQuiz();
    } else {
      this.createNewQuiz();
    }

  }

  refillQuizForm() {
    // console.log(this.selectedChapterId)
    // console.log(this.selectedQuizForEdit)
    if (!this.selectedQuizForEdit) {
      return;
    }
    this.quizForm.controls["name"].patchValue(this.selectedQuizForEdit.name);
    this.quizForm.controls["description"].patchValue(this.selectedQuizForEdit.description);
    this.quizForm.controls["displayOrder"].patchValue(this.selectedQuizForEdit.displayOrder);
    this.quizForm.controls["isActive"].patchValue(this.selectedQuizForEdit.isActive);
    // this.quizForm.controls["imgUrl"].patchValue(this.selectedQuizForEdit.imgUrl);

  }

  async createNewQuiz() {

    const q = {
      name: this.quizForm.controls['name'].value,
      description: this.quizForm.controls['description'].value,
      isActive: this.quizForm.controls['isActive'].value,
      displayOrder: this.quizForm.controls['displayOrder'].value,
      chapterId: this.selectedChapterId,
      bookId: this.selectedBook._id
    }
    this.spinner.show();
    this.sub = await this.quizService.addQuiz(q).subscribe(
      (data: Quiz) => {

        this.quiz = data
      },
      error => {
        this.spinner.hide();
        this.toastr.error(error)
        this.errorMsg = error;
      },
      () => {
        this.spinner.hide()
        this.notifyQuizAdded.emit(this.quiz)
        this.toastr.success("Quiz been added!")
      }
    )

  }

  updateQuiz() {
    const q = {
      name: this.quizForm.controls['name'].value,
      description: this.quizForm.controls['description'].value,
      isActive: this.quizForm.controls['isActive'].value,
      displayOrder: this.quizForm.controls['displayOrder'].value,
      chapterId: this.selectedChapterId,
      bookId: this.selectedBook._id
    }
    this.spinner.show();
    this.quizService.updateQuiz(this.selectedQuizForEdit._id, q).subscribe(
      (data: Quiz) => {
        this.quiz = data
        this.toastr.success("Quiz title has been Updated!")
      },
      error => {
        this.spinner.hide();
        this.errorMsg = error;
        this.toastr.error(error)
      }

    )
    this.spinner.hide();
  }


  async deleteQuiz() {
    console.log(this.selectedQuizForEdit)
    const confirmDelete = confirm("This will delete all Questions related to this Quiz, Are you sure to delete?");
    if (!confirmDelete) return;
    this.spinner.show()

    this.sub = await this.quizService.deleteQuiz(this.selectedQuizForEdit._id.toString()).subscribe(
      data => {
        this.spinner.hide();
        this.quizForm.reset({});
        this.toastr.success("The Quiz and all related Questions been deleted !")
        this.notifyQuizDeleted.emit(this.selectedQuizForEdit)
      }, (err: any) => {
        this.errorMsg = err
        this.spinner.hide();
        this.toastr.error(err)
      }
    )
    this.spinner.hide();
  }

  ngOnDestroy() {
    if (!this.sub) return;
    this.sub.unsubscribe();
  }

}
