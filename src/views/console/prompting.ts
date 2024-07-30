import readline from "readline/promises";
import { formatText } from "./formatting.js";
import { logError } from "./logging.js";

export interface inputDefinition {
	name: string;
	char?: string;
	condition?: (value: string) => boolean | string;
	optional?: boolean;
	default?: string;
}

export async function prompt(prompt: inputDefinition): Promise<string> {
	process.stdout.clearLine(1);
	const rl = readline.createInterface({
		input: process.stdin,
		output: process.stdout,
		terminal: false,
	});

	async function askForInput(): Promise<string> {
		const input = (await rl.question(buildPromptText())).trim();

		if (prompt.default && input === "") {
			return prompt.default;
		}

		return input;
	}

	function buildPromptText(): string {
		const formattedName = formatText(prompt.name, "italic", "gray");
		const formattedOptionalText = formatText(
			prompt.optional ? " (optional)" : "",
			"italic",
			"dim",
			"gray"
		);
		const formattedDefaultText =
			prompt.default && prompt.default.length !== 0
				? formatText(` [${prompt.default}]`, "italic", "dim", "gray")
				: "";
		const formattedPromptText =
			formattedName +
			formattedOptionalText +
			formattedDefaultText +
			formatText(": ", "italic", "gray");
		return formattedPromptText;
	}

	async function validateInput(input: string): Promise<string> {
		const validationResult = prompt.condition
			? prompt.condition(input)
			: true;

		const isSkipped = prompt.optional && input === "";

		const isValid = validationResult === true || isSkipped;

		if (isValid) {
			rl.close();
			process.stdout.clearLine(1);
			return input;
		} else {
			process.stderr.clearLine(1);
			logError(validationResult as string);

			process.stdout.moveCursor(0, -2);
			process.stdout.clearLine(1);

			return await validateInput(await askForInput());
		}
	}

	return await validateInput(await askForInput());
}
