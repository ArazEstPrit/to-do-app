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

	deleteTask(taskName: string, dueDate: string | null) {
		const task = this.findTask(taskName, dueDate ?? undefined);

		if (!task) {
			return;
		}

		taskService.deleteTask(task);
		log(`Task "${taskName}" deleted`);
	}

	findTask(taskName: string, dueDate?: string): Task | undefined {
		const task = taskService
			.getTasks()
			.find(
				task =>
					task.name === taskName &&
					(dueDate
					? new Date(task.dueDate).getTime() === new Date(dueDate).getTime()
						: true)
			);

		if (!task) {
			logError(`Task "${taskName}" not found`);
			return;
		}

		return task;
	}
}

export default new TaskController();
