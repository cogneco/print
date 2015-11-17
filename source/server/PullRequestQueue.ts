/// <reference path="../../typings/node/node.d.ts" />
/// <reference path="../configuration/ServerConfiguration" />
/// <reference path="../github/events/PullRequestEvent" />
/// <reference path="../github/api/PullRequest" />
/// <reference path="PullRequest" />
/// <reference path="LocalServer" />

var crypt = require("crypto");

module Print.Server {
	export class PullRequestQueue {
		private requests: PullRequest[] = [];
		constructor(private name: string, private organization: string, /* do we want to hold this in memory? */ private token: string) {
			Github.Api.PullRequest.queryOpenPullRequests(organization, name, (requests: Server.PullRequest[]) => {
				this.requests = requests;
			});
		}
		process(name: string, request: any, response: any): boolean {
			var result: boolean;
			var buffer: string = "";
			if (result = (name == this.name)) {
				request.on("data", (chunk: any) => {
					buffer += chunk;
				});
				request.on("end", () => {
					var header = JSON.parse(JSON.stringify(request.headers));
					var serverSignature: string = header["x-hub-signature"].toString()
					if (this.verifySender(serverSignature, buffer)) {
						var eventData = <Github.Events.PullRequestEvent>JSON.parse(buffer);
						var pullRequest = this.find(eventData.pull_request.id);
						if (pullRequest) {
							pullRequest.tryUpdate(eventData.pull_request);
						} else {
							console.log(name + ": adding new pull request: " + eventData.pull_request.title + ", id: " + eventData.pull_request.id);
							this.requests.push(new PullRequest(eventData.pull_request));
						}
						LocalServer.sendResponse(response, 200, "OK");
					} else {
						console.log("Unauthorized sender");
					}
				});
			}
			return result;
		}
		private verifySender(serverSignature: string, payload: string): boolean {
			// TODO: secure compare?
			return "sha1=" + crypt.createHmac("sha1", this.token).update(payload).digest("hex") == serverSignature;
		}
		private find(pullRequestId: string): PullRequest {
			var result: PullRequest;
			this.requests.some(request => {
				if (request.getId() == pullRequestId) {
					result = request;
					return true;
				}
				return false;
			});
			return result;
		}
		private initializePullRequests(requests: PullRequest[]) {
			var result: PullRequest[] = []
			requests.forEach(request => {
				console.log("init PR: " + request.getTitle() + ", id: " + request.getId())
				result.push(request);
			})
			this.requests.concat(result);
		}
	}
}