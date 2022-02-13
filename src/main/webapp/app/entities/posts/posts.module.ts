import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { PostsComponent } from './list/posts.component';
import { PostsDetailComponent } from './detail/posts-detail.component';
import { PostsUpdateComponent } from './update/posts-update.component';
import { PostsDeleteDialogComponent } from './delete/posts-delete-dialog.component';
import { PostsRoutingModule } from './route/posts-routing.module';

@NgModule({
  imports: [SharedModule, PostsRoutingModule],
  declarations: [PostsComponent, PostsDetailComponent, PostsUpdateComponent, PostsDeleteDialogComponent],
  entryComponents: [PostsDeleteDialogComponent],
})
export class PostsModule {}
