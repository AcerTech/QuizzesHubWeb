import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Book, Chapter, Question, Quiz } from 'src/app/models/interfaces';
import { QuestionsService } from '../../services/questions.service';
import * as _ from "lodash";
import { NavigationExtras, Router } from '@angular/router';
import { ChapterService } from 'src/app/services';

@Component({
  selector: 'app-question-list',
  templateUrl: './question-list.component.html',
  styleUrls: ['./question-list.component.css']
})
export class QuestionListComponent implements OnInit, OnDestroy {
  // @Output() notifyQuestionSelected: EventEmitter<Question> = new EventEmitter<Question>();
  selectedQuestion: Question
  questions: Question[] = []
  quizes: Quiz[] = []
  errorMsg: any;
  sub: Subscription;
  quizesGroupedList: any[] = []
  selectedChapterId: string;
  chapters: Chapter[] = []
  selectedBook: Book;

  async onChapterChange() {
    await this.getQuestionsForChapter(this.selectedChapterId);
    // localStorage.setItem('questionsList',JSON.stringify(this.questions))
  }



  constructor(
    private questionService: QuestionsService,
    private chapterService: ChapterService,
    private router: Router) { }

  ngOnInit(): void {
    const b = localStorage.getItem('selectedBook');
    if (b) {
      this.selectedBook = JSON.parse(b)
    }
    this.getChapters();
  }

  ngOnDestroy() {
    this.getChapters();
  }

  questionClicked(selectedQuestion) {
    let navExtras: NavigationExtras = {
      state: {
        question: selectedQuestion
      }
    }
    this.router.navigate(['question-entry'], navExtras)
  }

  getChapters() {
    this.sub = this.chapterService.getChapters(this.selectedBook._id).subscribe(
      data => {
        this.chapters = data
      }, (err: any) => {
        this.errorMsg = err
      }
    )
  }
  refresh() {
    if (!this.selectedChapterId) {
      return;
    }
    this.getQuestionsForChapter(this.selectedChapterId);
  }

  // getQuizesByChapterId(chapterId) {
  //   // console.log(chapterId)
  //   this.sub = this.questionService.getQuizesForChapter(chapterId).subscribe(
  //     data => {
  //       this.quizes = data
  //       // console.log(data)
  //     }, (err: any) => {
  //       this.errorMsg = err
  //     }
  //   )
  // }


  getQuestionsForChapter(chapterId) {
    this.sub = this.questionService.getQuestionsByChapterId(chapterId).subscribe(
      data => {
        this.questions = data
      }, (err: any) => {
        this.errorMsg = err
      },
      () => {
        this.getQuizList();
      }
    )
  }


  getQuizList() {

    // this.chaptersGroupedList = _.chain(this.questionsList)
    //   .groupBy("chapter.name")
    //   .map((value, key) => ({ chapter: key, quizes: value }))
    //   .value()
    // console.log("1", this.chaptersGroupedList)

    this.quizesGroupedList = _.chain(this.questions)
      .groupBy("quiz.name")
      .map((value, key) => ({ quiz: key, questions: value }))
      .value()

    // console.log("2", this.quizesGroupedList)

  }




}
