import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IPosts } from '../posts.model';

@Component({
  selector: 'jhi-posts-detail',
  templateUrl: './posts-detail.component.html',
})
export class PostsDetailComponent implements OnInit {
  posts: IPosts | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ posts }) => {
      this.posts = posts;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
