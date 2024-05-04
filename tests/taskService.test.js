import { jest } from "@jest/globals";
import { writeFile } from "../services/fileService.js";
import { createTask, getTasks } from "../services/taskService.js";

describe("createTask", () => {
	beforeEach(() => {
		writeFile("./database/tasks.json", JSON.stringify([], null, "\t"));
	});

	beforeEach(() => {
		jest.spyOn(console, "log");
		jest.spyOn(console, "error");
	});

	afterEach(() => {
		jest.restoreAllMocks();
		writeFile("./database/tasks.json", JSON.stringify([], null, "\t"));
	});

	it("should create a new task", () => {
		createTask("Test Task", "2026-01-01");
		let tasks = getTasks();
		expect(tasks).toHaveLength(1);
		expect(tasks[0].name).toBe("Test Task");
		expect(tasks[0].dueDate).toBe(new Date("2026-01-01").toISOString());
		expect(console.log).toHaveBeenCalledWith("Task \"Test Task\" created!");
	});

	it("should not allow a task with an invalid due date", () => {
		createTask("Invalid Due Date", "202502-31");
		let tasks = getTasks();
		expect(tasks).toHaveLength(0);
		expect(console.error).toHaveBeenCalledWith("Invalid due date");
	});

	it("should not allow a task with a due date in the past", () => {
		createTask("Past Due Date", "2020-01-01");
		let tasks = getTasks();
		expect(tasks).toHaveLength(0);
		expect(console.error).toHaveBeenCalledWith(
			"Due date must be in the future"
		);
	});

	it("should not allow a duplicate task", () => {
		createTask("Duplicate Task", "2026-01-01");
		createTask("Duplicate Task", "2026-01-01");
		let tasks = getTasks();
		expect(tasks).toHaveLength(1);
		expect(console.error).toHaveBeenCalledWith(
			"A task with the same name and due date already exists"
		);
	});
});
