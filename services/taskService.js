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

	let data = JSON.parse(readFile("./database/tasks.json") || "[]");

	data.push(task);

	writeFile("./database/tasks.json", JSON.stringify(data, null, "\t"));

	log("Task added!");
}

