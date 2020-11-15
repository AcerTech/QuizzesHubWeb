import { Component, EventEmitter, Inject, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { Book, Chapter } from 'src/app/models/interfaces';
import { ChapterService } from 'src/app/services';

declare var $: any;

@Component({
  selector: 'app-chapter',
  templateUrl: './chapter.component.html',
  styleUrls: ['./chapter.component.css']
})
export class ChapterComponent implements OnInit, OnDestroy {
  @Output() notifyChapterAdded: EventEmitter<Chapter> = new EventEmitter<Chapter>();
  @Output() notifyChapterDeleted: EventEmitter<Chapter> = new EventEmitter<Chapter>();
  chapterForm: FormGroup;
  chapter: Chapter;
  errorMsg: string = "";
  successMsg: string = "";
  selectedChapter: Chapter;
  selectedBook: Book;
  sub: Subscription;


  private _selectedChapterForEdit: Chapter;
  get selectedChapterForEdit(): Chapter {
    return this._selectedChapterForEdit;
  }
  @Input() set selectedChapterForEdit(v: Chapter) {
    this._selectedChapterForEdit = v;

    this.refillChapterForm()
  }

  constructor(private fb: FormBuilder,
    private chapterService: ChapterService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit(): void {
    const b = localStorage.getItem('selectedBook');
    if (b) {
      this.selectedBook = JSON.parse(b)
    }

    this.createForm();
  }

  createForm() {
    this.chapterForm = this.fb.group({
      name: [null, [Validators.required]],
      description: '',
      isActive: true,
      displayOrder: '000',
    });
  }

  saveChapter() {
    if (this.selectedChapterForEdit) {
      this.updateChapter();
    } else {
      this.createNewChapter();
    }

  }

  refillChapterForm() {
    if (!this.selectedChapterForEdit) {
      this.createForm();
      return;
    }
    this.chapterForm.controls["name"].patchValue(this.selectedChapterForEdit.name);
    this.chapterForm.controls["description"].patchValue(this.selectedChapterForEdit.description);
    this.chapterForm.controls["isActive"].patchValue(this.selectedChapterForEdit.isActive);
    this.chapterForm.controls["displayOrder"].patchValue(this.selectedChapterForEdit.displayOrder);

  }


  async createNewChapter() {

    const c = {
      name: this.chapterForm.controls['name'].value,
      description: this.chapterForm.controls['description'].value,
      isActive: this.chapterForm.controls['isActive'].value,
      displayOrder: this.chapterForm.controls['displayOrder'].value,
      bookId: this.selectedBook._id
    }
    this.spinner.show();
    this.sub = await this.chapterService.addChapter(c).subscribe(
      (data: Chapter) => {
        this.chapter = data
        this.toastr.success('Chapter title is created !');
      },
      error => {
        this.spinner.hide();
        this.errorMsg = error;
        this.toastr.error(error)
      },
      () => {
        this.notifyChapterAdded.emit(this.chapter)
      }
    )
    this.spinner.hide();
  }

  async updateChapter() {

    const c = {
      name: this.chapterForm.controls['name'].value,
      description: this.chapterForm.controls['description'].value,
      isActive: this.chapterForm.controls['isActive'].value,
      displayOrder: this.chapterForm.controls['displayOrder'].value,
      bookId: this.selectedBook._id
    }
    this.spinner.show();
    this.sub = await this.chapterService.updateChapter(this.selectedChapterForEdit._id, c).subscribe(
      (data: Chapter) => {
        this.toastr.success('Chapter is updated, you may refresh the page');
        this.chapter = data
      },
      error => {
        this.spinner.hide()
        this.errorMsg = error;
        this.toastr.error(error)
      }

    )
    this.spinner.hide()
  }



  async deleteChapter() {
    const confirmDelete = confirm("This will delete all quizzes and questions related to this chapter, Are you sure to delete?");
    if (!confirmDelete) return;
    this.spinner.show()

    this.sub = await this.chapterService.deleteChpater(this.selectedChapterForEdit._id.toString()).subscribe(
      data => {
        this.chapterForm.reset({});
        this.toastr.success("The Chapter and all related Quizzes and Questions been deleted !")
        this.notifyChapterDeleted.emit(this.selectedChapterForEdit)
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
