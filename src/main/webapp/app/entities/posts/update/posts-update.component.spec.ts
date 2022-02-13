import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { PostsService } from '../service/posts.service';
import { IPosts, Posts } from '../posts.model';
import { IUsers } from 'app/entities/users/users.model';
import { UsersService } from 'app/entities/users/service/users.service';
import { ICategories } from 'app/entities/categories/categories.model';
import { CategoriesService } from 'app/entities/categories/service/categories.service';

import { PostsUpdateComponent } from './posts-update.component';

describe('Posts Management Update Component', () => {
  let comp: PostsUpdateComponent;
  let fixture: ComponentFixture<PostsUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let postsService: PostsService;
  let usersService: UsersService;
  let categoriesService: CategoriesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [PostsUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(PostsUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(PostsUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    postsService = TestBed.inject(PostsService);
    usersService = TestBed.inject(UsersService);
    categoriesService = TestBed.inject(CategoriesService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Users query and add missing value', () => {
      const posts: IPosts = { id: 'CBA' };
      const users: IUsers = { id: 'a02ed872-7c11-461a-a154-dd7b4b9bfda4' };
      posts.users = users;

      const usersCollection: IUsers[] = [{ id: '97bddd09-accb-49d8-bf0d-651cd577db8c' }];
      jest.spyOn(usersService, 'query').mockReturnValue(of(new HttpResponse({ body: usersCollection })));
      const additionalUsers = [users];
      const expectedCollection: IUsers[] = [...additionalUsers, ...usersCollection];
      jest.spyOn(usersService, 'addUsersToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ posts });
      comp.ngOnInit();

      expect(usersService.query).toHaveBeenCalled();
      expect(usersService.addUsersToCollectionIfMissing).toHaveBeenCalledWith(usersCollection, ...additionalUsers);
      expect(comp.usersSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Categories query and add missing value', () => {
      const posts: IPosts = { id: 'CBA' };
      const categories: ICategories = { id: '05385fdd-15e7-4886-b418-89128084b497' };
      posts.categories = categories;

      const categoriesCollection: ICategories[] = [{ id: 'c1f15730-6961-4892-8009-61850b6a224d' }];
      jest.spyOn(categoriesService, 'query').mockReturnValue(of(new HttpResponse({ body: categoriesCollection })));
      const additionalCategories = [categories];
      const expectedCollection: ICategories[] = [...additionalCategories, ...categoriesCollection];
      jest.spyOn(categoriesService, 'addCategoriesToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ posts });
      comp.ngOnInit();

      expect(categoriesService.query).toHaveBeenCalled();
      expect(categoriesService.addCategoriesToCollectionIfMissing).toHaveBeenCalledWith(categoriesCollection, ...additionalCategories);
      expect(comp.categoriesSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const posts: IPosts = { id: 'CBA' };
      const users: IUsers = { id: 'd8380368-b554-42ce-a1ed-601470b27722' };
      posts.users = users;
      const categories: ICategories = { id: 'c4691e17-aa2d-4876-a445-b6e866be19fa' };
      posts.categories = categories;

      activatedRoute.data = of({ posts });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(posts));
      expect(comp.usersSharedCollection).toContain(users);
      expect(comp.categoriesSharedCollection).toContain(categories);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Posts>>();
      const posts = { id: 'ABC' };
      jest.spyOn(postsService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ posts });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: posts }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(postsService.update).toHaveBeenCalledWith(posts);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Posts>>();
      const posts = new Posts();
      jest.spyOn(postsService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ posts });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: posts }));
      saveSubject.complete();

      // THEN
      expect(postsService.create).toHaveBeenCalledWith(posts);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Posts>>();
      const posts = { id: 'ABC' };
      jest.spyOn(postsService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ posts });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(postsService.update).toHaveBeenCalledWith(posts);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Tracking relationships identifiers', () => {
    describe('trackUsersById', () => {
      it('Should return tracked Users primary key', () => {
        const entity = { id: 'ABC' };
        const trackResult = comp.trackUsersById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });

    describe('trackCategoriesById', () => {
      it('Should return tracked Categories primary key', () => {
        const entity = { id: 'ABC' };
        const trackResult = comp.trackCategoriesById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });
});
