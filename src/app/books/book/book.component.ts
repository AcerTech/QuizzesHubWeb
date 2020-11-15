import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { Book } from 'src/app/models/interfaces';
import { BooksService } from 'src/app/services';

@Component({
  selector: 'app-book',
  templateUrl: './book.component.html',
  styleUrls: ['./book.component.css']
})
export class BookComponent implements OnInit, OnDestroy {
  @Output() notifyBookAdded: EventEmitter<Book> = new EventEmitter<Book>();
  @Output() notifyBookDeleted: EventEmitter<Book> = new EventEmitter<Book>();
  bookForm: FormGroup;
  book: Book;
  sub: Subscription;
  selectedImgUrl: string = '';
  errorMessage: any;

  _selectedBook: Book;
  @Input() set selectedBook(value: Book) {
    this._selectedBook = value;
    if (!value) {
      this.createForm();//reset form
      return;
    }
    this.refillBookForm();
  }

  get selectedBook(): Book {
    return this._selectedBook;
  }

  constructor(
    private bookService: BooksService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private fb: FormBuilder) {
  }

  ngOnInit(): void {
    this.createForm();
  }

  createForm() {
    this.bookForm = this.fb.group({
      title: [null, [Validators.required]],
      description: '',
      isActive: true,
      tags: '',
      imgUrl: ''
    });
  }

  onSelectImage(imgUrl) {
    this.selectedImgUrl = imgUrl
    this.bookForm.controls['imgUrl'].setValue(imgUrl);
  }

  saveBook() {
    if (this.selectedBook) {
      this.updateBook();
    } else {
      this.createNewBook();
    }
  }


  refillBookForm() {
    this.bookForm.controls["title"].patchValue(this.selectedBook.title);
    this.bookForm.controls["description"].patchValue(this.selectedBook.description);
    this.bookForm.controls["tags"].patchValue(this.selectedBook.tags);
    this.bookForm.controls["isActive"].patchValue(this.selectedBook.isActive);
    this.bookForm.controls["imgUrl"].patchValue(this.selectedBook.imgUrl);
  }

  async createNewBook() {
    this.spinner.show();
    this.sub = await this.bookService.addBook(this.bookForm.value).subscribe(
      (data: Book) => {
        this.toastr.success('New Book been added !')
        this.book = data
      },
      error => {
        this.spinner.hide();
        this.toastr.error(error)
        this.errorMessage = error;
      },
      () => {
        this.notifyBookAdded.emit(this.bookForm.value)
        this.spinner.hide();
        // alert("Book has been added!")
      }
    )
  }

 async updateBook() {
    this.spinner.show();
 this.sub=await   this.bookService.updateBook(this.selectedBook._id, this.bookForm.value).subscribe(
      (data: Book) => {
        this.toastr.success('Book been updated !')
        this.book = data
      },
      error => {
        this.spinner.hide();
        this.toastr.error(error)
        this.errorMessage = error;
      },
      () => {
        this.notifyBookAdded.emit(this.bookForm.value)
        this.spinner.hide();
        // alert("Book has been added!")
      }
    )

  }


async  deleteBook() {
  const confirmDelete = confirm("This will delete all related Chapters, Quizzes and questions, Are you sure to delete?");
    if (!confirmDelete) return;
    this.spinner.show()

    this.sub = await this.bookService.deleteBook(this.selectedBook._id.toString()).subscribe(
      data => {
        this.spinner.hide()
        this.bookForm.reset({});
        this.toastr.success("The Book and all related Chapters Quizzes and Questions are deleted !")
        this.notifyBookDeleted.emit(this.selectedBook)
      }, (err: any) => {
        this.errorMessage = err
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
