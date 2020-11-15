import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { Subscription } from 'rxjs/internal/Subscription';
import { Book, Chapter, Question } from 'src/app/models/interfaces';
import { BooksService, ChapterService, QuestionsService } from 'src/app/services';
import * as _ from "lodash";
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-book-content',
  templateUrl: './book-content.component.html',
  styleUrls: ['./book-content.component.css']
})
export class BookContentComponent implements OnInit, OnDestroy {
  // @Output() notifyBookSelected: EventEmitter<Book> = new EventEmitter<Book>();
  selectedBook: Book;
  questions: Question[] = [];
  errorMsg: string = "";
  successMsg: string = "";
  sub: Subscription;
  chapters: Chapter[] = []
  quizesGroupedList: any[] = [];
  chaptersGroupedList: any[] = [];


  constructor(private router: Router,
    private questionService: QuestionsService,
    private spinner: NgxSpinnerService,
    private bookService: BooksService) {

    if (this.router.getCurrentNavigation().extras.state) {
      this.selectedBook = this.router.getCurrentNavigation().extras.state.book;
      if (this.selectedBook) {
        // this.refillQuestionForm();
        // console.log(this.selectedBook)
        // this.notifyBookSelected.emit(this.selectedBook)
        bookService.storeSelectedBookToLocalStorage(this.selectedBook)
      }
    }
  }


  ngOnInit(): void {
    const b = this.bookService.getSelectedBookFromLocalStorage()
    if (b) {
      this.selectedBook = JSON.parse(b)
    }
    this.getQuestionsForBook();

  }

  async getQuestionsForBook() {
    this.questions = []
    this.spinner.show();
    this.sub = await this.questionService.getQuestionsByBookId(this.selectedBook._id).subscribe(
      data => {
        this.questions = data;
        // console.log(data)
      }, (err: any) => {
        this.spinner.hide();
        this.errorMsg = err
      },
      () => {
        this.getGroupedList();
        this.spinner.hide();
      }
    )

  }


  questionClicked(selectedQuestion) {
    let navExtras: NavigationExtras = {
      state: {
        question: selectedQuestion
      }
    }
    this.router.navigate(['question-entry'], navExtras)
  }

  getGroupedList() {

    // this.chaptersGroupedList = _.chain(this.questions)
    //   .groupBy("chapter.name")
    //   .map((value, key) => ({ chapter: key, questions: value }))
    //   .value()
    // console.log("1", this.chaptersGroupedList)
    this.chaptersGroupedList = []
    this.chaptersGroupedList = _.chain(this.questions)
      .groupBy("chapter.name")
      .map((value, key) => ({ chapter: key, quizzes: _.chain(value).groupBy("quiz.name").map((value, key) => ({ quiz: key, questions: value })).value() }))
      .value()

    // console.log("1", this.chaptersGroupedList)

    // this.quizesGroupedList = _.chain(this.questions)
    //   .groupBy("quiz.name")
    //   .map((value, key) => ({ quiz: key, questions: value }))
    //   .value()

    // console.log("2", this.quizesGroupedList)

  }


  ngOnDestroy() {
    if (!this.sub) return;
    this.sub.unsubscribe();
  }

}
