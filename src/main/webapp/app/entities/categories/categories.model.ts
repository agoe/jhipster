import { IPosts } from 'app/entities/posts/posts.model';

export interface ICategories {
  id?: string;
  name?: string;
  posts?: IPosts[] | null;
}

export class Categories implements ICategories {
  constructor(public id?: string, public name?: string, public posts?: IPosts[] | null) {}
}

export function getCategoriesIdentifier(categories: ICategories): string | undefined {
  return categories.id;
}
