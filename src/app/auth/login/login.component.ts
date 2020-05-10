import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {
  isLoading = false;
  private authStatusSubs: Subscription;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.authStatusSubs = this.authService
      .getAuthStatusListener()
      .subscribe(authStatus => {
        this.isLoading = authStatus;
      });
  }
  onLogin(f: NgForm) {
    const email = f.value.email;
    const password = f.value.password;
    this.isLoading = true;
    this.authService.loginUser(email, password);
  }

  ngOnDestroy() {
    this.authStatusSubs.unsubscribe();
  }
}
