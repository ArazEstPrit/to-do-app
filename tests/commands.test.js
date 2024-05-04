import { getCommand } from "../controllers/commands.js";
import { createTask, deleteTask } from "../services/taskService.js";
import { viewTasks } from "../views/consoleView.js";

describe("Command controller", () => {
	it("should return a command given a keyword", () => {
		let command = getCommand("add");
		expect(command.keywords).toContain("add");
		expect(command.action).toBe(createTask);

		command = getCommand("view");
		expect(command.keywords).toContain("view");
		expect(command.action).toBe(viewTasks);

		command = getCommand("complete");
		expect(command.keywords).toContain("complete");
		expect(command.keywords).toContain("delete");
		expect(command.action).toBe(deleteTask);
	});

	it("should return a command given an alias", () => {
		let command = getCommand("a");
		expect(command.keywords).toContain("add");
		expect(command.action).toBe(createTask);

		command = getCommand("v");
		expect(command.keywords).toContain("view");
		expect(command.action).toBe(viewTasks);

		command = getCommand("c");
		expect(command.keywords).toContain("complete");
		expect(command.keywords).toContain("d");
		expect(command.keywords).toContain("delete");
		expect(command.action).toBe(deleteTask);
	});

	it("should return undefined if there is no keyword", () => {
		let command = getCommand();
		expect(command).toBeUndefined();
	});

	it("should return undefined if the keyword is not found", () => {
		let command = getCommand("foo");
		expect(command).toBeUndefined();
	});
});
