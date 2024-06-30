import AddTaskCommand from "../commands/AddTaskCommand";
import Command from "../commands/Command";
import DeleteTaskCommand from "../commands/DeleteTaskCommand";
import EditTaskCommand from "../commands/EditTaskCommand";
import ListTasksCommand from "../commands/ListTasksCommand";
import ViewTaskCommand from "../commands/ViewTaskCommand";
import { logError } from "../views/consoleView";

class CliController {
	private commands: Command[] = [
		AddTaskCommand,
		ViewTaskCommand,
		DeleteTaskCommand,
		ListTasksCommand,
		EditTaskCommand,
	];

	run(args: string[]) {
		if (args.length === 0) {
			logError("Please provide a command");
			return;
		}

		const command = this.getCommand(args[0]);

		if (!command) {
			logError("Command not found");
			return;
		}

		let parameters = {};
		if (args.length > 1) {
			parameters = this.parseCommandLineFlags(args);
		}

		command.run(parameters);
	}

	private parseCommandLineFlags(args: string[]): { [key: string]: string } {
		const parsedArgs: { [key: string]: string } = {};

		for (let i = 0; i < args.length; i++) {
			const currentArg = args[i];
			const nextArg = args[i + 1] ?? "-";

			if (currentArg.startsWith("-") && !nextArg.startsWith("-")) {
				parsedArgs[currentArg.replace(/-/g, "")] = nextArg;
				i++;
			}
		}

		return parsedArgs;
	}

	private getCommand(keyword: string): Command | undefined {
		return this.commands.find(
			command =>
				command.aliases.includes(keyword) || command.name === keyword
		);
	}
}

export default new CliController();
