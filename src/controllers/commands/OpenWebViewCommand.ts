import { buildSite, openSite, startWebView } from "../webViewController.js";
import Command from "./Command.js";

export default new Command(
	"open",
	"Open the web view",
	["o", "w"],
	[],
	async () => {
		await buildSite();
		await startWebView();
		openSite();
	}
);
