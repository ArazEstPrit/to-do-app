import taskController from "../taskController";
import taskService from "../../services/taskService";
import Command from "./Command";

export default new Command(
	"delete",
	"Delete a task",
	["complete", "d", "c"],
	[taskService.taskId],
	({ id }) => {
		taskController.deleteTask(id);
	}
);
