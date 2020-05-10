import { Injectable } from '@angular/core';
import { Post } from './post.model';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import { Router } from '@angular/router';

const BACKEND_URL = environment.apiUrl + '/posts';

@Injectable()
export class PostService {
  private postsChanged = new Subject<Post[]>();

  constructor(private http: HttpClient, private router: Router) {}

  storedPosts: Post[] = [];

  getPosts(postPerPage: number, currentPage: number) {
    const query = `?pagesize=${postPerPage}&page=${currentPage}`;
    this.http
      .get<{ message: string; posts: any }>(BACKEND_URL + query)
      .pipe(
        map(postData => {
          return postData.posts.map(post => {
            return {
              title: post.title,
              content: post.content,
              id: post._id,
              imagePath: post.imagePath,
              creator: post.creator
            };
          });
        })
      )
      .subscribe(resData => {
        console.log(resData);
        this.storedPosts = resData;
        this.postsChanged.next([...this.storedPosts]);
      });
  }

  addPost(title: string, content: string, image: File) {
    const postData = new FormData();
    postData.append('title', title);
    postData.append('content', content);
    postData.append('image', image, title);
    this.http
      .post<{ message: string; post: Post }>(BACKEND_URL, postData)
      .subscribe(responseData => {
        console.log(responseData);
        const post: Post = {
          id: responseData.post.id,
          title: responseData.post.title,
          content: responseData.post.content,
          imagePath: responseData.post.imagePath,
          creator: null
        };
        this.storedPosts.push(post);
        this.postsChanged.next(this.storedPosts.slice());
        this.router.navigate(['/']);
      });
  }

  deletePost(id: string) {
    console.log(id);
    this.http.delete(BACKEND_URL + id).subscribe(responseData => {
      this.storedPosts = this.storedPosts.filter(p => p.id !== id);
      this.postsChanged.next(this.storedPosts.slice());
    });
  }

  postUpdatedEventListener() {
    return this.postsChanged.asObservable();
  }

  getPostById(id: string) {
    // return { ...this.storedPosts.find(x => x.id === id) };
    return this.http.get<{
      message: string;
      title: string;
      content: string;
      _id: string;
      imagePath: string;
      creator: string;
    }>(BACKEND_URL + '/' + id);
  }

  updatePost(id: string, title: string, content: string) {
    const post: Post = {
      id: id,
      title: title,
      content: content,
      imagePath: null,
      creator: null
    };
    this.http.put(BACKEND_URL + post.id, post).subscribe(responseData => {
      console.log(responseData);
      const updatedPosts = [...this.storedPosts];
      const oldPostIndex = updatedPosts.findIndex(x => x.id === id);
      updatedPosts[oldPostIndex] = post;
      this.storedPosts = updatedPosts;
      this.postsChanged.next(this.storedPosts.slice());
      this.router.navigate(['/']);
    });
  }
}
