import { User } from "../../Domain/Entities/user.js";
import { UserRepository } from "../../Domain/Ports/user.repository.js";

type MemoryUser = User & {
	id: number;
	createdAt: string;
};

export class InMemoryUserRepository implements UserRepository {
	private users: MemoryUser[] = [];
	private nextId = 1;

	getAll(): User[] {
		return this.users;
	}

	create(user: User): User {
		const storedUser = Object.assign(Object.create(User.prototype), user) as MemoryUser;
		storedUser.id = this.nextId++;
		storedUser.createdAt = new Date().toISOString();

		this.users.push(storedUser);
		return storedUser;
	}

	delete(id: number): void {
		this.users = this.users.filter((user) => user.id !== id);
	}

	async update(user: User): Promise<void> {
		const index = this.users.findIndex((u) => u.email === user.email);
		if (index !== -1) {
			this.users[index] = Object.assign(Object.create(User.prototype), this.users[index], user);
		}
	}
}
