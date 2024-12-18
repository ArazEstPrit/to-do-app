import { TaskList } from "./components/TaskList.ts";
import { $, h } from "./utils/domHelpers.ts";

async function init() {
	const root = $("#root")[0];

	root.append(h("h3", {}, "Tasks"), await TaskList());
}

init();
