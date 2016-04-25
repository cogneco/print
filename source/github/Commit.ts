import { Author } from "./Author";

export class Commit {
	message: string;
	timestamp: string;
	url: string;
	author: Author;
	committer: Author;
	added: string[];
	removed: string[];
	modified: string[];
}

