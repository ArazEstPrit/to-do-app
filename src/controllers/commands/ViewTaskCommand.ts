import taskService from "../../services/taskService.js";
import { formatTask } from "../../views/consoleView.js";
import Command from "./Command.js";

export default new Command(
	"view",
	"View a specified task",
	["v"],
	[taskService.taskId],
	({ id }) => {
		const task = taskService.findTask(parseInt(id));

		if (!task) {
			return;
		}

		console.log(formatTask(task));
	}
);
