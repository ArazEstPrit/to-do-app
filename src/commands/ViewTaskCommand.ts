import { viewTasks } from "../views/consoleView";
import Command from "./Command";

export default new Command(
	"view",
	"View all tasks, or all tags with a specific tag",
	["v"],
	[
		{
			name: "tag",
			char: "t",
			optional: true,
		},
	],
	({ tag }) => viewTasks(tag)
);
