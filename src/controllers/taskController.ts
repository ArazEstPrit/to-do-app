import Task from "../models/task.js";
import taskService from "../services/taskService.js";
import { displayTask } from "../views/console/listTasks.js";
import { log, logError } from "../views/console/logging.js";

class TaskController {
	private parseInputs(
		name: string,
		dueDate: string | null,
		description: string,
		tags: string,
		effort: string,
		importance: string
	): [string, Date | null, string, string[], number, number] {
		const trimmedTags = tags ? tags.trim().split(" ").filter(Boolean) : [];
		const uniqueTags = Array.from(new Set(trimmedTags));
		const taskDate = dueDate ? new Date(dueDate) : null;

		return [
			name,
			taskDate,
			description || "",
			uniqueTags,
			parseInt(effort),
			parseInt(importance),
		];
	}

	public createTask(
		name: string,
		dueDate: string | null,
		description: string,
		tags: string,
		effort: string,
		importance: string
	) {
		const task = new Task(
			...this.parseInputs(
				name,
				dueDate,
				description,
				tags,
				effort,
				importance
			)
		);

		log("Task created:\n" + displayTask(taskService.addTask(task)));
	}

	public completeTask(id: string) {
		const task = taskService.findTask(parseInt(id));

		if (!task) {
			return;
		}

		if (task.completed) {
			logError("Task already completed");
			return;
		}

		taskService.completeTask(parseInt(id));

		log(`Task "${task.name}" completed`);
	}

	public revertTask(id: string) {
		const task = taskService.findTask(parseInt(id));

		if (!task) {
			return;
		}

		if (!task.completed) {
			logError("Task not completed");
			return;
		}

		taskService.revertTask(parseInt(id));

		log(`Task "${task.name}" reverted`);
	}

	public deleteTask(id: string) {
		const task = taskService.findTask(parseInt(id));

		if (!task) {
			return;
		}

		taskService.deleteTask(task);
		log(`Task "${task.name}" deleted`);
	}

	public editTask(
		id: string,
		[name, dueDate, description, tags, effort, importance]: string[]
	) {
		const updatedTask = new Task(
			...this.parseInputs(
				name,
				dueDate,
				description,
				tags,
				effort,
				importance
			)
		);

		const task = taskService.editTask(parseInt(id), updatedTask);
		log("Task updated:\n" + displayTask(task));
	}
}

export default new TaskController();
