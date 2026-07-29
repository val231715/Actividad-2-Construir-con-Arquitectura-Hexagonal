import { UserRepository } from "../Domain/Ports/user.repository.js";

export class ChangePassword {
  constructor(private userRepository: UserRepository) { }

  async execute(email: string, newPassword: string): Promise<void> {
    const users = this.userRepository.getAll();
    const user = users.find(u => u.email === email);

    if (!user) {
      throw new Error("Usuario no encontrado");
    }

    user.changePassword(newPassword);
    await this.userRepository.update(user);
  }
}
