import readline from "readline";
import { formatText } from "./formatting.js";
import { logError } from "./logging.js";

export interface inputDefinition {
	name: string;
	char?: string;
	type: "string" | "date";
	condition?: (value: string) => boolean | string;
	optional?: boolean;
	default?: string;
	ask?: boolean;
}

export async function prompt(prompt: inputDefinition): Promise<string> {
	process.stdout.clearLine(1);
	const rl = readline.createInterface({
		input: process.stdin,
		output: process.stdout,
		terminal: false,
	});

	async function askForInput(): Promise<string> {
		let input: string;

		if (prompt.type === "string") {
			input = (
				await new Promise<string>(resolve =>
					rl.question(buildPromptText(), resolve)
				)
			).trim();
		} else if (prompt.type === "date") {
			input = await handleDateInput();
			process.stdin.setRawMode(false);
			process.stdout.write("\n");
		}

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
			prompt.default &&
			prompt.default.length !== 0 &&
			prompt.type === "string"
				? formatText(` [${prompt.default}]`, "italic", "dim", "gray")
				: "";
		const formattedPromptText =
			formattedName +
			formattedOptionalText +
			formattedDefaultText +
			formatText(": ", "italic", "gray");
		return formattedPromptText;
	}

	async function handleDateInput(): Promise<string> {
		let currentDate = prompt.default
			? new Date(prompt.default)
			: new Date();
		let selectedPart = 0;
		const parts = ["weekday", "day", "month", "year"];

		function displayDate() {
			const dateStr = formatDate(currentDate);
			const formattedDate = formatWithUnderline(dateStr, selectedPart);
			process.stdout.write("\r" + buildPromptText() + formattedDate);
		}

		function formatDate(date: Date): string {
			const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
			const months = [
				"Jan",
				"Feb",
				"Mar",
				"Apr",
				"May",
				"Jun",
				"Jul",
				"Aug",
				"Sep",
				"Oct",
				"Nov",
				"Dec",
			];
			const dayOfWeek = weekdays[date.getDay()];
			const day = String(date.getDate()).padStart(2, "0");
			const month = months[date.getMonth()];
			const year = date.getFullYear();
			return `${dayOfWeek} ${day} ${month} ${year}`;
		}

		function formatWithUnderline(
			dateStr: string,
			selected: number
		): string {
			const parts = dateStr.split(" ");
			parts[selected] = formatText(
				parts[selected],
				"underline",
				"grayUnderline"
			);
			return parts.join(" ");
		}

		readline.emitKeypressEvents(process.stdin);
		process.stdin.setRawMode(true);

		displayDate();

		const promise = new Promise<string>(resolve => {
			process.stdin.on("keypress", (_, key) => {
				_;
				if (key.ctrl && key.name === "c") {
					process.stdin.setRawMode(false);
					process.exit(1);
				}

				if (key.name === "return") {
					resolve(currentDate.toISOString());
					return;
				}

				if (key.name === "escape") {
					rl.close();
					resolve("");
					return;
				}

				const keys = {
					left: () => {
						selectedPart = (selectedPart - 1 + 4) % 4;
					},
					right: () => {
						selectedPart = (selectedPart + 1) % 4;
					},
					up: () => {
						currentDate = incrementDate(
							currentDate,
							parts[selectedPart],
							1
						);
					},
					down: () => {
						currentDate = incrementDate(
							currentDate,
							parts[selectedPart],
							-1
						);
					},
				};

				if (keys[key.name]) {
					keys[key.name]();

					process.stdout.clearLine(0);
					displayDate();
				}
			});
		});

		return await promise;
	}

	function incrementDate(date: Date, part: string, amount: number): Date {
		if (part == "weekday" || part == "day") {
			return new Date(date.setDate(date.getDate() + amount));
		} else if (part == "month") {
			return new Date(date.setMonth(date.getMonth() + amount));
		} else if (part == "year") {
			return new Date(date.setFullYear(date.getFullYear() + amount));
		}
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
