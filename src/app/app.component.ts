import { Component, Inject, OnDestroy, OnInit, Compiler, HostListener } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Platform } from '@angular/cdk/platform';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { FuseConfigService } from '@fuse/services/config.service';
import { FuseNavigationService } from '@fuse/components/navigation/navigation.service';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { FuseSplashScreenService } from '@fuse/services/splash-screen.service';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';

import { navigation } from 'app/navigation/navigation';
import { locale as navigationEnglish } from 'app/navigation/i18n/en';
import { locale as navigationTurkish } from 'app/navigation/i18n/tr';
import { MenuUpdataionService } from './services/menu-update.service';
import { BnNgIdleService } from 'bn-ng-idle';
import { Router } from '@angular/router';
import { AuthService } from './services/auth.service';
import { AuthenticationDetails } from './models/master';
import { NotificationSnackBarComponent } from './notifications/notification-snack-bar/notification-snack-bar.component';
import { MatSnackBar } from '@angular/material';
import { SnackBarStatus } from './notifications/notification-snack-bar/notification-snackbar-status-enum';

@Component({
    selector: 'app',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
    fuseConfig: any;
    navigation: any;
    authenticationDetails: AuthenticationDetails;
    notificationSnackBarComponent: NotificationSnackBarComponent;
    // Private
    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     *
     * @param {DOCUMENT} document
     * @param {FuseConfigService} _fuseConfigService
     * @param {FuseNavigationService} _fuseNavigationService
     * @param {FuseSidebarService} _fuseSidebarService
     * @param {FuseSplashScreenService} _fuseSplashScreenService
     * @param {FuseTranslationLoaderService} _fuseTranslationLoaderService
     * @param {Platform} _platform
     * @param {TranslateService} _translateService
     */
    constructor(
        @Inject(DOCUMENT) private document: any,
        private _fuseConfigService: FuseConfigService,
        private _fuseNavigationService: FuseNavigationService,
        private _fuseSidebarService: FuseSidebarService,
        private _fuseSplashScreenService: FuseSplashScreenService,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private _translateService: TranslateService,
        private _platform: Platform,
        private _menuUpdationService: MenuUpdataionService,
        private _authService: AuthService,
        private bnIdle: BnNgIdleService,
        private _router: Router,
        private _compiler: Compiler,
        public snackBar: MatSnackBar,
    ) {
        this.authenticationDetails = new AuthenticationDetails();
        this.notificationSnackBarComponent = new NotificationSnackBarComponent(this.snackBar);
        this.bnIdle.startWatching(1800).subscribe((res) => {
            if (res) {
                // Retrive authorizationData
                const retrievedObject = localStorage.getItem('authorizationData');
                if (retrievedObject) {
                    this.authenticationDetails = JSON.parse(retrievedObject) as AuthenticationDetails;
                    this._authService.SignOut(this.authenticationDetails.userID).subscribe(
                        (data) => {
                            localStorage.removeItem('authorizationData');
                            localStorage.removeItem('menuItemsData');
                            this._compiler.clearCache();
                            this._router.navigate(['auth/login']);
                            console.error('Idle timout occurred , please login again');
                            this.notificationSnackBarComponent.openSnackBar('Idle timout occurred , please login again', SnackBarStatus.danger);
                        },
                        (err) => {
                            console.error(err);
                            // this.notificationSnackBarComponent.openSnackBar(err instanceof Object ? 'Something went wrong' : err, SnackBarStatus.danger);
                            localStorage.removeItem('authorizationData');
                            localStorage.removeItem('menuItemsData');
                            this._compiler.clearCache();
                            this._router.navigate(['auth/login']);
                            console.error('Idle timout occurred , please login again');
                            this.notificationSnackBarComponent.openSnackBar('Idle timout occurred , please login again', SnackBarStatus.danger);
                        }
                    );
                } 
                // else {
                //     localStorage.removeItem('authorizationData');
                //     localStorage.removeItem('menuItemsData');
                //     this._compiler.clearCache();
                //     this._router.navigate(['auth/login']);
                //     console.error('Idle timout occurred , please login again');
                //     this.notificationSnackBarComponent.openSnackBar('Idle timout occurred , please login again', SnackBarStatus.danger);
                // }
            }
        });
        // Get default navigation
        this.navigation = navigation;

        // Register the navigation to the service
        this._fuseNavigationService.register('main', this.navigation);

        // Set the main navigation as our current navigation
        this._fuseNavigationService.setCurrentNavigation('main');

        // Add languages
        this._translateService.addLangs(['en', 'tr']);

        // Set the default language
        this._translateService.setDefaultLang('en');

        // Set the navigation translations
        this._fuseTranslationLoaderService.loadTranslations(navigationEnglish, navigationTurkish);

        // Use a language
        this._translateService.use('en');

        /**
         * ------------------------------------------------------------------
         * ngxTranslate Fix Start
         * ------------------------------------------------------------------
         * If you are using a language other than the default one, i.e. Turkish in this case,
         * you may encounter an issue where some of the components are not actually being
         * translated when your app first initialized.
         *
         * This is related to ngxTranslate module and below there is a temporary fix while we
         * are moving the multi language implementation over to the Angular's core language
         * service.
         **/

        // Set the default language to 'en' and then back to 'tr'.
        // '.use' cannot be used here as ngxTranslate won't switch to a language that's already
        // been selected and there is no way to force it, so we overcome the issue by switching
        // the default language back and forth.
        /**
         setTimeout(() => {
            this._translateService.setDefaultLang('en');
            this._translateService.setDefaultLang('tr');
         });
         */

        /**
         * ------------------------------------------------------------------
         * ngxTranslate Fix End
         * ------------------------------------------------------------------
         */

        // Add is-mobile class to the body if the platform is mobile
        if (this._platform.ANDROID || this._platform.IOS) {
            this.document.body.classList.add('is-mobile');
        }

        // Set the private defaults
        this._unsubscribeAll = new Subject();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        // Subscribe to config changes
        this._fuseConfigService.config
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((config) => {

                this.fuseConfig = config;

                // Boxed
                if (this.fuseConfig.layout.width === 'boxed') {
                    this.document.body.classList.add('boxed');
                }
                else {
                    this.document.body.classList.remove('boxed');
                }

                // Color theme - Use normal for loop for IE11 compatibility
                for (let i = 0; i < this.document.body.classList.length; i++) {
                    const className = this.document.body.classList[i];

                    if (className.startsWith('theme-')) {
                        this.document.body.classList.remove(className);
                    }
                }

                this.document.body.classList.add(this.fuseConfig.colorTheme);
            });



        // Retrive menu items from Local Storage    
        const menuItems = localStorage.getItem('menuItemsData');
        if (menuItems) {
            this.navigation = JSON.parse(menuItems);
            this._fuseNavigationService.unregister('main');
            this._fuseNavigationService.register('main', this.navigation);
            this._fuseNavigationService.setCurrentNavigation('main');
        }

        // Update the menu items on First time after log in
        this._menuUpdationService.GetAndUpdateMenus().subscribe(
            data => {
                this.navigation = data;
                this._fuseNavigationService.unregister('main');
                this._fuseNavigationService.register('main', this.navigation);
                this._fuseNavigationService.setCurrentNavigation('main');
            }
        );
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();

    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Toggle sidebar open
     *
     * @param key
     */
    toggleSidebarOpen(key): void {
        this._fuseSidebarService.getSidebar(key).toggleOpen();
    }
}
