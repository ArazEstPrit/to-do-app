import cliController from "../cliController";
import { formatCommand, formatText, log } from "../../views/consoleView";
import Command from "./Command";

export default new Command("help", "List all commands", ["h"], [], () => {
	console.log(formatText("Commands:", "bold"));
	const commands = cliController.getCommandInfo();
	for (const command of commands) {
		log("\n" + formatCommand(command));
	}
});