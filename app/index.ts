import { createComponent, View, Text } from "../src/core";
import { renderComponent } from "../src/platform/browser";

const div = (props = {}) => View({ ...props, as: "div" });

const Component = createComponent(() => {
	return div({ name: "xxx" });
});

const App = createComponent(({ color }) => {
	return div({
		style: `color: ${color}`,
		onClick: () => {},
		children: [
			Text("Hello"),
			...Array(4)
				.fill(0)
				.map((_, idx) => Component()),
		],
	});
});

renderComponent(App({ color: "pink" }), document.getElementById("nixi-app"));
