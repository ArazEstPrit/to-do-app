// import { getTasks } from "../services/taskService";
import readline from "readline/promises";
import Task from "../models/task";
import taskService from "../services/taskService";

const styleCodes: { [key: string]: string } = {
	bold: "1",
	dim: "2",
	italic: "3",
	underline: "4",
	blink: "5",
	reverse: "7",
	strikethrough: "9",
	black: "30",
	red: "31",
	green: "32",
	yellow: "33",
	blue: "34",
	purple: "35",
	cyan: "36",
	lightGray: "37",
	gray: "90",
	lightRed: "91",
	lightGreen: "92",
	lightYellow: "93",
	lightBlue: "94",
	lightPurple: "95",
	lightCyan: "96",
	white: "97",
};

function formatText(text: string, ...styles: string[]): string {
	const selectedStyles = styles
		.map(style => styleCodes[style])
		.filter(Boolean)
		.join(";");

	return `\x1b[${selectedStyles}m${text}\x1b[0m`;
}

// These two functions are very simple for now, but I'll expand on them later.
export function log(msg: string) {
	console.log(msg);
}

export function logError(msg: string) {
	console.error(formatText(msg, "lightRed"));
}

export const DATE_FORMAT: Intl.DateTimeFormatOptions = {
	weekday: "short",
	day: "2-digit",
	month: "short",
	year: "numeric",
};

export function listTasks(tagFilter: string | undefined) {
	const tasks = taskService
		.getTasks()
		.map(task => ({
			...task,
			dueDate: task.dueDate
				? new Date(task.dueDate).toLocaleDateString(
						undefined,
						DATE_FORMAT
				  )
				: "",
		}))
		.filter(task => !tagFilter || task.tags.includes(tagFilter))
		.reduce((acc, { id, ...x }) => {
			acc[id] = x;
			return acc;
		}, {});

	if (Object.keys(tasks).length === 0) {
		log("No tasks found");
	} else {
		console.table(tasks);
	}
}

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
		const formattedDefaultText = prompt.default
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

export function formatTask(task: Task): string {
	const name = formatText(task.name, "bold");
	const id = formatText("#" + task.id.toString(), "gray", "italic");
	const description = task.description ?? "";
	const dueDate = task.dueDate
		? formatText(
				new Date(task.dueDate).toLocaleDateString(
					undefined,
					DATE_FORMAT
				),
				"italic"
		  )
		: "";
	const tags =
		task.tags.length > 0
			? `[${task.tags
					.map(tag => formatText(tag, "lightCyan"))
					.join(", ")}]`
			: formatText("no tags", "dim");

	const score =
		formatText("" + task.effort, "lightRed") +
		":" +
		formatText("" + task.importance, "cyan") +
		" - " +
		formatText("" + task.priorityScore, "lightGreen");

	return [
		[name, id].join(" "),
		description,
		dueDate,
		tags,
		task.effort || task.importance ? score : "",
	]
		.filter(detail => detail !== "")
		.join("\n");
}
