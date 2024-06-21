import TaskController from "../controllers/taskController";
import TaskService from "../services/taskService";
import Command from "./Command";

export default new Command(
	"add",
	"Add a new task",
	["a"],
	TaskService.taskDetails,
	({ name, dueDate, description, tags, effort, importance }) => {
		TaskController.createTask(
			name,
			dueDate,
			description,
			tags,
			effort,
			importance
		);
	}
);
