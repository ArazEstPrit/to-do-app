import Task from "../../../models/task.ts";
import { useFetch } from "../utils/useFetch.ts";
import React, { useEffect, useState } from "react";
import { DATE_FORMAT } from "../../console/formatting.js";

export function TaskList() {
	const [tasks, setTasks] = useState<Task[]>([]);

	useEffect(() => {
		useFetch("/api/tasks").then(fetchedTasks => setTasks(fetchedTasks));
	}, []);

	if (tasks.length === 0) {
		return <p>No tasks found</p>;
	}

	return (
		<div className="task-list">
			{tasks
				.filter(task => !task.completed)
				.map(task => (
					<TaskItem key={task.id} task={task} />
				))}
		</div>
	);
}

function TaskItem({ task }: { task: Task }) {
	return (
		<div className="item">
			<div className="id">{`#${task.id}`}</div>
			<div className="name-description">
				<div className="name">{task.name}</div>
				<DescriptionButton />
			</div>
			<div className="due-date">
				{task.dueDate &&
					new Date(task.dueDate).toLocaleDateString(
						undefined,
						DATE_FORMAT
					)}
			</div>
			<div className="mini-score">
				<div className="effort">{task.effort}</div>:
				<div className="importance">{task.importance}</div>-
				<div className="score">{task.priorityScore}</div>
			</div>
		</div>
	);
}

function DescriptionButton() {
	return (
		<div className="description-button">
			<div className="dot"></div>
			<div className="dot"></div>
			<div className="dot"></div>
		</div>
	);
}
