import * as Configuration from "../configuration/Exports";
import { JobQueue } from "./JobQueue";

export class JobQueueHandler {
	private jobQueues: JobQueue[];
	private runningJobQueues: number;
	private currentlyRunning: JobQueue[];
	constructor() {
		this.jobQueues = [];
		this.runningJobQueues = 0;
		this.currentlyRunning = [];
	}
	addJobQueue(jobQueue: JobQueue) {
		if (this.runningJobQueues < Configuration.ServerConfiguration.getServerConfig().getMaxRunningJobQueues()) {
			this.runningJobQueues++;
			this.currentlyRunning.push(jobQueue);
			jobQueue.runJobs(this.onJobQueueDone.bind(this));
		}
		else {
			this.jobQueues.push(jobQueue);
		}
		this.printStatus()
	}
	onJobQueueDone(id: string) {
		var queueRemoved: boolean = false;
		this.currentlyRunning = this.currentlyRunning.filter((localQueue) => {
			if (id == localQueue.getId())
				queueRemoved = true;
			else
				return true;
		});
		if (queueRemoved) {
			if (this.jobQueues.length > 0) {
				var jobQueueToRun = this.jobQueues.shift();
				this.currentlyRunning.push(jobQueueToRun);
				jobQueueToRun.runJobs(this.onJobQueueDone.bind(this));
			}
			else if (this.runningJobQueues >= 0) {
				this.runningJobQueues--;
			}
		}
		this.printStatus();
	}
	abortQueue(queue: JobQueue) {
		if (queue.isRunning()) {
			queue.abortRunningJobs();
			this.printStatus();
		}
		this.jobQueues = this.jobQueues.filter((localQueue) => {
			return queue.getName() != localQueue.getName();
		});
	}
	printStatus() {
		if (this.runningJobQueues > 0) {
			var jobsNow = "";
			this.currentlyRunning.forEach(localQueue => {
				jobsNow = jobsNow == "" ? localQueue.getName() : jobsNow + ", " + localQueue.getName()
			});
			console.log("");
			console.log("Running " + this.runningJobQueues.toString() + " job queues: " + jobsNow);
		}
		if (this.jobQueues.length > 0) {
			var jobsLater = "";
			this.jobQueues.forEach(localQueue => {
				jobsLater = jobsLater == "" ? localQueue.getName() : jobsLater + ", " + localQueue.getName()
			});
			console.log("Another " + this.jobQueues.length.toString() + " are waiting: " + jobsLater);
		} else {
			console.log("No future job queues waiting.");
		}
		console.log("");
	}
}