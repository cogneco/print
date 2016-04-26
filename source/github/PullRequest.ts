import { User } from "./User";
import { Fork } from "./Fork";
import { Label } from "./Label";

export class PullRequest {
	url: string;
	id: string;
	html_url: string;
	diff_url: string;
	number: number;
	state: string;
	title: string;
	user: User;
	body: string;
	created_at: string;
	updated_at: string;
	statuses_url: string;
	head: Fork;
	base: Fork;
	merged: boolean;
	commits: number;
	additions: number;
	deletions: number;
	changed_files: number;
	labels: Label[];
}
