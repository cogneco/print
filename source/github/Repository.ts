import { User } from "./User";

export class Repository {
	id: string;
	name: string;
	full_name: string;
	owner: User;
	private: boolean;
	fork: boolean;
	url: string;
	pulls_url: string;
}
