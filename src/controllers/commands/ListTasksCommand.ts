import { listTasks } from "../../views/consoleView";
import Command from "./Command";

export default new Command(
	"list",
	"List all tasks, or all tags with a specific tag",
	["l"],
	[
		{
			name: "tag",
			char: "t",
			optional: true,
		},
	],
	({ tag }) => listTasks(tag)
);
