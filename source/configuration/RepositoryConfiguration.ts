import * as ChildProcess from "../childprocess/Exports";

export class RepositoryConfiguration {
	name: string;
	secondary: string;
	secondaryUpstream: string;
	actions: ChildProcess.Action[] = []
	constructor() {
	}
}
