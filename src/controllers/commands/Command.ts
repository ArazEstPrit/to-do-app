import { inputDefinition, logError } from "../../views/consoleView.js";
import { prompt } from "../../views/consoleView.js";

export default class Command {
	constructor(
		public name: string,
		public description: string,
		public aliases: string[],
		public parameters: inputDefinition[],
		private action: (params: { [key: string]: string }) => void
	) {}

	async run(args: { [key: string]: string }): Promise<void> {
		for (const param of this.parameters) {
			const value = args[param.name] || args[param.char];

			const valid = param.condition ? param.condition(value || "") : true;

			if (value && valid !== true) {
				logError(valid as string);
			}

			if (
				value === undefined ||
				(!value && !param.optional) ||
				(value && valid !== true)
			) {
				args[param.name] = await prompt(param);
			} else if (value === "" && param.optional) {
				args[param.name] = null;
			} else {
				args[param.name] = value;
			}
		}

		this.action(args);
	}
}
