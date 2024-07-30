import taskController from "../taskController.js";
import taskService from "../../services/taskService.js";
import { prompt } from "../../views/console/prompting.js";
import Command from "./Command.js";

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
