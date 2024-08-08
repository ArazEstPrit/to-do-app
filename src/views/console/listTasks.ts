import Task from "../../models/task.js";
import taskService from "../../services/taskService.js";
import { removeFormatting, formatText, DATE_FORMAT } from "./formatting.js";
import { log } from "./logging.js";

export const formatters: {
	[K in keyof Task]: (value: Task[K]) => string;
} = {
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

export function displayTask(task: Task): string {
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
		formatters.priorityScore(task.priorityScore);

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
