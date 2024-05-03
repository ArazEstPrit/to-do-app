import { createTask, deleteTask } from "../services/taskService.js";
import { viewTasks } from "../views/consoleView.js";

const COMMANDS = [
	{
		keywords: ["add", "a"],
		action: createTask,
	},
	{
		keywords: ["view", "v"],
		action: viewTasks,
	},
	{
		keywords: ["complete", "c", "delete", "d"],
		action: deleteTask,
	},
];

export function getCommand(keyword) {
	return COMMANDS.find(command => command.keywords.includes(keyword));
}
