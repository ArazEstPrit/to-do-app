import taskController from "../taskController";
import taskService from "../../services/taskService";
import { prompt } from "../../views/consoleView";
import Command from "./Command";

export default new Command(
	"edit",
	"Edit a task",
	["e"],
	[taskService.taskId],
	async ({ id }) => {
		const task = taskService.findTask(parseInt(id));
		const changedTask = [];

		for (const input of taskService.taskDetails) {
			const formatter = {
				dueDate: (date: Date) =>
					new Date(
						new Date(date).getTime() -
							new Date().getTimezoneOffset() * 60000
					)
						.toISOString()
						.split("T")[0],
				tags: (tags: string[]) => tags.join(" "),
			};

			input.default = task[input.name]
				? formatter[input.name]
					? formatter[input.name](task[input.name])
					: task[input.name]
				: undefined;
			changedTask.push(await prompt(input));
		}

		taskController.editTask(id, changedTask);
	}
);
