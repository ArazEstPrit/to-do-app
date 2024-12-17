import { join } from "path";
import Task from "../models/task.js";
import { inputDefinition } from "../views/console/prompting.js";
import { readFile, writeFile } from "./fileService.js";

export const TASK_FILE = join(import.meta.dirname, "../../database/tasks.json");

class TaskService {
	private tasks: Task[] = [];

	public readonly taskDetails: inputDefinition[] = [
		{
			name: "name",
			char: "n",
			type: "string",
			condition: (name: string): boolean | string =>
				name.trim() ? true : "Task name cannot be empty",
		},
		{
			name: "dueDate",
			char: "d",
			type: "date",
			condition: (date: string): boolean | string =>
				isNaN(new Date(date).getTime()) ? "Invalid date" : true,
			optional: true,
		},
		{
			name: "description",
			char: "m",
			type: "string",
			optional: true,
		},
		{
			name: "tags",
			char: "t",
			type: "string",
			optional: true,
		},
		{
			name: "effort",
			char: "e",
			type: "string",
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
			type: "string",
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

	public readonly taskId: inputDefinition = {
		name: "id",
		char: "k",
		type: "string",
		condition: (id: string): boolean | string =>
			!isNaN(parseInt(id))
				? this.getTasks().find(t => t.id === parseInt(id)) === undefined
					? "Task not found"
					: true
				: "Task ID must be a number",
	};

	constructor() {
		this.loadTasks();
	}

	public loadTasks() {
		this.tasks = JSON.parse(readFile(TASK_FILE) || "[]");

		this.tasks = this.tasks.map(task => {
			if (!task.id) {
				task.id = this.generateId();
			}
			return task;
		});

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

		return task.completed ? 0 : task.priorityScore;
	}

	private updatePriorityScore() {
		this.tasks.map(
			task => (task.priorityScore = this.calculatePriorityScore(task))
		);
	}

	private saveTasks() {
		this.sortTasks();
		writeFile(TASK_FILE, JSON.stringify(this.tasks, null, "\t"));
	}

	private sortTasks() {
		this.updatePriorityScore();
		this.tasks.sort(
			(a: Task, b: Task) => b.priorityScore - a.priorityScore
		);
	}

	public getTasks(): Task[] {
		this.sortTasks();
		return this.tasks;
	}

	public addTask(task: Task): Task {
		task.id = this.generateId();
		this.tasks.push(task);
		this.saveTasks();
		task.priorityScore = this.calculatePriorityScore(task);
		return task;
	}

	private generateId(): number {
		return Math.max(...this.tasks.map(t => t.id || 0), 0) + 1;
	}

	public completeTask(id: number) {
		const task = this.findTask(id);
		if (task) {
			task.completed = true;
			task.priorityScore = 0;
			this.saveTasks();
		}
	}

	public revertTask(id: number) {
		const task = this.findTask(id);
		if (task) {
			task.completed = false;
			task.priorityScore = this.calculatePriorityScore(task);
			this.saveTasks();
		}
	}

	public deleteTask(task: Task) {
		this.tasks = this.tasks.filter(t => t.id !== task.id);
		this.saveTasks();
	}

	public findTask(id: number): Task | undefined {
		const task = this.tasks.find(task => task.id === id);

		if (!task) {
			return;
		}

		return task;
	}

	public editTask(id: number, newTask: Task) {
		const task = this.findTask(id);
		newTask.id = id;
		if (task) {
			Object.assign(task, newTask);
			this.saveTasks();
		}
		return task;
	}
}

export default new TaskService();
