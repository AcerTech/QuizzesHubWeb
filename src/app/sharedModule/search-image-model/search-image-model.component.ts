import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { Subscription } from 'rxjs';
import { Image } from 'src/app/models/interfaces';
import { ImagesService } from 'src/app/services';

@Component({
  selector: 'app-search-image-model',
  templateUrl: './search-image-model.component.html',
  styleUrls: ['./search-image-model.component.css']
})
export class SearchImageModelComponent implements OnInit {
  @Output() notifySelectImage: EventEmitter<string> = new EventEmitter<string>();
  images: Image[] = []
  tags: string = ""
  errorMsg: any
  sub: Subscription

  constructor(private imageService: ImagesService, private storage: AngularFireStorage) { }

  ngOnInit(): void {
    // this.getImages();
  }


  searchImages() {
    this.images = []
    // console.log(this.tags)
    if (!this.tags) {
      return;
    }
    this.sub = this.imageService.searchImagesByTags(this.tags).subscribe(
      data => {
        this.images = data
        console.log(data)
      }, (err: any) => {
        this.errorMsg = err
      }
    )
  }

  // getImages() {

  //   this.sub = this.imageService.getImages().subscribe(
  //     data => {
  //       this.images = data
  //       console.log(data)
  //     }, (err: any) => {
  //       this.errorMsg = err
  //     }
  //   )
  // }

  selectImage(url) {
    this.notifySelectImage.emit(url)
  }

  copyToClipboard(url) {

    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = url;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
  }

}