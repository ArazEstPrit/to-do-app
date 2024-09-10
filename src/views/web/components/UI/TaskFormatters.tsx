import React from "react";
import Task from "../../../../models/task.ts";

export const taskFormatters: {
	[K in keyof Task]: (value: Task[K]) => JSX.Element;
} = {
	name: TaskName,
	id: TaskId,
	description: TaskDescription,
	tags: TaskTags,
	dueDate: TaskDueDate,
	effort: TaskEffort,
	importance: TaskImportance,
	priorityScore: TaskPriorityScore,
};

function TaskName(name: string) {
	return <span className="name">{name}</span>;
}

function TaskId(id: number) {
	return <span className="id">#{id}</span>;
}

function TaskDescription(description: string) {
	return <span className="description">{description}</span>;
}

function TaskTags(tags: string[]) {
	const hasTags = tags.length > 0;

	if (hasTags) {
		return (
			<span className="tags">
				&#91;
				{tags.map(tag => (
					<span key={tag}>{tag}</span>
				))}
				&#93;
			</span>
		);
	} else {
		return <span className="tags noTags">no tags</span>;
	}
}

function TaskDueDate(dueDate: Date | null) {
	return (
		<span className={"dueDate" + (dueDate ? "" : " noDueDate")}>
			{dueDate ? new Date(dueDate).toLocaleDateString() : "no due date"}
		</span>
	);
}

function TaskEffort(effort: number) {
	return <span className="effort">{effort}</span>;
}

function TaskImportance(importance: number) {
	return <span className="importance">{importance}</span>;
}

function TaskPriorityScore(priorityScore: number) {
	return <span className="priorityScore">{priorityScore}</span>;
}
