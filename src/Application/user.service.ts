
import { UserRepository } from "../Domain/Ports/user.repository.js";
import { User } from "../Domain/Entities/user.js";


export interface CreateUserInput {
  email?: string;
  name?: string;
  password?: string;
}

export class UserService {

  constructor(private userRepository: UserRepository) {
  }

  async getAllUsers() {
    return this.userRepository.getAll();
  }

  async createUser({ email, name, password }: CreateUserInput) {
    const user = new User(email!, name!, password!);
    return this.userRepository.create(user);
  }

  async deleteUser(id: number) {
    return this.userRepository.delete(id);
  }

}
