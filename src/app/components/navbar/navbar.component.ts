import { Component, OnInit, ElementRef } from '@angular/core';
import { ROUTES } from '../sidebar/sidebar.component';
import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { API } from 'app/shared/constants/endpoints';
import { ToasterService } from 'app/shared/services/toaster.service';
import { ApiHandlerService } from 'app/shared/services/api-handler.service';
import { StorageAccessorService } from 'app/shared/services/localstorage-accessor.service';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { BottomSheetComponent } from './bottom-sheet/bottom-sheet.component';
import { MatDialog } from '@angular/material/dialog';
import { Title } from '@angular/platform-browser';

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.css']
})



export class NavbarComponent implements OnInit {
    
     toggleOpen() {
        const toggleButton = this.toggleButton;
        const body = document.getElementsByTagName('body')[0];
        setTimeout(function () {
            toggleButton.classList.add('toggled');
        }, 500);

        body.classList.add('nav-small-open');

        this.sidebarVisible = true;
    };
    get addUserButton(){
     if(this.localStorage.fetchRole === "admin" || this.localStorage.fetchRole.includes('crm-user') )return true;
    }
    toggleClose() {
        const body = document.getElementsByTagName('body')[0];
        this.toggleButton.classList.remove('toggled');
        this.sidebarVisible = false;
        body.classList.remove('nav-small-open');
    };
    slideToggle() {
        var $toggle = document.getElementsByClassName('navbar-toggler')[0];

        if (this.sidebarVisible === false) {
            this.toggleOpen();
        } else {
            this.toggleClose();
        }
        const body = document.getElementsByTagName('body')[0];

        if (this.mobile_menu_visible == 1) {
            body.classList.remove('nav-small-open');
            if ($layer) {
                $layer.remove();
            }
            setTimeout(function () {
                $toggle.classList.remove('toggled');
            }, 400);

            this.mobile_menu_visible = 0;
        } else {
            setTimeout(function () {
                $toggle.classList.add('toggled');
            }, 430);

            var $layer = document.createElement('div');
            $layer.setAttribute('class', 'close-layer');


            if (body.querySelectorAll('.main-panel')) {
                document.getElementsByClassName('main-panel')[0].appendChild($layer);
            } else if (body.classList.contains('off-canvas-sidebar')) {
                document.getElementsByClassName('wrapper-full-page')[0].appendChild($layer);
            }

            setTimeout(function () {
                $layer.classList.add('visible');
            }, 100);

            $layer.onclick = function () { //asign a function
                body.classList.remove('nav-small-open');
                this.mobile_menu_visible = 0;
                $layer.classList.remove('visible');
                setTimeout(function () {
                    $layer.remove();
                    $toggle.classList.remove('toggled');
                }, 400);
            }.bind(this);

            body.classList.add('nav-small-open');
            this.mobile_menu_visible = 1;

        }
    };
    private listTitles: any[];
    
    mobile_menu_visible: any = 0;
    private toggleButton: any;
    private sidebarVisible: boolean;
    private isLogoutProcessing: boolean;
    private customer:boolean = false;

    constructor(
       public location: Location,
        private element: ElementRef,
        private router: Router,
        private apiHandlerService: ApiHandlerService,
        private toasterService: ToasterService,
        public localStorage: StorageAccessorService,
        private _bottomSheet: MatBottomSheet,
        public dialog: MatDialog,
        private titleService: Title


    ) {
        this.location = location;
        this.sidebarVisible = false;
      
    }

    

  openBottomSheet(): void {
    // this._bottomSheet.open(BottomSheetComponent);
      this.dialog.open(BottomSheetComponent, {
      data: {
        animal: 'panda'
      },
    
    });
  }
  
    ngOnInit() {
        this.listTitles = ROUTES.filter(listTitle => listTitle);
        // console.log(this.listTitles);
        const navbar: HTMLElement = this.element.nativeElement;
        // console.log(navbar);
        this.toggleButton = navbar.getElementsByClassName('navbar-toggler')[0];
        this.router.events.subscribe((event) => {
            this.sidebarClose();
            var $layer: any = document.getElementsByClassName('close-layer')[0];
            if ($layer) {
                $layer.remove();
                this.mobile_menu_visible = 0;
            }

        });

          this.router.events.subscribe((val) => {
        // see also 
        this.setTitle(this.getTitle())
      
    });
    }

    sidebarOpen() {
        const toggleButton = this.toggleButton;
        const body = document.getElementsByTagName('body')[0];
        setTimeout(function () {
            toggleButton.classList.add('toggled');
        }, 500);

        body.classList.add('nav-open');

        this.sidebarVisible = true;
    };
    sidebarClose() {
        const body = document.getElementsByTagName('body')[0];
        this.toggleButton.classList.remove('toggled');
        this.sidebarVisible = false;
        body.classList.remove('nav-open');
    };
    sidebarToggle() {
        var $toggle = document.getElementsByClassName('navbar-toggler')[0];

        if (this.sidebarVisible === false) {
            this.sidebarOpen();
        } else {
            this.sidebarClose();
        }
        const body = document.getElementsByTagName('body')[0];

        if (this.mobile_menu_visible == 1) {
            body.classList.remove('nav-open');
            if ($layer) {
                $layer.remove();
            }
            setTimeout(function () {
                $toggle.classList.remove('toggled');
            }, 400);

            this.mobile_menu_visible = 0;
        } else {
            setTimeout(function () {
                $toggle.classList.add('toggled');
            }, 430);

            var $layer = document.createElement('div');
            $layer.setAttribute('class', 'close-layer');


            if (body.querySelectorAll('.main-panel')) {
                document.getElementsByClassName('main-panel')[0].appendChild($layer);
            } else if (body.classList.contains('off-canvas-sidebar')) {
                document.getElementsByClassName('wrapper-full-page')[0].appendChild($layer);
            }

            setTimeout(function () {
                $layer.classList.add('visible');
            }, 100);

            $layer.onclick = function () { //asign a function
                body.classList.remove('nav-open');
                this.mobile_menu_visible = 0;
                $layer.classList.remove('visible');
                setTimeout(function () {
                    $layer.remove();
                    $toggle.classList.remove('toggled');
                }, 400);
            }.bind(this);

            body.classList.add('nav-open');
            this.mobile_menu_visible = 1;

        }
    };

    public setTitle(newTitle: string) {
    this.titleService.setTitle(newTitle);
  }

    getTitle() {
        var titlee = this.location.prepareExternalUrl(this.location.path());
          

        if (titlee.split('/')[1] === 'crm') {
                     
            titlee = titlee.split('/')[2];
        }
           
            
        for (var item = 0; item < this.listTitles.length; item++) {
            if (this.listTitles[item].path === titlee) {
              
                
                return this.listTitles[item].title;
            }
        }
        return 'Admin Panel';
    }

    logoutAdmin() {
        if (!this.isLogoutProcessing) {
            this.isLogoutProcessing = true;
            this.apiHandlerService.apiGet(API.AUTH_ENDPOINTS.LOGOUT).subscribe({
                next: result => {
                    this.localStorage.deleteToken();
                    this.localStorage.deleteData();
                    localStorage.removeItem("maxprice");
                    localStorage.clear();
                    this.router.navigate(['auth/login']);
                    this.toasterService.Success('Logout Successfull.');
                },
                error: err => {
                    let msg = (err && err.error && err.error.message) ? err.error.message : err;
                    this.toasterService.Error(msg);
                },
                complete: () => {
                    this.isLogoutProcessing = false;
                }
            });
        }
    }
}
