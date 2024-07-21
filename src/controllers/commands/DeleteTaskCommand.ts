import taskController from "../taskController.js";
import taskService from "../../services/taskService.js";
import Command from "./Command.js";

export default new Command(
	"delete",
	"Delete a task",
	["complete", "d", "c"],
	[taskService.taskId],
	({ id }) => {
		taskController.deleteTask(id);
	}
);
