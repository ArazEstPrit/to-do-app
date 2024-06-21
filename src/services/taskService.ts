import Task from "../models/task";
import { inputDefinition } from "../views/consoleView";
import { readFile, writeFile } from "./fileService";

const TASK_FILE = "../../database/tasks.json";

class TaskService {
	private tasks: Task[] = [];

	public readonly taskDetails: inputDefinition[] = [
		{
			name: "name",
			char: "n",
			condition: (name: string): boolean | string =>
				name.trim() ? true : "Task name cannot be empty",
		},
		{
			name: "dueDate",
			char: "d",
			condition: (date: string): boolean | string => {
				const parsedDate = new Date(date);
				return parsedDate < new Date()
					? "Due date must be in the future"
					: parsedDate.toString() === "Invalid Date"
					  ? "Invalid date"
					  : true;
			},
			optional: true,
		},
		{
			name: "description",
			char: "m",
			optional: true,
		},
		{
			name: "tags",
			char: "t",
			optional: true,
		},
		{
			name: "effort",
			char: "e",
			condition: (effort: string): boolean | string => {
				const parsedEffort = parseInt(effort);
				return isNaN(parsedEffort)
					? "Effort must be a number"
					: parsedEffort > 0 && parsedEffort <= 6
					  ? true
					  : "Effort must be between 1 and 6";
			},
			optional: true,
		},
		{
			name: "importance",
			char: "i",
			condition: (importance: string): boolean | string => {
				const parsedImportance = parseInt(importance);
				return isNaN(parsedImportance)
					? "Importance must be a number"
					: parsedImportance > 0 && parsedImportance <= 6
					  ? true
					  : "Importance must be between 1 and 6";
			},
			optional: true,
		},
	];

	constructor() {
		this.loadTasks();
	}

	private loadTasks() {
		this.tasks = JSON.parse(readFile(TASK_FILE) || "[]");
		this.sortTasks();
	}

	public calculatePriorityScore(task: Task): number {
		const daysUntilDueDate = Math.ceil(
			(new Date(task.dueDate).getTime() - new Date().getTime()) /
				1000 /
				3600 /
				24
		);
		task.priorityScore = Math.round(
			(2 * (task.importance ?? 3)) /
				Math.pow(
					daysUntilDueDate > 0 ? daysUntilDueDate : 1,
					1 / (task.effort ?? 3)
				)
		);

		return task.priorityScore;
	}

	private updatePriorityScore() {
		this.tasks.map(
			task => (task.priorityScore = this.calculatePriorityScore(task))
		);
	}

	private saveTasks() {
		this.sortTasks();
		this.updatePriorityScore();
		writeFile(TASK_FILE, JSON.stringify(this.tasks, null, "\t"));
	}

	private sortTasks() {
		this.tasks.sort(
			(a: Task, b: Task) => b.priorityScore - a.priorityScore
		);
	}

	public getTasks(): Task[] {
		this.sortTasks();
		this.updatePriorityScore();
		return this.tasks;
	}

	public addTask(task: Task): Task {
		this.tasks.push(task);
		this.saveTasks();
		task.priorityScore = this.calculatePriorityScore(task);
		return task;
	}

	public deleteTask(task: Task) {
		this.tasks = this.tasks.filter(
			t => t.name !== task.name || t.dueDate !== task.dueDate
		);
		this.saveTasks();
	}
}

export default new TaskService();
