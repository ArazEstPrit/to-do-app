import taskController from "../controllers/taskController";
import taskService from "../services/taskService";
import Command from "./Command";

export default new Command(
	"delete",
	"Delete a task",
	["d", "c", "complete"],
	[taskService.taskId],
	({ id }) => {
		taskController.deleteTask(id);
	}
);
