import { Task } from "../models/task";
import {
	DATE_FORMAT,
	log,
	logError,
	promptForProperty,
} from "../views/consoleView";
import { readFile, writeFile } from "./fileService";

/**
 * Creates a new task with the provided name, due date, description, and tags.
 * If any of the parameters are not provided or invalid, the user will be
 * prompted for them.
 *
 * The due date is invalid if it is in the past, or if new Date(dueDate) returns
 * "Invalid Date" (better date parsing is planned). Two tasks cannot have the
 * same name and due date.
 *
 * A task does not require a due date or description.
 *
 * @param {string} [name] - The name of the task.
 * @param {string} [dueDate] - The due date of the task in a valid date format.
 * @param {string} [description] - The description of the task.
 * @param {string[]} [tags] - The tags of the task.
 */
export async function createTask(name?: string, dueDate?: string, description?: string, ...tags: string[]) {
	// Validates the task name.
	function isNameValid(name: string) {
		if (name.trim() == "") {
			logError("Task name cannot be empty");
			return false;
		}
		return true;
	}

	// Prompts the user for the task name if it is not provided or invalid.
	let taskName =
		name && isNameValid(name)
			? name
			: await promptForProperty("Task Name", isNameValid);

	// Validates the due date.
	function isDateValid(dueDate: string | number | Date) {
		if (dueDate === "") {
			return true;
		} else if (new Date(dueDate).toString() == "Invalid Date") {
			logError("Invalid due date");
			return false;
		} else if (new Date(dueDate) < new Date()) {
			logError("Due date must be in the future");
			return false;
		}
		return true;
	}

	// Prompts the user for the due date if it is not provided or invalid.
	let taskDueDate: any =
		dueDate && isDateValid(dueDate)
			? dueDate
			: await promptForProperty("Due Date (optional)", isDateValid);

	// Converts the due date to a Date object if it is not empty (to let users
	// create tasks with no due date).
	taskDueDate = taskDueDate ? new Date(taskDueDate) : null;

	// Prompts the user for the task description if it is not provided.
	let taskDescription =
		description?.trim() ||
		(await promptForProperty("Description (optional)"));

	let taskTags =
		tags.length != 0
			? tags.map(t => t.trim())
			: (await promptForProperty("Tags (optional)")).trim().split(" ");

	taskTags = taskTags.filter(t => t != "");
	
	log("");
	
	// Creates a new Task with the provided information.
	let task = new Task(taskName, taskDueDate, taskDescription, taskTags);
	
	// Checks if the new task conflicts with any existing tasks.
	let data = getTasks();
	if (
		data.find(
			t =>
				t.name == task.name &&
				t.dueDate ==
					(task.dueDate ? task.dueDate.toISOString() : task.dueDate)
		)
	) {
		logError("Task already exists");
		createTask();
		return;
	}

	// Adds the new task to the existing tasks and writes it to the database.
	data.push(task);
	writeFile("./database/tasks.json", JSON.stringify(data, null, "\t"));

	log(
		`Task "${task.name}" created!${
			task.dueDate
				? `\nDue date: ${task.dueDate.toLocaleDateString(
					undefined,
					DATE_FORMAT
				)}`
				: ""
		}${task.description ? `\nDescription: ${task.description}` : ""}${
			task.tags.length != 0 ? `\nTags: ${task.tags.join(", ")}` : ""
		}`
	);
}

/**
 * Retrieves tasks from the database, parses them, and sorts them based on due date.
 *
 * @return {array} Sorted array of tasks based on due date.
 */
export function getTasks(): Array<any> {
	let tasks = JSON.parse(readFile("./database/tasks.json") || "[]");
	return tasks.sort(
		(
			a: { dueDate: string | Date },
			b: { dueDate: string | Date }
		) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
	);
}

/**
 * Deletes a task from the database.
 *
 * @param {string} name - The name of the task to delete. If not provided, the
 *     user will be prompted for it.
 */
export async function deleteTask(name: string) {
	let tasks = getTasks();

	// Finds the task to delete based on the provided name. If the user has
	// multiple tasks with the same name, the one with the earliest due date
	// will be deleted. Returns false if no matching task is found.
	let getTaskToDelete = (name: string) => {
		let tasksToDelete = tasks
			.filter(task => task.name === name)
			.sort(
				(a, b) => new Date(b.dueDate || 0).getTime() - new Date(a.dueDate || 0).getTime()
			);

		if (tasksToDelete.length == 0) {
			logError("Task not found");
			return false;
		}

		return tasksToDelete[0];
	};

	// If the user provides a name, and a task with that name exists, the task
	// to delete is found. If the user does not provide a name, or if no task is
	// found, prompts the user for the name of the task to delete.
	let tasksToDelete =
		name && getTaskToDelete(name)
			? getTaskToDelete(name)
			: getTaskToDelete(
				await promptForProperty("Task Name", getTaskToDelete)
			);

	// Creates a new array of tasks without the task that was deleted.
	let filteredTasks = tasks.filter(
		task =>
			task.name !== tasksToDelete.name ||
			task.dueDate !== tasksToDelete.dueDate
	);

	// Logs the task that was deleted and writes the new array of tasks to the
	// database.
	log(`Task "${tasksToDelete.name}" deleted!`);
	writeFile(
		"./database/tasks.json",
		JSON.stringify(filteredTasks, null, "\t")
	);
}
