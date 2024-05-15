import { dirname } from "path";
import { logError } from "../views/consoleView.js";

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";

/**
 * Read the contents of a file.
 * 
 * @param {string} filePath - The path to the file to be read.
 * @returns {string|null} The contents of the file, or null if the file does not exist or could not be read.
 */
export function readFile(filePath) {
	let data = null;

	// If the file exists, try to read it
	if (existsSync(filePath)) {
		try {
			// Read the file contents with utf-8 encoding
			data = readFileSync(filePath, "utf-8");
		} catch (err) {
			// If there was an error reading the file, log it
			logError(err);
		}
	}

	// Return the file contents, or null if the file does not exist or could not be read
	return data;
}

/**
 * Write data to a file, creating the directory if it does not exist.
 * 
 * @param {string} filePath - The path to the file to be written.
 * @param {string} data - The data to be written to the file.
 */
export function writeFile(filePath, data) {
	// Get the directory of the file path
	let dir = dirname(filePath);

	// If the directory does not exist, create it (recursively)
	if (!existsSync(dir)) {
		mkdirSync(dir, { recursive: true });
	}

	// Try to write the data to the file, catching and logging any errors
	try {
		writeFileSync(filePath, data);
	} catch (err) {
		logError(err);
	}
}
