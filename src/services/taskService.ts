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
	];

	constructor() {
		this.loadTasks();
	}

	private loadTasks() {
		this.tasks = JSON.parse(readFile(TASK_FILE) || "[]");
		this.sortTasks();
	}

	private saveTasks() {
		this.sortTasks();
		writeFile(TASK_FILE, JSON.stringify(this.tasks, null, "\t"));
	}

	private sortTasks() {
		this.tasks.sort(
			(a: { dueDate: Date | null }, b: { dueDate: Date | null }) =>
				(new Date(b.dueDate).getTime() || 0) -
				(new Date(a.dueDate).getTime() || 0)
		);
	}

	public getTasks(): Task[] {
		this.sortTasks();
		return this.tasks;
	}

	public addTask(task: Task): Task {
		this.tasks.push(task);
		this.saveTasks();
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
