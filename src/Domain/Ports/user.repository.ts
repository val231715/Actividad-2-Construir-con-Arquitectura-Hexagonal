import { User } from "../Entities/user.js";

export interface UserRepository {
  getAll(): User[];
  create(user: User): User;
  delete(id: number): void;
  update(user: User): Promise<void>;
}