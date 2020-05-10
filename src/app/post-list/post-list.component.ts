import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Post } from '../post.model';
import { PostService } from '../post.service';
import { Subscription } from 'rxjs';
import { PageEvent } from '@angular/material';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {
  posts: Post[] = [];
  isLoading = false;
  isAuthenticated = false;
  totalPosts = 10;
  postsPerPage = 2;
  currentPage = 1;
  pageSizeOptions = [1, 2, 5, 10];
  userId: string;
  private psSubscription: Subscription;
  private authSubscription: Subscription;
  constructor(public psService: PostService, public authService: AuthService) {}

  ngOnInit() {
    this.isLoading = true;
    this.psService.getPosts(this.postsPerPage, 1);
    this.psSubscription = this.psService
      .postUpdatedEventListener()
      .subscribe(posts => {
        this.posts = posts;
        this.isLoading = false;
      });
    this.isAuthenticated = this.authService.IsAuthenticated();
    this.userId = this.authService.getUserId();
    this.authSubscription = this.authService
      .getAuthStatusListener()
      .subscribe(authStatus => {
        this.isAuthenticated = authStatus;
        this.userId = this.authService.getUserId();
      });
  }

  ngOnDestroy() {
    this.psSubscription.unsubscribe();
    this.authSubscription.unsubscribe();
  }

  onDeleteClick(id: string) {
    this.psService.deletePost(id);
  }

  onChangePage(event: PageEvent) {
    this.isLoading = true;
    this.currentPage = event.pageIndex + 1;
    this.postsPerPage = event.pageSize;
    this.psService.getPosts(this.postsPerPage, this.currentPage);
  }
}
