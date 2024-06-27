import taskController from "../controllers/taskController";
import taskService from "../services/taskService";
import { formatTask } from "../views/consoleView";
import Command from "./Command";

export default new Command(
	"view",
	"View a specified task",
	["v"],
	[taskService.taskId],
	({ id }) => {
		const task = taskController.findTask(parseInt(id));

		if (!task) {
			return;
		}

		console.log(formatTask(task));
	}
);
