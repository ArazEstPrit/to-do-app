import TaskList from "./components/TaskList.ts";
import { $, h } from "./utils/domHelpers.ts";
import { fetchJSON } from "./utils/fetch.ts";

async function init() {
	const root = $("#root")[0];

	root.append(
		h("h3", {}, "Tasks"),
		new TaskList({ tasks: await fetchJSON("/api/tasks") }).getElement()
	);
}

init();
