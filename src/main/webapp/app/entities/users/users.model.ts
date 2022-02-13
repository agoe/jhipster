import { IPosts } from 'app/entities/posts/posts.model';

export interface IUsers {
  id?: string;
  name?: number;
  posts?: IPosts[] | null;
}

export class Users implements IUsers {
  constructor(public id?: string, public name?: number, public posts?: IPosts[] | null) {}
}

export function getUsersIdentifier(users: IUsers): string | undefined {
  return users.id;
}
