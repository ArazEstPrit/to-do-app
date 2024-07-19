import readline from "readline/promises";
import Task from "../models/task";
import taskService from "../services/taskService";
import Command from "../controllers/commands/Command";

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

const formatters: { [K in keyof Task]: (value: Task[K]) => string } = {
	id: id => formatText(`#${id}`, "gray", "italic"),
	name: name => formatText(name, "bold"),
	dueDate: dueDate =>
		dueDate
			? formatText(
					new Date(dueDate).toLocaleDateString(
						undefined,
						DATE_FORMAT
					),
					"italic"
			  )
			: formatText("no due date", "dim"),
	description: description => description || "",
	tags: tags =>
		tags.length > 0
			? `[${tags.map(tag => formatText(tag, "lightCyan")).join(", ")}]`
			: formatText("no tags", "dim"),
	effort: effort => formatText(`${effort}`, "lightRed"),
	importance: importance => formatText(`${importance}`, "cyan"),
	priorityScore: score => formatText(`${score}`, "lightGreen"),
};

export function formatText(text: string, ...styles: string[]): string {
	const selectedStyles = styles
		.map(style => styleCodes[style])
		.filter(Boolean)
		.join(";");

	return `\x1b[${selectedStyles}m${text}\x1b[0m`;
}

function removeFormatting(text: string): string {
	return text.replace(/\x1b\[.*?m/g, "");
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
		.filter(task => !tagFilter || task.tags.includes(tagFilter));

	if (Object.keys(tasks).length === 0) {
		log("No tasks found");
	} else {
		printTable(tasks, [
			"id",
			"name",
			"dueDate",
			"description",
			"tags",
			"effort",
			"importance",
			"priorityScore",
		]);
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

export function formatTask(task: Task): string {
	const name = formatters.name(task.name);
	const id = formatters.id(task.id);
	const description = formatters.description(task.description);
	const dueDate = formatters.dueDate(task.dueDate);
	const tags = formatters.tags(task.tags);

	const score =
		formatters.effort(task.effort) +
		":" +
		formatters.importance(task.importance) +
		" - " +
		formatters.priorityScore(task.effort + task.importance);

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

export function formatCommand(command: Partial<Command>): string {
	const formatParameter = (parameter: inputDefinition): string => {
		return parameter.optional
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

function printTable(data: object[], headers: string[], columnGap = "  ") {
	const styleCell = (header: string, cell: unknown) =>
		formatters[header] ? formatters[header](cell) : String(cell);

	const getPadding = (value: string, maxLength: number) =>
		" ".repeat(maxLength - value.length);

	const getUnformattedStyle = (header: string, cell: unknown) =>
		removeFormatting(styleCell(header, cell));

	const columnLengths = headers.reduce(
		(acc, header) => ({
			...acc,
			[header]: Math.max(
				header.length,
				...data.map(
					row => getUnformattedStyle(header, row[header]).length
				)
			),
		}),
		{}
	);

	const headerRow = formatText(
		headers
			.map(
				header =>
					header.charAt(0).toUpperCase() +
					header.substring(1) +
					getPadding(header, columnLengths[header])
			)
			.join(columnGap),
		"bold",
		"underline"
	);

	const rows = data
		.map(row =>
			headers
				.map(
					header =>
						styleCell(header, row[header]) +
						getPadding(
							getUnformattedStyle(header, row[header]),
							columnLengths[header]
						)
				)
				.join(columnGap)
		)
		.join("\n");

	log(headerRow);
	log(rows);
}
