const { writeFileSync, readFileSync, rmSync } = require("fs");
const { createTask, getTasks, deleteTask } = require("../src/services/taskService");
const stdin = require("mock-stdin").stdin();

describe("taskService", () => {
	const BACKUP_FILENAME = "./database/tasks.json.bak";

	beforeAll(() => {
		writeFileSync(BACKUP_FILENAME, readFileSync("./database/tasks.json"));
	});

	afterAll(() => {
		writeFileSync("./database/tasks.json", readFileSync(BACKUP_FILENAME));
		try {
			rmSync(BACKUP_FILENAME);
		} catch (error) {
			if (error.code !== "ENOENT") {
				throw error;
			}
		}
	});

	describe("createTask", () => {
		function write(msg) {
			process.nextTick(() => {
				stdin.send(msg + "\r");
			});
		}

		beforeEach(() => {
			writeFileSync(
				"./database/tasks.json",
				JSON.stringify([], null, "\t")
			);

			jest.spyOn(console, "log");
			jest.spyOn(console, "error");
		});

		afterEach(() => {
			jest.restoreAllMocks();
			writeFileSync(
				"./database/tasks.json",
				JSON.stringify([], null, "\t")
			);
		});

		it("should create a new task", () => {
			createTask(
				"Test Task",
				"2026-01-01",
				"Test Description",
				" tag1 ",
				" tag2 "
			);
			let tasks = getTasks();
			expect(tasks).toHaveLength(1);
			expect(tasks[0]).toEqual({
				name: "Test Task",
				description: "Test Description",
				dueDate: new Date("2026-01-01").toISOString(),
				tags: ["tag1", "tag2"],
			});
		});

		it("should not allow an invalid due date, and create the task with the inputted due date", async () => {
			write("2026-01-01");

			await createTask(
				"Invalid Due Date",
				"202502-31",
				"Test Description",
				"tag1"
			);

			expect(console.error).toHaveBeenCalledWith("Invalid due date");

			let tasks = getTasks();
			expect(tasks).toHaveLength(1);
			expect(tasks[0]).toEqual({
				name: "Invalid Due Date",
				description: "Test Description",
				dueDate: new Date("2026-01-01").toISOString(),
				tags: ["tag1"],
			});
		});

		it("should not allow a task with a due date in the past, and create the task with the inputted due date", async () => {
			write("2026-01-01");
			await createTask(
				"Past Due Date",
				"2020-01-01",
				"Test Description",
				"tag1"
			);
			let tasks = getTasks();
			expect(tasks).toHaveLength(1);
			expect(console.error).toHaveBeenCalledWith(
				"Due date must be in the future"
			);
		});

		it("should not allow a duplicate task", () => {
			createTask(
				"Duplicate Task",
				"2026-01-01",
				"Test Description",
				"tag1"
			);
			createTask(
				"Duplicate Task",
				"2026-01-01",
				"Test Description",
				"tag1"
			);
			let tasks = getTasks();
			expect(tasks).toHaveLength(1);
			expect(console.error).toHaveBeenCalledWith("Task already exists");
		});

		it("should not allow a task with an empty name", () => {
			createTask("   ", "2026-01-01");
			let tasks = getTasks();
			expect(tasks).toHaveLength(0);
			expect(console.error).toHaveBeenCalledWith(
				"Task name cannot be empty"
			);
		});

		it("should add inputted tags to task", async () => {
			write("  tag1 tag2   tag3  ");

			await createTask("Test Task", "2026-01-01", "Test Description");

			let tasks = getTasks();
			expect(tasks[0]).toEqual({
				name: "Test Task",
				description: "Test Description",
				dueDate: new Date("2026-01-01").toISOString(),
				tags: ["tag1", "tag2", "tag3"],
			});
		});
	});

	describe("deleteTask", () => {
		beforeEach(() => {
			writeFileSync(
				"./database/tasks.json",
				JSON.stringify(
					[
						{
							name: "Test Task 1",
							dueDate: new Date("2026-01-01").toISOString(),
						},
						{
							name: "Test Task 2",
							dueDate: new Date("2026-01-02").toISOString(),
						},
						{
							name: "Duplicate Task",
							dueDate: new Date("2026-01-03").toISOString(),
						},
						{
							name: "Duplicate Task",
							dueDate: new Date("2026-01-04").toISOString(),
						},
					],
					null,
					"\t"
				)
			);

			jest.spyOn(console, "log");
			jest.spyOn(console, "error");
		});

		afterEach(() => {
			jest.restoreAllMocks();
			writeFileSync(
				"./database/tasks.json",
				JSON.stringify([], null, "\t")
			);
		});

		it("should delete a task", () => {
			deleteTask("Test Task 1");
			let tasks = getTasks();
			expect(tasks).toHaveLength(3);
			expect(tasks[0].name).toBe("Test Task 2");
			expect(console.log).toHaveBeenCalledWith(
				"Task \"Test Task 1\" deleted!"
			);
		});

		it("should not delete a task that does not exist", () => {
			deleteTask("Non-Existent Task");
			let tasks = getTasks();
			expect(tasks).toHaveLength(4);
			expect(console.error).toHaveBeenCalledWith("Task not found");
		});

		it("should delete multiple tasks with the same name and due date", () => {
			deleteTask("Duplicate Task");
			let tasks = getTasks();
			expect(tasks).toHaveLength(3);
			expect(console.log).toHaveBeenCalledWith(
				"Task \"Duplicate Task\" deleted!"
			);
		});
	});
});
