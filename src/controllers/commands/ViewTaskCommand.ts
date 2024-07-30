import taskService from "../../services/taskService.js";
import { displayTask } from "../../views/console/listTasks.js";
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

		console.log(displayTask(task));
	}
);
