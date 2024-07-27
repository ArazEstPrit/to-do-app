import { context } from "esbuild";
import { sassPlugin } from "esbuild-sass-plugin";
import { readFile, writeFile } from "../services/fileService.js";
import express from "express";
import { exec } from "child_process";
import { log } from "../views/consoleView.js";
import { resolve } from "path";
import { apiRouter } from "./serverController.js";

const srcPath = resolve(import.meta.dirname, "../../src/views/web/");
const distPath = resolve(import.meta.dirname, "../../dist/views/web/");
const PORT = 3000;

export async function buildSite() {
	const build = await context({
		entryPoints: [resolve(srcPath, "./main.tsx")],
		outdir: distPath,
		plugins: [sassPlugin()],
		bundle: true,
		platform: "browser",
		target: "chrome58",
		format: "esm",
	});

	await build.watch();

	writeFile(
		resolve(distPath, "./index.html"),
		readFile(resolve(srcPath, "./index.html"))
	);
}

export async function startWebView() {
	const app = express();
	app.use(express.static(distPath));
	app.use(express.json());
	app.use("/api", apiRouter);

	await new Promise<void>(resolve => {
		app.listen(PORT, () => {
			log(`Server started on http://localhost:${PORT}`);
			resolve();
		});
	});
}

export function openSite(port = PORT) {
	const openCommand = {
		win32: "start",
		linux: "xdg-open",
		darwin: "open",
	}[process.platform];

	exec(`${openCommand} http://localhost:${port}`);
}
