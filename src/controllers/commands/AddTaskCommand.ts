import TaskController from "../taskController.js";
import TaskService from "../../services/taskService.js";
import Command from "./Command.js";

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
