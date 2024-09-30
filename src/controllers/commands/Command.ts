import { inputDefinition } from "../../views/console/prompting.js";
import { prompt } from "../../views/console/prompting.js";

export default class Command {
	constructor(
		public name: string,
		public description: string,
		public aliases: string[],
		public parameters: inputDefinition[],
		private action: (params: { [key: string]: string | boolean }) => void
	) {}

	async run(args: { [key: string]: string | boolean }): Promise<void> {
		for (const param of this.parameters) {
			let value: string | boolean = args[param.name] || args[param.char];

			if (param.type !== "boolean" && typeof value === "boolean") {
				value = undefined;
			}

			const valid = param.condition
				? param.condition(String(value) || "")
				: true;

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
