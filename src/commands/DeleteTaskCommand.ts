import taskController from "../controllers/taskController";
import taskService from "../services/taskService";
import Command from "./Command";

export default new Command(
	"delete",
	"Delete a task",
	["d", "c", "complete"],
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
		taskController.deleteTask(name, dueDate);
	}
);
