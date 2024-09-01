import React from "react";
import "./styles/main.scss";
import { TaskTable } from "./components/TaskTable.tsx";

export function App() {
	return (
		<>
			<h2>Tasks</h2>
			<TaskTable />
		</>
	);
}
