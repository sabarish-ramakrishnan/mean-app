import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  private subs: Subscription;
  IsAuthenticated = false;
  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.IsAuthenticated = this.authService.IsAuthenticated();
    this.subs = this.authService
      .getAuthStatusListener()
      .subscribe(AuthStatus => {
        this.IsAuthenticated = AuthStatus;
      });
  }

  onLogout() {
    this.authService.logOut();
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
