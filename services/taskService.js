import { Task } from "../models/task.js";
import { log, logError } from "../views/consoleView.js";
import { readFile, writeFile } from "./fileService.js";

export function createTask(name, dueDate) {
	if (!name || !dueDate) {
		logError("Please provide a name and due date");
		return;
	}

	// Only accepts date format yyyy-mm-dd
	// TODO: better date parsing
	let task = new Task(name, new Date(dueDate));

	if (task.dueDate == "Invalid Date") {
		logError("Invalid due date");
		return;
	}

	if (task.dueDate < new Date()) {
		logError("Due date must be in the future");
		return;
	}

	let data = getTasks();

	if (
		data.find(
			t => t.name == task.name && t.dueDate == task.dueDate.toISOString()
		)
	) {
		logError("A task with the same name and due date already exists");
		return;
	}

	data.push(task);

	writeFile("./database/tasks.json", JSON.stringify(data, null, "\t"));

	log(`Task "${name}" created!`);
}

export function getTasks() {
	let tasks = JSON.parse(readFile("./database/tasks.json") || "[]");
	return tasks.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
}

export function deleteTask(name) {
	let tasks = getTasks();

	let taskToDelete = tasks
		.filter(task => task.name == name)
		.sort((a, b) => a.dueDate - b.dueDate)[0];

	if (!taskToDelete) {
		logError("Task not found");
		return;
	}

	let filteredTasks = tasks.filter(
		task =>
			task.name != taskToDelete.name ||
			task.dueDate != taskToDelete.dueDate
	);

	log(`Task "${name}" deleted!`);
	writeFile(
		"./database/tasks.json",
		JSON.stringify(filteredTasks, null, "\t")
	);
}
