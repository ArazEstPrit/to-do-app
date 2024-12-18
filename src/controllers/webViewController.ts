import { context } from "esbuild";
import { sassPlugin } from "esbuild-sass-plugin";
import express from "express";
import { exec } from "child_process";
import { log } from "../views/console/logging.js";
import { resolve } from "path";
import { apiRouter } from "./serverController.js";
import { copyFileSync, cpSync } from "fs";

const srcPath = resolve(import.meta.dirname, "../../src/views/web/");
const distPath = resolve(import.meta.dirname, "../../dist/views/web/");
const PORT = 3000;

const staticAssets = ["./index.html", "./assets/"];

export async function buildSite() {
	const build = await context({
		entryPoints: [
			resolve(srcPath, "./main.ts"),
			resolve(srcPath, "./styles/main.scss"),
		],
		outdir: distPath,
		plugins: [sassPlugin()],
		bundle: true,
		platform: "browser",
		target: "chrome58",
		format: "esm",
	});

	await build.watch();

	staticAssets.forEach(file => {
		const isDir = file.endsWith("/");

		if (isDir) {
			cpSync(resolve(srcPath, file), resolve(distPath, file), {
				recursive: true,
			});
		} else {
			copyFileSync(resolve(srcPath, file), resolve(distPath, file));
		}
	});
}

export async function startWebView() {
	const app = express();
	app.use(express.static(distPath));
	app.use(express.json());
	app.use("/api", apiRouter);

	process.on("SIGINT", () => {
		process.exit();
	});

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
