import {Component, OnInit} from '@angular/core';
import {AuthenticationService} from '../../../core/services/authentication.service';

@Component({
    selector: 'app-welcome',
    imports: [],
    templateUrl: './welcome.component.html',
    styleUrl: './welcome.component.scss'
})
export class WelcomeComponent implements OnInit {
  private readonly DEFAULT_USERNAME: '--' = '--';

  username: string= this.DEFAULT_USERNAME;

  constructor(private readonly authenticationService: AuthenticationService) { }

  ngOnInit(): void {
    this.username=this.authenticationService.getUsername() ?? this.DEFAULT_USERNAME;
  }

}
