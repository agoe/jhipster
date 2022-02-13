import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IPosts, getPostsIdentifier } from '../posts.model';

export type EntityResponseType = HttpResponse<IPosts>;
export type EntityArrayResponseType = HttpResponse<IPosts[]>;

@Injectable({ providedIn: 'root' })
export class PostsService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/posts');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(posts: IPosts): Observable<EntityResponseType> {
    return this.http.post<IPosts>(this.resourceUrl, posts, { observe: 'response' });
  }

  update(posts: IPosts): Observable<EntityResponseType> {
    return this.http.put<IPosts>(`${this.resourceUrl}/${getPostsIdentifier(posts) as string}`, posts, { observe: 'response' });
  }

  partialUpdate(posts: IPosts): Observable<EntityResponseType> {
    return this.http.patch<IPosts>(`${this.resourceUrl}/${getPostsIdentifier(posts) as string}`, posts, { observe: 'response' });
  }

  find(id: string): Observable<EntityResponseType> {
    return this.http.get<IPosts>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IPosts[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: string): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addPostsToCollectionIfMissing(postsCollection: IPosts[], ...postsToCheck: (IPosts | null | undefined)[]): IPosts[] {
    const posts: IPosts[] = postsToCheck.filter(isPresent);
    if (posts.length > 0) {
      const postsCollectionIdentifiers = postsCollection.map(postsItem => getPostsIdentifier(postsItem)!);
      const postsToAdd = posts.filter(postsItem => {
        const postsIdentifier = getPostsIdentifier(postsItem);
        if (postsIdentifier == null || postsCollectionIdentifiers.includes(postsIdentifier)) {
          return false;
        }
        postsCollectionIdentifiers.push(postsIdentifier);
        return true;
      });
      return [...postsToAdd, ...postsCollection];
    }
    return postsCollection;
  }
}
