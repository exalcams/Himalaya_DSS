import { Component, OnInit, ViewEncapsulation, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-pdf-dialog',
  templateUrl: './pdf-dialog.component.html',
  styleUrls: ['./pdf-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PdfDialogComponent implements OnInit {
  public DSSConfigurationData: any;
  constructor(
    public matDialogRef: MatDialogRef<PdfDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private DSSConfigurationDat: Blob,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit(): void {
    const fileURL = URL.createObjectURL(this.DSSConfigurationDat);
    this.DSSConfigurationData = this.sanitizer.bypassSecurityTrustResourceUrl(fileURL);
    // this.DSSConfigurationData = fileURL;
    // console.log(this.DSSConfigurationData);
  }
  
  CloseClicked(): void {
    this.matDialogRef.close(null);
  }

}
