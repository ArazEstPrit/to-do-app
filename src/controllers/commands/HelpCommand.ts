import cliController from "../cliController.js";
import { displayCommand } from "../../views/console/commandDisplay.js";
import { log } from "../../views/console/logging.js";
import { formatText } from "../../views/console/formatting.js";
import Command from "./Command.js";

export default new Command("help", "List all commands", ["h"], [], () => {
	console.log(formatText("Commands:", "bold"));
	const commands = cliController.getCommandInfo();
	for (const command of commands) {
		log("\n" + displayCommand(command));
	}
});
