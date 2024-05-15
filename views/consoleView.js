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
	let tasks = getTasks()
		.sort((a, b) => Date.parse(b.dueDate || 0) - Date.parse(a.dueDate || 0))
		.map(task => ({
			...task,
			dueDate: task.dueDate
				? new Date(task.dueDate).toLocaleDateString(
					undefined,
					DATE_FORMAT
				)
				: "",
		}));

	if (tasks.length === 0) {
		log("No tasks found");
	} else {
		console.table(tasks);
	}
}

/**
 * Prompts the user for a property value.
 *
 * @param {string} label - The label to display before the input
 * @param {function} [validate=() => true] - A function that takes the input
 * and returns a boolean indicating whether the input is valid
 * @returns {Promise<string>} - The trimmed input
 */
export async function promptForProperty(label, validate = () => true) {
	let rl = readline.createInterface({
		input: process.stdin,
		output: process.stdout,
	});

	/**
	 * Asks the user for input until the input is valid.
	 * @returns {Promise<string>}
	 */
	let ask = async () => {
		let input = await new Promise(resolve =>
			rl.question(`? ${label}: `, resolve)
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


/**
 * Prompts the user for multiple property values.
 *
 * @param {object[]} propertyDefinitions - An array of objects, each with a
 * `name` property indicating the name of the property and an optional
 * `condition` property indicating a function that takes the input and returns
 * a boolean indicating whether the input is valid
 * @returns {Promise<object>} - An object with the same keys as the input
 * `propertyDefinitions` array and the trimmed user input values
 */
export async function promptForProperties(propertyDefinitions) {
	let properties = {};
	for (let { name, condition } of propertyDefinitions) {
		properties[name] = await promptForProperty(name, condition);
	}

	log(""); // for new line;
	return properties;
}
