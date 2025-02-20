import Task from "../../../models/task";

interface endpoints {
	"/api/tasks": Task[];
}

export async function fetchJSON<endpoint extends keyof endpoints>(
	url: string
): Promise<endpoints[endpoint]> {
	const response = await fetch(url);

	return await response.json();
}
