import { Component, OnInit } from '@angular/core';
import { Post } from './post.model';
import { AuthService } from './auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'mean-app';
  constructor(private authservice: AuthService) {}
  ngOnInit() {
    this.authservice.autoAuthUser();
  }
}
