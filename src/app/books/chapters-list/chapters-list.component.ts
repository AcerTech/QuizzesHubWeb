import { Component, Input, OnInit } from '@angular/core';
import { Book, Chapter, Quiz } from 'src/app/models/interfaces';
import { ChapterService, QuizzesService } from 'src/app/services';

@Component({
  selector: 'app-chapters-list',
  templateUrl: './chapters-list.component.html',
  styleUrls: ['./chapters-list.component.css']
})
export class ChaptersListComponent implements OnInit {
  chapters: Chapter[] = [];
  quizzes: Quiz[] = [];

  errorMsg: string = ""
  selectedBook: Book;
  selectedChapter: Chapter;

  // private _bookId: string;
  // @Input() set bookId(value: string) {
  //   this._bookId = value;
  //   if (!value) {
  //     this.chapters = []
  //     return;
  //   }
  //   this.getBookChapters();
  // }

  // get bookId(): string {
  //   return this._bookId;
  // }

  constructor(private chapterService: ChapterService, private quizService: QuizzesService) { }

  ngOnInit(): void {
    const b = localStorage.getItem('selectedBook');
    if (b) {
      this.selectedBook = JSON.parse(b)
      console.log(b)
    }
    this.getBookChapters();
  }

  getBookChapters() {
    this.chapters = []
    this.chapterService.getChapters(this.selectedBook._id).subscribe(
      data => {
        this.chapters = data

      }, (err: any) => {
        this.errorMsg = err
      }
    )
  }

  getBookQuizzes() {
    this.chapterService.getChapters(this.selectedBook._id).subscribe(
      data => {
        this.chapters = data
      }, (err: any) => {
        this.errorMsg = err
      }
    )
  }

  onQuizClicked(c) {
    this.selectedChapter = c;
  }

  onQuizAdded(quiz) {
    this.quizzes.push(quiz)
  }


  // getQuizList() {

  //   // this.chaptersGroupedList = _.chain(this.questionsList)
  //   //   .groupBy("chapter.name")
  //   //   .map((value, key) => ({ chapter: key, quizes: value }))
  //   //   .value()
  //   // console.log("1", this.chaptersGroupedList)

  //   this.quizesGroupedList = _.chain(this.questions)
  //     .groupBy("quiz.name")
  //     .map((value, key) => ({ quiz: key, questions: value }))
  //     .value()

  //   // console.log("2", this.quizesGroupedList)

  // }
}
