import { createComponent } from "../src/core/component";
import { View, Text } from "../src/core/vdom";
import { renderComponent } from "../src/platform/browser";

const div = (props = {}) => View({ ...props, as: "div" });
const button = (props = {}) => View({ ...props, as: "button" });

const list = [...Array(10).fill(0)];

const Component = createComponent(({ text }) => {
	return div({
		children: [
			button({
				onClick: () => {
					list.pop();

					console.log("text: ", text);

					renderComponent(
						App({ isOpen: true, count: text, list }),
						document.getElementById("nixi-app")
					);
				},
				children: [Text(text)],
			}),
		],
	});
});

const App = createComponent(({ isOpen, list, count = 0 }) => {
	const renderList = () => [...list.map((_, idx) => Component({ text: idx }))];

	return [
		Text(`current: ${count}`),
		button({
			style: "color: red",
			onClick: () => {
				console.log("click");

				renderComponent(
					App({ isOpen: true, count: "text", list }),
					document.getElementById("nixi-app")
				);
			},
			children: [Text["click me"]],
		}),
		renderList(),
	];
});

renderComponent(
	App({ isOpen: true, list }),
	document.getElementById("nixi-app")
);
