import { watch } from "fs";
import { buildSite, openSite, startWebView } from "../webViewController.js";
import Command from "./Command.js";
import taskService, { TASK_FILE } from "../../services/taskService.js";

export default new Command(
	"open",
	"Open the web view",
	["o", "w"],
	[],
	async () => {
		await buildSite();
		await startWebView();
		openSite();

		watch(TASK_FILE, () => {
			taskService.loadTasks();
		});
	}
);
