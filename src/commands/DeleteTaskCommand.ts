import taskController from "../controllers/taskController";
import Command from "./Command";

export default new Command(
	"delete",
	"Delete a task",
	["d", "c", "complete"],
	[
		{
			name: "name",
			char: "n",
			condition: (name: string): boolean | string =>
				name.trim() ? true : "Task name cannot be empty",
		},
	],
	({ name }) => {
		taskController.deleteTask(name);
	}
);
