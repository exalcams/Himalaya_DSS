import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { DialogComponent } from '../dialog/dialog.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DashboardService } from 'app/services/dashboard.service';
import { UserByPlant } from 'app/models/dss';

@Component({
  selector: 'app-config-user-update-dialog',
  templateUrl: './config-user-update-dialog.component.html',
  styleUrls: ['./config-user-update-dialog.component.scss']
})
export class ConfigUserUpdateDialogComponent implements OnInit {
  AllPlantUsersByUser: string[] = [];
  ConfigurationUpdateFormGroup: FormGroup;
  constructor(
    public matDialogRef: MatDialogRef<DialogComponent>,
    @Inject(MAT_DIALOG_DATA) public UserName: string,
    private formBuilder: FormBuilder,
    private dashboardService: DashboardService,
  ) {
    this.ConfigurationUpdateFormGroup = this.formBuilder.group({
      SignedAuthority: ['', Validators.required],
    });
  }
  ResetControl(): void {
    this.ConfigurationUpdateFormGroup.reset();
    Object.keys(this.ConfigurationUpdateFormGroup.controls).forEach(key => {
      this.ConfigurationUpdateFormGroup.get(key).markAsUntouched();
    });

  }

  ngOnInit(): void {
    this.GetAllPlantUsersByUser();
  }

  GetAllPlantUsersByUser(): void {
    // this.dashboardService.GetAllPlantUsersByUser(this.UserName).subscribe(
    //   (data) => {
    //     this.AllPlantUsersByUser = data as string[];
    //   },
    //   (err) => {
    //     console.error(err);
    //   }
    // );
  }
  YesClicked(): void {
    if (this.ConfigurationUpdateFormGroup.valid) {
      const SignedAuthority = this.ConfigurationUpdateFormGroup.get('SignedAuthority').value;
      this.matDialogRef.close(SignedAuthority);
    } else {
      Object.keys(this.ConfigurationUpdateFormGroup.controls).forEach(key => {
        this.ConfigurationUpdateFormGroup.get(key).markAsTouched();
        this.ConfigurationUpdateFormGroup.get(key).markAsDirty();
      });

    }
  }


  CloseClicked(): void {
    this.matDialogRef.close(null);
  }
}
