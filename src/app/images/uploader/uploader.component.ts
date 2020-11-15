import { Component } from '@angular/core';
import { ImagesService } from 'src/app/services';
import { Image } from "../../models/interfaces";
// import {  } from "../../../assets/img";
@Component({
  selector: 'uploader',
  templateUrl: './uploader.component.html',
  styleUrls: ['./uploader.component.scss']
})
export class UploaderComponent {
  isHovering: boolean;
  imagesUrls: string[] = []
  files: File[] = [];
  images: Image[] = []
  errorMsg: string = ""
  imgUrl: string
  tags: string

  constructor(
    private imageService: ImagesService
  ) { }


  toggleHover(event: boolean) {
    this.isHovering = event;
  }

  onDrop(files: FileList) {
    for (let i = 0; i < files.length; i++) {
      this.files.push(files.item(i));
    }
  }

  saveImageInfo() {
    this.imagesUrls.forEach(u => {
      this.saveImage(u)
    });
  }


  saveImage(url: string) {
    // if (!this.imageForm.valid || this.imageForm.get('tags').value == '') {
    //   alert('You may need to enter some tags!')
    //   return;
    // }
    if (!this.tags) {
      this.tags = 'NO NAME'
    }

    const img = {
      _id: '',
      tags: this.tags,
      imgUrl: url
    }

    this.imageService.addImage(img).subscribe(
      (data: Image) => {
      },
      error => {
        this.errorMsg = error;
      },
      () => {
        this.errorMsg = ""
        // alert("Image info has been added!")
      }
    )

  }

  onImageAdded(url) {
    // this.imagesUrls.push(url)
    this.saveImage(url)
    console.log(this.imagesUrls)
  }

  removeUrl(url) {
    const index: number = this.imagesUrls.indexOf(url);
    if (index !== -1) {
      this.imagesUrls.splice(index, 1);
    }
  }


  deleteImage(file, imgUrl) {
    this.removeUrl(imgUrl)
    const index: number = this.files.indexOf(file);
    if (index !== -1) {
      this.files.splice(index, 1);
    }
    this.imageService.deleteImageByUrl(imgUrl).subscribe(
      () => {
      },
      error => {
        this.errorMsg = error;
      },
      () => {
        this.errorMsg = ""
        alert("Image has been deleted!")
      }
    )
  }


}
