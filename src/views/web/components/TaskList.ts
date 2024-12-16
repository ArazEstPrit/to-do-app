import { h } from "../utils.js";
import { fetchJSON } from "../utils/fetch.js";
import { DATE_FORMAT } from "../../console/formatting.js";
import Task from "../../../models/task.js";

export async function TaskList() {
	const tasks = await fetchJSON("/api/tasks");

	if (tasks.length === 0) {
		return h("p", {}, "No tasks found");
	}

	return h(
		"div",
		{ className: "task-list" },
		...tasks.filter(task => !task.completed).map(task => TaskItem(task))
	);
}

function TaskItem(task: Task): HTMLElement {
	return h(
		"div",
		{ className: "item" },
		h("div", { className: "id" }, `#${task.id}`),
		h(
			"div",
			{ className: "name-description" },
			h("div", { className: "name" }, task.name),
			DescriptionButton()
		),
		h(
			"div",
			{ className: "due-date" },
			task.dueDate
				? new Date(task.dueDate).toLocaleDateString(
						undefined,
						DATE_FORMAT
				  )
				: ""
		),
		h(
			"div",
			{ className: "mini-score" },
			h("div", { className: "effort" }, task.effort + ""),
			":",
			h("div", { className: "importance" }, task.importance + ""),
			"-",
			h("div", { className: "score" }, task.priorityScore + "")
		)
	);
}

function DescriptionButton() {
	return h(
		"div",
		{
			className: "description-button",
		},
		h("div", { className: "dot" }),
		h("div", { className: "dot" }),
		h("div", { className: "dot" })
	);
}
