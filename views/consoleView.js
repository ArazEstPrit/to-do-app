import { getTasks } from "../services/taskService.js";

// These two functions are very simple for now, but I'll expand on them later.
export function log(msg) {
	console.log(msg);
}

export function logError(msg) {
	console.error(msg);
}

export function viewTasks() {
	let tasks = getTasks().map(task => ({
		...task,
		dueDate: new Date(task.dueDate).toLocaleDateString(undefined, {
			weekday: "short",
			day: "2-digit",
			month: "short",
			year: "numeric",
		}),
	}));

	if (tasks.length === 0) {
		log("No tasks found");
	} else {
		console.table(tasks);
	}
}
