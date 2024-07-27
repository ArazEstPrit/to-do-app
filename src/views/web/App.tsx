import React from "react";
import "./styles/main.scss";
import { Button } from "./components/Button.tsx";

export function App() {
	return (
		<>
			<h1>To-Do App</h1>
			<Button
				text="Hello World!"
				color="main"
				weight="primary"
				onClick={() => {}}
			/>
		</>
	);
}
