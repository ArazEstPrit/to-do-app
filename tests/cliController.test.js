const CliController = require("../src/controllers/cliController").default;

describe("CliController", () => {
	beforeEach(() => {
		jest.spyOn(console, "error").mockImplementation(() => { });
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	describe("run", () => {
		it("should run help if no command is provided", () => {
			const HelpCommandSpy = jest.spyOn(require("../src/views/consoleView"), "formatCommand");
			CliController.run([]);
			expect(HelpCommandSpy).toHaveBeenCalled();
		});

		it("should throw an error if the command is not found", () => {
			CliController.run(["invalid"]);

			expect(console.error).toHaveBeenCalled();
		});

		it("should run the command with the provided parameters", () => {
			const parameters = { test: "test" };
			const commandMock = {
				name: "test",
				aliases: ["test"],
				run: (params) => {
					expect(params).toEqual(parameters);
				},
			};
			CliController.commands = [commandMock];
			CliController.run(["command", "-test", "test"]);
		});
	});

	describe("parseCommandLineFlags", () => {
		it("should parse command line flags correctly", () => {
			const args = ["-test", "test", "-test2", "test2"];
			const expected = { test: "test", test2: "test2" };
			expect(CliController.parseCommandLineFlags(args)).toEqual(expected);
		});
	});

	describe("getCommand", () => {
		it("should return the command if it exists", () => {
			const command = { name: "test", aliases: ["test"] };
			CliController.commands = [command];
			expect(CliController.getCommand("test")).toEqual(command);
		});

		it("should return undefined if the command does not exist", () => {
			expect(CliController.getCommand("invalid")).toBeUndefined();
		});
	});
});
