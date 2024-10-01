import taskService from "../../services/taskService.js";
import taskController from "../taskController.js";
import Command from "./Command.js";

export default new Command(
	"complete",
	"Complete a task",
	["c"],
	[taskService.taskId],
	({ id }: { id: string }) => {
		taskController.completeTask(id);
	}
);
