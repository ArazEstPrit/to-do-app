import { $, h } from "../utils/domHelpers.js";
import { DATE_FORMAT } from "../../console/formatting.js";
import Task from "../../../models/task.js";
import Component from "./Component.js";

export default class TaskList extends Component<{ tasks: Task[] }> {
	constructor(props: { tasks: Task[] }) {
		super(props);
	}

	protected render() {
		return h(
			"div",
			{ className: "task-list-container" },
			this.renderTaskListHeader(),
			h(
				"div",
				{ className: "task-list" },
				...this.state.tasks.map(task => this.renderTaskListItem(task))
			)
		);
	}

	private renderTaskListHeader() {
		const searchInput = h(
			"div",
			{ className: "search" },
			h("img", { src: "/assets/search.svg" }),
			h("input", {
				type: "text",
				id: "task-search",
				placeholder: "Task name...",
				onkeyup: () => this.refreshTaskList(),
			})
		);

		const completedTasksToggle = h(
			"button",
			{
				className: "completed-toggle",
				onclick: () => {
					this.element.classList.toggle("show-completed");
					this.refreshTaskList();
				},
			},
			"Completed"
		);

		const sortOptions = h(
			"div",
			{ className: "sort-options" },
			"Sort:",
			h(
				"a",
				{
					className: "sort-option",
					id: "sort-priority",
					onclick: () => {
						this.element.classList.remove("sort-date");
						this.refreshTaskList();
					},
				},
				"Priority"
			),
			h("div", { className: "separator" }),
			h(
				"a",
				{
					className: "sort-option",
					id: "sort-date",
					onclick: () => {
						this.element.classList.add("sort-date");
						this.refreshTaskList();
					},
				},
				"Date"
			)
		);
		return h(
			"div",
			{ className: "task-list-header" },
			searchInput,
			h("div", { className: "tags-filter" }),
			completedTasksToggle,
			sortOptions
		);
	}

	private renderTaskListItem(task: Task) {
		const tagsElement = h(
			"div",
			{ className: "tags" },
			...(task.tags.map(tag => this.renderTaskTag(tag)) || [
				h("div", { className: "no-tags" }, "No tags"),
			])
		);

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

		const miniScore = h(
			"div",
			{ className: "mini-score" },
			h("div", { className: "effort" }, String(task.effort)),
			":",
			h("div", { className: "importance" }, String(task.importance)),
			"-",
			h("div", { className: "score" }, String(task.priorityScore))
		);

		return h(
			"div",
			{
				className: `item ${task.completed ? "completed" : ""}`,
				id: `task-${task.id}`,
			},
			h("div", { className: "id" }, `#${task.id}`),
			h(
				"div",
				{ className: "name-description" },
				h("a", { className: "name" }, task.name),
				task.description
					? h(
							"div",
							{
								className: "description",
								title: task.description,
							},
							h("div", { className: "dot" }),
							h("div", { className: "dot" }),
							h("div", { className: "dot" })
					  )
					: ""
			),
			tagsElement,
			dueDateElement,
			miniScore
		);
	}

	private renderTaskTag(tag: string) {
		return h(
			"a",
			{
				className: "tag",
				onclick: () => {
					this.toggleTagFilter(tag);
				},
			},
			tag
		);
	}

	private refreshTaskList() {
		let filteredTasks = this.state.tasks;

		if (this.element.classList.contains("sort-date")) {
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
						(task.description?.toLowerCase().includes(term) ??
							false) ||
						task.tags.some(tag => tag.toLowerCase().includes(term))
				)
			);
		}

		const taskFilter = $(".tags-filter")[0];
		const activeTagFilters = taskFilter
			? [...taskFilter.children].map(e => e.textContent!)
			: [];

		if (activeTagFilters.length) {
			filteredTasks = filteredTasks.filter(task =>
				activeTagFilters.every(tag => task.tags.includes(tag))
			);
		}

		filteredTasks.forEach((task, index) => {
			const taskElem = $(`#task-${task.id}`)[0];
			taskElem.classList.remove("hidden");
			taskElem.style.order = index.toString();
		});

		const hiddenTasks = this.state.tasks.filter(
			task => !filteredTasks.includes(task)
		);
		hiddenTasks.forEach(task => {
			$(`#task-${task.id}`)[0].classList.add("hidden");
		});
	}

	private toggleTagFilter(tag: string) {
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
			tagsFilterElement.appendChild(this.renderTaskTag(tag));
		}

		this.refreshTaskList();
	}
}
