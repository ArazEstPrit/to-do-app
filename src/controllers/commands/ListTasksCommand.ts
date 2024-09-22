import { listTasks } from "../../views/console/listTasks.js";
import Command from "./Command.js";

export default new Command(
	"list",
	"List all tasks, or all tags with a specific tag",
	["l"],
	[
		{
			name: "tag",
			char: "t",
			type: "string",
			optional: true,
		},
	],
	({ tag }) => listTasks(tag)
);
