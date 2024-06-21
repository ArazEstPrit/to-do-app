import taskController from "../controllers/taskController";
import taskService from "../services/taskService";
import { formatTask } from "../views/consoleView";
import Command from "./Command";

export default new Command(
	"view",
	"View a specified task",
	["v"],
	[
		taskService.taskDetails[0],
		{
			name: "dueDate",
			char: "d",
			optional: true,
			condition: (date: string): boolean | string =>
				new Date(date).toString() === "Invalid Date"
					? "Invalid date"
					: true,
		},
	],
	({ name, dueDate }) => {
		const task = taskController.findTask(name, dueDate);

		if (!task) {
			return;
		}

		console.log(formatTask(task));
	}
);
