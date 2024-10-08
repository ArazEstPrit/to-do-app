import taskController from "../taskController.js";
import taskService from "../../services/taskService.js";
import Command from "./Command.js";

export default new Command(
	"delete",
	"Delete a task",
	["d"],
	[taskService.taskId],
	({ id }: { id: string }) => {
		taskController.deleteTask(id);
	}
);
