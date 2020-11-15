import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
// import { QuestionsService } from '../../services/questions.service';
import { QuestionsService, ChapterService } from "../../services";
import { Answer, Question, QuestionType, Quiz, Chapter, Book } from 'src/app/models/interfaces';
import { AngularFireStorage } from "@angular/fire/storage";
import { Router } from '@angular/router';
import { Subscription } from 'rxjs/internal/Subscription';

import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
declare var $: any;

@Component({
  selector: 'app-question-entry',
  templateUrl: './question-entry.component.html',
  styleUrls: ['./question-entry.component.css']
})
export class QuestionEntryComponent implements OnInit, OnDestroy {
  selectedBook: Book;
  errorMsg: string;
  files: any[];
  sub: Subscription;
  url: any;
  chapters: Chapter[] = []
  quizzes: Quiz[] = []
  answers: Answer[] = []
  questionsTypes: QuestionType[] = []
  imageFile: File;
  uploadProgress: number = 0
  selectedImgUrl: String = ''
  selectedQuestion: Question;
  selectedChapterId: String;
  selectedChapter: Chapter;
  selectedQuiz: Quiz;


  @Output() notifyQuestionSubmit: EventEmitter<Question> = new EventEmitter<Question>();
  @Output() notifyQuestionClear: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() notifyQuestionDelete: EventEmitter<Question> = new EventEmitter<Question>();

