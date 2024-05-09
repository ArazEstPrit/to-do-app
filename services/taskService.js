import { Task } from "../models/task.js";
import {
	DATE_FORMAT,
	log,
	logError,
	promptForProperty,
} from "../views/consoleView.js";
import { readFile, writeFile } from "./fileService.js";

export async function createTask(name, dueDate) {
	// TODO: write unit tests for promptForProperty()
	// The current unit tests only test for when the name and due date are
	// already passed as arguments.

	let isNameValid = name => {
		if (name.trim() == "") {
			logError("Task name cannot be empty");
			return false;
		}
		return true;
	};

	let taskName =
		name && isNameValid(name)
			? name
			: await promptForProperty("Task Name", isNameValid);

	let isDateValid = dueDate => {
		if (new Date(dueDate) == "Invalid Date") {
			logError("Invalid due date");
			return false;
		} else if (new Date(dueDate) < new Date()) {
			logError("Due date must be in the future");
			return false;
		}
		return true;
	};

	let taskDueDate =
		dueDate && isDateValid(dueDate)
			? new Date(dueDate)
			: new Date(await promptForProperty("Due Date", isDateValid));

	log("");

	let task = new Task(taskName, taskDueDate);

	let data = getTasks();

	if (
		data.find(
			t => t.name == task.name && t.dueDate == task.dueDate.toISOString()
		)
	) {
		logError("A task with the same name and due date already exists");
		createTask();
		return;
	}

	data.push(task);

	writeFile("./database/tasks.json", JSON.stringify(data, null, "\t"));

	log(
		`Task "${
			task.name
		}" created!\nDue date: ${task.dueDate.toLocaleDateString(
			undefined,
			DATE_FORMAT
		)}`
	);
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
