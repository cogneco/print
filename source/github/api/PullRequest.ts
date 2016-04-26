import * as Configuration from "../../configuration/Exports";
import * as Github from "../Exports";

import * as https from "https";
import * as url from "url";

export class PullRequest {
	static queryOpenPullRequests(organization: string, repository: string, onFinishedCallback: (result: Github.PullRequest[]) => void) {
		var buffer: string = ""
		var options = {
			hostname: "api.github.com",
			path: "/repos/" + organization + "/" + repository + "/pulls?state=open",
			method: "GET",
			headers: { "User-Agent": "print", "Authorization": "token " + Configuration.ServerConfiguration.getServerConfig().getAuthorizationToken() }
		};
		https.request(options, (response: any) => {
			response.on("data", (chunk: string) => {
				buffer += chunk;
			});
			response.on("error", (error: any) => {
				console.log("ERROR:", error.toString());
			});
			response.on("end", () => {
				onFinishedCallback(<Github.PullRequest[]>JSON.parse(buffer));
			});
		}).end();
	}
	static getTeamMembers(onFinishedCallback: (result: Github.User[]) => void) {
		PullRequest.getTeamID((teamID: string) => {
			var buffer: string = "";
			var options = {
				hostname: "api.github.com",
				path: "/teams/" + teamID + "/members",
				method: "GET",
				headers: { "User-Agent": "print", "Authorization": "token " + Configuration.ServerConfiguration.getServerConfig().getAuthorizationToken() }
			};
			https.request(options, (response: any) => {
				response.on("data", (chunk: string) => {
					buffer += chunk
				});
				response.on("error", (error: any) => {
					console.log("ERROR:", error.toString());
				});
				response.on("end", () => {
					var userList = <Github.User[]>JSON.parse(buffer);
					onFinishedCallback(userList);
				});
			}).end();
		});
	}
	static getTeamID(onFinishedCallback: (teamID: string) => void) {
		var serverConfig = Configuration.ServerConfiguration.getServerConfig();
		var buffer: string = "";
		var options = {
			hostname: "api.github.com",
			path: "/orgs/" + serverConfig.getAuthorizationOrganization() + "/teams",
			method: "GET",
			headers: { "User-Agent": "print","Authorization": "token " + serverConfig.getAuthorizationToken()},
		};
		https.request(options, (response: any) => {
			response.on("data", (chunk: string) => {
				buffer += chunk
			});
			response.on("error", (error: any) => {
				console.log("ERROR:", error.toString());
			});
			response.on("end", () => {
				var teamList = <Github.Team[]>JSON.parse(buffer);
				teamList = teamList.filter((team) => {
					return team.name == serverConfig.getAuthorizationTeam();
				});
				onFinishedCallback(teamList[0].id);
			});
		}).end();
	}
	static updateStatus(state: string, description: string, status_url: string, target_url: string) {
		if (Configuration.ServerConfiguration.getServerConfig().getPostToGithub()) {
			var post_data = JSON.stringify({
				"state": state,
				"target_url": target_url,
				"description": description,
				"context": "PRInt"
			});
			var parsedPath = url.parse(status_url).pathname;
			var post_options = {
				host: "api.github.com",
				path: parsedPath,
				method: "POST",
				headers: {
					"User-Agent": "print",
					"Accept": "application/json",
					"Content-Type": "application/json",
					"Content-Length": Buffer.byteLength(post_data),
					"Authorization": "token " + Configuration.ServerConfiguration.getServerConfig().getAuthorizationToken()
				}
			};
			var post_request = https.request(post_options, (resp: any) => {
				if (resp.statusCode != 201)
					console.log("Failed when posting status to github. Status " + resp.statusCode + " was returned")
			}).on("error", (error: any) => {
				console.log("Failed when posting status to github with error: " + error);
			});
			post_request.write(post_data);
			post_request.end();
		}
	}
}
