import { User } from "./User";
import { Repository } from "./Repository"

export class Fork {
	label: string;
	ref: string;
	sha: string;
	user: User;
	repo: Repository;
}
