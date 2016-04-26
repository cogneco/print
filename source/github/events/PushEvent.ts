import * as Github from "../Exports";

export class PushEvent  {
	compare: string;
	head_commit: Github.Commit;
	repository: Github.Repository;
}
