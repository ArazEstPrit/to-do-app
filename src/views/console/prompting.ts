import { formatText } from "./formatting.js";
import { logError } from "./logging.js";

export interface inputDefinition {
	name: string;
	char?: string;
	type: "string" | "date" | "boolean";
	condition?: (value: string) => boolean | string;
	optional?: boolean;
	default?: string;
	ask?: boolean;
}

export async function prompt(prompt: inputDefinition): Promise<string> {
	if (prompt.type === "string") {
		return await promptText(prompt);
	} else if (prompt.type === "date") {
		return await promptDate(prompt);
	}
}

async function promptText(prompt: inputDefinition): Promise<string> {
	if (prompt.type !== "string") throw new Error("Invalid prompt type");

	// I am not using readline here because when it treats the terminal like a
	// tty, stuff breaks. But if I make it a non-tty (old implementation), it is
	// literally impossible to make the default value editable by the user. So I
	// guess I am stuck with handling everything manually. I could also just use
	// a library, but where is the fun in that?

	process.stdout.write(buildPromptText(prompt));

	process.stdin.setRawMode(true);
	process.stdin.resume();
	process.stdin.setEncoding("utf8");

	return await validateInput(prompt, await handleTextInput(prompt.default));
}

async function validateInput(
	promptDef: inputDefinition,
	input: string
): Promise<string> {
	const validationResult = promptDef.condition
		? promptDef.condition(input)
		: true;

	const isSkipped = promptDef.optional && input === "";

	const isValid = validationResult === true || isSkipped;

	if (isValid) {
		process.stdout.clearLine(1);

		process.stdin.removeAllListeners("data");
		process.stdin.setRawMode(false);
		process.stdin.pause();

		return input;
	} else {
		process.stderr.clearLine(1);
		logError(validationResult as string);

		// Move cursor up 2 lines to jump to the original prompt, and clear
		// the line to overwrite it
		process.stdout.moveCursor(0, -2);
		process.stdout.clearLine(1);

		return prompt(promptDef);
	}
}

function buildPromptText(prompt: inputDefinition): string {
	const formattedOptionalText = formatText(
		prompt.optional ? " (optional)" : "",
		"dim"
	);
	const formattedPromptText = formatText(
		prompt.name + formattedOptionalText + ": ",
		"italic",
		"gray"
	);
	return formattedPromptText;
}

