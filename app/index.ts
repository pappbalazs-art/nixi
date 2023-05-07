import { createComponent } from "../src/core/component";
import { View, Text } from "../src/core/vdom";
import { renderComponent } from "../src/platform/browser";

const div = (props = {}) => View({ ...props, as: "div" });
const button = (props = {}) => View({ ...props, as: "button" });

const Component = createComponent(({ text }) => {
	return div({
		children: [
			button({
				onClick: () => {
					console.log(text);

					renderComponent(
						App({ isOpen: true, count: text }),
						document.getElementById("nixi-app")
					);
				},
				children: [Text(text)],
			}),
		],
	});
});

const App = createComponent(({ isOpen, count = 0 }) => {
	const renderList = () => [
		...Array(1000)
			.fill(0)
			.map((_, idx) => Component({ text: idx })),
	];

	return [Text(`current: ${count}`), renderList()];
});

renderComponent(App({ isOpen: true }), document.getElementById("nixi-app"));
