import Command from "./commands/Command.js";
import AddTaskCommand from "./commands/AddTaskCommand.js";
import CompleteTaskCommand from "./commands/CompleteTaskCommand.js";
import RevertTaskCommand from "./commands/RevertTaskCommand.js";
import DeleteTaskCommand from "./commands/DeleteTaskCommand.js";
import EditTaskCommand from "./commands/EditTaskCommand.js";
import HelpCommand from "./commands/HelpCommand.js";
import ListTasksCommand from "./commands/ListTasksCommand.js";
import ViewTaskCommand from "./commands/ViewTaskCommand.js";
import OpenWebViewCommand from "./commands/OpenWebViewCommand.js";
import { logError } from "../views/console/logging.js";

class CliController {
	private commands: Command[] = [
		AddTaskCommand,
		ViewTaskCommand,
		EditTaskCommand,
		CompleteTaskCommand,
		RevertTaskCommand,
		DeleteTaskCommand,
		ListTasksCommand,
		OpenWebViewCommand,
		HelpCommand,
	];

	run(args: string[]) {
		if (args.length === 0) {
			HelpCommand.run({});
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

	private parseCommandLineFlags(args: string[]): {
		[key: string]: string | boolean;
	} {
		const parsedArgs: { [key: string]: string | boolean } = {};

		for (let i = 0; i < args.length; i++) {
			const currentArg = args[i];
			const nextArg = args[i + 1] ?? "-";

			if (!currentArg.startsWith("-")) continue;

			if (!nextArg.startsWith("-")) {
				parsedArgs[currentArg.replace(/-/g, "")] = nextArg;
				i++;
			} else {
				parsedArgs[currentArg.replace(/-/g, "")] = true;
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

	public getCommandInfo(): Partial<Command>[] {
		return this.commands.map(command => ({ ...command, run: undefined }));
	}
}

export default new CliController();
