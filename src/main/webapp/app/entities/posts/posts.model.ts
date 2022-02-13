import { IUsers } from 'app/entities/users/users.model';
import { ICategories } from 'app/entities/categories/categories.model';

export interface IPosts {
  id?: string;
  title?: number;
  users?: IUsers | null;
  categories?: ICategories | null;
}

export class Posts implements IPosts {
  constructor(public id?: string, public title?: number, public users?: IUsers | null, public categories?: ICategories | null) {}
}

export function getPostsIdentifier(posts: IPosts): string | undefined {
  return posts.id;
}
