import * as Github from "../Exports";

export class PullRequestEvent {
	/*
	The action that was performed.
	Action can be one of “assigned”, “unassigned”, “labeled”, “unlabeled”, “opened”, “closed”, or “reopened”, or “synchronize”.
	If the action is “closed” and the merged key is false, the pull request was closed with unmerged commits.
	If the action is “closed” and the merged key is true, the pull request was merged. */
	action: string;
	number: number;
	pull_request: Github.PullRequest;
	repository: Github.Repository;
	//sender: Sender
}
