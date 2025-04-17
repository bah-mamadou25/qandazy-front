import { Component } from '@angular/core';
import {AuthenticationService} from '../core/services/authentication.service';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatListModule} from '@angular/material/list';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {RouterLink, RouterOutlet} from '@angular/router';

@Component({
    selector: 'app-home',
    imports: [
        MatSidenavModule,
        MatToolbarModule,
        MatIconModule,
        MatButtonModule,
        MatListModule,
        RouterOutlet,
        RouterLink,
    ],
    templateUrl: './home.component.html',
    styleUrl: './home.component.scss'
})
export class HomeComponent {
  appName = 'Qandazy';
  constructor(private readonly authenticationService: AuthenticationService) {}

  logout(): void {
    this.authenticationService.logout();
  }
}
