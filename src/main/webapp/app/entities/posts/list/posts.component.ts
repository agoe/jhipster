import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IPosts } from '../posts.model';
import { PostsService } from '../service/posts.service';
import { PostsDeleteDialogComponent } from '../delete/posts-delete-dialog.component';

@Component({
  selector: 'jhi-posts',
  templateUrl: './posts.component.html',
})
export class PostsComponent implements OnInit {
  posts?: IPosts[];
  isLoading = false;

  constructor(protected postsService: PostsService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.postsService.query().subscribe({
      next: (res: HttpResponse<IPosts[]>) => {
        this.isLoading = false;
        this.posts = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IPosts): string {
    return item.id!;
  }

  delete(posts: IPosts): void {
    const modalRef = this.modalService.open(PostsDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.posts = posts;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
