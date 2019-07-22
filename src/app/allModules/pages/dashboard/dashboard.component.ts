import { Component, OnInit, ViewEncapsulation, ViewChild, Input } from '@angular/core';
import { DataSource } from '@angular/cdk/collections';
import { BehaviorSubject, Observable } from 'rxjs';
import * as shape from 'd3-shape';

// import { fuseAnimations } from '@fuse/animations';

// import { ProjectDashboardService } from 'app/main/apps/dashboards/project/project.service';

import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { FuseConfigService } from '@fuse/services/config.service';
import { MatPaginator, MatSort, MatTableDataSource, MatDialog, MatDialogConfig, MatSnackBar } from '@angular/material';
import { fuseAnimations } from '@fuse/animations';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { DSSInvoice, FilterClass, DSSConfiguration, DSSStatusCount, DSSErrorInvoice, ErrorInvoice } from 'app/models/dss';
import { DatePipe } from '@angular/common';
import { saveAs } from 'file-saver';
import { NotificationDialogComponent } from 'app/notifications/notification-dialog/notification-dialog.component';
import { NotificationSnackBarComponent } from 'app/notifications/notification-snack-bar/notification-snack-bar.component';
import { SnackBarStatus } from 'app/notifications/notification-snack-bar/notification-snackbar-status-enum';
import { AuthenticationDetails, OutputTypeView, DocumentOutputType, DocumentTypeView, PlantView, DocumentOutputTypeMapView, UserPlantMapView } from 'app/models/master';
import { Router } from '@angular/router';
import { DashboardService } from 'app/services/dashboard.service';
import { PdfDialogComponent } from '../pdf-dialog/pdf-dialog.component';
import { DialogComponent } from '../dialog/dialog.component';
import { MasterService } from 'app/services/master.service';
import { CustomValidator } from 'app/shared/custom-validator';
import { ConfigUserUpdateDialogComponent } from '../config-user-update-dialog/config-user-update-dialog.component';

