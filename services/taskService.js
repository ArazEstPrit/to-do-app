import { Task } from "../models/task.js";
import {
	DATE_FORMAT,
	log,
	logError,
	promptForProperty,
} from "../views/consoleView.js";
import { readFile, writeFile } from "./fileService.js";

export async function createTask(name, dueDate, description) {
	// TODO: write unit tests for promptForProperty()
	// The current unit tests only test for when the name, due date, and
	// description are already passed as arguments.

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

	let taskDescription =
		description?.trim() || (await promptForProperty("Description"));

	log("");

	let task = new Task(taskName, taskDueDate, taskDescription);

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
		)}${task.description ? `\nDescription: ${task.description}` : ""}`
	);
}

export function getTasks() {
	let tasks = JSON.parse(readFile("./database/tasks.json") || "[]");
	return tasks.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
}

export async function deleteTask(name) {
	let tasks = getTasks();

	let getTaskToDelete = name => {
		let tasksToDelete = tasks
			.filter(task => task.name == name)
			.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));

		if (tasksToDelete.length == 0) {
			logError("Task not found");
			return false;
		}

		return tasksToDelete[0];
	};

	let tasksToDelete = 
		name && getTaskToDelete(name)
			? getTaskToDelete(name)
			: getTaskToDelete(await promptForProperty("Task Name", getTaskToDelete));

	let filteredTasks = tasks.filter(
		task =>
			task.name != tasksToDelete.name ||
			task.dueDate != tasksToDelete.dueDate
	);

	log(`Task "${tasksToDelete.name}" deleted!`);
	writeFile(
		"./database/tasks.json",
		JSON.stringify(filteredTasks, null, "\t")
	);
}
