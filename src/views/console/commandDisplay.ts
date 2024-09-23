import Command from "../../controllers/commands/Command.js";
import { formatText } from "./formatting.js";
import { inputDefinition } from "./prompting.js";

export function displayCommand(command: Partial<Command>): string {
	const formatParameter = (parameter: inputDefinition): string => {
		return parameter.optional || parameter.ask === false
			? `[${parameter.name}|${parameter.char}]`
			: `<${parameter.name}|${parameter.char}>`;
	};

	const commandName = formatText(command.name, "italic", "lightCyan");
	const commandAliases = command.aliases
		.map(alias => formatText(alias, "italic", "lightCyan"))
		.join("|");
	const commandDescription = command.description
		? `${command.description}\n`
		: "";
	const commandParameters =
		command.parameters.length > 0
			? `${formatText("Parameters:", "dim")} ${command.parameters
					.map(formatParameter)
					.join(" ")}`
			: "";

	return `${commandName} - ${commandAliases}\n${commandDescription}${commandParameters}`;
}
