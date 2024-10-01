import taskService from "../../services/taskService.js";
import taskController from "../taskController.js";
import Command from "./Command.js";

export default new Command(
	"revert",
	"Revert a task",
	["r"],
	[taskService.taskId],
	({ id }: { id: string }) => {
		taskController.revertTask(id);
	}
);
