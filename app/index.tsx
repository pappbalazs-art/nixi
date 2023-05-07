import { createComponent, h, Text, View } from "../src/core";
import { renderComponent } from "../src/platform/browser";

const div = (props = {}) => View({ ...props, as: "div" });
const button = (props = {}) => View({ ...props, as: "button" });
const input = (props = {}) => View({ ...props, as: "input", isVoid: true });

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

const Portal = createComponent(({ value = "" }) => {
	return [Text(`portal: ${value}`)];
});

const domElement = document.getElementById("nixi-app");
const domElement2 = document.getElementById("nixi-app2");

const Container = createComponent(({ children }) => {
	return <div style="color: red">{children}</div>;
});

const App = createComponent(({ value = "" }) => {
	const renderInput = () => {
		return (
			<input
				value={value}
				onInput={(e) =>
					renderComponent(App({ value: e.target.value }), domElement)
				}
			/>
		);
	};

	renderComponent(Portal({ value }), domElement2);

	return (
		<div>
			{renderInput()}
			<br />
			value: {value}
			<Container>{value === "red" && <Container>zzzz</Container>}</Container>
		</div>
	);
});

renderComponent(App(), domElement);
