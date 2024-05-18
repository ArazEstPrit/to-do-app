import { log } from "./views/consoleView";
import { getCommand } from "./controllers/commands";

let parameters = process.argv.slice(2);

if (parameters.length < 1) {
	log("Please provide a command");
	process.exit(1);
}

let matchedCommand = getCommand(parameters[0]);

if (!matchedCommand) {
	log("Command not found");
} else {
	matchedCommand.action(...parameters.slice(1));
}
