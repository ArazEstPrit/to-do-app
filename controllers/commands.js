import { createTask } from "../services/taskService.js";
import { viewTasks } from "../views/consoleView.js";

const COMMANDS = [
	{
		keywords: ["add", "a"],
		action: createTask,
	},
	{
		keywords: ["view", "v"],
		action: viewTasks,
	}
];

export function getCommand(keyword) {
	return COMMANDS.find(command => command.keywords.includes(keyword));
}