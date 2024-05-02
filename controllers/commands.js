import { createTask } from "../services/taskService.js";

const COMMANDS = [
	{
		keywords: ["add", "a"],
		action: createTask,
	},
];

export function getCommand(keyword) {
	return COMMANDS.find(command => command.keywords.includes(keyword));
}