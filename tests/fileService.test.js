const { existsSync, rmSync } = require("fs");
const { writeFile, readFile } = require("../src/services/fileService");
const { resolve } = require("path");

describe("fileService", () => {
	describe("writeFile", () => {
		it("should create the directory if it does not exist", () => {
			let filePath = resolve("./test/newDir/newFile.txt");

			writeFile(filePath, "");

			expect(existsSync("test/newDir")).toBe(true);
		});

		it("should write the data to the file, and read the data", () => {
			let filePath = resolve("./test/newFile.txt");
			let data = "Hello, world!";

			writeFile(filePath, data);

			let actualContents = readFile(filePath);

			expect(actualContents).toBe(data);
		});
	});

	describe("readFile", () => {
		it("should return null if the file does not exist", () => {
			let filePath = resolve("./test/doesNotExist.txt");

			let actualContents = readFile(filePath);

			expect(actualContents).toBeNull();
		});
	});

	afterEach(() => {
		rmSync("./test", { recursive: true, force: true });
	});
});
