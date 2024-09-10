import Task from "../../../models/task.ts";
import { useFetch } from "../utils/useFetch.ts";
import Table from "./UI/Table.tsx";
import { taskFormatters } from "./UI/TaskFormatters.tsx";
import React, { useEffect, useState } from "react";

export function TaskTable() {
	const [tasks, setTasks] = useState<Task[]>([]);

	useEffect(() => {
		useFetch("/api/tasks").then(fetchedTasks => setTasks(fetchedTasks));
	}, []);

	if (tasks.length === 0) {
		return <p>No tasks found</p>;
	}

	return (
		<Table
			data={tasks}
			renderers={taskFormatters}
			headers={[
				"id",
				"name",
				"dueDate",
				"description",
				"tags",
				"effort",
				"importance",
				"priorityScore",
			]}
		/>
	);
}
