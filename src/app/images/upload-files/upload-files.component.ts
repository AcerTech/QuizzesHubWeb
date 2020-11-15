import { Component, OnInit } from '@angular/core';
import { NgxFileDropEntry, FileSystemFileEntry, FileSystemDirectoryEntry } from 'ngx-file-drop';
import { AuthService, ImagesService } from 'src/app/services';
import { Image } from "../../models/interfaces";
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { finalize, tap } from 'rxjs/operators';

@Component({
  selector: 'app-upload-files',
  templateUrl: './upload-files.component.html',
  styleUrls: ['./upload-files.component.css']
})
export class UploadFilesComponent implements OnInit {
  public dropedfiles: NgxFileDropEntry[] = [];
  files: File[] = []
  _files: File[] = []

  errorMsg: string = ""
  imgUrl: string
  tags: string
  imagesUrls: string[] = []

  percentage: Observable<number>;
  snapshot: Observable<any>;
  task: AngularFireUploadTask;
  downloadURL;

  constructor(
    private imageService: ImagesService,
    private storage: AngularFireStorage,
    private db: AngularFirestore,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
  }

  public dropped(files: NgxFileDropEntry[]) {
    this.dropedfiles = files;
    this._files = []
    this.files = []

    for (const droppedFile of files) {

      // Is it a file?
      if (droppedFile.fileEntry.isFile) {
        const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
        fileEntry.file((file: File) => {
          this._files.push(file)
        });
      } else {
        // It was a directory (empty directories are added, otherwise only files)
        const fileEntry = droppedFile.fileEntry as FileSystemDirectoryEntry;
        console.log(droppedFile.relativePath, fileEntry);
      }
    }
  }

  public fileOver(event) {
    // console.log(event);
  }

  public fileLeave(event) {
    // console.log(event);
  }



  saveFilesInfo() {
    this._files.forEach(file => {
      this.files.push(file)
    });
    this._files = []
  }

  onImageDeleted(file, imgUrl) {
    // this.removeUrl(imgUrl)
    const index1: number = this._files.indexOf(file);
    if (index1 !== -1) {
      this._files.splice(index1, 1);
    }

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


  onImageAdded(imgInfo: any) {
    const img = {
      _id: '',
      name: imgInfo.name.toLowerCase(),
      tags: this.tags.toLowerCase(),
      imgUrl: imgInfo.imgUrl,
      userId: this.authService.getCurrentUserId()
    }

    this.imageService.addImage(img).subscribe(
      (data: Image) => {
      },
      error => {
        this.errorMsg = error;
      },
      () => {
        this.errorMsg = "";
      }
    )
  }



}
