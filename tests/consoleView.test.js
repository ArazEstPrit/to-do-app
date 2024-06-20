const { prompt } = require("../src/views/consoleView");
const stdin = require("mock-stdin").stdin();

describe("promptForProperty", () => {
	function write(msg) {
		process.nextTick(() => {
			stdin.send(msg + "\r");
		});
	}

	it("should return the user input when no condition is provided", async () => {
		write("test input");

		let result = await prompt({ name: "Test Label" });

		expect(result).toBe("test input");
	});

	it("should return the user input trimmed", async () => {
		write(" test input ");
		let result = await prompt({ name: "Test Label" });
		expect(result).toBe("test input");
	});

	it("should return the user input when it's empty and no condition is provided", async () => {
		write("");
		let result = await prompt({ name: "Test Label" });
		expect(result).toBe("");
	});

	it("should re-prompt when the input doesn't meet the condition", async () => {
		write("test input");
		setTimeout(() => {
			write("test input again");
		}, 1);
		let result = await prompt({
			name: "Test Label",
			condition: input => input.length > 10
		});

		expect(result).toBe("test input again");
	});

	it("should return the user input when it meets the condition", async () => {
		write("test input");

		let result = await prompt({
			name: "Test Label",
			condition: input => input.length > 5
		});

		expect(result).toBe("test input");
	});
});