import { trigger, transition, group,style, animate,query } from '@angular/animations';
import { Component} from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

import { filter } from 'rxjs/operators';
import { UrlService } from './shared/services/url.service';

declare var gtag;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],

})
export class AppComponent {
  previousUrl: string = null;
  currentUrl: string = null;

  constructor(private router: Router,
              private urlService: UrlService) {}

  ngOnInit() {
    this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {

      
      this.previousUrl = this.currentUrl;
      this.currentUrl = event.url;
      this.urlService.setPreviousUrl(this.previousUrl);
    });
  }

  getDepth(outlet) {
    return outlet.activatedRouteData['depth'];
}

}
