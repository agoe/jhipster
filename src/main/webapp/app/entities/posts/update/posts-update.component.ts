import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IPosts, Posts } from '../posts.model';
import { PostsService } from '../service/posts.service';
import { IUsers } from 'app/entities/users/users.model';
import { UsersService } from 'app/entities/users/service/users.service';
import { ICategories } from 'app/entities/categories/categories.model';
import { CategoriesService } from 'app/entities/categories/service/categories.service';

@Component({
  selector: 'jhi-posts-update',
  templateUrl: './posts-update.component.html',
})
export class PostsUpdateComponent implements OnInit {
  isSaving = false;

  usersSharedCollection: IUsers[] = [];
  categoriesSharedCollection: ICategories[] = [];

  editForm = this.fb.group({
    id: [null, [Validators.required]],
    title: [null, [Validators.required]],
    users: [],
    categories: [],
  });

  constructor(
    protected postsService: PostsService,
    protected usersService: UsersService,
    protected categoriesService: CategoriesService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ posts }) => {
      this.updateForm(posts);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const posts = this.createFromForm();
    if (posts.id !== undefined) {
      this.subscribeToSaveResponse(this.postsService.update(posts));
    } else {
      this.subscribeToSaveResponse(this.postsService.create(posts));
    }
  }

  trackUsersById(index: number, item: IUsers): string {
    return item.id!;
  }

  trackCategoriesById(index: number, item: ICategories): string {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IPosts>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(posts: IPosts): void {
    this.editForm.patchValue({
      id: posts.id,
      title: posts.title,
      users: posts.users,
      categories: posts.categories,
    });

    this.usersSharedCollection = this.usersService.addUsersToCollectionIfMissing(this.usersSharedCollection, posts.users);
    this.categoriesSharedCollection = this.categoriesService.addCategoriesToCollectionIfMissing(
      this.categoriesSharedCollection,
      posts.categories
    );
  }

  protected loadRelationshipsOptions(): void {
    this.usersService
      .query()
      .pipe(map((res: HttpResponse<IUsers[]>) => res.body ?? []))
      .pipe(map((users: IUsers[]) => this.usersService.addUsersToCollectionIfMissing(users, this.editForm.get('users')!.value)))
      .subscribe((users: IUsers[]) => (this.usersSharedCollection = users));

    this.categoriesService
      .query()
      .pipe(map((res: HttpResponse<ICategories[]>) => res.body ?? []))
      .pipe(
        map((categories: ICategories[]) =>
          this.categoriesService.addCategoriesToCollectionIfMissing(categories, this.editForm.get('categories')!.value)
        )
      )
      .subscribe((categories: ICategories[]) => (this.categoriesSharedCollection = categories));
  }

  protected createFromForm(): IPosts {
    return {
      ...new Posts(),
      id: this.editForm.get(['id'])!.value,
      title: this.editForm.get(['title'])!.value,
      users: this.editForm.get(['users'])!.value,
      categories: this.editForm.get(['categories'])!.value,
    };
  }
}
