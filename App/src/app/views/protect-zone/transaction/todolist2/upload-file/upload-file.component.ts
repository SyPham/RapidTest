import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FileInfo, RemovingEventArgs, SelectedEventArgs, UploaderComponent } from '@syncfusion/ej2-angular-inputs';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-upload-file',
  templateUrl: './upload-file.component.html',
  styleUrls: ['./upload-file.component.scss']
})
export class UploadFileComponent implements OnInit {
  @ViewChild('defaultupload')
  public uploadObj: UploaderComponent;
  @Input() data: any;
  @Input() currentTime: any;
  base = environment.apiUrl;
  public allowExtensions: string = '.doc, .docx, .xls, .xlsx, .pdf';
  constructor( public activeModal: NgbActiveModal) { }

  public dropElement: HTMLElement = document.getElementsByClassName('control_wrapper')[0] as HTMLElement;

  public path: Object = {
    saveUrl: ''
};
  ngOnInit() {
    this.path = {
      saveUrl: `${this.base}UploadFile/Save?kpiId=${this.data.id}&uploadTime=${this.currentTime.toLocaleDateString()}`,
      removeUrl: `${this.base}UploadFile/remove?kpiId=${this.data.id}&uploadTime=${this.currentTime.toLocaleDateString()}`

    }
    this.dropElement = document.getElementsByClassName('control_wrapper')[0] as HTMLElement;
    console.log(this.dropElement)
  }
  public onFileRemove(args: RemovingEventArgs): void {
    args.postRawFile = false;
}
beforeUpload(args) {
  console.log(args);
  args.statusText = args.response.statusText;
}
public onSelected(args : SelectedEventArgs) : void {
  args.filesData.splice(5);
  let filesData : FileInfo[] = this.uploadObj.getFilesData();
  let allFiles : FileInfo[] = filesData.concat(args.filesData);
  if (allFiles.length > 5) {
      for (let i : number = 0; i < allFiles.length; i++) {
          if (allFiles.length > 5) {
              allFiles.shift();
          }
      }
      args.filesData = allFiles;
      args.modifiedFilesData = args.filesData;
  }
  args.isModified = true;
}

}
