import TaskController from "../taskController.js";
import TaskService from "../../services/taskService.js";
import Command from "./Command.js";

export default new Command(
	"add",
	"Add a new task",
	["a"],
	TaskService.taskDetails,
	(props: {
		name: string;
		dueDate: string | null;
		description: string;
		tags: string;
		effort: string;
		importance: string;
	}) => {
		TaskController.createTask(
			props.name,
			props.dueDate,
			props.description,
			props.tags,
			props.effort,
			props.importance
		);
	}
);
