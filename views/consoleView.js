import { getTasks } from "../services/taskService.js";
import readline from "readline";

// These two functions are very simple for now, but I'll expand on them later.
export function log(msg) {
	console.log(msg);
}

export function logError(msg) {
	console.error(msg);
}

export const DATE_FORMAT = {
	weekday: "short",
	day: "2-digit",
	month: "short",
	year: "numeric",
};

export function viewTasks() {
	let tasks = getTasks().map(task => ({
		...task,
		dueDate: task.dueDate ? new Date(task.dueDate).toLocaleDateString(
			undefined,
			DATE_FORMAT
		) : "",
	}));

	if (tasks.length === 0) {
		log("No tasks found");
	} else {
		console.table(tasks);
	}
}

export async function promptForProperty(label, validate = () => true) {
	let rl = readline.createInterface({
		input: process.stdin,
		output: process.stdout,
	});

	let ask = async () => {
		let input = await new Promise(resolve =>
			rl.question(`${label}: `, resolve)
		);
		if (validate(input)) {
			rl.close();
			return input.trim();
		} else {
			return ask();
		}
	};

	return await ask();
}

// Unused for now, may need later
export async function promptForProperties(propertyDefinitions) {
	let properties = {};
	for (let { name, condition } of propertyDefinitions) {
		properties[name] = await promptForProperty(name, condition);
	}

	log(""); // for new line;
	return properties;
}
