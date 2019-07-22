import { ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';

export class CustomValidator {
    static confirmPasswordValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {

        if (!control.parent || !control) {
            return null;
        }

        const password = control.parent.get('newPassword');
        const confirmPassword = control.parent.get('confirmPassword');

        if (!password || !confirmPassword) {
            return null;
        }

        if (confirmPassword.value === '') {
            return null;
        }

        if (password.value === confirmPassword.value) {
            return null;
        }

        return { 'passwordsNotMatching': true };
    }

    static toDateValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {

        if (!control.parent || !control) {
            return null;
        }

        const FROMDATE = control.parent.get('FROMDATE');
        const TODATE = control.parent.get('TODATE');

        if (!FROMDATE || !TODATE) {
            return null;
        }

        const FROMDATEVAL = FROMDATE.value as Date;
        const TODATEVAL = TODATE.value as Date;

        if (!FROMDATEVAL || !TODATEVAL) {
            return null;
        }

        if (FROMDATEVAL > TODATEVAL) {
            return { 'toDateError': true };
        }
        return null;
    }

}
