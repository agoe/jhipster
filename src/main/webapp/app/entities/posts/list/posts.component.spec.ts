import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { PostsService } from '../service/posts.service';

import { PostsComponent } from './posts.component';

describe('Posts Management Component', () => {
  let comp: PostsComponent;
  let fixture: ComponentFixture<PostsComponent>;
  let service: PostsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [PostsComponent],
    })
      .overrideTemplate(PostsComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(PostsComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(PostsService);

    const headers = new HttpHeaders();
    jest.spyOn(service, 'query').mockReturnValue(
      of(
        new HttpResponse({
          body: [{ id: 'ABC' }],
          headers,
        })
      )
    );
  });

  it('Should call load all on init', () => {
    // WHEN
    comp.ngOnInit();

    // THEN
    expect(service.query).toHaveBeenCalled();
    expect(comp.posts?.[0]).toEqual(expect.objectContaining({ id: 'ABC' }));
  });
});
