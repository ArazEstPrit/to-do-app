import { createTask, deleteTask } from "../services/taskService";
import { viewTasks } from "../views/consoleView";

interface Command {
  keywords: string[];
  action: (...args: string[]) => void;
}

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

export function getCommand(keyword: string): Command | undefined {
	return COMMANDS.find(command => command.keywords.includes(keyword));
}
