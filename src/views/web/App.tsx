import React from "react";
import "./styles/main.scss";
import { TaskList } from "./components/TaskList.tsx";

export function App() {
	return (
		<>
			<h2>Tasks</h2>
			<TaskList />
		</>
	);
}
