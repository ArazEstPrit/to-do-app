import { TaskList } from "./components/TaskList.ts";
import { $, h } from "./utils.ts";

async function init() {
	const root = $("#root")[0];

	root.append(h("h2", {}, "Tasks"), await TaskList());
}

init();
