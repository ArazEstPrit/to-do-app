import cliController from "../cliController.js";
import { formatCommand, formatText, log } from "../../views/consoleView.js";
import Command from "./Command.js";

export default new Command("help", "List all commands", ["h"], [], () => {
	console.log(formatText("Commands:", "bold"));
	const commands = cliController.getCommandInfo();
	for (const command of commands) {
		log("\n" + formatCommand(command));
	}
});
