import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'users',
        data: { pageTitle: 'myApp.users.home.title' },
        loadChildren: () => import('./users/users.module').then(m => m.UsersModule),
      },
      {
        path: 'posts',
        data: { pageTitle: 'myApp.posts.home.title' },
        loadChildren: () => import('./posts/posts.module').then(m => m.PostsModule),
      },
      {
        path: 'categories',
        data: { pageTitle: 'myApp.categories.home.title' },
        loadChildren: () => import('./categories/categories.module').then(m => m.CategoriesModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
