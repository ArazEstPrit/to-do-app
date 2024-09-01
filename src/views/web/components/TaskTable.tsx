import Task from "../../../models/task.ts";
import { useFetch } from "../utils/useFetch.ts";
import Table from "./UI/Table.tsx";
import React, { useEffect, useState } from "react";

export function TaskTable() {
	const [tasks, setTasks] = useState<Task[]>([]);

	useEffect(() => {
		useFetch("/api/tasks").then(fetchedTasks => setTasks(fetchedTasks));
	}, []);

	if (tasks.length === 0) {
		return <p>No tasks found</p>;
	}

	const formattedTasks = tasks.map(task => ({
		...task,
		tags: task.tags.join(", ") || "no tags",
		dueDate: new Date(task.dueDate!).toLocaleDateString(),
	}));

	return (
		<Table
			data={formattedTasks}
			headers={[
				"id",
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
