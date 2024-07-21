#!/usr/bin/env node

import { dirname, resolve } from "path";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";

const __dirname = import.meta.dirname;

export function readFile(path: string): string | null {
	path = resolve(__dirname, path);
	let contents: string | null = null;

	if (existsSync(path)) {
		try {
			contents = readFileSync(path, "utf-8");
		} catch {
			/* empty */
		}
	}

	return contents;
}

export function writeFile(filePath: string, data: string) {
	const resolvedPath = resolve(__dirname, filePath);
	const directory = dirname(resolvedPath);

	if (!existsSync(directory)) {
		mkdirSync(directory, { recursive: true });
	}

	writeFileSync(resolvedPath, data);
}
