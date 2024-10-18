import taskService from "../../services/taskService.js";
import { listTasks } from "../../views/console/listTasks.js";
import Command from "./Command.js";

export default new Command(
	"list",
	"List all tasks, or all tags with a specific tag",
	["l"],
	[
		{
			...taskService.taskDetails[3],
			name: "tag",
			ask: false,
			optional: true,
		},
		{
			name: "showCompleted",
			char: "c",
			type: "boolean",
			optional: true,
		},
		{
			name: "sortDueDate",
			char: "d",
			type: "boolean",
			optional: true,
		},
	],
	(props: { tag?: string; showCompleted?: boolean; sortDueDate?: boolean }) =>
		listTasks(props.tag, props.showCompleted, props.sortDueDate),
);