  questionForm = new FormGroup({
    grade: new FormControl(Validators.required),
    chapter: new FormControl(Validators.required),
    questionType: new FormControl(Validators.required),
    quiz: new FormControl(Validators.required),
    questionText: new FormControl(Validators.required),
    timer: new FormControl(0, Validators.required),
    imgUrl: new FormControl(),
    displayOrder: new FormControl('000'),
    columnsCount: new FormControl(0),
    isActive: new FormControl(true),
  })

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private questionService: QuestionsService,
    private chapterService: ChapterService,
    private af: AngularFireStorage,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService
  ) {
    this.createForm();
    if (this.router.getCurrentNavigation().extras.state) {
      this.selectedQuestion = this.router.getCurrentNavigation().extras.state.question;
      if (this.selectedQuestion) {
        this.selectedChapterId = this.selectedQuestion.chapter._id
        this.refillQuestionForm();
      }
    }
  }

  ngOnInit(): void {
    this.spinner.show()
    const b = localStorage.getItem('selectedBook');
    if (b) {
      this.selectedBook = JSON.parse(b)
    }
    this.getQuestionsTypes();
    this.getChapters();
  }

  async refillQuestionForm() {
    this.getQuizesForChapter();
    this.answers = this.selectedQuestion.answers;
    this.questionForm.controls['questionText'].setValue(this.selectedQuestion.questionText)
    this.questionForm.controls['imgUrl'].setValue(this.selectedQuestion.imgUrl)
    this.selectedImgUrl = this.selectedQuestion.imgUrl
    this.questionForm.controls['timer'].setValue(this.selectedQuestion.timer)

    this.questionForm.controls['columnsCount'].setValue(this.selectedQuestion.columnsCount)
    this.questionForm.controls['displayOrder'].setValue(this.selectedQuestion.displayOrder)
    this.questionForm.controls['isActive'].setValue(this.selectedQuestion.isActive)
    this.questionForm.controls['questionType'].patchValue(this.selectedQuestion.questionType._id)

    this.questionForm.controls['chapter'].setValue(this.selectedQuestion.chapter._id)
    this.questionForm.controls['quiz'].setValue(this.selectedQuestion.quiz._id)

  }




  onCreateQuizClicked() {
    this.selectedQuiz = null
  }

  selectedQuizForEdit() {
    const qId = this.questionForm.get('quiz').value;
    if (!qId) {
      return;
    }

    const quiz = this.quizzes.find((qz) => {
      return qz._id === qId;
    })

    this.selectedQuiz = quiz
  }


  onCreateChapterClicked() {
    this.selectedChapter = null
  }

  selectedChapterForEdit() {
    if (!this.selectedChapterId) {
      return;
    }

    const c = this.chapters.find((ch) => {
      return ch._id === this.selectedChapterId;
    })

    this.selectedChapter = c
  }

  createForm() {
    this.questionForm = this.fb.group({
      chapter: ['', [Validators.required]],
      quiz: ['', [Validators.required]],
      questionType: ['', [Validators.required]],
      questionText: ['', [Validators.required]],
      timer: [0, [Validators.min(0), Validators.max(20)]],
      imgUrl: '',
      displayOrder: '000',
      columnsCount: 0,
      isActive: true,
      // quizId: [null, [Validators.required]],
    });
 
  }

  onAnswerAdded(_answer) {
    this.answers.push(_answer)
  }

  onSelectImage(imgUrl) {
    this.questionForm.controls['imgUrl'].setValue(imgUrl);
    this.selectedImgUrl = imgUrl
  }

  clearForm() {
    // this.createForm();
    this.questionForm.controls['chapter'].reset('')
    this.questionForm.controls['quiz'].reset('')
    this.questionForm.controls['questionText'].reset('')
    this.questionForm.controls['imgUrl'].reset('')
    this.questionForm.controls['displayOrder'].reset('000')
    this.questionForm.controls['timer'].reset('0')
    // this.questionForm.reset({});
    this.answers = []
    this.selectedQuestion = null
    this.notifyQuestionClear.emit(true)
  }

  async deleteQuestion() {
    this.spinner.show();
    if (confirm("Are you sure to delete ")) {
      this.sub = await this.questionService.deleteQuestion(this.selectedQuestion._id.toString()).subscribe(
        data => {
          this.toastr.success('Question been deleted.');
        }, (err: any) => {
          this.spinner.hide();
          this.errorMsg = err
          this.toastr.error(err)
        }, () => {
          this.clearForm()
          this.spinner.hide();
        }
      )
    }
  }


  onChapterDeleted(deletedChapter) {
    this.questionForm.reset({});
    const index: number = this.chapters.indexOf(deletedChapter);
    if (index !== -1) {
      this.chapters.splice(index, 1);
    }
    this.answers = []
    this.selectedQuestion = null
  }

  onQuizDeleted(deletedQuiz) {
    this.questionForm.reset({});
    const index: number = this.quizzes.indexOf(deletedQuiz);
    if (index !== -1) {
      this.quizzes.splice(index, 1);
    }
    this.answers = []
    this.selectedQuestion = null
  }


  getQuestionsTypes() {
    this.spinner.show();
    this.sub = this.questionService.getQuestionsTypes().subscribe(
      data => {
        this.questionsTypes = data
      }, (err: any) => {
        this.spinner.hide();
        this.toastr.error(err)
        this.errorMsg = err
      }, () => {
        if (!this.selectedQuestion && this.questionsTypes.length > 0) {
          this.questionForm.controls['questionType'].patchValue(this.questionsTypes[0]._id)
        }
        this.spinner.hide();
      }
    )
  }

  getChapters() {
    this.spinner.show()
    this.sub = this.chapterService.getChapters(this.selectedBook._id).subscribe(
      data => {
        this.chapters = data
      }, (err: any) => {
        this.spinner.hide();
        this.errorMsg = err
        this.toastr.error(err)

      }, () => {
        this.spinner.hide();
      }
    )

  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  onChapterAdded(chapter) {
    this.chapters.push(chapter)
  }

  onChapterChange() {
    this.selectedChapterId = this.questionForm.get('chapter').value;
    this.quizzes = []
    this.questionForm.controls['quiz'].setValue('');
    this.selectedChapterForEdit();
    this.getQuizesForChapter();
  }


  onQuizChange() {
    this.selectedQuizForEdit();
  }

  onQuizAdded(quiz) {
    this.quizzes.push(quiz)
  }


  async getQuizesForChapter() {
    this.spinner.show();
    this.quizzes = []
    this.sub = await this.questionService.getQuizesForChapter(this.selectedChapterId).subscribe(
      data => {
        this.quizzes = data
      }, (err: any) => {
        this.spinner.hide();
        this.toastr.error(err)
        this.errorMsg = err

      }, () => {
        this.spinner.hide();
      }
    )
  }

  saveQuestion() {

    if (!this.questionForm.valid || this.questionForm.get('questionText').value == '') {
      this.toastr.warning("You may need to select a Chapter and Quiz! and Question Text is required!")
      return;
    }

    if (this.answers.length == 0) {
      this.toastr.warning("You need to add some Answers")
      return;
    }

    if (this.selectedQuestion) {
      this.updateQuestion()
      return;
    }

    this.addNewQuestion();
  }

  //method to retrieve download url
  async getUrl(snap: firebase.storage.UploadTaskSnapshot) {
    const url = await snap.ref.getDownloadURL();
    return url
  }

  async addNewQuestion() {
    this.spinner.show();
    var question = this.questionForm.value;
    question.answers = this.answers;
    question.book = this.selectedBook;

    this.sub = await this.questionService.addQuestion(question).subscribe(
      (data: Question) => {
        this.toastr.success('Question been added successfuly !')
        this.selectedQuestion = data
      },
      error => {
        this.errorMsg = error;
        this.spinner.hide();
        this.toastr.error(error)
      },
      () => {
        this.errorMsg = ""
        this.spinner.hide();
        // alert("Question has been added!")
      }
    )

  }


  async updateQuestion() {
    this.spinner.show();
    var question = this.questionForm.value;
    question.answers = this.answers;
    question.book = this.selectedBook;
    this.sub = await this.questionService.updateQuestion(this.selectedQuestion._id, question).subscribe(
      (data: Question) => {
        this.toastr.success('Question been updated successfuly !')
      }, error => {
        this.errorMsg = error;
        this.spinner.hide();
        this.toastr.error(error)
      },
      () => {
        this.errorMsg = ""
        this.spinner.hide();
        // alert("Question has been UPDATED!")
      }
    )

  }



  deleteAnswer(answer) {
    const index: number = this.answers.indexOf(answer);
    if (index !== -1) {
      this.answers.splice(index, 1);
    }
  }

  validateQuestionText() {
    return this.questionForm.controls['questionText'].valid || this.questionForm.controls['questionText'].untouched
  }


}
