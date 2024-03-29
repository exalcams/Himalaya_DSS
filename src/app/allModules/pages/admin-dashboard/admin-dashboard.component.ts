import { Component, OnInit, ViewEncapsulation, ViewChild, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { MatPaginator, MatSort, MatTableDataSource, MatDialog, MatDialogConfig, MatSnackBar } from '@angular/material';
import { fuseAnimations } from '@fuse/animations';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DSSInvoice, FilterClass, DSSConfiguration, DSSStatusCount, ErrorInvoice } from 'app/models/dss';
import { DatePipe } from '@angular/common';
import { saveAs } from 'file-saver';
import { NotificationDialogComponent } from 'app/notifications/notification-dialog/notification-dialog.component';
import { NotificationSnackBarComponent } from 'app/notifications/notification-snack-bar/notification-snack-bar.component';
import { SnackBarStatus } from 'app/notifications/notification-snack-bar/notification-snackbar-status-enum';
import { AuthenticationDetails, OutputTypeView, DocumentTypeView, PlantView, DocumentOutputTypeMapView, UserPlantMapView } from 'app/models/master';
import { Router } from '@angular/router';
import { DashboardService } from 'app/services/dashboard.service';
import { PdfDialogComponent } from '../pdf-dialog/pdf-dialog.component';
import { DialogComponent } from '../dialog/dialog.component';
import { MasterService } from 'app/services/master.service';
import { ExcelService } from 'app/services/excel.service';
import { environment } from 'environments/environment';

