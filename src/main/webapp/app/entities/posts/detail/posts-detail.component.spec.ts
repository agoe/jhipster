import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { PostsDetailComponent } from './posts-detail.component';

describe('Posts Management Detail Component', () => {
  let comp: PostsDetailComponent;
  let fixture: ComponentFixture<PostsDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PostsDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ posts: { id: 'ABC' } }) },
        },
      ],
    })
      .overrideTemplate(PostsDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(PostsDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load posts on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.posts).toEqual(expect.objectContaining({ id: 'ABC' }));
    });
  });
});
