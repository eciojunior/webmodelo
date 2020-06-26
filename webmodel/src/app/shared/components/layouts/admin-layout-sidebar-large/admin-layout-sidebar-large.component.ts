import { Component, OnInit, ViewChild } from '@angular/core';
import { NavigationService } from '../../../services/navigation.service';
import { SearchService } from 'src/app/shared/services/search.service';
import { Router, RouteConfigLoadStart, ResolveStart, RouteConfigLoadEnd, ResolveEnd } from '@angular/router';
import { PerfectScrollbarDirective } from 'ngx-perfect-scrollbar';
import { AuthService } from '../../../../shared/services/auth.service';
import { HeaderSidebarLargeComponent } from './header-sidebar-large/header-sidebar-large.component';

@Component({
  selector: 'app-admin-layout-sidebar-large',
  templateUrl: './admin-layout-sidebar-large.component.html',
  styleUrls: ['./admin-layout-sidebar-large.component.scss'],
})
export class AdminLayoutSidebarLargeComponent implements OnInit {

    moduleLoading: boolean;
    @ViewChild(PerfectScrollbarDirective, { static: true }) perfectScrollbar: PerfectScrollbarDirective;
    @ViewChild(HeaderSidebarLargeComponent, {static: true}) headerSideBar: HeaderSidebarLargeComponent;
  
    constructor(
      public navService: NavigationService,
      public searchService: SearchService,
      private router: Router,
      private auth: AuthService
    ) { }
    ngIsAuthenticated () {
      if (!this.auth.isAuthenticated()) {
        this.headerSideBar.closeSidebar();
      }
      return this.auth.isAuthenticated();
    }
    ngOnInit() {
      this.router.events.subscribe(event => {
        if (event instanceof RouteConfigLoadStart || event instanceof ResolveStart) {
          this.moduleLoading = true;
        }
        if (event instanceof RouteConfigLoadEnd || event instanceof ResolveEnd) {
          this.moduleLoading = false;
        }
      });
    }

}
