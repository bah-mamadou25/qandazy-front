import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-welcome',
  standalone: true,
  imports: [],
  templateUrl: './welcome.component.html',
  styleUrl: './welcome.component.scss'
})
export class WelcomeComponent implements OnInit {
  private readonly DEFAULT_USERNAME = '--';

  username: string= this.DEFAULT_USERNAME;

  ngOnInit(): void {
    this.username=localStorage.getItem('name') ?? this.DEFAULT_USERNAME;
  }

}
