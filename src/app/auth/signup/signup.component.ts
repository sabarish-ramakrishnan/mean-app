import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit, OnDestroy {
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

  onSignup(f: NgForm) {
    if (!f.valid) {
      return;
    }
    this.isLoading = true;
    const email = f.value.email;
    const password = f.value.password;
    this.authService.createUser(email, password);
  }

  ngOnDestroy() {
    this.authStatusSubs.unsubscribe();
  }
}
