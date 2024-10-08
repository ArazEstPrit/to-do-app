import taskController from "../taskController.js";
import taskService from "../../services/taskService.js";
import { prompt } from "../../views/console/prompting.js";
import Command from "./Command.js";

export default new Command(
	"edit",
	"Edit a task",
	["e"],
	[
		taskService.taskId,
		...taskService.taskDetails.map(input => ({ ...input, ask: false })),
	],
	async ({
		id,
		...params
	}: { id: string } & { [key: string]: string | boolean | undefined }) => {
		const task = taskService.findTask(parseInt(id));

		const changedTask = [];

		for (const input of taskService.taskDetails) {
			const formatter = {
				tags: (tags: string[]) => tags.join(" "),
			};

			input.default = task[input.name]
				? formatter[input.name]
					? formatter[input.name](task[input.name])
					: task[input.name]
				: undefined;

			changedTask.push(params[input.name] || (await prompt(input)));
		}

		taskController.editTask(id, changedTask);
	}
);