function handleTextInput(defaultValue: string): Promise<string> {
	const inputBuffer = String(defaultValue || "").split("") || [];
	let cursorIndex = inputBuffer.length;

	const SPECIAL_CHARS = {
		"\u0003": () => {
			process.stdin.setRawMode(false);
			process.exit(1);
		},
		"\u001b": resolve => {
			process.stdout.write("\n");
			resolve("");
		},
		"\u001b[C": () => {
			if (cursorIndex === inputBuffer.length) return;

			cursorIndex++;
			process.stdout.moveCursor(1, 0);
		},
		"\u001b[D": () => {
			if (cursorIndex === 0) return;

			cursorIndex--;
			process.stdout.moveCursor(-1, 0);
		},
		"\u001b[1;5C": () => {
			let i = 0;
			if (inputBuffer[cursorIndex] === " ") {
				i++;
				cursorIndex++;
			}
			while (
				inputBuffer[cursorIndex] &&
				inputBuffer[cursorIndex] !== " "
			) {
				i++;
				cursorIndex++;
			}
			process.stdout.moveCursor(i, 0);
		},
		"\u001b[1;5D": () => {
			let i = 0;
			if (inputBuffer[cursorIndex - 1] === " ") {
				i--;
				cursorIndex--;
			}
			while (
				inputBuffer[cursorIndex - 1] &&
				inputBuffer[cursorIndex - 1] !== " "
			) {
				i--;
				cursorIndex--;
			}
			process.stdout.moveCursor(i, 0);
		},
		"\b": () => {
			if (cursorIndex === 0) return;

			inputBuffer.splice(cursorIndex - 1, 1);
			cursorIndex--;
			const afterCursor = inputBuffer.slice(cursorIndex).join("");
			process.stdout.write(`\u001b[1D${afterCursor}`);
			process.stdout.clearLine(1);
			process.stdout.write(
				afterCursor.length === 0 ? "" : `\u001b[${afterCursor.length}D`
			);
		},
		"\r": resolve => {
			process.stdout.write("\n");
			resolve(inputBuffer.join(""));
		},
	};

	return new Promise<string>(resolve => {
		process.stdin.on("data", (key: string) => {
			if (SPECIAL_CHARS[key]) {
				SPECIAL_CHARS[key](resolve);
				return;
			}

			if (key.includes("\u001b")) return;

			inputBuffer.splice(cursorIndex, 0, key);
			cursorIndex++;
			const afterCursor = inputBuffer.slice(cursorIndex).join("");

			process.stdout.write(
				key +
					afterCursor +
					(afterCursor.length === 0
						? ""
						: `\u001b[${afterCursor.length}D`)
			);
		});

		// For debugging
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		function helper() {
			const afterCursor = inputBuffer.slice(cursorIndex).join("");
			const test = `"${inputBuffer.join(
				""
			)}" ${cursorIndex} "${afterCursor}" ${afterCursor.length}`;
			process.stdout.write(
				`\u001b[1B\b \u001b[K${test}\u001b[1A\u001b[${test.length}D`
			);
		}

		if (inputBuffer.length > 0) {
			process.stdout.write(inputBuffer.join(""));
		}
	});
}

async function promptDate(prompt: inputDefinition): Promise<string> {
	if (prompt.type !== "date") throw new Error("Invalid prompt type");

	process.stdin.setRawMode(true);
	process.stdin.resume();
	process.stdin.setEncoding("utf8");

	return await validateInput(prompt, await handleDateInput(prompt));
}

function handleDateInput(prompt: inputDefinition): Promise<string> {
	let currentDate = prompt.default ? new Date(prompt.default) : new Date();
	let selectedPart = 0;
	const parts = ["weekday", "day", "month", "year"];

	refreshDate();

	const KEYS = {
		"\u0003": () => {
			process.stdin.setRawMode(false);
			process.exit(1);
		},
		"\r": resolve => {
			resolve(currentDate.toISOString());
			process.stdout.write("\n");
		},
		"\u001b": resolve => {
			resolve("");

			currentDate = null;
			refreshDate();
			process.stdout.clearLine(1);
			process.stdout.write("\n");
		},
		"\u001b[D": () => {
			selectedPart = (selectedPart - 1 + 4) % 4;
		},
		"\u001b[C": () => {
			selectedPart = (selectedPart + 1) % 4;
		},
		"\u001b[A": () => {
			currentDate = incrementDate(currentDate, parts[selectedPart], 1);
		},
		"\u001b[B": () => {
			currentDate = incrementDate(currentDate, parts[selectedPart], -1);
		},
	};

	return new Promise<string>(resolve => {
		process.stdin.on("data", (key: string) => {
			if (KEYS[key]) {
				KEYS[key](resolve);

				if (!["\r", "\u001b", "\u0003"].includes(key)) {
					refreshDate();
				}
			}
		});
	});

	function refreshDate() {
		process.stdout.write(
			"\r" +
				buildPromptText(prompt) +
				formatDate(currentDate, selectedPart)
		);
	}
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

function formatDate(date: Date, selectedPart: number): string {
	if (date == null) return formatText("no due date", "dim");

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
	const year = date.getFullYear() + "";
	const formattedDate = [dayOfWeek, day, month, year];
	formattedDate[selectedPart] = formatText(
		formattedDate[selectedPart],
		"reverse"
	);

	return formattedDate.join(" ");
}
