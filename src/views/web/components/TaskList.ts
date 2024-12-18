import { $, h } from "../utils.js";
import { fetchJSON } from "../utils/fetch.js";
import { DATE_FORMAT } from "../../console/formatting.js";
import Task from "../../../models/task.js";

let tasks: Task[];

export async function TaskList() {
	if (!tasks) {
		tasks = await fetchJSON("/api/tasks");
	}

	return h(
		"div",
		{ className: "task-list-container" },
		renderTaskListHeader(),
		h("div", { className: "task-list" }, ...renderTaskListItems())
	);
}

async function refreshTaskList() {
	const taskListElement = $(".task-list")[0];
	taskListElement.innerHTML = "";
	taskListElement.append(...renderTaskListItems());
}

function renderTaskListItems() {
	let filteredTasks = tasks;
	const taskListContainer = $(".task-list-container")[0];
	const containerClasses = taskListContainer?.classList || h("div").classList;

	if (containerClasses.contains("sort-date")) {
		filteredTasks.sort(
			(a, b) =>
				(new Date(a.dueDate!).getTime() || 0) -
				(new Date(b.dueDate!).getTime() || 0)
		);
	} else {
		filteredTasks.sort((a, b) => b.priorityScore - a.priorityScore);
	}

	const searchInput = $("#task-search")[0] as HTMLInputElement;
	const searchTerms = searchInput?.value.trim().toLowerCase().split(" ");
	if (searchTerms?.length) {
		filteredTasks = filteredTasks.filter(task =>
			searchTerms.every(
				term =>
					task.id === parseInt(term) ||
					task.name.toLowerCase().includes(term) ||
					(task.description?.toLowerCase().includes(term) ?? false) ||
					task.tags.some(tag => tag.toLowerCase().includes(term))
			)
		);
	}

	const activeTagFilters = $(".tags-filter")[0]
		? [...$(".tags-filter")[0].children].map(e => e.textContent!)
		: [];

	if (activeTagFilters.length) {
		filteredTasks = filteredTasks.filter(task =>
			activeTagFilters.every(tag => task.tags.includes(tag))
		);
	}

	const hasNoTasks =
		!filteredTasks.length ||
		(!containerClasses.contains("show-completed") &&
			filteredTasks.every(task => task.completed));

	return hasNoTasks
		? [h("p", {}, "No tasks found")]
		: filteredTasks.map(task => renderTaskItem(task));
}

function renderTaskItem(task: Task): HTMLElement {
	const tagsElement = task.tags.length
		? h("div", { className: "tags" }, ...task.tags.map(renderTag))
		: h("div", { className: "no-tags" }, "No tags");

	const dueDateElement = task.dueDate
		? h(
				"div",
				{ className: "due-date" },
				new Date(task.dueDate).toLocaleDateString(
					undefined,
					DATE_FORMAT
				)
		  )
		: h("div", { className: "no-due-date" }, "No due date");

	return h(
		"div",
		{ className: `item ${task.completed ? "completed" : ""}` },
		h("div", { className: "id" }, `#${task.id}`),
		h(
			"div",
			{ className: "name-description" },
			h("a", { className: "name" }, task.name),
			task.description ? renderDescriptionDots(task) : ""
		),
		tagsElement,
		dueDateElement,
		h(
			"div",
			{ className: "mini-score" },
			h("div", { className: "effort" }, String(task.effort)),
			":",
			h("div", { className: "importance" }, String(task.importance)),
			"-",
			h("div", { className: "score" }, String(task.priorityScore))
		)
	);
}

function renderTag(tag: string) {
	return h(
		"a",
		{
			className: "tag",
			onclick: () => toggleTagFilter(tag),
		},
		tag
	);
}

function renderDescriptionDots(task: Task) {
	return h(
		"div",
		{
			className: "description",
			title: task.description,
		},
		h("div", { className: "dot" }),
		h("div", { className: "dot" }),
		h("div", { className: "dot" })
	);
}

function renderTaskListHeader() {
	const searchInput = h(
		"div",
		{ className: "search" },
		h("img", { src: "/assets/search.svg" }),
		h("input", {
			type: "text",
			id: "task-search",
			placeholder: "Task name...",
			onkeyup: refreshTaskList,
		})
	);

	const completedTasksToggle = h(
		"button",
		{
			className: "completed-toggle",
			onclick: () => {
				$(".task-list-container")[0].classList.toggle(
					"show-completed"
				);
				refreshTaskList();
			},
		},
		"Completed"
	);
	return h(
		"div",
		{ className: "task-list-header" },
		searchInput,
		h("div", { className: "tags-filter" }),
		completedTasksToggle,
		h(
			"div",
			{ className: "sort" },
			"Sort:",
			h(
				"div",
				{ className: "options" },
				h(
					"a",
					{
						className: "option",
						id: "sort-score",
						onclick: () => {
							$(".task-list-container")[0].classList.remove(
								"sort-date"
							);
							refreshTaskList();
						},
					},
					"Score"
				),
				h("div", { className: "separator" }),
				h(
					"a",
					{
						className: "option",
						id: "sort-date",
						onclick: () => {
							$(".task-list-container")[0].classList.add(
								"sort-date"
							);
							refreshTaskList();
						},
					},
					"Date"
				)
			)
		)
	);
}

function toggleTagFilter(tag: string) {
	const tagsFilterElement = $(".tags-filter")[0];
	const activeFilters = [...tagsFilterElement.children].map(
		e => e.textContent!
	);

	if (activeFilters.includes(tag)) {
		const tagElement = [...tagsFilterElement.children].find(
			e => e.textContent === tag
		);
		tagsFilterElement.removeChild(tagElement!);
	} else {
		tagsFilterElement.appendChild(renderTag(tag));
	}

	refreshTaskList();
}
