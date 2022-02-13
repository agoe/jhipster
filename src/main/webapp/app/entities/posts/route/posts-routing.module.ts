import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { PostsComponent } from '../list/posts.component';
import { PostsDetailComponent } from '../detail/posts-detail.component';
import { PostsUpdateComponent } from '../update/posts-update.component';
import { PostsRoutingResolveService } from './posts-routing-resolve.service';

const postsRoute: Routes = [
  {
    path: '',
    component: PostsComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: PostsDetailComponent,
    resolve: {
      posts: PostsRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: PostsUpdateComponent,
    resolve: {
      posts: PostsRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: PostsUpdateComponent,
    resolve: {
      posts: PostsRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(postsRoute)],
  exports: [RouterModule],
})
export class PostsRoutingModule {}
