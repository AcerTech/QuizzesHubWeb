import { Component, OnDestroy, OnInit, QueryList, ViewChildren } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';
import { Book } from 'src/app/models/interfaces';
import { BooksService, AuthService } from 'src/app/services/index';
import { BookComponent } from '../book/book.component';


@Component({
  selector: 'app-my-books',
  templateUrl: './my-books.component.html',
  styleUrls: ['./my-books.component.css']
})
export class MyBooksComponent implements OnInit, OnDestroy {
  myBooks: Book[] = [];
  userInfo: string = "";
  userId: string = "";
  errorMsg: string = "";
  successMsg: string = "";
  modalTitle: string = "";
  selectedBookForEdit: Book;
  sub: Subscription;

  @ViewChildren(BookComponent)
  bookComponent: QueryList<BookComponent>

  resetBookForm() {
    // this.bookComponent.forEach(c => c.bookForm.reset())
    this.bookComponent.forEach(c => c.ngOnInit());
  }

  constructor(private booksService: BooksService,
    private authService: AuthService,
    private spinner: NgxSpinnerService,
    private router: Router) {
    // this.userInfo = JSON.parse(localStorage.getItem("userInfo"));
    this.userId = authService.getCurrentUserId(); // this.userInfo['id']
  }

  ngOnInit(): void {
    this.getMyBooks();
  }

  async getMyBooks() {
    this.spinner.show();
    this.sub = await this.booksService.getMyBooks(this.userId).subscribe(
      data => {
        this.myBooks = data
      }, (err: any) => {
        this.errorMsg = err
      }, () => {
        this.spinner.hide();
      }
    )

  }

  onBookAdded(book) {
    if (this.selectedBookForEdit) {
      this.getMyBooks();
      return;
    }
    this.myBooks.push(book)
  }

  closeModal() {
    this.modalTitle = ""
    this.selectedBookForEdit = null;
    this.resetBookForm();
  }

  onBookEdit(book) {
    this.modalTitle = "Edit Book"
    this.selectedBookForEdit = book;
  }

  addContentClicked(selectedBook) {
    let navExtras: NavigationExtras = {
      state: {
        book: selectedBook
      }
    }
    this.router.navigate(['book-content'], navExtras)
  }


  ngOnDestroy() {
    if (!this.sub) return;
    this.sub.unsubscribe();
  }

}
