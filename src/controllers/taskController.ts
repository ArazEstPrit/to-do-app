import Task from "../models/task";
import taskService from "../services/taskService";
import { formatTask, log, logError } from "../views/consoleView";

class TaskController {
	createTask(
		name: string,
		dueDate: string | null,
		description: string,
		tags: string
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

		const task = new Task(name, taskDate, description || null, uniqueTags);

		taskService.addTask(task);

		log("Task created:\n" + formatTask(task));
	}

	deleteTask(taskName: string) {
		const task = taskService
			.getTasks()
			.find(task => task.name === taskName);

		if (!task) {
			logError(`Task "${taskName}" not found`);
			return;
		}

		taskService.deleteTask(task);
		log(`Task "${taskName}" deleted`);
	}
}

export default new TaskController();
