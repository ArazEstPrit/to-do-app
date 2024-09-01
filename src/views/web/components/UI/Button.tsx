import React from "react";

export function Button(props: {
	onClick: () => void;
	text: string;
	color: "normal" | "main" | "success" | "caution" | "danger" | "info";
	weight: "primary" | "secondary" | "link";
}) {
	if (
		props.weight === "link" &&
		["success", "caution", "danger", "info"].includes(props.color)
	) {
		return <Button {...props} weight="secondary" />;
	}
	return (
		<button
			className={props.color + " " + props.weight}
			onClick={props.onClick}
		>
			{props.text}
		</button>
	);
}
