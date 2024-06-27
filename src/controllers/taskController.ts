import Task from "../models/task";
import taskService from "../services/taskService";
import { formatTask, log, logError } from "../views/consoleView";

class TaskController {
	createTask(
		name: string,
		dueDate: string | null,
		description: string,
		tags: string,
		effort: string,
		importance: string
	) {
		const trimmedTags = tags ? tags.trim().split(" ").filter(Boolean) : [];
		const uniqueTags = Array.from(new Set(trimmedTags));
		const taskDate = dueDate ? new Date(dueDate) : null;

		if (
			taskService
				.getTasks()
				.find(task => task.name === name && task.dueDate === taskDate)
		) {
			logError(`Task "${name}" already exists`);
			return;
		}

		const task = new Task(
			name,
			taskDate,
			description || "",
			uniqueTags,
			parseInt(effort),
			parseInt(importance),
			0
		);

		taskService.addTask(task);

		log("Task created:\n" + formatTask(task));
	}

	deleteTask(id: string) {
		const task = this.findTask(parseInt(id));

		if (!task) {
			return;
		}

		taskService.deleteTask(task);
		log(`Task "${task.name}" deleted`);
	}

	findTask(id: number): Task | undefined {
		const task = taskService.getTasks().find(task => task.id === id);

		if (!task) {
			return;
		}

		return task;
	}
}

export default new TaskController();
