import { inputDefinition } from "../../views/console/prompting.js";
import { logError } from "../../views/console/logging.js";
import { prompt } from "../../views/console/prompting.js";

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

			if (value !== undefined) {
				if (valid === true) {
					args[param.name] = value;
				} else {
					args[param.name] = await prompt(param);
				}
			} else {
				if (param.ask === false) {
					args[param.name] = param.default || null;
				} else {
					args[param.name] = await prompt(param);
				}
			}
		}

		this.action(args);
	}
}
