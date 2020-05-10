import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { Post } from '../post.model';
import { NgForm, FormGroup, FormControl, Validators } from '@angular/forms';
import { PostService } from '../post.service';
import { ActivatedRoute } from '@angular/router';
import { mimeType } from './mime-type.validator';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit {
  id: string;
  post: Post;
  postForm: FormGroup;
  editMode = false;
  isLoading = false;
  invalidImage = false;
  imagePreview: string | ArrayBuffer;
  constructor(
    public psService: PostService,
    public activatedRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      if (params['id']) {
        this.id = params['id'];
        this.editMode = true;
        this.isLoading = true;
        this.psService.getPostById(this.id).subscribe(responseData => {
          this.isLoading = false;
          console.log(responseData);
          this.post = {
            id: responseData._id,
            content: responseData.content,
            title: responseData.title,
            imagePath: responseData.imagePath,
            creator: responseData.creator
          };
          this.postForm.setValue({
            title: responseData.title,
            content: responseData.content,
            image: responseData.imagePath
          });
        });
      } else {
        this.editMode = false;
        this.post = null;
      }
    });
    this.postForm = new FormGroup({
      title: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)]
      }),
      content: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)]
      }),
      image: new FormControl(null, {
        validators: [Validators.required],
        asyncValidators: [mimeType]
      })
    });
  }
  onAddPost() {
    // const title = form.value.title;
    // const content = form.value.content;
    if (!this.postForm.valid) {
      console.log('Your form is invalid. Please check');
      return;
    }

    this.isLoading = true;
    if (!this.editMode) {
      this.psService.addPost(
        this.postForm.value.title,
        this.postForm.value.content,
        this.postForm.value.image
      );
    } else {
      this.psService.updatePost(
        this.id,
        this.postForm.value.title,
        this.postForm.value.content
      );
    }
    this.postForm.reset();
  }

  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.postForm.patchValue({ image: file });
    this.postForm.get('image').updateValueAndValidity();
    if (file.type.includes('image')) {
      this.invalidImage = false;
    } else {
      this.invalidImage = true;
    }
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result;
    };
    reader.readAsDataURL(file);
  }
}
