const Command = require("../src/commands/Command").default;
const consoleView = require("../src/views/consoleView");

describe("Command", () => {
	it("should run the action with the provided arguments", async () => {
		const actionSpy = jest.fn();
		const command = new Command("test", "", [], [], actionSpy);
		const args = { test: "value" };

		await command.run(args);

		expect(actionSpy).toHaveBeenCalledWith(args);
	});

	it("should prompt the user for missing arguments", async () => {
		const args = { test: "" };

		jest.spyOn(consoleView, "prompt").mockResolvedValue("value");

		const command = new Command(
			"test",
			"",
			[],
			[{ name: "test", optional: true }],
			() => { }
		);

		await command.run(args);

		expect(args).toEqual({ test: "value" });
		expect(consoleView.prompt).toHaveBeenCalledWith({
			name: "test",
			optional: true,
		});
	});

	it("should handle invalid arguments", async () => {
		const logErrorSpy = jest.spyOn(console, "error").mockImplementation();
		const args = { test: "invalid" };
		const command = new Command(
			"test",
			"",
			[],
			[{ name: "test", condition: (value) => value !== "invalid" || "Invalid argument" }],
			() => { }
		);

		await command.run(args);

		expect(logErrorSpy).toHaveBeenCalled();
	});
});
