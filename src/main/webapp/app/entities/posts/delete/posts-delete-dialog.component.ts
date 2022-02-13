import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IPosts } from '../posts.model';
import { PostsService } from '../service/posts.service';

@Component({
  templateUrl: './posts-delete-dialog.component.html',
})
export class PostsDeleteDialogComponent {
  posts?: IPosts;

  constructor(protected postsService: PostsService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: string): void {
    this.postsService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
