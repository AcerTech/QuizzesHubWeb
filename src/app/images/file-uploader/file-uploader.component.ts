import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { finalize, tap } from 'rxjs/operators';
import { AuthService } from 'src/app/services';
import { auth } from 'firebase';

@Component({
  selector: 'app-file-uploader',
  templateUrl: './file-uploader.component.html',
  styleUrls: ['./file-uploader.component.css']
})
export class FileUploaderComponent implements OnInit {
  @Input() file: File;
  @Output() notifyDeleteImage: EventEmitter<string> = new EventEmitter<string>();
  @Output() notifyImageAdded: EventEmitter<any> = new EventEmitter<any>();

  task: AngularFireUploadTask;
  percentage: Observable<number>;
  snapshot: Observable<any>;
  downloadURL;
  userId: string = ""


  constructor(private storage: AngularFireStorage,
    private db: AngularFirestore,
    private authService: AuthService) { }

  ngOnInit(): void {
    this.userId = this.authService.getCurrentUserId()
    this.startUpload();
  }

  startUpload() {

    // The storage path
    const path = `${this.userId}/${Date.now()}_${this.file.name}`;

    // Reference to storage bucket
    const ref = this.storage.ref(path);

    // The main task
    this.task = this.storage.upload(path, this.file);

    // Progress monitoring
    this.percentage = this.task.percentageChanges();

    this.snapshot = this.task.snapshotChanges().pipe(
      // tap(console.log),
      // The file's download URL
      finalize(async () => {
        this.downloadURL = await ref.getDownloadURL().toPromise();
        this.imageAdded({ name: this.file.name, imgUrl: this.downloadURL })
        this.db.collection('files').add({ downloadURL: this.downloadURL, path });
      }),
    );
  }

  imageAdded(imgInfo) {
    this.notifyImageAdded.emit(imgInfo)
  }

  deleteImg(url: string) {
    if (confirm("Are you sure to delete this image?")) {
      this.notifyDeleteImage.emit(url)
      this.storage.storage.refFromURL(url).delete();
    }
  }


  isActive(snapshot) {
    return snapshot.state === 'running' && snapshot.bytesTransferred < snapshot.totalBytes;
  }

  formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }


}