@Component({
  selector: 'adminDashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class AdminDashboardComponent implements OnInit, OnDestroy {
  authenticationDetails: AuthenticationDetails;
  public reports: any;
  public expiredata: any;
  public errordata: any;
  public Configdata: any;
  MenuItems: string[];
  DSSStatusCount: DSSStatusCount = new DSSStatusCount();
  AllSignedDocument: DSSInvoice[] = [];
  AllConfigurations: DSSConfiguration[] = [];
  AllExpiredCertificates: DSSConfiguration[] = [];
  AllErrorDocuments: ErrorInvoice[] = [];
  // AllDocumentTypeNames: string[];
  AllPlants: PlantView[] = [];
  AllDocumentTypes: DocumentTypeView[] = [];
  AllOutputTypes: OutputTypeView[] = [];
  AllFilteredOutputTypes: OutputTypeView[] = [];
  AllDocumentOutputTypeMapView: DocumentOutputTypeMapView[] = [];
  AllUsers: string[] = [];
  AllFilteredUsers: string[] = [];
  AllUserPlantMapViews: UserPlantMapView[] = [];
  documentFormGroup: FormGroup;
  getDocument: FilterClass;
  isDateError: boolean;
  isInvoiceError: boolean;

  dialogRef: any;

  SignDocumentsDataSource: MatTableDataSource<DSSInvoice>;
  ConfigurationsDataSource: MatTableDataSource<DSSConfiguration>;
  ExpiredCertificatesDataSource: MatTableDataSource<DSSConfiguration>;
  ErrorDocumentsDataSource: MatTableDataSource<ErrorInvoice>;
  SignDocumentsColumns: string[] = ['INV_NAME', 'Plant_ID', 'DocumentType_ID', 'OutputType_ID', 'SIGNED_AUTHORITY', 'SIGNED_ON', 'View', 'Download'];
  // tslint:disable-next-line:max-line-length
  ConfigurationsColumns: string[] = ['Plant_ID', 'CERT_NAME', 'PRIORITY1_USER', 'PRIORITY2_USER', 'PRIORITY3_USER', 'PRIORITY4_USER', 'PRIORITY5_USER', 'DISPLAYTITLE2', 'CREATED_ON', 'Edit', 'Delete'];
  // tslint:disable-next-line:max-line-length
  ExpiredCertificatesColumns: string[] = ['Plant_ID', 'CERT_NAME', 'PRIORITY1_USER', 'PRIORITY2_USER', 'PRIORITY3_USER', 'PRIORITY4_USER', 'PRIORITY5_USER', 'DISPLAYTITLE2', 'CERT_EX_DT', 'Edit', 'Delete'];
  ErrorDocumentsColumns: string[] = ['INV_NAME', 'Plant_ID', 'DocumentType_ID', 'OutputType_ID', 'CREATED_ON', 'Comment', 'View', 'Download'];

  @ViewChild(MatPaginator) SignDocumentsPaginator: MatPaginator;
  @ViewChild(MatPaginator) ConfigurationsPaginator: MatPaginator;
  @ViewChild(MatPaginator) ExpiredCertificatesPaginator: MatPaginator;
  @ViewChild(MatPaginator) ErrorDocumentsPaginator: MatPaginator;

  @ViewChild(MatSort) SignDocumentsSort: MatSort;
  @ViewChild(MatSort) ConfigurationsSort: MatSort;
  @ViewChild(MatSort) ExpiredCertificatesSort: MatSort;
  @ViewChild(MatSort) ErrorDocumentsSort: MatSort;

  // @ViewChild('SignDocumentsTable') SignDocumentsTable: ElementRef;
  // @ViewChild('ConfigurationsTable') ConfigurationsTable: ElementRef;
  // @ViewChild('ExpiredCertificatesTable') ExpiredCertificatesTable: ElementRef;
  // @ViewChild('ErrorDocumentsTable') ErrorDocumentsTable: ElementRef;

  public tab1: boolean;
  public tab2: boolean;
  public tab3: boolean;
  public tab4: boolean;
  IsProgressBarVisibile: boolean;
  IsDSSStatusCountCompleted: boolean;
  IsAllSignedDocumentCompleted: boolean;
  AllPlantCompleted: boolean;
  AllDocumentTypeNameCompleted: boolean;
  AllOutputTypeNameCompleted: boolean;
  notificationSnackBarComponent: NotificationSnackBarComponent;
  // Private
  private _unsubscribeAll: Subject<any>;

  Today: Date = new Date();
  BackupDays: number = environment.backupDays;


  constructor(public _matDialog: MatDialog,
    public dashboardService: DashboardService,
    public masterService: MasterService,
    public excelService: ExcelService,
    private _formBuilder: FormBuilder,
    private datePipe: DatePipe,
    private dialog: MatDialog,
    public snackBar: MatSnackBar,
    private _router: Router) {
    this.tab1 = true;
    this.tab2 = false;
    this.tab3 = false;
    this.tab4 = false;
    this.documentFormGroup = this._formBuilder.group({
      FromInvoice: ['', Validators.pattern("^\d+$")],
      ToInvoice: ['', Validators.pattern("^\d+$")],
      PlantID: [''],
      DocumentTypeID: [''],
      OutputTypeID: [''],
      Authority: [''],
      FromDate: [new Date(this.Today.getFullYear(), this.Today.getMonth(), this.Today.getDate() - this.BackupDays)],
      ToDate: [this.Today]
    });
    this.authenticationDetails = new AuthenticationDetails();
    this.IsProgressBarVisibile = true;
    this.IsDSSStatusCountCompleted = false;
    this.IsAllSignedDocumentCompleted = true;
    this.AllPlantCompleted = false;
    this.AllDocumentTypeNameCompleted = false;
    this.AllOutputTypeNameCompleted = false;
    this.notificationSnackBarComponent = new NotificationSnackBarComponent(this.snackBar);
    this.isDateError = false;
    this.isInvoiceError = false;
    this._unsubscribeAll = new Subject();

  }

  ngOnInit(): void {
    // Retrive authorizationData
    const retrievedObject = localStorage.getItem('authorizationData');
    if (retrievedObject) {
      this.authenticationDetails = JSON.parse(retrievedObject) as AuthenticationDetails;
      this.MenuItems = this.authenticationDetails.menuItemNames.split(',');
      if (this.MenuItems.indexOf('AdminDashboard') < 0) {
        this.notificationSnackBarComponent.openSnackBar('You do not have permission to visit this page', SnackBarStatus.danger);
        this._router.navigate(['/auth/login']);
      } else {
        this.GetDSSStatusCounts();
        // this.GetAllSignedDocument();
        // this.GetAllDocumentTypeNames();
        this.GetAllPlants();
        this.GetAllDocumentTypes();
        this.GetAllOutputTypes();
        this.GetAllDocumentOutputTypeMapViews();
        this.GetAllNormalUsers();
        this.GetAllUserPlantMapViews();
        this.GetAllInvoicesBasedOnDate();
      }
    } else {
      this._router.navigate(['/auth/login']);
    }
  }
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();

  }
  tabone(): void {
    this.tab1 = true;
    this.tab2 = false;
    this.tab3 = false;
    this.tab4 = false;
    this.GetAllInvoicesBasedOnDate();
    this.ResetControl();
  }
  tabtwo(): void {
    this.tab1 = false;
    this.tab2 = true;
    this.tab3 = false;
    this.tab4 = false;
    this.GetAllConfigurations();
    this.ResetControl();
  }
  tabthree(): void {
    this.tab1 = false;
    this.tab2 = false;
    this.tab3 = true;
    this.tab4 = false;
    this.GetAllExpiredCertificates();
    this.ResetControl();
  }
  tabfour(): void {
    this.tab1 = false;
    this.tab2 = false;
    this.tab3 = false;
    this.tab4 = true;
    this.GetAllErrorDocuments();
    this.ResetControl();
  }

  ResetControl(): void {
    this.getDocument = new FilterClass();
    this.documentFormGroup.reset();
    Object.keys(this.documentFormGroup.controls).forEach(key => {
      this.documentFormGroup.get(key).markAsUntouched();
    });
    this.documentFormGroup.patchValue({
      FromDate: new Date(this.Today.getFullYear(), this.Today.getMonth(), this.Today.getDate() - this.BackupDays),
      ToDate: this.Today
    });
    this.AllFilteredOutputTypes = this.AllOutputTypes;
    this.AllFilteredUsers = this.AllUsers;
  }

  // For Administrator

  GetDSSStatusCounts(): void {
    this.dashboardService.GetDSSStatusCounts().subscribe((data) => {
      if (data) {
        this.DSSStatusCount = data as DSSStatusCount;
      }
      this.IsDSSStatusCountCompleted = true;
    }, (error) => {
      console.error(error);
      this.IsDSSStatusCountCompleted = true;
    });
  }

  GetAllSignedDocument(): void {
    this.IsProgressBarVisibile = true;
    this.dashboardService
      .GetAllSignedDocument()
      .subscribe((data) => {
        if (data) {
          this.AllSignedDocument = <DSSInvoice[]>data;
          this.SignDocumentsDataSource = new MatTableDataSource(this.AllSignedDocument);
          this.SignDocumentsDataSource.paginator = this.SignDocumentsPaginator;
          this.SignDocumentsDataSource.sort = this.SignDocumentsSort;
          // this.DSSStatusCount.SignedDocumnentCount = this.AllSignedDocument.length;
        }
        this.IsAllSignedDocumentCompleted = true;
        this.IsProgressBarVisibile = false;
      },
        (err) => {
          console.error(err);
          this.IsAllSignedDocumentCompleted = true;
          this.IsProgressBarVisibile = false;
        });
  }

  GetAllConfigurations(): void {
    this.IsProgressBarVisibile = true;
    this.dashboardService
      .GetAllConfigurations()
      .subscribe((data) => {
        if (data) {
          this.AllConfigurations = <DSSConfiguration[]>data;
          this.ConfigurationsDataSource = new MatTableDataSource(this.AllConfigurations);
          this.ConfigurationsDataSource.paginator = this.ConfigurationsPaginator;
          this.ConfigurationsDataSource.sort = this.ConfigurationsSort;
          this.DSSStatusCount.ConfigurationCount = this.AllConfigurations.length;
        }
        this.IsProgressBarVisibile = false;
      },
        (err) => {
          console.error(err);
          this.IsProgressBarVisibile = false;
        });
  }

  GetAllExpiredCertificates(): void {
    this.IsProgressBarVisibile = true;
    this.dashboardService
      .GetAllExpiredCertificates()
      .subscribe((data) => {
        if (data) {
          this.AllExpiredCertificates = <DSSConfiguration[]>data;
          this.ExpiredCertificatesDataSource = new MatTableDataSource(this.AllExpiredCertificates);
          this.ExpiredCertificatesDataSource.paginator = this.ExpiredCertificatesPaginator;
          this.ExpiredCertificatesDataSource.sort = this.ExpiredCertificatesSort;
          this.DSSStatusCount.ExpiryCerificateCount = this.AllExpiredCertificates.length;
        }
        this.IsProgressBarVisibile = false;
      },
        (err) => {
          console.error(err);
          this.IsProgressBarVisibile = false;
        });
  }
  GetAllErrorDocuments(): void {
    this.IsProgressBarVisibile = true;
    this.dashboardService
      .GetAllErrorDocuments()
      .subscribe((data) => {
        if (data) {
          this.AllErrorDocuments = <ErrorInvoice[]>data;
          this.ErrorDocumentsDataSource = new MatTableDataSource(this.AllErrorDocuments);
          this.ErrorDocumentsDataSource.paginator = this.ErrorDocumentsPaginator;
          this.ErrorDocumentsDataSource.sort = this.ErrorDocumentsSort;
          this.DSSStatusCount.ErrorDocumentCount = this.AllErrorDocuments.length;
        }
        this.IsProgressBarVisibile = false;
      },
        (err) => {
          console.error(err);
          this.IsProgressBarVisibile = false;
        });
  }

  // GetAllDocumentTypeNames(): void {
  //   this.masterService.GetAllDocumentTypeNames().subscribe((data) => {
  //     if (data) {
  //       this.AllDocumentTypeNames = <string[]>data;
  //     }
  //     this.AllDocumentTypeNameCompleted = true;
  //   },
  //     (err) => {
  //       console.log(err);
  //       this.AllDocumentTypeNameCompleted = true;
  //     });
  // }
  GetAllPlants(): void {
    this.masterService.GetAllPlantViews().subscribe(
      (data) => {
        this.AllPlants = <PlantView[]>data;
        // console.log(this.AllMenuApps);
        this.AllPlantCompleted = true;
      },
      (err) => {
        console.error(err);
        this.AllPlantCompleted = true;
      }
    );
  }
  GetAllDocumentTypes(): void {
    this.masterService.GetAllDocumentTypeViews().subscribe(
      (data) => {
        this.AllDocumentTypes = <DocumentTypeView[]>data;
        // console.log(this.AllMenuApps);
        this.AllDocumentTypeNameCompleted = true;
      },
      (err) => {
        console.error(err);
        this.AllDocumentTypeNameCompleted = true;
      }
    );
  }
  GetAllOutputTypes(): void {
    this.masterService.GetAllOutputTypeViews().subscribe((data) => {
      if (data) {
        this.AllOutputTypes = data as OutputTypeView[];
        this.AllFilteredOutputTypes = data as OutputTypeView[];
        // console.log(this.AllOutputTypes);
      }
      this.AllOutputTypeNameCompleted = true;
    },
      (err) => {
        console.error(err);
        this.AllOutputTypeNameCompleted = true;
      });
  }
  GetAllDocumentOutputTypeMapViews(): void {
    this.masterService.GetAllDocumentOutputTypeMapViews().subscribe((data) => {
      if (data) {
        this.AllDocumentOutputTypeMapView = data as DocumentOutputTypeMapView[];
        // console.log(this.AllOutputTypes);
      }
      this.AllOutputTypeNameCompleted = true;
    },
      (err) => {
        console.error(err);
        this.AllOutputTypeNameCompleted = true;
      });
  }
  PlantSelected(event): void {
    // console.log(event.value);
    if (event.value) {
      const UserNameList = this.AllUserPlantMapViews.filter(x => x.Plant_ID === event.value);
      this.AllFilteredUsers = this.AllUsers.filter(x => UserNameList.some((y) => x === y.UserName));
      const aut = this.documentFormGroup.get('Authority').value;
      if (aut) {
        const res = this.AllFilteredUsers.filter(x => x === aut)[0];
        if (!res) {
          this.documentFormGroup.get('Authority').patchValue('');
        }
      }
    } else {
      this.AllFilteredUsers = this.AllUsers;
    }
  }
  DocumentTypeIDSelected(event): void {
    // console.log(event.value);
    if (event.value) {
      const OutputIDList = this.AllDocumentOutputTypeMapView.filter(x => x.DocumentType_ID === event.value);
      this.AllFilteredOutputTypes = this.AllOutputTypes.filter(x => OutputIDList.some((y) => x.OutputType_ID === y.OutputType_ID));
      const outp = this.documentFormGroup.get('OutputTypeID').value;
      if (outp) {
        const res = this.AllFilteredOutputTypes.filter(x => x.OutputType_ID === outp)[0];
        if (!res) {
          this.documentFormGroup.get('OutputTypeID').patchValue('');
        }
      }
    } else {
      this.AllFilteredOutputTypes = this.AllOutputTypes;
    }
  }
  GetAllNormalUsers(): void {
    this.masterService.GetAllNormalUsers().subscribe((data) => {
      if (data) {
        this.AllUsers = data as string[];
        this.AllFilteredUsers = data as string[];
        // console.log(this.AllOutputTypes);
      }
      // this.AllOutputTypeNameCompleted = true;
    },
      (err) => {
        console.error(err);
        // this.AllOutputTypeNameCompleted = true;
      });
  }
  GetAllUserPlantMapViews(): void {
    this.masterService.GetAllUserPlantMapViews().subscribe((data) => {
      if (data) {
        this.AllUserPlantMapViews = data as UserPlantMapView[];
        // console.log(this.AllOutputTypes);
      }
      // this.AllOutputTypeNameCompleted = true;
    },
      (err) => {
        console.error(err);
        // this.AllOutputTypeNameCompleted = true;
      });
  }
  InvoiceKeyUp(): void {
    // console.log('Called');
    const FromInvoice = this.documentFormGroup.get('FromInvoice').value;
    const ToInvoice = this.documentFormGroup.get('ToInvoice').value;
    if (FromInvoice && ToInvoice) {
      const FromInvoiceValue = +FromInvoice;
      const ToInvoiceValue = +ToInvoice;
      if (FromInvoiceValue > ToInvoiceValue) {
        this.isInvoiceError = true;
      } else {
        this.isInvoiceError = false;
      }
    } else {
      this.isInvoiceError = false;
    }

  }

  DateSelected(): void {
    // console.log('Called');
    const FROMDATEVAL = this.documentFormGroup.get('FromDate').value as Date;
    const TODATEVAL = this.documentFormGroup.get('ToDate').value as Date;
    if (FROMDATEVAL && TODATEVAL && FROMDATEVAL > TODATEVAL) {
      this.isDateError = true;
    } else {
      this.isDateError = false;
    }
  }
  onKeydown(event): boolean {
    // console.log(event.key);
    if (event.key === 'Backspace' || event.key === 'Delete') {
      return true;
    } else {
      return false;
    }
  }

  GetAllInvoicesBasedOnDate(): void {
    if (this.documentFormGroup.valid) {
      if (!this.isDateError && !this.isInvoiceError) {
        this.IsProgressBarVisibile = true;
        this.getDocument = new FilterClass();
        const FI = this.documentFormGroup.get('FromInvoice').value;
        if (FI) {
          this.getDocument.FromInvoice = +FI;
        } else {
          this.getDocument.FromInvoice = 0;
        }
        const TI = this.documentFormGroup.get('ToInvoice').value;
        if (TI) {
          this.getDocument.ToInvoice = +TI;
        } else {
          this.getDocument.ToInvoice = 0;
        }
        this.getDocument.Plant_ID = this.documentFormGroup.get('PlantID').value;
        this.getDocument.DocumentType_ID = this.documentFormGroup.get('DocumentTypeID').value;
        this.getDocument.OutputType_ID = this.documentFormGroup.get('OutputTypeID').value;
        this.getDocument.Authority = this.documentFormGroup.get('Authority').value;
        this.getDocument.FromDate = this.datePipe.transform(this.documentFormGroup.get('FromDate').value as Date, 'yyyy-MM-dd');
        this.getDocument.ToDate = this.datePipe.transform(this.documentFormGroup.get('ToDate').value as Date, 'yyyy-MM-dd');
        // this.getDocument.FromDate = this.documentFormGroup.get('FromDate').value;
        // this.getDocument.ToDate = this.documentFormGroup.get('ToDate').value;
        this.dashboardService.GetAllInvoicesBasedOnDate(this.getDocument)
          .subscribe((data) => {
            if (data) {
              this.AllSignedDocument = <DSSInvoice[]>data;
              this.SignDocumentsDataSource = new MatTableDataSource(this.AllSignedDocument);
              this.SignDocumentsDataSource.paginator = this.SignDocumentsPaginator;
              this.SignDocumentsDataSource.sort = this.SignDocumentsSort;
            }
            this.IsProgressBarVisibile = false;
          },
            (err) => {
              console.error(err);
              this.IsProgressBarVisibile = false;
              this.notificationSnackBarComponent.openSnackBar(err instanceof Object ? 'Something went wrong' : err, SnackBarStatus.danger);
            });
      }

    }
    Object.keys(this.documentFormGroup.controls).forEach(key => {
      this.documentFormGroup.get(key).markAsTouched();
      this.documentFormGroup.get(key).markAsDirty();
    });
  }
  DowloandPdfFromID(ID: number, fileName: string): void {
    this.IsProgressBarVisibile = true;
    this.dashboardService.DowloandPdfFromID(ID).subscribe(
      data => {
        if (data) {
          const BlobFile = data as Blob;
          saveAs(BlobFile, fileName);
        }
        this.IsProgressBarVisibile = false;
      },
      error => {
        console.error(error);
        this.IsProgressBarVisibile = false;
      }
    );
  }


  ViewPdfFromID(ID: number): void {
    this.IsProgressBarVisibile = true;
    this.dashboardService.DowloandPdfFromID(ID).subscribe(
      data => {
        if (data) {
          const file = new Blob([data], { type: 'application/pdf' });
          // const fileURL = URL.createObjectURL(file);
          // window.open(fileURL);
          const dialogConfig: MatDialogConfig = {
            data: file,
            panelClass: 'pdf-dialog'
          };
          const dialogRef = this.dialog.open(PdfDialogComponent, dialogConfig);
          dialogRef.afterClosed().subscribe(
            result => {
              if (result) {
              }
            });
        }
        this.IsProgressBarVisibile = false;
      },
      error => {
        console.error(error);
        this.IsProgressBarVisibile = false;
      }
    );
  }

  AddConfigurations(): void {
    const dialogConfig: MatDialogConfig = {
      data: null,
      panelClass: 'config-dialog'
    };
    const dialogRef = this.dialog.open(DialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(
      result => {
        if (result) {
          const DSSConfig = result as DSSConfiguration;
          DSSConfig.CREATED_BY = this.authenticationDetails.userName;
          this.IsProgressBarVisibile = true;
          this.dashboardService.CreateConfiguration(DSSConfig).subscribe(
            () => {
              this.IsProgressBarVisibile = false;
              this.notificationSnackBarComponent.openSnackBar('Configuration created successfully', SnackBarStatus.success);
              this.GetAllConfigurations();
            },
            (err) => {
              this.IsProgressBarVisibile = false;
              this.notificationSnackBarComponent.openSnackBar(err instanceof Object ? 'Something went wrong' : err, SnackBarStatus.danger);
              console.error(err);
            }
          );
        }
      });
  }

  UpdateConfiguration(DSSConfigurationData: DSSConfiguration): void {
    // console.log(DSSConfigurationData);
    const dialogConfig: MatDialogConfig = {
      data: DSSConfigurationData,
      panelClass: 'config-dialog'
    };
    const dialogRef = this.dialog.open(DialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(
      result => {
        if (result) {
          const DSSConfig = result as DSSConfiguration;
          DSSConfig.LASTMODIFIED_BY = this.authenticationDetails.userName;
          this.IsProgressBarVisibile = true;
          this.dashboardService.UpdateConfiguration(DSSConfig).subscribe(
            () => {
              this.IsProgressBarVisibile = false;
              this.notificationSnackBarComponent.openSnackBar('Configuration updated successfully', SnackBarStatus.success);
              this.GetAllConfigurations();
            },
            (err) => {
              this.IsProgressBarVisibile = false;
              this.notificationSnackBarComponent.openSnackBar(err instanceof Object ? 'Something went wrong' : err, SnackBarStatus.danger);
              console.error(err);
            }
          );
        }
      });
  }


  DeleteConfiguration(DSSConfig: DSSConfiguration): void {
    const dialogConfig: MatDialogConfig = {
      data: {
        Actiontype: 'Delete',
        Catagory: 'Configuration'
      },
      panelClass: 'confirmation-dialog'
    };
    const dialogRef = this.dialog.open(NotificationDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(
      result => {
        if (result) {
          this.IsProgressBarVisibile = true;
          DSSConfig.LASTMODIFIED_BY = this.authenticationDetails.userName;
          this.dashboardService.DeleteConfiguration(DSSConfig).subscribe(
            () => {
              this.IsProgressBarVisibile = false;
              this.notificationSnackBarComponent.openSnackBar('Configuration deleted successfully', SnackBarStatus.success);
              this.GetAllConfigurations();
            },
            (err) => {
              this.IsProgressBarVisibile = false;
              this.notificationSnackBarComponent.openSnackBar(err instanceof Object ? 'Something went wrong' : err, SnackBarStatus.danger);
              console.error(err);
            }
          );
        }
      });
  }

  applyFilter(filterValue: string): void {
    this.SignDocumentsDataSource.filter = filterValue.trim().toLowerCase();

    if (this.SignDocumentsDataSource.paginator) {
      this.SignDocumentsDataSource.paginator.firstPage();
    }

  }
  applyFilterExp(filterValue: string): void {
    this.ExpiredCertificatesDataSource.filter = filterValue.trim().toLowerCase();

    if (this.ExpiredCertificatesDataSource.paginator) {
      this.ExpiredCertificatesDataSource.paginator.firstPage();
    }

  }
  applyFilterError(filterValue: string): void {
    this.ErrorDocumentsDataSource.filter = filterValue.trim().toLowerCase();

    if (this.ErrorDocumentsDataSource.paginator) {
      this.ErrorDocumentsDataSource.paginator.firstPage();
    }

  }
  applyFilterConfig(filterValue: string): void {
    this.ConfigurationsDataSource.filter = filterValue.trim().toLowerCase();

    if (this.ConfigurationsDataSource.paginator) {
      this.ConfigurationsDataSource.paginator.firstPage();
    }

  }

  ExportSignDocumentsToExcel(): void {
    const startIndex: number = this.SignDocumentsPaginator.pageSize * this.SignDocumentsPaginator.pageIndex;
    const endIndex: number = this.SignDocumentsPaginator.pageSize + startIndex;
    let array: DSSInvoice[] = [];
    const ExcelArray: any[] = [];
    if (this.SignDocumentsDataSource.filteredData.length) {
      array = this.SignDocumentsDataSource.filteredData;
    } else {
      array = this.SignDocumentsDataSource.data;
    }
    const itemsShowed1 = array.slice(startIndex, endIndex);
    itemsShowed1.forEach(x => {
      ExcelArray.push(
        {
          'Invoice Number': x.INV_NAME, 'Plant': x.Plant_ID, 'Document type': x.DocumentType_ID,
          'Output type': x.OutputType_ID, 'Signed Authority': x.SIGNED_AUTHORITY,
          'Signed on': this.datePipe.transform(x.SIGNED_ON, 'dd-MM-yyyy hh:mm:ss a')
        });
    });
    if (ExcelArray.length > 0) {
      this.excelService.exportAsExcelFile(ExcelArray, 'SignDocuments');
    } else {
      this.notificationSnackBarComponent.openSnackBar('No records found', SnackBarStatus.warning);
    }
    // const itemsShowed1 = this.SignDocumentsTable.nativeElement;
    // this.excelService.exportTableToExcel(itemsShowed1, 'SignDocuments');
  }

  ExportConfigurationsToExcel(): void {
    const startIndex: number = this.ConfigurationsPaginator.pageSize * this.ConfigurationsPaginator.pageIndex;
    const endIndex: number = this.ConfigurationsPaginator.pageSize + startIndex;
    let array: DSSConfiguration[] = [];
    const ExcelArray: any[] = [];
    if (this.ConfigurationsDataSource.filteredData.length) {
      array = this.ConfigurationsDataSource.filteredData;
    } else {
      array = this.ConfigurationsDataSource.data;
    }
    const itemsShowed1 = array.slice(startIndex, endIndex);
    itemsShowed1.forEach(x => {
      ExcelArray.push(
        {
          'Plant': x.Plant_ID, 'Certificate name': x.CERT_NAME, 'Priority 1 user': x.PRIORITY1_USER, 'Priority 2 user': x.PRIORITY2_USER,
          'Priority 3 user': x.PRIORITY3_USER, 'Priority 4 user': x.PRIORITY4_USER, 'Priority 5 user': x.PRIORITY5_USER,
          'Title 2': x.DISPLAYTITLE2, 'Created on': this.datePipe.transform(x.CREATED_ON, 'dd-MM-yyyy hh:mm:ss a')
        });
    });
    if (ExcelArray.length > 0) {
      this.excelService.exportAsExcelFile(ExcelArray, 'Configurations');
    } else {
      this.notificationSnackBarComponent.openSnackBar('No records found', SnackBarStatus.warning);
    }
    // const itemsShowed1 = this.ConfigurationsTable.nativeElement;
    // this.excelService.exportTableToExcel(itemsShowed1, 'Configurations');
  }

  ExportExpiredCertificatesToExcel(): void {
    const startIndex: number = this.ExpiredCertificatesPaginator.pageSize * this.ExpiredCertificatesPaginator.pageIndex;
    const endIndex: number = this.ExpiredCertificatesPaginator.pageSize + startIndex;
    let array: DSSConfiguration[] = [];
    const ExcelArray: any[] = [];
    if (this.ExpiredCertificatesDataSource.filteredData.length) {
      array = this.ExpiredCertificatesDataSource.filteredData;
    } else {
      array = this.ExpiredCertificatesDataSource.data;
    }
    const itemsShowed1 = array.slice(startIndex, endIndex);
    itemsShowed1.forEach(x => {
      ExcelArray.push(
        {
          'Plant': x.Plant_ID, 'Certificate name': x.CERT_NAME, 'Priority 1 user': x.PRIORITY1_USER, 'Priority 2 user': x.PRIORITY2_USER,
          'Priority 3 user': x.PRIORITY3_USER, 'Priority 4 user': x.PRIORITY4_USER, 'Priority 5 user': x.PRIORITY5_USER,
          'Title 2': x.DISPLAYTITLE2, 'Expired on': this.datePipe.transform(x.CERT_EX_DT, 'dd-MM-yyyy hh:mm:ss a')
        });
    });
    if (ExcelArray.length > 0) {
      this.excelService.exportAsExcelFile(ExcelArray, 'ExpiredCertificates');
    } else {
      this.notificationSnackBarComponent.openSnackBar('No records found', SnackBarStatus.warning);
    }
    // const itemsShowed1 = this.ExpiredCertificatesTable.nativeElement;
    // this.excelService.exportTableToExcel(itemsShowed1, 'ExpiredCertificates');
  }

  ExportErrorDocumentsToExcel(): void {
    const startIndex: number = this.ErrorDocumentsPaginator.pageSize * this.ErrorDocumentsPaginator.pageIndex;
    const endIndex: number = this.ErrorDocumentsPaginator.pageSize + startIndex;
    let array: ErrorInvoice[] = [];
    const ExcelArray: any[] = [];
    if (this.ErrorDocumentsDataSource.filteredData.length) {
      array = this.ErrorDocumentsDataSource.filteredData;
    } else {
      array = this.ErrorDocumentsDataSource.data;
    }
    const itemsShowed1 = array.slice(startIndex, endIndex);
    itemsShowed1.forEach(x => {
      ExcelArray.push(
        {
          'Invoice Number': x.INV_NAME, 'Plant': x.Plant_ID, 'Document type': x.DocumentType_ID,
          'Output type': x.OutputType_ID, 'Created on': this.datePipe.transform(x.CREATED_ON, 'dd-MM-yyyy hh:mm:ss a'), 'Comment': x.COMMENT
        });
    });
    if (ExcelArray.length > 0) {
      this.excelService.exportAsExcelFile(ExcelArray, 'ErrorDocuments');
    } else {
      this.notificationSnackBarComponent.openSnackBar('No records found', SnackBarStatus.warning);
    }
    // const itemsShowed1 = this.ErrorDocumentsTable.nativeElement;
    // this.excelService.exportTableToExcel(itemsShowed1, 'ErrorDocuments');
  }

}