@Component({
  selector: 'dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class DashboardComponent implements OnInit {
  authenticationDetails: AuthenticationDetails;
  MenuItems: string[];
  UserEmailAddress: string;
  UserName: string;
  public reports: any;
  public expiredata: any;
  public errordata: any;
  public Configdata: any;
  DSSStatusCount: DSSStatusCount = new DSSStatusCount();
  AllSignedDocument: DSSInvoice[] = [];
  AllConfigurations: DSSConfiguration[] = [];
  AllExpiredCertificates: DSSConfiguration[] = [];
  AllErrorDocuments: DSSErrorInvoice[] = [];
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
  ErrorDocumentsDataSource: MatTableDataSource<DSSErrorInvoice>;
  SignDocumentsColumns: string[] = ['INV_NAME', 'Plant_ID', 'DocumentType_ID', 'OutputType_ID', 'SIGNED_AUTHORITY', 'SIGNED_ON', 'View', 'Download'];
  // tslint:disable-next-line:max-line-length
  ConfigurationsColumns: string[] = ['Plant_ID', 'CERT_NAME', 'PRIORITY1_USER', 'PRIORITY2_USER', 'PRIORITY3_USER', 'PRIORITY4_USER', 'PRIORITY5_USER', 'DISPLAYTITLE2', 'CREATED_ON'];
  // tslint:disable-next-line:max-line-length
  ExpiredCertificatesColumns: string[] = ['Plant_ID', 'CERT_NAME', 'PRIORITY1_USER', 'PRIORITY2_USER', 'PRIORITY3_USER', 'PRIORITY4_USER', 'PRIORITY5_USER', 'DISPLAYTITLE2', 'CERT_EX_DT'];
  ErrorDocumentsColumns: string[] = ['INV_NAME', 'Plant_ID', 'DocumentType_ID', 'OutputType_ID', 'CREATED_ON', 'Comment', 'View', 'Download'];

  @ViewChild(MatPaginator) SignDocumentsPaginator: MatPaginator;
  @ViewChild(MatPaginator) ConfigurationsPaginator: MatPaginator;
  @ViewChild(MatPaginator) ExpiredCertificatesPaginator: MatPaginator;
  @ViewChild(MatPaginator) ErrorDocumentsPaginator: MatPaginator;

  @ViewChild(MatSort) SignDocumentsSort: MatSort;
  @ViewChild(MatSort) ConfigurationsSort: MatSort;
  @ViewChild(MatSort) ExpiredCertificatesSort: MatSort;
  @ViewChild(MatSort) ErrorDocumentsSort: MatSort;

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
  constructor(public _matDialog: MatDialog,
    public dashboardService: DashboardService,
    public masterService: MasterService,
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
      FromInvoice: ['', Validators.pattern],
      ToInvoice: ['', Validators.pattern],
      PlantID: [''],
      DocumentTypeID: [''],
      OutputTypeID: [''],
      Authority: [''],
      FromDate: [''],
      ToDate: ['']
    });
    this.authenticationDetails = new AuthenticationDetails();
    this.IsProgressBarVisibile = true;
    this.IsDSSStatusCountCompleted = false;
    this.IsAllSignedDocumentCompleted = false;
    this.AllPlantCompleted = false;
    this.AllDocumentTypeNameCompleted = false;
    this.AllOutputTypeNameCompleted = false;
    this.notificationSnackBarComponent = new NotificationSnackBarComponent(this.snackBar);
    this.isDateError = false;
    this.isInvoiceError = false;
  }

  ngOnInit(): void {
    // Retrive authorizationData
    this.UserEmailAddress = '';
    this.UserName = '';
    const retrievedObject = localStorage.getItem('authorizationData');
    if (retrievedObject) {
      this.authenticationDetails = JSON.parse(retrievedObject) as AuthenticationDetails;
      this.MenuItems = this.authenticationDetails.menuItemNames.split(',');
      if (this.MenuItems.indexOf('Dashboard') < 0) {
        this.notificationSnackBarComponent.openSnackBar('You do not have permission to visit this page', SnackBarStatus.danger);
        this._router.navigate(['/auth/login']);
      } else {
        this.UserEmailAddress = this.authenticationDetails.emailAddress;
        this.UserName = this.authenticationDetails.userName;
        // const isConfigurationDialog = this.authenticationDetails.isConfigurationDialog;
        // if (isConfigurationDialog && isConfigurationDialog === 'Yes') {
        //   setTimeout(() => this.UpdateConfigUser());
        // }
        this.GetDSSStatusCountsByUser(this.UserName);
        this.GetAllSignedDocumentsByUser(this.UserName);
        this.GetAllPlants();
        this.GetAllDocumentTypes();
        this.GetAllOutputTypes();
        this.GetAllDocumentOutputTypeMapViews();
        this.GetAllNormalUsers();
        this.GetAllUserPlantMapViews();
      }
    } else {
      this._router.navigate(['/auth/login']);
    }
  }

  UpdateConfigUser(): void {
    const dialogConfig: MatDialogConfig = {
      data: this.UserName,
      panelClass: 'config-user-dialog'
    };
    const dialogRef = this.dialog.open(ConfigUserUpdateDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(
      result => {
        if (result) {
          const SignedAuthority = result as string;
          this.dashboardService.UpdateAllConfigurationsByUser(this.UserName, SignedAuthority).subscribe(
            (res) => {
              // console.log(res);
              this.notificationSnackBarComponent.openSnackBar('Configurations updated successfully', SnackBarStatus.success);
            }, (err) => {
              this.notificationSnackBarComponent.openSnackBar(err instanceof Object ? 'Something went wrong' : err, SnackBarStatus.danger);
              console.error(err);
            }
          );
        }
        this.authenticationDetails.isConfigurationDialog = 'No';
        localStorage.setItem('authorizationData', JSON.stringify(this.authenticationDetails));
      });
  }

  tabone(): void {
    this.tab1 = true;
    this.tab2 = false;
    this.tab3 = false;
    this.tab4 = false;
    this.GetAllSignedDocumentsByUser(this.UserName);
    this.ResetControl();
  }
  tabtwo(): void {
    this.tab1 = false;
    this.tab2 = true;
    this.tab3 = false;
    this.tab4 = false;
    this.GetAllConfigurationsByUser(this.UserName);
    this.ResetControl();
  }
  tabthree(): void {
    this.tab1 = false;
    this.tab2 = false;
    this.tab3 = true;
    this.tab4 = false;
    this.GetAllExpiredCertificatesByUser(this.UserName);
    this.ResetControl();
  }
  tabfour(): void {
    this.tab1 = false;
    this.tab2 = false;
    this.tab3 = false;
    this.tab4 = true;
    this.GetAllErrorDocumentsByUser(this.UserName);
    this.ResetControl();
  }

  ResetControl(): void {
    this.getDocument = new FilterClass();
    this.documentFormGroup.reset();
    Object.keys(this.documentFormGroup.controls).forEach(key => {
      this.documentFormGroup.get(key).markAsUntouched();
    });
    this.AllFilteredOutputTypes = this.AllOutputTypes;
    this.AllFilteredUsers = this.AllUsers;

  }

  // For Normal user
  GetDSSStatusCountsByUser(UserName: string): void {
    this.dashboardService.GetDSSStatusCountsByUser(UserName).subscribe((data) => {
      if (data) {
        this.DSSStatusCount = data as DSSStatusCount;
      }
      this.IsDSSStatusCountCompleted = true;
    }, (error) => {
      console.error(error);
      this.IsDSSStatusCountCompleted = true;
    });
  }

  GetAllSignedDocumentsByUser(UserName: string): void {
    this.IsProgressBarVisibile = true;
    this.dashboardService
      .GetAllSignedDocumentsByUser(UserName)
      .subscribe((data) => {
        if (data) {
          this.AllSignedDocument = <DSSInvoice[]>data;
          this.SignDocumentsDataSource = new MatTableDataSource(this.AllSignedDocument);
          this.SignDocumentsDataSource.paginator = this.SignDocumentsPaginator;
          this.SignDocumentsDataSource.sort = this.SignDocumentsSort;
          this.DSSStatusCount.SignedDocumnentCount = this.AllSignedDocument.length;
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

  GetAllConfigurationsByUser(UserName: string): void {
    this.IsProgressBarVisibile = true;
    this.dashboardService
      .GetAllConfigurationsByUser(UserName)
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

  GetAllExpiredCertificatesByUser(UserName: string): void {
    this.IsProgressBarVisibile = true;
    this.dashboardService
      .GetAllExpiredCertificatesByUser(UserName)
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


  GetAllErrorDocumentsByUser(UserName: string): void {
    this.IsProgressBarVisibile = true;
    this.dashboardService
      .GetAllErrorDocumentsByUser(UserName)
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
    this.masterService.GetAllPlantViewsByUser(this.UserName).subscribe(
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
    this.masterService.GetAllDocumentTypeViewsByUser(this.UserName).subscribe(
      (data) => {
        this.AllDocumentTypes = <DocumentTypeView[]>data;
        this.AllDocumentTypeNameCompleted = true;
        // console.log(this.AllMenuApps);
      },
      (err) => {
        console.error(err);
        this.AllDocumentTypeNameCompleted = true;
      }
    );
  }
  GetAllOutputTypes(): void {
    this.masterService.GetAllOutputTypeViewsByUser(this.UserName).subscribe((data) => {
      if (data) {
        this.AllOutputTypes = data as OutputTypeView[];
        this.AllFilteredOutputTypes = data as OutputTypeView[];
      }
      this.AllOutputTypeNameCompleted = true;
    },
      (err) => {
        console.error(err);
        this.AllOutputTypeNameCompleted = true;
      });
  }
  GetAllDocumentOutputTypeMapViews(): void {
    this.masterService.GetAllDocumentOutputTypeMapViewsByUser(this.UserName).subscribe((data) => {
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
    this.masterService.GetAllNormalUsersByUser(this.UserName).subscribe((data) => {
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
    this.masterService.GetAllUserPlantMapViewsByUser(this.UserName).subscribe((data) => {
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
        // this.getDocument.FromInvoice = this.documentFormGroup.get('FromInvoice').value;
        // this.getDocument.ToInvoice = this.documentFormGroup.get('ToInvoice').value;
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
        this.getDocument.UserName = this.UserName;
        this.dashboardService.GetAllInvoicesBasedOnDateByUser(this.getDocument)
          .subscribe((data) => {
            this.AllSignedDocument = <DSSInvoice[]>data;
            this.SignDocumentsDataSource = new MatTableDataSource(this.AllSignedDocument);
            this.SignDocumentsDataSource.paginator = this.SignDocumentsPaginator;
            this.SignDocumentsDataSource.sort = this.SignDocumentsSort;
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
  UpdateConfiguration(DSSConfigurationData: DSSConfiguration): void {
    const dialogConfig: MatDialogConfig = {
      data: DSSConfigurationData,
      panelClass: 'config-dialog'
    };
    const dialogRef = this.dialog.open(DialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(
      result => {
        if (result) {
          const DSSConfig = result as DSSConfiguration;
          this.IsProgressBarVisibile = true;
          this.dashboardService.UpdateConfiguration(DSSConfig).subscribe(
            (data) => {
              this.IsProgressBarVisibile = false;
              this.notificationSnackBarComponent.openSnackBar('Configuration updated successfully', SnackBarStatus.success);
              this.GetAllConfigurationsByUser(this.UserName);
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
  ActivateConfiguration(DSSConfig: DSSConfiguration): void {
    const dialogConfig: MatDialogConfig = {
      data: {
        Actiontype: 'Activate',
        Catagory: 'Configuration'
      },
      panelClass: 'confirmation-dialog'
    };
    const dialogRef = this.dialog.open(NotificationDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(
      result => {
        if (result) {
          this.IsProgressBarVisibile = true;
          this.dashboardService.ActivateConfiguration(DSSConfig).subscribe(
            (data) => {
              this.IsProgressBarVisibile = false;
              this.notificationSnackBarComponent.openSnackBar('Configuration activated successfully', SnackBarStatus.success);
              this.GetAllConfigurationsByUser(this.UserName);
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
  DowloandPdfFromID(ID: number, fileName: string): void {
    this.IsProgressBarVisibile = true;
    this.dashboardService.DowloandPdfFromID(ID).subscribe(
      data => {
        const BlobFile = data as Blob;
        saveAs(BlobFile, fileName);
        this.IsProgressBarVisibile = false;
      },
      error => {
        console.error(error);
        this.IsProgressBarVisibile = false;
      }
    );
  }
  ViewPdfFromID(ID: number, fileName: string): void {
    this.IsProgressBarVisibile = true;
    this.dashboardService.DowloandPdfFromID(ID).subscribe(
      data => {
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
        this.IsProgressBarVisibile = false;
      },
      error => {
        console.error(error);
        this.IsProgressBarVisibile = false;
      }
    );
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
}


